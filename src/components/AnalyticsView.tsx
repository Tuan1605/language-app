import type { ExamResult } from '../types';

interface AnalyticsViewProps {
  results: ExamResult[];
  activeTrack: 'english' | 'japanese';
}

export function AnalyticsView({ results, activeTrack }: AnalyticsViewProps) {
  const filtered = results.filter(r => (activeTrack === 'english' ? r.category === 'toeic' : r.category === 'n2'));
  
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-8 bg-[var(--tint-green)] border-2 border-[#58cc02] rounded-[2rem] text-center">
          <p className="text-[10px] font-black text-[#58cc02] uppercase mb-2">Total Quests</p>
          <p className="text-5xl font-black text-[#58cc02]">{filtered.length}</p>
        </div>
        <div className="p-8 bg-[var(--tint-blue)] border-2 border-[#1cb0f6] rounded-[2rem] text-center">
          <p className="text-[10px] font-black text-[#1cb0f6] uppercase mb-2">Avg Accuracy</p>
          <p className="text-5xl font-black text-[#1cb0f6]">{avgScore}%</p>
        </div>
        <div className="p-8 bg-[var(--tint-red)] border-2 border-[#ff4b4b] rounded-[2rem] text-center">
          <p className="text-[10px] font-black text-[#ff4b4b] uppercase mb-2">Mastery Rank</p>
          <p className="text-2xl font-black text-[#ff4b4b] mt-3">
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
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-black shadow-lg ${res.category === 'toeic' ? 'bg-[#1cb0f6]' : 'bg-[#ff4b4b]'}`}>
                    {res.category.toUpperCase().charAt(0)}
                  </div>
                  <div>
                    <p className="font-black text-[var(--text-main)] uppercase text-xs">{res.difficulty} EXAM</p>
                    <p className="text-[10px] font-bold text-[var(--text-muted)]">{new Date(res.date).toLocaleDateString()} at {new Date(res.date).toLocaleTimeString()}</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-2xl font-black text-[var(--text-main)] leading-none">{res.score}/{res.totalQuestions}</p>
                   <p className={`text-[9px] font-black uppercase mt-1 ${res.score / res.totalQuestions >= 0.8 ? 'text-[#58cc02]' : 'text-[#ff9600]'}`}>
                      {res.score / res.totalQuestions >= 0.8 ? 'Excellent' : 'Completed'}
                   </p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center border-2 border-dashed border-[var(--border-main)] rounded-2xl">
               <p className="font-bold text-[var(--text-muted)]">No exam data available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
