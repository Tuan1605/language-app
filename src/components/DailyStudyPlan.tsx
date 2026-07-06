import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../data/db';
import { useUserStore } from '../stores/useUserStore';
import { useAppActions } from '../hooks/useAppActions';
import { Clock, BookOpen, Target, RotateCcw, Zap, Shuffle } from 'lucide-react';

interface DailyStudyPlanProps {
  onNavigate: (path: string) => void;
}

export function DailyStudyPlan({ onNavigate }: DailyStudyPlanProps) {
  const activeTrack = useUserStore(s => s.activeTrack);
  const dailyReviewLimit = useUserStore(s => s.dailyReviewLimit);
  const { startDrill } = useAppActions();

  const stats = useLiveQuery(async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();

    const cardsQuery = db.cards.where('language').equals(activeTrack);
    const totalCards = await cardsQuery.count();

    let dueReview = 0;
    let newCards = 0;
    let learningCards = 0;
    let hardCards = 0;

    await cardsQuery.each(card => {
      if (card.state === 'New') {
        newCards++;
      } else if (card.state === 'Learning' || card.state === 'Relearning') {
        learningCards++;
      } else if (card.fsrs_difficulty > 7) {
        hardCards++;
      }

      if (card.next_review) {
        const reviewTime = new Date(card.next_review).getTime();
        if (reviewTime <= todayTime) {
          dueReview++;
        }
      }
    });

    // Count mistakes that haven't been reviewed (no "Got it" action)
    const pendingMistakes = await db.mistakes.count();

    // Estimate time (rough: 30s per vocab, 45s per quiz, 2min per listening/speaking)
    const estimatedReviewMinutes = Math.ceil((Math.min(dueReview, dailyReviewLimit) * 30) / 60);
    const estimatedNewMinutes = Math.ceil((Math.min(newCards, 10) * 45) / 60);

    return {
      totalCards,
      dueReview,
      newCards,
      learningCards,
      hardCards,
      pendingMistakes,
      estimatedReviewMinutes,
      estimatedNewMinutes,
    };
  }, [activeTrack, dailyReviewLimit]);

  if (!stats) return null;

  const studyItems = [
    {
      id: 'review',
      title: 'Ôn tập từ vựng',
      subtitle: `${Math.min(stats.dueReview, dailyReviewLimit)} từ đến hạn`,
      time: `${stats.estimatedReviewMinutes} phút`,
      icon: <RotateCcw size={20} />,
      color: 'var(--green)',
      bgColor: 'var(--tint-green)',
      count: stats.dueReview,
      urgent: stats.dueReview > 0,
      action: () => startDrill('review'),
    },
    {
      id: 'new',
      title: 'Từ vựng mới',
      subtitle: `${Math.min(stats.newCards, 10)} từ mới hôm nay`,
      time: `${stats.estimatedNewMinutes} phút`,
      icon: <BookOpen size={20} />,
      color: 'var(--blue)',
      bgColor: 'var(--tint-blue)',
      count: stats.newCards,
      urgent: false,
      action: () => onNavigate('/flashcard'),
    },
    {
      id: 'mistakes',
      title: 'Sai lầm cần sửa',
      subtitle: `${stats.pendingMistakes} lỗi chưa khắc phục`,
      time: '~5 phút',
      icon: <Target size={20} />,
      color: 'var(--red)',
      bgColor: 'var(--tint-red)',
      count: stats.pendingMistakes,
      urgent: stats.pendingMistakes > 3,
      action: () => onNavigate('/review-mistakes'),
    },
    {
      id: 'cram',
      title: 'Cram Mode',
      subtitle: 'Luyện tập intensivo trước thi',
      time: '10-45 phút',
      icon: <Zap size={20} />,
      color: 'var(--gold)',
      bgColor: 'var(--tint-gold)',
      count: null,
      urgent: false,
      action: () => onNavigate('/cram'),
    },
    {
      id: 'quick-review',
      title: 'Quick Review',
      subtitle: 'Lật thẻ siêu nhanh',
      time: '~5 phút',
      icon: <Shuffle size={20} />,
      color: 'var(--blue)',
      bgColor: 'var(--tint-blue)',
      count: null,
      urgent: false,
      action: () => onNavigate('/quick-review'),
    },
  ];

  const totalTime = studyItems.reduce((acc, item) => {
    const match = item.time.match(/(\d+)/);
    return acc + (match ? parseInt(match[1]) : 0);
  }, 0);

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-text-main uppercase tracking-tight">Hôm nay</h3>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
            Kế hoạch học tập hàng ngày
          </p>
        </div>
      </div>

      {/* Time Summary */}
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-card border-2 border-gray-path shadow-sm">
        <Clock size={14} className="text-text-muted" />
        <span className="text-xs font-bold text-text-muted">
          Tổng thời gian ước tính: <span className="text-text-main">{totalTime} phút</span>
        </span>
      </div>

      {/* Study Items */}
      <div className="grid grid-cols-2 gap-3">
        {studyItems.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className={`p-4 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_2px_8px_rgba(0,0,0,0.08)] ${
              item.urgent
                ? 'shadow-md'
                : 'hover:shadow-md'
            }`}
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: item.urgent ? item.color : 'var(--gray-path)',
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                style={{ backgroundColor: item.bgColor, color: item.color }}
              >
                {item.icon}
              </div>
              {item.count !== null && item.count > 0 && (
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] font-black shadow-sm"
                  style={{ backgroundColor: item.color, color: 'white' }}
                >
                  {item.count}
                </span>
              )}
            </div>
            <p className="text-sm font-black text-text-main mb-1 leading-tight">{item.title}</p>
            <p className="text-[11px] font-bold text-text-muted leading-tight">{item.subtitle}</p>
            <p className="text-[11px] font-black mt-2" style={{ color: item.color }}>
              {item.time}
            </p>
          </button>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-bg-card border-2 border-gray-path shadow-sm">
        <div className="text-center">
          <p className="text-lg font-black text-text-main">{stats.totalCards}</p>
          <p className="text-[9px] font-bold text-text-muted uppercase">Tổng từ</p>
        </div>
        <div className="w-px h-8 bg-gray-path" />
        <div className="text-center">
          <p className="text-lg font-black text-blue">{stats.learningCards}</p>
          <p className="text-[9px] font-bold text-text-muted uppercase">Đang học</p>
        </div>
        <div className="w-px h-8 bg-gray-path" />
        <div className="text-center">
          <p className="text-lg font-black text-gold">{stats.hardCards}</p>
          <p className="text-[9px] font-bold text-text-muted uppercase">Khó</p>
        </div>
        <div className="w-px h-8 bg-gray-path" />
        <div className="text-center">
          <p className="text-lg font-black text-green">{stats.newCards}</p>
          <p className="text-[9px] font-bold text-text-muted uppercase">Mới</p>
        </div>
      </div>
    </div>
  );
}
