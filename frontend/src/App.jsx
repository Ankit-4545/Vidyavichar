import React, { useEffect, useState } from 'react';
import { fetchQuestions, postQuestion, updateQuestion, clearQuestions } from './api';
import NewQuestionForm from './components/NewQuestionForm';
import StickyBoard from './components/StickyBoard';
import { io } from 'socket.io-client';
import Filters from './components/Filters';

const socket = io("http://localhost:5001"); // backend URL

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);


  const loadQuestions = async (status=null) => {
    setLoading(true);
    setError('');
    try {
      const qs = await fetchQuestions(status);
      setQuestions(qs);
    } catch(err) {
      setError('Failed to load questions');
    }
    setLoading(false);
  };

  useEffect(() => { loadQuestions(statusFilter); }, [statusFilter]);


  // Listen for real-time updates
  useEffect(() => {
    socket.on('newQuestion', q => setQuestions(prev => [q, ...prev]));
    socket.on('updateQuestion', q => setQuestions(prev => prev.map(p => p._id === q._id ? q : p)));
    socket.on('deleteQuestion', id => setQuestions(prev => prev.filter(p => p._id !== id)));
    return () => {
      socket.off('newQuestion'); 
      socket.off('updateQuestion');
      socket.off('deleteQuestion');
    };
  }, []);

  const addQuestion = async (payload) => {
    try {
      await postQuestion(payload);
    } catch(err) {
      if(err.response && err.response.status === 409) alert('Duplicate question');
      else alert('Failed to post');
    }
  };

  const patchQuestion = async (id, body) => {
    try {
      await updateQuestion(id, body);
    } catch(err) {
      alert('Failed update');
    }
  };

  const clearAll = async () => {
    if(!window.confirm('Are you sure?')) return;
    await clearQuestions();
    loadQuestions();
  };

  const doClear=async(onlyAnswered)=>{
    if(!window.confirm('Are you sure?'))return;
    await clearQuestions(onlyAnswered);
    loadQuestions(statusFilter);
  }
//   const remove = async (id) => {
//   try {
//     await deleteQuestion(id);
//     setQuestions(prev => prev.filter(q => q._id !== id)); // remove from UI
//   } catch (err) {
//     alert("Failed to delete");
//   }
// };


  return (
    <div className="app-container">
      <h1>VidyaVichar — Live Questions</h1>

      <div className="question-form-wrapper">
        <NewQuestionForm onAdd={addQuestion} />
      </div>
      <div className="filters-wrapper">
        <Filters status={statusFilter} setStatus={setStatusFilter} onClear={doClear}/>
      </div>


      {error && <div style={{color:'red', textAlign:'center'}}>{error}</div>}
      {loading ? <div style={{textAlign:'center'}}>Loading...</div> : null}

      <div className="sticky-board-wrapper">
        <StickyBoard questions={questions} onUpdate={patchQuestion} />
      </div>

      <div style={{textAlign:'center', marginTop:20}}>
        <button onClick={clearAll}>Clear All Questions</button>
      </div>
    </div>
  );
}
