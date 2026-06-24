import { useState, useMemo } from 'react';
import type { Mistake, SessionTask, Question, SpeakingLesson, DictationLesson, WritingLesson, ExamResult } from '../types';
import { QuizView } from './QuizView';
import { SpeakingView } from './SpeakingView';
import { DictationView } from './DictationView';
import { WritingView } from './WritingView';

interface MistakeReviewViewProps {
  mistakes: Mistake[];
  onComplete: () => void;
  onCancel: () => void;
  onRemoveMistake: (id: string) => void;
}

export function MistakeReviewView({ mistakes, onComplete, onCancel, onRemoveMistake }: MistakeReviewViewProps) {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  // Convert mistakes to tasks and shuffle them
  const tasks = useMemo(() => {
    const list: { mistakeId: string, task: SessionTask }[] = [];
    mistakes.forEach(m => {
      if (m.type === 'question') list.push({ mistakeId: m.id, task: { type: 'quiz', data: m.data as Question }});
      if (m.type === 'speaking') list.push({ mistakeId: m.id, task: { type: 'speaking', data: m.data as SpeakingLesson }});
      if (m.type === 'dictation') list.push({ mistakeId: m.id, task: { type: 'dictation', data: m.data as DictationLesson }});
      if (m.type === 'writing') list.push({ mistakeId: m.id, task: { type: 'writing', data: m.data as WritingLesson }});
    });
    // Shuffle
    return list.sort(() => Math.random() - 0.5);
  }, [mistakes]);

  if (tasks.length === 0) {
    return (
      <div className="bg-[var(--bg-card)] lingo-card p-10 max-w-2xl mx-auto w-full text-center">
        <h2 className="text-2xl font-black mb-4">No Mistakes to Review!</h2>
        <button onClick={onCancel} className="btn-duo btn-blue px-8 py-3">Go Back</button>
      </div>
    );
  }

  const handleTaskComplete = (resultOrScore?: number | boolean | ExamResult) => {
    let score: number;
    if (resultOrScore === undefined || resultOrScore === null) {
      score = 100;
    } else if (typeof resultOrScore === 'boolean') {
      score = resultOrScore ? 100 : 0;
    } else if (typeof resultOrScore === 'number') {
      score = resultOrScore;
    } else {
      score = (resultOrScore.score / resultOrScore.totalQuestions) * 100;
    }
    const currentMistakeId = tasks[currentTaskIndex].mistakeId;
    
    // If score is perfect or high enough, remove the mistake from the book!
    // We consider > 80% as mastered for speaking/dictation/writing
    if (score >= 80) {
      onRemoveMistake(currentMistakeId);
    }

    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const currentItem = tasks[currentTaskIndex];
  const progressPercent = Math.round((currentTaskIndex / tasks.length) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onCancel} className="text-[var(--text-muted)] font-black hover:text-[var(--red)] transition-colors">
          ✕ CANCEL
        </button>
        <div className="flex-1 bg-[var(--bg-hover)] h-4 rounded-full overflow-hidden border-2 border-[var(--border-main)]">
          <div 
            className="h-full bg-[var(--green)] transition-all duration-300" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-[var(--text-muted)] font-black text-sm">{currentTaskIndex + 1}/{tasks.length}</span>
      </div>

      <div className="bg-[var(--tint-gold)] text-[var(--gold-shadow)] font-black uppercase text-xs text-center py-2 rounded-xl mb-4 animate-pulse">
        Reviewing Mistakes Mode
      </div>

      {currentItem.task.type === 'quiz' && (
        <QuizView 
          questions={[currentItem.task.data as Question]} 
          category={(currentItem.task.data as Question).category} 
          onComplete={handleTaskComplete} 
          onCancel={onCancel} 
          hideSummary={true} 
        />
      )}
      
      {currentItem.task.type === 'speaking' && (
        <SpeakingView 
          lesson={currentItem.task.data as SpeakingLesson} 
          onComplete={handleTaskComplete} 
        />
      )}
      
      {currentItem.task.type === 'dictation' && (
        <DictationView 
          lesson={currentItem.task.data as DictationLesson} 
          onComplete={handleTaskComplete} 
        />
      )}

      {currentItem.task.type === 'writing' && (
        <WritingView 
          lesson={currentItem.task.data as WritingLesson} 
          onComplete={handleTaskComplete} 
          onCancel={onCancel} 
        />
      )}
    </div>
  );
}
