import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { sanitizeInput } from '../utils/sanitize';

interface AddFlashcardProps {
  onAdd: (card: { word: string; definition: string; example?: string; exampleTranslation?: string; phonetic?: string; pronunciation?: string; difficulty?: 'beginner' | 'intermediate' | 'advanced'; language: 'english' | 'japanese' }) => void;
  onAddBulk?: (cards: Array<{ word: string; definition: string; example?: string; exampleTranslation?: string; phonetic?: string; pronunciation?: string; difficulty?: 'beginner' | 'intermediate' | 'advanced'; language: 'english' | 'japanese' }>) => void;
}

export function AddFlashcard({ onAdd, onAddBulk }: AddFlashcardProps) {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');

  // Single card state
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [example, setExample] = useState('');
  const [exampleTranslation, setExampleTranslation] = useState('');
  const [phonetic, setPhonetic] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [language, setLanguage] = useState<'english' | 'japanese'>('english');

  // Bulk card state
  const [csvText, setCsvText] = useState('');

  const handleSubmitSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!word || !definition || !example) return;
    onAdd({
      word: sanitizeInput(word),
      definition: sanitizeInput(definition),
      example: sanitizeInput(example),
      exampleTranslation: exampleTranslation ? sanitizeInput(exampleTranslation) : undefined,
      phonetic: phonetic || undefined,
      pronunciation: pronunciation || undefined,
      difficulty,
      language
    });
    setWord('');
    setDefinition('');
    setExample('');
    setExampleTranslation('');
    setPhonetic('');
    setPronunciation('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) setCsvText(text);
    };
    reader.onerror = () => {
      toast.error('Failed to read file');
    };
    reader.readAsText(file);
  };

  const handleSubmitBulk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText.trim()) return;

    // Simple CSV parser that handles quotes properly
    const parseCSVLine = (text: string) => {
      const re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
      const re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
      if (!re_valid.test(text)) return null;
      const a: string[] = [];
      text.replace(re_value, (_m0, m1, m2, m3) => {
        if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
        else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
        else if (m3 !== undefined) a.push(m3);
        return '';
      });
      if (/,\s*$/.test(text)) a.push('');
      return a;
    };

    const lines = csvText.split('\n');
    const parsedCards: Array<{ word: string; definition: string; example?: string; exampleTranslation?: string; phonetic?: string; language: 'english' | 'japanese' }> = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = parseCSVLine(line) || line.split(',').map(s => s.trim());
      
      if (parts.length >= 2) {
        parsedCards.push({
          word: sanitizeInput(parts[0]),
          definition: sanitizeInput(parts[1]),
          example: parts[2] ? sanitizeInput(parts[2]) : undefined,
          exampleTranslation: parts[3] ? sanitizeInput(parts[3]) : undefined,
          phonetic: parts[4] ? sanitizeInput(parts[4]) : undefined,
          language
        });
      } else {
        toast.error(`Dòng ${i + 1} không hợp lệ: Cần ít nhất "Từ vựng, Định nghĩa"`);
        return;
      }
    }

    if (parsedCards.length > 0 && onAddBulk) {
      onAddBulk(parsedCards);
      setCsvText('');
    }
  };

  return (
    <div className="bg-bg-card lingo-card max-w-xl mx-auto w-full animate-in slide-in-from-bottom-8 duration-500">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-tint-blue rounded-xl flex items-center justify-center text-blue shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-black text-text-main uppercase tracking-tight">New Discovery</h2>
            <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mt-1">Add to your collection</p>
          </div>
        </div>
      </div>

      <div className="flex bg-gray-bg p-1 rounded-2xl mb-8">
        <button
          onClick={() => setActiveTab('single')}
          className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${
            activeTab === 'single' ? 'bg-bg-card shadow-sm text-text-main' : 'text-text-muted hover:text-text-main'
          }`}
        >
          SINGLE CARD
        </button>
        <button
          onClick={() => setActiveTab('bulk')}
          className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${
            activeTab === 'bulk' ? 'bg-bg-card shadow-sm text-text-main' : 'text-text-muted hover:text-text-main'
          }`}
        >
          CSV IMPORT (BULK)
        </button>
      </div>

      <div className="space-y-3 mb-8">
        <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] ml-1 block text-center">Target Language</label>
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

      <div className="space-y-3 mb-8">
        <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] ml-1 block text-center">Difficulty</label>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setDifficulty('beginner')}
            className={`h-14 btn-3d ${difficulty === 'beginner' ? 'btn-green' : 'btn-outline'}`}
          >
            BEGINNER
          </button>
          <button
            type="button"
            onClick={() => setDifficulty('intermediate')}
            className={`h-14 btn-3d ${difficulty === 'intermediate' ? 'btn-blue' : 'btn-outline'}`}
          >
            INTERMEDIATE
          </button>
          <button
            type="button"
            onClick={() => setDifficulty('advanced')}
            className={`h-14 btn-3d ${difficulty === 'advanced' ? 'btn-red' : 'btn-outline'}`}
          >
            ADVANCED
          </button>
        </div>
      </div>

      {activeTab === 'single' ? (
        <form onSubmit={handleSubmitSingle} className="space-y-6 animate-in fade-in" aria-label="Add single flashcard">
          <div className="space-y-2">
            <label htmlFor="card-word" className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Word or Phrase</label>
            <input
              id="card-word"
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              required
              aria-required="true"
              className="w-full bg-card-input-bg border-2 border-card-input-border rounded-2xl px-5 h-14 text-lg font-bold focus:border-blue focus:bg-bg-card transition-all outline-none text-text-main placeholder:text-text-muted"
              placeholder="e.g. Approach / 接近"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="card-definition" className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Meaning / Definition</label>
            <textarea
              id="card-definition"
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              rows={3}
              required
              aria-required="true"
              className="w-full bg-card-input-bg border-2 border-card-input-border rounded-2xl p-5 text-lg font-bold focus:border-blue focus:bg-bg-card transition-all outline-none resize-none text-text-main placeholder:text-text-muted"
              placeholder="What does it mean?..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Example Sentence (optional)</label>
            <input
              type="text"
              value={example}
              onChange={(e) => setExample(e.target.value)}
              className="w-full bg-card-input-bg border-2 border-card-input-border rounded-2xl px-5 h-14 text-lg font-bold focus:border-blue focus:bg-bg-card transition-all outline-none text-text-main placeholder:text-text-muted"
              placeholder="e.g. The bonus serves as an incentive."
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Example Translation (optional)</label>
            <input
              type="text"
              value={exampleTranslation}
              onChange={(e) => setExampleTranslation(e.target.value)}
              className="w-full bg-card-input-bg border-2 border-card-input-border rounded-2xl px-5 h-14 text-lg font-bold focus:border-blue focus:bg-bg-card transition-all outline-none text-text-main placeholder:text-text-muted"
              placeholder="e.g. Tiền thưởng đóng vai trò như sự khuyến khích."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Phonetic / IPA (optional)</label>
              <input
                type="text"
                value={phonetic}
                onChange={(e) => setPhonetic(e.target.value)}
                className="w-full bg-card-input-bg border-2 border-card-input-border rounded-2xl px-5 h-14 text-lg font-bold focus:border-blue focus:bg-bg-card transition-all outline-none text-text-main placeholder:text-text-muted"
                placeholder="/nəˈɡoʊʃieɪt/"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Pronunciation (optional)</label>
              <input
                type="text"
                value={pronunciation}
                onChange={(e) => setPronunciation(e.target.value)}
                className="w-full bg-card-input-bg border-2 border-card-input-border rounded-2xl px-5 h-14 text-lg font-bold focus:border-blue focus:bg-bg-card transition-all outline-none text-text-main placeholder:text-text-muted"
                placeholder="nuh-GOH-shee-eyt"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!word || !definition}
            className={`w-full h-14 mt-4 transition-all ${
              word && definition 
              ? 'btn-3d btn-green'
              : 'bg-gray-path text-text-muted font-black uppercase tracking-widest cursor-not-allowed border-b-4 border-gray-path-dark rounded-2xl'
            }`}
          >
            SAVE CARD
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmitBulk} className="space-y-6 animate-in fade-in">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Upload CSV File</label>
            <p className="text-xs font-bold text-text-muted mb-2 px-1">
              Format: <code>Word, Definition, Example, Translation, Phonetic</code>
            </p>
            <input 
              type="file" 
              accept=".csv"
              onChange={handleFileUpload}
              className="w-full bg-card-input-bg border-2 border-card-input-border rounded-2xl p-3 text-sm font-bold text-text-main file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-black file:uppercase file:tracking-wider file:bg-tint-blue file:text-blue hover:file:bg-blue hover:file:text-white transition-all cursor-pointer"
            />
            <div className="text-center text-[10px] font-black text-text-muted uppercase tracking-[0.2em] my-4 opacity-50">- OR PASTE DATA BELOW -</div>
            <textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              rows={8}
              className="w-full bg-card-input-bg border-2 border-card-input-border rounded-2xl p-5 text-sm font-bold focus:border-blue focus:bg-bg-card transition-all outline-none resize-none text-text-main placeholder:text-text-muted leading-relaxed font-mono"
              placeholder='Incentive, Sự khuyến khích, The bonus serves as an incentive., Tiền thưởng đóng vai trò khích lệ, /ɪnˈsɛntɪv/&#10;Delegate, Ủy thác, Managers must delegate tasks.'
            />
          </div>

          <button
            type="submit"
            disabled={!csvText.trim()}
            className={`w-full h-14 mt-4 transition-all ${
              csvText.trim()
              ? 'btn-3d btn-green'
              : 'bg-gray-path text-text-muted font-black uppercase tracking-widest cursor-not-allowed border-b-4 border-gray-path-dark rounded-2xl'
            }`}
          >
            IMPORT CARDS
          </button>
        </form>
      )}
    </div>
  );
}
