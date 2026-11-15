import React, { useEffect, useRef, useState, useReducer, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { gymService } from '../../services/gymService';

// check if we're in a context that allows camera access
const isSecureCameraContext = () => {
  const host = window.location.hostname;
  const isLocalhost = host === 'localhost' || host === '127.0.0.1' || host === '::1';
  return window.location.protocol === 'https:' || isLocalhost;
};

// skeleton connections for drawing pose overlay
const POSE_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 7], [0, 4], [4, 5],
  [5, 6], [6, 8], [9, 10], [11, 12], [11, 13],
  [13, 15], [15, 17], [15, 19], [15, 21], [17, 19],
  [12, 14], [14, 16], [16, 18], [16, 20], [16, 22],
  [18, 20], [11, 23], [12, 24], [23, 24], [23, 25],
  [24, 26], [25, 27], [26, 28], [27, 29], [28, 30],
  [29, 31], [30, 32], [27, 31], [28, 32]
];

const drawSkeleton = (ctx, landmarks, width, height) => {
  ctx.clearRect(0, 0, width, height);
  if (!landmarks) return;

  ctx.lineWidth = 3;
  ctx.strokeStyle = '#00E575';
  ctx.fillStyle = '#FFFFFF';

  // draw lines between joints
  POSE_CONNECTIONS.forEach(([i, j]) => {
    const p1 = landmarks[i];
    const p2 = landmarks[j];
    if (p1 && p2 && p1.v > 0.4 && p2.v > 0.4) {
      ctx.beginPath();
      ctx.moveTo(p1.x * width, p1.y * height);
      ctx.lineTo(p2.x * width, p2.y * height);
      ctx.stroke();
    }
  });

  // draw joint dots
  landmarks.forEach((p) => {
    if (p && p.v > 0.4) {
      ctx.beginPath();
      ctx.arc(p.x * width, p.y * height, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#00E575';
      ctx.stroke();
    }
  });
};

// batches all analysis state into one update instead of 6 separate setStates
const initialAnalysis = {
  reps: 0,
  stage: 'idle',
  feedback: 'Stand in frame to begin',
  confidence: 0,
  postureCorrect: true,
  processingMs: 0,
};

function analysisReducer(state, action) {
  switch (action.type) {
    case 'UPDATE':
      return {
        reps: action.payload.reps ?? state.reps,
        stage: action.payload.stage ?? state.stage,
        feedback: action.payload.feedback ?? state.feedback,
        confidence: Math.round((action.payload.confidence ?? 0) * 100),
        postureCorrect: Boolean(action.payload.posture_correct),
        processingMs: action.payload.processing_ms ?? state.processingMs,
      };
    case 'RESET':
      return { ...initialAnalysis, feedback: action.payload?.feedback || initialAnalysis.feedback };
    default:
      return state;
  }
}

const AiCamera = () => {
  const location = useLocation();
  const [selectedExercise, setSelectedExercise] = useState(location.state?.exercise || 'Squat');
  const [isRunning, setIsRunning] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [exerciseOptions, setExerciseOptions] = useState([
    'Squat', 'Bicep Curl', 'Push-Up', 'Shoulder Press',
  ]);
  const [analysisError, setAnalysisError] = useState(null);
  const [analysis, dispatch] = useReducer(analysisReducer, initialAnalysis);

  const videoRef = useRef(null);
  const captureCanvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const streamRef = useRef(null);
  const sessionIdRef = useRef('session-default');
  const analyzeLockRef = useRef(false);
  const startLockRef = useRef(false);
  const activeExerciseRef = useRef(selectedExercise);
  const landmarksRef = useRef(null); // latest landmarks for rAF drawing
  const rafIdRef = useRef(null);

  const releaseCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const srcObj = videoRef.current.srcObject;
      if (srcObj.getTracks) {
        srcObj.getTracks().forEach((track) => track.stop());
      }
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    activeExerciseRef.current = selectedExercise;
  }, [selectedExercise]);

  // load exercise list from backend
  useEffect(() => {
    const loadExercises = async () => {
      try {
        const exercises = await gymService.listExercises();
        const labels = exercises.map((e) => e.value).filter(Boolean);
        if (labels.length) {
          setExerciseOptions(labels);
          if (!location.state?.exercise && !labels.includes(selectedExercise)) {
            setSelectedExercise(labels[0]);
          }
        }
      } catch (err) {
        console.warn('Could not load exercise list from backend', err);
      }
    };
    loadExercises();
  }, []);

  // skeleton rendering loop (decoupled from inference for smooth visuals)
  useEffect(() => {
    if (!isRunning || !isCameraReady) {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      return;
    }

    const renderLoop = () => {
      const overlay = overlayCanvasRef.current;
      const videoEl = videoRef.current;
      if (overlay && videoEl && videoEl.videoWidth) {
        overlay.width = videoEl.videoWidth;
        overlay.height = videoEl.videoHeight;
        const ctx = overlay.getContext('2d');
        if (ctx) drawSkeleton(ctx, landmarksRef.current, overlay.width, overlay.height);
      }
      rafIdRef.current = requestAnimationFrame(renderLoop);
    };

    rafIdRef.current = requestAnimationFrame(renderLoop);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isRunning, isCameraReady]);

  const startCamera = async () => {
    if (startLockRef.current) return;
    startLockRef.current = true;

    if (!navigator.mediaDevices?.getUserMedia) {
      setAnalysisError('Camera is not supported in this browser. Use a modern Chrome, Edge, or Safari version.');
      startLockRef.current = false;
      return;
    }

    if (!isSecureCameraContext()) {
      setAnalysisError('Camera access requires HTTPS or localhost context for browser security.');
      startLockRef.current = false;
      return;
    }

    try {
      sessionIdRef.current = `session-${Date.now()}`;
      setIsRunning(true);
      setIsCameraReady(false);
      dispatch({ type: 'RESET', payload: { feedback: 'Initializing video stream...' } });
      setAnalysisError(null);
      landmarksRef.current = null;

      releaseCameraStream();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });

      streamRef.current = stream;

      await new Promise((resolve) => requestAnimationFrame(resolve));
      const videoEl = videoRef.current;
      if (!videoEl) throw new Error('Video element was not mounted');

      videoEl.srcObject = stream;
      videoEl.muted = true;
      videoEl.playsInline = true;
      await videoEl.play();

      setIsCameraReady(true);
      dispatch({ type: 'RESET', payload: { feedback: 'Camera ready. Step back to show full body.' } });
    } catch (err) {
      const errName = err?.name || err?.message || 'Unknown error';
      setAnalysisError(`Could not access camera (${errName}). Please ensure camera permissions are granted.`);
      setIsRunning(false);
      setIsCameraReady(false);
      releaseCameraStream();
    } finally {
      startLockRef.current = false;
    }
  };

  // frame analysis loop with adaptive throttling
  useEffect(() => {
    if (!isRunning || !isCameraReady) return undefined;

    const BASE_INTERVAL = 0;    // fetch as fast as network allows
    const SLOW_INTERVAL = 100;  // minimal fallback
    let currentInterval = BASE_INTERVAL;
    let timeoutId = null;

    const analyzeNextFrame = async () => {
      if (!analyzeLockRef.current) {
        const videoEl = videoRef.current;
        const canvas = captureCanvasRef.current;

        if (videoEl && canvas && videoEl.readyState >= 2 && videoEl.videoWidth && videoEl.videoHeight) {
          analyzeLockRef.current = true;
          try {
            const MAX_WIDTH = 240;
            const scale = MAX_WIDTH / videoEl.videoWidth;
            canvas.width = MAX_WIDTH;
            canvas.height = videoEl.videoHeight * scale;

            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
              const imageSrc = canvas.toDataURL('image/jpeg', 0.3);
              if (imageSrc) {
                const frameB64 = imageSrc.split(',')[1];
                const result = await gymService.analyzeFrame(
                  sessionIdRef.current,
                  activeExerciseRef.current,
                  frameB64
                );

                // update landmarks
                landmarksRef.current = result.landmarks || null;

                // single dispatch instead of 6 separate setStates
                dispatch({ type: 'UPDATE', payload: result });

                // slow down if backend is struggling
                currentInterval = (result.processing_ms > 150) ? SLOW_INTERVAL : BASE_INTERVAL;
              }
            }
          } catch (err) {
            setAnalysisError(err.message || 'Failed to analyze camera frame.');
          } finally {
            analyzeLockRef.current = false;
          }
        }
      }

      timeoutId = setTimeout(analyzeNextFrame, currentInterval);
    };

    timeoutId = setTimeout(analyzeNextFrame, currentInterval);
    return () => { if (timeoutId) clearTimeout(timeoutId); };
  }, [isRunning, isCameraReady]);

  const stopCamera = async () => {
    setIsRunning(false);
    setIsCameraReady(false);
    releaseCameraStream();
    landmarksRef.current = null;

    try {
      await gymService.resetSession(sessionIdRef.current);
    } catch (err) {
      console.warn('Failed to reset backend session', err);
    }

    if (analysis.reps > 0) {
      try {
        await gymService.saveWorkout(activeExerciseRef.current, analysis.reps, analysis.confidence, 60);
        dispatch({ type: 'RESET', payload: { feedback: `Workout logged! ${analysis.reps} reps completed.` } });
      } catch (err) {
        console.error("Failed to save workout:", err);
      }
    }
  };

  // cleanup on unmount
  useEffect(() => {
    return () => { releaseCameraStream(); };
  }, [releaseCameraStream]);

  return (
    <div style={{ width: '100%', animation: 'fadeIn 250ms var(--ease-out)' }}>
      <header style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isRunning ? 'var(--brand-primary)' : 'var(--text-muted)' }}></span>
          <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: isRunning ? 'var(--brand-primary)' : 'var(--text-muted)' }}>
            {isRunning ? 'Real-time Tracking Active' : 'Sensor Ready'}
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          AI <span style={{ color: 'var(--brand-primary)' }}>Vision Coach</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Sub-millimeter joint tracking with instant audio-visual kinematic form feedback.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 items-stretch w-full">
        {/* Camera Viewport Canvas */}
        <div
          className="flex-1 w-full relative overflow-hidden min-h-[50vh] lg:min-h-[580px]"
          style={{
            background: '#040506',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {isRunning ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)', position: 'absolute', inset: 0 }}
              />
              <canvas ref={captureCanvasRef} style={{ display: 'none' }} />
              <canvas
                ref={overlayCanvasRef}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                  objectFit: 'cover',
                  transform: 'scaleX(-1)',
                }}
              />

              {/* HUD: Exercise Info (Top Left) */}
              <div
                className="absolute top-4 left-4 camera-hud-badge"
                style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}
              >
                <span style={{ color: 'var(--text-muted)', fontSize: '10px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Target Protocol
                </span>
                <span style={{ color: 'var(--text-primary)', fontSize: '16px', fontWeight: '800', letterSpacing: '-0.01em' }}>
                  {selectedExercise}
                </span>
              </div>

              {/* HUD: Rep Counter (Top Right) */}
              <div
                className="absolute top-4 right-4 camera-hud-badge"
                style={{ textAlign: 'center', minWidth: '84px', padding: '8px 16px' }}
              >
                <span style={{ color: 'var(--text-muted)', fontSize: '10px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Reps
                </span>
                <div style={{ color: 'var(--brand-primary)', fontSize: '36px', fontWeight: '900', lineHeight: 1 }}>
                  {analysis.reps}
                </div>
              </div>

              {/* HUD: Real-time Feedback Pill (Bottom Center) */}
              <div
                className="absolute bottom-6 left-1/2 -translate-x-1/2 camera-hud-badge"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-pill)',
                  border: analysis.postureCorrect ? '1px solid var(--brand-primary-border)' : '1px solid rgba(251, 191, 36, 0.4)',
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: '18px',
                    color: analysis.postureCorrect ? 'var(--brand-primary)' : 'var(--color-carbs)',
                  }}
                >
                  {analysis.postureCorrect ? 'check_circle' : 'warning'}
                </span>
                <span style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: '600' }}>
                  {analysis.feedback}
                </span>
              </div>

              {/* HUD: Telemetry (Bottom Left) */}
              <div
                className="absolute bottom-6 left-4 camera-hud-badge hidden sm:flex flex-col gap-1"
                style={{ fontSize: '11px', color: 'var(--text-secondary)' }}
              >
                <div>Confidence: <strong style={{ color: 'var(--text-primary)' }}>{analysis.confidence}%</strong></div>
                <div>Posture: <strong style={{ color: analysis.postureCorrect ? 'var(--brand-primary)' : 'var(--color-carbs)' }}>{analysis.postureCorrect ? 'Correct' : 'Needs Fix'}</strong></div>
                <div>Latency: <strong style={{ color: 'var(--text-primary)' }}>{analysis.processingMs} ms</strong></div>
              </div>
            </>
          ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', textAlign: 'center' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'var(--bg-surface-2)',
                  border: '1px solid var(--border-default)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  color: 'var(--text-muted)',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>videocam</span>
              </div>
              <h2 style={{ color: 'var(--text-primary)', fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                Camera Inactive
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '380px', lineHeight: 1.5, marginBottom: '24px' }}>
                Select your target exercise and start camera tracking to activate computer vision pose analysis.
              </p>
              <button onClick={startCamera} className="btn-primary" style={{ padding: '12px 28px', fontSize: '14px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>play_circle</span>
                Start Camera
              </button>
            </div>
          )}
        </div>

        {/* Controls Sidebar */}
        <div className="flex flex-col gap-4 w-full lg:w-[320px] shrink-0">
          <div className="preferences-card" style={{ padding: '22px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '14px', letterSpacing: '-0.01em' }}>
              Exercise Protocol
            </h2>
            <label className="form-label">Active Movement</label>
            <select
              className="form-input"
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
              disabled={isRunning}
              style={{ cursor: isRunning ? 'not-allowed' : 'pointer' }}
            >
              {exerciseOptions.map((exercise) => (
                <option key={exercise} value={exercise}>{exercise}</option>
              ))}
            </select>
          </div>

          <div className="preferences-card" style={{ padding: '22px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '14px', letterSpacing: '-0.01em' }}>
              Session Controller
            </h2>
            {!isRunning ? (
              <button
                onClick={startCamera}
                className="btn-primary"
                style={{ width: '100%', padding: '13px', fontSize: '14px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>play_circle</span>
                Start Session
              </button>
            ) : (
              <button
                onClick={stopCamera}
                style={{
                  width: '100%',
                  padding: '13px',
                  fontSize: '14px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  color: '#EF4444',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background-color 150ms var(--ease-out)',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>stop_circle</span>
                Stop & Log Workout
              </button>
            )}
          </div>

          {isRunning && (
            <div className="preferences-card" style={{ padding: '20px', background: 'var(--bg-surface-2)' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                Movement Phase
              </div>
              <div style={{ color: 'var(--brand-primary)', fontSize: '20px', fontWeight: '800', letterSpacing: '0.02em' }}>
                {analysis.stage.toUpperCase()}
              </div>
            </div>
          )}

          {analysisError && (
            <div className="preferences-card" style={{ padding: '16px', background: 'var(--color-error-bg)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--color-error)', fontSize: '13px', lineHeight: 1.5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', fontWeight: '700' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
                Analysis Error
              </div>
              {analysisError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiCamera;
