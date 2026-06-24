import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { MainLayout } from './components/MainLayout';
import { PathPage } from './pages/PathPage';
import { useAppStore } from './stores/useAppStore';
import { useUserStore } from './stores/useUserStore';
import { initializeDatabase } from './data/contentLoader';

const PracticePage = lazy(() => import('./pages/PracticePage').then(m => ({ default: m.PracticePage })));
const SessionPage = lazy(() => import('./pages/SessionPage').then(m => ({ default: m.SessionPage })));
const NotebookPage = lazy(() => import('./pages/NotebookPage').then(m => ({ default: m.NotebookPage })));
const ReviewPage = lazy(() => import('./pages/ReviewPage').then(m => ({ default: m.ReviewPage })));
const CollectionPage = lazy(() => import('./pages/CollectionPage').then(m => ({ default: m.CollectionPage })));
const MistakesPage = lazy(() => import('./pages/MistakesPage').then(m => ({ default: m.MistakesPage })));
const MistakeReviewPage = lazy(() => import('./pages/MistakeReviewPage').then(m => ({ default: m.MistakeReviewPage })));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const AddWordsPage = lazy(() => import('./pages/AddWordsPage').then(m => ({ default: m.AddWordsPage })));
const RealExamPage = lazy(() => import('./pages/RealExamPage').then(m => ({ default: m.RealExamPage })));
const CreateExamPage = lazy(() => import('./pages/CreateExamPage').then(m => ({ default: m.CreateExamPage })));
const ReviewDashboardPage = lazy(() => import('./pages/ReviewDashboardPage').then(m => ({ default: m.ReviewDashboardPage })));

function PageLoader() {
  return (
    <div className="w-full flex items-center justify-center py-20">
      <div className="w-8 h-8 border-3 border-[var(--blue)] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

function App() {
  const isLoadingData = useAppStore(s => s.isLoadingData);
  const setIsLoadingData = useAppStore(s => s.setIsLoadingData);
  const setMockData = useAppStore(s => s.setMockData);
  const initializeDOM = useUserStore(s => s.initializeDOM);

  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    initializeDOM(); // apply theme and track immediately
    
    async function init() {
      try {
        await initializeDatabase();
        // optionally load mock data
        import('./utils/mockData').then(({ MOCK_LISTENING_LESSONS, MOCK_SPEAKING_LESSONS, MOCK_DICTATION_LESSONS, MOCK_FULL_EXAMS }) => {
          if (!mounted) return;
          setMockData({
            mockListeningLessons: MOCK_LISTENING_LESSONS,
            mockSpeakingLessons: MOCK_SPEAKING_LESSONS,
            mockDictationLessons: MOCK_DICTATION_LESSONS,
            mockFullExams: MOCK_FULL_EXAMS
          });
        });
        
      } catch(err) {
        console.error(err);
      } finally {
        if(mounted) setIsLoadingData(false);
      }
    }
    init();
    return () => { mounted = false; };
  }, [setIsLoadingData, initializeDOM, setMockData]);

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--blue)] border-t-transparent rounded-full animate-spin"></div>
          <p className="font-bold text-[var(--text-muted)] animate-pulse">Loading language data...</p>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<PathPage />} />
          <Route path="/practice" element={<Suspense fallback={<PageLoader />}><PracticePage /></Suspense>} />
          <Route path="/notebook" element={<Suspense fallback={<PageLoader />}><NotebookPage /></Suspense>} />
          <Route path="/review" element={<Suspense fallback={<PageLoader />}><ReviewPage /></Suspense>} />
          <Route path="/collection" element={<Suspense fallback={<PageLoader />}><CollectionPage /></Suspense>} />
          <Route path="/mistakes" element={<Suspense fallback={<PageLoader />}><MistakesPage /></Suspense>} />
          <Route path="/review-mistakes" element={<Suspense fallback={<PageLoader />}><MistakeReviewPage /></Suspense>} />
          <Route path="/analytics" element={<Suspense fallback={<PageLoader />}><AnalyticsPage /></Suspense>} />
          <Route path="/add" element={<Suspense fallback={<PageLoader />}><AddWordsPage /></Suspense>} />
          <Route path="/session" element={<Suspense fallback={<PageLoader />}><SessionPage /></Suspense>} />
          <Route path="/real-exam" element={<Suspense fallback={<PageLoader />}><RealExamPage /></Suspense>} />
          <Route path="/create-exam" element={<Suspense fallback={<PageLoader />}><CreateExamPage /></Suspense>} />
          <Route path="/review-dashboard" element={<Suspense fallback={<PageLoader />}><ReviewDashboardPage /></Suspense>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;
