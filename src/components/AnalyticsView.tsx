import { useState } from 'react';
import type { ExamResult, Flashcard } from '../types';

interface AnalyticsViewProps {
  results: ExamResult[];
  cards: Flashcard[];
  activeTrack: 'english' | 'japanese';
}

export function AnalyticsView({ results, cards, activeTrack }: AnalyticsViewProps) {
  const [filterType, setFilterType] = useState<'all' | 'full-exam' | 'mini-quiz'>('all');

  const filteredByLanguage = results.filter(r => (activeTrack === 'english' ? r.category === 'toeic' : r.category === 'n2'));
  const filtered = filteredByLanguage.filter(r => filterType === 'all' || r.type === filterType);
  
  const avgScore = filtered.length > 0 
    ? Math.round((filtered.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions), 0) / filtered.length) * 100)
    : 0;

  // Flashcard stats
  const trackCards = cards.filter(c => c.language === activeTrack);
  const totalCards = trackCards.length;
  const knownCards = trackCards.filter(c => c.easiness >= 2.0).length;
  const learningCards = totalCards - knownCards;
  const masteryPercentage = totalCards > 0 ? Math.round((knownCards / totalCards) * 100) : 0;

  // Chart data (last 10 exams, chronological)
  const chartData = [...filtered]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-10);

  return (
    <div className="bg-[var(--bg-card)] lingo-card p-6 sm:p-10 max-w-5xl mx-auto w-full animate-in slide-in-from-bottom-8 duration-500">
      <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-[var(--text-main)] uppercase tracking-tight">Learning Stats</h2>
          <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mt-2">
            Tracking your {activeTrack === 'english' ? 'TOEIC' : 'N2'} performance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Vocabulary Progress */}
        <div className="bg-[var(--gray-bg)] border-2 border-[var(--gray-path)] rounded-3xl p-6 relative overflow-hidden">
          <h3 className="text-lg font-black uppercase tracking-widest text-[var(--text-main)] mb-6">Vocabulary Mastery</h3>
          <div className="flex items-center gap-6 z-10 relative">
            <div className="relative w-24 h-24 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path className="text-[var(--gray-path)]" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                <path className="text-[var(--green)]" strokeDasharray={`${masteryPercentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-xl font-black text-[var(--green)] leading-none">{masteryPercentage}%</span>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-center border-b-2 border-[var(--border-main)] pb-2">
                <span className="text-xs font-bold text-[var(--text-muted)] uppercase">Total Words</span>
                <span className="font-black text-lg text-[var(--text-main)]">{totalCards}</span>
              </div>
              <div className="flex justify-between items-center border-b-2 border-[var(--border-main)] pb-2">
                <span className="text-xs font-bold text-[var(--text-muted)] uppercase">Known (Mastered)</span>
                <span className="font-black text-lg text-[var(--blue)]">{knownCards}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[var(--text-muted)] uppercase">Learning</span>
                <span className="font-black text-lg text-[var(--gold)]">{learningCards}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Exam Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 bg-[var(--tint-green)] border-2 border-[var(--green)] rounded-3xl text-center flex flex-col justify-center">
            <p className="text-[10px] md:text-xs font-black text-[var(--green)] uppercase opacity-80 mb-2 tracking-wider">Total Completed</p>
            <p className="text-4xl font-black text-[var(--green)]">{filtered.length}</p>
          </div>
          <div className="p-6 bg-[var(--tint-blue)] border-2 border-[var(--blue)] rounded-3xl text-center flex flex-col justify-center">
            <p className="text-[10px] md:text-xs font-black text-[var(--blue)] uppercase opacity-80 mb-2 tracking-wider">Avg Accuracy</p>
            <p className="text-4xl font-black text-[var(--blue)]">{avgScore}%</p>
          </div>
          <div className="col-span-2 p-6 bg-[var(--tint-red)] border-2 border-[var(--red)] rounded-3xl text-center flex flex-col justify-center overflow-hidden">
            <p className="text-[10px] md:text-xs font-black text-[var(--red)] uppercase opacity-80 tracking-wider">Exam Rank</p>
            <p className="text-xl md:text-2xl font-black text-[var(--red)] mt-1 break-words leading-tight">
              {avgScore >= 80 ? 'EXPERT SCHOLAR' : avgScore >= 50 ? 'DEDICATED LEARNER' : 'NOVICE'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-black text-[var(--text-main)] uppercase tracking-widest">Exam History & Trends</h3>
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${filterType === 'all' ? 'bg-[var(--text-main)] text-[var(--bg-main)]' : 'bg-[var(--gray-bg)] text-[var(--text-muted)] hover:bg-[var(--border-main)]'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilterType('full-exam')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${filterType === 'full-exam' ? 'bg-[var(--blue)] text-white' : 'bg-[var(--gray-bg)] text-[var(--text-muted)] hover:bg-[var(--border-main)]'}`}
            >
              Full Tests
            </button>
            <button 
              onClick={() => setFilterType('mini-quiz')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${filterType === 'mini-quiz' ? 'bg-[var(--green)] text-white' : 'bg-[var(--gray-bg)] text-[var(--text-muted)] hover:bg-[var(--border-main)]'}`}
            >
              Quizzes
            </button>
          </div>
        </div>

        {/* Bar Chart */}
        {chartData.length > 0 && (
          <div className="w-full h-48 bg-[var(--bg-hover)] border-2 border-[var(--gray-path)] rounded-2xl p-4 flex items-end gap-2 sm:gap-4 overflow-x-auto custom-scrollbar">
            {chartData.map((res, idx) => {
              const accuracy = Math.round((res.score / res.totalQuestions) * 100);
              const heightStr = `${Math.max(5, accuracy)}%`;
              const colorClass = accuracy >= 80 ? 'bg-[var(--green)]' : accuracy >= 50 ? 'bg-[var(--gold)]' : 'bg-[var(--red)]';
              
              return (
                <div key={res.id || idx} className="flex-1 min-w-[30px] flex flex-col justify-end items-center gap-2 group relative">
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-[var(--text-main)] text-[var(--bg-main)] text-[10px] font-black py-1 px-2 rounded whitespace-nowrap transition-opacity z-10 pointer-events-none">
                    {accuracy}% ({res.score}/{res.totalQuestions})
                  </div>
                  <div className={`w-full rounded-t-sm transition-all duration-500 hover:opacity-80 ${colorClass}`} style={{ height: heightStr }}></div>
                  <span className="text-[8px] font-bold text-[var(--text-muted)] truncate w-full text-center">
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
              <div key={res.id} className="p-5 bg-[var(--bg-hover)] border-2 border-[var(--border-main)] rounded-2xl flex justify-between items-center hover:border-[var(--blue)] transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center text-white font-black shadow-lg ${res.type === 'full-exam' ? 'bg-[var(--blue)]' : 'bg-[var(--green)]'}`}>
                    {res.type === 'full-exam' ? 'F' : 'M'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-black text-[var(--text-main)] uppercase text-xs">{res.difficulty} EXAM</p>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${res.type === 'full-exam' ? 'bg-[var(--tint-blue)] text-[var(--blue)]' : 'bg-[var(--tint-green)] text-[var(--green-shadow)]'}`}>
                        {res.type === 'full-exam' ? 'FULL TEST' : res.type === 'mini-quiz' ? 'MINI QUIZ' : 'LEGACY'}
                      </span>
                    </div>
                    <p className="text-[10px] font-bold text-[var(--text-muted)]">{new Date(res.date).toLocaleDateString()} at {new Date(res.date).toLocaleTimeString()}</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-2xl font-black text-[var(--text-main)] leading-none">{res.score}/{res.totalQuestions}</p>
                   <p className={`text-[9px] font-black uppercase mt-1 ${res.score / res.totalQuestions >= 0.8 ? 'text-[var(--green)]' : 'text-[var(--gold)]'}`}>
                      {res.score / res.totalQuestions >= 0.8 ? 'Excellent' : 'Completed'}
                   </p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center border-2 border-dashed border-[var(--border-main)] rounded-2xl">
               <p className="font-bold text-[var(--text-muted)]">No exam data available for this filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
