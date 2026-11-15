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
    title: 'Set Your Baseline',
    description: 'Tell us about your fitness targets, dietary preferences, and current routine in a quick setup.',
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
    title: 'Get Your Custom Plan',
    description: 'We calculate your exact calories and generate balanced, delicious meal plans built around foods you enjoy.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '22px', height: '22px' }}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
  {
    number: 'STEP 03',
    title: 'Train with Live Feedback',
    description: 'Open the AI camera during your workouts for real-time posture corrections and automatic rep tracking.',
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
            <span className="section-tag">Everything You Need</span>
            <h2 className="section-title">Designed for Real Results</h2>
            <p className="section-subtitle">
              Simple, science-backed tools that take the stress and guesswork out of your workouts and daily nutrition.
            </p>
          </div>

          <div className="features-grid">
            <FeatureCard
              title="Smart Macro Tracking"
              description="Get daily calorie and macronutrient targets tailored to your body, goals, and lifestyle."
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
              title="AI Form Coach"
              description="Turn your webcam into a personal trainer. Get live posture feedback and rep counts as you lift."
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '22px', height: '22px' }}>
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              }
            />
            <FeatureCard
              title="Progress Analytics"
              description="Track your consistency, strength gains, and body transformation with clear, encouraging insights."
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
            <span className="section-tag">Simple & Effective</span>
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Three simple steps to transform your health and fitness journey.
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
            <span className="section-tag">Real Stories</span>
            <h2 className="section-title">Success Stories</h2>
            <p className="section-subtitle">Real results from real people transforming their health with FitNex.</p>
          </div>

          <div className="testimonials-grid">
            <TestimonialCard
              name="Sarah Jenkins"
              role="Lost 8kg in 3 months"
              text="The AI camera coach is like having a trainer in my living room. It caught my squat form slipping before I could hurt myself!"
              img={sarah}
            />
            <TestimonialCard
              name="Mike Ross"
              role="Added 20kg to his squat"
              text="The nutrition planner takes all the stress out of eating right. Simple, realistic meals that actually keep me full."
              img={mike}
            />
            <TestimonialCard
              name="Elena Rodriguez"
              role="Running her first 10k"
              text="It keeps me accountable and confident. Having my meals and workouts all in one clean dashboard made all the difference."
              img={elena}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
