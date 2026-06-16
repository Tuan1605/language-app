import { useState } from 'react';

interface AddFlashcardProps {
  onAdd: (card: { word: string; definition: string; language: 'english' | 'japanese' }) => void;
}

export function AddFlashcard({ onAdd }: AddFlashcardProps) {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [language, setLanguage] = useState<'english' | 'japanese'>('english');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!word || !definition) return;
    onAdd({ word, definition, language });
    setWord('');
    setDefinition('');
  };

  return (
    <div className="bg-white lingo-card p-10 max-w-xl mx-auto w-full animate-in slide-in-from-bottom-8 duration-500">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 bg-[#ddf4ff] rounded-2xl flex items-center justify-center text-[#1cb0f6] shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <div>
          <h2 className="text-3xl font-black text-[#4b4b4b] uppercase tracking-tight leading-none">New Discovery</h2>
          <p className="text-[10px] font-black text-[#afafaf] uppercase tracking-[0.2em] mt-2">Add to your knowledge base</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-[#777] uppercase tracking-[0.2em] ml-1">Word or Phrase</label>
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            className="w-full bg-[#f7f7f7] border-2 border-[#e5e5e5] rounded-2xl p-5 text-xl font-bold focus:border-[#1cb0f6] focus:bg-white transition-all outline-none placeholder:text-[#afafaf]"
            placeholder="e.g. Approach / 接近"
          />
        </div>
        
        <div className="space-y-3">
          <label className="text-[10px] font-black text-[#777] uppercase tracking-[0.2em] ml-1">Meaning / Definition</label>
          <textarea
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            rows={3}
            className="w-full bg-[#f7f7f7] border-2 border-[#e5e5e5] rounded-2xl p-5 text-xl font-bold focus:border-[#1cb0f6] focus:bg-white transition-all outline-none placeholder:text-[#afafaf] resize-none"
            placeholder="What does it mean?..."
          />
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black text-[#777] uppercase tracking-[0.2em] ml-1 text-center block">Target Language</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setLanguage('english')}
              className={`h-16 btn-3d rounded-2xl ${language === 'english' ? 'btn-blue shadow-blue-100' : 'btn-outline'}`}
            >
              ENGLISH (TOEIC)
            </button>
            <button
              type="button"
              onClick={() => setLanguage('japanese')}
              className={`h-16 btn-3d rounded-2xl ${language === 'japanese' ? 'btn-red shadow-red-100' : 'btn-outline'}`}
            >
              JAPANESE (N2)
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!word || !definition}
          className={`w-full text-xl py-6 rounded-2xl transition-all mt-6 ${
            word && definition 
            ? 'btn-3d btn-green shadow-[#58cc02]/20' 
            : 'bg-[#e5e5e5] text-[#afafaf] font-black uppercase tracking-widest cursor-not-allowed border-b-4 border-[#cbd5e1]'
          }`}
        >
          SAVE TO COLLECTION
        </button>
      </form>
    </div>
  );
}
