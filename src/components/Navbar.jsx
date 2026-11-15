import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { label: 'Features', id: 'features' },
  { label: 'How It Works', id: 'how-it-works' },
  { label: 'Stories', id: 'stories' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to section — works from any page
  const scrollToSection = useCallback((sectionId) => {
    setMenuOpen(false);

    const scrollTo = () => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(scrollTo, 300);
    } else {
      scrollTo();
    }
  }, [location.pathname, navigate]);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
        <div className="container">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#090A0C" stroke="#090A0C" strokeWidth="1" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="logo-text">FitNex <span>AI</span></span>
          </Link>

          {/* Desktop Nav */}
          {!isDashboard && (
            <ul className="navbar-nav">
              {NAV_LINKS.map(({ label, id }) => (
                <li key={id}>
                  <a href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollToSection(id); }}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          )}

          {/* Actions */}
          <div className="navbar-actions">
            {user ? (
              <Link to="/dashboard" className="btn-primary" style={{ padding: '9px 18px', fontSize: '13px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>dashboard</span>
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="login-link">Sign In</Link>
                <Link to="/signup" className="btn-primary" style={{ padding: '9px 18px', fontSize: '13px' }}>
                  Get Started
                </Link>
              </>
            )}
            <button
              className="hamburger"
              aria-label="Toggle navigation menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-nav ${menuOpen ? 'open' : ''}`} id="mobileMenu">
        <button
          className="close-btn"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        >
          &times;
        </button>
        {!isDashboard && NAV_LINKS.map(({ label, id }) => (
          <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollToSection(id); }}>
            {label}
          </a>
        ))}
        {user ? (
          <Link to="/dashboard" className="btn-primary" onClick={() => setMenuOpen(false)} style={{ width: '220px', textAlign: 'center' }}>
            Dashboard
          </Link>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '220px' }}>
            <Link to="/login" className="btn-secondary" onClick={() => setMenuOpen(false)} style={{ textAlign: 'center' }}>
              Sign In
            </Link>
            <Link to="/signup" className="btn-primary" onClick={() => setMenuOpen(false)} style={{ textAlign: 'center' }}>
              Get Started
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
