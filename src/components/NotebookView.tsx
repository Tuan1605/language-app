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
          <>
            <button 
              onClick={() => setActiveTab('alphabet')}
              className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${activeTab === 'alphabet' ? 'bg-white shadow-sm text-[var(--blue)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
            >
              BẢNG CHỮ CÁI
            </button>
            <button 
              onClick={() => setActiveTab('kanji')}
              className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${activeTab === 'kanji' ? 'bg-white shadow-sm text-[var(--blue)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
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
                className="w-full bg-[var(--bg-hover)] border-2 border-[var(--border-main)] rounded-2xl py-3 px-10 font-bold outline-none focus:border-[var(--blue)] transition-all text-[var(--text-main)]"
                placeholder={activeTrack === 'english' ? "Search grammar..." : "Tìm mẫu ngữ pháp..."}
              />
            </div>
            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">
              {filteredGrammar.length} điểm ngữ pháp
            </p>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredGrammar.length > 0 ? (
                filteredGrammar.map(point => (
                  <div key={point.id} className="lingo-card p-6 border-l-8 border-l-[var(--purple)]">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-black text-[var(--purple)]">{point.pattern}</h3>
                      <span className="text-[10px] font-black px-2 py-1 rounded-md bg-[var(--gray-bg)] text-[var(--text-muted)] uppercase">
                        {point.difficulty}
                      </span>
                    </div>
                    <p className="font-bold text-sm mb-4 text-[var(--text-main)]">{point.meaning}</p>
                    <div className="bg-[var(--gray-bg)] p-3 rounded-xl text-xs space-y-1">
                      {point.structure && (
                        <div className="mb-2 pb-2 border-b border-[var(--gray-path)]">
                          <p className="font-black text-[var(--purple)]">Cấu trúc: <span className="font-bold text-[var(--text-main)]">{point.structure}</span></p>
                        </div>
                      )}
                      <p className="font-bold text-[var(--text-main)]">Ex: {point.example}</p>
                      <p className="text-[var(--text-muted)]">{point.exampleTranslation}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-[var(--gray-bg)] rounded-[2rem] border-2 border-dashed border-[var(--gray-path)]">
                  <p className="text-[var(--text-muted)] font-bold">Không tìm thấy ngữ pháp nào phù hợp.</p>
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
                className="w-full bg-[var(--bg-hover)] border-2 border-[var(--border-main)] rounded-2xl py-3 px-10 font-bold outline-none focus:border-[var(--blue)] transition-all text-[var(--text-main)]"
                placeholder="Tìm kanji... (VD: 漢, 義, 明)"
              />
              {/* Removed search icon emoji */}
            </div>

            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">
              {kanjiList.length} kanji N2
            </p>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {kanjiList.length > 0 ? (
                kanjiList.map(entry => (
                  <div 
                    key={entry.id} 
                    onClick={() => setSelectedKanji(entry)}
                    className="lingo-card p-5 border-l-8 border-l-[var(--red)] cursor-pointer hover:scale-[1.02] transition-transform relative z-50"
                  >
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
      
      {/* Kanji Detail Modal */}
      {selectedKanji && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm view-enter">
          <div className="bg-[var(--bg-main)] w-full max-w-lg rounded-[2rem] border-2 border-[var(--gray-path)] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden relative">
            <div className="flex justify-between items-center p-4 border-b-2 border-[var(--gray-path)] bg-[var(--gray-bg)]">
              <h3 className="font-black text-lg text-[var(--text-main)]">Chi tiết Kanji</h3>
              <button 
                onClick={() => setSelectedKanji(null)}
                className="w-8 h-8 rounded-full bg-[var(--gray-path)] flex items-center justify-center text-xl font-black text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 space-y-6 custom-scrollbar">
              <div className="flex flex-col items-center gap-4">
                <KanjiPlayer kanji={selectedKanji.kanji} />
                <div className="text-center">
                  <h4 className="text-2xl font-black text-[var(--text-main)] mb-2">{selectedKanji.meaning}</h4>
                  <div className="flex flex-col gap-1 text-sm font-bold">
                    {selectedKanji.on_reading && <span className="text-[var(--blue)]">音 (On): {selectedKanji.on_reading}</span>}
                    {selectedKanji.kun_reading && <span className="text-[var(--purple)]">訓 (Kun): {selectedKanji.kun_reading}</span>}
                  </div>
                </div>
              </div>

              {/* Bảng tập viết thông minh (Smart Practice Pad) */}
              <div className="space-y-3 bg-[var(--gray-bg)] p-4 rounded-2xl border-2 border-[var(--gray-path)]">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-black text-[var(--text-main)] flex items-center gap-2">
                    Bảng tập viết thông minh
                    <span className="text-[9px] bg-[var(--gold)] text-white px-2 py-0.5 rounded uppercase tracking-wider">AI</span>
                  </h4>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <HanziWriterPad character={selectedKanji.kanji} size={200} mode="quiz" />
                  <p className="text-center text-xs font-bold text-[var(--text-muted)]">Hãy viết theo đúng thứ tự nét chữ. Hệ thống sẽ tự động chấm điểm!</p>
                </div>
              </div>

              {selectedKanji.examples && selectedKanji.examples.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-black text-[var(--text-main)] border-b-2 border-[var(--gray-path)] pb-2">Ví dụ (Examples)</h4>
                  <div className="space-y-2">
                    {selectedKanji.examples.map((ex, i) => (
                      <div key={i} className="bg-[var(--bg-main)] p-3 rounded-xl border border-[var(--gray-path)]">
                        <p className="font-black text-[var(--text-main)] text-lg">{ex.word}</p>
                        <p className="text-sm font-bold text-[var(--purple)]">{ex.reading}</p>
                        <p className="text-sm text-[var(--text-muted)] mt-1">{ex.meaning}</p>
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm view-enter">
          <div className="bg-[var(--bg-main)] w-full max-w-lg rounded-[2rem] border-2 border-[var(--gray-path)] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden relative">
            <div className="flex justify-between items-center p-4 border-b-2 border-[var(--gray-path)] bg-[var(--gray-bg)]">
              <h3 className="font-black text-lg text-[var(--text-main)]">Chi tiết Chữ cái</h3>
              <button 
                onClick={() => setSelectedKana(null)}
                className="w-8 h-8 rounded-full bg-[var(--gray-path)] flex items-center justify-center text-xl font-black text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 space-y-6 custom-scrollbar">
              <div className="flex flex-col items-center gap-4">
                <KanjiPlayer kanji={selectedKana.kana.charAt(0)} />
                <div className="text-center">
                  <h4 className="text-5xl font-black text-[var(--text-main)] mb-2">{selectedKana.kana}</h4>
                  <div className="flex justify-center">
                     <span className="text-xl font-bold px-4 py-1 bg-[var(--tint-blue)] text-[var(--blue)] rounded-xl border-2 border-[var(--blue)]">{selectedKana.romaji}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 bg-[var(--gray-bg)] p-4 rounded-2xl border-2 border-[var(--gray-path)]">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-black text-[var(--text-main)] flex items-center gap-2">
                    Bảng tập viết
                  </h4>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <FreeDrawingPad character={selectedKana.kana} size={200} />
                  <p className="text-center text-xs font-bold text-[var(--text-muted)]">Hãy dùng ngón tay hoặc chuột để luyện viết đồ theo nét chữ mờ!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
