import type { ExamResult } from '../../types';

type FilterType = 'all' | 'full-exam' | 'mock-exam' | 'mini-quiz';

interface ExamHistoryProps {
  filtered: ExamResult[];
  chartData: ExamResult[];
  filterType: FilterType;
  onFilterChange: (type: FilterType) => void;
}

export function ExamHistory({ filtered, chartData, filterType, onFilterChange }: ExamHistoryProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-black text-text-main uppercase tracking-widest">Exam History & Trends</h3>
        <div className="flex flex-wrap gap-2">
          {([
            { key: 'all', label: 'All', activeClass: 'bg-text-main text-bg-main' },
            { key: 'full-exam', label: 'Full Tests', activeClass: 'bg-blue text-white' },
            { key: 'mock-exam', label: 'Daily', activeClass: 'bg-purple text-white' },
            { key: 'mini-quiz', label: 'Quizzes', activeClass: 'bg-green text-white' },
          ] as const).map(f => (
            <button
              key={f.key}
              onClick={() => onFilterChange(f.key)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${filterType === f.key ? f.activeClass : 'bg-gray-bg text-text-muted hover:bg-border-main'}`}
            >
              {f.label}
            </button>
          ))}
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
  );
}
