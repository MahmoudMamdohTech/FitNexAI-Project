import React, { useEffect, useRef, useState, useReducer, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { gymService } from '../../services/gymService';
import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

// Check if we're in a context that allows camera access
const isSecureCameraContext = () => {
  const host = window.location.hostname;
  const isLocalhost = host === 'localhost' || host === '127.0.0.1' || host === '::1';
  return window.location.protocol === 'https:' || isLocalhost;
};

// Skeleton connections for drawing pose overlay
const POSE_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 7], [0, 4], [4, 5],
  [5, 6], [6, 8], [9, 10], [11, 12], [11, 13],
  [13, 15], [15, 17], [15, 19], [15, 21], [17, 19],
  [12, 14], [14, 16], [16, 18], [16, 20], [16, 22],
  [18, 20], [11, 23], [12, 24], [23, 24], [23, 25],
  [24, 26], [25, 27], [26, 28], [27, 29], [28, 30],
  [29, 31], [30, 32], [27, 31], [28, 32]
];

// Landmark indices
const LM = {
  NOSE: 0,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
};

// Exercise guidance and coaching cues
const EXERCISE_GUIDES = {
  Squat: {
    muscles: 'Quadriceps, Hamstrings, Glutes',
    keyJoint: 'Knee Flexion',
    minAngle: 90,
    maxAngle: 170,
    tips: [
      'Keep chest elevated and spine neutral throughout.',
      'Descend until thighs are parallel to the floor (< 100°).',
      'Drive upward through the midfoot on the ascent.'
    ]
  },
  'Bicep Curl': {
    muscles: 'Biceps Brachii, Brachialis',
    keyJoint: 'Elbow Flexion',
    minAngle: 50,
    maxAngle: 160,
    tips: [
      'Pin elbows firmly to your ribcage with no forward swing.',
      'Curl upward until full contraction (< 60°).',
      'Control the eccentric lowering phase smoothly.'
    ]
  },
  'Push-Up': {
    muscles: 'Pectorals, Triceps, Anterior Deltoid',
    keyJoint: 'Elbow Angle',
    minAngle: 85,
    maxAngle: 165,
    tips: [
      'Maintain an unbroken rigid plank line from heels to head.',
      'Lower chest until elbows reach 90 degrees or below.',
      'Push up until arms are fully extended at the top.'
    ]
  },
  'Shoulder Press': {
    muscles: 'Deltoids, Triceps, Upper Trapezius',
    keyJoint: 'Arm Extension',
    minAngle: 85,
    maxAngle: 170,
    tips: [
      'Start with dumbbells at chin height and elbows flared.',
      'Press directly overhead to full lockout (> 155°).',
      'Avoid hyperextending or arching your lower back.'
    ]
  }
};

// 3-point angle calculation
const calculateAngle = (a, b, c) => {
  if (!a || !b || !c) return 0;
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) angle = 360.0 - angle;
  return Math.round(angle);
};

// Canvas skeleton rendering with glowing joints and angle label
const drawSkeleton = (ctx, landmarks, width, height, currentAngle, primaryJoint) => {
  ctx.clearRect(0, 0, width, height);
  if (!landmarks || landmarks.length === 0) return;

  ctx.lineWidth = 3;
  ctx.strokeStyle = '#00E575';
  ctx.fillStyle = '#FFFFFF';

  // Draw lines between connected joints
  POSE_CONNECTIONS.forEach(([i, j]) => {
    const p1 = landmarks[i];
    const p2 = landmarks[j];
    const v1 = p1?.visibility ?? p1?.v ?? 1;
    const v2 = p2?.visibility ?? p2?.v ?? 1;
    if (p1 && p2 && v1 > 0.35 && v2 > 0.35) {
      ctx.beginPath();
      ctx.moveTo(p1.x * width, p1.y * height);
      ctx.lineTo(p2.x * width, p2.y * height);
      ctx.stroke();
    }
  });

  // Draw glowing joint dots
  landmarks.forEach((p, idx) => {
    const v = p?.visibility ?? p?.v ?? 1;
    if (p && v > 0.35) {
      ctx.beginPath();
      ctx.arc(p.x * width, p.y * height, 4.5, 0, 2 * Math.PI);
      ctx.fillStyle = idx === primaryJoint ? '#00E575' : '#FFFFFF';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#00E575';
      ctx.stroke();
    }
  });

  // Render live angle badge directly near the active joint
  if (primaryJoint && landmarks[primaryJoint] && currentAngle > 0) {
    const pj = landmarks[primaryJoint];
    const x = pj.x * width + 14;
    const y = pj.y * height - 8;

    ctx.save();
    ctx.scale(-1, 1); // Counter-mirror text so numbers are not flipped
    ctx.fillStyle = 'rgba(9, 10, 12, 0.85)';
    ctx.strokeStyle = '#00E575';
    ctx.lineWidth = 1;
    
    const text = `${currentAngle}°`;
    ctx.font = 'bold 12px monospace';
    const textWidth = ctx.measureText(text).width;
    
    // Position inverted because of mirror
    const textX = -x - textWidth - 8;
    ctx.fillRect(textX, y - 12, textWidth + 12, 18);
    ctx.strokeRect(textX, y - 12, textWidth + 12, 18);

    ctx.fillStyle = '#00E575';
    ctx.fillText(text, textX + 6, y + 2);
    ctx.restore();
  }
};

