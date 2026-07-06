import { AnimatedPage } from '../components/AnimatedPage';
import { QuickReviewView } from '../components/QuickReviewView';
import { LocalErrorBoundary } from '../components/LocalErrorBoundary';
import { useNavigate } from 'react-router-dom';

export function QuickReviewPage() {
  const navigate = useNavigate();

  return (
    <AnimatedPage>
      <div className="w-full view-enter">
        <LocalErrorBoundary>
          <QuickReviewView onComplete={() => navigate('/')} />
        </LocalErrorBoundary>
      </div>
    </AnimatedPage>
  );
}
