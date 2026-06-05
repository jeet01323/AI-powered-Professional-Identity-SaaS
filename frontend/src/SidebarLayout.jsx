import { NavLink, Outlet } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { useContext, useEffect } from 'react';
import { api } from './lib/api';

export default function SidebarLayout() {
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    api.profile.getMe()
      .then(res => {
        if (res && res.theme) {
          document.body.dataset.theme = res.theme;
        }
      })
      .catch(console.error);
  }, []);

  const navItems = [
    { to: '/app/dashboard', label: 'Dashboard', icon: '🏠' },
    { to: '/app/profile', label: 'My Profile', icon: '👤' },
    { to: '/app/portfolio', label: 'Portfolio', icon: '🗂️' },
    { to: '/app/github', label: 'GitHub', icon: '🐙' },
    { to: '/app/resume', label: 'Resume', icon: '📄' },
    { to: '/app/analytics', label: 'Analytics', icon: '📊' },
    { to: '/app/leads', label: 'Leads', icon: '🎯' },
    { to: '/app/ai-studio', label: 'AI Studio', icon: '🤖' },
    { to: '/app/seo', label: 'SEO', icon: '🔍' },
    { to: '/app/subscription', label: 'Subscription', icon: '💎' },
    { to: '/app/settings', label: 'Settings', icon: '⚙️' },
  ];

  if (user?.role === 'admin') {
    navItems.push({ to: '/app/admin', label: 'Admin Panel', icon: '🛡️' });
  }

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="sidebar-logo">DevCard AI</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-item${isActive ? ' active' : ''}`
              }
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
          <div className="sidebar-item" style={{ color: '#FF6B6B', cursor: 'pointer' }} onClick={() => logout()}>
            <span className="sidebar-icon">🚪</span>
            <span>Logout</span>
          </div>
        </div>
      </div>

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}
