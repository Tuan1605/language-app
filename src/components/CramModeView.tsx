import { useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../data/db';
import { useUserStore } from '../stores/useUserStore';
import { useReviewActions } from '../hooks/useReviewActions';
import { FlashcardView } from './FlashcardView';
import { Timer, Zap, Target, RotateCcw, CheckCircle, AlertTriangle } from 'lucide-react';

interface CramModeViewProps {
  onComplete: () => void;
}

type CramPhase = 'setup' | 'active' | 'summary';

interface CramSettings {
  duration: number; // minutes
  focusArea: 'due' | 'hard' | 'new' | 'mixed';
}

export function CramModeView({ onComplete }: CramModeViewProps) {
  const activeTrack = useUserStore(s => s.activeTrack);
  const { handleRateCard } = useReviewActions();

  const [phase, setPhase] = useState<CramPhase>('setup');
  const [settings, setSettings] = useState<CramSettings>({ duration: 10, focusArea: 'mixed' });
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studiedCount, setStudiedCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const allCards = useLiveQuery(
    () => db.cards.where('language').equals(activeTrack).toArray(),
    [activeTrack]
  );

  const filteredCards = useLiveQuery(async () => {
    if (!allCards) return [];

    const today = new Date().getTime();

    // Get cards based on focus area
    let cards = allCards;

    if (settings.focusArea === 'due') {
      cards = allCards.filter(c => c.next_review && new Date(c.next_review).getTime() <= today);
    } else if (settings.focusArea === 'hard') {
      cards = allCards.filter(c => c.fsrs_difficulty > 6 || c.state === 'Relearning');
    } else if (settings.focusArea === 'new') {
      cards = allCards.filter(c => c.state === 'New');
    } else {
      // mixed: prioritize due > hard > new
      const due = allCards.filter(c => c.next_review && new Date(c.next_review).getTime() <= today);
      const hard = allCards.filter(c => c.fsrs_difficulty > 6 && !(c.next_review && new Date(c.next_review).getTime() <= today));
      const newCards = allCards.filter(c => c.state === 'New' && c.fsrs_difficulty <= 6);
      cards = [...due, ...hard, ...newCards];
    }

    // Shuffle for variety
    return cards.sort(() => Math.random() - 0.5);
  }, [allCards, settings.focusArea]);

  // Timer logic
  useEffect(() => {
    if (phase !== 'active' || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setPhase('summary');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, isPaused]);

  const startCram = useCallback(() => {
    setTimeLeft(settings.duration * 60);
    setCurrentIndex(0);
    setStudiedCount(0);
    setCorrectCount(0);
    setPhase('active');
  }, [settings.duration]);

  const handleRate = async (rating: 'Again' | 'Hard' | 'Good' | 'Easy') => {
    if (!filteredCards || !filteredCards[currentIndex]) return;

    const card = filteredCards[currentIndex];
    await handleRateCard(card, rating);

    setStudiedCount(prev => prev + 1);
    if (rating === 'Good' || rating === 'Easy') {
      setCorrectCount(prev => prev + 1);
    }

    // Move to next card
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Wrap around
      setCurrentIndex(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!filteredCards) {
    return <div className="w-full text-center py-20 text-text-muted">Loading cards...</div>;
  }

  // Setup Phase
  if (phase === 'setup') {
    return (
      <div className="bg-bg-card lingo-card p-10 max-w-2xl mx-auto w-full animate-in slide-in-from-bottom-8 duration-500">
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto rounded-full bg-tint-gold flex items-center justify-center mb-4">
            <Zap size={40} className="text-gold" />
          </div>
          <h2 className="text-3xl font-black text-text-main uppercase tracking-tight mb-2">Cram Mode</h2>
          <p className="text-sm font-bold text-text-muted">Intensive review trước khi thi</p>
        </div>

        {/* Duration Selection */}
        <div className="mb-8">
          <h3 className="text-sm font-black text-text-main mb-4 uppercase tracking-wider">Thời gian</h3>
          <div className="grid grid-cols-3 gap-3">
            {[5, 10, 15, 20, 30, 45].map(mins => (
              <button
                key={mins}
                onClick={() => setSettings(prev => ({ ...prev, duration: mins }))}
                className={`p-4 rounded-2xl border-2 text-center transition-all ${
                  settings.duration === mins
                    ? 'border-gold bg-tint-gold text-gold'
                    : 'border-border-main hover:border-gold'
                }`}
              >
                <p className="text-2xl font-black">{mins}</p>
                <p className="text-[10px] font-bold text-text-muted">phút</p>
              </button>
            ))}
          </div>
        </div>

        {/* Focus Area Selection */}
        <div className="mb-8">
          <h3 className="text-sm font-black text-text-main mb-4 uppercase tracking-wider">Tập trung vào</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'mixed', label: 'Mixed', desc: 'Tất cả từ', icon: <RotateCcw size={20} /> },
              { value: 'due', label: 'Due Review', desc: 'Cần ôn tập', icon: <Timer size={20} /> },
              { value: 'hard', label: 'Hard Cards', desc: 'Từ khó', icon: <AlertTriangle size={20} /> },
              { value: 'new', label: 'New Cards', desc: 'Từ mới', icon: <Zap size={20} /> },
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setSettings(prev => ({ ...prev, focusArea: option.value as CramSettings['focusArea'] }))}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  settings.focusArea === option.value
                    ? 'border-blue bg-tint-blue'
                    : 'border-border-main hover:border-blue'
                }`}
              >
                <div className={`mb-2 ${settings.focusArea === option.value ? 'text-blue' : 'text-text-muted'}`}>
                  {option.icon}
                </div>
                <p className="font-black text-sm text-text-main">{option.label}</p>
                <p className="text-[10px] font-bold text-text-muted">{option.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Card Count Preview */}
        <div className="mb-8 p-4 rounded-xl bg-bg-hover border-2 border-border-main text-center">
          <p className="text-sm font-bold text-text-muted">
            <span className="text-text-main font-black">{filteredCards.length}</span> cards available
          </p>
        </div>

        {/* Start Button */}
        <button
          onClick={startCram}
          disabled={filteredCards.length === 0}
          className="w-full h-16 btn-3d btn-gold rounded-2xl text-lg font-black disabled:opacity-50"
        >
          START CRAM ({settings.duration} MIN)
        </button>
      </div>
    );
  }

  // Summary Phase
  if (phase === 'summary') {
    const accuracy = studiedCount > 0 ? Math.round((correctCount / studiedCount) * 100) : 0;

    return (
      <div className="bg-bg-card lingo-card p-10 max-w-2xl mx-auto w-full animate-in zoom-in-95 duration-500 text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-tint-green flex items-center justify-center mb-6">
          <CheckCircle size={48} className="text-green" />
        </div>

        <h2 className="text-3xl font-black text-text-main uppercase tracking-tight mb-2">Cram Complete!</h2>
        <p className="text-sm font-bold text-text-muted mb-8">Tuyệt vời! Bạn đã hoàn thành buổi luyện tập</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-bg-hover border-2 border-border-main">
            <p className="text-3xl font-black text-blue">{studiedCount}</p>
            <p className="text-[10px] font-bold text-text-muted uppercase">Cards Studied</p>
          </div>
          <div className="p-4 rounded-2xl bg-bg-hover border-2 border-border-main">
            <p className="text-3xl font-black text-green">{accuracy}%</p>
            <p className="text-[10px] font-bold text-text-muted uppercase">Accuracy</p>
          </div>
          <div className="p-4 rounded-2xl bg-bg-hover border-2 border-border-main">
            <p className="text-3xl font-black text-gold">{formatTime(settings.duration * 60 - timeLeft)}</p>
            <p className="text-[10px] font-bold text-text-muted uppercase">Time Spent</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onComplete}
            className="flex-1 h-14 btn-3d btn-gray rounded-2xl font-black"
          >
            Back to Home
          </button>
          <button
            onClick={startCram}
            className="flex-1 h-14 btn-3d btn-gold rounded-2xl font-black"
          >
            CRAM AGAIN
          </button>
        </div>
      </div>
    );
  }

  // Active Phase
  const currentCard = filteredCards[currentIndex];

  return (
    <div className="w-full max-w-2xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
      {/* Cram Header */}
      <div className="bg-bg-card lingo-card p-4 mb-6 flex items-center justify-between">
        <button
          onClick={() => setPhase('summary')}
          className="text-text-muted hover:text-red transition-colors"
        >
          ✕
        </button>

        <div className="flex items-center gap-4">
          {/* Timer */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 ${
            timeLeft <= 60 ? 'border-red bg-tint-red text-red' : 'border-border-main bg-bg-hover text-text-main'
          }`}>
            <Timer size={14} />
            <span className="text-sm font-black tabular-nums">{formatTime(timeLeft)}</span>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-border-main bg-bg-hover">
            <Target size={14} className="text-blue" />
            <span className="text-sm font-black text-text-main">{studiedCount}</span>
          </div>
        </div>

        {/* Pause/Resume */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
            isPaused ? 'bg-green text-white' : 'bg-bg-hover text-text-muted border-2 border-border-main'
          }`}
        >
          {isPaused ? 'RESUME' : 'PAUSE'}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-path rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-green transition-all duration-300"
          style={{ width: `${(timeLeft / (settings.duration * 60)) * 100}%` }}
        />
      </div>

      {/* Flashcard */}
      {currentCard && (
        <FlashcardView
          card={currentCard}
          onRate={handleRate}
        />
      )}

      {/* Quick Actions */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => handleRate('Good')}
          className="px-6 py-3 rounded-2xl bg-tint-green text-green border-2 border-green font-black text-sm hover:bg-green hover:text-white transition-all"
        >
          GOT IT ✓
        </button>
        <button
          onClick={() => handleRate('Again')}
          className="px-6 py-3 rounded-2xl bg-tint-red text-red border-2 border-red font-black text-sm hover:bg-red hover:text-white transition-all"
        >
          AGAIN ✗
        </button>
      </div>
    </div>
  );
}
