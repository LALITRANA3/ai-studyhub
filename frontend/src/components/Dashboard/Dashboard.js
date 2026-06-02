import React, { useEffect, useState } from 'react';
import { callAI, SYSTEM_PROMPTS } from '../../services/ai';
import { useAuth } from '../../context/AuthContext';

const subjects = [
  { name: 'DSA', pct: 82, color: '#3b82f6' },
  { name: 'DBMS', pct: 67, color: '#8b5cf6' },
  { name: 'OS', pct: 71, color: '#10b981' },
  { name: 'CN', pct: 55, color: '#f59e0b' },
  { name: 'TOC', pct: 48, color: '#ef4444' },
];

const stats = [
  { label: 'Notes Uploaded', value: '24', delta: '↑ 3 this week', color: '#3b82f6', icon: '📄' },
  { label: 'MCQs Solved', value: '312', delta: '↑ 45 today', color: '#8b5cf6', icon: '✅' },
  { label: 'Study Streak', value: '14d', delta: '🔥 Keep going!', color: '#10b981', icon: '🔥' },
  { label: 'Avg Score', value: '78%', delta: '↑ 5% from last month', color: '#f59e0b', icon: '⭐' },
];

const activities = [
  { text: 'Generated 10 MCQs on <b>Binary Trees</b>', time: '2h ago', color: '#3b82f6' },
  { text: 'Studied flashcards on <b>OS Scheduling</b>', time: '5h ago', color: '#8b5cf6' },
  { text: 'Uploaded <b>DBMS_Unit3.pdf</b>', time: 'Yesterday', color: '#10b981' },
  { text: 'Completed <b>CN PYQ 2022</b> — 75% score', time: '2 days ago', color: '#f59e0b' },
];

const card = { background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 12, padding: 20 };

export default function Dashboard() {
  const { user } = useAuth();
  const [insight, setInsight] = useState('Loading AI insight...');

  useEffect(() => {
    callAI(SYSTEM_PROMPTS.insight, 'Give me today\'s study tip.')
      .then(setInsight)
      .catch(() => setInsight('💡 Tip: Focus on understanding time and space complexity. A solid Big-O grasp sets you apart in interviews and exams.'));
  }, []);

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
        {stats.map(s => (
          <div key={s.label} style={{ ...card, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: s.color }} />
            <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--mono)' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--green)', marginTop: 4 }}>{s.delta}</div>
            <div style={{ position: 'absolute', right: 14, top: 14, fontSize: 22, opacity: 0.2 }}>{s.icon}</div>
          </div>
        ))}
      </div>

      {/* Middle grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={card}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 14 }}>📊 Subject Progress</div>
          {subjects.map(s => (
            <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ fontSize: 12, width: 80, color: 'var(--text2)' }}>{s.name}</div>
              <div style={{ flex: 1, height: 6, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${s.pct}%`, background: s.color, borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--text3)', width: 30, textAlign: 'right', fontFamily: 'var(--mono)' }}>{s.pct}%</div>
            </div>
          ))}
        </div>

        <div style={card}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 14 }}>⚡ Recent Activity</div>
          {activities.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12, paddingBottom: 12, borderBottom: i < activities.length - 1 ? '0.5px solid var(--border)' : 'none' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color, flexShrink: 0, marginTop: 4 }} />
              <div>
                <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: a.text }} />
                <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insight */}
      <div style={card}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 10 }}>✨ AI Insight of the Day</div>
        <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7 }}>{insight}</div>
      </div>
    </div>
  );
}
