import { AnimatedPage } from '../components/AnimatedPage';
import { CreateExamView } from '../components/CreateExamView';
import { LocalErrorBoundary } from '../components/LocalErrorBoundary';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { db } from '../data/db';
import { useAppStore } from '../stores/useAppStore';
import { useLiveQuery } from 'dexie-react-hooks';
import type { FullExam } from '../types';

export function CreateExamPage() {
  const navigate = useNavigate();
  const questions = useLiveQuery(async () => await db.questions.toArray());
  const mockListeningLessons = useAppStore(s => s.mockListeningLessons);
  const mockSpeakingLessons = useAppStore(s => s.mockSpeakingLessons);
  const mockDictationLessons = useAppStore(s => s.mockDictationLessons);

  const handleSaveCustomExam = async (exam: FullExam) => {
    await db.customExams.add(exam);
    navigate('/practice');
  };

  if (questions === undefined) return <LoadingSpinner />;

  return (
    <LocalErrorBoundary>
      <AnimatedPage>
        <div className="w-full view-enter">
        <CreateExamView
          onSave={handleSaveCustomExam}
          onCancel={() => navigate('/practice')}
          allQuestions={questions}
          allListening={mockListeningLessons}
          allSpeaking={mockSpeakingLessons}
          allDictation={mockDictationLessons}
        />
        </div>
      </AnimatedPage>
    </LocalErrorBoundary>
  );
}
