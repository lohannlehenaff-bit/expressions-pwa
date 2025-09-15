import React, { useState } from "react";
import EXPRESSIONS from "./expressions";

export default function App() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selected, setSelected] = useState(null);

  const question = EXPRESSIONS[index];

  const handleAnswer = (option) => {
    setSelected(option);
    setShowAnswer(true);
    if (option === question.origin) {
      setScore(score + 1);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }
  };

<<<<<<< HEAD
  useEffect(()=> localStorage.setItem('expr_index', index), [index])
  useEffect(()=> localStorage.setItem('expr_score', score), [score])
  useEffect(()=> localStorage.setItem('expr_streak', streak), [streak])

  const nextQuestion = (inc=1) => { setShowAnswer(false); setUserInput(''); setMessage(null); setIndex(i=> (i+inc) % deck.length) }
  const handleChoice = (choice) => {
    if(!question) return
    const correct = choice === question.answer
    if(correct){ setScore(s=>s+10); setStreak(s=>s+1); setMessage({type:'success', text:'Bravo ! ✔'}) }
    else { setScore(s=>Math.max(0,s-5)); setStreak(0); setMessage({type:'error', text:`Non — la bonne réponse est : ${question.answer}`}) }
    setShowAnswer(true)
  }
  const handleCompleteSubmit = () => {
    if(!question) return
    const clean = (userInput||'').trim().toLowerCase()
    const correct = clean === (question.answer||'').toLowerCase()
    if(correct){ setScore(s=>s+12); setStreak(s=>s+1); setMessage({type:'success', text:'Parfait ! ✔'}) }
    else { setScore(s=>Math.max(0,s-6)); setStreak(0); setMessage({type:'error', text:`Presque — la réponse attendue : ${question.answer}`}) }
    setShowAnswer(true)
  }
 const handleReveal = () => { 
  setShowAnswer(true); 
  setMessage({ 
    type: 'info', 
    text: `Indice : ${question.hint || "(pas d'indice)"}`
  }); 
}

  const resetProgress = () => { setIndex(0); setScore(0); setStreak(0); setDeck(shuffleArray(EXPRESSIONS)); setShowAnswer(false); setMessage({type:'info', text:'Progression remise à zéro.'}) }
  const addToFavorites = () => {
    const favs = JSON.parse(localStorage.getItem('expr_favs')||'[]')
    if(!favs.includes(question.id)){ favs.push(question.id); localStorage.setItem('expr_favs', JSON.stringify(favs)); setMessage({type:'success', text:'Ajouté aux favoris'}) }
    else setMessage({type:'info', text:'Déjà dans les favoris'})
  }
  const favCount = useMemo(()=> JSON.parse(localStorage.getItem('expr_favs')||'[]').length, [index])

  if(!question) return <div className="p-6">Chargement...</div>
=======
  const nextQuestion = () => {
    setIndex((index + 1) % EXPRESSIONS.length);
    setShowAnswer(false);
    setSelected(null);
  };
>>>>>>> 8bca028 (Mise à jour App.jsx et expressions.js)

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20, fontFamily: "sans-serif" }}>
      <h1>Quiz des expressions françaises</h1>
      <p><strong>Expression :</strong> {question.phrase}</p>
      <p>Quelle est l’origine de cette expression ?</p>

      {question.options.map((opt, i) => (
        <button
          key={i}
          onClick={() => handleAnswer(opt)}
          disabled={showAnswer}
          style={{
            display: "block",
            margin: "8px 0",
            padding: "10px",
            background:
              showAnswer && opt === question.origin ? "#4caf50" :
              showAnswer && opt === selected ? "#f44336" : "#eee"
          }}
        >
          {opt}
        </button>
      ))}

      {showAnswer && (
        <div style={{ marginTop: 20 }}>
          {selected === question.origin ? <p>✅ Bonne réponse !</p> : <p>❌ Mauvaise réponse.</p>}
          <p><strong>Explication :</strong> {question.explanation}</p>
          <button onClick={nextQuestion} style={{ marginTop: 10 }}>Question suivante ➡️</button>
        </div>
      )}

      <hr />
      <p>Score : {score} | Série : {streak}</p>
    </div>
  );
}
