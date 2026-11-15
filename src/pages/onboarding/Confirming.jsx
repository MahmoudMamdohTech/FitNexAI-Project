import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import LoadingSpinner from '../../components/LoadingSpinner';

const LOADING_MESSAGES = [
  "Validating physiological baselines...",
  "Computing BMR & expenditure coefficients...",
  "Synthesizing optimal macronutrient partition...",
  "Finalizing personalized AI exercise dashboard..."
];

const Confirming = () => {
  const navigate = useNavigate();
  const [messageIndex, setMessageIndex] = useState(0);
  const [error, setError] = useState(null);
  const generationStarted = useRef(false);

  useEffect(() => {
    // Cycle through messages every 900ms
    const messageInterval = setInterval(() => {
      setMessageIndex(prev =>
        prev < LOADING_MESSAGES.length - 1 ? prev + 1 : prev
      );
    }, 900);

    const generatePlan = async () => {
      if (generationStarted.current) return;
      generationStarted.current = true;
      
      try {
        const rawUser = localStorage.getItem('fitnex_user');
        if (!rawUser) throw new Error("User session not found.");
        const user = JSON.parse(rawUser);
        if (!user.preferences) throw new Error("No biometrics preferences found.");
        
        await userService.savePreferences(user.preferences);
        clearInterval(messageInterval);
        navigate('/dashboard');
      } catch (err) {
        console.error(err);
        clearInterval(messageInterval);
        setError(err.message || "Failed to generate workout and nutrition plan.");
      }
    };
    
    generatePlan();

    return () => {
      clearInterval(messageInterval);
    };
  }, [navigate]);

  return (
    <main className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '40px 24px' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        
        {!error ? (
          <>
            <div style={{ width: '72px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LoadingSpinner size={48} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                Compiling AI Performance Protocol
              </h1>
              <p style={{ color: 'var(--brand-primary)', fontSize: '14px', fontWeight: '600', minHeight: '24px', letterSpacing: '0.02em' }}>
                {LOADING_MESSAGES[messageIndex]}
              </p>
            </div>

            {/* Stepper Indicator */}
            <div style={{ display: 'flex', gap: '6px', width: '100%', maxWidth: '240px', marginTop: '8px' }}>
              {LOADING_MESSAGES.map((_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: '3px',
                    borderRadius: '2px',
                    background: i <= messageIndex ? 'var(--brand-primary)' : 'var(--bg-surface-3)',
                    transition: 'background-color 300ms var(--ease-out)',
                  }}
                />
              ))}
            </div>
          </>
        ) : (
          <div style={{ background: 'var(--bg-surface-1)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '36px 28px', width: '100%' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-error-bg)', border: '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#EF4444' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>error_outline</span>
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>Plan Compilation Failed</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5, marginBottom: '24px' }}>{error}</p>
            <button className="btn-primary" onClick={() => navigate('/setup')} style={{ width: '100%' }}>
              Return to Biometrics Calibration
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Confirming;
