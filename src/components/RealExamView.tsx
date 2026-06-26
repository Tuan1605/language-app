import { useState, useEffect, useRef } from 'react';
import type { AuthenticExam, Mistake, Question } from '../types';
import { ExamTimer } from './ExamTimer';
import { ExamReviewView } from './ExamReviewView';
import { Modal } from './Modal';

interface RealExamViewProps {
  exam: AuthenticExam;
  onCancel: () => void;
  onComplete: (score: number, total: number) => void;
  onSaveMistake?: (mistake: Mistake) => void;
}

export function RealExamView({ exam, onCancel, onComplete, onSaveMistake }: RealExamViewProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showConfirmSubmitModal, setShowConfirmSubmitModal] = useState(false);
  const [backupLoaded, setBackupLoaded] = useState(false);
  const [initialTime, setInitialTime] = useState(exam.timeLimitMinutes * 60);

  const currentTimeLeftRef = useRef(exam.timeLimitMinutes * 60);
  const backupDataRef = useRef<{ examId: string, timeLeft: number, answers: Record<string, number>, currentSectionIndex: number } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('real_exam_backup');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.examId === exam.id) {
          backupDataRef.current = parsed;
          setShowResumeModal(true);
          return;
        }
      } catch { /* ignore */ }
    }
    setBackupLoaded(true);
  }, [exam.id]);

  useEffect(() => {
    if (!isFinished && backupLoaded) {
      const saveState = () => {
        localStorage.setItem('real_exam_backup', JSON.stringify({
          examId: exam.id,
          timeLeft: currentTimeLeftRef.current,
          answers,
          currentSectionIndex
        }));
      };
      // Save immediately on changes
      saveState();
      // Also save every 5 seconds to persist time
      const interval = setInterval(saveState, 5000);
      return () => clearInterval(interval);
    }
  }, [exam.id, answers, currentSectionIndex, isFinished, backupLoaded]);

  const handleTimeTick = (time: number) => {
    currentTimeLeftRef.current = time;
  };

  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    if (isFinished) return;
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleFinish = () => {
    setIsFinished(true);
    setShowConfirmSubmitModal(false);
    localStorage.removeItem('real_exam_backup');
  };

  const handleCloseReview = () => {
    let correct = 0;
    let total = 0;
    exam.sections.forEach(sec => {
      sec.questions.forEach(q => {
        total++;
        if (answers[q.id] === q.correctAnswer) {
          correct++;
        } else if (onSaveMistake) {
          onSaveMistake({
            id: `mistake-${q.id}-${Date.now()}`,
            type: 'question',
            data: q as Question,
            wrongAnswer: answers[q.id] !== undefined ? q.options[answers[q.id]] : 'Skipped',
            timestamp: new Date().toISOString()
          });
        }
      });
    });
    onComplete(correct, total);
  };

  const currentSection = exam.sections[currentSectionIndex];

  if (isFinished) {
    return <ExamReviewView exam={exam} answers={answers} onClose={handleCloseReview} />;
  }

  return (
    <div className="w-full h-[85vh] flex flex-col view-enter bg-bg-main rounded-2xl border-2 border-gray-path overflow-hidden shadow-xl">
      
      <Modal 
        isOpen={showResumeModal} 
        onClose={() => {
          // Decline resume
          setShowResumeModal(false);
          setBackupLoaded(true);
          localStorage.removeItem('real_exam_backup');
        }}
        title="Resume Previous Attempt?"
        confirmText="Yes, Resume"
        cancelText="Start Fresh"
        onConfirm={() => {
          // Accept resume
          const parsed = backupDataRef.current;
          if (parsed) {
            setInitialTime(parsed.timeLeft);
            currentTimeLeftRef.current = parsed.timeLeft;
            setAnswers(parsed.answers || {});
            setCurrentSectionIndex(parsed.currentSectionIndex || 0);
          }
          setShowResumeModal(false);
          setBackupLoaded(true);
        }}
      >
        <p>You have an incomplete attempt for this exam saved on your device.</p>
        <p>Would you like to resume where you left off, or start a new attempt?</p>
      </Modal>

      <Modal
        isOpen={showConfirmSubmitModal}
        onClose={() => setShowConfirmSubmitModal(false)}
        title="Submit Exam"
        confirmText="Submit Now"
        onConfirm={handleFinish}
      >
        <p>Are you sure you want to submit your exam now?</p>
        <p>You cannot change your answers after submission.</p>
      </Modal>

      {/* Header */}
      <div className="h-16 border-b-2 border-gray-path bg-gray-bg flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="text-xl font-black text-text-muted hover:text-text-main transition-colors">
            ✕
          </button>
          <h2 className="text-lg font-black">{exam.title}</h2>
        </div>
        {backupLoaded && (
          <ExamTimer 
            key={initialTime} 
            initialTime={initialTime} 
            onTimeTick={handleTimeTick} 
            onTimeUp={handleFinish} 
            isFinished={isFinished} 
          />
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="w-48 border-r-2 border-gray-path bg-gray-bg p-4 overflow-y-auto hidden md:block">
          <h3 className="font-black text-sm uppercase tracking-widest text-text-muted mb-4">Sections</h3>
          <div className="space-y-2">
            {exam.sections.map((sec, idx) => {
              const isActive = idx === currentSectionIndex;
              const isCompleted = sec.questions.every(q => answers[q.id] !== undefined);
              return (
                <button
                  key={sec.id}
                  onClick={() => setCurrentSectionIndex(idx)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all border-2 ${
                    isActive ? 'bg-tint-blue text-blue border-tint-blue' :
                    isCompleted ? 'bg-tint-green text-green-shadow border-tint-green' :
                    'bg-transparent border-transparent hover:bg-gray-path text-text-main'
                  }`}
                >
                  {sec.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth bg-bg-main">
          <div className="max-w-2xl mx-auto space-y-8 pb-32">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-text-main">{currentSection.title}</h2>
              {currentSection.description && (
                <p className="text-sm font-bold text-text-muted">{currentSection.description}</p>
              )}
            </div>

            <div className="space-y-10">
              {currentSection.questions.map((q, qIndex) => (
                <div key={q.id} className="p-6 rounded-[1.5rem] border-2 border-gray-path bg-bg-main shadow-sm space-y-6">
                  <div className="flex items-start gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-path text-text-main font-black text-sm shrink-0">
                      {qIndex + 1}
                    </span>
                    <div className="space-y-4 w-full">
                      {q.passage && (
                        <div className="p-4 bg-gray-bg rounded-xl border border-gray-path whitespace-pre-wrap text-sm font-medium">
                          {q.passage}
                        </div>
                      )}
                      {q.imageUrl && (
                        <img src={q.imageUrl} alt="Question figure" className="max-w-full h-auto rounded-xl border-2 border-gray-path" />
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
                              ? 'bg-tint-blue border-blue text-blue' 
                              : 'bg-bg-main border-gray-path hover:bg-gray-bg text-text-main'
                          }`}
                        >
                          <span className={`flex items-center justify-center w-8 h-8 rounded-lg font-black text-sm border-2 ${
                            isSelected ? 'border-blue bg-blue text-white' : 'border-gray-path'
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
            <div className="flex items-center justify-between pt-8 border-t-2 border-gray-path mt-8">
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
                  onClick={() => setShowConfirmSubmitModal(true)}
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
