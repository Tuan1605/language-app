import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Clock, AlertTriangle, RotateCcw, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { TOEIC_2024_PDF_EXAMS } from '../data/toeic2024Pdf';
import { assetUrl } from '../config/assets';
import { db } from '../data/db';
import { PdfViewer } from './PdfViewer';

type ExamMode = 'FULL' | 'PART_1' | 'PART_2' | 'PART_3' | 'PART_4' | 'PART_5' | 'PART_6' | 'PART_7';

const PART_RANGES: Record<ExamMode, [number, number]> = {
  'FULL': [1, 200],
  'PART_1': [1, 6],
  'PART_2': [7, 31],
  'PART_3': [32, 70],
  'PART_4': [71, 100],
  'PART_5': [101, 130],
  'PART_6': [131, 146],
  'PART_7': [147, 200],
};

const PART_DESCRIPTIONS: Record<ExamMode, string> = {
  'FULL': 'Full Test - Listening & Reading (200 questions)',
  'PART_1': 'Photographs - Describe the image',
  'PART_2': 'Question-Response - Choose the best response',
  'PART_3': 'Short Conversations - Answer based on conversation',
  'PART_4': 'Short Talks - Answer based on talk/announcement',
  'PART_5': 'Incomplete Sentences - Choose the best word/phrase',
  'PART_6': 'Text Completion - Fill in the blanks',
  'PART_7': 'Reading Comprehension - Read & answer questions',
};

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function PdfExamView({ examId }: { examId: string }) {
  const navigate = useNavigate();
  const exam = TOEIC_2024_PDF_EXAMS.find(e => e.id === examId);
  const testNumber = examId.split('-').pop();
  const answerListRef = useRef<HTMLDivElement>(null);

  const [activePdf, setActivePdf] = useState<'LC' | 'RC'>('LC');
  const [mode, setMode] = useState<ExamMode>('FULL');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  // Timer - only for FULL mode
  const [timeLeft, setTimeLeft] = useState(7200); // 120 minutes
  const [timerPaused, setTimerPaused] = useState(false);
  const [timerWarning, setTimerWarning] = useState(false);

  // Part breakdown for results
  const [partResults, setPartResults] = useState<Record<string, { correct: number; total: number }>>({});

  const currentQuestions = (exam?.answers ?? []).filter(ans => {
    const qNum = parseInt(ans.id);
    const [start, end] = PART_RANGES[mode];
    return qNum >= start && qNum <= end;
  });

  const handleSubmit = useCallback(() => {
    if (!exam) return;
    let correctCount = 0;
    const results: Record<string, { correct: number; total: number }> = {};

    const modesToCheck: ExamMode[] = mode === 'FULL'
      ? ['PART_1', 'PART_2', 'PART_3', 'PART_4', 'PART_5', 'PART_6', 'PART_7']
      : [mode];

    modesToCheck.forEach(m => {
      const [start, end] = PART_RANGES[m];
      const partQuestions = exam.answers.filter(ans => {
        const qNum = parseInt(ans.id);
        return qNum >= start && qNum <= end;
      });
      let partCorrect = 0;
      partQuestions.forEach(ans => {
        if (answers[ans.id] === ans.correctAnswer) {
          correctCount++;
          partCorrect++;
        }
      });
      results[m] = { correct: partCorrect, total: partQuestions.length };
    });

    setScore(correctCount);
    setPartResults(results);
    setIsSubmitted(true);
    setShowConfirm(false);

    // Save to IndexedDB
    db.examResults.add({
      id: `pdf-exam-${examId}-${Date.now()}`,
      date: new Date().toISOString(),
      score: correctCount,
      totalQuestions: currentQuestions.length,
      category: 'toeic',
      difficulty: 'intermediate',
      type: 'full-exam',
    }).then(() => {
      toast.success('Result saved!');
    }).catch(err => {
      console.error('Failed to save exam result:', err);
    });
  }, [answers, exam, examId, mode, currentQuestions.length]);

  useEffect(() => {
    if (['PART_1', 'PART_2', 'PART_3', 'PART_4'].includes(mode)) setActivePdf('LC');
    else if (['PART_5', 'PART_6', 'PART_7'].includes(mode)) setActivePdf('RC');

    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
    setShowConfirm(false);
    // Only reset timer for FULL mode
    if (mode === 'FULL') {
      setTimeLeft(7200);
      setTimerPaused(false);
      setTimerWarning(false);
    }
    setPartResults({});
  }, [mode]);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted || timerPaused) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        if (prev <= 300) setTimerWarning(true);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSubmitted, timerPaused, timeLeft, handleSubmit]);

  if (!exam) {
    return <div className="p-8 text-center">Exam not found</div>;
  }

  const handleSelectOption = (qId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optionIndex }));
  };

  const answeredCount = currentQuestions.filter(ans => answers[ans.id] !== undefined).length;
  const progressPercent = currentQuestions.length > 0 ? Math.round((answeredCount / currentQuestions.length) * 100) : 0;

  const optionLabels = ['A', 'B', 'C', 'D'];

  let currentAudioUrl = exam.audioUrl ? assetUrl(exam.audioUrl) : undefined;
  if (mode !== 'FULL' && ['PART_1', 'PART_2', 'PART_3', 'PART_4'].includes(mode)) {
    const partNum = mode.split('_')[1];
    currentAudioUrl = assetUrl(`/audio/toeic_2024/parts/PART.${partNum}.-.TEST.${testNumber}.mp3`);
  } else if (['PART_5', 'PART_6', 'PART_7'].includes(mode)) {
    currentAudioUrl = undefined;
  }

  const pdfSrc = activePdf === 'LC' ? assetUrl(exam.pdfUrl_LC || '') : assetUrl(exam.pdfUrl_RC || '');

  const isPart2 = (qId: string) => {
    const qNum = parseInt(qId);
    return (mode === 'PART_2') || (mode === 'FULL' && qNum >= 7 && qNum <= 31);
  };

  return (
    <div className="flex flex-col w-full h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm shrink-0 relative z-20">
        {/* Top row: nav + title + submit */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-base font-bold text-gray-900">{exam.title}</h1>
              <p className="text-xs text-gray-500 mt-0.5">{PART_DESCRIPTIONS[mode]}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!isSubmitted ? (
              <button
                onClick={() => setShowConfirm(true)}
                className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
              >
                Submit ({answeredCount}/{currentQuestions.length})
              </button>
            ) : (
              <>
                <div className="px-4 py-2 bg-green-50 text-green-700 text-sm font-bold rounded-xl border border-green-200">
                  {score}/{currentQuestions.length} ({Math.round((score / currentQuestions.length) * 100)}%)
                </div>
                <button
                  onClick={() => {
                    setAnswers({});
                    setIsSubmitted(false);
                    setScore(0);
                    setTimeLeft(7200);
                    setTimerPaused(false);
                    setTimerWarning(false);
                    setPartResults({});
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retry
                </button>
              </>
            )}
          </div>
        </div>

        {/* Bottom row: part selector + timer + progress */}
        <div className="flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-2 bg-gray-50 border-b border-gray-100 overflow-x-auto">
          <select
            className="min-w-0 flex-shrink-0 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-semibold text-gray-900 outline-none cursor-pointer hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            value={mode}
            onChange={(e) => setMode(e.target.value as ExamMode)}
            disabled={isSubmitted}
          >
            <option value="FULL">Full Test (200Qs)</option>
            <option value="PART_1">Part 1 - Photographs (6Qs)</option>
            <option value="PART_2">Part 2 - Question-Response (25Qs)</option>
            <option value="PART_3">Part 3 - Short Conversations (39Qs)</option>
            <option value="PART_4">Part 4 - Short Talks (30Qs)</option>
            <option value="PART_5">Part 5 - Incomplete Sentences (30Qs)</option>
            <option value="PART_6">Part 6 - Text Completion (16Qs)</option>
            <option value="PART_7">Part 7 - Reading Comprehension (54Qs)</option>
          </select>

          {!isSubmitted && mode === 'FULL' && (
            <div className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold border shrink-0 ${timerWarning ? 'bg-red-50 text-red-700 border-red-200 animate-pulse' : 'bg-white text-gray-700 border-gray-200'}`}>
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="font-mono tabular-nums">{formatTime(timeLeft)}</span>
              <button
                onClick={() => setTimerPaused(!timerPaused)}
                className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                title={timerPaused ? 'Resume' : 'Pause'}
              >
                {timerPaused ? '▶' : '⏸'}
              </button>
            </div>
          )}

          {!isSubmitted && (
            <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold text-gray-700 shrink-0">
              <span className="text-blue-600">{answeredCount}</span>
              <span className="text-gray-300">/</span>
              <span>{currentQuestions.length}</span>
              <div className="w-12 sm:w-20 h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowConfirm(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Submit Exam?</h3>
                <p className="text-xs text-gray-500">{answeredCount}/{currentQuestions.length} answered</p>
              </div>
            </div>
            {answeredCount < currentQuestions.length && (
              <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg mb-4">
                {currentQuestions.length - answeredCount} unanswered questions will be marked wrong.
              </p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-row flex-1 overflow-hidden">
        {/* Left: PDF Viewer */}
        <div className="flex w-[60%] h-full border-r border-gray-300 flex-col bg-gray-50 relative shadow-inner">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 flex bg-white rounded-full shadow p-0.5 z-10">
            <button
              onClick={() => setActivePdf('LC')}
              className={`px-3 py-0.5 rounded-full text-[10px] font-bold transition-colors ${activePdf === 'LC' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}
            >
              LC
            </button>
            <button
              onClick={() => setActivePdf('RC')}
              className={`px-3 py-0.5 rounded-full text-[10px] font-bold transition-colors ${activePdf === 'RC' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}
            >
              RC
            </button>
          </div>
          <PdfViewer url={pdfSrc} className="w-full h-full pt-8" />
        </div>

        {/* Right: Audio + Answers */}
        <div className="flex w-[40%] h-full bg-white flex-col overflow-hidden shadow-xl z-10">
          {currentAudioUrl && (
            <div className="p-3 border-b border-gray-200 bg-gray-50 shrink-0">
              <audio controls className="w-full" src={currentAudioUrl} />
            </div>
          )}

          {/* Results breakdown after submit */}
          {isSubmitted && mode === 'FULL' && (
            <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-green-50 shrink-0">
              <div className="grid grid-cols-4 gap-1.5 text-center">
                {(Object.keys(partResults) as ExamMode[]).map(m => {
                  const r = partResults[m];
                  if (!r) return null;
                  const pct = r.total > 0 ? Math.round((r.correct / r.total) * 100) : 0;
                  return (
                    <button
                      key={m}
                      onClick={() => {
                        const el = document.getElementById(`question-${PART_RANGES[m][0]}`);
                        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className="p-1.5 rounded-lg bg-white border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                    >
                      <div className="text-[9px] font-bold text-gray-500">{m.replace('_', ' ')}</div>
                      <div className={`text-sm font-black ${pct >= 70 ? 'text-green-600' : pct >= 40 ? 'text-amber-600' : 'text-red-600'}`}>
                        {r.correct}/{r.total}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div ref={answerListRef} className="flex-1 overflow-y-auto p-3 space-y-0.5">
            {currentQuestions.map((ans) => {
              const userAnswer = answers[ans.id];
              const isCorrect = userAnswer === ans.correctAnswer;
              const hideD = isPart2(ans.id);

              return (
                <div key={ans.id} id={`question-${ans.id}`} className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-gray-50 gap-1">
                  <span className="w-6 font-bold text-gray-400 text-[11px] shrink-0">{ans.id}.</span>
                  <div className="flex gap-1">
                    {optionLabels.map((lbl, optIdx) => {
                      if (hideD && optIdx === 3) return null;

                      const isSelected = userAnswer === optIdx;
                      const isActualCorrect = isSubmitted && ans.correctAnswer === optIdx;
                      const isWrongSelected = isSubmitted && isSelected && !isCorrect;

                      let bgClass = "bg-gray-100 border-gray-300 text-gray-500";

                      if (isSubmitted) {
                        if (isActualCorrect) bgClass = "bg-green-500 border-green-600 text-white";
                        else if (isWrongSelected) bgClass = "bg-red-500 border-red-500 text-white";
                        else bgClass = "bg-gray-50 border-gray-200 text-gray-300";
                      } else if (isSelected) {
                        bgClass = "bg-blue-600 border-blue-700 text-white";
                      }

                      return (
                        <button
                          key={lbl}
                          onClick={() => handleSelectOption(ans.id, optIdx)}
                          disabled={isSubmitted}
                          className={`w-8 h-8 rounded-full border text-xs font-bold transition-all ${bgClass} ${!isSubmitted && 'cursor-pointer active:scale-90 hover:border-blue-400'}`}
                        >
                          {lbl}
                        </button>
                      );
                    })}
                  </div>
                  {isSubmitted && (
                    <div className="w-5 flex justify-end shrink-0">
                      {isCorrect ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Scroll to top */}
          {isSubmitted && (
            <div className="p-2 border-t border-gray-200 bg-gray-50 shrink-0 flex justify-center">
              <button
                onClick={() => answerListRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-1 px-3 py-1 text-[10px] font-bold text-gray-400 hover:text-gray-600"
              >
                <ChevronUp className="w-3 h-3" />
                Back to top
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
