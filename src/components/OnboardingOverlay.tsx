import { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, ArrowRight, Target } from 'lucide-react';

export function OnboardingOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const hasSeen = localStorage.getItem('lingomaster_onboarding');
    if (!hasSeen) {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    buttonRef.current?.focus();
  }, [isVisible, step]);

  const handleNext = useCallback(() => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      setIsVisible(false);
      localStorage.setItem('lingomaster_onboarding', 'true');
    }
  }, [step]);

  useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsVisible(false);
        localStorage.setItem('lingomaster_onboarding', 'true');
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, handleNext]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome tutorial"
    >
      <div className="bg-bg-card rounded-[2rem] w-full max-w-md p-8 shadow-2xl relative overflow-hidden flex flex-col items-center text-center animate-in zoom-in-95 duration-500">

        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-tint-blue rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-tint-gold rounded-full blur-3xl opacity-50"></div>

        {step === 0 && (
          <div className="space-y-6 relative z-10 animate-in slide-in-from-right-8 duration-300 w-full flex flex-col items-center">
            <div className="w-24 h-24 bg-tint-blue rounded-full flex items-center justify-center text-5xl mb-2 shadow-inner border-4 border-bg-card">
              👋
            </div>
            <div>
              <h2 className="text-3xl font-black text-text-main mb-3 leading-tight">Welcome to<br/><span className="text-blue">Lingomaster</span></h2>
              <p className="text-sm font-bold text-text-muted leading-relaxed">
                Your ultimate language learning companion. No internet required, all progress is saved directly on your device!
              </p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 relative z-10 animate-in slide-in-from-right-8 duration-300 w-full flex flex-col items-center">
            <div className="w-24 h-24 bg-tint-gold rounded-full flex items-center justify-center mb-2 shadow-inner border-4 border-bg-card text-gold">
              <Target size={48} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-text-main mb-3 leading-tight">Track Your<br/>Mistakes</h2>
              <p className="text-sm font-bold text-text-muted leading-relaxed">
                Every wrong answer is saved in your Mistake Book. Review them regularly to achieve true mastery.
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 relative z-10 animate-in slide-in-from-right-8 duration-300 w-full flex flex-col items-center">
             <div className="w-24 h-24 bg-tint-green rounded-full flex items-center justify-center text-5xl mb-2 shadow-inner border-4 border-bg-card text-green">
              <Sparkles size={48} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-text-main mb-3 leading-tight">Export Your<br/>Data Anytime</h2>
              <p className="text-sm font-bold text-text-muted leading-relaxed">
                Since everything is saved on your device, you can export your data as a JSON file to keep it safe or move to another device.
              </p>
            </div>
          </div>
        )}

        <div className="w-full mt-10 flex flex-col items-center gap-4 relative z-10">
          <div className="flex gap-2 mb-2" role="tablist" aria-label={`Step ${step + 1} of 3`}>
            {[0, 1, 2].map((s) => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${step === s ? 'bg-blue w-6' : 'bg-gray-path-dark'}`}
                role="tab"
                aria-selected={step === s}
                aria-label={`Step ${s + 1}`}
              />
            ))}
          </div>
          <button
            ref={buttonRef}
            onClick={handleNext}
            className="w-full btn-3d btn-blue h-14 text-base flex items-center justify-center gap-2"
          >
            {step === 2 ? 'START LEARNING' : 'CONTINUE'}
            {step !== 2 && <ArrowRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
