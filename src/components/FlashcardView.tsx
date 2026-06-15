import { useState } from 'react';
import type { Flashcard, ReviewGrade } from '../types';

interface FlashcardViewProps {
  card: Flashcard;
  onRate: (grade: ReviewGrade) => void;
}

export function FlashcardView({ card, onRate }: FlashcardViewProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-md">
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className={`w-full h-64 cursor-pointer perspective-1000 transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        <div className="relative w-full h-full shadow-2xl rounded-2xl bg-white flex items-center justify-center p-8 text-center backface-hidden">
          <h2 className="text-4xl font-bold text-gray-800">{card.word}</h2>
          <div className="absolute bottom-4 text-gray-400 text-sm">Chạm để xem nghĩa</div>
        </div>
        <div className="absolute inset-0 w-full h-full shadow-2xl rounded-2xl bg-indigo-50 flex items-center justify-center p-8 text-center backface-hidden rotate-y-180">
          <div className="space-y-4">
            <p className="text-2xl text-gray-700">{card.definition}</p>
            {card.example && <p className="text-sm italic text-gray-500">"{card.example}"</p>}
          </div>
        </div>
      </div>

      {isFlipped && (
        <div className="grid grid-cols-6 gap-2 w-full">
          {[0, 1, 2, 3, 4, 5].map((grade) => (
            <button
              key={grade}
              onClick={() => {
                setIsFlipped(false);
                onRate(grade as ReviewGrade);
              }}
              className={`py-2 rounded-md font-bold text-white transition ${
                grade < 3 ? 'bg-red-400 hover:bg-red-500' : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {grade}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
