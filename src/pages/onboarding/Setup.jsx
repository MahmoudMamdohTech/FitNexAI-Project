import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import api from '../../services/api';

const GOAL_OPTIONS = [
  { id: 1, label: 'Hypertrophy / Gain', desc: 'Build lean muscle mass with caloric surplus' },
  { id: 3, label: 'Maintenance / Recomp', desc: 'Sustain mass while improving power-to-weight ratio' },
  { id: 2, label: 'Fat Loss / Cut', desc: 'Target body fat reduction while sparing lean muscle' },
];

const Setup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    gender: 'Male',
    age: '',
    height: '',
    weight: '',
    goal: 3,
    activity_level: 2,
    diet: 0,
    favorites: [],
    dislikes: [],
    medical: []
  });
  const [foodOptions, setFoodOptions] = useState([]);

  useEffect(() => {
    const fetchExistingPrefs = async () => {
      try {
        const user = await userService.getProfile();
        if (user && user.hasPreferences && user.preferences) {
          setFormData(prev => ({
            ...prev,
            ...user.preferences
          }));
        }
      } catch (err) {
        console.warn("Could not fetch existing profile config. Using defaults.", err);
      }
    };
    fetchExistingPrefs();
  }, []);

  useEffect(() => {
    const loadFoods = async () => {
      try {
        const res = await api.get('/api/v1/foods/options');
        setFoodOptions(res.foods ?? []);
      } catch (err) {
        console.warn('Could not load food options from AI service.', err);
      }
    };
    loadFoods();
  }, []);

  const favoritesList = foodOptions;
  const medicalList = ["Diabetes", "Hypertension", "Heart Disease", "Kidney Disease", "Acne"];

  const toggleArrayItem = (field, item) => {
    const oppField = field === 'favorites' ? 'dislikes' : (field === 'dislikes' ? 'favorites' : null);

    setFormData(prev => {
      const arr = prev[field];
      const isRemoving = arr.includes(item);

      let nextState = { ...prev };

      if (isRemoving) {
        nextState[field] = arr.filter(i => i !== item);
      } else {
        nextState[field] = [...arr, item];
      }

      if (!isRemoving && oppField) {
        nextState[oppField] = prev[oppField].filter(i => i !== item);
      }

      return nextState;
    });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.age || !formData.height || !formData.weight) {
      setError("Please fill in all physical biometrics (Age, Height, and Weight).");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      localStorage.removeItem('fitnex_generation_error');
      
      const rawUser = localStorage.getItem('fitnex_user');
      const user = rawUser ? JSON.parse(rawUser) : {};
      user.preferences = formData;
      user.hasPreferences = true;
      localStorage.setItem('fitnex_user', JSON.stringify(user));
      
      navigate('/review');
    } catch (err) {
      console.error(err);
      localStorage.setItem('fitnex_generation_error', err.message || 'Failed to generate plan.');
      setError(err.message || 'Failed to generate plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
      <div className="setup-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: 'var(--radius-pill)', background: 'var(--brand-primary-tint)', border: '1px solid var(--brand-primary-border)', marginBottom: '14px' }}>
          <span style={{ color: 'var(--brand-primary)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Biometric Calibration
          </span>
        </div>
        <h1>Personalize Your <span style={{ color: 'var(--brand-primary)' }}>Performance Plan</span></h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto', lineHeight: '1.6', fontSize: '15px' }}>
          Calibrate your physiological baselines and nutritional strategy for tailored AI exercise & macro targets.
        </p>
      </div>

      {error && (
        <div style={{ background: 'var(--color-error-bg)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--color-error)', padding: '14px 20px', borderRadius: 'var(--radius-sm)', maxWidth: '1080px', margin: '0 auto 24px', textAlign: 'center', fontSize: '14px', fontWeight: '500' }}>
          {error}
        </div>
      )}

      <form id="setupForm" className="setup-grid" onSubmit={handleGenerate}>
        {/* Left Column: Physical Biometrics */}
        <div className="preferences-card" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div className="card-title">
            <span className="material-symbols-outlined" style={{ color: 'var(--brand-primary)', fontSize: '22px' }}>
              straighten
            </span>
            Physical Biometrics
          </div>

          <div>
            <label className="form-label">Biological Sex</label>
            <div className="toggle-group">
              <div
                className={`toggle-btn ${formData.gender === 'Male' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, gender: 'Male' })}
              >
                Male
              </div>
              <div
                className={`toggle-btn ${formData.gender === 'Female' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, gender: 'Female' })}
              >
                Female
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="form-label">Age</label>
              <input
                type="number"
                className="form-input"
                placeholder="Years (e.g. 26)"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: e.target.value === '' ? '' : Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="form-label">Height (cm)</label>
              <input
                type="number"
                className="form-input"
                placeholder="cm (e.g. 182)"
                value={formData.height}
                onChange={e => setFormData({ ...formData, height: e.target.value === '' ? '' : Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Weight (kg)</label>
            <input
              type="number"
              className="form-input"
              placeholder="kg (e.g. 78)"
              value={formData.weight}
              onChange={e => setFormData({ ...formData, weight: e.target.value === '' ? '' : Number(e.target.value) })}
            />
          </div>

          <div>
            <label className="form-label">Primary Training Goal</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {GOAL_OPTIONS.map(opt => (
                <div
                  key={opt.id}
                  onClick={() => setFormData({ ...formData, goal: opt.id })}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    background: formData.goal === opt.id ? 'var(--brand-primary-tint)' : 'var(--bg-surface-2)',
                    border: formData.goal === opt.id ? '1px solid var(--brand-primary-border)' : '1px solid var(--border-default)',
                    cursor: 'pointer',
                    transition: 'all 150ms var(--ease-out)',
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: '700', color: formData.goal === opt.id ? 'var(--brand-primary)' : 'var(--text-primary)' }}>
                    {opt.label}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {opt.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="form-label">Activity Level</label>
            <select
              className="form-input"
              value={formData.activity_level}
              onChange={e => setFormData({ ...formData, activity_level: Number(e.target.value) })}
            >
              <option value={0}>Sedentary (Little or no exercise)</option>
              <option value={1}>Lightly Active (1-3 workout days/wk)</option>
              <option value={2}>Moderately Active (3-5 workout days/wk)</option>
              <option value={3}>Very Active (6-7 intense training days/wk)</option>
              <option value={4}>Extremely Active (Athletic doubles / heavy labour)</option>
            </select>
          </div>
        </div>

        {/* Right Column: Nutrition & Preferences */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="preferences-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card-title">
              <span className="material-symbols-outlined" style={{ color: 'var(--brand-primary)', fontSize: '22px' }}>
                restaurant_menu
              </span>
              Nutritional Framework
            </div>

            <div>
              <label className="form-label">Dietary Framework</label>
              <select
                className="form-input"
                value={formData.diet}
                onChange={e => setFormData({ ...formData, diet: Number(e.target.value) })}
              >
                <option value={0}>Omnivore (Balanced meat & plants)</option>
                <option value={1}>Vegetarian (Plant-based + dairy/eggs)</option>
                <option value={2}>Vegan (100% plant-derived)</option>
                <option value={3}>Pescatarian (Fish & seafood + plants)</option>
              </select>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className="form-label" style={{ margin: 0 }}>Preferred Foods</label>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tap to select</span>
              </div>
              <div className="chip-container">
                {favoritesList.map(fav => (
                  <div
                    key={fav}
                    className={`chip ${formData.favorites.includes(fav) ? 'active' : ''}`}
                    onClick={() => toggleArrayItem('favorites', fav)}
                  >
                    {fav}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className="form-label" style={{ margin: 0 }}>Disliked / Excluded Foods</label>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Excluded from meal generation</span>
              </div>
              <div className="chip-container">
                {favoritesList.map(fav => {
                  const isDisliked = formData.dislikes.includes(fav);
                  return (
                    <div
                      key={fav}
                      className="chip"
                      onClick={() => toggleArrayItem('dislikes', fav)}
                      style={{
                        background: isDisliked ? 'rgba(239, 68, 68, 0.12)' : undefined,
                        borderColor: isDisliked ? 'rgba(239, 68, 68, 0.4)' : undefined,
                        color: isDisliked ? '#F87171' : undefined,
                        fontWeight: isDisliked ? '600' : undefined,
                      }}
                    >
                      {isDisliked && '✕ '}
                      {fav}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="preferences-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card-title">
              <span className="material-symbols-outlined" style={{ color: 'var(--brand-primary)', fontSize: '22px' }}>
                medical_services
              </span>
              Health & Medical Constraints
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
              {medicalList.map(med => (
                <div
                  key={med}
                  className={`selectable-card ${formData.medical.includes(med) ? 'active' : ''}`}
                  onClick={() => toggleArrayItem('medical', med)}
                >
                  <div className="check-icon">
                    {formData.medical.includes(med) && (
                      <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#090A0C', fontWeight: 'bold' }}>
                        check
                      </span>
                    )}
                  </div>
                  <span>{med}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>

      <div style={{ marginTop: '36px', textAlign: 'center' }}>
        <button
          type="submit"
          form="setupForm"
          className="btn-primary"
          disabled={loading}
          style={{ padding: '14px 44px', fontSize: '15px' }}
        >
          {loading ? 'Processing...' : 'Review & Calibrate Plan →'}
        </button>
      </div>
    </div>
  );
};

export default Setup;
