import React, { useState } from 'react';
import { callAIJSON, SYSTEM_PROMPTS } from '../../services/ai';
import toast from 'react-hot-toast';

export default function FlashcardsPage() {
  const [topic, setTopic] = useState('');
  const [cards, setCards] = useState([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic.trim()) { toast.error('Enter a topic first'); return; }
    setLoading(true); setCards([]); setIdx(0); setFlipped(false);
    try {
      const data = await callAIJSON(
        SYSTEM_PROMPTS.flashcard,
        `Generate 8 flashcards on: "${topic}" for CSE students.
Return ONLY: [{"front":"term or question","back":"definition or answer"},...]
Keep answers concise (2-3 lines max).`
      );
      setCards(data);
      toast.success('8 flashcards ready!');
    } catch {
      toast.error('Generation failed. Try again.');
    }
    setLoading(false);
  };

  const nav = (dir) => { setIdx(i => (i + dir + cards.length) % cards.length); setFlipped(false); };

  return (
    <div>
      <input
        value={topic}
        onChange={e => setTopic(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && generate()}
        placeholder="Topic: e.g., OS Scheduling Algorithms, Graph Algorithms, SQL Commands, Network Protocols..."
        style={{ width: '100%', padding: '10px 14px', background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, fontFamily: 'var(--sans)', outline: 'none', marginBottom: 12 }}
      />
      <button onClick={generate} disabled={loading} style={{ marginBottom: 24, padding: '10px 24px', borderRadius: 8, background: 'var(--accent)', border: 'none', color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--sans)', opacity: loading ? 0.7 : 1 }}>
        {loading ? '⏳ Generating...' : '✨ Generate Flashcards'}
      </button>

      {cards.length > 0 && (
        <>
          {/* Card */}
          <div
            className={`flashcard-wrap ${flipped ? 'flipped' : ''}`}
            onClick={() => setFlipped(f => !f)}
            style={{ cursor: 'pointer', width: '100%', maxWidth: 480, margin: '0 auto 20px', height: 200, display: 'block' }}
          >
            <div className="flashcard-inner" style={{ width: '100%', height: '100%', position: 'relative' }}>
              <div className="flashcard-face" style={{ position: 'absolute', inset: 0, borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center', background: 'var(--card)', border: '0.5px solid var(--border2)' }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text3)', marginBottom: 12, fontFamily: 'var(--mono)' }}>Tap to reveal</div>
                <div style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.6 }}>{cards[idx]?.front}</div>
              </div>
              <div className="flashcard-face flashcard-back" style={{ position: 'absolute', inset: 0, borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center', background: 'rgba(59,130,246,0.08)', border: '0.5px solid rgba(59,130,246,0.3)' }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text3)', marginBottom: 12, fontFamily: 'var(--mono)' }}>Answer</div>
                <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text)' }}>{cards[idx]?.back}</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={() => nav(-1)} style={{ padding: '7px 18px', borderRadius: 8, border: '0.5px solid var(--border)', background: 'var(--card)', color: 'var(--text2)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--sans)' }}>← Prev</button>
            <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--mono)', minWidth: 60, textAlign: 'center' }}>{idx + 1} / {cards.length}</div>
            <button onClick={() => nav(1)} style={{ padding: '7px 18px', borderRadius: 8, border: '0.5px solid var(--border)', background: 'var(--card)', color: 'var(--text2)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--sans)' }}>Next →</button>
          </div>
          <div style={{ textAlign: 'center', marginTop: 10, fontSize: 11, color: 'var(--text3)' }}>Click the card to flip it</div>

          {/* All cards list */}
          <div style={{ marginTop: 32 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 12 }}>All Cards</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
              {cards.map((c, i) => (
                <div key={i} onClick={() => { setIdx(i); setFlipped(false); window.scrollTo(0, 0); }} style={{ padding: 14, background: i === idx ? 'rgba(59,130,246,0.08)' : 'var(--card)', border: `0.5px solid ${i === idx ? 'rgba(59,130,246,0.3)' : 'var(--border)'}`, borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s' }}>
                  <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>Card {i + 1}</div>
                  <div style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.5 }}>{c.front}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {!cards.length && !loading && (
        <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 13, padding: 40 }}>
          Generate flashcards on any CSE topic above ↑
        </div>
      )}
    </div>
  );
}
