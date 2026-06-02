import React, { useState, useRef, useEffect } from 'react';
import { callAI, SYSTEM_PROMPTS } from '../../services/ai';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello! I'm your AI study assistant. Ask me anything about CSE — DSA, DBMS, OS, CN, TOC, or software development! 🚀" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    const userMsg = { role: 'user', text };
    setMessages(m => [...m, userMsg]);
    setLoading(true);

    try {
      const reply = await callAI(SYSTEM_PROMPTS.chat, text, history);
      const newHistory = [...history, { role: 'user', content: text }, { role: 'assistant', content: reply }];
      setHistory(newHistory.slice(-16));
      setMessages(m => [...m, { role: 'ai', text: reply }]);
    } catch {
      setMessages(m => [...m, { role: 'ai', text: 'Sorry, I encountered an error. Please try again.' }]);
    }
    setLoading(false);
  };

  const formatText = (text) =>
    text
      .replace(/`([^`]+)`/g, '<code style="background:var(--bg3);padding:1px 5px;border-radius:3px;font-family:var(--mono);font-size:12px">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 110px)' }}>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, maxWidth: '85%', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700,
              background: msg.role === 'ai' ? 'rgba(6,182,212,0.2)' : 'rgba(139,92,246,0.2)',
              color: msg.role === 'ai' ? 'var(--accent2)' : 'var(--accent3)',
              border: `0.5px solid ${msg.role === 'ai' ? 'rgba(6,182,212,0.3)' : 'rgba(139,92,246,0.3)'}`,
            }}>
              {msg.role === 'ai' ? 'AI' : 'You'}
            </div>
            <div style={{
              padding: '10px 14px', borderRadius: 10, fontSize: 13, lineHeight: 1.6,
              background: msg.role === 'ai' ? 'var(--card)' : 'rgba(59,130,246,0.12)',
              border: `0.5px solid ${msg.role === 'ai' ? 'var(--border)' : 'rgba(59,130,246,0.25)'}`,
              borderRadius: msg.role === 'ai' ? '2px 10px 10px 10px' : '10px 2px 10px 10px',
            }} dangerouslySetInnerHTML={{ __html: formatText(msg.text) }} />
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 10, alignSelf: 'flex-start' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, background: 'rgba(6,182,212,0.2)', color: 'var(--accent2)', border: '0.5px solid rgba(6,182,212,0.3)' }}>AI</div>
            <div style={{ padding: '12px 16px', background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: '2px 10px 10px 10px' }}>
              <div className="typing" style={{ display: 'flex', gap: 3 }}>
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 12, padding: 10 }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Ask about Data Structures, DBMS, OS... (Enter to send)"
          style={{ flex: 1, background: 'none', border: 'none', color: 'var(--text)', fontFamily: 'var(--sans)', fontSize: 13, outline: 'none', resize: 'none', lineHeight: 1.5, minHeight: 20, maxHeight: 120 }}
          rows={1}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 16, flexShrink: 0, opacity: loading || !input.trim() ? 0.4 : 1, transition: 'opacity 0.15s' }}
        >↑</button>
      </div>
    </div>
  );
}
