import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, FileText } from 'lucide-react';
import { TOEIC_2024_PDF_EXAMS } from '../data/toeic2024Pdf';
import { assetUrl } from '../config/assets';

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

// PDF page ranges for each part (LC: 13 pages, RC: 29 pages)
const LC_PART_PAGES: Record<string, [number, number]> = {
  'PART_1': [1, 2],
  'PART_2': [2, 3],
  'PART_3': [4, 6],
  'PART_4': [7, 8],
};
const RC_PART_PAGES: Record<string, [number, number]> = {
  'PART_5': [1, 10],
  'PART_6': [11, 16],
  'PART_7': [17, 29],
};

export function PdfExamView({ examId }: { examId: string }) {
  const navigate = useNavigate();
  const exam = TOEIC_2024_PDF_EXAMS.find(e => e.id === examId);
  const testNumber = examId.split('-').pop();

  const [activePdf, setActivePdf] = useState<'LC' | 'RC'>('LC');
  const [mode, setMode] = useState<ExamMode>('FULL');
  const [showScript, setShowScript] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [targetPage, setTargetPage] = useState('');

  // Get page range for current mode
  const getPageRange = (): [number, number] | null => {
    if (mode === 'FULL') return null;
    return activePdf === 'LC' ? (LC_PART_PAGES[mode] || null) : (RC_PART_PAGES[mode] || null);
  };

  const pageRange = getPageRange();

  const handlePageJump = () => {
    const page = parseInt(targetPage);
    if (page > 0) {
      const iframe = document.querySelector('iframe[title="PDF Exam Viewer"]') as HTMLIFrameElement;
      if (iframe?.contentWindow) {
        // Google Docs Viewer supports postMessage for page navigation
        iframe.contentWindow.postMessage({ type: 'scrollToPage', page }, '*');
      }
    }
    setTargetPage('');
  };

  useEffect(() => {
    if (['PART_1', 'PART_2', 'PART_3', 'PART_4'].includes(mode)) setActivePdf('LC');
    else if (['PART_5', 'PART_6', 'PART_7'].includes(mode)) setActivePdf('RC');

    setAnswers({});
    setIsSubmitted(false);
    setShowScript(false);
    setScore(0);
  }, [mode]);

  if (!exam) {
    return <div className="p-8 text-center">Exam not found</div>;
  }

  const handleSelectOption = (qId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optionIndex }));
  };

  const currentQuestions = exam.answers.filter(ans => {
    const qNum = parseInt(ans.id);
    const [start, end] = PART_RANGES[mode];
    return qNum >= start && qNum <= end;
  });

  const handleSubmit = () => {
    if (window.confirm('Are you sure you want to submit your exam?')) {
      let correctCount = 0;
      currentQuestions.forEach(ans => {
        if (answers[ans.id] === ans.correctAnswer) {
          correctCount++;
        }
      });
      setScore(correctCount);
      setIsSubmitted(true);
    }
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  let currentAudioUrl = exam.audioUrl ? assetUrl(exam.audioUrl) : undefined;
  if (mode !== 'FULL' && ['PART_1', 'PART_2', 'PART_3', 'PART_4'].includes(mode)) {
    const partNum = mode.split('_')[1];
    currentAudioUrl = assetUrl(`/audio/toeic_2024/parts/PART.${partNum}.-.TEST.${testNumber}.mp3`);
  } else if (['PART_5', 'PART_6', 'PART_7'].includes(mode)) {
    currentAudioUrl = undefined;
  }

  let pdfSrc = activePdf === 'LC' ? assetUrl(exam.pdfUrl_LC || '') : assetUrl(exam.pdfUrl_RC || '');
  if (showScript) {
    pdfSrc = activePdf === 'LC' ? assetUrl(exam.scriptUrl_LC || '') : assetUrl(exam.scriptUrl_RC || '');
  }

  return (
    <div className="flex flex-col w-full h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-2 lg:p-3 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xs lg:text-base font-bold truncate">{exam.title}</h1>
          <select
            className="hidden sm:block ml-2 p-1 border border-gray-300 rounded-lg text-xs font-semibold bg-gray-50 outline-none"
            value={mode}
            onChange={(e) => setMode(e.target.value as ExamMode)}
            disabled={isSubmitted}
          >
            <option value="FULL">Full (200Qs)</option>
            <option value="PART_1">Part 1 (6Qs)</option>
            <option value="PART_2">Part 2 (25Qs)</option>
            <option value="PART_3">Part 3 (39Qs)</option>
            <option value="PART_4">Part 4 (30Qs)</option>
            <option value="PART_5">Part 5 (30Qs)</option>
            <option value="PART_6">Part 6 (16Qs)</option>
            <option value="PART_7">Part 7 (54Qs)</option>
          </select>
          {pageRange && (
            <span className="hidden sm:inline ml-2 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full border border-blue-200">
              PDF: {pageRange[0]}-{pageRange[1]}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {pageRange && (
            <div className="hidden sm:flex items-center gap-1">
              <input
                type="number"
                min={1}
                max={activePdf === 'LC' ? 13 : 29}
                value={targetPage}
                onChange={(e) => setTargetPage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePageJump()}
                placeholder="Pg"
                className="w-10 p-1 text-[10px] border border-gray-300 rounded text-center outline-none focus:border-blue-400"
              />
              <button onClick={handlePageJump} className="px-1.5 py-1 text-[10px] font-bold bg-gray-100 rounded hover:bg-gray-200">
                Go
              </button>
            </div>
          )}
          {isSubmitted && (
            <button
              onClick={() => setShowScript(!showScript)}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border ${showScript ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white text-gray-600 border-gray-300'}`}
            >
              <FileText className="w-4 h-4" />
              {showScript ? 'Hide' : 'Script'}
            </button>
          )}
          {!isSubmitted ? (
            <button onClick={handleSubmit} className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg">
              Submit
            </button>
          ) : (
            <div className="px-4 py-1.5 bg-green-100 text-green-800 text-xs font-bold rounded-lg">
              {score}/{currentQuestions.length}
            </div>
          )}
        </div>
      </div>

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
          {/* Page range hint */}
          {pageRange && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white text-[10px] font-bold px-3 py-1 rounded-full z-10">
              Xem trang {pageRange[0]}-{pageRange[1]}
            </div>
          )}
          <iframe
            src={pdfSrc}
            className="w-full h-full border-none"
            title="PDF Exam Viewer"
          />
        </div>

        {/* Right: Audio + Answers */}
        <div className="flex w-[40%] h-full bg-white flex-col overflow-hidden shadow-xl z-10">
          {currentAudioUrl && (
            <div className="p-3 border-b border-gray-200 bg-gray-50 shrink-0">
              <audio controls className="w-full" src={currentAudioUrl} />
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {currentQuestions.map((ans) => {
              const userAnswer = answers[ans.id];
              const isCorrect = userAnswer === ans.correctAnswer;

              return (
                <div key={ans.id} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-gray-50">
                  <span className="w-7 font-bold text-gray-400 text-xs">{ans.id}.</span>
                  <div className="flex gap-1.5">
                    {optionLabels.map((lbl, optIdx) => {
                      const isSelected = userAnswer === optIdx;
                      const isActualCorrect = isSubmitted && ans.correctAnswer === optIdx;
                      const isWrongSelected = isSubmitted && isSelected && !isCorrect;

                      if (mode === 'PART_2' && optIdx === 3 || (mode === 'FULL' && parseInt(ans.id) >= 7 && parseInt(ans.id) <= 31 && optIdx === 3)) {
                        return null;
                      }

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
                          className={`w-7 h-7 rounded-full border text-xs font-bold transition-all ${bgClass} ${!isSubmitted && 'cursor-pointer active:scale-90'}`}
                        >
                          {lbl}
                        </button>
                      );
                    })}
                  </div>
                  {isSubmitted && (
                    <div className="w-5 flex justify-end">
                      {isCorrect ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
