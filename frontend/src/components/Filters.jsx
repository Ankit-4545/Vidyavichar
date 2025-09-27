import React from 'react';

export default function Filters({status, setStatus, onClear}){
  return (
    <div className="filter-bar">
      <select value={status||''} onChange={e=>setStatus(e.target.value||null)}>
        <option value="">All</option>
        <option value="unanswered">Unanswered</option>
        <option value="answered">Answered</option>
        <option value="important">Important</option>
      </select>
      <button onClick={()=>onClear(false)}>Clear All</button>
      <button onClick={()=>onClear(true)}>Clear Answered</button>
    </div>
  );
}
