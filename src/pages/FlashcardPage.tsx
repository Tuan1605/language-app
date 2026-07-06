import { useState, useMemo, useEffect, useCallback } from 'react';
import { AnimatedPage } from '../components/AnimatedPage';
import { useUserStore } from '../stores/useUserStore';
import { db } from '../data/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { FlashcardView } from '../components/FlashcardView';
import { FlashcardWriteView } from '../components/FlashcardWriteView';
import { LocalErrorBoundary } from '../components/LocalErrorBoundary';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useReviewActions } from '../hooks/useReviewActions';
import { initializeDatabase } from '../data/contentLoader';
import toast from 'react-hot-toast';
import { Eye, PenTool } from 'lucide-react';

const TOPIC_TRANSLATIONS: Record<string, string> = {
  'Business': 'Kinh doanh',
  'Office': 'Văn phòng',
  'Finance': 'Tài chính',
  'Legal': 'Pháp lý',
  'Marketing': 'Tiếp thị',
  'Human Resources': 'Nhân sự',
  'Technology': 'Công nghệ',
  'Travel & Hospitality': 'Du lịch & Khách sạn',
  'Healthcare': 'Chăm sóc sức khỏe',
  'Daily Life & General': 'Đời sống & Chung',
  'Manufacturing': 'Sản xuất',
  'Real Estate': 'Bất động sản',
  'Education': 'Giáo dục',
  'Retail & Sales': 'Bán lẻ & Bán hàng',
  'Food & Beverage': 'Ẩm thực',
  'Environment': 'Môi trường',
  'Communication': 'Giao tiếp',
  'Transportation & Logistics': 'Giao thông & Hậu cần',
  'Construction & Engineering': 'Xây dựng & Kỹ thuật',
  'Media & Entertainment': 'Truền thông & Giải trí',
  'General Academic': 'Học thuật chung',
  'Verbs & Actions': 'Động từ & Hành động',
  'Adjectives & Descriptions': 'Tính từ & Miêu tả',
  'Nouns & Concepts': 'Danh từ & Khái niệm',
  'Adverbs & Connectors': 'Trạng từ & Từ nối',
  'Insurance': 'Bảo hiểm',
  'Architecture & Design': 'Kiến trúc & Thiết kế',
  'Customer Service': 'Dịch vụ khách hàng',
  'Banking & Investment': 'Ngân hàng & Đầu tư',
  'Science & Research': 'Khoa học & Nghiên cứu',
  'Sports & Recreation': 'Thể thao & Giải trí',
  'Agriculture': 'Nông nghiệp',
  'Energy & Utilities': 'Năng lượng & Tiện ích',
  'Telecommunications': 'Viễn thông',
  'Aviation & Maritime': 'Hàng không & Hàng hải',
  'Industry Terms': 'Thuật ngữ ngành',
  'Academic': 'Học thuật',
  'Work': 'Công việc',
  'Daily Life': 'Đời sống',
  'Travel': 'Du lịch',
  'Culture': 'Văn hóa',
  'Health': 'Sức khỏe',
  'Emotions': 'Cảm xúc',
  'Nature': 'Thiên nhiên',
  'Government': 'Chính phủ',
  'Science': 'Khoa học',
};

