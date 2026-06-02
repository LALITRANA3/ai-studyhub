import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '⊞', section: 'Overview' },
  { path: '/progress', label: 'Progress', icon: '📈', section: 'Overview' },
  { path: '/chat', label: 'AI Chat', icon: '💬', section: 'AI Tools', badge: 'AI' },
  { path: '/mcq', label: 'MCQ Generator', icon: '✅', section: 'AI Tools' },
  { path: '/flashcards', label: 'Flashcards', icon: '🃏', section: 'AI Tools' },
  { path: '/roadmap', label: 'AI Roadmap', icon: '🗺️', section: 'AI Tools' },
  { path: '/upload', label: 'Upload Notes', icon: '📤', section: 'Study' },
  { path: '/pyq', label: 'PYQ Section', icon: '📄', section: 'Study' },
  { path: '/youtube', label: 'Video Recs', icon: '▶️', section: 'Study' },
];

const sections = ['Overview', 'AI Tools', 'Study'];

export default function MainLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [search, setSearch] = useState('');

  const pageTitle = navItems.find(n =>
    n.path === '/' ? location.pathname === '/' : location.pathname.startsWith(n.path)
  )?.label || 'Dashboard';

  return (
    <div style={{ display: 'flex', height: '100vh', position: 'relative', zIndex: 1 }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, flexShrink: 0,
        background: 'var(--bg2)',
        borderRight: '0.5px solid var(--border)',
        display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ padding: '20px 16px 16px', borderBottom: '0.5px solid var(--border)' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 700, color: 'var(--accent2)', letterSpacing: '0.05em' }}>
            AI StudyHub
          </div>
          <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginTop: 2 }}>
            // CSE Intelligence Platform
          </div>
        </div>

        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {sections.map(section => (
            <div key={section} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text3)', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0 8px', marginBottom: 4 }}>
                {section}
              </div>
              {navItems.filter(n => n.section === section).map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 10px', borderRadius: 6,
                    textDecoration: 'none', fontSize: 13,
                    marginBottom: 2,
                    color: isActive ? 'var(--accent)' : 'var(--text2)',
                    background: isActive ? 'rgba(59,130,246,0.12)' : 'transparent',
                    border: isActive ? '0.5px solid rgba(59,130,246,0.25)' : '0.5px solid transparent',
                    transition: 'all 0.15s',
                  })}
                >
                  <span style={{ fontSize: 15, width: 18 }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && (
                    <span style={{ background: 'var(--accent3)', color: '#fff', fontSize: 9, padding: '1px 6px', borderRadius: 10, fontWeight: 600 }}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div style={{ padding: 12, borderTop: '0.5px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, borderRadius: 8, background: 'var(--bg3)' }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'linear-gradient(135deg,var(--accent),var(--accent3))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, flexShrink: 0
            }}>
              {user?.avatar || user?.name?.slice(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text3)' }}>{user?.role || 'CSE Student'}</div>
            </div>
            <button
              onClick={logout}
              style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 16, padding: 2 }}
              title="Logout"
            >⇥</button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <div style={{
          padding: '14px 24px', borderBottom: '0.5px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'var(--bg2)'
        }}>
          <div>
            <span style={{ fontSize: 16, fontWeight: 600 }}>{pageTitle}</span>
            <span style={{ fontSize: 12, color: 'var(--text3)', marginLeft: 8 }}>
              Good morning, {user?.name?.split(' ')[0]} 👋
            </span>
          </div>
          <div style={{ marginLeft: 'auto', position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: 10, fontSize: 15, color: 'var(--text3)' }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search topics..."
              style={{
                background: 'var(--bg3)', border: '0.5px solid var(--border)',
                borderRadius: 8, padding: '6px 12px 6px 34px',
                fontSize: 13, color: 'var(--text)', width: 200,
                fontFamily: 'var(--sans)', outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
