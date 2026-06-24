import { useState } from 'react';
import type { AuthenticExam } from '../types';

interface ExamReviewViewProps {
  exam: AuthenticExam;
  answers: Record<string, number>;
  onClose: () => void;
}

export function ExamReviewView({ exam, answers, onClose }: ExamReviewViewProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const currentSection = exam.sections[currentSectionIndex];

  // Calculate score summary
  let correct = 0;
  let total = 0;
  exam.sections.forEach(sec => {
    sec.questions.forEach(q => {
      total++;
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
  });
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="w-full h-[85vh] flex flex-col view-enter bg-[var(--bg-main)] rounded-2xl border-2 border-[var(--gray-path)] overflow-hidden shadow-xl">
      {/* Header */}
      <div className="h-16 border-b-2 border-[var(--gray-path)] bg-[var(--gray-bg)] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="text-xl font-black text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
            ✕
          </button>
          <h2 className="text-lg font-black">{exam.title} - Review</h2>
        </div>
        <div className={`font-black text-xl tracking-wider ${percentage >= 80 ? 'text-[var(--green)]' : percentage >= 50 ? 'text-[var(--gold)]' : 'text-[var(--red)]'}`}>
          Score: {correct}/{total} ({percentage}%)
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="w-48 border-r-2 border-[var(--gray-path)] bg-[var(--gray-bg)] p-4 overflow-y-auto hidden md:block">
          <h3 className="font-black text-sm uppercase tracking-widest text-[var(--text-muted)] mb-4">Sections</h3>
          <div className="space-y-2">
            {exam.sections.map((sec, idx) => {
              const isActive = idx === currentSectionIndex;
              
              let secCorrect = 0;
              let secTotal = 0;
              sec.questions.forEach(q => {
                secTotal++;
                if (answers[q.id] === q.correctAnswer) secCorrect++;
              });
              const isPerfect = secCorrect === secTotal && secTotal > 0;

              return (
                <button
                  key={sec.id}
                  onClick={() => setCurrentSectionIndex(idx)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all border-2 ${
                    isActive ? 'bg-[var(--tint-blue)] text-[var(--blue)] border-[var(--tint-blue)]' :
                    isPerfect ? 'bg-[var(--tint-green)] text-[var(--green-shadow)] border-[var(--tint-green)]' :
                    'bg-transparent border-transparent hover:bg-[var(--gray-path)] text-[var(--text-main)]'
                  }`}
                >
                  <span className="truncate pr-2">{sec.title}</span>
                  <span className={`shrink-0 ${isPerfect ? 'text-[var(--green)]' : 'text-[var(--text-muted)]'}`}>
                    {secCorrect}/{secTotal}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth bg-[var(--bg-main)]">
          <div className="max-w-2xl mx-auto space-y-8 pb-32">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-[var(--text-main)]">{currentSection.title}</h2>
              {currentSection.description && (
                <p className="text-sm font-bold text-[var(--text-muted)]">{currentSection.description}</p>
              )}
            </div>

            <div className="space-y-10">
              {currentSection.questions.map((q, qIndex) => {
                const isCorrect = answers[q.id] === q.correctAnswer;
                const isUnanswered = answers[q.id] === undefined;

                return (
                  <div key={q.id} className={`p-6 rounded-[1.5rem] border-2 shadow-sm space-y-6 ${
                    isCorrect ? 'border-[var(--green)] bg-[var(--tint-green)]/30' : 
                    isUnanswered ? 'border-[var(--gold)] bg-[var(--tint-gold)]/30' :
                    'border-[var(--red)] bg-[var(--tint-red)]/30'
                  }`}>
                    <div className="flex items-start gap-4">
                      <span className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-black text-sm shrink-0 ${
                        isCorrect ? 'bg-[var(--green)]' :
                        isUnanswered ? 'bg-[var(--gold)]' :
                        'bg-[var(--red)]'
                      }`}>
                        {qIndex + 1}
                      </span>
                      <div className="space-y-4 w-full">
                        {q.passage && (
                          <div className="p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--gray-path)] whitespace-pre-wrap text-sm font-medium">
                            {q.passage}
                          </div>
                        )}
                        {q.imageUrl && (
                          <img src={q.imageUrl} alt="Question figure" className="max-w-full h-auto rounded-xl border-2 border-[var(--gray-path)]" />
                        )}
                        {q.audioUrl && (
                          <audio controls src={q.audioUrl} className="w-full outline-none" />
                        )}
                        {q.text && (
                          <h3 className="text-lg font-bold">{q.text}</h3>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 pl-12">
                      {q.options.map((opt, oIdx) => {
                        const isUserAnswer = answers[q.id] === oIdx;
                        const isActualCorrect = q.correctAnswer === oIdx;
                        
                        let optionStyle = 'bg-[var(--bg-card)] border-[var(--gray-path)] text-[var(--text-main)]';
                        let badgeStyle = 'border-[var(--gray-path)]';
                        
                        if (isActualCorrect) {
                          optionStyle = 'bg-[var(--tint-green)] border-[var(--green)] text-[var(--green-shadow)]';
                          badgeStyle = 'bg-[var(--green)] border-[var(--green)] text-white';
                        } else if (isUserAnswer && !isActualCorrect) {
                          optionStyle = 'bg-[var(--tint-red)] border-[var(--red)] text-[var(--red-shadow)]';
                          badgeStyle = 'bg-[var(--red)] border-[var(--red)] text-white';
                        }

                        const labels = ['A', 'B', 'C', 'D'];
                        
                        return (
                          <div
                            key={oIdx}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 ${optionStyle}`}
                          >
                            <span className={`flex items-center justify-center w-8 h-8 rounded-lg font-black text-sm border-2 ${badgeStyle}`}>
                              {labels[oIdx]}
                            </span>
                            <span className="font-bold text-left flex-1">{opt}</span>
                            {isActualCorrect && (
                              <span className="text-[var(--green)] font-black text-xl">✓</span>
                            )}
                            {isUserAnswer && !isActualCorrect && (
                              <span className="text-[var(--red)] font-black text-xl">✕</span>
                            )}
                          </div>
                        );
                      })}
                      {isUnanswered && (
                        <p className="text-sm font-bold text-[var(--gold)] mt-2">
                          Bạn đã bỏ qua câu hỏi này.
                        </p>
                      )}

                      {(q.passage || q.explanation) && (
                        <div className="mt-4 p-4 rounded-xl bg-[var(--bg-main)] border-2 border-[var(--gray-path)] space-y-3">
                          {q.passage && (
                            <div>
                              <p className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mb-1">Passage (Đoạn văn)</p>
                              <p className="text-sm font-medium text-[var(--text-main)] whitespace-pre-wrap">{q.passage}</p>
                            </div>
                          )}
                          {q.explanation && (
                            <div>
                              <p className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mb-1">Explanation (Giải thích đáp án)</p>
                              <p className="text-sm font-medium text-[var(--text-main)] whitespace-pre-wrap">{q.explanation}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Footer */}
            <div className="flex items-center justify-between pt-8 border-t-2 border-[var(--gray-path)] mt-8">
              <button
                disabled={currentSectionIndex === 0}
                onClick={() => setCurrentSectionIndex(prev => prev - 1)}
                className="btn-duo btn-gray px-6 py-3 disabled:opacity-50"
              >
                PREVIOUS SECTION
              </button>
              
              {currentSectionIndex < exam.sections.length - 1 ? (
                <button
                  onClick={() => setCurrentSectionIndex(prev => prev + 1)}
                  className="btn-duo btn-blue px-6 py-3"
                >
                  NEXT SECTION
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="btn-duo btn-green px-8 py-3"
                >
                  RETURN TO MENU
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
