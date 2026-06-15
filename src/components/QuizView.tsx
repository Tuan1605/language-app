import { useState } from 'react';
import type { Question, ExamResult } from '../types';

interface QuizViewProps {
  questions: Question[];
  category: 'toeic' | 'n2';
  onComplete: (result: ExamResult) => void;
  onCancel: () => void;
}

export function QuizView({ questions, category, onComplete, onCancel }: QuizViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [isFinished, setIsFinished] = useState(false);

  const handleSelect = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const calculateScore = () => {
    let score = 0;
    selectedAnswers.forEach((ans, idx) => {
      if (ans === questions[idx].correctAnswer) {
        score++;
      }
    });
    return score;
  };

  if (isFinished) {
    const finalScore = calculateScore();
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
        <h2 className="text-3xl font-bold text-indigo-600 mb-4">Kết quả bài thi</h2>
        <div className="text-6xl font-black text-gray-800 mb-4">{finalScore} / {questions.length}</div>
        <p className="text-gray-500 mb-8">
          {finalScore / questions.length >= 0.8 ? 'Tuyệt vời! Bạn đang tiến gần tới mục tiêu.' : 'Cố gắng lên! Luyện tập thêm nhé.'}
        </p>
        <button
          onClick={() => onComplete({
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            score: finalScore,
            totalQuestions: questions.length,
            category
          })}
          className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition"
        >
          Lưu kết quả & Quay lại
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full">
      <div className="flex justify-between items-center mb-6 text-sm font-bold text-gray-400 uppercase tracking-widest">
        <span>{category.toUpperCase()} Mock Exam</span>
        <span>Câu {currentIndex + 1} / {questions.length}</span>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 leading-relaxed">
          {currentQuestion.text}
        </h3>
      </div>

      <div className="space-y-3 mb-8">
        {currentQuestion.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            className={`w-full text-left p-4 rounded-xl border-2 transition ${
              selectedAnswers[currentIndex] === idx
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-100 hover:border-gray-200 text-gray-600'
            }`}
          >
            <span className="inline-block w-8 font-bold">{String.fromCharCode(65 + idx)}.</span>
            {option}
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onCancel}
          className="text-gray-400 font-medium hover:text-gray-600"
        >
          Hủy bỏ
        </button>
        <button
          disabled={selectedAnswers[currentIndex] === null}
          onClick={handleNext}
          className={`px-8 py-3 rounded-xl font-bold text-white transition ${
            selectedAnswers[currentIndex] !== null
              ? 'bg-indigo-600 hover:bg-indigo-700'
              : 'bg-gray-200 cursor-not-allowed'
          }`}
        >
          {currentIndex === questions.length - 1 ? 'Hoàn thành' : 'Tiếp theo'}
        </button>
      </div>
    </div>
  );
}
