import { useState, useEffect } from 'react';
import type { Flashcard } from '../types';
import { Volume2 } from 'lucide-react';
import { speak, langForCategory, hasVoiceFor } from '../utils/tts';
import { stripHtml } from '../utils/text';

interface FlashcardViewProps {
  card: Flashcard;
  onRate: (rating: 'Again' | 'Hard' | 'Good' | 'Easy') => void;
  onArchive?: () => void;
}

export function FlashcardView({ card, onRate, onArchive }: FlashcardViewProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Track voice readiness the same way Listening/Dictation do, so a Firefox
  // user sees a hint instead of silence when no voice has loaded yet.
  const ttsLang = langForCategory(card.language);
  const [voiceReady, setVoiceReady] = useState(() => hasVoiceFor(ttsLang));
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const check = () => setVoiceReady(hasVoiceFor(ttsLang));
    check();
    window.speechSynthesis.addEventListener('voiceschanged', check);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', check);
  }, [ttsLang]);

  // Reuse the shared TTS helper so voice loading / cancellation stays
  // consistent with the rest of the app (Listening / Dictation / Speaking).
  const speakText = (text: string) => {
    if (isSpeaking) return; // prevent overlap on rapid clicks
    setIsSpeaking(true);
    const started = speak(text, {
      lang: ttsLang,
      rate: 0.9,
      onEnd: () => setIsSpeaking(false),
    });
    if (!started) setIsSpeaking(false);
  };

  // Reset flip state when card changes (but don't speak automatically)
  useEffect(() => {
    setIsFlipped(false);
  }, [card.id]);

  // Keyboard shortcuts for rating (1-4 keys)
  useEffect(() => {
    if (!isFlipped) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '1') { setIsFlipped(false); setTimeout(() => onRate('Again'), 300); }
      else if (e.key === '2') { setIsFlipped(false); setTimeout(() => onRate('Hard'), 300); }
      else if (e.key === '3') { setIsFlipped(false); setTimeout(() => onRate('Good'), 300); }
      else if (e.key === '4') { setIsFlipped(false); setTimeout(() => onRate('Easy'), 300); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, onRate]);

  return (
    <div className="flex flex-col items-center space-y-8 w-full max-w-xl lg:max-w-2xl mx-auto">
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className={`w-full h-[320px] sm:h-[380px] lg:h-[450px] cursor-pointer perspective-1000 transition-transform duration-700 transform-style-3d relative ${isFlipped ? 'rotate-y-180' : ''}`}
        role="button"
        tabIndex={0}
        aria-label={isFlipped ? 'Showing meaning – tap to flip back' : `Flashcard: ${card.word} – tap to see meaning`}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsFlipped(!isFlipped); }}
      >
        {/* Front Side */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div className="w-full h-full lingo-card flex flex-col items-center justify-center text-center bg-bg-card relative">
            <span className="absolute top-5 lg:top-6 text-[10px] lg:text-xs font-black text-blue uppercase tracking-[0.2em] bg-tint-blue px-4 py-1.5 rounded-full">
              Question
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                speakText(card.word);
              }}
              disabled={isSpeaking}
              className="absolute top-4 right-5 w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gray-bg flex items-center justify-center hover:bg-blue-light hover:text-blue transition-colors border-2 border-gray-path active:translate-y-1 disabled:opacity-60"
            >
              <Volume2 size={28} className={isSpeaking ? 'animate-pulse' : ''} />
            </button>

            {card.imageUrl ? (
              <div className="flex flex-col items-center gap-3 lg:gap-4 w-full px-6 lg:px-10">
                <div className="w-full h-36 lg:h-48 rounded-2xl overflow-hidden border-2 border-border-main shadow-inner">
                  <img src={card.imageUrl} alt={card.word} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <h2 className="text-3xl lg:text-5xl font-black text-text-main leading-tight break-words">
                  {card.word}
                </h2>
                {card.phonetic && (
                  <p className="text-sm lg:text-lg font-bold text-text-muted">{card.phonetic}</p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 lg:gap-3 px-6">
                <h2 className="text-4xl lg:text-5xl font-black text-text-main leading-tight break-words">
                  {card.word}
                </h2>
                {card.phonetic && (
                  <p className="text-base lg:text-lg font-bold text-text-muted">{card.phonetic}</p>
                )}
              </div>
            )}
            <div className="absolute bottom-5 lg:bottom-6 flex items-center gap-2 text-text-muted font-black text-[10px] lg:text-xs uppercase tracking-widest">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 lg:h-5 lg:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Tap to see meaning
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <div className="w-full h-full lingo-card flex flex-col items-center justify-center text-center text-text-main relative">
            <span className="absolute top-5 lg:top-6 text-[10px] lg:text-xs font-black text-blue uppercase tracking-[0.2em] bg-tint-blue px-4 py-1.5 rounded-full">
              Meaning
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                speakText(card.definition);
              }}
              disabled={isSpeaking}
              className="absolute top-4 right-5 w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gray-bg flex items-center justify-center hover:bg-blue-light hover:text-blue transition-colors border-2 border-gray-path active:translate-y-1 disabled:opacity-60"
            >
              <Volume2 size={28} className={isSpeaking ? 'animate-pulse' : ''} />
            </button>

            <div className="space-y-5 lg:space-y-6 px-6 lg:px-10">
              <p className="text-3xl lg:text-4xl font-black leading-tight">{stripHtml(card.definition)}</p>
              {card.example && (
                <div className="bg-bg-hover p-4 lg:p-5 rounded-xl border-2 border-border-main relative">
                  <p className="text-xs lg:text-sm font-bold italic text-text-muted">
                    "{stripHtml(card.example)}"
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakText(card.example!);
                    }}
                    disabled={isSpeaking}
                    className="mt-2 text-[10px] lg:text-xs bg-gray-bg px-3 py-1.5 rounded-md hover:bg-gray-path disabled:opacity-60 flex items-center justify-center gap-1 text-text-muted"
                  >
                    <Volume2 size={14} className={isSpeaking ? 'animate-pulse' : ''} />
                    {isSpeaking ? 'Đang phát…' : 'Read Example'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rating Controls - 4 LEVELS FOR BETTER SM-2 ACCURACY */}
      <div className={`w-full space-y-5 lg:space-y-6 transition-all duration-500 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <h3 className="text-center text-[10px] lg:text-xs font-black text-text-muted uppercase tracking-[0.2em]">Mức độ thuộc từ?</h3>
        <div className="grid grid-cols-4 gap-2 lg:gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFlipped(false);
              setTimeout(() => onRate('Again'), 300);
            }}
            className="h-14 lg:h-16 btn-3d bg-tint-red text-red border-2 border-red shadow-[0_4px_0_var(--red)] active:shadow-[0_0_0_var(--red)] active:translate-y-1 text-[10px] sm:text-xs lg:text-sm font-black flex items-center justify-center p-0"
          >
            AGAIN
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFlipped(false);
              setTimeout(() => onRate('Hard'), 300);
            }}
            className="h-14 lg:h-16 btn-3d bg-tint-gold text-gold border-2 border-gold shadow-[0_4px_0_var(--gold)] active:shadow-[0_0_0_var(--gold)] active:translate-y-1 text-[10px] sm:text-xs lg:text-sm font-black flex items-center justify-center p-0"
          >
            HARD
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFlipped(false);
              setTimeout(() => onRate('Good'), 300);
            }}
            className="h-14 lg:h-16 btn-3d bg-tint-blue text-blue border-2 border-blue shadow-[0_4px_0_var(--blue)] active:shadow-[0_0_0_var(--blue)] active:translate-y-1 text-[10px] sm:text-xs lg:text-sm font-black flex items-center justify-center p-0"
          >
            GOOD
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFlipped(false);
              setTimeout(() => onRate('Easy'), 300);
            }}
            className="h-14 lg:h-16 btn-3d bg-tint-green text-green border-2 border-green shadow-[0_4px_0_var(--green)] active:shadow-[0_0_0_var(--green)] active:translate-y-1 text-[10px] sm:text-xs lg:text-sm font-black flex items-center justify-center p-0"
          >
            EASY
          </button>
        </div>
        <div className="flex flex-col items-center gap-2 mt-4">
          <p className="text-center text-[9px] lg:text-xs font-bold text-text-muted italic">
            Dễ: ôn lại sau lâu hơn • Khó: ôn lại sớm hơn
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFlipped(false);
              setTimeout(() => {
                if (onArchive) onArchive();
                else onRate('Easy');
              }, 300);
            }}
            className="text-[10px] lg:text-xs font-black uppercase text-text-muted hover:text-red transition-colors tracking-widest border-2 border-transparent hover:border-red px-3 py-1 rounded-lg"
          >
            Đã thuộc (Bỏ qua vĩnh viễn)
          </button>
        </div>
      </div>

      {!voiceReady && (
        <p className="text-xs text-blue font-bold text-center flex items-center justify-center gap-2">
          <Volume2 size={16} /> Bấm nút loa để nghe phát âm online.
        </p>
      )}
    </div>
  );
}
