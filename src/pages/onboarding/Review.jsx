import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import LoadingSpinner from '../../components/LoadingSpinner';

const GOAL_MAP = { 1: "Hypertrophy / Gain", 2: "Fat Loss / Cut", 3: "Maintenance / Recomp" };
const DIET_MAP = { 0: "Omnivore", 1: "Vegetarian", 2: "Vegan", 3: "Pescatarian" };
const ACTIVITY_MAP = {
  0: "Sedentary",
  1: "Lightly Active",
  2: "Moderately Active",
  3: "Very Active",
  4: "Extremely Active"
};

const Review = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userService.getProfile();
        setUser(data);
      } catch {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  if (loading) return <LoadingSpinner />;
  if (!user || !user.preferences) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 24px', maxWidth: '420px', margin: '0 auto' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>No saved profile preferences found.</p>
        <button className="btn-primary" onClick={() => navigate('/setup')}>Configure Profile</button>
      </div>
    );
  }

  const prefs = user.preferences;

  return (
    <main className="container" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: 'var(--radius-pill)', background: 'var(--brand-primary-tint)', border: '1px solid var(--brand-primary-border)', marginBottom: '12px' }}>
          <span style={{ color: 'var(--brand-primary)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Final Verification
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '8px' }}>
          Confirm Your Biometric Profile
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '480px', margin: '0 auto', lineHeight: 1.5 }}>
          Verify your physiological baselines before the AI nutrition engine compiles your macro targets.
        </p>
      </div>

      <div className="preferences-card" style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* Core Biometrics */}
        <div>
          <h2 style={{ color: 'var(--brand-primary)', marginBottom: '14px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>
            Core Biometrics
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px' }}>
            <div style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Height</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>{prefs.height} <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-muted)' }}>cm</span></div>
            </div>
            <div style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Weight</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>{prefs.weight} <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-muted)' }}>kg</span></div>
            </div>
            <div style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Age</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>{prefs.age} <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-muted)' }}>yrs</span></div>
            </div>
            <div style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Sex</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>{prefs.gender}</div>
            </div>
          </div>
        </div>

        {/* Training & Nutrition Plan */}
        <div>
          <h2 style={{ color: 'var(--brand-primary)', marginBottom: '14px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>
            Training & Nutritional Strategy
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Primary Goal</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>{GOAL_MAP[prefs.goal] || "Maintenance"}</div>
            </div>
            <div style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Activity Frequency</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>{ACTIVITY_MAP[prefs.activity_level] || "Moderate"}</div>
            </div>
            <div style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Dietary Framework</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>{DIET_MAP[prefs.diet] || "Omnivore"}</div>
            </div>
          </div>
        </div>

        {/* Exclusions & Medical (if any) */}
        {(prefs.dislikes?.length > 0 || prefs.medical?.length > 0) && (
          <div>
            <h2 style={{ color: 'var(--brand-primary)', marginBottom: '14px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>
              Exclusions & Health Flags
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {prefs.dislikes?.map(d => (
                <span key={d} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#F87171', fontSize: '12px', fontWeight: '600', padding: '4px 10px', borderRadius: '4px' }}>
                  Excluded: {d}
                </span>
              ))}
              {prefs.medical?.map(m => (
                <span key={m} style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '500', padding: '4px 10px', borderRadius: '4px' }}>
                  Medical: {m}
                </span>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '14px', marginTop: '10px' }}>
          <button className="btn-secondary" style={{ flex: 1 }} onClick={() => navigate('/setup')}>
            ← Modify Biometrics
          </button>
          <button className="btn-primary" style={{ flex: 2 }} onClick={() => navigate('/confirming')}>
            Compile & Generate Plan →
          </button>
        </div>
      </div>
    </main>
  );
};

export default Review;
