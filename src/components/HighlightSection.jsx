import React from 'react';
import athleteImg from '../assets/athlete.png';

const HighlightSection = () => {
  return (
    <section className="highlight-section">
      <div className="container">
        <div className="highlight-card">
          <div className="highlight-content">
            <div>
              <span className="section-tag">
                Smart Nutrition & Coaching
              </span>
            </div>
            <h2 className="highlight-title">Train like a pro, eat like a champion.</h2>
            <p className="highlight-desc">
              FitNex AI combines intelligent camera tracking with personalized nutrition planning, giving you instant guidance on every repetition without leaving your room.
            </p>
            <div className="highlight-features">
              <div className="highlight-feature-item">
                <div className="highlight-feature-icon">
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '10px', height: '10px' }}>
                    <polyline points="1.5 6 4.5 9 10.5 3" />
                  </svg>
                </div>
                <span>Live posture corrections &amp; automatic rep counting</span>
              </div>
              <div className="highlight-feature-item">
                <div className="highlight-feature-icon">
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '10px', height: '10px' }}>
                    <polyline points="1.5 6 4.5 9 10.5 3" />
                  </svg>
                </div>
                <span>Daily meal plans customized to your exact calorie &amp; macro goals</span>
              </div>
              <div className="highlight-feature-item">
                <div className="highlight-feature-icon">
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '10px', height: '10px' }}>
                    <polyline points="1.5 6 4.5 9 10.5 3" />
                  </svg>
                </div>
                <span>100% private webcam analysis — video is never stored on a server</span>
              </div>
            </div>
          </div>
          <div className="highlight-image">
            <img src={athleteImg} alt="Athlete training with precision form" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HighlightSection;
