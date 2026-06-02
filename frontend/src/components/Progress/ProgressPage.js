import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const subjects = [
  { name: 'DSA', data: [55, 62, 70, 68, 75, 82], color: '#3b82f6' },
  { name: 'DBMS', data: [40, 52, 58, 63, 65, 67], color: '#8b5cf6' },
  { name: 'OS', data: [50, 55, 60, 65, 68, 71], color: '#10b981' },
  { name: 'CN', data: [38, 44, 48, 50, 53, 55], color: '#f59e0b' },
];

const topicStats = [
  { name: 'DSA', mcqs: 120, correct: 98, flashcards: 45, streak: 14 },
  { name: 'DBMS', mcqs: 80, correct: 56, flashcards: 32, streak: 10 },
  { name: 'OS', mcqs: 60, correct: 44, flashcards: 28, streak: 8 },
  { name: 'CN', mcqs: 52, correct: 31, flashcards: 20, streak: 6 },
];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function ProgressPage() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) chartInstance.current.destroy();
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
        datasets: subjects.map(s => ({
          label: s.name,
          data: s.data,
          borderColor: s.color,
          backgroundColor: s.color + '12',
          tension: 0.4,
          fill: true,
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: s.color,
        })),
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: '#94a3b8', font: { size: 11, family: 'DM Sans' } } }
        },
        scales: {
          y: { min: 0, max: 100, grid: { color: 'rgba(99,179,237,0.05)' }, ticks: { color: '#475569', font: { size: 10 } } },
          x: { grid: { color: 'rgba(99,179,237,0.05)' }, ticks: { color: '#475569', font: { size: 10 } } },
        },
      },
    });
    return () => chartInstance.current?.destroy();
  }, []);

  const card = { background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 12, padding: 20 };

  return (
    <div>
      {/* Top stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
        <div style={{ ...card, textAlign: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--accent)' }}>78%</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>Weekly Goal</div>
          <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 3, marginTop: 10, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '78%', background: 'var(--accent)', borderRadius: 3 }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 6, fontFamily: 'var(--mono)' }}>312 / 400 MCQs</div>
        </div>
        <div style={{ ...card, textAlign: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--green)' }}>14</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>Day Streak 🔥</div>
          <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginTop: 12, flexWrap: 'wrap' }}>
            {days.map((d, i) => (
              <div key={d} style={{ textAlign: 'center' }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, background: i < 5 ? 'rgba(16,185,129,0.15)' : 'var(--bg3)', border: `0.5px solid ${i < 5 ? 'rgba(16,185,129,0.3)' : 'var(--border)'}` }}>
                  {i < 5 ? '🔥' : '·'}
                </div>
                <div style={{ fontSize: 8, color: 'var(--text3)', marginTop: 2, fontFamily: 'var(--mono)' }}>{d[0]}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ ...card, textAlign: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--amber)' }}>312</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>Total MCQs Solved</div>
          <div style={{ fontSize: 11, color: 'var(--green)', marginTop: 8 }}>↑ 45 solved today</div>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>229 correct (73%)</div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ ...card, marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 14 }}>📈 Subject-wise Score Trend (6 Weeks)</div>
        <canvas ref={chartRef} />
      </div>

      {/* Subject breakdown */}
      <div style={card}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 14 }}>📊 Subject Breakdown</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
          {topicStats.map(s => {
            const pct = Math.round(s.correct / s.mcqs * 100);
            const subj = subjects.find(x => x.name === s.name);
            return (
              <div key={s.name} style={{ padding: 14, background: 'var(--bg3)', borderRadius: 8, border: '0.5px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</span>
                  <span style={{ fontSize: 12, color: subj?.color, fontFamily: 'var(--mono)' }}>{pct}%</span>
                </div>
                <div style={{ height: 4, background: 'var(--bg2)', borderRadius: 2, marginBottom: 10, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: subj?.color, borderRadius: 2 }} />
                </div>
                <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text3)' }}>
                  <span>MCQs: {s.mcqs}</span>
                  <span>✓ {s.correct}</span>
                  <span>🃏 {s.flashcards}</span>
                  <span>🔥 {s.streak}d</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
