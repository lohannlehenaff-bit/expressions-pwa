import React, { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'

const EXPRESSIONS = [
  { id:1, expr:'Donner sa langue au chat', type:'meaning', answer:'Abandonner, ne pas savoir', choices:['Poser une question à son animal','Abandonner, ne pas savoir','Raconter un secret'], hint:'On utilise ça quand on ne sait pas la réponse' },
  { id:2, expr:"Mettre la charrue avant les bœufs", type:'meaning', answer:'Agir dans le mauvais ordre', choices:['Travailler trop dur','Agir dans le mauvais ordre','Faire un compliment'], hint:'Imagines commencer par tirer la charrue sans atteler les boeufs' },
  { id:3, expr:'Avoir le cafard', type:'meaning', answer:'Etre triste, déprimé', choices:['Etre triste, déprimé','Aimer les cafards','Avoir faim'], hint:'Synonyme familier de tristesse' },
  { id:6, expr:'Se creuser la tête', type:'complete', pattern:'Se creuser la _____', answer:'tête', hint:'Penser beaucoup' },
  { id:7, expr:'Tomber dans les pommes', type:'meaning', answer:"S'évanouir", choices:['S\'endormir','S\'acheter des pommes','S\'évanouir'], hint:'Perdre connaissance' },
  { id:8, expr:'Prendre la mouche', type:'meaning', answer:'Se vexer rapidement', choices:['Attraper un insecte','Se vexer rapidement','Rire fort'], hint:'Se fâcher pour une broutille' },
]

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function App(){
  const [deck, setDeck] = useState(() => shuffleArray(EXPRESSIONS))
  const [index, setIndex] = useState(() => Number(localStorage.getItem('expr_index') || 0))
  const [score, setScore] = useState(() => Number(localStorage.getItem('expr_score') || 0))
  const [streak, setStreak] = useState(() => Number(localStorage.getItem('expr_streak') || 0))
  const [showAnswer, setShowAnswer] = useState(false)
  const [userInput, setUserInput] = useState('')
  const [message, setMessage] = useState(null)
  const question = deck[index]

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 grid gap-4">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">Expressions FR — MiniDuolingo</h1>
            <p className="text-sm text-gray-500">Apprends des expressions françaises, petit à petit.</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Score: <strong>{score}</strong></div>
            <div className="text-sm text-gray-600">Streak: <strong>{streak}</strong></div>
            <div className="text-sm text-gray-600">Favoris: <strong>{favCount}</strong></div>
          </div>
        </header>

        <main className="grid gap-4 md:grid-cols-3 md:gap-6">
          <section className="md:col-span-2">
            <motion.div key={question.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="p-6 rounded-xl border border-gray-100 shadow-sm bg-gradient-to-b from-white to-sky-50">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Expression</h2>
                  <p className="mt-2 text-2xl font-bold">{question.expr}</p>
                </div>
                <div className="text-right space-y-2">
                  <button onClick={addToFavorites} className="px-3 py-1 border rounded-md text-sm hover:bg-gray-50">+ Favoris</button>
                  <button onClick={handleReveal} className="px-3 py-1 bg-gray-100 rounded-md text-sm hover:opacity-90">Indice</button>
                </div>
              </div>

              <div className="mt-6">
                {question.type === 'meaning' && (
                  <div className="grid gap-3">
                    {shuffleArray(question.choices).map(c=>(
                      <button key={c} onClick={()=>handleChoice(c)} className="text-left p-3 rounded-lg border hover:shadow-sm">{c}</button>
                    ))}
                  </div>
                )}

                {question.type === 'complete' && (
                  <div className="grid gap-3">
                    <div className="p-4 bg-white rounded-md border">
                      <div className="text-lg font-medium">{question.pattern}</div>
                      <input value={userInput} onChange={(e)=>setUserInput(e.target.value)} className="mt-3 w-full p-2 border rounded-md" placeholder="Tape ta proposition ici" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleCompleteSubmit} className="px-4 py-2 rounded-md border">Valider</button>
                      <button onClick={()=>setUserInput('')} className="px-4 py-2 rounded-md border">Effacer</button>
                    </div>
                  </div>
                )}
              </div>

              {showAnswer && (<div className="mt-4 p-3 rounded-md bg-gray-50 border"><div className="text-sm text-gray-700">Réponse attendue: <strong>{question.answer}</strong></div></div>)}

              {message && (<div className={`mt-4 p-3 rounded-md ${message.type==='success'?'bg-green-50 border-green-200':message.type==='error'?'bg-red-50 border-red-200':'bg-yellow-50 border-yellow-200' } border`}><div className="text-sm">{message.text}</div></div>)}

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">Indice: {question.hint}</div>
                <div className="flex gap-2">
                  <button onClick={()=>nextQuestion(1)} className="px-4 py-2 rounded-md border">Suivant</button>
                  <button onClick={()=>nextQuestion(2)} className="px-4 py-2 rounded-md border">Sauter</button>
                </div>
              </div>
            </motion.div>
          </section>

          <aside className="md:col-span-1">
            <div className="p-4 rounded-xl border bg-white shadow-sm">
              <h3 className="font-semibold">Progression</h3>
              <div className="mt-2 text-sm text-gray-600">Question {index+1} / {deck.length}</div>

              <div className="mt-4">
                <h4 className="text-sm font-medium">Mode rapide</h4>
                <p className="text-xs text-gray-500">Points: +10 / bonne réponse</p>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <button onClick={()=>setDeck(shuffleArray(deck))} className="px-3 py-2 rounded-md border text-sm">Mélanger</button>
                <button onClick={resetProgress} className="px-3 py-2 rounded-md border text-sm">Reset</button>
              </div>

              <div className="mt-4 pt-2 border-t">
                <h4 className="text-sm font-medium">Favoris</h4>
                <p className="text-xs text-gray-500">Garde ici les expressions à revoir.</p>
                <div className="mt-2">
                  <button onClick={() => { const f = JSON.parse(localStorage.getItem('expr_favs')||'[]'); if(f.length === 0){ setMessage({type:'info', text:"Aucun favori pour l'instant"}); return; } const id = f[0]; const pos = deck.findIndex(d=>d.id===id); if(pos>=0) setIndex(pos); }} className="px-3 py-2 rounded-md border text-sm">Aller au favori</button>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl border bg-white shadow-sm">
              <h4 className="font-medium">Statistiques</h4>
              <div className="mt-2 text-sm text-gray-600">Score: {score}</div>
              <div className="text-sm text-gray-600">Streak: {streak}</div>
              <div className="text-sm text-gray-600">Cartes: {deck.length}</div>
            </div>

            <div className="mt-4 text-xs text-gray-500"><p>Version V1 • Créé par ton assistant</p></div>
          </aside>
        </main>

        <footer className="text-center text-sm text-gray-500">
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => { navigator.clipboard && navigator.clipboard.writeText(JSON.stringify(deck)); setMessage({type:'info', text:'Deck copié dans le presse-papiers (JSON)'}); }} className="px-3 py-2 border rounded-md">Exporter</button>
            <button onClick={() => { const data = prompt('Coller JSON de deck ici pour importer :'); try{ const parsed = JSON.parse(data); if(Array.isArray(parsed) && parsed.length>0){ setDeck(parsed); setIndex(0); setMessage({type:'success', text:'Deck importé !'}); } else throw new Error('Format invalide'); } catch(e){ setMessage({type:'error', text:'Import impossible : format invalide.'}); } }} className="px-3 py-2 border rounded-md">Importer</button>
          </div>
        </footer>
      </div>
    </div>
  )
}
