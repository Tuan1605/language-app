import { useState } from 'react';
import type { Mistake, Question, DictationLesson, SpeakingLesson, WritingLesson } from '../types';

interface MistakeBookViewProps {
  mistakes: Mistake[];
  onRemoveMistake: (id: string) => void;
  onReview: () => void;
}

export function MistakeBookView({ mistakes, onRemoveMistake, onReview }: MistakeBookViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredMistakes = mistakes.filter(m => {
    const dataStr = JSON.stringify(m.data).toLowerCase();
    return dataStr.includes(searchTerm.toLowerCase());
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const renderMistakeContent = (mistake: Mistake) => {
    if (mistake.type === 'question') {
      const q = mistake.data as Question;
      return (
        <div className="space-y-2">
          <p className="font-bold text-lg text-[var(--text-main)]">{q.text}</p>
          <div className="bg-[var(--tint-red)] border border-[var(--red)] p-2 rounded-lg">
            <span className="text-xs font-black text-[var(--red)] uppercase">You chose:</span>
            <p className="text-[var(--red)] font-bold">{mistake.wrongAnswer || 'Skipped'}</p>
          </div>
          <div className="bg-[var(--tint-green)] border border-[var(--green)] p-2 rounded-lg">
            <span className="text-xs font-black text-[var(--green)] uppercase">Correct:</span>
            <p className="text-[var(--green)] font-bold">{q.options[q.correctAnswer]}</p>
          </div>
          {q.explanation && (
            <p className="text-xs text-[var(--text-muted)] italic mt-2 border-l-2 border-[var(--gray-path)] pl-2">{q.explanation}</p>
          )}
        </div>
      );
    } else if (mistake.type === 'dictation') {
      const d = mistake.data as DictationLesson;
      return (
        <div className="space-y-2">
          <p className="font-bold text-lg text-[var(--text-main)]">{d.targetText}</p>
          <div className="bg-[var(--tint-red)] border border-[var(--red)] p-2 rounded-lg">
            <span className="text-xs font-black text-[var(--red)] uppercase">You typed:</span>
            <p className="text-[var(--red)] font-bold">{mistake.wrongAnswer}</p>
          </div>
        </div>
      );
    } else if (mistake.type === 'speaking') {
      const s = mistake.data as SpeakingLesson;
      return (
        <div className="space-y-2">
          <p className="font-bold text-lg text-[var(--text-main)]">{s.targetSentence}</p>
          <p className="text-xs text-[var(--text-muted)]">{s.translation}</p>
          <div className="bg-[var(--tint-red)] border border-[var(--red)] p-2 rounded-lg">
            <span className="text-xs font-black text-[var(--red)] uppercase">You said:</span>
            <p className="text-[var(--red)] font-bold">{mistake.wrongAnswer}</p>
          </div>
        </div>
      );
    } else if (mistake.type === 'writing') {
      const w = mistake.data as WritingLesson;
      return (
        <div className="space-y-2">
          <p className="font-bold text-lg text-[var(--text-main)]">{w.sourceText}</p>
          <div className="bg-[var(--tint-green)] border border-[var(--green)] p-2 rounded-lg">
            <span className="text-xs font-black text-[var(--green)] uppercase">Correct translation:</span>
            <p className="text-[var(--green)] font-bold">{w.targetText}</p>
          </div>
          <div className="bg-[var(--tint-red)] border border-[var(--red)] p-2 rounded-lg">
            <span className="text-xs font-black text-[var(--red)] uppercase">Your answer:</span>
            <p className="text-[var(--red)] font-bold">{mistake.wrongAnswer}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[var(--bg-card)] lingo-card p-6 sm:p-10 max-w-4xl mx-auto w-full animate-in slide-in-from-bottom-8 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b-2 border-[var(--gray-path)] pb-6">
        <div>
          <h2 className="text-3xl font-black text-[var(--text-main)] uppercase tracking-tight">Mistake Book</h2>
          <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mt-2">
            Learn from your errors
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
          <button 
            onClick={onReview}
            disabled={mistakes.length === 0}
            className="px-6 py-3 bg-[var(--tint-gold)] text-[var(--gold-shadow)] border-2 border-[var(--gold-shadow)] font-black text-sm rounded-2xl uppercase whitespace-nowrap hover:bg-[var(--gold-shadow)] hover:text-white transition-all shadow-sm disabled:opacity-50"
          >
            Review Mistakes
          </button>
          
          <div className="w-full sm:w-64 relative">
            <input 
              type="text"
              placeholder="Search mistakes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--bg-hover)] border-2 border-[var(--border-main)] rounded-2xl py-3 px-10 font-bold outline-none focus:border-[var(--blue)] transition-all text-[var(--text-main)]"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredMistakes.length > 0 ? (
          filteredMistakes.map(mistake => (
            <div key={`${mistake.id}-${mistake.timestamp}`} className="p-6 bg-[var(--bg-hover)] border-2 border-[var(--border-main)] rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group hover:border-[var(--red)] transition-all">
              <div className="flex-1 w-full">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${mistake.type === 'question' ? 'bg-[var(--tint-blue)] text-[var(--blue)]' : mistake.type === 'dictation' ? 'bg-[var(--tint-purple)] text-[var(--purple)]' : 'bg-[var(--tint-gold)] text-[var(--gold-shadow)]'}`}>
                    {mistake.type}
                  </span>
                  <span className="text-[10px] font-bold text-[var(--text-muted)]">
                    {new Date(mistake.timestamp).toLocaleString()}
                  </span>
                </div>
                {renderMistakeContent(mistake)}
              </div>
              <button 
                onClick={() => onRemoveMistake(mistake.id)}
                className="w-full sm:w-auto px-4 py-2 bg-[var(--gray-bg)] hover:bg-[var(--tint-green)] hover:text-[var(--green)] text-[var(--text-muted)] rounded-xl font-bold transition-all border-2 border-transparent hover:border-[var(--green)] flex items-center justify-center gap-2"
              >
                <span>✓</span> <span className="text-sm">Got it</span>
              </button>
            </div>
          ))
        ) : (
          <div className="py-20 text-center space-y-4">
             <div className="text-5xl opacity-20">🎯</div>
             <p className="font-bold text-[var(--text-muted)]">No mistakes found. Great job!</p>
          </div>
        )}
      </div>
    </div>
  );
}
