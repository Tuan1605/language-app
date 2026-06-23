import { useState, useEffect } from 'react';
import type { AuthenticExam } from '../types';


interface RealExamViewProps {
  exam: AuthenticExam;
  onCancel: () => void;
  onComplete: (score: number, total: number) => void;
}

export function RealExamView({ exam, onCancel, onComplete }: RealExamViewProps) {
  const [timeLeft, setTimeLeft] = useState(exam.timeLimitMinutes * 60);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('real_exam_backup');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.examId === exam.id) {
          if (window.confirm("Bạn có bài thi đang làm dở. Bạn có muốn tiếp tục không?")) {
            setTimeLeft(parsed.timeLeft);
            setAnswers(parsed.answers);
            setCurrentSectionIndex(parsed.currentSectionIndex || 0);
          } else {
            localStorage.removeItem('real_exam_backup');
          }
        }
      } catch (e) {}
    }
  }, [exam.id]);

  useEffect(() => {
    if (isFinished) {
      localStorage.removeItem('real_exam_backup');
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished]);

  useEffect(() => {
    if (!isFinished) {
      localStorage.setItem('real_exam_backup', JSON.stringify({
        examId: exam.id,
        timeLeft,
        answers,
        currentSectionIndex
      }));
    }
  }, [exam.id, timeLeft, answers, currentSectionIndex, isFinished]);

  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    if (isFinished) return;
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleFinish = () => {
    setIsFinished(true);
  };

  const handleSubmit = () => {
    // Calculate Score
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
    onComplete(correct, total);
  };

  const currentSection = exam.sections[currentSectionIndex];

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (isFinished) {
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
    const percentage = Math.round((correct / total) * 100);

    return (
      <div className="w-full h-[85vh] max-w-2xl mx-auto flex flex-col items-center bg-white rounded-2xl border-2 border-[var(--gray-path)] p-8 shadow-xl view-enter overflow-y-auto">
        <h2 className="text-3xl font-black text-[var(--text-main)] mb-2">Exam Complete!</h2>
        <div className="text-[80px] mb-4">🏆</div>
        <div className="text-2xl font-black text-[var(--blue)] mb-8">Overall Score: {correct} / {total} ({percentage}%)</div>
        
        <div className="w-full space-y-3 mb-8">
          <h3 className="text-lg font-black text-[var(--text-muted)] uppercase tracking-wider mb-4">Section Breakdown</h3>
          {exam.sections.map(sec => {
            let secCorrect = 0;
            let secTotal = 0;
            sec.questions.forEach(q => {
              secTotal++;
              if (answers[q.id] === q.correctAnswer) secCorrect++;
            });
            const secPct = secTotal > 0 ? Math.round((secCorrect / secTotal) * 100) : 0;
            return (
              <div key={sec.id} className="flex items-center justify-between p-4 bg-[var(--gray-bg)] rounded-xl border border-[var(--gray-path)]">
                <span className="font-bold text-[var(--text-main)] flex-1">{sec.title}</span>
                <span className="font-black text-[var(--text-main)] min-w-[80px] text-right">{secCorrect}/{secTotal}</span>
                <span className={`font-black min-w-[60px] text-right ${secPct >= 80 ? 'text-[var(--green)]' : secPct >= 50 ? 'text-[var(--gold)]' : 'text-[var(--red)]'}`}>
                  {secPct}%
                </span>
              </div>
            );
          })}
        </div>

        <button onClick={handleSubmit} className="btn-duo btn-green w-full h-14 mt-auto shrink-0">
          CONTINUE
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-[85vh] flex flex-col view-enter bg-[var(--bg-main)] rounded-2xl border-2 border-[var(--gray-path)] overflow-hidden shadow-xl">
      {/* Header */}
      <div className="h-16 border-b-2 border-[var(--gray-path)] bg-[var(--gray-bg)] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="text-xl font-black text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
            ✕
          </button>
          <h2 className="text-lg font-black">{exam.title}</h2>
        </div>
        <div className={`font-black text-xl tracking-wider ${timeLeft < 300 ? 'text-[var(--red)] animate-pulse' : 'text-[var(--blue)]'}`}>
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="w-48 border-r-2 border-[var(--gray-path)] bg-[var(--gray-bg)] p-4 overflow-y-auto hidden md:block">
          <h3 className="font-black text-sm uppercase tracking-widest text-[var(--text-muted)] mb-4">Sections</h3>
          <div className="space-y-2">
            {exam.sections.map((sec, idx) => {
              const isActive = idx === currentSectionIndex;
              const isCompleted = sec.questions.every(q => answers[q.id] !== undefined);
              return (
                <button
                  key={sec.id}
                  onClick={() => setCurrentSectionIndex(idx)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all border-2 ${
                    isActive ? 'bg-[var(--tint-blue)] text-[var(--blue)] border-[var(--tint-blue)]' :
                    isCompleted ? 'bg-[var(--tint-green)] text-[var(--green-shadow)] border-[var(--tint-green)]' :
                    'bg-transparent border-transparent hover:bg-[var(--gray-path)] text-[var(--text-main)]'
                  }`}
                >
                  {sec.title}
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
              {currentSection.questions.map((q, qIndex) => (
                <div key={q.id} className="p-6 rounded-[1.5rem] border-2 border-[var(--gray-path)] bg-[var(--bg-main)] shadow-sm space-y-6">
                  <div className="flex items-start gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--gray-path)] text-[var(--text-main)] font-black text-sm shrink-0">
                      {qIndex + 1}
                    </span>
                    <div className="space-y-4 w-full">
                      {q.passage && (
                        <div className="p-4 bg-[var(--gray-bg)] rounded-xl border border-[var(--gray-path)] whitespace-pre-wrap text-sm font-medium">
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
                      const isSelected = answers[q.id] === oIdx;
                      const labels = ['A', 'B', 'C', 'D'];
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectAnswer(q.id, oIdx)}
                          className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all active:scale-[0.98] ${
                            isSelected 
                              ? 'bg-[var(--tint-blue)] border-[var(--blue)] text-[var(--blue)]' 
                              : 'bg-[var(--bg-main)] border-[var(--gray-path)] hover:bg-[var(--gray-bg)] text-[var(--text-main)]'
                          }`}
                        >
                          <span className={`flex items-center justify-center w-8 h-8 rounded-lg font-black text-sm border-2 ${
                            isSelected ? 'border-[var(--blue)] bg-[var(--blue)] text-white' : 'border-[var(--gray-path)]'
                          }`}>
                            {labels[oIdx]}
                          </span>
                          <span className="font-bold text-left flex-1">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
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
                  onClick={handleFinish}
                  className="btn-duo btn-green px-8 py-3"
                >
                  FINISH EXAM
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
