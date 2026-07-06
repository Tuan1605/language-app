import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';
import { useAppStore } from '../stores/useAppStore';
import { db } from '../data/db';
import { generateGrammarOptions } from '../utils/grammarOptions';
import { trackCategory, sampleAcrossDifficulties } from '../utils/sessionHelpers';
import { validateImportSchema } from '../utils/sanitize';
import { GRAMMAR_SAMPLE_SIZE, DRILL_SAMPLE_SIZE } from '../utils/constants';
import type { SessionTask, FullExam, AuthenticExam, ExamResult, Flashcard, Mistake } from '../types';
import toast from 'react-hot-toast';

export { trackCategory } from '../utils/sessionHelpers';

export function useAppActions() {
  const navigate = useNavigate();


  const startDrill = async (type: SessionTask['type'] | 'review') => {
    const appState = useAppStore.getState();
    const activeTrack = useUserStore.getState().activeTrack;

    if (type === 'review') {
      appState.setCurrentReviewIndex(0);
      navigate('/review');
      return;
    }
    const cat = trackCategory(activeTrack);

    if (type === 'grammar') {
      const grammarPool = await db.grammar.where('track').equals(cat).toArray();
      if (grammarPool.length === 0) {
        toast.error("No grammar content available.");
        return;
      }
      const sampled = sampleAcrossDifficulties(grammarPool, GRAMMAR_SAMPLE_SIZE);
      const newTasks: SessionTask[] = sampled.map(point => {
        // Generate fill-in-the-blank options based on grammar pattern
        const { correctAnswer, distractors } = generateGrammarOptions(point);
        const options = [correctAnswer, ...distractors];
        // Shuffle options
        for (let i = options.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [options[i], options[j]] = [options[j], options[i]];
        }
        const correctIndex = options.indexOf(correctAnswer);
        return { type: 'grammar', data: { id: `grammar-${point.id}`, point, options, correctIndex } };
      });
      appState.setSessionTasks(newTasks);
      appState.setCurrentTaskIndex(0);
      appState.setIsSessionFinished(false);
      navigate('/session');
      return;
    }

    const filtered = (type === 'vocab-quiz') ? await db.cards.where('language').equals(activeTrack).toArray() :
      (type === 'quiz') ? await db.questions.where('category').equals(cat).toArray() :
        (type === 'listening') ? appState.mockListeningLessons.filter(l => l.category === cat) :
          (type === 'speaking') ? appState.mockSpeakingLessons.filter(s => s.category === cat) :
            (type === 'writing') ? appState.mockWritingLessons.filter(w => w.category === cat) :
              appState.mockDictationLessons.filter(d => d.category === cat);
    const sampled = sampleAcrossDifficulties(filtered as (typeof filtered[number] & { difficulty: string })[], DRILL_SAMPLE_SIZE);
    const newTasks: SessionTask[] = sampled.map(item => ({ type, data: item }) as SessionTask);

    if (newTasks.length === 0) {
      toast.error("No content available for this practice yet.");
      return;
    }

    appState.setSessionTasks(newTasks);
    appState.setCurrentTaskIndex(0);
    appState.setIsSessionFinished(false);
    navigate('/session');
  };

  const startFullExam = (exam: FullExam) => {
    const appState = useAppStore.getState();
    appState.setSessionTasks(exam.tasks);
    appState.setCurrentTaskIndex(0);
    appState.setIsSessionFinished(false);
    navigate('/session');
  };

  const startAuthenticExam = (exam: AuthenticExam) => {
    const appState = useAppStore.getState();
    appState.setCurrentAuthenticExam(exam);
    navigate('/real-exam');
  };

  const recordExamResult = async (result: ExamResult) => {
    await db.examResults.add(result);
  };

  const handleSessionQuizComplete = async (result: ExamResult) => {
    try {
      await recordExamResult(result);
    } catch (e) {
      console.error('Failed to save exam result:', e);
      toast.error('Failed to save result.');
    }
    nextTask();
  };

  const nextTask = () => {
    const appState = useAppStore.getState();
    if (appState.currentTaskIndex < appState.sessionTasks.length - 1) {
      appState.setCurrentTaskIndex(appState.currentTaskIndex + 1);
    } else {
      appState.setIsSessionFinished(true);
    }
  };

  const finalizeSession = async () => {
    const appState = useAppStore.getState();
    const userStore = useUserStore.getState();

    const cat = trackCategory(userStore.activeTrack);
    const totalTasks = appState.sessionTasks.length;
    const sessionScore = appState.sessionScore;

    // Derive difficulty from first task's data if available
    const firstTask = appState.sessionTasks[0];
    const difficulty = (firstTask?.data as { difficulty?: string })?.difficulty || 'beginner';

    try {
      await recordExamResult({
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        score: sessionScore,
        totalQuestions: totalTasks,
        category: cat,
        difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced',
        type: 'mock-exam'
      });
    } catch (e) {
      console.error('Failed to save session result:', e);
    }



    appState.setSessionTasks([]);
    appState.setIsSessionFinished(false);
    appState.setSessionScore(0);
    navigate('/');
  };

  const incrementSessionScore = () => {
    const appState = useAppStore.getState();
    appState.setSessionScore(appState.sessionScore + 1);
  };

  /** Export all user data to a JSON file for backup */
  const exportUserData = async () => {
    try {
      const [cards, mistakes, examResults, customExams] = await Promise.all([
        db.cards.toArray(),
        db.mistakes.toArray(),
        db.examResults.toArray(),
        db.customExams.toArray(),
      ]);
      const userPrefs = useUserStore.getState();
      const exportData = {
        version: 1,
        exportDate: new Date().toISOString(),
        userPrefs: {
          theme: userPrefs.theme,
          activeTrack: userPrefs.activeTrack,
          dailyReviewLimit: userPrefs.dailyReviewLimit,
        },
        cards,
        mistakes,
        examResults,
        customExams,
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lingo-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Backup exported successfully!');
    } catch (e) {
      console.error('Export failed:', e);
      toast.error('Export failed.');
    }
  };

  /** Import user data from a backup JSON file */
  const importUserData = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!validateImportSchema(data)) {
        toast.error('Invalid backup file format.');
        return;
      }

      // Restore user preferences
      if (data.userPrefs) {
        // ...
      }

      // Restore database data
      const cards = data.cards as Flashcard[] | undefined;
      const mistakes = data.mistakes as Mistake[] | undefined;
      const examResults = data.examResults as ExamResult[] | undefined;
      const customExams = data.customExams as FullExam[] | undefined;

      if (cards?.length) await db.cards.bulkPut(cards);
      if (mistakes?.length) await db.mistakes.bulkPut(mistakes);
      if (examResults?.length) await db.examResults.bulkPut(examResults);
      if (customExams?.length) await db.customExams.bulkPut(customExams);

      toast.success(`Imported ${cards?.length || 0} cards, ${examResults?.length || 0} exam results.`);
    } catch (e) {
      console.error('Import failed:', e);
      toast.error('Import failed. Check file format.');
    }
  };

  return {
    startDrill,
    startFullExam,
    startAuthenticExam,
    handleSessionQuizComplete,
    nextTask,
    finalizeSession,
    incrementSessionScore,
    exportUserData,
    importUserData,
    trackCategory
  };
}
