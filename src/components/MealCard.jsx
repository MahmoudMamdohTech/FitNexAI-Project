import React, { useState } from 'react';

const MealCard = ({ category, data, onSwap }) => {
  const [swapping, setSwapping] = useState(false);
  const meal = data.options[data.currentIndex];

  const handleSwap = async () => {
    setSwapping(true);
    await onSwap(category);
    setSwapping(false);
  };

  return (
    <div
      style={{
        background: 'var(--bg-surface-1)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        transition: 'border-color 150ms var(--ease-out)',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-default)')}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--brand-primary)', fontSize: '20px' }}>
            {data.icon || 'restaurant'}
          </span>
          <h3 style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '14px', letterSpacing: '-0.01em' }}>
            {data.label}
          </h3>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Option {data.currentIndex + 1}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        <h4 style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '15px', textTransform: 'capitalize', lineHeight: '1.4' }}>
          {meal.name}
        </h4>

        {/* Nutritional Breakdown Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: 'auto', paddingTop: '8px' }}>
          <span style={{ background: 'var(--brand-primary-tint)', color: 'var(--brand-primary)', border: '1px solid var(--brand-primary-border)', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700' }}>
            {meal.calories} kcal
          </span>
          <span style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.25)', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
            P: {meal.protein}g
          </span>
          <span style={{ background: 'rgba(251, 191, 36, 0.1)', color: '#FBBF24', border: '1px solid rgba(251, 191, 36, 0.25)', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
            C: {meal.carbs}g
          </span>
          <span style={{ background: 'rgba(251, 146, 60, 0.1)', color: '#FB923C', border: '1px solid rgba(251, 146, 60, 0.25)', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
            F: {meal.fat}g
          </span>
        </div>
      </div>

      <button
        onClick={handleSwap}
        disabled={swapping}
        style={{
          marginTop: 'auto',
          background: 'var(--bg-surface-2)',
          border: '1px solid var(--border-default)',
          color: swapping ? 'var(--text-muted)' : 'var(--text-secondary)',
          padding: '9px 12px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '13px',
          fontWeight: '600',
          cursor: swapping ? 'wait' : 'pointer',
          transition: 'color 150ms var(--ease-out), background-color 150ms var(--ease-out), transform 150ms var(--ease-out)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
        }}
        onMouseEnter={e => {
          if (!swapping) {
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.background = 'var(--bg-surface-3)';
          }
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = swapping ? 'var(--text-muted)' : 'var(--text-secondary)';
          e.currentTarget.style.background = 'var(--bg-surface-2)';
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
          swap_horiz
        </span>
        {swapping ? 'Swapping...' : 'Swap Option'}
      </button>
    </div>
  );
};

export default MealCard;
