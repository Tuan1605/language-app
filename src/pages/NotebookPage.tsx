import { AnimatedPage } from '../components/AnimatedPage';
import { NotebookView } from '../components/NotebookView';
import { LocalErrorBoundary } from '../components/LocalErrorBoundary';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../data/db';
import { useUserStore } from '../stores/useUserStore';

export function NotebookPage() {
  const activeTrack = useUserStore(s => s.activeTrack);
  const n2Grammar = useLiveQuery(async () => await db.grammar.where('track').equals('n2').toArray());
  const toeicGrammar = useLiveQuery(async () => await db.grammar.where('track').equals('toeic').toArray());
  const n2Kanji = useLiveQuery(async () => await db.kanji.toArray());

  if (n2Grammar === undefined || toeicGrammar === undefined || n2Kanji === undefined) return <LoadingSpinner />;

  return (
    <LocalErrorBoundary>
      <AnimatedPage>
        <div className="w-full view-enter">
        <NotebookView
          activeTrack={activeTrack}
          n2Grammar={n2Grammar}
          n2Kanji={n2Kanji}
          toeicGrammar={toeicGrammar}
        />
        </div>
      </AnimatedPage>
    </LocalErrorBoundary>
  );
}
