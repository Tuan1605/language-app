import { useState, useRef } from 'react';
import { KanjiPlayer } from './KanjiPlayer';
import type { GrammarPoint, KanjiEntry } from '../types';

interface NotebookViewProps {
  activeTrack: 'english' | 'japanese';
  n2Grammar: GrammarPoint[];
  n2Kanji: KanjiEntry[];
}

const TOEIC_GRAMMAR: GrammarPoint[] = [
  // ═══ TENSES ═══
  { id: 'tg-1', pattern: 'Present Perfect', meaning: 'Thì hiện tại hoàn thành', example: 'I have worked here for 5 years.', exampleTranslation: 'Tôi đã làm việc ở đây 5 năm.', difficulty: 'intermediate' },
  { id: 'tg-2', pattern: 'Past Perfect', meaning: 'Thì quá khứ hoàn thành', example: 'She had already left when I arrived.', exampleTranslation: 'Cô ấy đã rời đi khi tôi đến.', difficulty: 'advanced' },
  { id: 'tg-3', pattern: 'Future Perfect', meaning: 'Thì tương lai hoàn thành', example: 'By next year, we will have completed the project.', exampleTranslation: 'Đến năm sau, chúng tôi sẽ hoàn thành dự án.', difficulty: 'advanced' },
  { id: 'tg-4', pattern: 'Present Perfect Continuous', meaning: 'Hiện tại hoàn thành tiếp diễn', example: 'I have been working on this report all morning.', exampleTranslation: 'Tôi đã làm báo cáo này cả buổi sáng.', difficulty: 'advanced' },
  { id: 'tg-5', pattern: 'Simple Past vs. Present Perfect', meaning: 'So sánh quá khứ đơn và hiện tại hoàn thành', example: 'I visited Paris last year. / I have visited Paris twice.', exampleTranslation: 'Tôi đã thăm Paris năm ngoái. / Tôi đã thăm Paris hai lần.', difficulty: 'intermediate' },

  // ═══ PASSIVE VOICE ═══
  { id: 'tg-6', pattern: 'Passive Voice', meaning: 'Câu bị động', example: 'The report was submitted yesterday.', exampleTranslation: 'Báo cáo đã được nộp hôm qua.', difficulty: 'intermediate' },
  { id: 'tg-7', pattern: 'Passive with Modals', meaning: 'Bị động với trợ động từ', example: 'The proposal must be approved by the board.', exampleTranslation: 'Đề xuất phải được hội đồng phê duyệt.', difficulty: 'intermediate' },

  // ═══ CONDITIONALS ═══
  { id: 'tg-8', pattern: 'First Conditional', meaning: 'Câu điều kiện loại 1 (thực tế)', example: 'If we finish early, we will go out for dinner.', exampleTranslation: 'Nếu xong sớm, chúng ta sẽ đi ăn tối.', difficulty: 'beginner' },
  { id: 'tg-9', pattern: 'Second Conditional', meaning: 'Câu điều kiện loại 2 (giả định)', example: 'If we had more time, we would finish the project.', exampleTranslation: 'Nếu có thêm thời gian, chúng ta sẽ hoàn thành dự án.', difficulty: 'advanced' },
  { id: 'tg-10', pattern: 'Third Conditional', meaning: 'Câu điều kiện loại 3 (không thực)', example: 'If I had known, I would have informed you.', exampleTranslation: 'Nếu tôi biết, tôi đã thông báo cho bạn.', difficulty: 'advanced' },

  // ═══ RELATIVE CLAUSES ═══
  { id: 'tg-11', pattern: 'Relative Clauses (who/which/that)', meaning: 'Mệnh đề quan hệ', example: 'The manager who approved the project resigned.', exampleTranslation: 'Người quản lý đã phê duyệt dự án đã từ chức.', difficulty: 'intermediate' },
  { id: 'tg-12', pattern: 'Non-defining Relative Clauses', meaning: 'Mệnh đề quan hệ không xác định', example: 'Mr. Kim, who is our CEO, will attend the conference.', exampleTranslation: 'Ông Kim, người là CEO, sẽ tham dự hội nghị.', difficulty: 'advanced' },

  // ═══ SUBJECT-VERB AGREEMENT ═══
  { id: 'tg-13', pattern: 'Subject-Verb Agreement', meaning: 'Sự hòa hợp chủ-vị', example: 'The manager, along with his team, was present.', exampleTranslation: 'Quản lý, cùng với đội, đã có mặt.', difficulty: 'intermediate' },
  { id: 'tg-14', pattern: 'Neither...nor / Either...or', meaning: 'Cấu trúc tương liên', example: 'Neither the director nor the employees were available.', exampleTranslation: 'Không giám đốc lẫn nhân viên nào có mặt.', difficulty: 'intermediate' },

  // ═══ GERUNDS & INFINITIVES ═══
  { id: 'tg-15', pattern: 'Gerund as Subject', meaning: 'Danh động từ làm chủ ngữ', example: 'Managing a team requires excellent communication skills.', exampleTranslation: 'Quản lý đội nhóm đòi hỏi kỹ năng giao tiếp tốt.', difficulty: 'intermediate' },
  { id: 'tg-16', pattern: 'Verb + Gerund vs. Infinitive', meaning: 'Động từ + Ving vs. to V', example: 'She enjoys working here. / She wants to work here.', exampleTranslation: 'Cô ấy thích làm việc ở đây. / Cô ấy muốn làm ở đây.', difficulty: 'intermediate' },

  // ═══ COMPARATIVES & SUPERLATIVES ═══
  { id: 'tg-17', pattern: 'Comparative', meaning: 'So sánh hơn', example: 'This product is more durable than the previous model.', exampleTranslation: 'Sản phẩm này bền hơn mẫu trước.', difficulty: 'beginner' },
  { id: 'tg-18', pattern: 'Superlative', meaning: 'So sánh nhất', example: 'This is the most successful campaign we have ever run.', exampleTranslation: 'Đây là chiến dịch thành công nhất chúng tôi từng thực hiện.', difficulty: 'beginner' },

  // ═══ ARTICLES ═══
  { id: 'tg-19', pattern: 'Articles (a/an/the)', meaning: 'Mạo từ', example: 'The CEO gave a speech at the conference.', exampleTranslation: 'CEO đã phát biểu tại hội nghị.', difficulty: 'beginner' },

  // ═══ PREPOSITIONS ═══
  { id: 'tg-20', pattern: 'Prepositions of Time', meaning: 'Giới từ chỉ thời gian (at/on/in/by)', example: 'The meeting is on Monday at 3 PM.', exampleTranslation: 'Cuộc họp vào thứ Hai lúc 3 giờ chiều.', difficulty: 'beginner' },
  { id: 'tg-21', pattern: 'Prepositions of Place', meaning: 'Giới từ chỉ nơi chốn', example: 'The office is located in the downtown area.', exampleTranslation: 'Văn phòng nằm ở khu trung tâm.', difficulty: 'beginner' },

  // ═══ MODALS ═══
  { id: 'tg-22', pattern: 'Modal Verbs (must/should/can/may)', meaning: 'Trợ động từ tình thái', example: 'Employees must complete the training by Friday.', exampleTranslation: 'Nhân viên phải hoàn thành đào tạo trước thứ Sáu.', difficulty: 'beginner' },
  { id: 'tg-23', pattern: 'Must have / Should have', meaning: 'Suy luận về quá khứ', example: 'He must have forgotten the meeting.', exampleTranslation: 'Anh ấy chắc hẳn đã quên cuộc họp.', difficulty: 'advanced' },

  // ═══ REPORTED SPEECH ═══
  { id: 'tg-24', pattern: 'Reported Speech', meaning: 'Câu tường thuật', example: 'She said that the deadline had been extended.', exampleTranslation: 'Cô ấy nói rằng hạn chót đã được gia hạn.', difficulty: 'intermediate' },

  // ═══ WORD FORMS ═══
  { id: 'tg-25', pattern: 'Noun / Adjective / Adverb Forms', meaning: 'Biến thể từ loại', example: 'The company achieved considerable (adj) success. They succeeded considerably (adv).', exampleTranslation: 'Công ty đạt thành công đáng kể. Họ thành công đáng kể.', difficulty: 'intermediate' },
  { id: 'tg-26', pattern: 'Causative (have/get something done)', meaning: 'Câu nhờ bảo', example: 'We had the report reviewed by an expert.', exampleTranslation: 'Chúng tôi đã nhờ chuyên gia xem xét báo cáo.', difficulty: 'advanced' },

  // ═══ CONJUNCTIONS ═══
  { id: 'tg-27', pattern: 'Although / Despite / In spite of', meaning: 'Mệnh đề nhượng bộ', example: 'Although sales declined, profits remained stable.', exampleTranslation: 'Mặc dù doanh số giảm, lợi nhuận vẫn ổn định.', difficulty: 'intermediate' },
  { id: 'tg-28', pattern: 'Due to / Because of / Owing to', meaning: 'Nguyên nhân', example: 'Due to heavy rain, the event was postponed.', exampleTranslation: 'Do mưa lớn, sự kiện bị hoãn.', difficulty: 'intermediate' },

  // ═══ ADVANCED PATTERNS ═══
  { id: 'tg-29', pattern: 'Inversion', meaning: 'Đảo ngữ', example: 'Not only did sales increase, but profits also rose.', exampleTranslation: 'Không chỉ doanh số tăng mà lợi nhuận cũng tăng.', difficulty: 'advanced' },
  { id: 'tg-30', pattern: 'Participle Clauses', meaning: 'Mệnh đề phân từ', example: 'Having reviewed the data, the team proposed a new strategy.', exampleTranslation: 'Sau khi xem xét dữ liệu, đội đã đề xuất chiến lược mới.', difficulty: 'advanced' },
  { id: 'tg-31', pattern: 'Subjunctive (suggest/recommend)', meaning: 'Giả định cách', example: 'The manager suggested that he attend the training.', exampleTranslation: 'Quản lý đề nghị anh ấy tham dự đào tạo.', difficulty: 'advanced' },
  { id: 'tg-32', pattern: 'Cleft Sentences', meaning: 'Câu chẻ (nhấn mạnh)', example: 'It was the marketing team that proposed the new strategy.', exampleTranslation: 'Chính đội marketing đã đề xuất chiến lược mới.', difficulty: 'advanced' },
];

