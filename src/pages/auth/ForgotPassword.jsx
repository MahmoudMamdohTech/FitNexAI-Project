import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      setShake(true);
      setTimeout(() => setShake(false), 300);
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      await authService.forgotPassword(email);
      setMessage("If an account with that email exists, a password reset link has been sent.");
      setEmail('');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setShake(true);
      setTimeout(() => setShake(false), 300);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <main className="auth-main">
        <div className={`auth-card ${shake ? 'shake' : ''}`}>
          {/* Lock icon */}
          <div className="auth-icon-wrapper">
            <div className="auth-icon-circle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px' }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
          </div>

          <h1 className="auth-card-title">Reset Password</h1>
          <p className="auth-card-subtitle">
            Enter your email and we'll send you a link to reset your credentials.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="auth-error-banner visible" role="alert" style={{ marginBottom: '1rem' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div style={{ background: 'var(--brand-primary-tint)', border: '1px solid var(--brand-primary-border)', color: 'var(--brand-primary)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', fontSize: '13px', lineHeight: 1.5, marginBottom: '20px', textAlign: 'center' }}>
                {message}
              </div>
            )}

            {!message && (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address</label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2"/>
                        <polyline points="2,4 12,13 22,4"/>
                      </svg>
                    </span>
                    <input
                      className="form-input"
                      type="email"
                      id="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(null); }}
                      placeholder="name@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary auth-btn" disabled={loading} style={{ marginTop: '0.5rem' }}>
                  {loading ? 'Sending link...' : 'Send Reset Link'}
                </button>
              </>
            )}
          </form>

          <div className="auth-sub-links" style={{ justifyContent: 'center' }}>
            <Link to="/login" style={{ color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              ← Back to Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