const initialAnalysis = {
  reps: 0,
  stage: 'idle',
  feedback: 'Stand in frame to begin',
  confidence: 0,
  postureCorrect: true,
  angle: 0,
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
        angle: action.payload.angle ?? state.angle,
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
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [cameraAspectRatio, setCameraAspectRatio] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);
  const [analysis, dispatch] = useReducer(analysisReducer, initialAnalysis);

  const videoRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const streamRef = useRef(null);
  const poseLandmarkerRef = useRef(null);
  const rafIdRef = useRef(null);
  const repsRef = useRef(0);
  const stageRef = useRef('idle');
  const lastRepTimeRef = useRef(0);

  const currentGuide = EXERCISE_GUIDES[selectedExercise] || EXERCISE_GUIDES.Squat;

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

  // Initialize MediaPipe Pose Landmarker with GPU fallback to CPU
  const initPoseLandmarker = async () => {
    if (poseLandmarkerRef.current) return poseLandmarkerRef.current;
    
    setIsLoadingModel(true);
    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      // Attempt GPU delegate first, fallback to CPU if unsupported
      let landmarker = null;
      try {
        landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numPoses: 1,
        });
      } catch (gpuError) {
        console.warn('GPU delegate failed, falling back to CPU:', gpuError);
        landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task',
            delegate: 'CPU',
          },
          runningMode: 'VIDEO',
          numPoses: 1,
        });
      }

      poseLandmarkerRef.current = landmarker;
      return landmarker;
    } catch (e) {
      console.warn('Could not load Google MediaPipe Wasm. Graceful fallback active.', e);
      return null;
    } finally {
      setIsLoadingModel(false);
    }
  };

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setAnalysisError('Camera is not supported in this browser. Please use a modern browser.');
      return;
    }

    if (!isSecureCameraContext()) {
      setAnalysisError('Camera access requires HTTPS or localhost context for browser security.');
      return;
    }

    try {
      setIsRunning(true);
      setIsCameraReady(false);
      setAnalysisError(null);
      dispatch({ type: 'RESET', payload: { feedback: 'Initializing AI Vision Model...' } });

      repsRef.current = 0;
      stageRef.current = 'idle';

      // Load client-side MediaPipe model
      await initPoseLandmarker();

      releaseCameraStream();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      streamRef.current = stream;

      await new Promise((resolve) => requestAnimationFrame(resolve));
      const videoEl = videoRef.current;
      if (!videoEl) throw new Error('Video element not mounted');

      videoEl.srcObject = stream;
      videoEl.muted = true;
      videoEl.playsInline = true;

      const updateRatio = () => {
        if (videoEl.videoWidth && videoEl.videoHeight) {
          setCameraAspectRatio(`${videoEl.videoWidth} / ${videoEl.videoHeight}`);
        }
      };
      videoEl.onloadedmetadata = updateRatio;

      await videoEl.play();
      updateRatio();

      setIsCameraReady(true);
      dispatch({ type: 'RESET', payload: { feedback: 'Camera active. Step back to show full body.' } });
    } catch (err) {
      const errName = err?.name || err?.message || 'Unknown error';
      setAnalysisError(`Could not access camera (${errName}). Please ensure camera permissions are granted.`);
      setIsRunning(false);
      setIsCameraReady(false);
      releaseCameraStream();
    }
  };

  // Biomechanics Kinematic Evaluation State Machine
  const evaluateExercise = (landmarks, exercise) => {
    let angle = 0;
    let postureCorrect = true;
    let feedback = 'Good form';
    let primaryJoint = LM.LEFT_KNEE;

    const now = Date.now();

    if (exercise === 'Squat') {
      primaryJoint = LM.LEFT_KNEE;
      const leftKnee = calculateAngle(landmarks[LM.LEFT_HIP], landmarks[LM.LEFT_KNEE], landmarks[LM.LEFT_ANKLE]);
      const rightKnee = calculateAngle(landmarks[LM.RIGHT_HIP], landmarks[LM.RIGHT_KNEE], landmarks[LM.RIGHT_ANKLE]);
      angle = Math.round((leftKnee + rightKnee) / 2) || leftKnee || rightKnee || 170;

      if (angle > 155) {
        if (stageRef.current === 'down') {
          if (now - lastRepTimeRef.current > 350) {
            repsRef.current += 1;
            lastRepTimeRef.current = now;
          }
        }
        stageRef.current = 'up';
        feedback = 'Squat down smoothly';
        postureCorrect = true;
      } else if (angle < 100) {
        stageRef.current = 'down';
        feedback = 'Great depth! Drive upward';
        postureCorrect = true;
      } else {
        feedback = stageRef.current === 'up' ? 'Go lower into squat' : 'Drive up through heels';
        postureCorrect = angle < 140;
      }
    } else if (exercise === 'Bicep Curl') {
      primaryJoint = LM.LEFT_ELBOW;
      const leftElbow = calculateAngle(landmarks[LM.LEFT_SHOULDER], landmarks[LM.LEFT_ELBOW], landmarks[LM.LEFT_WRIST]);
      const rightElbow = calculateAngle(landmarks[LM.RIGHT_SHOULDER], landmarks[LM.RIGHT_ELBOW], landmarks[LM.RIGHT_WRIST]);
      angle = Math.min(leftElbow, rightElbow) || 160;

      if (angle > 145) {
        stageRef.current = 'down';
        feedback = 'Curl weight upward';
        postureCorrect = true;
      } else if (angle < 60) {
        if (stageRef.current === 'down') {
          if (now - lastRepTimeRef.current > 350) {
            repsRef.current += 1;
            lastRepTimeRef.current = now;
          }
        }
        stageRef.current = 'up';
        feedback = 'Squeeze at peak, lower slowly';
        postureCorrect = true;
      } else {
        feedback = stageRef.current === 'down' ? 'Curl higher toward shoulders' : 'Lower with control';
        postureCorrect = true;
      }
    } else if (exercise === 'Push-Up') {
      primaryJoint = LM.LEFT_ELBOW;
      const leftElbow = calculateAngle(landmarks[LM.LEFT_SHOULDER], landmarks[LM.LEFT_ELBOW], landmarks[LM.LEFT_WRIST]);
      angle = leftElbow || 160;

      if (angle > 155) {
        if (stageRef.current === 'down') {
          if (now - lastRepTimeRef.current > 350) {
            repsRef.current += 1;
            lastRepTimeRef.current = now;
          }
        }
        stageRef.current = 'up';
        feedback = 'Lower chest to floor';
        postureCorrect = true;
      } else if (angle < 95) {
        stageRef.current = 'down';
        feedback = 'Push up firmly';
        postureCorrect = true;
      } else {
        feedback = 'Maintain rigid core';
        postureCorrect = true;
      }
    } else {
      // Shoulder Press
      primaryJoint = LM.LEFT_ELBOW;
      const leftElbow = calculateAngle(landmarks[LM.LEFT_SHOULDER], landmarks[LM.LEFT_ELBOW], landmarks[LM.LEFT_WRIST]);
      angle = leftElbow || 90;

      if (angle < 95) {
        stageRef.current = 'down';
        feedback = 'Press weights overhead';
        postureCorrect = true;
      } else if (angle > 155) {
        if (stageRef.current === 'down') {
          if (now - lastRepTimeRef.current > 350) {
            repsRef.current += 1;
            lastRepTimeRef.current = now;
          }
        }
        stageRef.current = 'up';
        feedback = 'Full extension! Lower with control';
        postureCorrect = true;
      } else {
        feedback = 'Press fully upward';
        postureCorrect = true;
      }
    }

    return { reps: repsRef.current, stage: stageRef.current, posture_correct: postureCorrect, feedback, angle, primaryJoint };
  };

  // Real-time inference & skeleton rendering loop
  useEffect(() => {
    if (!isRunning || !isCameraReady) {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      return;
    }

    let lastVideoTime = -1;

    const loop = () => {
      const videoEl = videoRef.current;
      const overlay = overlayCanvasRef.current;

      if (videoEl && overlay && videoEl.readyState >= 2 && videoEl.videoWidth > 0) {
        if (overlay.width !== videoEl.videoWidth || overlay.height !== videoEl.videoHeight) {
          overlay.width = videoEl.videoWidth;
          overlay.height = videoEl.videoHeight;
        }
        const ctx = overlay.getContext('2d');

        const startTime = performance.now();

        if (poseLandmarkerRef.current && videoEl.currentTime !== lastVideoTime) {
          lastVideoTime = videoEl.currentTime;
          try {
            const results = poseLandmarkerRef.current.detectForVideo(videoEl, startTime);
            if (results && results.landmarks && results.landmarks[0]) {
              const lm = results.landmarks[0];
              const analysisResult = evaluateExercise(lm, selectedExercise);
              const processingTime = Math.round(performance.now() - startTime);

              drawSkeleton(ctx, lm, overlay.width, overlay.height, analysisResult.angle, analysisResult.primaryJoint);

              dispatch({
                type: 'UPDATE',
                payload: {
                  ...analysisResult,
                  confidence: 0.96,
                  processing_ms: processingTime,
                },
              });
            } else {
              ctx.clearRect(0, 0, overlay.width, overlay.height);
              dispatch({
                type: 'UPDATE',
                payload: {
                  feedback: 'Step back to bring body into view',
                  confidence: 0.2,
                  processing_ms: 10,
                },
              });
            }
          } catch (e) {
            console.warn('Frame detection error:', e);
          }
        }
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isRunning, isCameraReady, selectedExercise]);

  const stopCamera = async () => {
    setIsRunning(false);
    setIsCameraReady(false);
    setCameraAspectRatio(null);
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    releaseCameraStream();

    const overlay = overlayCanvasRef.current;
    if (overlay) {
      const ctx = overlay.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, overlay.width, overlay.height);
    }

    if (analysis.reps > 0) {
      await gymService.saveWorkout(selectedExercise, analysis.reps, 95.0, 45);
    }

    dispatch({
      type: 'RESET',
      payload: { feedback: analysis.reps > 0 ? `Workout saved! ${analysis.reps} reps logged.` : 'Camera stopped.' },
    });
  };

  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      releaseCameraStream();
    };
  }, [releaseCameraStream]);

  // Calculate percentage fill for angle meter
  const anglePercent = Math.min(
    100,
    Math.max(
      0,
      Math.round(((analysis.angle - currentGuide.minAngle) / (currentGuide.maxAngle - currentGuide.minAngle)) * 100)
    )
  );

  return (
    <div className="camera-page">
      <div className="camera-header">
        <div>
          <span className="camera-badge">In-Browser Edge AI</span>
          <h1 className="camera-title">AI Vision Coach</h1>
          <p className="camera-subtitle">
            Google MediaPipe Pose running 100% in your browser at 60 FPS — zero video transmitted to any server.
          </p>
        </div>

        <div className="camera-controls">
          <select
            className="exercise-select"
            value={selectedExercise}
            onChange={(e) => {
              setSelectedExercise(e.target.value);
              repsRef.current = 0;
              stageRef.current = 'idle';
              dispatch({ type: 'RESET', payload: { feedback: `Switched to ${e.target.value}. Stand ready!` } });
            }}
            disabled={isRunning}
          >
            {Object.keys(EXERCISE_GUIDES).map((ex) => (
              <option key={ex} value={ex}>
                {ex}
              </option>
            ))}
          </select>

          {!isRunning ? (
            <button className="btn-camera-start" onClick={startCamera} disabled={isLoadingModel}>
              <span className="material-symbols-outlined">
                {isLoadingModel ? 'hourglass_top' : 'videocam'}
              </span>
              {isLoadingModel ? 'Loading Model...' : 'Start Camera'}
            </button>
          ) : (
            <button className="btn-camera-stop" onClick={stopCamera}>
              <span className="material-symbols-outlined">stop_circle</span>
              Stop &amp; Save
            </button>
          )}
        </div>
      </div>

      {analysisError && (
        <div className="camera-error">
          <span className="material-symbols-outlined">error</span>
          <span>{analysisError}</span>
        </div>
      )}

      <div className="camera-grid">
        {/* Main Camera Viewport */}
        <div
          className="camera-viewport"
          style={cameraAspectRatio ? { aspectRatio: cameraAspectRatio } : undefined}
        >
          <video
            ref={videoRef}
            className="camera-video"
            playsInline
            muted
          />
          <canvas ref={overlayCanvasRef} className="camera-overlay" />

          {/* Real-time HUD */}
          {isRunning && isCameraReady && (
            <div className="camera-hud">
              <div className="hud-top">
                <div className="hud-badge protocol-badge">
                  <span className="protocol-dot"></span>
                  <span>{selectedExercise}</span>
                </div>
                <div className="hud-badge rep-badge">
                  <span className="rep-number">{analysis.reps}</span>
                  <span className="rep-label">REPS</span>
                </div>
              </div>

              <div className="hud-bottom">
                <div className={`hud-feedback-pill ${analysis.postureCorrect ? 'correct' : 'warning'}`}>
                  <span className="material-symbols-outlined">
                    {analysis.postureCorrect ? 'check_circle' : 'warning'}
                  </span>
                  <span>{analysis.feedback}</span>
                </div>
              </div>

              <div className="hud-metrics">
                <div className="metric-chip">
                  <span className="metric-label">Joint Angle:</span>
                  <span className="metric-val">{analysis.angle}°</span>
                </div>
                <div className="metric-chip">
                  <span className="metric-label">Engine:</span>
                  <span className="metric-val">MediaPipe Wasm</span>
                </div>
                <div className="metric-chip">
                  <span className="metric-label">Latency:</span>
                  <span className="metric-val">{analysis.processingMs}ms</span>
                </div>
              </div>
            </div>
          )}

          {!isRunning && (
            <div className="camera-placeholder">
              <div className="placeholder-icon">
                <span className="material-symbols-outlined">fitness_center</span>
              </div>
              <h3>Ready to Train?</h3>
              <p>Select your exercise and start your camera to begin tracking your reps and posture in real-time.</p>
              <button className="btn-primary" onClick={startCamera}>
                Launch Camera
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Telemetry & Coaching Panel */}
        <div className="camera-sidebar">
          {/* Biomechanics Angle Meter */}
          <div className="sidebar-panel">
            <div className="panel-header">
              <span className="material-symbols-outlined">straighten</span>
              <span>Live Biomechanics</span>
            </div>

            <div className="angle-meter-container">
              <div className="angle-meter-header">
                <span className="angle-meter-title">{currentGuide.keyJoint}</span>
                <span className="angle-meter-value">{analysis.angle > 0 ? `${analysis.angle}°` : '--°'}</span>
              </div>
              <div className="angle-meter-track">
                <div
                  className="angle-meter-fill"
                  style={{ width: `${isRunning && isCameraReady ? anglePercent : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Technique Coaching Card */}
          <div className="sidebar-panel">
            <div className="panel-header">
              <span className="material-symbols-outlined">school</span>
              <span>Form Guide: {selectedExercise}</span>
            </div>

            <div style={{ marginBottom: '14px', fontSize: '12px', color: 'var(--brand-primary)', fontWeight: '600' }}>
              Target: {currentGuide.muscles}
            </div>

            <div className="coaching-tips-list">
              {currentGuide.tips.map((tip, idx) => (
                <div key={idx} className="coaching-tip-item">
                  <span className="tip-bullet">✓</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy & Engine Specs */}
          <div className="sidebar-panel">
            <div className="panel-header">
              <span className="material-symbols-outlined">verified_user</span>
              <span>Edge AI Telemetry</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Inference:</span>
                <strong style={{ color: 'var(--text-primary)' }}>Client-Side Wasm</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Video Privacy:</span>
                <strong style={{ color: '#00E575' }}>100% On-Device</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Target FPS:</span>
                <strong style={{ color: 'var(--text-primary)' }}>60 FPS</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiCamera;
