import { useState, useEffect, useRef, useCallback } from 'react';
import type { AuthenticExam, Mistake, Question } from '../types';
import { ExamTimer } from './ExamTimer';
import { ExamReviewView } from './ExamReviewView';
import { Modal } from './Modal';
import { FullQuestionCard } from './FullQuestionCard';

interface RealExamViewProps {
  exam: AuthenticExam;
  onCancel: () => void;
  onComplete: (score: number, total: number) => void;
  onSaveMistake?: (mistake: Mistake) => void;
}

export function RealExamView({ exam, onCancel, onComplete, onSaveMistake }: RealExamViewProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showConfirmSubmitModal, setShowConfirmSubmitModal] = useState(false);
  const [backupLoaded, setBackupLoaded] = useState(false);
  const [initialTime, setInitialTime] = useState(exam.timeLimitMinutes * 60);

  const currentTimeLeftRef = useRef(exam.timeLimitMinutes * 60);
  const backupDataRef = useRef<{ examId: string, timeLeft: number, answers: Record<string, number>, currentSectionIndex: number, markedForReview?: Record<string, boolean> } | null>(null);
  const answersRef = useRef(answers);
  const sectionIndexRef = useRef(currentSectionIndex);
  const markedRef = useRef(markedForReview);

  // Keep refs in sync with state
  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => { sectionIndexRef.current = currentSectionIndex; }, [currentSectionIndex]);
  useEffect(() => { markedRef.current = markedForReview; }, [markedForReview]);

  const backupKey = `real_exam_backup_${exam.id}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(backupKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.examId === exam.id) {
          backupDataRef.current = parsed;
          setShowResumeModal(true);
          return;
        }
      }
    } catch { /* ignore corrupted data */ }
    setBackupLoaded(true);
  }, [exam.id, backupKey]);

  // Auto-save every 5 seconds using refs to avoid stale closure
  useEffect(() => {
    if (isFinished || !backupLoaded) return;
    const interval = setInterval(() => {
      try {
        localStorage.setItem(backupKey, JSON.stringify({
          examId: exam.id,
          timeLeft: currentTimeLeftRef.current,
          answers: answersRef.current,
          currentSectionIndex: sectionIndexRef.current,
          markedForReview: markedRef.current
        }));
      } catch { /* ignore QuotaExceededError */ }
    }, 5000);
    return () => clearInterval(interval);
  }, [exam.id, backupKey, isFinished, backupLoaded]);

  const handleTimeTick = (time: number) => {
    currentTimeLeftRef.current = time;
  };

  const handleSelectAnswer = useCallback((questionId: string, optionIndex: number) => {
    if (isFinished) return;
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  }, [isFinished]);

  const toggleMarkForReview = useCallback((questionId: string) => {
    if (isFinished) return;
    setMarkedForReview(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  }, [isFinished]);

  const handleFinish = () => {
    setIsFinished(true);
    setShowConfirmSubmitModal(false);
    try { localStorage.removeItem(backupKey); } catch { /* ignore */ }
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
    <div className="w-full h-[calc(100vh-8rem)] min-h-[500px] flex flex-col view-enter bg-bg-main rounded-2xl border-2 border-gray-path overflow-hidden shadow-xl">
      
      <Modal
        isOpen={showResumeModal}
        onClose={() => {
          // Start Fresh with confirmation
          if (window.confirm('Start fresh? This will delete your saved progress and cannot be undone.')) {
            setShowResumeModal(false);
            setBackupLoaded(true);
            try { localStorage.removeItem(backupKey); } catch { /* ignore */ }
          }
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
            setMarkedForReview(parsed.markedForReview || {});
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
        {(() => {
          const totalQ = exam.sections.reduce((a, s) => a + s.questions.length, 0);
          const answeredQ = Object.keys(answers).length;
          const unanswered = totalQ - answeredQ;
          return unanswered > 0 ? (
            <p className="text-amber-600 font-bold mt-2">
              ⚠️ You have {unanswered} unanswered question{unanswered > 1 ? 's' : ''} that will be marked wrong.
            </p>
          ) : (
            <p className="text-green-600 font-bold mt-2">✓ All questions answered.</p>
          );
        })()}
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
        <div className="w-64 shrink-0 border-r-2 border-gray-path bg-gray-bg p-4 overflow-y-auto hidden md:flex flex-col gap-8">
          <div>
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
          
          <div>
            <div className="flex items-center justify-between mb-4">
               <h3 className="font-black text-sm uppercase tracking-widest text-text-muted">Question Grid</h3>
            </div>
            <div className="grid grid-cols-5 gap-2">
               {currentSection.questions.map((q, qIndex) => {
                  const isAnswered = answers[q.id] !== undefined;
                  const isMarked = markedForReview[q.id];
                  
                  let btnClass = "bg-bg-main border-gray-path text-text-main";
                  if (isMarked) btnClass = "bg-tint-yellow border-yellow text-yellow-shadow";
                  else if (isAnswered) btnClass = "bg-tint-blue border-blue text-blue";
                  
                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                         const el = document.getElementById(`question-${q.id}`);
                         if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className={`w-full aspect-square flex items-center justify-center rounded-lg border-2 font-bold text-xs hover:opacity-80 transition-all ${btnClass}`}
                    >
                      {qIndex + 1}
                    </button>
                  );
               })}
            </div>
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
                <FullQuestionCard
                  key={q.id}
                  question={q} // @ts-ignore - force IDE refresh
                  questionIndex={qIndex}
                  userAnswer={answers[q.id]}
                  isMarked={markedForReview[q.id] || false}
                  onSelect={handleSelectAnswer}
                  onToggleMark={toggleMarkForReview}
                />
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
