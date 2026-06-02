import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { user, login, register } = useAuth();
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: 'demo@cse.edu', password: 'demo123' });

  if (user) return <Navigate to="/" />;

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async () => {
    setLoading(true);
    if (tab === 'login') await login(form.email, form.password);
    else await register(form.name, form.email, form.password);
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px',
    background: '#1a2235', border: '0.5px solid rgba(99,179,237,0.15)',
    borderRadius: 8, color: '#e2e8f0', fontSize: 13,
    fontFamily: 'DM Sans, sans-serif', outline: 'none',
    marginBottom: 14,
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#0a0e1a',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
    }}>
      <div style={{
        background: '#111827', border: '0.5px solid rgba(99,179,237,0.15)',
        borderRadius: 16, padding: 40, width: 360
      }}>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 18, color: '#06b6d4', marginBottom: 4, fontWeight: 700 }}>
          AI StudyHub
        </div>
        <div style={{ fontSize: 12, color: '#475569', marginBottom: 30 }}>
          // CSE Student Intelligence Platform
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, background: '#1a2235', borderRadius: 8, padding: 4, marginBottom: 24 }}>
          {['login', 'register'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '7px', borderRadius: 5, border: tab === t ? '0.5px solid rgba(99,179,237,0.2)' : 'none',
              fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              background: tab === t ? '#111827' : 'none',
              color: tab === t ? '#e2e8f0' : '#475569',
            }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'register' && (
          <>
            <label style={{ fontSize: 11, color: '#475569', letterSpacing: '0.08em', display: 'block', marginBottom: 5 }}>FULL NAME</label>
            <input name="name" value={form.name} onChange={handle} placeholder="Arjun Sharma" style={inputStyle} />
          </>
        )}
        <label style={{ fontSize: 11, color: '#475569', letterSpacing: '0.08em', display: 'block', marginBottom: 5 }}>EMAIL</label>
        <input name="email" type="email" value={form.email} onChange={handle} placeholder="student@college.edu" style={inputStyle} />
        <label style={{ fontSize: 11, color: '#475569', letterSpacing: '0.08em', display: 'block', marginBottom: 5 }}>PASSWORD</label>
        <input name="password" type="password" value={form.password} onChange={handle} placeholder="••••••••" style={inputStyle} />

        <button onClick={submit} disabled={loading} style={{
          width: '100%', padding: 11, borderRadius: 8, background: '#3b82f6',
          border: 'none', color: '#fff', fontSize: 14, cursor: 'pointer',
          fontWeight: 600, fontFamily: 'DM Sans, sans-serif', marginTop: 8,
          opacity: loading ? 0.7 : 1,
        }}>
          {loading ? 'Please wait...' : tab === 'login' ? 'Login →' : 'Create Account →'}
        </button>
      </div>
    </div>
  );
}
