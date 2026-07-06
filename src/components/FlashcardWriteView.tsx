import { useState, useEffect } from 'react';
import type { Flashcard } from '../types';
import { Volume2, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { speak, langForCategory, hasVoiceFor } from '../utils/tts';
import { stripHtml } from '../utils/text';

interface FlashcardWriteViewProps {
  card: Flashcard;
  onComplete: (correct: boolean) => void;
  onSkip: () => void;
}

export function FlashcardWriteView({ card, onComplete, onSkip }: FlashcardWriteViewProps) {
  const [userInput, setUserInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const ttsLang = langForCategory(card.language);
  const [voiceReady, setVoiceReady] = useState(() => hasVoiceFor(ttsLang));

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const check = () => setVoiceReady(hasVoiceFor(ttsLang));
    check();
    window.speechSynthesis.addEventListener('voiceschanged', check);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', check);
  }, [ttsLang]);

  // Reset state when card changes
  useEffect(() => {
    setUserInput('');
    setIsSubmitted(false);
    setIsCorrect(false);
    setShowHint(false);
  }, [card.id]);

  const speakText = (text: string) => {
    speak(text, { lang: ttsLang, rate: 0.9 });
  };

  const checkAnswer = () => {
    if (!userInput.trim()) return;

    const target = stripHtml(card.definition).toLowerCase().trim();
    const user = userInput.toLowerCase().trim();

    // Simple similarity check
    const isMatch = target === user ||
      target.includes(user) ||
      user.includes(target) ||
      calculateSimilarity(target, user) > 0.7;

    setIsCorrect(isMatch);
    setIsSubmitted(true);
  };

  const handleContinue = () => {
    onComplete(isCorrect);
  };

  // Simple string similarity
  const calculateSimilarity = (a: string, b: string): number => {
    const wordsA = a.split(/\s+/);
    const wordsB = b.split(/\s+/);
    const intersection = wordsA.filter(w => wordsB.includes(w));
    return intersection.length / Math.max(wordsA.length, wordsB.length);
  };

  const getHint = (): string => {
    const def = stripHtml(card.definition);
    const words = def.split(/\s+/);
    if (words.length <= 2) return def.charAt(0) + '_'.repeat(def.length - 1);
    return words[0] + ' ' + '_'.repeat(5) + ' ' + (words[words.length - 1] || '');
  };

  return (
    <div className="bg-bg-card lingo-card p-10 max-w-2xl mx-auto w-full animate-in slide-in-from-bottom-8 duration-500 relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${card.category === 'toeic' ? 'bg-blue' : 'bg-red'}`}></div>
          <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Write Mode</span>
        </div>
        <button
          onClick={onSkip}
          className="text-text-muted font-black hover:text-text-main transition-colors uppercase tracking-[0.2em] text-[10px]"
        >
          Skip →
        </button>
      </div>

      {/* Word Display */}
      <div className="text-center mb-10">
        <p className="text-[10px] font-black text-blue uppercase tracking-[0.2em] mb-4">What does this mean?</p>
        <div className="flex items-center justify-center gap-3">
          <h2 className="text-5xl font-black text-text-main leading-tight">
            {card.word}
          </h2>
          <button
            onClick={() => speakText(card.word)}
            className="w-12 h-12 rounded-xl bg-gray-bg flex items-center justify-center hover:bg-blue-light hover:text-blue transition-colors border-2 border-gray-path active:translate-y-1"
            aria-label="Listen"
          >
            <Volume2 size={24} />
          </button>
        </div>
        {card.phonetic && (
          <p className="text-lg font-bold text-text-muted mt-2">{card.phonetic}</p>
        )}
      </div>

      {/* Input Area */}
      <div className="mb-8">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={isSubmitted}
          placeholder="Type the meaning/definition here..."
          className="w-full bg-bg-hover border-2 border-border-main rounded-2xl p-6 text-xl font-bold focus:border-blue focus:bg-bg-card transition-all outline-none placeholder:text-text-muted resize-none h-32 text-text-main"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (!isSubmitted) checkAnswer();
              else handleContinue();
            }
          }}
        />
      </div>

      {/* Hint Button */}
      {!isSubmitted && !showHint && (
        <button
          onClick={() => setShowHint(true)}
          className="w-full mb-6 py-2 text-xs font-bold text-text-muted hover:text-blue transition-colors"
        >
          Show Hint
        </button>
      )}

      {/* Hint Display */}
      {showHint && !isSubmitted && (
        <div className="mb-6 p-4 bg-tint-blue rounded-2xl border-2 border-blue text-center">
          <p className="text-sm font-bold text-blue">{getHint()}</p>
        </div>
      )}

      {/* Result Display */}
      {isSubmitted && (
        <div className={`mb-8 p-6 rounded-2xl border-2 animate-in zoom-in-95 duration-300 ${
          isCorrect ? 'bg-tint-green border-green' : 'bg-tint-red border-red'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            {isCorrect ? (
              <CheckCircle size={24} className="text-green" />
            ) : (
              <XCircle size={24} className="text-red" />
            )}
            <h3 className={`text-xl font-black ${isCorrect ? 'text-green' : 'text-red'}`}>
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </h3>
          </div>
          <p className="text-lg font-bold text-text-main">
            {stripHtml(card.definition)}
          </p>
          {card.example && (
            <p className="text-sm text-text-muted mt-2 italic">
              "{stripHtml(card.example)}"
            </p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {!isSubmitted ? (
        <button
          onClick={checkAnswer}
          disabled={!userInput.trim()}
          className={`w-full h-16 btn-3d rounded-2xl text-lg font-black transition-all ${
            userInput.trim() ? 'btn-blue' : 'bg-bg-hover text-text-muted border-b-4 border-border-main'
          }`}
        >
          CHECK ANSWER
        </button>
      ) : (
        <button
          onClick={handleContinue}
          className="w-full h-16 btn-3d btn-green rounded-2xl text-lg font-black flex items-center justify-center gap-2"
        >
          CONTINUE
          <ArrowRight size={20} />
        </button>
      )}

      {!voiceReady && (
        <p className="text-xs text-blue font-bold text-center mt-4 flex items-center justify-center gap-2">
          <Volume2 size={16} /> Bấm nút loa để nghe phát âm online.
        </p>
      )}
    </div>
  );
}
