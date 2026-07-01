import { memo } from 'react';
import type { AuthenticExamQuestion } from '../types/authentic';

interface FullQuestionCardProps {
  question: AuthenticExamQuestion;
  questionIndex: number;
  userAnswer: number | undefined;
  isMarked: boolean;
  onSelect: (questionId: string, optionIndex: number) => void;
  onToggleMark: (questionId: string) => void;
}

export const FullQuestionCard = memo(function FullQuestionCard({
  question: q,
  questionIndex,
  userAnswer,
  isMarked,
  onSelect,
  onToggleMark
}: FullQuestionCardProps) {
  const hasMedia = !!(q.passage || q.imageUrl || q.audioUrl);
  
  return (
    <div id={`question-${q.id}`} className="p-6 rounded-[1.5rem] border-2 border-gray-path bg-bg-main shadow-sm flex flex-col relative scroll-mt-6">
      {/* Flag button */}
      <button 
         onClick={() => onToggleMark(q.id)}
         className={`absolute top-6 right-6 p-2 px-3 rounded-xl border-2 transition-all z-10 ${isMarked ? 'bg-tint-yellow border-yellow text-yellow-shadow' : 'bg-transparent border-gray-path text-text-muted hover:bg-gray-bg'}`}
         title="Mark for review"
      >
         <span className="text-xs font-black uppercase tracking-wider">⚑ Flag</span>
      </button>

      <div className={`flex flex-col ${hasMedia ? 'lg:flex-row lg:gap-8' : 'gap-6'} mt-2`}>
        
        {hasMedia && (
          <div className="w-full lg:w-1/2 flex flex-col gap-4 overflow-y-auto max-h-[60vh] pr-2 lg:pr-6 border-b-2 lg:border-b-0 lg:border-r-2 border-gray-path pb-6 lg:pb-0 mb-6 lg:mb-0 scroll-smooth">
             {q.passage && (
               <div className="p-5 bg-gray-bg rounded-2xl border-2 border-gray-path whitespace-pre-wrap text-sm md:text-base font-medium leading-relaxed">
                 {q.passage}
               </div>
             )}
             {q.imageUrl && (
                <img src={q.imageUrl} alt="Question figure" className="w-full h-auto rounded-2xl border-2 border-gray-path object-contain" loading="lazy" />
             )}
             {q.audioUrl && (
               <audio controls src={q.audioUrl} className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500 rounded" />
             )}
          </div>
        )}

        <div className={`w-full flex flex-col gap-6 ${hasMedia ? 'lg:w-1/2' : ''}`}>
          <div className="flex items-start gap-4 pr-24">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue text-white font-black text-sm shrink-0 shadow-sm mt-1">
              {questionIndex + 1}
            </span>
            {q.text && (
              <h3 className="text-xl font-bold text-text-main leading-snug">{q.text}</h3>
            )}
          </div>

          <div className="space-y-3 pl-0 sm:pl-12">
            {q.options.map((opt, oIdx) => {
              const isSelected = userAnswer === oIdx;
              const labels = ['A', 'B', 'C', 'D'];
              return (
                <button
                  key={oIdx}
                  onClick={() => onSelect(q.id, oIdx)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all active:scale-[0.98] ${
                    isSelected 
                      ? 'bg-tint-blue border-blue text-blue' 
                      : 'bg-bg-main border-gray-path hover:bg-gray-bg text-text-main'
                  }`}
                >
                  <span className={`flex items-center justify-center shrink-0 w-8 h-8 rounded-lg font-black text-sm border-2 ${
                    isSelected ? 'border-blue bg-blue text-white' : 'border-gray-path'
                  }`}>
                    {labels[oIdx]}
                  </span>
                  <span className="font-bold text-left flex-1 text-sm sm:text-base">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});
