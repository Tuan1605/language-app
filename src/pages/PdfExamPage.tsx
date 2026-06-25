import { useParams } from 'react-router-dom';
import { AnimatedPage } from '../components/AnimatedPage';
import { PdfExamView } from '../components/PdfExamView';
import { LocalErrorBoundary } from '../components/LocalErrorBoundary';

export function PdfExamPage() {
  const { examId } = useParams();

  if (!examId) {
    return <div>No Exam ID provided</div>;
  }

  return (
    <LocalErrorBoundary>
      <AnimatedPage>
        <div className="w-full h-screen view-enter">
          <PdfExamView examId={examId} />
        </div>
      </AnimatedPage>
    </LocalErrorBoundary>
  );
}
