import { ReviewDashboard } from '../components/ReviewDashboard';
import { LocalErrorBoundary } from '../components/LocalErrorBoundary';

export function ReviewDashboardPage() {
  return (
    <LocalErrorBoundary>
      <div className="w-full view-enter">
        <ReviewDashboard />
      </div>
    </LocalErrorBoundary>
  );
}
