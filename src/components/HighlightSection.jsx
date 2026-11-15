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
                Computer Vision Engine
              </span>
            </div>
            <h2 className="highlight-title">Train with elite biomechanics. Fuel with precision.</h2>
            <p className="highlight-desc">
              FitNex AI couples sub-millimeter joint tracking with adaptive macronutrient partitioning. Gain immediate kinematic feedback on every repetition directly from your browser.
            </p>
            <div className="highlight-features">
              <div className="highlight-feature-item">
                <div className="highlight-feature-icon">
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '10px', height: '10px' }}>
                    <polyline points="1.5 6 4.5 9 10.5 3" />
                  </svg>
                </div>
                <span>Real-time pose estimation &amp; rep lockout verification</span>
              </div>
              <div className="highlight-feature-item">
                <div className="highlight-feature-icon">
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '10px', height: '10px' }}>
                    <polyline points="1.5 6 4.5 9 10.5 3" />
                  </svg>
                </div>
                <span>Algorithmic BMR &amp; macro partition matching your objective</span>
              </div>
              <div className="highlight-feature-item">
                <div className="highlight-feature-icon">
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '10px', height: '10px' }}>
                    <polyline points="1.5 6 4.5 9 10.5 3" />
                  </svg>
                </div>
                <span>Private local browser processing with zero cloud video storage</span>
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
