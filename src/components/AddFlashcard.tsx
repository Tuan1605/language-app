import { useState } from 'react';

interface AddFlashcardProps {
  onAdd: (card: { word: string; definition: string; example?: string; language: 'english' | 'japanese' }) => void;
}

export function AddFlashcard({ onAdd }: AddFlashcardProps) {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [example, setExample] = useState('');
  const [language, setLanguage] = useState<'english' | 'japanese'>('english');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!word || !definition) return;
    onAdd({ word, definition, example: example || undefined, language });
    setWord('');
    setDefinition('');
    setExample('');
  };

  return (
    <div className="bg-[var(--bg-card)] lingo-card max-w-xl mx-auto w-full animate-in slide-in-from-bottom-8 duration-500">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg-[var(--tint-blue)] rounded-xl flex items-center justify-center text-[var(--blue)]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-black text-[var(--text-main)] uppercase tracking-tight">New Discovery</h2>
          <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mt-1">Add to your collection</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Word or Phrase</label>
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            className="w-full bg-[var(--card-input-bg)] border-2 border-[var(--card-input-border)] rounded-2xl px-5 h-14 text-lg font-bold focus:border-[var(--blue)] focus:bg-[var(--bg-card)] transition-all outline-none text-[var(--text-main)] placeholder:text-[var(--text-muted)]"
            placeholder="e.g. Approach / 接近"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Meaning / Definition</label>
          <textarea
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            rows={3}
            className="w-full bg-[var(--card-input-bg)] border-2 border-[var(--card-input-border)] rounded-2xl p-5 text-lg font-bold focus:border-[var(--blue)] focus:bg-[var(--bg-card)] transition-all outline-none resize-none text-[var(--text-main)] placeholder:text-[var(--text-muted)]"
            placeholder="What does it mean?..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Example Sentence (optional)</label>
          <input
            type="text"
            value={example}
            onChange={(e) => setExample(e.target.value)}
            className="w-full bg-[var(--card-input-bg)] border-2 border-[var(--card-input-border)] rounded-2xl px-5 h-14 text-lg font-bold focus:border-[var(--blue)] focus:bg-[var(--bg-card)] transition-all outline-none text-[var(--text-main)] placeholder:text-[var(--text-muted)]"
            placeholder="e.g. The bonus serves as an incentive."
          />
        </div>

        <div className="space-y-3">
          <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1 block text-center">Target Language</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setLanguage('english')}
              className={`h-14 btn-3d ${language === 'english' ? 'btn-blue' : 'btn-outline'}`}
            >
              ENGLISH
            </button>
            <button
              type="button"
              onClick={() => setLanguage('japanese')}
              className={`h-14 btn-3d ${language === 'japanese' ? 'btn-red' : 'btn-outline'}`}
            >
              JAPANESE
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!word || !definition}
          className={`w-full h-14 mt-4 transition-all ${
            word && definition 
            ? 'btn-3d btn-green'
            : 'bg-[var(--gray-path)] text-[var(--text-muted)] font-black uppercase tracking-widest cursor-not-allowed border-b-4 border-[var(--gray-path-dark)] rounded-2xl'
          }`}
        >
          SAVE CARD
        </button>
      </form>
    </div>
  );
}
