import React, { useState } from 'react';
import { callAI, SYSTEM_PROMPTS } from '../../services/ai';

const pyqData = [
  { subject: 'DBMS', year: 2023, q: 'Explain the concept of ACID properties with examples. How does each property ensure data integrity?', type: 'Long Answer' },
  { subject: 'DBMS', year: 2022, q: 'What is normalization? Explain 1NF, 2NF, and 3NF with examples. When would you stop at 3NF?', type: 'Long Answer' },
  { subject: 'DBMS', year: 2021, q: 'Explain different types of JOINs in SQL with examples (INNER, LEFT, RIGHT, FULL OUTER).', type: 'Short Answer' },
  { subject: 'OS', year: 2023, q: 'Explain Round Robin scheduling algorithm. Calculate average waiting time for: P1(bt=10), P2(bt=4), P3(bt=5) with quantum=3.', type: 'Problem' },
  { subject: 'OS', year: 2022, q: 'What is deadlock? Explain all four conditions necessary for deadlock. How can deadlock be prevented?', type: 'Short Answer' },
  { subject: 'OS', year: 2021, q: 'Explain paging and segmentation. What are the differences between them?', type: 'Long Answer' },
  { subject: 'DSA', year: 2023, q: 'Write an algorithm for Quick Sort. Analyze its best, average, and worst case time complexity. When does worst case occur?', type: 'Algorithm' },
  { subject: 'DSA', year: 2022, q: 'Explain AVL trees. Show insertion of elements 10, 20, 30, 25, 28 step by step with rotations.', type: 'Problem' },
  { subject: 'DSA', year: 2021, q: 'Implement Dijkstra\'s algorithm for shortest path. What is its time complexity with a min-heap?', type: 'Algorithm' },
  { subject: 'CN', year: 2023, q: 'Explain the OSI model with all 7 layers. What is the role of each layer? Compare OSI with TCP/IP model.', type: 'Long Answer' },
  { subject: 'CN', year: 2022, q: 'What is TCP/IP? Compare TCP and UDP protocols. When would you use each?', type: 'Short Answer' },
  { subject: 'TOC', year: 2023, q: 'Design a DFA to accept strings over {0,1} ending with "01". Draw the transition diagram.', type: 'Problem' },
  { subject: 'TOC', year: 2022, q: 'What is the pumping lemma? Use it to prove L={aⁿbⁿ | n≥1} is not regular.', type: 'Proof' },
];

const subjects = ['All', 'DBMS', 'OS', 'DSA', 'CN', 'TOC'];
const typeColors = { 'Long Answer': '#3b82f6', 'Short Answer': '#8b5cf6', Problem: '#f59e0b', Algorithm: '#10b981', Proof: '#ef4444' };

export default function PYQPage() {
  const [filter, setFilter] = useState('All');
  const [explanations, setExplanations] = useState({});
  const [loading, setLoading] = useState({});

  const filtered = filter === 'All' ? pyqData : pyqData.filter(q => q.subject === filter);

  const explain = async (i, q) => {
    if (explanations[i]) { setExplanations(e => ({ ...e, [i]: undefined })); return; }
    setLoading(l => ({ ...l, [i]: true }));
    try {
      const ans = await callAI(SYSTEM_PROMPTS.pyq, `Explain/solve this CSE exam question concisely: ${q}`);
      setExplanations(e => ({ ...e, [i]: ans }));
    } catch { setExplanations(e => ({ ...e, [i]: 'Failed to load explanation.' })); }
    setLoading(l => ({ ...l, [i]: false }));
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {subjects.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: '5px 14px', borderRadius: 6, border: `0.5px solid ${filter === s ? 'rgba(59,130,246,0.4)' : 'var(--border)'}`, background: filter === s ? 'rgba(59,130,246,0.1)' : 'var(--card)', color: filter === s ? 'var(--accent)' : 'var(--text2)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--sans)' }}>
            {s}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map((q, i) => (
          <div key={i} style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 12, padding: 18 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'rgba(59,130,246,0.1)', color: 'var(--accent)', fontFamily: 'var(--mono)' }}>{q.subject}</span>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'var(--bg3)', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{q.year}</span>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: `${typeColors[q.type]}18`, color: typeColors[q.type] }}>{q.type}</span>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>{q.q}</div>
            <button onClick={() => explain(i, q.q)} disabled={loading[i]} style={{ padding: '5px 12px', borderRadius: 6, border: '0.5px solid var(--border)', background: 'none', color: 'var(--accent2)', fontSize: 11, cursor: 'pointer', fontFamily: 'var(--sans)' }}>
              {loading[i] ? '⏳ Loading...' : explanations[i] ? '▲ Hide Explanation' : '✨ AI Explain'}
            </button>
            {explanations[i] && (
              <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text2)', background: 'var(--bg3)', padding: 12, borderRadius: 6, lineHeight: 1.7 }}
                dangerouslySetInnerHTML={{ __html: explanations[i].replace(/\n/g, '<br>').replace(/`([^`]+)`/g, '<code style="background:var(--bg2);padding:1px 4px;border-radius:3px;font-family:Space Mono,monospace;font-size:11px">$1</code>') }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
