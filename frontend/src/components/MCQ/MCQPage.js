import React, { useState } from 'react';
import { callAIJSON, SYSTEM_PROMPTS } from '../../services/ai';
import toast from 'react-hot-toast';

export default function MCQPage() {
  const [topic, setTopic] = useState('');
  const [mcqs, setMcqs] = useState([]);
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);

  const generate = async () => {
    if (!topic.trim()) { toast.error('Enter a topic first'); return; }
    setLoading(true); setMcqs([]); setSelected({}); setScore(null);
    try {
      const data = await callAIJSON(
        SYSTEM_PROMPTS.mcq,
        `Generate 5 MCQs on the topic: "${topic}" for CSE university exams. Return ONLY this JSON array:
[{"q":"question","opts":["A. opt1","B. opt2","C. opt3","D. opt4"],"ans":0,"exp":"brief explanation"},...]
where ans is the index (0-3) of the correct option.`
      );
      setMcqs(data);
      toast.success('5 MCQs generated!');
    } catch (e) {
      toast.error('Generation failed. Try a more specific topic.');
    }
    setLoading(false);
  };

  const selectOpt = (qi, oi) => {
    if (selected[qi] !== undefined) return;
    const newSel = { ...selected, [qi]: oi };
    setSelected(newSel);
    if (Object.keys(newSel).length === mcqs.length) {
      const correct = Object.entries(newSel).filter(([qi, oi]) => parseInt(oi) === mcqs[qi].ans).length;
      setScore({ correct, total: mcqs.length, pct: Math.round(correct / mcqs.length * 100) });
    }
  };

  return (
    <div>
      <input
        value={topic}
        onChange={e => setTopic(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && generate()}
        placeholder="Enter topic: e.g., Binary Search Trees, Process Scheduling, SQL Joins, Graph Algorithms..."
        style={{ width: '100%', padding: '10px 14px', background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, fontFamily: 'var(--sans)', outline: 'none', marginBottom: 12 }}
      />
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <button onClick={generate} disabled={loading} style={{ flex: 1, padding: 10, borderRadius: 8, background: 'var(--accent)', border: 'none', color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--sans)', opacity: loading ? 0.7 : 1 }}>
          {loading ? '⏳ Generating...' : '✨ Generate MCQs'}
        </button>
        <button onClick={() => { setMcqs([]); setSelected({}); setScore(null); setTopic(''); }} style={{ padding: '10px 20px', borderRadius: 8, border: '0.5px solid var(--border)', background: 'var(--card)', color: 'var(--text2)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--sans)' }}>
          Clear
        </button>
      </div>

      {score && (
        <div style={{ padding: '10px 16px', background: score.pct >= 60 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `0.5px solid ${score.pct >= 60 ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: 8, marginBottom: 16, fontSize: 14, fontFamily: 'var(--mono)', color: score.pct >= 60 ? 'var(--green)' : 'var(--red)' }}>
          Score: {score.correct}/{score.total} ({score.pct}%) {score.pct >= 80 ? '🏆 Excellent!' : score.pct >= 60 ? '👍 Good!' : '📚 Keep practicing!'}
        </div>
      )}

      {mcqs.map((q, qi) => (
        <div key={qi} style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 14, lineHeight: 1.6 }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text3)' }}>Q{qi + 1}. </span>
            {q.q}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {q.opts.map((opt, oi) => {
              const sel = selected[qi];
              const isSelected = sel === oi;
              const isCorrect = oi === q.ans;
              const isAnswered = sel !== undefined;
              let bg = 'var(--bg3)', border = 'var(--border)', color = 'var(--text)';
              if (isAnswered && isCorrect) { bg = 'rgba(16,185,129,0.1)'; border = 'rgba(16,185,129,0.4)'; color = 'var(--green)'; }
              else if (isAnswered && isSelected && !isCorrect) { bg = 'rgba(239,68,68,0.1)'; border = 'rgba(239,68,68,0.3)'; color = 'var(--red)'; }
              else if (isSelected) { border = 'var(--accent)'; bg = 'rgba(59,130,246,0.08)'; }
              return (
                <div key={oi} onClick={() => selectOpt(qi, oi)} style={{ padding: '10px 14px', borderRadius: 8, border: `0.5px solid ${border}`, cursor: isAnswered ? 'default' : 'pointer', fontSize: 13, transition: 'all 0.15s', background: bg, color, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--bg2)', border: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontFamily: 'var(--mono)', flexShrink: 0 }}>
                    {['A', 'B', 'C', 'D'][oi]}
                  </div>
                  {opt.replace(/^[A-D]\.\s*/, '')}
                </div>
              );
            })}
          </div>
          {selected[qi] !== undefined && (
            <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text2)', padding: 8, background: 'var(--bg3)', borderRadius: 6, lineHeight: 1.6 }}>
              💡 {q.exp}
            </div>
          )}
        </div>
      ))}

      {!mcqs.length && !loading && (
        <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 13, padding: 40 }}>
          Enter a topic above and click Generate to create MCQs ↑
        </div>
      )}
    </div>
  );
}
