import React, { useEffect, useState } from 'react';
import Card from './components/Card';
import confetti from 'canvas-confetti';

const themes = {
  food: ['🍕', '🍔', '🍟', '🌮', '🍩', '🍉', '🍓', '🍇', '🍒', '🥑'],
  animals: ['🐶', '🐱', '🐸', '🐵', '🐼', '🦁', '🐰', '🐨', '🦊', '🦄'],
  fruits: ['🍎', '🍌', '🍇', '🍓', '🍍', '🥝', '🍒', '🍑', '🍈', '🥭']
};

const levels = {
  easy: 3,
  medium: 6,
  hard: 8,
  expert: 10
};

export default function App() {
  const [selectedTheme, setSelectedTheme] = useState('food');
  const [level, setLevel] = useState('medium');
  const [cards, setCards] = useState([]);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [turns, setTurns] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [time, setTime] = useState(0);
  const [paused, setPaused] = useState(false);
  const [bestTime, setBestTime] = useState(() => parseInt(localStorage.getItem('bestTime')) || null);
  const [soundOn, setSoundOn] = useState(() => localStorage.getItem('soundOn') !== 'false');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  const winSound = new Audio('/sounds/win.mp3');

  const shuffleCards = () => {
    const count = levels[level];
    const selected = themes[selectedTheme].slice(0, count);
    const deck = [...selected, ...selected]
      .map((emoji) => ({ src: emoji, id: Math.random(), matched: false }))
      .sort(() => Math.random() - 0.5);

    setCards(deck);
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(0);
    setTime(0);
    localStorage.removeItem('savedGame');
  };

  useEffect(() => {
    shuffleCards();
  }, [selectedTheme, level]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!paused) setTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [paused]);

  useEffect(() => {
    const saved = { cards, selectedTheme, level, time, turns };
    localStorage.setItem('savedGame', JSON.stringify(saved));
  }, [cards, time, turns]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleChoice = (card) => {
    if (!disabled) {
      choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
    }
  };

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCards(prev => prev.map(card =>
          card.src === choiceOne.src ? { ...card, matched: true } : card
        ));
        resetTurn();
      } else {
        setTimeout(resetTurn, 700);
      }
    }
  }, [choiceOne, choiceTwo]);

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(prev => prev + 1);
    setDisabled(false);
  };

  useEffect(() => {
    const allMatched = cards.length && cards.every(card => card.matched);
    if (allMatched) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      if (soundOn) winSound.play();
      if (!bestTime || time < bestTime) {
        setBestTime(time);
        localStorage.setItem('bestTime', time.toString());
      }
    }
  }, [cards]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-pink-100 dark:from-gray-900 dark:to-gray-800 text-black dark:text-white transition-colors px-4">
      <div className="max-w-6xl mx-auto py-6 text-center">
        <h1 className="text-4xl font-bold mb-4">🧠 Memory Match</h1>

        <div className="flex flex-wrap justify-center gap-2 mb-4">
          <select className="px-3 py-1 rounded bg-white dark:bg-gray-700" value={selectedTheme} onChange={e => setSelectedTheme(e.target.value)}>
            <option value="food">🍕 Food</option>
            <option value="animals">🐾 Animals</option>
            <option value="fruits">🍎 Fruits</option>
          </select>
          <select className="px-3 py-1 rounded bg-white dark:bg-gray-700" value={level} onChange={e => setLevel(e.target.value)}>
            <option value="easy">🥉 Easy</option>
            <option value="medium">🥈 Medium</option>
            <option value="hard">🥇 Hard</option>
            <option value="expert">👑 Expert</option>
          </select>
          <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={() => setPaused(p => !p)}>
            {paused ? '▶️ Resume' : '⏸️ Pause'}
          </button>
          <button className="px-3 py-1 bg-yellow-400 text-black dark:bg-yellow-600 dark:text-white rounded" onClick={() => setSoundOn(prev => {
            localStorage.setItem('soundOn', !prev);
            return !prev;
          })}>
            {soundOn ? '🔊 Sound On' : '🔇 Muted'}
          </button>
          <button className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded" onClick={() => setDarkMode(prev => !prev)}>
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        <div className="mb-4">
          <button className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 transition" onClick={shuffleCards}>
            🔄 New Game
          </button>
        </div>

        <p className="text-lg mb-1">⏱️ Time: {time}s | 🔁 Turns: {turns}</p>
        {bestTime !== null && <p className="text-green-500 font-semibold">🥇 Best Time: {bestTime}s</p>}

        <div className={`grid justify-center gap-4 mt-6 mx-auto 
          ${level === 'easy' ? 'grid-cols-3' : 
            level === 'medium' ? 'grid-cols-4' : 
            level === 'hard' ? 'grid-cols-4' : 'grid-cols-5'} 
          max-w-[90vw] sm:max-w-2xl md:max-w-5xl`}>
          {cards.map(card => (
            <Card key={card.id} card={card} handleChoice={handleChoice} flipped={card === choiceOne || card === choiceTwo || card.matched} disabled={disabled} />
          ))}
        </div>
      </div>
    </div>
  );
}