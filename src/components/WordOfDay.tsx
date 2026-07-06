import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../data/db';
import { useUserStore } from '../stores/useUserStore';
import { Volume2, Star, ChevronRight, RefreshCw } from 'lucide-react';
import { speak, langForCategory, hasVoiceFor } from '../utils/tts';
import { stripHtml } from '../utils/text';

const STORAGE_KEY = 'lingo_word_of_day';

interface WordOfDayData {
  wordId: string;
  date: string;
}

export function WordOfDay() {
  const activeTrack = useUserStore(s => s.activeTrack);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  // Get or set word of the day
  const wordOfDay = useLiveQuery(async () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if we already have a word for today
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_${activeTrack}`);
      if (saved) {
        const data: WordOfDayData = JSON.parse(saved);
        if (data.date === today) {
          const card = await db.cards.get(data.wordId);
          if (card) return card;
        }
      }
    } catch { /* ignore */ }

    // Pick a new word for today
    const count = await db.cards.where('language').equals(activeTrack).count();
    if (count === 0) return null;

    const seed = today.split('-').reduce((acc, val) => acc + parseInt(val), 0);
    const index = seed % count;
    
    const selectedCard = await db.cards.where('language').equals(activeTrack).offset(index).first();

    if (selectedCard) {
      try {
        localStorage.setItem(`${STORAGE_KEY}_${activeTrack}`, JSON.stringify({
          wordId: selectedCard.id,
          date: today,
        }));
      } catch { /* ignore */ }
    }

    return selectedCard || null;
  }, [activeTrack]);

  if (!wordOfDay) return null;

  const ttsLang = langForCategory(wordOfDay.language);
  const voiceReady = hasVoiceFor(ttsLang);

  const speakWord = () => {
    speak(wordOfDay.word, { lang: ttsLang, rate: 0.9 });
  };

  const refreshWord = () => {
    // Clear saved word to get a new one
    try {
      localStorage.removeItem(`${STORAGE_KEY}_${activeTrack}`);
    } catch { /* ignore */ }
    // Force re-render by reloading
    window.location.reload();
  };

  return (
    <div className="w-full bg-bg-card lingo-card overflow-hidden border-2 border-gold/30">
      {/* Header */}
      <div
        className="p-4 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-yellow-400 flex items-center justify-center">
            <Star size={20} className="text-white" />
          </div>
          <div>
            <p className="text-[9px] font-black text-gold uppercase tracking-[0.2em]">Word of the Day</p>
            <p className="text-lg font-black text-text-main">{wordOfDay.word}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              speakWord();
            }}
            className="w-8 h-8 rounded-lg bg-gray-bg flex items-center justify-center hover:bg-blue-light hover:text-blue transition-colors"
          >
            <Volume2 size={16} />
          </button>
          <ChevronRight
            size={16}
            className={`text-text-muted transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          />
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border-main animate-in slide-in-from-top-2 duration-200">
          {/* Definition */}
          <div className="mt-4 mb-3">
            <p className="text-[9px] font-black text-blue uppercase tracking-[0.2em] mb-1">Definition</p>
            <p className="text-sm font-bold text-text-main">
              {showTranslation ? stripHtml(wordOfDay.definition) : '••••••••'}
            </p>
          </div>

          {/* Phonetic */}
          {wordOfDay.phonetic && (
            <div className="mb-3">
              <p className="text-[9px] font-black text-purple uppercase tracking-[0.2em] mb-1">Pronunciation</p>
              <p className="text-sm font-bold text-text-muted">{wordOfDay.phonetic}</p>
            </div>
          )}

          {/* Example */}
          {wordOfDay.example && (
            <div className="mb-4">
              <p className="text-[9px] font-black text-green uppercase tracking-[0.2em] mb-1">Example</p>
              <p className="text-sm font-bold text-text-muted italic">
                "{showTranslation ? stripHtml(wordOfDay.example) : '••••••••'}"
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className="flex-1 py-2 rounded-xl border-2 border-border-main text-xs font-black text-text-muted hover:border-blue hover:text-blue transition-all"
            >
              {showTranslation ? 'HIDE' : 'REVEAL'}
            </button>
            <button
              onClick={speakWord}
              className="flex-1 py-2 rounded-xl border-2 border-blue bg-tint-blue text-blue text-xs font-black hover:bg-blue hover:text-white transition-all flex items-center justify-center gap-1"
            >
              <Volume2 size={14} />
              LISTEN
            </button>
            <button
              onClick={refreshWord}
              className="py-2 px-3 rounded-xl border-2 border-border-main text-text-muted hover:border-gold hover:text-gold transition-all"
              title="Get new word"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          {!voiceReady && (
            <p className="text-[9px] text-blue font-bold text-center mt-2">
              Tap LISTEN to hear pronunciation online
            </p>
          )}
        </div>
      )}
    </div>
  );
}
