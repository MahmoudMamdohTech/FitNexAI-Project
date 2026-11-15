import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// password strength calculator
function getPasswordStrength(password) {
  if (!password) return { level: 0, label: '', color: '', tip: '' };

  let score = 0;
  const tips = [];

  // Length scoring
  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  // Complexity scoring
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score += 1;
  } else {
    tips.push('Mix upper & lowercase');
  }

  if (/\d/.test(password)) {
    score += 1;
  } else {
    tips.push('Add a number');
  }

  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 1;
  } else {
    tips.push('Add a symbol (!@#$)');
  }

  // Map score to levels
  if (score <= 2) return { level: 1, label: 'Weak', color: '#EF4444', tip: tips[0] || 'Too short' };
  if (score <= 3) return { level: 2, label: 'Fair', color: '#F59E0B', tip: tips[0] || 'Getting better' };
  if (score <= 4) return { level: 3, label: 'Good', color: '#10B981', tip: tips[0] || 'Almost there' };
  return { level: 4, label: 'Strong', color: '#00E575', tip: 'Optimal security' };
}

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shake, setShake] = useState(false);

  const navigate = useNavigate();
  const { signup } = useAuth();

  // Real-time password strength
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  // Password match check
  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validation
    if (!username.trim()) {
      triggerError('Please enter a username.');
      return;
    }
    if (!email.trim()) {
      triggerError('Please enter your email address.');
      return;
    }
    if (!password) {
      triggerError('Please create a password.');
      return;
    }
    if (password.length < 6) {
      triggerError('Password must be at least 6 characters.');
      return;
    }
    if (strength.level < 2) {
      triggerError('Your password is too weak. Add numbers, symbols, or uppercase letters.');
      return;
    }
    if (password !== confirmPassword) {
      triggerError('Passwords do not match.');
      return;
    }

    const terms = document.getElementById('terms');
    if (terms && !terms.checked) {
      triggerError('Please agree to the Terms & Conditions.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signup(username, email, password);
      navigate('/verify');
    } catch (err) {
      triggerError(err.message || 'Error signing up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  function triggerError(msg) {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 300);
  }

  return (
    <div className="auth-page">
      <main className="auth-main" style={{ marginTop: '2rem' }}>
        <div className={`auth-card ${shake ? 'shake' : ''}`}>
          <h1 className="auth-card-title">Create Account</h1>
          <p className="auth-card-subtitle">Join FitNex AI and calibrate your personal fitness system.</p>

          <form onSubmit={handleSignup} noValidate>
            {/* Error Banner */}
            <div className={`auth-error-banner ${error ? 'visible' : ''}`} role="alert">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>

            {/* Username */}
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
                <input
                  className="form-input"
                  type="text"
                  id="username"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError(null); }}
                  placeholder="Username"
                  required
                />
              </div>
            </div>

            {/* Email */}
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
                  required
                />
              </div>
            </div>

            {/* Password + Strength Meter */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  className="form-input"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(null); }}
                  placeholder="Min. 6 characters"
                  required
                />
                <button
                  type="button"
                  className="input-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
                      <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <div className="password-strength-wrap">
                  <div className="strength-meter">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className="strength-segment"
                        style={{
                          background: i <= strength.level ? strength.color : 'rgba(255,255,255,0.08)',
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                    <span className="strength-label" style={{ color: strength.color, fontWeight: '700' }}>
                      {strength.label}
                    </span>
                    {strength.tip && strength.level < 4 && (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{strength.tip}</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  className="form-input"
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); setError(null); }}
                  placeholder="Confirm password"
                  required
                />
              </div>
              {passwordMismatch && (
                <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '6px' }}>Passwords do not match.</p>
              )}
            </div>

            <div style={{ margin: '16px 0 24px' }}>
              <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" id="terms" required />
                <span>I agree to the <span style={{ color: 'var(--brand-primary)' }}>Terms &amp; Conditions</span></span>
              </label>
            </div>

            <button type="submit" className="btn-primary auth-btn" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--brand-primary)', fontWeight: '600' }}>Log In →</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;
