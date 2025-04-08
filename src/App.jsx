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
  const [isPaused, setIsPaused] = useState(false);
  const [bestTime, setBestTime] = useState(() => parseInt(localStorage.getItem('bestTime')) || null);
  const [soundOn, setSoundOn] = useState(() => localStorage.getItem('soundOn') !== 'false');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  const winSound = new Audio('/sounds/win.mp3');

  useEffect(() => {
    shuffleCards();
  }, [selectedTheme, level]);

  const shuffleCards = () => {
    const count = levels[level];
    const selected = themes[selectedTheme]?.slice(0, count);
    if (!selected) return;
    const deck = [...selected, ...selected]
      .map((emoji) => ({ src: emoji, id: Math.random(), matched: false }))
      .sort(() => Math.random() - 0.5);

    setCards(deck);
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(0);
    setTime(0);
    setIsPaused(false);
    localStorage.removeItem('savedGame');
  };

  useEffect(() => {
    if (!isPaused && cards.length) {
      const interval = setInterval(() => setTime((prev) => prev + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [cards.length, isPaused]);

  const handleChoice = (card) => {
    if (!disabled && !isPaused) {
      choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
    }
  };

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCards((prev) =>
          prev.map((card) =>
            card.src === choiceOne.src ? { ...card, matched: true } : card
          )
        );
        resetTurn();
      } else {
        setTimeout(resetTurn, 800);
      }
    }
  }, [choiceOne, choiceTwo]);

  useEffect(() => {
    const allMatched = cards.length > 0 && cards.every((card) => card.matched);
    if (allMatched) {
      confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });
      if (soundOn) winSound.play();
      if (!bestTime || time < bestTime) {
        setBestTime(time);
        localStorage.setItem('bestTime', time.toString());
      }
    }
  }, [cards]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prev) => prev + 1);
    setDisabled(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 to-pink-200 dark:from-gray-900 dark:to-gray-800 text-black dark:text-white transition-colors px-2 sm:px-4">
      <div className="max-w-5xl mx-auto text-center py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-2">
          <h1 className="text-3xl sm:text-4xl font-bold">🧠 Memory Match</h1>
          <div className="flex flex-wrap gap-2 items-center justify-center">
            <select
              className="px-3 py-1 rounded bg-white dark:bg-gray-700"
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
            >
              <option value="food">🍔 Food</option>
              <option value="animals">🐾 Animals</option>
              <option value="fruits">🍎 Fruits</option>
            </select>
            <select
              className="px-3 py-1 rounded bg-white dark:bg-gray-700"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="easy">🥉 Easy (3x2)</option>
              <option value="medium">🥈 Medium (4x3)</option>
              <option value="hard">🥇 Hard (4x4)</option>
              <option value="expert">👑 Expert (5x4)</option>
            </select>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              onClick={shuffleCards}
            >
              🔄 New Game
            </button>
            <button
              className="px-3 py-1 rounded bg-yellow-300 dark:bg-yellow-600"
              onClick={() => {
                setSoundOn((prev) => {
                  localStorage.setItem('soundOn', !prev);
                  return !prev;
                });
              }}
            >
              {soundOn ? '🔊 Sound On' : '🔇 Muted'}
            </button>
            <button
              className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-600"
              onClick={() => setDarkMode((prev) => !prev)}
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button
              className="px-3 py-1 rounded bg-red-400 dark:bg-red-600 text-white"
              onClick={() => setIsPaused((prev) => !prev)}
            >
              {isPaused ? '▶️ Resume' : '⏸️ Pause'}
            </button>
          </div>
        </div>

        <p className="text-lg font-medium">⏱️ Time: {time}s | 🔁 Turns: {turns}</p>
        {bestTime !== null && (
          <p className="text-green-400 font-semibold">🥇 Best Time: {bestTime}s</p>
        )}

        <div
          className={`grid justify-center gap-3 mt-6 mx-auto 
          ${level === 'easy' ? 'grid-cols-3' : 
            level === 'medium' ? 'grid-cols-4' : 
            level === 'hard' ? 'grid-cols-4' : 'grid-cols-5'}
          max-w-[90vw] sm:max-w-2xl md:max-w-4xl`}
        >
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              handleChoice={handleChoice}
              flipped={card === choiceOne || card === choiceTwo || card.matched}
              disabled={disabled}
            />
          ))}
        </div>
      </div>
    </div>
  );
}