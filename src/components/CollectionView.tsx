import { useState, useMemo } from 'react';
import type { Flashcard } from '../types';

interface CollectionViewProps {
  cards: Flashcard[];
  activeTrack: 'english' | 'japanese';
  onDelete: (id: string) => void;
  onEdit: (card: Flashcard) => void;
}

export function CollectionView({ cards, activeTrack, onDelete, onEdit }: CollectionViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [editForm, setEditForm] = useState({ word: '', definition: '', example: '' });
  
  const filtered = useMemo(() => cards.filter(c => 
    c.language === activeTrack && 
    (c.word.toLowerCase().includes(searchTerm.toLowerCase()) || 
     c.definition.toLowerCase().includes(searchTerm.toLowerCase()))
  ), [cards, activeTrack, searchTerm]);

  const handleEditClick = (card: Flashcard) => {
    setEditingCard(card);
    setEditForm({
      word: card.word,
      definition: card.definition,
      example: card.example || ''
    });
  };

  const handleSaveEdit = () => {
    if (editingCard && editForm.word && editForm.definition) {
      onEdit({
        ...editingCard,
        word: editForm.word,
        definition: editForm.definition,
        example: editForm.example
      });
      setEditingCard(null);
    }
  };

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
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => handleEditClick(card)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[var(--blue)]/10 text-[var(--blue)] opacity-0 group-hover:opacity-100 transition-all"
                  title="Edit flashcard"
                >
                  ✏️
                </button>
                <button 
                  onClick={() => onDelete(card.id)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[var(--red)]/10 text-[var(--red)] opacity-0 group-hover:opacity-100 transition-all"
                  title="Remove from collection"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
             <div className="text-5xl opacity-20">📚</div>
             <p className="font-bold text-[var(--text-muted)]">No words found in this track.</p>
          </div>
        )}
      </div>

      {editingCard && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[var(--bg-main)] w-full max-w-md rounded-[2rem] border-2 border-[var(--gray-path)] shadow-2xl flex flex-col overflow-hidden relative p-8">
            <h3 className="font-black text-2xl text-[var(--text-main)] mb-6">Sửa Thẻ</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-2">Từ vựng (Word)</label>
                <input 
                  type="text" 
                  value={editForm.word}
                  onChange={(e) => setEditForm(prev => ({ ...prev, word: e.target.value }))}
                  className="w-full bg-[var(--bg-hover)] border-2 border-[var(--border-main)] rounded-xl py-3 px-4 font-bold outline-none focus:border-[var(--blue)] transition-all text-[var(--text-main)]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-2">Định nghĩa (Definition)</label>
                <input 
                  type="text" 
                  value={editForm.definition}
                  onChange={(e) => setEditForm(prev => ({ ...prev, definition: e.target.value }))}
                  className="w-full bg-[var(--bg-hover)] border-2 border-[var(--border-main)] rounded-xl py-3 px-4 font-bold outline-none focus:border-[var(--blue)] transition-all text-[var(--text-main)]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-2">Ví dụ (Example - Tùy chọn)</label>
                <input 
                  type="text" 
                  value={editForm.example}
                  onChange={(e) => setEditForm(prev => ({ ...prev, example: e.target.value }))}
                  className="w-full bg-[var(--bg-hover)] border-2 border-[var(--border-main)] rounded-xl py-3 px-4 font-bold outline-none focus:border-[var(--blue)] transition-all text-[var(--text-main)]"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => setEditingCard(null)}
                className="flex-1 py-3 rounded-xl font-bold text-[var(--text-muted)] hover:bg-[var(--gray-path)] transition-colors border-2 border-transparent hover:border-[var(--border-main)] uppercase"
              >
                Hủy
              </button>
              <button 
                onClick={handleSaveEdit}
                className="flex-1 py-3 rounded-xl font-black text-white bg-[var(--green)] hover:bg-[#1eb040] shadow-[0_4px_0_#189935] hover:shadow-[0_2px_0_#189935] hover:translate-y-[2px] transition-all uppercase"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
