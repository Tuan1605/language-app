import { useState, useEffect } from 'react';
import { db } from '../../data/db';
import type { GrammarPoint } from '../../types';
import { useUserStore } from '../../stores/useUserStore';
import { BarChart3 } from 'lucide-react';

export function GrammarMasteryPanel() {
  const [points, setPoints] = useState<GrammarPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const activeTrack = useUserStore(s => s.activeTrack);
  const grammarMastery = useUserStore(s => s.grammarMastery);

  useEffect(() => {
    const load = async () => {
      const track = activeTrack === 'english' ? 'toeic' : 'n2';
      const all = await db.grammar.where('track').equals(track).toArray();
      setPoints(all);
      setIsLoading(false);
    };
    load();
  }, [activeTrack]);

  const mastered = points.filter(p => (grammarMastery[p.id] ?? 0) >= 80).length;
  const learning = points.filter(p => {
    const m = grammarMastery[p.id] ?? 0;
    return m > 0 && m < 80;
  }).length;
  const untouched = points.length - mastered - learning;

  if (isLoading) return null;

  return (
    <div className="w-full bg-bg-card lingo-card p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-purple" />
        <h3 className="font-black text-sm text-text-main uppercase">Grammar Mastery</h3>
      </div>

      <div className="flex gap-4 mb-4 text-xs font-bold">
        <span className="text-green">Mastered: {mastered}</span>
        <span className="text-gold">Learning: {learning}</span>
        <span className="text-text-muted">New: {untouched}</span>
        <span className="text-text-muted ml-auto">{points.length} total</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-gray-path rounded-full overflow-hidden flex">
        {mastered > 0 && (
          <div className="h-full bg-green transition-all" style={{ width: `${(mastered / points.length) * 100}%` }} />
        )}
        {learning > 0 && (
          <div className="h-full bg-gold transition-all" style={{ width: `${(learning / points.length) * 100}%` }} />
        )}
      </div>

      <p className="text-[10px] text-text-muted mt-2">Chơi game ngữ pháp để tăng mastery cho từng điểm ngữ pháp.</p>
    </div>
  );
}
