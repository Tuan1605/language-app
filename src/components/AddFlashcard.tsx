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
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Thêm từ mới</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">Từ vựng</label>
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="e.g. Approach / 接近"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Định nghĩa</label>
        <textarea
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Giải nghĩa của từ..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Ngôn ngữ</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as 'english' | 'japanese')}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="english">Tiếng Anh (TOEIC)</option>
          <option value="japanese">Tiếng Nhật (N2)</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition"
      >
        Lưu thẻ
      </button>
    </form>
  );
}
