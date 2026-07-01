import { memo } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuestionItemProps {
  questionId: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  userAnswer: number | undefined;
  isSubmitted: boolean;
  hideOptionD?: boolean;
  onSelect: (questionId: string, optionIndex: number) => void;
}

export const QuestionItem = memo(function QuestionItem({
  questionId,
  questionText,
  options,
  correctAnswer,
  userAnswer,
  isSubmitted,
  hideOptionD = false,
  onSelect,
}: QuestionItemProps) {
  const optionLabels = ['A', 'B', 'C', 'D'];
  const isCorrect = userAnswer === correctAnswer;

  return (
    <div className="flex items-center gap-2 py-1 px-1.5 rounded hover:bg-gray-50">
      <span className="w-6 font-bold text-gray-400 text-[11px] shrink-0">{questionId}.</span>
      <div className="flex gap-1">
        {optionLabels.map((lbl, idx) => {
          if (hideOptionD && idx === 3) return null;

          const isSelected = userAnswer === idx;
          const isActualCorrect = isSubmitted && correctAnswer === idx;
          const isWrongSelected = isSubmitted && isSelected && !isCorrect;

          let bgClass = "bg-gray-100 border-gray-300 text-gray-500";
          if (isSubmitted) {
            if (isActualCorrect) bgClass = "bg-green-500 border-green-600 text-white";
            else if (isWrongSelected) bgClass = "bg-red-500 border-red-500 text-white";
            else bgClass = "bg-gray-50 border-gray-200 text-gray-300";
          } else if (isSelected) {
            bgClass = "bg-blue-600 border-blue-700 text-white";
          }

          return (
            <button
              key={lbl}
              onClick={() => onSelect(questionId, idx)}
              disabled={isSubmitted}
              className={`w-8 h-8 rounded-full border text-xs font-bold transition-all ${bgClass} ${!isSubmitted && 'cursor-pointer active:scale-90 hover:border-blue-400'}`}
            >
              {lbl}
            </button>
          );
        })}
      </div>
      {isSubmitted && (
        <div className="w-5 flex justify-end shrink-0">
          {isCorrect ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
        </div>
      )}
    </div>
  );
});
