import React from 'react';
import Hero from '../components/Hero';
import FeatureCard from '../components/FeatureCard';
import HighlightSection from '../components/HighlightSection';
import TestimonialCard from '../components/TestimonialCard';
import useScrollReveal from '../hooks/useScrollReveal';

import sarah from '../assets/sarah.png';
import mike from '../assets/mike.png';
import elena from '../assets/elena.png';

const STEPS = [
  {
    number: 'STEP 01',
    title: 'Initialize Athlete Profile',
    description: 'Set your baseline measurements, biometric stats, and dietary constraints with fast, encrypted onboarding.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '22px', height: '22px' }}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="22" y1="11" x2="16" y2="11" />
      </svg>
    ),
  },
  {
    number: 'STEP 02',
    title: 'Calibrate Training Focus',
    description: 'Select your physiological objective — hypertrophy, recomp, or fat loss. The AI balances macros and movement volume.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '22px', height: '22px' }}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
  {
    number: 'STEP 03',
    title: 'Launch Vision Coach',
    description: 'Mount your device camera to receive real-time joint angle feedback, posture correction, and automatic repetition counting.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '22px', height: '22px' }}>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
];

const Home = () => {
  useScrollReveal();

  return (
    <>
      <Hero />

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-header" data-reveal>
            <span className="section-tag">Integrated Ecosystem</span>
            <h2 className="section-title">Engineered for Human Performance</h2>
            <p className="section-subtitle">
              Unified biological telemetry combining computer vision exercise tracking with metabolic nutrition planning.
            </p>
          </div>

          <div className="features-grid">
            <FeatureCard
              title="Adaptive Meal Strategy"
              description="Algorithmic macronutrient allocations calculated from your basal metabolic rate and physical expenditure targets."
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '22px', height: '22px' }}>
                  <path d="M3 6h18M3 12h18M3 18h18" />
                  <circle cx="7" cy="6" r="2" fill="currentColor" stroke="none" />
                  <circle cx="7" cy="12" r="2" fill="currentColor" stroke="none" />
                  <circle cx="7" cy="18" r="2" fill="currentColor" stroke="none" />
                </svg>
              }
            />
            <FeatureCard
              title="Real-Time Vision Coach"
              description="High-frequency 33-point pose landmark inference running directly on device with zero privacy leakage."
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '22px', height: '22px' }}>
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              }
            />
            <FeatureCard
              title="Kinematic Analytics"
              description="Track movement velocity, form breakdown thresholds, and strength progression over time."
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '22px', height: '22px' }}>
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="steps-section" id="how-it-works">
        <div className="container">
          <div className="section-header" data-reveal>
            <span className="section-tag">Execution Flow</span>
            <h2 className="section-title">How FitNex Operates</h2>
            <p className="section-subtitle">
              Three streamlined phases connecting baseline intake with real-time AI guidance.
            </p>
          </div>

          <div className="steps-grid">
            {STEPS.map((step, i) => (
              <div className="step-card" key={i} data-reveal>
                <div className="step-number">{step.number}</div>
                <div className="feature-icon-wrap">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HighlightSection />

      {/* Success Stories */}
      <section className="testimonials-section" id="stories">
        <div className="container">
          <div className="section-header" data-reveal>
            <span className="section-tag">Case Studies</span>
            <h2 className="section-title">Athlete Outcomes</h2>
            <p className="section-subtitle">Read how lifters, runners, and hybrid athletes integrate FitNex AI.</p>
          </div>

          <div className="testimonials-grid">
            <TestimonialCard
              name="Sarah Jenkins"
              role="Competitive Powerlifter"
              text="The AI camera coach detected a 4-degree valgus collapse on my third squat attempt that my coach missed from the side. Incredible tool."
              img={sarah}
            />
            <TestimonialCard
              name="Mike Ross"
              role="Functional Fitness Coach"
              text="The macro algorithm is mathematically grounded. No gimmicks, no extreme deficits — pure metabolic precision."
              img={mike}
            />
            <TestimonialCard
              name="Elena Rodriguez"
              role="Endurance Runner"
              text="Keeping my protein partition stable while managing high-mileage glycogen demands was a guessing game until FitNex."
              img={elena}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
