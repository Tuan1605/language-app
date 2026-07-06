import { AnimatedPage } from '../components/AnimatedPage';
import { CramModeView } from '../components/CramModeView';
import { LocalErrorBoundary } from '../components/LocalErrorBoundary';
import { useNavigate } from 'react-router-dom';

export function CramModePage() {
  const navigate = useNavigate();

  return (
    <AnimatedPage>
      <div className="w-full view-enter">
        <LocalErrorBoundary>
          <CramModeView onComplete={() => navigate('/')} />
        </LocalErrorBoundary>
      </div>
    </AnimatedPage>
  );
}