export function NotebookView({ activeTrack, n2Grammar, n2Kanji }: NotebookViewProps) {
  const [activeTab, setActiveTab] = useState<'grammar' | 'kanji'>(activeTrack === 'japanese' ? 'kanji' : 'grammar');
  const [kanjiSearch, setKanjiSearch] = useState('');
  const [selectedKanji, setSelectedKanji] = useState<KanjiEntry | null>(null);

  // Drawing Pad state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const grammarList = activeTrack === 'japanese' ? n2Grammar : TOEIC_GRAMMAR;
  const kanjiList = n2Kanji.filter(k =>
    !kanjiSearch ||
    k.kanji.includes(kanjiSearch) ||
    k.meaning.includes(kanjiSearch) ||
    k.on_reading?.includes(kanjiSearch) ||
    k.kun_reading?.includes(kanjiSearch)
  );

  return (
    <>
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
                  <div 
                    key={entry.id} 
                    onClick={() => {
                      console.log('Kanji clicked:', entry.kanji);
                      setSelectedKanji(entry);
                    }}
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

              {/* Bảng tập viết (Practice Pad) */}
              <div className="space-y-3 bg-[var(--gray-bg)] p-4 rounded-2xl border-2 border-[var(--gray-path)]">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-[var(--text-main)]">✍️ Bảng tập viết</h4>
                  <button onClick={clearCanvas} className="text-xs font-bold px-3 py-1 bg-[var(--gray-path)] text-[var(--text-main)] rounded-lg hover:bg-[var(--border-main)]">Xóa</button>
                </div>
                <div className="relative w-full aspect-square max-w-[200px] mx-auto bg-white rounded-xl border-2 border-[var(--gray-path)] overflow-hidden shadow-inner cursor-crosshair">
                  {/* Grid lines */}
                  <div className="absolute inset-0 pointer-events-none border-b border-dashed border-gray-300 top-1/2"></div>
                  <div className="absolute inset-0 pointer-events-none border-r border-dashed border-gray-300 left-1/2"></div>
                  
                  {/* Background faint kanji for tracing */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                    <span className="text-[140px] font-[serif] text-black">{selectedKanji.kanji}</span>
                  </div>

                  <canvas
                    ref={canvasRef}
                    width={200}
                    height={200}
                    onMouseDown={startDrawing}
                    onMouseUp={stopDrawing}
                    onMouseOut={stopDrawing}
                    onMouseMove={draw}
                    onTouchStart={startDrawing}
                    onTouchEnd={stopDrawing}
                    onTouchMove={draw}
                    className="absolute inset-0 w-full h-full touch-none"
                  />
                </div>
                <p className="text-center text-xs font-bold text-[var(--text-muted)]">Bạn có thể dùng chuột hoặc ngón tay để đồ theo nét chữ mờ phía trên.</p>
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
    </>
  );
}
