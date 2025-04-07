import React from 'react';

export default function Card({ card, handleChoice, flipped, disabled }) {
  const handleClick = () => {
    if (!disabled && !flipped) handleChoice(card);
  };

  return (
    <div className="w-20 h-20 sm:w-24 sm:h-24 perspective hover:scale-105 transition-transform" onClick={handleClick}>
      <div className={`w-full h-full relative transition-transform duration-300 transform-style-preserve-3d ${flipped ? 'rotate-y-180' : ''}`}>
        <div className="absolute w-full h-full bg-white dark:bg-gray-100 rounded-lg shadow-md text-3xl flex justify-center items-center backface-hidden transform rotate-y-180">
          {card.src}
        </div>
        <div className="absolute w-full h-full bg-gray-800 text-white dark:bg-gray-700 rounded-lg flex justify-center items-center text-3xl backface-hidden">
          ❓
        </div>
      </div>
    </div>
  );
}