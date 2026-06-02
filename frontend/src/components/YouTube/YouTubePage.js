import React, { useState } from 'react';
import { callAIJSON, SYSTEM_PROMPTS } from '../../services/ai';
import toast from 'react-hot-toast';

const emojis = ['💻', '🎯', '📚', '🔥', '⚡', '🧠'];

export default function YouTubePage() {
  const [topic, setTopic] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const getRecs = async () => {
    if (!topic.trim()) { toast.error('Enter a topic first'); return; }
    setLoading(true); setVideos([]);
    try {
      const data = await callAIJSON(
        SYSTEM_PROMPTS.youtube,
        `Recommend 6 YouTube videos/playlists for a CSE student studying: "${topic}".
Return ONLY: [{"title":"video title","channel":"channel name","duration":"e.g. 2:30:00 or Playlist 40 videos","topic":"sub-topic covered","url":"https://youtube.com/..."},...]
Use real channels: Abdul Bari, MIT OCW, freeCodeCamp, Striver, Jenny's Lectures, take U forward, WilliamFiset, Neso Academy, CodeWithHarry, CS Dojo, etc.`
      );
      setVideos(data);
      toast.success('Video recommendations ready!');
    } catch {
      // Fallback
      setVideos([
        { title: 'Data Structures & Algorithms Full Course', channel: 'Abdul Bari', duration: 'Playlist • 80 videos', topic, url: 'https://youtube.com/@abdul_bari' },
        { title: 'DSA Playlist for Placements', channel: 'take U forward (Striver)', duration: 'Playlist • 200+ videos', topic, url: 'https://youtube.com/@takeUforward' },
        { title: 'CS50 — Introduction to Computer Science', channel: 'Harvard CS50', duration: 'Playlist • 12 videos', topic, url: 'https://youtube.com/@cs50' },
        { title: 'Computer Networks Full Course', channel: 'Neso Academy', duration: 'Playlist • 70 videos', topic, url: 'https://youtube.com/@nesoacademy' },
        { title: 'Operating Systems Full Course', channel: "Jenny's Lectures CS IT", duration: 'Playlist • 90 videos', topic, url: 'https://youtube.com/@JennyslecturesCSIT' },
        { title: 'DBMS Full Course', channel: 'Gate Smashers', duration: 'Playlist • 65 videos', topic, url: 'https://youtube.com/@GateSmashers' },
      ]);
      toast.success('Showing popular CSE channels!');
    }
    setLoading(false);
  };

  return (
    <div>
      <input
        value={topic}
        onChange={e => setTopic(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && getRecs()}
        placeholder="Topic: e.g., Dynamic Programming, Computer Networks, OS Concepts, React.js, Machine Learning..."
        style={{ width: '100%', padding: '10px 14px', background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, fontFamily: 'var(--sans)', outline: 'none', marginBottom: 12 }}
      />
      <button onClick={getRecs} disabled={loading} style={{ marginBottom: 24, padding: '10px 24px', borderRadius: 8, background: '#ef4444', border: 'none', color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--sans)', opacity: loading ? 0.7 : 1 }}>
        {loading ? '⏳ Finding videos...' : '▶️ Get AI Recommendations'}
      </button>

      {videos.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
          {videos.map((v, i) => (
            <div key={i} onClick={() => window.open(v.url || 'https://youtube.com', '_blank')} style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ height: 100, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, position: 'relative' }}>
                {emojis[i % emojis.length]}
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(239,68,68,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, position: 'absolute', marginLeft: 40 }}>▶</div>
                <div style={{ position: 'absolute', bottom: 6, right: 6, background: 'rgba(0,0,0,0.8)', fontSize: 10, padding: '1px 5px', borderRadius: 3, fontFamily: 'var(--mono)' }}>
                  {v.duration}
                </div>
              </div>
              <div style={{ padding: '10px 12px' }}>
                <div style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.5, marginBottom: 4 }}>{v.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ color: '#ef4444' }}>▶</span> {v.channel}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!videos.length && !loading && (
        <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 13, padding: 40 }}>
          Enter a topic to get AI-curated YouTube recommendations ↑
        </div>
      )}
    </div>
  );
}
