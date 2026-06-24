import { AnimatedPage } from '../components/AnimatedPage';
import { RealExamView } from '../components/RealExamView';
import { LocalErrorBoundary } from '../components/LocalErrorBoundary';
import { useNavigate } from 'react-router-dom';
import { db } from '../data/db';
import { useAppStore } from '../stores/useAppStore';
import { AUTHENTIC_EXAMS } from '../data/authenticExams';
import { useEffect, useState } from 'react';

export function RealExamPage() {
  const currentAuthenticExam = useAppStore(s => s.currentAuthenticExam);
  const setCurrentAuthenticExam = useAppStore(s => s.setCurrentAuthenticExam);
  const navigate = useNavigate();
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    if (!currentAuthenticExam) {
      const saved = localStorage.getItem('real_exam_backup');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const found = AUTHENTIC_EXAMS.find(e => e.id === parsed.examId);
          if (found) {
            setCurrentAuthenticExam(found);
          }
        } catch { /* ignore */ }
      }
    }
    setIsRestoring(false);
  }, [currentAuthenticExam, setCurrentAuthenticExam]);

  const handleComplete = () => {
    navigate('/');
  };

  if (isRestoring) {
    return <div className="w-full text-center pt-10 text-[var(--text-muted)] font-bold">Restoring exam session...</div>;
  }

  if (!currentAuthenticExam) {
    return (
      <div className="w-full text-center space-y-8 pop-in pt-10">
        <h2 className="text-2xl font-black">No active exam</h2>
        <button onClick={() => navigate('/')} className="btn-3d btn-blue px-6 py-3">Return Home</button>
      </div>
    );
  }

  return (
    <LocalErrorBoundary>
      <AnimatedPage>
        <div className="w-full view-enter">
        <RealExamView 
          exam={currentAuthenticExam} 
          onComplete={handleComplete} 
          onCancel={() => navigate('/')} 
          onSaveMistake={async (m) => { await db.mistakes.add(m); }} 
        />
        </div>
      </AnimatedPage>
    </LocalErrorBoundary>
  );
}
