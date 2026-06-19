import { useState } from 'react';
import type { GrammarPoint } from '../types';
import { SEED_N2_GRAMMAR, SEED_N2_KANJI } from '../data/contentLoader';

interface NotebookViewProps {
  activeTrack: 'english' | 'japanese';
}

const TOEIC_GRAMMAR: GrammarPoint[] = [
  { id: 'tg-1', pattern: 'Present Perfect', meaning: 'Thì hiện tại hoàn thành', example: 'I have worked here for 5 years.', exampleTranslation: 'Tôi đã làm việc ở đây 5 năm.', difficulty: 'intermediate' },
  { id: 'tg-2', pattern: 'Passive Voice', meaning: 'Câu bị động', example: 'The report was submitted yesterday.', exampleTranslation: 'Báo cáo đã được nộp hôm qua.', difficulty: 'intermediate' },
  { id: 'tg-3', pattern: 'Conditional', meaning: 'Câu điều kiện', example: 'If we had more time, we would finish.', exampleTranslation: 'Nếu chúng ta có thêm thời gian, chúng ta sẽ hoàn thành.', difficulty: 'advanced' },
  { id: 'tg-4', pattern: 'Relative Clauses', meaning: 'Mệnh đề quan hệ', example: 'The manager who approved the project resigned.', exampleTranslation: 'Người quản lý đã phê duyệt dự án đã từ chức.', difficulty: 'advanced' },
];

export function NotebookView({ activeTrack }: NotebookViewProps) {
  const [activeTab, setActiveTab] = useState<'grammar' | 'kanji'>(activeTrack === 'japanese' ? 'kanji' : 'grammar');
  const [kanjiSearch, setKanjiSearch] = useState('');

  const grammarList = activeTrack === 'japanese' ? SEED_N2_GRAMMAR : TOEIC_GRAMMAR;
  const kanjiList = SEED_N2_KANJI.filter(k =>
    !kanjiSearch ||
    k.kanji.includes(kanjiSearch) ||
    k.meaning.includes(kanjiSearch) ||
    k.on_reading?.includes(kanjiSearch) ||
    k.kun_reading?.includes(kanjiSearch)
  );

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-[var(--text-main)]">
          {activeTrack === 'english' ? '📔 TOEIC Notebook' : '📔 N2 Notebook'}
        </h2>
        <p className="text-[var(--text-muted)] font-bold uppercase text-xs tracking-widest">
          Personal Reference & Mastery
        </p>
      </div>

      <div className="flex p-1 bg-[var(--gray-bg)] rounded-2xl border-2 border-[var(--gray-path)]">
        <button 
          onClick={() => setActiveTab('grammar')}
          className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${activeTab === 'grammar' ? 'bg-white shadow-sm text-[var(--blue)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
        >
          {activeTrack === 'english' ? 'GRAMMAR' : 'NGỮ PHÁP'}
        </button>
        {activeTrack === 'japanese' && (
          <button 
            onClick={() => setActiveTab('kanji')}
            className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${activeTab === 'kanji' ? 'bg-white shadow-sm text-[var(--blue)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
          >
            KANJI
          </button>
        )}
      </div>

      <div className="grid gap-4">
        {activeTab === 'grammar' && (
          grammarList.length > 0 ? (
            grammarList.map(point => (
              <div key={point.id} className="lingo-card p-6 border-l-8 border-l-[var(--purple)]">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-black text-[var(--purple)]">{point.pattern}</h3>
                  <span className="text-[10px] font-black px-2 py-1 rounded-md bg-[var(--gray-bg)] text-[var(--text-muted)] uppercase">
                    {point.difficulty}
                  </span>
                </div>
                <p className="font-bold text-sm mb-4 text-[var(--text-main)]">{point.meaning}</p>
                <div className="bg-[var(--gray-bg)] p-3 rounded-xl text-xs space-y-1">
                  <p className="font-bold text-[var(--text-main)]">Ex: {point.example}</p>
                  <p className="text-[var(--text-muted)]">{point.exampleTranslation}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-[var(--gray-bg)] rounded-[2rem] border-2 border-dashed border-[var(--gray-path)]">
              <p className="text-[var(--text-muted)] font-bold">Chưa có ngữ pháp nào được lưu.</p>
            </div>
          )
        )}

        {activeTab === 'kanji' && (
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={kanjiSearch}
                onChange={(e) => setKanjiSearch(e.target.value)}
                className="w-full bg-[var(--bg-hover)] border-2 border-[var(--border-main)] rounded-2xl py-3 px-10 font-bold outline-none focus:border-[var(--blue)] transition-all text-[var(--text-main)]"
                placeholder="Tìm kanji... (VD: 漢, 義, 明)"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
            </div>

            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">
              {kanjiList.length} kanji N2
            </p>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {kanjiList.length > 0 ? (
                kanjiList.map(entry => (
                  <div key={entry.id} className="lingo-card p-5 border-l-8 border-l-[var(--red)]">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-[var(--tint-red)] rounded-xl border-2 border-[var(--red)]">
                        <span className="text-3xl font-black text-[var(--red)]">{entry.kanji}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {entry.on_reading && (
                            <span className="text-xs font-bold text-[var(--blue)]">音: {entry.on_reading}</span>
                          )}
                          {entry.kun_reading && (
                            <span className="text-xs font-bold text-[var(--purple)]">訓: {entry.kun_reading}</span>
                          )}
                        </div>
                        <p className="font-bold text-sm text-[var(--text-main)]">{entry.meaning}</p>
                        {entry.examples && entry.examples.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {entry.examples.slice(0, 2).map((ex, i) => (
                              <p key={i} className="text-[11px] text-[var(--text-muted)]">
                                <span className="font-bold text-[var(--text-main)]">{ex.word}</span> ({ex.reading}) - {ex.meaning}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-[var(--gray-bg)] rounded-[2rem] border-2 border-dashed border-[var(--gray-path)]">
                  <p className="text-[var(--text-muted)] font-bold">Không tìm thấy kanji nào.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
