import { useState, useMemo } from 'react';
import { Pencil, Trash2, BookOpen } from 'lucide-react';
import type { Flashcard } from '../types';
import { ConfirmDialog } from './ConfirmDialog';

interface CollectionViewProps {
  cards: Flashcard[];
  activeTrack: 'english' | 'japanese';
  onDelete: (id: string) => void;
  onDeleteBulk: (ids: string[]) => void;
  onEdit: (card: Flashcard) => void;
}

export function CollectionView({ cards, activeTrack, onDelete, onDeleteBulk, onEdit }: CollectionViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'hardest' | 'needs_review'>('newest');
  const [limit, setLimit] = useState(50);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [editForm, setEditForm] = useState({ word: '', definition: '', example: '', exampleTranslation: '', phonetic: '', pronunciation: '' });
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  
  const topics = useMemo(() => {
    const ts = new Set<string>();
    cards.forEach(c => {
      if (c.language === activeTrack && c.topic) ts.add(c.topic);
    });
    return Array.from(ts).sort();
  }, [cards, activeTrack]);

  const filteredAndSorted = useMemo(() => {
    const result = cards.filter(c => 
      c.language === activeTrack && 
      (selectedTopic === 'all' || c.topic === selectedTopic) &&
      (c.word.toLowerCase().includes(searchTerm.toLowerCase()) || 
       c.definition.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'hardest') {
      result.sort((a, b) => b.fsrs_difficulty - a.fsrs_difficulty); // Higher difficulty means harder
    } else if (sortBy === 'needs_review') {
      result.sort((a, b) => {
        const aTime = a.next_review ? new Date(a.next_review).getTime() : Infinity;
        const bTime = b.next_review ? new Date(b.next_review).getTime() : Infinity;
        return aTime - bTime;
      });
    }

    return result;
  }, [cards, activeTrack, searchTerm, sortBy, selectedTopic]);

  const paginatedCards = filteredAndSorted.slice(0, limit);

  const handleEditClick = (card: Flashcard) => {
    setEditingCard(card);
    setEditForm({
      word: card.word,
      definition: card.definition,
      example: card.example || '',
      exampleTranslation: card.exampleTranslation || '',
      phonetic: card.phonetic || '',
      pronunciation: card.pronunciation || ''
    });
  };

  const handleSaveEdit = () => {
    if (editingCard && editForm.word && editForm.definition) {
      onEdit({
        ...editingCard,
        word: editForm.word,
        definition: editForm.definition,
        example: editForm.example,
        exampleTranslation: editForm.exampleTranslation || undefined,
        phonetic: editForm.phonetic || undefined,
        pronunciation: editForm.pronunciation || undefined
      });
      setEditingCard(null);
    }
  };

  const handleBulkDelete = () => {
    onDeleteBulk(filteredAndSorted.map(c => c.id));
    setSearchTerm('');
    setShowBulkDeleteConfirm(false);
  };

  return (
    <div className="bg-bg-card lingo-card p-4 md:p-6 lg:p-10 max-w-5xl mx-auto w-full animate-in slide-in-from-bottom-8 duration-500">
      <div className="mb-5 md:mb-8 border-b-2 border-gray-path pb-4 md:pb-6 space-y-3 md:space-y-4">
        <div>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-text-main uppercase tracking-tight">Personal Library</h2>
          <p className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-1.5 md:mt-2">
            Managing {activeTrack === 'english' ? 'TOEIC' : 'N2'} Vocabulary
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {filteredAndSorted.length > 0 && searchTerm && (
            <button
              onClick={() => setShowBulkDeleteConfirm(true)}
              className="px-3 py-1.5 md:px-4 md:py-2 bg-tint-red text-red border-2 border-red font-black text-[10px] md:text-xs rounded-xl md:rounded-2xl uppercase whitespace-nowrap hover:bg-red hover:text-white transition-all shadow-sm"
            >
              Delete Found ({filteredAndSorted.length})
            </button>
          )}

          {topics.length > 0 && (
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="bg-bg-hover border-2 border-border-main rounded-xl md:rounded-2xl py-1.5 px-2.5 md:py-2 md:px-3 font-bold outline-none focus:border-blue transition-all text-text-main cursor-pointer appearance-none text-xs md:text-sm min-w-0"
              style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em', paddingRight: '1.75rem' }}
            >
              <option value="all">All Topics</option>
              {topics.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          )}

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'hardest' | 'needs_review')}
            className="bg-bg-hover border-2 border-border-main rounded-xl md:rounded-2xl py-1.5 px-2.5 md:py-2 md:px-3 font-bold outline-none focus:border-blue transition-all text-text-main cursor-pointer appearance-none text-xs md:text-sm min-w-0"
            style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em', paddingRight: '1.75rem' }}
          >
            <option value="newest">Newest</option>
            <option value="hardest">Hardest</option>
            <option value="needs_review">Needs Review</option>
          </select>

          <div className="flex-1 min-w-[120px] md:min-w-[180px] relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setLimit(50);
              }}
              className="w-full bg-bg-hover border-2 border-border-main rounded-xl md:rounded-2xl py-1.5 pl-8 pr-3 md:py-2 md:pl-9 md:pr-4 font-bold outline-none focus:border-blue transition-all text-text-main text-xs md:text-sm"
            />
            <span className="absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2 opacity-30 text-xs md:text-sm">🔍</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 max-h-[600px] overflow-y-auto pr-1 md:pr-2 custom-scrollbar">
        {paginatedCards.length > 0 ? (
          <>
            {paginatedCards.map(card => (
              <div key={card.id} className="p-4 md:p-6 bg-bg-hover border-2 border-border-main rounded-xl md:rounded-2xl flex justify-between items-center group hover:border-blue transition-all">
                <div className="flex-1 min-w-0">
                  <p className="text-base md:text-lg font-black text-text-main truncate">{card.word}</p>
                  <p className="text-xs md:text-sm font-bold text-text-muted mt-0.5 md:mt-1 truncate">{card.definition}</p>
                    <div className="flex gap-1.5 md:gap-2 mt-2 md:mt-3">
                     <span className={`text-[8px] md:text-[9px] font-black uppercase px-1.5 py-0.5 md:px-2 rounded-md ${card.fsrs_difficulty > 7 ? 'bg-tint-red text-red' : 'bg-blue/10 text-blue'}`}>
                       {card.fsrs_difficulty > 7 ? 'Hard' : 'Known'}
                     </span>
                     {card.next_review && new Date(card.next_review) <= new Date() && (
                       <span className="text-[8px] md:text-[9px] font-black uppercase bg-tint-gold text-gold-shadow px-1.5 py-0.5 md:px-2 rounded-md">
                         Due
                       </span>
                     )}
                  </div>
                </div>
                <div className="flex flex-row md:flex-col gap-1 md:gap-2 ml-2 md:ml-3 shrink-0">
                  <button
                    onClick={() => handleEditClick(card)}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center hover:bg-blue/10 text-blue md:opacity-0 md:group-hover:opacity-100 transition-all"
                    title="Edit flashcard"
                  >
                    <Pencil size={16} className="md:w-5 md:h-5" />
                  </button>
                  <button
                    onClick={() => onDelete(card.id)}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center hover:bg-red/10 text-red md:opacity-0 md:group-hover:opacity-100 transition-all"
                    title="Remove from collection"
                  >
                    <Trash2 size={16} className="md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            ))}
            {filteredAndSorted.length > limit && (
              <div className="col-span-full flex justify-center py-4 md:py-6">
                <button
                  onClick={() => setLimit(l => l + 50)}
                  className="btn-duo btn-blue h-10 md:h-12 px-6 md:px-8 text-[10px] md:text-xs font-black"
                >
                  LOAD MORE ({filteredAndSorted.length - limit} left)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
             <div className="w-24 h-24 mx-auto rounded-full text-text-muted flex items-center justify-center mb-6 shadow-[var(--shadow-inset-light)]">
               <BookOpen size={48} strokeWidth={2.5} />
             </div>
             <p className="text-sm font-bold text-text-muted uppercase tracking-widest">Collection Empty</p>
          </div>
        )}
      </div>

      {editingCard && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-bg-main w-full max-w-md rounded-[2rem] border-2 border-gray-path shadow-2xl flex flex-col overflow-hidden relative p-8">
            <h3 className="font-black text-2xl text-text-main mb-6">Edit Card</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase mb-2">Word or Phrase</label>
                <input 
                  type="text" 
                  value={editForm.word}
                  onChange={(e) => setEditForm(prev => ({ ...prev, word: e.target.value }))}
                  className="w-full bg-bg-hover border-2 border-border-main rounded-xl py-3 px-4 font-bold outline-none focus:border-blue transition-all text-text-main"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase mb-2">Meaning / Definition</label>
                <input 
                  type="text" 
                  value={editForm.definition}
                  onChange={(e) => setEditForm(prev => ({ ...prev, definition: e.target.value }))}
                  className="w-full bg-bg-hover border-2 border-border-main rounded-xl py-3 px-4 font-bold outline-none focus:border-blue transition-all text-text-main"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase mb-2">Example Sentence (optional)</label>
                <input
                  type="text"
                  value={editForm.example}
                  onChange={(e) => setEditForm(prev => ({ ...prev, example: e.target.value }))}
                  className="w-full bg-bg-hover border-2 border-border-main rounded-xl py-3 px-4 font-bold outline-none focus:border-blue transition-all text-text-main"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase mb-2">Example Translation (optional)</label>
                <input
                  type="text"
                  value={editForm.exampleTranslation}
                  onChange={(e) => setEditForm(prev => ({ ...prev, exampleTranslation: e.target.value }))}
                  className="w-full bg-bg-hover border-2 border-border-main rounded-xl py-3 px-4 font-bold outline-none focus:border-blue transition-all text-text-main"
                  placeholder="Dịch nghĩa câu ví dụ"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase mb-2">Phonetic / IPA (optional)</label>
                  <input
                    type="text"
                    value={editForm.phonetic}
                    onChange={(e) => setEditForm(prev => ({ ...prev, phonetic: e.target.value }))}
                    className="w-full bg-bg-hover border-2 border-border-main rounded-xl py-3 px-4 font-bold outline-none focus:border-blue transition-all text-text-main"
                    placeholder="/nəˈɡoʊʃieɪt/"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase mb-2">Pronunciation (optional)</label>
                  <input
                    type="text"
                    value={editForm.pronunciation}
                    onChange={(e) => setEditForm(prev => ({ ...prev, pronunciation: e.target.value }))}
                    className="w-full bg-bg-hover border-2 border-border-main rounded-xl py-3 px-4 font-bold outline-none focus:border-blue transition-all text-text-main"
                    placeholder="nuh-GOH-shee-eyt"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => setEditingCard(null)}
                className="flex-1 py-3 rounded-xl font-bold text-text-muted hover:bg-gray-path transition-colors border-2 border-transparent hover:border-border-main uppercase"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEdit}
                className="flex-1 py-3 rounded-xl font-black text-white bg-green hover:bg-[#1eb040] shadow-[0_4px_0_#189935] hover:shadow-[0_2px_0_#189935] hover:translate-y-[2px] transition-all uppercase"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={showBulkDeleteConfirm}
        title="Delete Words?"
        message={`Are you sure you want to delete ${filteredAndSorted.length} words from your collection? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleBulkDelete}
        onCancel={() => setShowBulkDeleteConfirm(false)}
        danger
      />
    </div>
  );
}
