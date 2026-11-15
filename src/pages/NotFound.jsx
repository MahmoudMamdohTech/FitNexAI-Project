import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '75vh', textAlign: 'center', padding: '60px 24px' }}>
      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <h1 style={{
          fontSize: 'clamp(96px, 14vw, 150px)',
          fontWeight: '900',
          lineHeight: 1,
          color: 'var(--text-primary)',
          letterSpacing: '-0.04em',
          userSelect: 'none',
        }}>
          4<span style={{ color: 'var(--brand-primary)' }}>0</span>4
        </h1>
      </div>

      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: 'var(--radius-pill)', background: 'var(--brand-primary-tint)', border: '1px solid var(--brand-primary-border)', marginBottom: '16px' }}>
        <span style={{ color: 'var(--brand-primary)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Route Off Target
        </span>
      </div>

      <h2 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: '800', marginBottom: '10px', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
        Page Not Located
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '420px', lineHeight: 1.6, marginBottom: '32px' }}>
        You've wandered off the scheduled training path. Let's return you to the central console.
      </p>

      <Link
        to="/"
        className="btn-primary"
        style={{ fontSize: '14px', padding: '12px 28px', borderRadius: 'var(--radius-sm)' }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
        Return to Home
      </Link>
    </main>
  );
};

export default NotFound;
