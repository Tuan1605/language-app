import { useState } from 'react';
import type { Flashcard } from '../types';

interface CollectionViewProps {
  cards: Flashcard[];
  activeTrack: 'english' | 'japanese';
  onDelete: (id: string) => void;
}

export function CollectionView({ cards, activeTrack, onDelete }: CollectionViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filtered = cards.filter(c => 
    c.language === activeTrack && 
    (c.word.toLowerCase().includes(searchTerm.toLowerCase()) || 
     c.definition.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-[var(--bg-card)] lingo-card p-10 max-w-4xl mx-auto w-full animate-in slide-in-from-bottom-8 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-black text-[var(--text-main)] uppercase tracking-tight">Personal Library</h2>
          <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mt-2">
            Managing {activeTrack === 'english' ? 'TOEIC' : 'N2'} Vocabulary
          </p>
        </div>
        
        <div className="w-full md:w-64 relative">
          <input 
            type="text"
            placeholder="Search words..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[var(--bg-hover)] border-2 border-[var(--border-main)] rounded-2xl py-3 px-10 font-bold outline-none focus:border-[var(--blue)] transition-all text-[var(--text-main)]"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {filtered.length > 0 ? (
          filtered.map(card => (
            <div key={card.id} className="p-6 bg-[var(--bg-hover)] border-2 border-[var(--border-main)] rounded-2xl flex justify-between items-center group hover:border-[var(--blue)] transition-all">
              <div className="flex-1">
                <p className="text-lg font-black text-[var(--text-main)]">{card.word}</p>
                <p className="text-sm font-bold text-[var(--text-muted)] mt-1">{card.definition}</p>
                <div className="flex gap-2 mt-3">
                   <span className="text-[9px] font-black uppercase bg-[var(--blue)]/10 text-[var(--blue)] px-2 py-0.5 rounded-md">{card.difficulty}</span>
                </div>
              </div>
              <button 
                onClick={() => onDelete(card.id)}
                className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[#ff4b4b]/10 text-[#ff4b4b] opacity-0 group-hover:opacity-100 transition-all"
                title="Remove from collection"
              >
                🗑️
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
             <div className="text-5xl opacity-20">📚</div>
             <p className="font-bold text-[var(--text-muted)]">No words found in this track.</p>
          </div>
        )}
      </div>
    </div>
  );
}
