import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const EXERCISES = [
  { name: 'Squat', muscle: 'Quadriceps & Glutes', level: 'Intermediate', sets: '4 × 8-12', icon: 'fitness_center', desc: 'Hip hinge and knee flexion depth tracking.' },
  { name: 'Bicep Curl', muscle: 'Biceps Brachii', level: 'Beginner', sets: '3 × 10-15', icon: 'sports_gymnastics', desc: 'Elbow stabilization and eccentric control.' },
  { name: 'Push-Up', muscle: 'Pectorals & Core', level: 'Beginner', sets: '3 × 12-20', icon: 'bolt', desc: 'Horizontal push and lumbar plank rigidity.' },
  { name: 'Shoulder Press', muscle: 'Deltoids & Triceps', level: 'Advanced', sets: '4 × 8-10', icon: 'north', desc: 'Overhead trajectory and scapular clearance.' }
];

const LEVEL_STYLES = {
  Beginner: { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', color: '#10B981' },
  Intermediate: { bg: 'rgba(56, 189, 248, 0.1)', border: 'rgba(56, 189, 248, 0.3)', color: '#38BDF8' },
  Advanced: { bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.3)', color: '#FBBF24' }
};

const CodePage = () => {
  const [search, setSearch] = useState('');

  const filtered = EXERCISES.filter(ex => 
    ex.name.toLowerCase().includes(search.toLowerCase()) ||
    ex.muscle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ animation: 'fadeIn 250ms var(--ease-out)' }}>
      <header style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '8px' }}>
          Exercise <span style={{ color: 'var(--brand-primary)' }}>Library</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Explore validated biometric exercise modules with real-time AI computer vision tracking.
        </p>
      </header>

      {/* Search Bar */}
      <div style={{ marginBottom: '28px', maxWidth: '420px', position: 'relative' }}>
        <span className="material-symbols-outlined" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '20px' }}>
          search
        </span>
        <input 
          type="text" 
          placeholder="Filter by exercise or muscle group..." 
          className="form-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: '42px' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {filtered.map((ex, i) => {
          const badgeStyle = LEVEL_STYLES[ex.level] || LEVEL_STYLES.Beginner;
          return (
            <div
              key={i}
              className="preferences-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      background: 'var(--bg-surface-2)',
                      border: '1px solid var(--border-default)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--brand-primary)',
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{ex.icon}</span>
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                    {ex.name}
                  </h3>
                </div>

                <span
                  style={{ 
                    fontSize: '11px', 
                    fontWeight: '700',
                    padding: '3px 8px', 
                    borderRadius: '4px', 
                    background: badgeStyle.bg,
                    border: `1px solid ${badgeStyle.border}`,
                    color: badgeStyle.color,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  {ex.level}
                </span>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.5', margin: 0 }}>
                {ex.desc}
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  padding: '12px',
                  background: 'var(--bg-surface-2)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-default)',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.04em' }}>
                    Target
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '600', marginTop: '2px' }}>
                    {ex.muscle}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.04em' }}>
                    Protocol
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '600', marginTop: '2px' }}>
                    {ex.sets}
                  </div>
                </div>
              </div>

              <Link
                to="/dashboard/ai-camera"
                state={{ exercise: ex.name }}
                className="btn-primary"
                style={{
                  marginTop: 'auto',
                  textAlign: 'center',
                  width: '100%',
                  padding: '10px',
                  fontSize: '13px',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>videocam</span>
                Launch AI Coach
              </Link>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 20px', background: 'var(--bg-surface-1)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '36px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              search_off
            </span>
            <p>No matching exercises found for "{search}".</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodePage;
