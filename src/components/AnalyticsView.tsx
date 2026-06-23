import { useState } from 'react';
import type { ExamResult } from '../types';

interface AnalyticsViewProps {
  results: ExamResult[];
  activeTrack: 'english' | 'japanese';
}

export function AnalyticsView({ results, activeTrack }: AnalyticsViewProps) {
  const [filterType, setFilterType] = useState<'all' | 'full-exam' | 'mini-quiz'>('all');

  const filteredByLanguage = results.filter(r => (activeTrack === 'english' ? r.category === 'toeic' : r.category === 'n2'));
  const filtered = filteredByLanguage.filter(r => filterType === 'all' || r.type === filterType);
  
  const avgScore = filtered.length > 0 
    ? Math.round((filtered.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions), 0) / filtered.length) * 100)
    : 0;

  return (
    <div className="bg-[var(--bg-card)] lingo-card p-10 max-w-4xl mx-auto w-full animate-in slide-in-from-bottom-8 duration-500">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-[var(--text-main)] uppercase tracking-tight">Learning Stats</h2>
        <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mt-2">
          Tracking your {activeTrack === 'english' ? 'TOEIC' : 'N2'} performance
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3 mb-8 border-b-2 border-[var(--border-main)] pb-4">
        <button 
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${filterType === 'all' ? 'bg-[var(--text-main)] text-[var(--bg-main)]' : 'bg-[var(--bg-hover)] text-[var(--text-muted)] hover:bg-[var(--border-main)]'}`}
        >
          All Exams
        </button>
        <button 
          onClick={() => setFilterType('full-exam')}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${filterType === 'full-exam' ? 'bg-[var(--blue)] text-white' : 'bg-[var(--bg-hover)] text-[var(--text-muted)] hover:bg-[var(--border-main)]'}`}
        >
          Full Tests
        </button>
        <button 
          onClick={() => setFilterType('mini-quiz')}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${filterType === 'mini-quiz' ? 'bg-[var(--green)] text-white' : 'bg-[var(--bg-hover)] text-[var(--text-muted)] hover:bg-[var(--border-main)]'}`}
        >
          Mini Quizzes
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-12">
        <div className="p-6 bg-[var(--tint-green)] border-2 border-[var(--green)] rounded-[1.5rem] md:rounded-[2rem] text-center flex flex-col justify-center">
          <p className="text-[10px] md:text-xs font-black text-[var(--green)] uppercase opacity-80 mb-2 tracking-wider">Total Completed</p>
          <p className="text-4xl md:text-5xl font-black text-[var(--green)]">{filtered.length}</p>
        </div>
        <div className="p-6 bg-[var(--tint-blue)] border-2 border-[var(--blue)] rounded-[1.5rem] md:rounded-[2rem] text-center flex flex-col justify-center">
          <p className="text-[10px] md:text-xs font-black text-[var(--blue)] uppercase opacity-80 mb-2 tracking-wider">Avg Accuracy</p>
          <p className="text-4xl md:text-5xl font-black text-[var(--blue)]">{avgScore}%</p>
        </div>
        <div className="p-6 bg-[var(--tint-red)] border-2 border-[var(--red)] rounded-[1.5rem] md:rounded-[2rem] text-center flex flex-col justify-center overflow-hidden">
          <p className="text-[10px] md:text-xs font-black text-[var(--red)] uppercase opacity-80 mb-2 tracking-wider">Mastery Rank</p>
          <p className="text-lg sm:text-xl md:text-2xl font-black text-[var(--red)] mt-2 break-words leading-tight">
            {avgScore >= 80 ? 'EXPERT' : avgScore >= 50 ? 'WARRIOR' : 'BEGINNER'}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-black text-[var(--text-main)] uppercase tracking-widest">Exam History</h3>
        
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {filtered.length > 0 ? (
            filtered.map((res) => (
              <div key={res.id} className="p-5 bg-[var(--bg-hover)] border-2 border-[var(--border-main)] rounded-2xl flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-black shadow-lg ${res.type === 'full-exam' ? 'bg-[var(--blue)]' : 'bg-[var(--green)]'}`}>
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
