import type { ReactNode } from 'react';
import React, { useState, useMemo } from 'react';
import type { ExamResult, Flashcard, ReviewLog } from '../types';
import { Book, Headphones, BookOpen, PenTool, Type, Activity, CalendarDays } from 'lucide-react';
import { MASTERY_STABILITY, MASTERY_REPS } from '../utils/constants';

interface AnalyticsViewProps {
  results: ExamResult[];
  cards: Flashcard[];
  reviewLogs: ReviewLog[];
  activeTrack: 'english' | 'japanese';
}

export function AnalyticsView({ results, cards, reviewLogs, activeTrack }: AnalyticsViewProps) {
  const [filterType, setFilterType] = useState<'all' | 'full-exam' | 'mock-exam' | 'mini-quiz'>('all');

  const filtered = useMemo(() => {
    const byLanguage = results.filter(r => (activeTrack === 'english' ? r.category === 'toeic' : r.category === 'n2'));
    return byLanguage.filter(r => filterType === 'all' || r.type === filterType);
  }, [results, activeTrack, filterType]);

  const avgScore = useMemo(() =>
    filtered.length > 0
      ? Math.round((filtered.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions), 0) / filtered.length) * 100)
      : 0
  , [filtered]);

  // Flashcard stats
  const trackCards = useMemo(() => cards.filter(c => c.language === activeTrack), [cards, activeTrack]);
  const totalCards = trackCards.length;
  const knownCards = useMemo(() => trackCards.filter(c => c.stability >= MASTERY_STABILITY && c.reps >= MASTERY_REPS).length, [trackCards]);
  const learningCards = totalCards - knownCards;
  const masteryPercentage = totalCards > 0 ? Math.round((knownCards / totalCards) * 100) : 0;

  // Forecasting Logic
  const forecastMessage = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const trackCardIds = new Set(trackCards.map(c => c.id));
    const newCardsStudiedLast7Days = reviewLogs.filter(log =>
      log.state === 'New' && new Date(log.review) >= sevenDaysAgo && trackCardIds.has(log.cardId)
    ).length;

    const avgNewCardsPerDay = Math.round(newCardsStudiedLast7Days / 7);
    const remainingCards = totalCards - knownCards;

    if (knownCards === totalCards && totalCards > 0) {
      return "You have mastered the entire deck!";
    } else if (avgNewCardsPerDay > 0) {
      const daysToFinish = Math.ceil(remainingCards / avgNewCardsPerDay);
      const finishDate = new Date();
      finishDate.setDate(finishDate.getDate() + daysToFinish);
      return `At your pace of ${avgNewCardsPerDay} new cards/day, you will master the remaining deck by ${finishDate.toLocaleDateString()}.`;
    }
    return "Study new cards to establish a learning rate!";
  }, [trackCards, reviewLogs, totalCards, knownCards]);

  // Heatmap Logic
  const { heatmapData, daysArray } = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const ninetyDaysAgo = new Date(today);
    ninetyDaysAgo.setDate(today.getDate() - 89);

    const trackCardIds = new Set(trackCards.map(c => c.id));
    const heatmap = new Map<string, number>();
    reviewLogs.filter(log => trackCardIds.has(log.cardId)).forEach(log => {
      const reviewDate = new Date(log.review);
      if (reviewDate >= ninetyDaysAgo) {
        const dateStr = reviewDate.toISOString().split('T')[0];
        heatmap.set(dateStr, (heatmap.get(dateStr) || 0) + 1);
      }
    });

    const days = Array.from({ length: 90 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (89 - i));
      return d.toISOString().split('T')[0];
    });

    return { heatmapData: heatmap, daysArray: days };
  }, [trackCards, reviewLogs]);

  // Chart data (last 10 exams, chronological)
  const chartData = useMemo(() =>
    [...filtered]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-10)
  , [filtered]);

  return (
    <div className="bg-bg-card lingo-card p-6 sm:p-10 max-w-5xl mx-auto w-full animate-in slide-in-from-bottom-8 duration-500">
      <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-text-main uppercase tracking-tight">Learning Stats</h2>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-2">
            Tracking your {activeTrack === 'english' ? 'TOEIC' : 'N2'} performance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Vocabulary Progress */}
        <div className="shadow-[var(--shadow-inset-light)] rounded-3xl p-6 relative overflow-hidden">
          <h3 className="text-lg font-black uppercase tracking-widest text-text-main mb-6">Vocabulary Mastery</h3>
          <div className="flex items-center gap-6 z-10 relative">
            <div className="relative w-24 h-24 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path className="text-gray-path" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                <path className="text-green" strokeDasharray={`${masteryPercentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-xl font-black text-green leading-none">{masteryPercentage}%</span>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-center border-b-2 border-border-main pb-2">
                <span className="text-xs font-bold text-text-muted uppercase">Total Words</span>
                <span className="font-black text-lg text-text-main">{totalCards}</span>
              </div>
              <div className="flex justify-between items-center border-b-2 border-border-main pb-2">
                <span className="text-xs font-bold text-text-muted uppercase">Known (Mastered)</span>
                <span className="font-black text-lg text-blue">{knownCards}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-text-muted uppercase">Learning</span>
                <span className="font-black text-lg text-gold">{learningCards}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Exam Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 rounded-3xl text-center flex flex-col justify-center shadow-[var(--shadow-inset-light)]">
            <p className="text-[10px] md:text-xs font-black text-green uppercase opacity-80 mb-2 tracking-wider">Total Completed</p>
            <p className="text-4xl font-black text-green">{filtered.length}</p>
          </div>
          <div className="p-6 rounded-3xl text-center flex flex-col justify-center shadow-[var(--shadow-inset-light)]">
            <p className="text-[10px] md:text-xs font-black text-blue uppercase opacity-80 mb-2 tracking-wider">Avg Accuracy</p>
            <p className="text-4xl font-black text-blue">{avgScore}%</p>
          </div>
          <div className="col-span-2 p-6 rounded-3xl text-center flex flex-col justify-center overflow-hidden shadow-[var(--shadow-inset-light)]">
            <p className="text-[10px] md:text-xs font-black text-purple uppercase opacity-80 mb-2 tracking-wider flex justify-center items-center gap-2">
              <CalendarDays size={16} /> Forecasting
            </p>
            <p className="text-sm font-bold text-text-main leading-snug">
              {forecastMessage}
            </p>
          </div>
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="mb-12">
        <h3 className="text-lg font-black uppercase tracking-widest text-text-main mb-4 flex items-center gap-2">
          <Activity size={20} className="text-green" /> Review Activity (90 Days)
        </h3>
        <div className="w-full bg-bg-hover border-2 border-gray-path rounded-2xl p-6 custom-scrollbar overflow-x-auto">
          <div className="flex gap-1 min-w-[max-content]">
            {/* Split into weeks/columns */}
            {Array.from({ length: Math.ceil(90 / 7) }).map((_, colIndex) => (
              <div key={colIndex} className="flex flex-col gap-1">
                {Array.from({ length: 7 }).map((_, rowIndex) => {
                  const dayIndex = colIndex * 7 + rowIndex;
                  if (dayIndex >= 90) return <div key={rowIndex} className="w-4 h-4" />;
                  
                  const dateStr = daysArray[dayIndex];
                  const count = heatmapData.get(dateStr) || 0;
                  
                  let colorClass = 'bg-border-main/50';
                  if (count > 0 && count <= 10) colorClass = 'bg-tint-green border-green border';
                  else if (count > 10 && count <= 30) colorClass = 'bg-green border-green border';
                  else if (count > 30) colorClass = 'bg-blue border-blue border';
                  
                  return (
                    <div 
                      key={rowIndex} 
                      className={`w-4 h-4 rounded-sm ${colorClass} group relative`}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-text-main text-bg-main text-[10px] font-black py-1 px-2 rounded whitespace-nowrap transition-opacity z-10 pointer-events-none">
                        {count} reviews on {new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="flex justify-end items-center mt-4 gap-2 text-[10px] font-bold text-text-muted">
            <span>Less</span>
            <div className="w-3 h-3 rounded-sm bg-border-main/50"></div>
            <div className="w-3 h-3 rounded-sm bg-tint-green border-green border"></div>
            <div className="w-3 h-3 rounded-sm bg-green border-green border"></div>
            <div className="w-3 h-3 rounded-sm bg-blue border-blue border"></div>
            <span>More</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-black text-text-main uppercase tracking-widest">Exam History & Trends</h3>
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${filterType === 'all' ? 'bg-text-main text-bg-main' : 'bg-gray-bg text-text-muted hover:bg-border-main'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilterType('full-exam')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${filterType === 'full-exam' ? 'bg-blue text-white' : 'bg-gray-bg text-text-muted hover:bg-border-main'}`}
            >
              Full Tests
            </button>
            <button 
              onClick={() => setFilterType('mock-exam')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${filterType === 'mock-exam' ? 'bg-purple text-white' : 'bg-gray-bg text-text-muted hover:bg-border-main'}`}
            >
              Daily
            </button>
            <button 
              onClick={() => setFilterType('mini-quiz')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${filterType === 'mini-quiz' ? 'bg-green text-white' : 'bg-gray-bg text-text-muted hover:bg-border-main'}`}
            >
              Quizzes
            </button>
          </div>
        </div>

        {/* Bar Chart */}
        {chartData.length > 0 && (
          <div className="w-full h-48 bg-bg-hover border-2 border-gray-path rounded-2xl p-4 flex items-end gap-2 sm:gap-4 overflow-x-auto custom-scrollbar">
            {chartData.map((res, idx) => {
              const accuracy = Math.round((res.score / res.totalQuestions) * 100);
              const heightStr = `${Math.max(5, accuracy)}%`;
              const colorClass = accuracy >= 80 ? 'bg-green' : accuracy >= 50 ? 'bg-gold' : 'bg-red';
              
              return (
                <div key={res.id || idx} className="flex-1 min-w-[30px] flex flex-col justify-end items-center gap-2 group relative">
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-text-main text-bg-main text-[10px] font-black py-1 px-2 rounded whitespace-nowrap transition-opacity z-10 pointer-events-none">
                    {accuracy}% ({res.score}/{res.totalQuestions})
                  </div>
                  <div className={`w-full rounded-t-sm transition-all duration-500 hover:opacity-80 ${colorClass}`} style={{ height: heightStr }}></div>
                  <span className="text-[8px] font-bold text-text-muted truncate w-full text-center">
                    {new Date(res.date).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}
                  </span>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {filtered.length > 0 ? (
            [...filtered].reverse().map((res) => (
              <div key={res.id} className="p-5 shadow-[var(--shadow-outset)] rounded-2xl flex justify-between items-center my-4 mx-2">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center text-white font-black shadow-[var(--shadow-outset)] ${res.type === 'full-exam' ? 'bg-blue' : res.type === 'mock-exam' ? 'bg-purple' : 'bg-green'}`}>
                    {res.type === 'full-exam' ? 'F' : res.type === 'mock-exam' ? 'D' : 'M'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-black text-text-main uppercase text-xs">{res.difficulty} EXAM</p>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${res.type === 'full-exam' ? 'bg-tint-blue text-blue' : 'bg-tint-green text-green-shadow'}`}>
                        {res.type === 'full-exam' ? 'FULL TEST' : res.type === 'mini-quiz' ? 'MINI QUIZ' : res.type === 'mock-exam' ? 'DAILY SESSION' : 'LEGACY'}
                      </span>
                    </div>
                    <p className="text-[10px] font-bold text-text-muted">{new Date(res.date).toLocaleDateString()} at {new Date(res.date).toLocaleTimeString()}</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-2xl font-black text-text-main leading-none">{res.score}/{res.totalQuestions}</p>
                   <p className={`text-[9px] font-black uppercase mt-1 ${res.score / res.totalQuestions >= 0.8 ? 'text-green' : 'text-gold'}`}>
                      {res.score / res.totalQuestions >= 0.8 ? 'Excellent' : 'Completed'}
                   </p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center border-2 border-dashed border-border-main rounded-2xl">
               <p className="font-bold text-text-muted">No exam data available for this filter.</p>
            </div>
          )}
        </div>
      </div>

      {/* Skill Breakdown */}
      <div className="mb-12">
        <h3 className="text-lg font-black uppercase tracking-widest text-text-main mb-6">Skill Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {activeTrack === 'english' ? (
            <>
              <SkillCard
                label="Vocabulary"
                learned={trackCards.filter(c => c.topic && !['Part 1', 'Part 2', 'Part 3', 'Part 4'].includes(c.topic)).length}
                total={trackCards.length}
                icon={<Book size={24} />}
              />
              <SkillCard
                label="Listening"
                learned={trackCards.filter(c => c.topic?.includes('Listening')).length}
                total={trackCards.length}
                icon={<Headphones size={24} />}
              />
              <SkillCard
                label="Reading"
                learned={trackCards.filter(c => c.topic?.includes('Reading')).length}
                total={trackCards.length}
                icon={<BookOpen size={24} />}
              />
              <SkillCard
                label="Grammar"
                learned={trackCards.filter(c => c.topic?.includes('Grammar')).length}
                total={trackCards.length}
                icon={<PenTool size={24} />}
              />
            </>
          ) : (
            <>
              <SkillCard
                label="Vocabulary"
                learned={trackCards.filter(c => c.category === 'n2').length}
                total={trackCards.length}
                icon={<Book size={24} />}
              />
              <SkillCard
                label="Kanji"
                learned={trackCards.filter(c => c.topic?.includes('Kanji')).length}
                total={trackCards.length}
                icon={<Type size={24} />}
              />
              <SkillCard
                label="Grammar"
                learned={trackCards.filter(c => c.topic?.includes('Grammar')).length}
                total={trackCards.length}
                icon={<PenTool size={24} />}
              />
              <SkillCard
                label="Reading"
                learned={trackCards.filter(c => c.topic?.includes('Reading')).length}
                total={trackCards.length}
                icon={<BookOpen size={24} />}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SkillCard({ label, learned, total, icon }: { label: string; learned: number; total: number; icon: ReactNode }) {
  const percentage = total > 0 ? Math.round((learned / total) * 100) : 0;
  return (
    <div className="shadow-[var(--shadow-outset)] rounded-2xl p-4 text-center my-2 mx-1">
      <div className="mx-auto w-12 h-12 rounded-xl text-blue flex items-center justify-center mb-3 shadow-[var(--shadow-inset-light)]">
        {React.cloneElement(icon as React.ReactElement<any>, { strokeWidth: 2.5 })}
      </div>
      <p className="text-[10px] font-black text-text-muted uppercase tracking-wider mb-1">{label}</p>
      <p className="text-xl font-black text-text-main">{percentage}%</p>
      <div className="w-full h-2 rounded-full mt-2 overflow-hidden shadow-[var(--shadow-inset-light)]">
        <div
          className="h-full rounded-full transition-all duration-500 bg-blue"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
