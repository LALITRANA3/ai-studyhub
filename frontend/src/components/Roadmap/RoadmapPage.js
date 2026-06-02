import React, { useState } from 'react';
import { callAIJSON, SYSTEM_PROMPTS } from '../../services/ai';
import toast from 'react-hot-toast';

export default function RoadmapPage() {
  const [goal, setGoal] = useState('');
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!goal.trim()) { toast.error('Enter a career goal first'); return; }
    setLoading(true); setSteps([]);
    try {
      const data = await callAIJSON(
        SYSTEM_PROMPTS.roadmap,
        `Generate a 6-step learning roadmap for a CSE student wanting to become: "${goal}".
Return ONLY: [{"title":"Step title","desc":"2-sentence description","tags":["topic1","topic2","topic3"],"status":"done|current|upcoming"},...]
where first 2 are done, 3rd is current, rest upcoming.`
      );
      setSteps(data);
      toast.success('AI Roadmap generated!');
    } catch {
      toast.error('Generation failed. Please try again.');
    }
    setLoading(false);
  };

  const statusColors = {
    done: { bg: 'rgba(16,185,129,0.2)', color: 'var(--green)', border: 'rgba(16,185,129,0.4)' },
    current: { bg: 'rgba(59,130,246,0.2)', color: 'var(--accent)', border: 'rgba(59,130,246,0.4)' },
    upcoming: { bg: 'var(--bg3)', color: 'var(--text3)', border: 'var(--border)' },
  };

  return (
    <div>
      <input
        value={goal}
        onChange={e => setGoal(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && generate()}
        placeholder="Career goal: e.g., Full Stack Developer, ML Engineer, Competitive Programmer, SDE at FAANG, DevOps Engineer..."
        style={{ width: '100%', padding: '10px 14px', background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, fontFamily: 'var(--sans)', outline: 'none', marginBottom: 12 }}
      />
      <button onClick={generate} disabled={loading} style={{ marginBottom: 28, padding: '10px 24px', borderRadius: 8, background: 'var(--accent)', border: 'none', color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--sans)', opacity: loading ? 0.7 : 1 }}>
        {loading ? '⏳ Building roadmap...' : '🗺️ Generate AI Roadmap'}
      </button>

      {steps.map((step, i) => {
        const sc = statusColors[step.status] || statusColors.upcoming;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 0, position: 'relative' }}>
            {i < steps.length - 1 && (
              <div style={{ position: 'absolute', left: 15, top: 32, bottom: -20, width: 1, background: `linear-gradient(${sc.color}, transparent)`, zIndex: 0 }} />
            )}
            <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, fontFamily: 'var(--mono)', background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, position: 'relative', zIndex: 1 }}>
              {step.status === 'done' ? '✓' : i + 1}
            </div>
            <div style={{ flex: 1, paddingBottom: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                {step.title}
                {step.status === 'done' && <span style={{ fontSize: 11, color: 'var(--green)', fontWeight: 400 }}>✓ Completed</span>}
                {step.status === 'current' && <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 400 }}>← You are here</span>}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 8 }}>{step.desc}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(step.tags || []).map(tag => (
                  <span key={tag} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'var(--bg3)', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {!steps.length && !loading && (
        <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 13, padding: 40 }}>
          Enter your career goal above to generate a personalized AI roadmap ↑
        </div>
      )}
    </div>
  );
}
