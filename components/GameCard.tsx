import React from 'react';
import { TabooCard } from '../types';

interface GameCardProps {
  card: TabooCard;
  isVisible: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({ card, isVisible }) => {
  if (!isVisible) {
    return (
      <div className="w-full max-w-sm aspect-[3/4] rounded-3xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center p-8 shadow-2xl">
        <div className="text-center text-slate-500">
            <span className="text-6xl block mb-4">?</span>
            <p className="text-xl font-semibold">Hazırsan?</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-[fadeIn_0.5s_ease-out]">
      {/* Header - Target Word */}
      <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <h2 className="text-4xl font-extrabold text-white tracking-wide uppercase drop-shadow-md relative z-10 break-words">
          {card.word}
        </h2>
      </div>

      {/* Body - Banned Words */}
      <div className="bg-white p-8 space-y-4 min-h-[300px] flex flex-col justify-center">
        <p className="text-xs font-bold text-rose-500 uppercase tracking-widest text-center mb-2">
          Qadağan olunmuş sözlər
        </p>
        <div className="space-y-3">
          {card.bannedWords.map((word, idx) => (
            <div 
              key={idx} 
              className="bg-slate-100 text-slate-800 py-3 px-4 rounded-xl font-semibold text-lg text-center border-b-2 border-slate-200 shadow-sm"
            >
              {word}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};