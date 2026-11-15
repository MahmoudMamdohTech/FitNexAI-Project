import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard', end: true },
  { to: '/dashboard/ai-camera', icon: 'videocam', label: 'AI Vision' },
  { to: '/dashboard/code', icon: 'fitness_center', label: 'Exercise Library' },
  { to: '/setup', icon: 'tune', label: 'Preferences' },
];

const DashboardLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const displayName = user?.name || 'Athlete';
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=00E575&color=090A0C&bold=true`;

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: 'var(--bg-canvas)', color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex flex-col items-center justify-center transition-opacity"
          style={{ background: 'rgba(9, 10, 12, 0.96)', backdropFilter: 'blur(16px)' }}
        >
          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
            style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '8px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>close</span>
          </button>

          <nav className="flex flex-col items-center gap-3 w-full px-6 max-w-sm">
            {NAV_LINKS.map(({ to, icon, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 w-full transition-all"
                style={({ isActive }) => ({
                  padding: '14px 18px',
                  borderRadius: '10px',
                  background: isActive ? 'var(--brand-primary-tint)' : 'var(--bg-surface-1)',
                  border: isActive ? '1px solid var(--brand-primary-border)' : '1px solid var(--border-default)',
                  textDecoration: 'none',
                })}
              >
                {({ isActive }) => (
                  <>
                    <span className="material-symbols-outlined" style={{ color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)', fontSize: '22px' }}>{icon}</span>
                    <p style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: '16px', fontWeight: isActive ? '700' : '500' }}>{label}</p>
                  </>
                )}
              </NavLink>
            ))}

            <div style={{ width: '100%', height: '1px', background: 'var(--border-default)', margin: '12px 0' }}></div>

            <button
              onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
              className="flex items-center justify-center gap-2 w-full transition-all"
              style={{ padding: '14px', borderRadius: '10px', color: '#EF4444', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
              Log Out
            </button>
          </nav>
        </div>
      )}

      {/* Sidebar (Desktop Only) */}
      <aside
        className="hidden lg:flex flex-col w-64 h-full flex-shrink-0"
        style={{ borderRight: '1px solid var(--border-default)', background: 'var(--bg-surface-1)' }}
      >
        <div className="flex flex-col h-full justify-between p-6">
          <div className="flex flex-col gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3 pb-2">
              <div className="logo-icon" style={{ width: '32px', height: '32px' }}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#090A0C" stroke="#090A0C" strokeWidth="1" strokeLinejoin="round" />
                </svg>
              </div>
              <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                FitNex <span style={{ color: 'var(--brand-primary)' }}>AI</span>
              </span>
            </div>

            {/* User Profile Card */}
            <div className="flex gap-3 items-center p-3 rounded-lg" style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)' }}>
              <div
                className="rounded-full flex-shrink-0"
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundImage: `url("${avatarUrl}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '1px solid var(--brand-primary-border)',
                }}
              ></div>
              <div className="flex flex-col min-w-0">
                <h2 style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {displayName}
                </h2>
                <span style={{ color: 'var(--brand-primary)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Pro Member
                </span>
              </div>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col gap-1.5">
              {NAV_LINKS.map(({ to, icon, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className="flex items-center gap-3 transition-all"
                  style={({ isActive }) => ({
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: isActive ? 'var(--brand-primary-tint)' : 'transparent',
                    border: isActive ? '1px solid var(--brand-primary-border)' : '1px solid transparent',
                    color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                    textDecoration: 'none',
                    fontWeight: isActive ? '600' : '500',
                    fontSize: '14px',
                  })}
                >
                  {({ isActive }) => (
                    <>
                      <span className="material-symbols-outlined" style={{ color: isActive ? 'var(--brand-primary)' : 'var(--text-muted)', fontSize: '20px' }}>
                        {icon}
                      </span>
                      <span>{label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full transition-colors"
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '500',
              background: 'transparent',
              border: '1px solid transparent',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#EF4444';
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto" style={{ background: 'var(--bg-canvas)' }}>
        {/* Mobile Header */}
        <header
          className="lg:hidden flex items-center justify-between sticky top-0 z-20"
          style={{ padding: '14px 20px', background: 'rgba(18, 20, 24, 0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-default)' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="logo-icon" style={{ width: '28px', height: '28px' }}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '16px', height: '16px' }}>
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#090A0C" stroke="#090A0C" strokeWidth="1" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 style={{ color: 'var(--text-primary)', fontWeight: '800', fontSize: '17px', letterSpacing: '-0.02em' }}>FitNex AI</h1>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            style={{ color: 'var(--text-primary)', background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', borderRadius: '6px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>menu</span>
          </button>
        </header>

        <div style={{ maxWidth: '1440px', margin: '0 auto', width: '100%', padding: 'clamp(20px, 3vw, 36px)', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
