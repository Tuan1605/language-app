import { AnimatedPage } from '../components/AnimatedPage';
import { useUserStore } from '../stores/useUserStore';
import { useAppStore } from '../stores/useAppStore';
import { db } from '../data/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useAppActions } from '../hooks/useAppActions';
import { VocabQuizView } from '../components/VocabQuizView';
import { GrammarQuizView } from '../components/GrammarQuizView';
import { QuizView } from '../components/QuizView';
import { ListeningView } from '../components/ListeningView';
import { SpeakingView } from '../components/SpeakingView';
import { DictationView } from '../components/DictationView';
import { WritingView } from '../components/WritingView';
import { SessionEndOverlay } from '../components/SessionEndOverlay';
import { LocalErrorBoundary } from '../components/LocalErrorBoundary';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { Flashcard, GrammarQuizTaskData, Question, ListeningLesson, SpeakingLesson, DictationLesson, WritingLesson } from '../types';
import { useNavigate } from 'react-router-dom';

export function SessionPage() {
  const sessionTasks = useAppStore(s => s.sessionTasks);
  const currentTaskIndex = useAppStore(s => s.currentTaskIndex);
  const isSessionFinished = useAppStore(s => s.isSessionFinished);
  const activeTrack = useUserStore(s => s.activeTrack);
  const cards = useLiveQuery(async () => await db.cards.toArray());
  
  const { 
    nextTask, finalizeSession, trackCategory, handleSessionQuizComplete
  } = useAppActions();
  const navigate = useNavigate();

  if (cards === undefined) return <LoadingSpinner />;

  if (sessionTasks.length === 0) {
    return (
      <div className="w-full text-center space-y-8 pop-in pt-10">
        <h2 className="text-2xl font-black">No active session</h2>
        <button onClick={() => navigate('/')} className="btn-3d btn-blue px-6 py-3">Return Home</button>
      </div>
    );
  }

  const currentTask = sessionTasks[currentTaskIndex];
  const progress = ((currentTaskIndex) / sessionTasks.length) * 100;

  return (
    <AnimatedPage>
      <div className="w-full view-enter">
        {/* Session Progress Bar */}
        <div className="w-full mb-8">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => navigate('/')} className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--gray-bg)] transition-colors active:scale-95">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="flex-1 mx-4">
              <div className="h-3 w-full bg-[var(--gray-path)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[var(--green)] transition-all duration-500 ease-out" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {!isSessionFinished ? (
          <div key={currentTaskIndex} className="w-full flex flex-col items-center view-enter">
            <LocalErrorBoundary key={currentTask.type} onReset={() => nextTask()}>
              {currentTask.type === 'vocab-quiz' && <VocabQuizView word={currentTask.data as Flashcard} allCards={cards} onComplete={nextTask} />}
              {currentTask.type === 'grammar' && <GrammarQuizView task={currentTask.data as GrammarQuizTaskData} onComplete={nextTask} onCancel={finalizeSession} />}
              {currentTask.type === 'quiz' && <QuizView questions={[currentTask.data as Question]} category={trackCategory(activeTrack)} onComplete={handleSessionQuizComplete} onCancel={() => navigate('/')} hideSummary={true} onSaveMistake={(m) => db.mistakes.add(m)} />}
              {currentTask.type === 'listening' && <ListeningView lesson={currentTask.data as ListeningLesson} onBack={nextTask} hideBackButton={true} />}
              {currentTask.type === 'speaking' && <SpeakingView lesson={currentTask.data as SpeakingLesson} onComplete={nextTask} />}
              {currentTask.type === 'dictation' && <DictationView lesson={currentTask.data as DictationLesson} onComplete={nextTask} />}
              {currentTask.type === 'writing' && <WritingView lesson={currentTask.data as WritingLesson} onComplete={nextTask} onCancel={nextTask} onSaveMistake={(m) => db.mistakes.add(m)} />}
            </LocalErrorBoundary>
          </div>
        ) : (
          <SessionEndOverlay 
            type="lesson"
            title="Lesson Complete!"
            xpEarned={10}
            onContinue={finalizeSession}
          />
        )}
      </div>
    </AnimatedPage>
  );
}
