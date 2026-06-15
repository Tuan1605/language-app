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
    <div className="bg-white rounded-[2rem] p-8 shadow-2xl shadow-slate-200 border border-slate-100">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Thêm thẻ mới</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Từ vựng / Cấu trúc</label>
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl p-4 text-lg font-medium focus:ring-2 focus:ring-indigo-500 transition-all outline-none placeholder:text-slate-300"
            placeholder="Ví dụ: Approach / 接近"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Định nghĩa / Giải nghĩa</label>
          <textarea
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            rows={3}
            className="w-full bg-slate-50 border-none rounded-2xl p-4 text-lg font-medium focus:ring-2 focus:ring-indigo-500 transition-all outline-none placeholder:text-slate-300"
            placeholder="Nhập ý nghĩa của từ..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Ngôn ngữ mục tiêu</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setLanguage('english')}
              className={`py-3 rounded-xl font-bold transition-all ${language === 'english' ? 'bg-blue-500 text-white shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              English (TOEIC)
            </button>
            <button
              type="button"
              onClick={() => setLanguage('japanese')}
              className={`py-3 rounded-xl font-bold transition-all ${language === 'japanese' ? 'bg-red-500 text-white shadow-lg shadow-red-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              Japanese (N2)
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 mt-4 active:scale-95"
        >
          Lưu vào kho từ vựng
        </button>
      </form>
    </div>
  );
}
