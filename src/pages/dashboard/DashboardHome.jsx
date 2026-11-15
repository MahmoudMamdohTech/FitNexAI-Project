import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatCard from '../../components/StatCard';
import MealCard from '../../components/MealCard';

const EXERCISE_MODULES = [
  {
    name: 'Squat',
    desc: 'Fundamental lower body strength & knee alignment tracking.',
    target: 'Quadriceps & Glutes',
    icon: 'fitness_center',
    badge: 'Core Compound',
  },
  {
    name: 'Bicep Curl',
    desc: 'Arm builder with joint angle and elbow drift feedback.',
    target: 'Biceps Brachii',
    icon: 'sports_gymnastics',
    badge: 'Isolation',
  },
  {
    name: 'Push-Up',
    desc: 'Chest & core stability with scapular depth verification.',
    target: 'Pectorals & Triceps',
    icon: 'bolt',
    badge: 'Bodyweight',
  },
  {
    name: 'Shoulder Press',
    desc: 'Vertical press protocol checking lockout & spinal arch.',
    target: 'Deltoids & Traps',
    icon: 'north',
    badge: 'Overhead',
  },
];

const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('exercises');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getDashboardStats();
        setStats(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleSwap = async (category) => {
    try {
      await dashboardService.swapMeal(category);

      setStats(prev => {
        const catStats = { ...prev[category] };
        catStats.currentIndex = (catStats.currentIndex + 1) % (catStats.options.length || 1);
        return { ...prev, [category]: catStats };
      });
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) return (
    <div style={{ textAlign: 'center', padding: '60px 24px', background: 'var(--bg-surface-1)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', maxWidth: '480px', margin: '40px auto' }}>
      <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#EF4444', display: 'block', marginBottom: '14px' }}>
        error_outline
      </span>
      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>Session Notice</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px', lineHeight: 1.5 }}>{error}</p>
      <button className="btn-primary" onClick={() => navigate('/login')}>Return to Login</button>
    </div>
  );

  if (!stats) return <LoadingSpinner />;

  return (
    <>
      {/* Hero Focus Banner */}
      <section className="dashboard-hero-banner">
        <div
          className="dashboard-hero-bg"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1200")',
          }}
        />
        <div className="dashboard-hero-overlay" />
        <div className="dashboard-hero-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 10px', borderRadius: 'var(--radius-pill)', background: 'var(--brand-primary-tint)', border: '1px solid var(--brand-primary-border)', marginBottom: '12px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--brand-primary)' }}></span>
            <span style={{ color: 'var(--brand-primary)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Training Active
            </span>
          </div>
          <h2 style={{ color: 'var(--text-primary)', fontSize: 'clamp(22px, 3.5vw, 34px)', fontWeight: '800', lineHeight: 1.2, marginBottom: '8px', letterSpacing: '-0.02em' }}>
            Today's Focus: <span style={{ color: 'var(--brand-primary)' }}>Athletic Form & Conditioning</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '540px', lineHeight: 1.6 }}>
            Execute precision biomechanics with AI vision guidance. Align camera angle before starting reps.
          </p>
        </div>
      </section>

      {/* Macro Stats Grid */}
      <section className="stats-grid">
        <StatCard
          icon="local_fire_department"
          iconColor="var(--color-calories)"
          label="Daily Caloric Target"
          value={stats.dailyCalories}
          unit="kcal"
        />
        <StatCard
          icon="fitness_center"
          iconColor="var(--color-protein)"
          label="Protein Target"
          value={stats.dailyProtein}
          unit="g"
        />
        <StatCard
          icon="bolt"
          iconColor="var(--color-carbs)"
          label="Carbohydrates"
          value={stats.dailyCarbs}
          unit="g"
        />
        <StatCard
          icon="opacity"
          iconColor="var(--color-fat)"
          label="Essential Fats"
          value={stats.dailyFat}
          unit="g"
        />
      </section>

      {/* Tabs Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="dashboard-tabs">
          {[
            { id: 'exercises', label: 'Exercise Protocols', icon: 'sports_gymnastics' },
            { id: 'meals', label: 'Nutrition Strategy', icon: 'restaurant_menu' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`dashboard-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Exercises Tab */}
        {activeTab === 'exercises' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {EXERCISE_MODULES.map(ex => (
              <div key={ex.name} className="exercise-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div className="exercise-icon-wrap">
                    <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
                      {ex.icon}
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', padding: '3px 8px', borderRadius: '4px', background: 'var(--bg-surface-3)' }}>
                    {ex.badge}
                  </span>
                </div>

                <div>
                  <h3 className="exercise-title">{ex.name}</h3>
                  <p className="exercise-desc">{ex.desc}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '6px', fontWeight: '500' }}>
                    Target: <span style={{ color: 'var(--text-secondary)' }}>{ex.target}</span>
                  </p>
                </div>

                <Link
                  to="/dashboard/ai-camera"
                  state={{ exercise: ex.name }}
                  className="btn-primary"
                  style={{
                    padding: '10px 14px',
                    fontSize: '13px',
                    width: '100%',
                    marginTop: 'auto',
                    letterSpacing: '0.02em',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>videocam</span>
                  Launch AI Coach
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Nutrition Tab */}
        {activeTab === 'meals' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {['breakfast', 'lunch', 'dinner', 'snack'].map(cat => {
              if (!stats[cat]) return null;
              return (
                <MealCard
                  key={cat}
                  category={cat}
                  data={stats[cat]}
                  onSwap={handleSwap}
                />
              );
            })}
          </div>
        )}
      </section>
    </>
  );
};

export default DashboardHome;
