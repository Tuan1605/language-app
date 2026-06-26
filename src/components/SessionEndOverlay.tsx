

interface SessionEndOverlayProps {
  title?: string;
  subtitle?: string;
  score?: number;
  totalScore?: number;
  xpEarned?: number;
  onContinue: () => void;
  buttonText?: string;
  type?: 'lesson' | 'quiz';
}

export function SessionEndOverlay({
  title = "Lesson Complete!",
  subtitle,
  score,
  totalScore,
  xpEarned,
  onContinue,
  buttonText = "CONTINUE",
  type = 'lesson'
}: SessionEndOverlayProps) {
  const isQuiz = type === 'quiz';
  const percent = score !== undefined && totalScore !== undefined ? (score / totalScore) * 100 : 0;

  return (
    <div className={`text-center max-w-lg w-full mx-auto animate-in zoom-in-95 duration-500 ${isQuiz ? 'bg-bg-card lingo-card' : 'space-y-8 pop-in pt-10 relative'}`}>
      
      {!isQuiz && (
        <>
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-0 h-0 pointer-events-none">
            {['var(--green)', 'var(--blue)', 'var(--gold)', 'var(--purple)', 'var(--red)', 'var(--blue)', 'var(--gold)', 'var(--green)'].map((c, i) => (
              <span key={i} className="confetti-dot" style={{ backgroundColor: c, left: `${(i - 4) * 22}px`, animationDelay: `${i * 0.06}s` }} />
            ))}
          </div>
          <div className="text-[120px] select-none animate-bounce">🎉</div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-gradient">{title}</h2>
            {xpEarned !== undefined && <p className="text-base font-bold text-text-muted">You earned +{xpEarned} XP</p>}
          </div>
        </>
      )}

      {isQuiz && (
        <>
          <div className="w-24 h-24 bg-tint-blue rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-text-main mb-2 uppercase tracking-tight">{title}</h2>
          {subtitle && <p className="text-[10px] font-black text-text-muted mb-10 uppercase tracking-[0.2em]">{subtitle}</p>}
          
          {score !== undefined && totalScore !== undefined && (
            <div className="relative w-48 h-48 mx-auto mb-10">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="86" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-path" />
                <circle cx="96" cy="96" r="86" stroke="currentColor" strokeWidth="12" fill="transparent" className={percent >= 80 ? 'text-green' : 'text-gold'} strokeDasharray={540.3} strokeDashoffset={540.3 - (540.3 * percent) / 100} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-text-main">{score}</span>
                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Score / {totalScore}</span>
              </div>
            </div>
          )}
        </>
      )}

      <button
        onClick={onContinue}
        className={`w-full h-16 ${isQuiz ? 'btn-3d btn-blue h-14' : 'btn-duo btn-green text-lg mt-10'}`}
      >
        {buttonText}
      </button>
    </div>
  );
}
