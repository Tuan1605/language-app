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
  const [feedback, setFeedback] = useState<{
    score: number;
    vocabScore: number;
    completenessScore: number;
    diff: { text: string; isError: boolean }[];
    userDiff: { text: string; isError: boolean }[];
  } | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!userInput.trim()) return;
    setIsSubmitting(true);

    const target = lesson.targetText;
    const score = calculateSimilarity(target, userInput);

    // Vocabulary score: how many target words appear in user input
    const targetWords = target.toLowerCase().split(/\s+/).map(w => w.replace(/[.,!?]/g, ''));
    const userWords = userInput.toLowerCase().split(/\s+/).map(w => w.replace(/[.,!?]/g, ''));
    const matchedWords = targetWords.filter(tw => userWords.some(uw => uw === tw));
    const vocabScore = targetWords.length > 0 ? (matchedWords.length / targetWords.length) * 100 : 0;

    // Completeness score: based on length ratio
    const lengthRatio = Math.min(userWords.length / targetWords.length, 1.5);
    const completenessScore = Math.min(lengthRatio * 100, 100);

    // Diff for target sentence (words user missed)
    const diff = target.split(/\s+/).map(word => {
      const cleanWord = word.replace(/[.,!?]/g, '').toLowerCase();
      const matchFound = userWords.some(uw => uw === cleanWord);
      return { text: word, isError: !matchFound };
    });

    // Diff for user input (words not in target)
    const userDiff = userInput.split(/\s+/).map(word => {
      const cleanWord = word.replace(/[.,!?]/g, '').toLowerCase();
      const matchFound = targetWords.some(tw => tw === cleanWord);
      return { text: word, isError: !matchFound };
    });

    setFeedback({ score, vocabScore, completenessScore, diff, userDiff });

    if (score < 80 && onSaveMistake) {
      onSaveMistake({
        id: crypto.randomUUID(),
        type: 'writing',
        data: lesson,
        wrongAnswer: userInput,
        timestamp: new Date().toISOString()
      });
    }
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
            <h3 className={`font-black text-lg mb-4 ${feedback.score >= 80 ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
              {feedback.score >= 80 ? 'Excellent Translation!' : 'Needs Improvement'} ({Math.round(feedback.score)}%)
            </h3>

            {/* Score breakdown */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-3 bg-white/50 rounded-xl">
                <div className="text-lg font-black" style={{ color: feedback.vocabScore >= 80 ? 'var(--green)' : feedback.vocabScore >= 50 ? 'var(--gold)' : 'var(--red)' }}>
                  {Math.round(feedback.vocabScore)}%
                </div>
                <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Vocabulary</div>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-xl">
                <div className="text-lg font-black" style={{ color: feedback.completenessScore >= 80 ? 'var(--green)' : feedback.completenessScore >= 50 ? 'var(--gold)' : 'var(--red)' }}>
                  {Math.round(feedback.completenessScore)}%
                </div>
                <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Completeness</div>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-xl">
                <div className="text-lg font-black" style={{ color: feedback.score >= 80 ? 'var(--green)' : feedback.score >= 50 ? 'var(--gold)' : 'var(--red)' }}>
                  {Math.round(feedback.score)}%
                </div>
                <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Overall</div>
              </div>
            </div>

            {/* Target sentence with word highlights */}
            <div className="mb-3">
              <span className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-1">Target:</span>
              <p className="text-sm font-bold text-[var(--text-main)] leading-relaxed">
                {feedback.diff.map((wordObj, i) => (
                  <span key={i} className={`mr-1 ${wordObj.isError ? 'text-[var(--red)] underline decoration-2 decoration-[var(--red)] underline-offset-2' : 'text-[var(--green)]'}`}>
                    {wordObj.text}
                  </span>
                ))}
              </p>
            </div>

            {/* User input with highlights */}
            <div className="mb-3">
              <span className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-1">Your answer:</span>
              <p className="text-sm font-bold text-[var(--text-main)] leading-relaxed">
                {feedback.userDiff.map((wordObj, i) => (
                  <span key={i} className={`mr-1 ${wordObj.isError ? 'text-[var(--gold)] underline decoration-2 decoration-[var(--gold)] underline-offset-2' : 'text-[var(--green)]'}`}>
                    {wordObj.text}
                  </span>
                ))}
              </p>
            </div>

            {feedback.score < 80 && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => {
                    setFeedback({ ...feedback, score: 100, vocabScore: 100, completenessScore: 100, diff: feedback.diff.map(w => ({ ...w, isError: false })) });
                  }}
                  className="text-[10px] font-bold text-[var(--text-muted)] hover:text-[var(--green)] underline underline-offset-4 decoration-dotted"
                >
                  My answer is correct/synonymous (skip scoring)
                </button>
              </div>
            )}

            <div className="mt-6 flex justify-center animate-in slide-in-from-bottom-2">
              <button
                onClick={() => onComplete(feedback.score)}
                className="btn-3d btn-green px-8 py-3 rounded-xl text-sm font-black w-full max-w-[200px]"
              >
                CONTINUE
              </button>
            </div>
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
