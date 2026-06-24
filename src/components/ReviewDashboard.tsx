import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../data/db';
import { useUserStore } from '../stores/useUserStore';
import { useNavigate } from 'react-router-dom';
import { AnimatedPage } from './AnimatedPage';

export function ReviewDashboard() {
  const activeTrack = useUserStore(s => s.activeTrack);
  const navigate = useNavigate();

  const stats = useLiveQuery(async () => {
    const allCards = await db.cards.where('language').equals(activeTrack).toArray();
    const now = new Date();
    const tomorrowEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2).getTime();
    const weekEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7).getTime();

    let dueToday = 0;
    let dueTomorrow = 0;
    let dueThisWeek = 0;
    let newCards = 0;
    let learningCards = 0;
    let reviewCards = 0;
    let masteredCards = 0;

    for (const card of allCards) {
      if (card.status === 'new') newCards++;
      else if (card.status === 'learning') learningCards++;
      else if (card.status === 'review') reviewCards++;

      if (card.repetition >= 5 && card.interval >= 21) masteredCards++;

      if (card.next_review) {
        const reviewTime = new Date(card.next_review).getTime();
        if (reviewTime <= now.getTime()) dueToday++;
        else if (reviewTime <= tomorrowEnd) dueTomorrow++;
        else if (reviewTime <= weekEnd) dueThisWeek++;
      }
    }

    return {
      total: allCards.length,
      dueToday,
      dueTomorrow,
      dueThisWeek: dueThisWeek - dueTomorrow,
      newCards,
      learningCards,
      reviewCards,
      masteredCards
    };
  }, [activeTrack]);

  if (!stats) {
    return <div className="w-full flex items-center justify-center py-20"><div className="w-8 h-8 border-3 border-[var(--blue)] border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const statusCards = [
    { label: 'New', count: stats.newCards, color: 'var(--blue)', bg: 'var(--tint-blue)' },
    { label: 'Learning', count: stats.learningCards, color: 'var(--gold)', bg: 'var(--tint-amber)' },
    { label: 'Review', count: stats.reviewCards, color: 'var(--green)', bg: 'var(--tint-green)' },
    { label: 'Mastered', count: stats.masteredCards, color: 'var(--purple)', bg: 'var(--tint-purple)' },
  ];

  const upcomingCards = [
    { label: 'Today', count: stats.dueToday, urgent: true },
    { label: 'Tomorrow', count: stats.dueTomorrow, urgent: false },
    { label: 'This week', count: stats.dueThisWeek, urgent: false },
  ];

  return (
    <AnimatedPage>
      <div className="w-full view-enter space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-black text-gradient uppercase tracking-tight mb-2">Review Dashboard</h2>
          <p className="text-sm font-bold text-[var(--text-muted)]">Track your spaced repetition progress</p>
        </div>

        {/* Upcoming Reviews */}
        <div className="w-full lingo-card p-6">
          <h3 className="font-black text-lg mb-4">Upcoming Reviews</h3>
          <div className="grid grid-cols-3 gap-4">
            {upcomingCards.map(item => (
              <div key={item.label} className={`text-center p-4 rounded-2xl border-2 ${item.urgent && item.count > 0 ? 'border-[var(--gold)] bg-[var(--tint-gold)]' : 'border-[var(--border-main)] bg-[var(--gray-bg)]'}`}>
                <div className={`text-3xl font-black ${item.urgent && item.count > 0 ? 'text-[var(--gold)]' : 'text-[var(--text-main)]'}`}>
                  {item.count}
                </div>
                <div className="text-xs font-bold text-[var(--text-muted)] mt-1">{item.label}</div>
              </div>
            ))}
          </div>
          {stats.dueToday > 0 && (
            <button
              onClick={() => navigate('/review')}
              className="w-full mt-4 btn-duo btn-green h-12"
            >
              START REVIEW ({stats.dueToday} cards)
            </button>
          )}
        </div>

        {/* Card Status Breakdown */}
        <div className="w-full lingo-card p-6">
          <h3 className="font-black text-lg mb-4">Card Status ({stats.total} total)</h3>
          <div className="space-y-3">
            {statusCards.map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-20 text-xs font-bold text-[var(--text-muted)]">{item.label}</div>
                <div className="flex-1 h-6 bg-[var(--gray-bg)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.total > 0 ? (item.count / stats.total) * 100 : 0}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
                <div className="w-10 text-right text-sm font-black" style={{ color: item.color }}>
                  {item.count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => navigate('/review')} className="lingo-card p-4 text-center hover:border-[var(--blue)] transition-colors">
            <div className="text-2xl mb-2">📖</div>
            <div className="text-xs font-black uppercase">Review Now</div>
          </button>
          <button onClick={() => navigate('/collection')} className="lingo-card p-4 text-center hover:border-[var(--blue)] transition-colors">
            <div className="text-2xl mb-2">📚</div>
            <div className="text-xs font-black uppercase">Browse Library</div>
          </button>
        </div>
      </div>
    </AnimatedPage>
  );
}
