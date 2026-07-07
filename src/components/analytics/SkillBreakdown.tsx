import type { ReactNode } from 'react';
import { Book, Headphones, BookOpen, PenTool, Type } from 'lucide-react';
import type { Flashcard } from '../../types';

interface SkillBreakdownProps {
  trackCards: Flashcard[];
  activeTrack: 'english' | 'japanese';
}

function SkillCard({ label, learned, total, icon }: { label: string; learned: number; total: number; icon: ReactNode }) {
  const percentage = total > 0 ? Math.round((learned / total) * 100) : 0;
  return (
    <div className="shadow-[var(--shadow-outset)] rounded-2xl p-4 text-center my-2 mx-1">
      <div className="mx-auto w-12 h-12 rounded-xl text-blue flex items-center justify-center mb-3 shadow-[var(--shadow-inset-light)]">
        {icon}
      </div>
      <p className="text-[10px] font-black text-text-muted uppercase tracking-wider mb-1">{label}</p>
      <p className="text-xl font-black text-text-main">{percentage}%</p>
      <div className="w-full h-2 rounded-full mt-2 overflow-hidden shadow-[var(--shadow-inset-light)]">
        <div
          className="h-full rounded-full transition-all duration-500 bg-blue"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function SkillBreakdown({ trackCards, activeTrack }: SkillBreakdownProps) {
  return (
    <div className="mb-12">
      <h3 className="text-lg font-black uppercase tracking-widest text-text-main mb-6">Skill Breakdown</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {activeTrack === 'english' ? (
          <>
            <SkillCard label="Vocabulary" learned={trackCards.filter(c => c.topic && !['Part 1', 'Part 2', 'Part 3', 'Part 4'].includes(c.topic)).length} total={trackCards.length} icon={<Book size={24} strokeWidth={2.5} />} />
            <SkillCard label="Listening" learned={trackCards.filter(c => c.topic?.includes('Listening')).length} total={trackCards.length} icon={<Headphones size={24} strokeWidth={2.5} />} />
            <SkillCard label="Reading" learned={trackCards.filter(c => c.topic?.includes('Reading')).length} total={trackCards.length} icon={<BookOpen size={24} strokeWidth={2.5} />} />
            <SkillCard label="Grammar" learned={trackCards.filter(c => c.topic?.includes('Grammar')).length} total={trackCards.length} icon={<PenTool size={24} strokeWidth={2.5} />} />
          </>
        ) : (
          <>
            <SkillCard label="Vocabulary" learned={trackCards.filter(c => c.category === 'n2').length} total={trackCards.length} icon={<Book size={24} strokeWidth={2.5} />} />
            <SkillCard label="Kanji" learned={trackCards.filter(c => c.topic?.includes('Kanji')).length} total={trackCards.length} icon={<Type size={24} strokeWidth={2.5} />} />
            <SkillCard label="Grammar" learned={trackCards.filter(c => c.topic?.includes('Grammar')).length} total={trackCards.length} icon={<PenTool size={24} strokeWidth={2.5} />} />
            <SkillCard label="Reading" learned={trackCards.filter(c => c.topic?.includes('Reading')).length} total={trackCards.length} icon={<BookOpen size={24} strokeWidth={2.5} />} />
          </>
        )}
      </div>
    </div>
  );
}