export function FlashcardPage() {
  const activeTrack = useUserStore(s => s.activeTrack);
  const { handleRateCard, handleArchiveCard } = useReviewActions();
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studiedIds, setStudiedIds] = useState<Set<string>>(new Set());
  const [isInitializing, setIsInitializing] = useState(false);
  const [studyMode, setStudyMode] = useState<'read' | 'write'>('read');

  const allCards = useLiveQuery(
    () => db.cards.where('language').equals(activeTrack).toArray(),
    [activeTrack]
  );

  // Auto-reinitialize when database is empty
  const handleInit = useCallback(async () => {
    setIsInitializing(true);
    try {
      await db.meta.put({ id: 'initialized', value: false });
      await initializeDatabase();
      toast.success('Data loaded! Refreshing...');
      window.location.reload();
    } catch (e) {
      console.error('Init failed:', e);
      toast.error('Failed to load data');
    } finally {
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    if (allCards !== undefined && allCards.length === 0 && !isInitializing) {
      console.log('[FlashcardPage] Database empty, auto-initializing...');
      handleInit();
    }
  }, [allCards, isInitializing, handleInit]);

  const topics = useMemo(() => {
    if (!allCards) return [];
    const ts = new Set<string>();
    allCards.forEach(c => { if (c.topic) ts.add(c.topic); });
    return Array.from(ts).sort();
  }, [allCards]);

  const filteredCards = useMemo(() => {
    if (!allCards) return [];
    const base = selectedTopic === 'all'
      ? allCards
      : allCards.filter(c => c.topic === selectedTopic);
    return base.filter(c => !studiedIds.has(c.id));
  }, [allCards, selectedTopic, studiedIds]);

  // Clamp currentIndex when filteredCards shrinks (e.g. after rating)
  useEffect(() => {
    if (filteredCards.length > 0 && currentIndex >= filteredCards.length) {
      setCurrentIndex(Math.max(0, filteredCards.length - 1));
    }
  }, [filteredCards.length, currentIndex]);

  const card = filteredCards[currentIndex % filteredCards.length];
  const totalStudied = studiedIds.size;

  if (allCards === undefined || isInitializing) return <LoadingSpinner />;

  if (filteredCards.length === 0) {
    return (
      <AnimatedPage>
        <div className="w-full text-center py-20 space-y-4">
          <p className="text-lg font-black text-text-muted">No cards to study</p>
          <p className="text-sm text-text-muted">
            {selectedTopic !== 'all' ? 'Try another topic' : 'All cards studied! Great job!'}
          </p>
          <button onClick={() => { setStudiedIds(new Set()); setCurrentIndex(0); }} className="btn-duo btn-blue h-12 px-6">
            STUDY AGAIN
          </button>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="w-full view-enter space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-black text-gradient uppercase tracking-tight mb-2">Flashcards</h2>
          <p className="text-sm font-bold text-text-muted">Learn new vocabulary by topic</p>
        </div>

        {/* Topic Filter */}
        <div className="flex justify-center">
          <select
            value={selectedTopic}
            onChange={(e) => {
              setSelectedTopic(e.target.value);
              setCurrentIndex(0);
            }}
            className="bg-bg-hover border-2 border-border-main rounded-2xl py-2 px-4 font-bold outline-none focus:border-blue transition-all text-text-main text-sm cursor-pointer max-w-full overflow-hidden text-ellipsis"
          >
            <option value="all">All Topics (Tất cả chủ đề) ({allCards.length})</option>
            {topics.map(t => {
              const count = allCards.filter(c => c.topic === t).length;
              const vnName = TOPIC_TRANSLATIONS[t] ? `(${TOPIC_TRANSLATIONS[t]})` : '';
              return <option key={t} value={t}>{t} {vnName} ({count})</option>;
            })}
          </select>
        </div>

        {/* Study Mode Toggle */}
        <div className="flex justify-center">
          <div className="flex p-1 bg-gray-bg rounded-2xl border-2 border-gray-path">
            <button
              onClick={() => setStudyMode('read')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs transition-all ${
                studyMode === 'read' ? 'bg-white shadow-sm text-blue' : 'text-text-muted hover:text-text-main'
              }`}
            >
              <Eye size={16} />
              READ
            </button>
            <button
              onClick={() => setStudyMode('write')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs transition-all ${
                studyMode === 'write' ? 'bg-white shadow-sm text-green' : 'text-text-muted hover:text-text-main'
              }`}
            >
              <PenTool size={16} />
              WRITE
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between text-xs font-bold text-text-muted">
          <span>{totalStudied} studied</span>
          <span>{currentIndex + 1} / {filteredCards.length} remaining</span>
        </div>

        {/* Flashcard */}
        <LocalErrorBoundary key={`flashcard-${card.id}`}>
          {studyMode === 'read' ? (
            <FlashcardView
              card={card}
              onRate={async (rating) => {
                setStudiedIds(prev => new Set(prev).add(card.id));
                await handleRateCard(card, rating);
                toast.success(`Card rated: ${rating}`);
              }}
              onArchive={async () => {
                setStudiedIds(prev => new Set(prev).add(card.id));
                await handleArchiveCard(card);
                toast.success('Card archived');
              }}
            />
          ) : (
            <FlashcardWriteView
              card={card}
              onComplete={async (correct) => {
                setStudiedIds(prev => new Set(prev).add(card.id));
                await handleRateCard(card, correct ? 'Good' : 'Again');
                toast.success(correct ? 'Correct!' : 'Keep practicing!');
              }}
              onSkip={() => setCurrentIndex(currentIndex + 1)}
            />
          )}
        </LocalErrorBoundary>

        {/* Navigation */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => {
              setStudiedIds(prev => {
                const next = new Set(prev);
                next.delete(card.id);
                return next;
              });
              setCurrentIndex(Math.max(0, currentIndex - 1));
            }}
            disabled={currentIndex === 0}
            className="btn-duo btn-gray h-10 px-4 text-xs disabled:opacity-40"
          >
            BACK
          </button>
          <button
            onClick={() => setCurrentIndex(currentIndex + 1)}
            className="btn-duo btn-blue h-10 px-6 text-xs"
          >
            SKIP
          </button>
        </div>
      </div>
    </AnimatedPage>
  );
}
