import React, { useState } from 'react';

export default function NewQuestionForm({ onAdd }){
  const [text,setText] = useState('');
  const [author,setAuthor] = useState('');
  const [error,setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!text.trim()) { setError('Question cannot be empty'); return; }
    // Basic length guard
    if (text.trim().length > 500) { setError('Question too long'); return; }
    await onAdd({ text: text.trim(), author: author.trim() || 'Anonymous' });
    setText('');
  };

  return (
    <form className="form" onSubmit={submit}>
      <textarea placeholder="Type your question..." rows={3} value={text} onChange={e=>setText(e.target.value)} />
      <input placeholder="Your name (optional)" value={author} onChange={e=>setAuthor(e.target.value)} />
      <div style={{display:'flex',gap:8,marginTop:8}}>
        <button type="submit">Post Question</button>
        <div style={{color:'red',alignSelf:'center'}}>{error}</div>
      </div>
    </form>
  );
}
