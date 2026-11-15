import React from 'react';
import { Link } from 'react-router-dom';
import sarah from '../assets/sarah.png';
import mike from '../assets/mike.png';
import elena from '../assets/elena.png';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 14px', borderRadius: 'var(--radius-pill)', background: 'var(--brand-primary-tint)', border: '1px solid var(--brand-primary-border)', marginBottom: '20px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--brand-primary)' }}></span>
          <span style={{ color: 'var(--brand-primary)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Next-Gen Computer Vision Fitness
          </span>
        </div>

        <h1 className="hero-title">
          Precision Biomechanics.<br />
          <span className="neon">Intelligent Nutrition.</span>
        </h1>
        <p className="hero-subtitle">
          Real-time AI pose estimation that tracks reps and corrects exercise kinematics, coupled with adaptive metabolic macronutrient planning.
        </p>
        <div className="hero-cta">
          <Link to="/signup" className="btn-primary">
            Start Free Training
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
          </Link>
          <a href="#how-it-works" className="btn-outline">
            How It Works
          </a>
        </div>
        <div className="hero-social-proof">
          <div className="avatar-group">
            <img src={sarah} alt="Sarah - Powerlifter" />
            <img src={mike} alt="Mike - Crossfit Athlete" />
            <img src={elena} alt="Elena - Marathon Runner" />
          </div>
          <div className="rating-info">
            <div className="stars">★★★★★</div>
            <div className="rating-text">Validated by athletes and coaches</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
