import React from 'react';

const LoadingSpinner = ({ size = 36, color = 'var(--brand-primary)' }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      minHeight: '120px',
      padding: '2rem',
    }}
    role="status"
    aria-label="Loading"
  >
    <svg
      viewBox="0 0 50 50"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        animation: 'spin 0.75s linear infinite',
      }}
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="rgba(255, 255, 255, 0.1)"
        strokeWidth="4"
      />
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="32 70"
      />
    </svg>
  </div>
);

export default LoadingSpinner;
