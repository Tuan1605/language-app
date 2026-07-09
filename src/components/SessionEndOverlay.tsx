import { Trophy } from 'lucide-react';

interface SessionEndOverlayProps {
  title?: string;
  subtitle?: string;
  score?: number;
  totalScore?: number;
  onContinue: () => void;
  buttonText?: string;
  type?: 'lesson' | 'quiz';
}

export function SessionEndOverlay({
  title = "Lesson Complete!",
  subtitle,
  score,
  totalScore,
  onContinue,
  buttonText = "CONTINUE",
  type = 'lesson'
}: SessionEndOverlayProps) {
  const isQuiz = type === 'quiz';
  const percent = score !== undefined && totalScore !== undefined ? (score / totalScore) * 100 : 0;

  return (
    <div className={`text-center max-w-lg w-full mx-auto animate-in zoom-in-95 duration-500 ${isQuiz ? 'bg-bg-card lingo-card p-4 md:p-6' : 'space-y-6 md:space-y-8 pop-in pt-6 md:pt-10 relative'}`}>

      {!isQuiz && (
        <>
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-0 h-0 pointer-events-none">
            {['var(--green)', 'var(--blue)', 'var(--gold)', 'var(--purple)', 'var(--red)', 'var(--blue)', 'var(--gold)', 'var(--green)'].map((c, i) => (
              <span key={i} className="confetti-dot" style={{ backgroundColor: c, left: `${(i - 4) * 22}px`, animationDelay: `${i * 0.06}s` }} />
            ))}
          </div>
          <div className="mx-auto w-24 h-24 md:w-32 md:h-32 rounded-2xl md:rounded-[2rem] text-gold flex items-center justify-center mb-6 md:mb-8 shadow-[var(--shadow-outset)] animate-bounce relative">
            <Trophy size={48} strokeWidth={2.5} className="relative z-10 md:hidden" />
            <Trophy size={64} strokeWidth={2.5} className="relative z-10 hidden md:block" />
          </div>
          <div className="space-y-1.5 md:space-y-2">
            <h2 className="text-2xl md:text-4xl font-black text-gradient">{title}</h2>
            {subtitle && <p className="text-base md:text-xl font-bold opacity-80">{subtitle}</p>}
          </div>
        </>
      )}

      {isQuiz && (
        <>
          <div className="w-16 h-16 md:w-24 md:h-24 bg-tint-blue rounded-full flex items-center justify-center mx-auto mb-5 md:mb-8 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-12 md:w-12 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl md:text-3xl font-black text-text-main mb-1.5 md:mb-2 uppercase tracking-tight">{title}</h2>
          {subtitle && <p className="text-[9px] md:text-[10px] font-black text-text-muted mb-6 md:mb-10 uppercase tracking-[0.2em]">{subtitle}</p>}

          {score !== undefined && totalScore !== undefined && (
            <div className="relative w-36 h-36 md:w-48 md:h-48 mx-auto mb-6 md:mb-10">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="86" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-path" />
                <circle cx="96" cy="96" r="86" stroke="currentColor" strokeWidth="12" fill="transparent" className={percent >= 80 ? 'text-green' : 'text-gold'} strokeDasharray={540.3} strokeDashoffset={540.3 - (540.3 * percent) / 100} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl md:text-5xl font-black text-text-main">{score}</span>
                <span className="text-[8px] md:text-[10px] font-black text-text-muted uppercase tracking-widest">Score / {totalScore}</span>
              </div>
            </div>
          )}
        </>
      )}

      <button
        onClick={onContinue}
        className={`w-full ${isQuiz ? 'btn-3d btn-blue h-12 md:h-14' : 'btn-duo btn-green text-base md:text-lg mt-8 md:mt-10'}`}
      >
        {buttonText}
      </button>
    </div>
  );
}
