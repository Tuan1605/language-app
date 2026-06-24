import { useState, useEffect, useRef } from 'react';
import type { WritingLesson, Mistake } from '../types';
import { calculateSimilarity } from '../utils/stringSimilarity';

interface WritingViewProps {
  lesson: WritingLesson;
  onComplete: (score: number) => void;
  onCancel: () => void;
  onSaveMistake?: (mistake: Mistake) => void;
}

export function WritingView({ lesson, onComplete, onCancel, onSaveMistake }: WritingViewProps) {
  const [userInput, setUserInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{score: number, diff: {text: string, isError: boolean}[]} | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!userInput.trim()) return;
    setIsSubmitting(true);
    
    // Evaluate score
    const target = lesson.targetText;
    const score = calculateSimilarity(target, userInput);
    
    // Generate diff
    const userWords = userInput.split(/\s+/);
    const targetWords = target.split(/\s+/);
    
    // Very simple diff logic for visual feedback
    const diff = targetWords.map(word => {
      // Clean punctuation for comparison
      const cleanWord = word.replace(/[.,!?]/g, '').toLowerCase();
      const matchFound = userWords.some(uw => uw.replace(/[.,!?]/g, '').toLowerCase() === cleanWord);
      return {
        text: word,
        isError: !matchFound
      };
    });

    setFeedback({ score, diff });

    if (score < 80 && onSaveMistake) {
      onSaveMistake({
        id: crypto.randomUUID(),
        type: 'writing',
        data: lesson,
        wrongAnswer: userInput,
        timestamp: new Date().toISOString()
      });
    }

    setTimeout(() => {
      onComplete(score);
    }, 3000); // Wait 3 seconds to show feedback before proceeding
  };

  return (
    <div className="bg-[var(--bg-card)] lingo-card p-6 sm:p-10 max-w-2xl mx-auto w-full animate-in slide-in-from-bottom-8 duration-500">
      <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-[var(--gray-path)]">
        <div>
          <h2 className="text-2xl font-black text-[var(--text-main)] uppercase tracking-tight">Translation Writing</h2>
          <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mt-1">Translate the following sentence</p>
        </div>
        <button onClick={onCancel} className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--gray-bg)] text-[var(--text-muted)] font-black hover:bg-[var(--tint-red)] hover:text-[var(--red)] transition-colors">
          ✕
        </button>
      </div>

      <div className="mb-8">
        <div className="p-6 bg-[var(--bg-hover)] border-2 border-[var(--border-main)] rounded-2xl relative">
          <span className="absolute -top-3 left-4 bg-[var(--blue)] text-white text-[10px] font-black uppercase px-2 py-1 rounded">Source</span>
          <p className="text-xl font-bold text-[var(--text-main)]">{lesson.sourceText}</p>
        </div>
        
        {lesson.hint && (
          <p className="text-xs text-[var(--text-muted)] font-bold mt-2 ml-2 italic">Hint: {lesson.hint}</p>
        )}
      </div>

      <div className="mb-8">
        <textarea
          ref={inputRef}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={isSubmitting}
          placeholder="Type your translation here..."
          className="w-full bg-[var(--bg-hover)] border-2 border-[var(--border-main)] rounded-2xl p-4 font-bold text-[var(--text-main)] min-h-[120px] outline-none focus:border-[var(--blue)] transition-all resize-none disabled:opacity-50"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
      </div>

      {feedback && (
        <div className="mb-8 animate-in fade-in zoom-in duration-300">
          <div className={`p-6 rounded-2xl border-2 ${feedback.score >= 80 ? 'bg-[var(--tint-green)] border-[var(--green)]' : 'bg-[var(--tint-red)] border-[var(--red)]'}`}>
            <h3 className={`font-black text-lg mb-2 ${feedback.score >= 80 ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
              {feedback.score >= 80 ? 'Excellent Translation!' : 'Needs Improvement'} ({Math.round(feedback.score)}%)
            </h3>
            
            <p className="text-sm font-bold text-[var(--text-main)] leading-relaxed mt-4">
              <span className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-1">Target Sentence:</span>
              {feedback.diff.map((wordObj, i) => (
                <span key={i} className={`mr-1 ${wordObj.isError ? 'text-[var(--red)] underline decoration-2 decoration-[var(--red)] underline-offset-2' : 'text-[var(--green)]'}`}>
                  {wordObj.text}
                </span>
              ))}
            </p>

            {feedback.score < 80 && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => {
                    setFeedback({ score: 100, diff: feedback.diff.map(w => ({ ...w, isError: false })) });
                    setTimeout(() => onComplete(100), 1000);
                  }}
                  className="text-[10px] font-bold text-[var(--text-muted)] hover:text-[var(--green)] underline underline-offset-4 decoration-dotted"
                >
                  Câu trả lời của tôi đồng nghĩa / đúng! (Bỏ qua chấm điểm)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {!feedback && (
        <button 
          onClick={handleSubmit}
          disabled={!userInput.trim() || isSubmitting}
          className="w-full btn-duo btn-blue py-4 text-sm font-black disabled:opacity-50"
        >
          SUBMIT TRANSLATION
        </button>
      )}
    </div>
  );
}
