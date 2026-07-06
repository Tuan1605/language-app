import { useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../data/db';
import { useUserStore } from '../stores/useUserStore';
import { useReviewActions } from '../hooks/useReviewActions';
import { Volume2, ArrowLeft, ArrowRight, Shuffle, RotateCcw, Keyboard } from 'lucide-react';
import { speak, langForCategory } from '../utils/tts';
import { stripHtml } from '../utils/text';

interface QuickReviewViewProps {
  onComplete: () => void;
}

type ReviewMode = 'setup' | 'active' | 'summary';

export function QuickReviewView({ onComplete }: QuickReviewViewProps) {
  const activeTrack = useUserStore(s => s.activeTrack);
  const { handleRateCard } = useReviewActions();

  const [phase, setPhase] = useState<ReviewMode>('setup');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studiedCount, setStudiedCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [isRating, setIsRating] = useState(false);

  const allCards = useLiveQuery(
    () => db.cards.where('language').equals(activeTrack).toArray(),
    [activeTrack]
  );

  const topics = allCards ? Array.from(new Set(allCards.filter(c => c.topic).map(c => c.topic!))).sort() : [];

  const filteredCards = allCards?.filter(c =>
    selectedTopic === 'all' || c.topic === selectedTopic
  );

  const cards = isShuffled
    ? [...(filteredCards || [])].sort(() => Math.random() - 0.5)
    : filteredCards || [];

  // Clamp currentIndex when cards shrinks (e.g. after rating or topic change)
  useEffect(() => {
    if (cards.length > 0 && currentIndex >= cards.length) {
      setCurrentIndex(Math.max(0, cards.length - 1));
    }
  }, [cards.length, currentIndex]);

  const currentCard = cards[currentIndex];

  const handleNext = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setPhase('summary');
    }
  }, [currentIndex, cards.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const handleRate = useCallback(async (rating: 'Again' | 'Hard' | 'Good' | 'Easy') => {
    if (!currentCard || isRating) return;
    setIsRating(true);

    try {
      await handleRateCard(currentCard, rating);
      setStudiedCount(prev => prev + 1);
      if (rating === 'Good' || rating === 'Easy') {
        setCorrectCount(prev => prev + 1);
      }

      setIsFlipped(false);
      handleNext();
    } finally {
      setIsRating(false);
    }
  }, [currentCard, isRating, handleRateCard, handleNext]);

  // Keyboard shortcuts
  useEffect(() => {
    if (phase !== 'active') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault();
          setIsFlipped(prev => !prev);
          break;
        case '1':
        case 'a':
        case 'A':
          if (isFlipped) handleRate('Again');
          break;
        case '2':
        case 'b':
        case 'B':
          if (isFlipped) handleRate('Hard');
          break;
        case '3':
        case 'c':
        case 'C':
          if (isFlipped) handleRate('Good');
          break;
        case '4':
        case 'd':
        case 'D':
          if (isFlipped) handleRate('Easy');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlePrev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
        case 's':
        case 'S':
          e.preventDefault();
          if (currentCard) speak(currentCard.word, { lang: langForCategory(currentCard.language) });
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          setIsShuffled(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, isFlipped, currentCard, handleRate, handlePrev, handleNext]);

  const startReview = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setStudiedCount(0);
    setCorrectCount(0);
    setPhase('active');
  };

  // Setup Phase
  if (phase === 'setup') {
    return (
      <div className="bg-bg-card lingo-card p-10 max-w-2xl mx-auto w-full animate-in slide-in-from-bottom-8 duration-500">
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto rounded-full bg-tint-blue flex items-center justify-center mb-4">
            <RotateCcw size={40} className="text-blue" />
          </div>
          <h2 className="text-3xl font-black text-text-main uppercase tracking-tight mb-2">Quick Review</h2>
          <p className="text-sm font-bold text-text-muted">Lật thẻ siêu nhanh với phím tắt</p>
        </div>

        {/* Topic Filter */}
        {topics.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-black text-text-main mb-4 uppercase tracking-wider">Chủ đề</h3>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full bg-bg-hover border-2 border-border-main rounded-2xl py-3 px-4 font-bold outline-none focus:border-blue transition-all text-text-main text-sm"
            >
              <option value="all">Tất cả ({allCards?.length || 0})</option>
              {topics.map(t => {
                const count = allCards?.filter(c => c.topic === t).length || 0;
                return <option key={t} value={t}>{t} ({count})</option>;
              })}
            </select>
          </div>
        )}

        {/* Shuffle Toggle */}
        <div className="mb-8">
          <button
            onClick={() => setIsShuffled(!isShuffled)}
            className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${
              isShuffled ? 'border-blue bg-tint-blue' : 'border-border-main hover:border-blue'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isShuffled ? 'bg-blue text-white' : 'bg-gray-bg text-text-muted'}`}>
              <Shuffle size={24} />
            </div>
            <div>
              <p className="font-black text-sm text-text-main">{isShuffled ? 'Random Order' : 'Sequential Order'}</p>
              <p className="text-[10px] font-bold text-text-muted">
                {isShuffled ? 'Cards will be shuffled' : 'Cards in topic order'}
              </p>
            </div>
          </button>
        </div>

        {/* Shortcuts Preview */}
        <div className="mb-8">
          <button
            onClick={() => setShowShortcuts(!showShortcuts)}
            className="w-full p-4 rounded-2xl border-2 border-border-main text-left transition-all hover:border-blue"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-bg flex items-center justify-center text-text-muted">
                <Keyboard size={24} />
              </div>
              <div>
                <p className="font-black text-sm text-text-main">Keyboard Shortcuts</p>
                <p className="text-[10px] font-bold text-text-muted">Nhấn để xem hướng dẫn</p>
              </div>
            </div>
          </button>

          {showShortcuts && (
            <div className="mt-4 p-4 bg-bg-hover rounded-2xl border-2 border-border-main">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white rounded border text-xs font-mono">Space</kbd>
                  <span className="text-text-muted">Flip card</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white rounded border text-xs font-mono">1-4</kbd>
                  <span className="text-text-muted">Rate card</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white rounded border text-xs font-mono">←</kbd>
                  <span className="text-text-muted">Previous</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white rounded border text-xs font-mono">→</kbd>
                  <span className="text-text-muted">Next</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white rounded border text-xs font-mono">S</kbd>
                  <span className="text-text-muted">Speak word</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white rounded border text-xs font-mono">R</kbd>
                  <span className="text-text-muted">Toggle shuffle</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card Count */}
        <div className="mb-8 p-4 rounded-xl bg-bg-hover border-2 border-border-main text-center">
          <p className="text-sm font-bold text-text-muted">
            <span className="text-text-main font-black">{cards.length}</span> cards to review
          </p>
        </div>

        {/* Start Button */}
        <button
          onClick={startReview}
          disabled={cards.length === 0}
          className="w-full h-16 btn-3d btn-blue rounded-2xl text-lg font-black disabled:opacity-50"
        >
          START QUICK REVIEW
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
          <RotateCcw size={48} className="text-green" />
        </div>

        <h2 className="text-3xl font-black text-text-main uppercase tracking-tight mb-2">Review Complete!</h2>
        <p className="text-sm font-bold text-text-muted mb-8">Tuyệt vời! Bạn đã hoàn thành buổi review</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-bg-hover border-2 border-border-main">
            <p className="text-3xl font-black text-blue">{studiedCount}</p>
            <p className="text-[10px] font-bold text-text-muted uppercase">Cards Reviewed</p>
          </div>
          <div className="p-4 rounded-2xl bg-bg-hover border-2 border-border-main">
            <p className="text-3xl font-black text-green">{accuracy}%</p>
            <p className="text-[10px] font-bold text-text-muted uppercase">Accuracy</p>
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
            onClick={startReview}
            className="flex-1 h-14 btn-3d btn-blue rounded-2xl font-black"
          >
            REVIEW AGAIN
          </button>
        </div>
      </div>
    );
  }

  // Active Phase
  if (!currentCard) {
    return <div className="w-full text-center py-20 text-text-muted">No cards to review</div>;
  }

  const ttsLangActive = langForCategory(currentCard.language);

  return (
    <div className="w-full max-w-lg mx-auto animate-in slide-in-from-bottom-8 duration-500">
      {/* Header */}
      <div className="bg-bg-card lingo-card p-4 mb-4 flex items-center justify-between">
        <button
          onClick={() => setPhase('summary')}
          className="text-text-muted hover:text-red transition-colors"
        >
          ✕
        </button>

        <div className="flex items-center gap-4">
          <span className="text-sm font-black text-text-main">
            {currentIndex + 1} / {cards.length}
          </span>
          {isShuffled && (
            <Shuffle size={14} className="text-blue" />
          )}
        </div>

        <button
          onClick={() => speak(currentCard.word, { lang: ttsLangActive })}
          className="w-10 h-10 rounded-xl bg-gray-bg flex items-center justify-center hover:bg-blue-light hover:text-blue transition-colors"
        >
          <Volume2 size={20} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-path rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-blue transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
        />
      </div>

      {/* Flashcard */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full cursor-pointer perspective-1000 mb-4"
      >
        <div className={`w-full h-[300px] transition-transform duration-500 transform-style-3d relative ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front */}
          <div className="absolute inset-0 w-full h-full backface-hidden">
            <div className="w-full h-full lingo-card flex flex-col items-center justify-center text-center p-8">
              <p className="text-[10px] font-black text-blue uppercase tracking-[0.2em] mb-4">Word</p>
              <h2 className="text-4xl font-black text-text-main leading-tight break-words">
                {currentCard.word}
              </h2>
              {currentCard.phonetic && (
                <p className="text-base font-bold text-text-muted mt-2">{currentCard.phonetic}</p>
              )}
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-auto">
                Tap or Space to flip
              </p>
            </div>
          </div>

          {/* Back */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
            <div className="w-full h-full lingo-card flex flex-col items-center justify-center text-center p-8">
              <p className="text-[10px] font-black text-green uppercase tracking-[0.2em] mb-4">Meaning</p>
              <p className="text-2xl font-black text-text-main leading-tight">
                {stripHtml(currentCard.definition)}
              </p>
              {currentCard.example && (
                <p className="text-sm font-bold text-text-muted mt-4 italic">
                  "{stripHtml(currentCard.example)}"
                </p>
              )}
              <div className="flex gap-2 mt-4">
                <span className="px-3 py-1 rounded-full bg-tint-blue text-blue text-[10px] font-black">
                  1: Again
                </span>
                <span className="px-3 py-1 rounded-full bg-tint-gold text-gold text-[10px] font-black">
                  2: Hard
                </span>
                <span className="px-3 py-1 rounded-full bg-tint-blue text-blue text-[10px] font-black">
                  3: Good
                </span>
                <span className="px-3 py-1 rounded-full bg-tint-green text-green text-[10px] font-black">
                  4: Easy
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex-1 h-12 rounded-2xl border-2 border-border-main flex items-center justify-center gap-2 font-black text-sm text-text-muted hover:border-blue hover:text-blue transition-all disabled:opacity-30"
        >
          <ArrowLeft size={16} />
          PREV
        </button>

        {isFlipped ? (
          <div className="flex-1 grid grid-cols-4 gap-1">
            <button onClick={() => handleRate('Again')} className="h-12 rounded-xl bg-tint-red text-red border-2 border-red font-black text-xs hover:bg-red hover:text-white transition-all">1</button>
            <button onClick={() => handleRate('Hard')} className="h-12 rounded-xl bg-tint-gold text-gold border-2 border-gold font-black text-xs hover:bg-gold hover:text-white transition-all">2</button>
            <button onClick={() => handleRate('Good')} className="h-12 rounded-xl bg-tint-blue text-blue border-2 border-blue font-black text-xs hover:bg-blue hover:text-white transition-all">3</button>
            <button onClick={() => handleRate('Easy')} className="h-12 rounded-xl bg-tint-green text-green border-2 border-green font-black text-xs hover:bg-green hover:text-white transition-all">4</button>
          </div>
        ) : (
          <button
            onClick={() => setIsFlipped(true)}
            className="flex-1 h-12 btn-3d btn-blue rounded-2xl font-black text-sm"
          >
            SHOW ANSWER
          </button>
        )}

        <button
          onClick={handleNext}
          className="flex-1 h-12 rounded-2xl border-2 border-border-main flex items-center justify-center gap-2 font-black text-sm text-text-muted hover:border-blue hover:text-blue transition-all"
        >
          NEXT
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Shortcut Hints */}
      <div className="mt-4 text-center">
        <p className="text-[9px] font-bold text-text-muted">
          <kbd className="px-1 bg-gray-bg rounded">Space</kbd> flip • <kbd className="px-1 bg-gray-bg rounded">1-4</kbd> rate • <kbd className="px-1 bg-gray-bg rounded">←→</kbd> navigate
        </p>
      </div>
    </div>
  );
}
