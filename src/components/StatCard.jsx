import React from 'react';

const StatCard = ({ icon, iconColor = 'var(--brand-primary)', label, value, unit }) => {
  return (
    <div
      style={{
        background: 'var(--bg-surface-1)',
        border: '1px solid var(--border-default)',
        padding: '20px 22px',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        transition: 'border-color 150ms var(--ease-out), transform 150ms var(--ease-out)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-default)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600', letterSpacing: '0.01em' }}>
          {label}
        </span>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            background: `${iconColor}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span className="material-symbols-outlined" style={{ color: iconColor, fontSize: '18px' }}>
            {icon}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
        <span style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.02em' }}>
          {value}
        </span>
        <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '500' }}>
          {unit}
        </span>
      </div>

      {/* Athletic progress accent line */}
      <div style={{ width: '100%', height: '3px', background: 'var(--bg-surface-3)', borderRadius: '2px', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: '65%',
            background: iconColor,
            borderRadius: '2px',
            opacity: 0.85,
          }}
        />
      </div>
    </div>
  );
};

export default StatCard;
