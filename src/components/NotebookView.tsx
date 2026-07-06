import { useState, useMemo } from 'react';
import { KanjiPlayer } from './KanjiPlayer';
import { HanziWriterPad } from './HanziWriterPad';
import { FreeDrawingPad } from './FreeDrawingPad';
import type { GrammarPoint, KanjiEntry } from '../types';
import { HIRAGANA, KATAKANA } from '../data/kana';
import type { KanaChar } from '../data/kana';

interface NotebookViewProps {
  activeTrack: 'english' | 'japanese';
  n2Grammar: GrammarPoint[];
  n2Kanji: KanjiEntry[];
  toeicGrammar: GrammarPoint[];
}

export function NotebookView({ activeTrack, n2Grammar, n2Kanji, toeicGrammar }: NotebookViewProps) {
  const [activeTab, setActiveTab] = useState<'grammar' | 'kanji' | 'alphabet'>(activeTrack === 'japanese' ? 'alphabet' : 'grammar');
  const [kanjiSearch, setKanjiSearch] = useState('');
  const [grammarSearch, setGrammarSearch] = useState('');
  const [selectedKanji, setSelectedKanji] = useState<KanjiEntry | null>(null);

  // Alphabet state
  const [alphabetType, setAlphabetType] = useState<'hiragana' | 'katakana'>('hiragana');
  const [selectedKana, setSelectedKana] = useState<KanaChar | null>(null);

  // Drawing Pad state (replaced by HanziWriterPad, keeping for Kana detail)

  const grammarList = activeTrack === 'japanese' ? n2Grammar : toeicGrammar;
  
  const filteredGrammar = useMemo(() => {
    return grammarList.filter(g => 
      !grammarSearch || 
      g.pattern.toLowerCase().includes(grammarSearch.toLowerCase()) || 
      g.meaning.toLowerCase().includes(grammarSearch.toLowerCase())
    );
  }, [grammarList, grammarSearch]);

  const kanjiList = useMemo(() => n2Kanji.filter(k =>
    !kanjiSearch ||
    k.kanji.includes(kanjiSearch) ||
    k.meaning.toLowerCase().includes(kanjiSearch.toLowerCase()) ||
    k.on_reading?.includes(kanjiSearch) ||
    k.kun_reading?.includes(kanjiSearch)
  ), [n2Kanji, kanjiSearch]);

  return (
    <>
      <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-[var(--text-main)]">
          {activeTrack === 'english' ? 'TOEIC Notebook' : 'N2 Notebook'}
        </h2>
        <p className="font-bold uppercase text-xs tracking-widest" style={{ color: 'var(--text-muted)' }}>
          Personal Reference & Mastery
        </p>
      </div>

      <div className="flex p-1 bg-[var(--gray-bg)] rounded-2xl border-2 border-[var(--gray-path)]">
        <button
          onClick={() => setActiveTab('grammar')}
          className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${activeTab === 'grammar' ? 'bg-[var(--bg-hover)] shadow-sm text-[var(--blue)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
        >
          {activeTrack === 'english' ? 'GRAMMAR' : 'NGỮ PHÁP'}
        </button>
        {activeTrack === 'japanese' && (
          <>
            <button
              onClick={() => setActiveTab('alphabet')}
              className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${activeTab === 'alphabet' ? 'bg-[var(--bg-hover)] shadow-sm text-[var(--blue)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
            >
              BẢNG CHỮ CÁI
            </button>
            <button
              onClick={() => setActiveTab('kanji')}
              className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${activeTab === 'kanji' ? 'bg-[var(--bg-hover)] shadow-sm text-[var(--blue)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
            >
              KANJI
            </button>
          </>
        )}
      </div>

      <div className="grid gap-4">
        {activeTab === 'alphabet' && (
          <div className="space-y-6">
            <div className="flex bg-[var(--bg-hover)] p-1 rounded-xl border border-[var(--gray-path)] w-fit mx-auto">
              <button
                onClick={() => setAlphabetType('hiragana')}
                className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${alphabetType === 'hiragana' ? 'bg-[var(--blue)] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
              >
                Hiragana
              </button>
              <button
                onClick={() => setAlphabetType('katakana')}
                className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${alphabetType === 'katakana' ? 'bg-[var(--blue)] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
              >
                Katakana
              </button>
            </div>

            {(alphabetType === 'hiragana' ? HIRAGANA : KATAKANA).map((group, gIdx) => (
              <div key={gIdx} className="space-y-4">
                <h3 className="font-black text-xl text-[var(--text-main)] border-b-2 border-[var(--gray-path)] pb-2">
                  {group.name}
                </h3>
                <div className={`grid gap-2 ${group.name === 'Yoon' ? 'grid-cols-3' : 'grid-cols-5'}`}>
                  {group.chars.map((char, cIdx) => (
                    char.isEmpty ? (
                      <div key={cIdx} className="aspect-square"></div>
                    ) : (
                      <button
                        key={cIdx}
                        onClick={() => setSelectedKana(char)}
                        className="flex flex-col items-center justify-center aspect-square bg-[var(--bg-main)] rounded-2xl border-2 border-[var(--border-main)] hover:border-[var(--blue)] hover:bg-[var(--tint-blue)] hover:scale-[1.05] transition-all shadow-sm group"
                      >
                        <span className="text-3xl font-black text-[var(--text-main)] group-hover:text-[var(--blue)] transition-colors">{char.kana}</span>
                        <span className="text-xs font-bold text-[var(--text-muted)] mt-1 group-hover:text-[var(--blue)] transition-colors">{char.romaji}</span>
                      </button>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'grammar' && (
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={grammarSearch}
                onChange={(e) => setGrammarSearch(e.target.value)}
                className="w-full rounded-2xl py-3 px-10 font-bold outline-none transition-all"
                style={{ backgroundColor: 'var(--bg-hover)', borderColor: 'var(--border-main)', color: 'var(--text-main)', borderWidth: 2 }}
                placeholder="Tìm ngữ pháp... (VD:虽然, 但是, 因为)"
              />
            </div>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
              {filteredGrammar.length} điểm ngữ pháp
            </p>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredGrammar.length > 0 ? (
                filteredGrammar.map(point => (
                  <div key={point.id} className="lingo-card p-6 border-l-8" style={{ borderLeftColor: 'var(--purple)' }}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-black" style={{ color: 'var(--purple)' }}>{point.pattern}</h3>
                      <span className="text-[10px] font-black px-2 py-1 rounded-md" style={{ backgroundColor: 'var(--gray-bg)', color: 'var(--text-muted)' }}>
                        {point.difficulty}
                      </span>
                    </div>
                    <p className="font-bold text-sm mb-4" style={{ color: 'var(--text-main)' }}>{point.meaning}</p>
                    <div className="p-3 rounded-xl text-xs space-y-1" style={{ backgroundColor: 'var(--gray-bg)' }}>
                      {point.structure && (
                        <div className="mb-2 pb-2" style={{ borderBottom: '1px solid var(--gray-path)' }}>
                          <p className="font-black" style={{ color: 'var(--purple)' }}>Cấu trúc: <span className="font-bold" style={{ color: 'var(--text-main)' }}>{point.structure}</span></p>
                        </div>
                      )}
                      <p className="font-bold" style={{ color: 'var(--text-main)' }}>Ex: {point.example}</p>
                      <p style={{ color: 'var(--text-muted)' }}>{point.exampleTranslation}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 rounded-[2rem] border-2 border-dashed" style={{ backgroundColor: 'var(--gray-bg)', borderColor: 'var(--gray-path)' }}>
                  <p className="font-bold" style={{ color: 'var(--text-muted)' }}>Không tìm thấy ngữ pháp nào phù hợp.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'kanji' && (
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={kanjiSearch}
                onChange={(e) => setKanjiSearch(e.target.value)}
                className="w-full rounded-2xl py-3 px-10 font-bold outline-none transition-all"
                style={{ backgroundColor: 'var(--bg-hover)', borderColor: 'var(--border-main)', color: 'var(--text-main)', borderWidth: 2 }}
                placeholder="Tìm kanji... (VD: 漢, 義, 明)"
              />
            </div>

            <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
              {kanjiList.length} kanji N2
            </p>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {kanjiList.length > 0 ? (
                kanjiList.map(entry => (
                  <div
                    key={entry.id}
                    onClick={() => setSelectedKanji(entry)}
                    className="lingo-card p-5 border-l-8 cursor-pointer hover:scale-[1.02] transition-transform relative z-50"
                    style={{ borderLeftColor: 'var(--red)' }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center rounded-xl border-2" style={{ backgroundColor: 'var(--tint-red)', borderColor: 'var(--red)' }}>
                        <span className="text-3xl font-black" style={{ color: 'var(--red)' }}>{entry.kanji}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {entry.on_reading && (
                            <span className="text-xs font-bold" style={{ color: 'var(--blue)' }}>音: {entry.on_reading}</span>
                          )}
                          {entry.kun_reading && (
                            <span className="text-xs font-bold" style={{ color: 'var(--purple)' }}>訓: {entry.kun_reading}</span>
                          )}
                        </div>
                        <p className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>{entry.meaning}</p>
                        {entry.examples && entry.examples.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {entry.examples.slice(0, 2).map((ex, i) => (
                              <p key={i} className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                                <span className="font-bold" style={{ color: 'var(--text-main)' }}>{ex.word}</span> ({ex.reading}) - {ex.meaning}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 rounded-[2rem] border-2 border-dashed" style={{ backgroundColor: 'var(--gray-bg)', borderColor: 'var(--gray-path)' }}>
                  <p className="font-bold" style={{ color: 'var(--text-muted)' }}>Không tìm thấy kanji nào.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      </div>
      
      {/* Kanji Detail Modal */}
      {selectedKanji && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 view-enter" onClick={() => setSelectedKanji(null)}>
          <div className="w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden rounded-[2rem] shadow-2xl relative" style={{ backgroundColor: 'var(--bg-card)', border: '2px solid var(--gray-path)' }} onClick={e => e.stopPropagation()}>
            {/* Close button */}
            <button
              onClick={() => setSelectedKanji(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center text-lg font-black transition-colors"
              style={{ backgroundColor: 'var(--gray-path)', color: 'var(--text-muted)' }}
            >
              ✕
            </button>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar min-h-0">
              <div className="flex flex-col items-center gap-4">
                <KanjiPlayer kanji={selectedKanji.kanji} />
                <div className="text-center">
                  <h4 className="text-2xl font-black mb-2" style={{ color: 'var(--text-main)' }}>{selectedKanji.meaning}</h4>
                  <div className="flex flex-col gap-1 text-sm font-bold">
                    {selectedKanji.on_reading && <span style={{ color: 'var(--blue)' }}>音 (On): {selectedKanji.on_reading}</span>}
                    {selectedKanji.kun_reading && <span style={{ color: 'var(--purple)' }}>訓 (Kun): {selectedKanji.kun_reading}</span>}
                  </div>
                </div>
              </div>

              {/* Bảng tập viết thông minh (Smart Practice Pad) */}
              <div className="space-y-3 p-4 rounded-2xl" style={{ backgroundColor: 'var(--gray-bg)', border: '2px solid var(--gray-path)' }}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-black flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                    Bảng tập viết thông minh
                    <span className="text-[9px] px-2 py-0.5 rounded uppercase tracking-wider" style={{ backgroundColor: 'var(--gold)', color: 'white' }}>AI</span>
                  </h4>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <HanziWriterPad character={selectedKanji.kanji} size={200} mode="quiz" />
                  <p className="text-center text-xs font-bold" style={{ color: 'var(--text-muted)' }}>Hãy viết theo đúng thứ tự nét chữ. Hệ thống sẽ tự động chấm điểm!</p>
                </div>
              </div>

              {selectedKanji.examples && selectedKanji.examples.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-black border-b-2 pb-2" style={{ color: 'var(--text-main)', borderColor: 'var(--gray-path)' }}>Ví dụ (Examples)</h4>
                  <div className="space-y-2">
                    {selectedKanji.examples.map((ex, i) => (
                      <div key={i} className="p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--gray-path)' }}>
                        <p className="font-black text-lg" style={{ color: 'var(--text-main)' }}>{ex.word}</p>
                        <p className="text-sm font-bold" style={{ color: 'var(--purple)' }}>{ex.reading}</p>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{ex.meaning}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Kana Detail Modal */}
      {selectedKana && (
        <div className="fixed inset-0 z-[9999] flex flex-col" style={{ backgroundColor: 'var(--bg-main)' }}>
          {/* Header */}
          <div className="flex items-center justify-between p-3 shrink-0" style={{ borderBottom: '2px solid var(--gray-path)', backgroundColor: 'var(--gray-bg)' }}>
            <h3 className="font-black text-lg" style={{ color: 'var(--text-main)' }}>Chi tiết Chữ cái</h3>
            <button
              onClick={() => setSelectedKana(null)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-black transition-colors"
              style={{ backgroundColor: 'var(--gray-path)', color: 'var(--text-muted)' }}
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar min-h-0">
            {/* Character + romaji */}
            <div className="flex flex-col items-center gap-3">
              <KanjiPlayer kanji={selectedKana.kana.charAt(0)} />
              <div className="text-center">
                <h4 className="text-5xl font-black mb-2" style={{ color: 'var(--text-main)' }}>{selectedKana.kana}</h4>
                <span className="text-xl font-bold px-4 py-1 rounded-xl" style={{ backgroundColor: 'var(--tint-blue)', color: 'var(--blue)', border: '2px solid var(--blue)' }}>{selectedKana.romaji}</span>
              </div>
            </div>

            {/* Drawing pad */}
            <div className="p-3 rounded-2xl" style={{ backgroundColor: 'var(--gray-bg)', border: '2px solid var(--gray-path)' }}>
              <h4 className="font-black mb-2 text-sm" style={{ color: 'var(--text-main)' }}>Bảng tập viết</h4>
              <div className="flex flex-col items-center gap-3">
                <FreeDrawingPad character={selectedKana.kana} size={160} />
                <p className="text-center text-xs font-bold" style={{ color: 'var(--text-muted)' }}>Dùng ngón tay hoặc chuột để luyện viết theo nét chữ mờ!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
