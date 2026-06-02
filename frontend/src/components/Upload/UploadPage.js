// UploadPage.js
import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef();

  const addFiles = (newFiles) => {
    const list = Array.from(newFiles).map(f => ({
      name: f.name, size: (f.size / 1024).toFixed(1) + ' KB', type: f.type, id: Date.now() + Math.random()
    }));
    setFiles(f => [...f, ...list]);
    toast.success(`${list.length} file(s) uploaded!`);
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
        style={{ border: `1.5px dashed ${drag ? 'var(--accent)' : 'var(--border2)'}`, borderRadius: 12, padding: 40, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', marginBottom: 20, background: drag ? 'rgba(59,130,246,0.03)' : 'transparent' }}
      >
        <div style={{ fontSize: 36, marginBottom: 10, opacity: 0.5 }}>📤</div>
        <div style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 4 }}>Drop PDFs here or click to browse</div>
        <div style={{ fontSize: 12, color: 'var(--text3)' }}>Supports PDF, DOCX, TXT up to 50MB</div>
        <input ref={inputRef} type="file" style={{ display: 'none' }} multiple accept=".pdf,.docx,.txt" onChange={e => addFiles(e.target.files)} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {files.map(f => (
          <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 8 }}>
            <span style={{ fontSize: 18 }}>📄</span>
            <span style={{ flex: 1, fontSize: 13 }}>{f.name}</span>
            <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{f.size}</span>
            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'rgba(16,185,129,0.1)', color: 'var(--green)' }}>Ready</span>
            <button onClick={() => setFiles(files.filter(x => x.id !== f.id))} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 16 }}>×</button>
          </div>
        ))}
        {!files.length && <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 13, padding: 20 }}>No files uploaded yet</div>}
      </div>
    </div>
  );
}
