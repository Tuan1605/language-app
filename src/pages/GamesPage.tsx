import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Type, HelpCircle, FileText, Shuffle, BookOpen, Puzzle, Blocks, Search, PenTool, Trophy, Flame, Swords, Lock } from 'lucide-react';
import { useUserStore } from '../stores/useUserStore';
import { MemoryMatch } from '../components/games/MemoryMatch';
import { WordFalling } from '../components/games/WordFalling';
import { HangmanScramble } from '../components/games/HangmanScramble';
import { ContextFill } from '../components/games/ContextFill';
import { WordScramble } from '../components/games/WordScramble';
import { GrammarGapFill } from '../components/games/GrammarGapFill';
import { GrammarMatch } from '../components/games/GrammarMatch';
import { SentenceBuilder } from '../components/games/SentenceBuilder';
import { PatternDetective } from '../components/games/PatternDetective';
import { GrammarTyping } from '../components/games/GrammarTyping';
import { VocabRPG } from '../components/games/VocabRPG';
import { LanguageEscape } from '../components/games/LanguageEscape';
import { GameLeaderboard } from '../components/games/GameLeaderboard';
import { GrammarMasteryPanel } from '../components/games/GrammarMasteryPanel';

type Difficulty = 'easy' | 'medium' | 'hard';
type GameTab = 'vocab' | 'grammar' | 'adventure' | 'leaderboard';
type VocabGame = 'memory' | 'falling' | 'hangman' | 'context' | 'scramble';
type GrammarGame = 'grammar-gap' | 'grammar-match' | 'grammar-builder' | 'grammar-detective' | 'grammar-typing';
type AdventureGame = 'vocab-rpg' | 'escape';
type ActiveGame = 'menu' | VocabGame | GrammarGame | AdventureGame;

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string; emoji: string; desc: string }[] = [
  { value: 'easy', label: 'Easy', emoji: '😊', desc: 'Nhiều mạng, thời gian dài' },
  { value: 'medium', label: 'Medium', emoji: '⚡', desc: 'Cân bằng' },
  { value: 'hard', label: 'Hard', emoji: '🔥', desc: 'Ít mạng, thời gian ngắn' },
];

const vocabGames = [
  { id: 'memory' as const, title: 'Memory Match', desc: 'Lật thẻ và tìm cặp từ vựng', icon: <Brain className="w-7 h-7" />, color: 'blue', gradient: 'from-blue/8 to-transparent' },
  { id: 'falling' as const, title: 'Speed Typing', desc: 'Gõ nhanh từ trước khi chạm đáy', icon: <Type className="w-7 h-7" />, color: 'green', gradient: 'from-green/8 to-transparent' },
  { id: 'hangman' as const, title: 'Hangman', desc: 'Đoán chữ cái hoàn thành từ', icon: <HelpCircle className="w-7 h-7" />, color: 'purple', gradient: 'from-purple/8 to-transparent' },
  { id: 'context' as const, title: 'Fill in Blanks', desc: 'Điền từ đúng vào câu TOEIC', icon: <FileText className="w-7 h-7" />, color: 'gold', gradient: 'from-gold/8 to-transparent' },
  { id: 'scramble' as const, title: 'Word Scramble', desc: 'Sắp xếp chữ cái thành từ đúng', icon: <Shuffle className="w-7 h-7" />, color: 'red', gradient: 'from-red/8 to-transparent' },
];

const grammarGames = [
  { id: 'grammar-gap' as const, title: 'Grammar Gap Fill', desc: 'Điền ngữ pháp vào chỗ trống', icon: <BookOpen className="w-7 h-7" />, color: 'blue', gradient: 'from-blue/8 to-transparent' },
  { id: 'grammar-match' as const, title: 'Grammar Match', desc: 'Ghép pattern với nghĩa', icon: <Puzzle className="w-7 h-7" />, color: 'green', gradient: 'from-green/8 to-transparent' },
  { id: 'grammar-builder' as const, title: 'Sentence Builder', desc: 'Sắp xếp mảnh ngữ pháp', icon: <Blocks className="w-7 h-7" />, color: 'purple', gradient: 'from-purple/8 to-transparent' },
  { id: 'grammar-detective' as const, title: 'Pattern Detective', desc: 'Nhận diện grammar pattern', icon: <Search className="w-7 h-7" />, color: 'gold', gradient: 'from-gold/8 to-transparent' },
  { id: 'grammar-typing' as const, title: 'Grammar Typing', desc: 'Gõ đúng tên grammar pattern', icon: <PenTool className="w-7 h-7" />, color: 'pink', gradient: 'from-pink/8 to-transparent' },
];

const adventureGames = [
  { id: 'vocab-rpg' as const, title: 'RPG Vocabulary', desc: 'Phép thuật từ vựng - đánh quái vật', icon: <Swords className="w-7 h-7" />, color: 'red', gradient: 'from-red/8 to-transparent' },
  { id: 'escape' as const, title: 'Language Escape', desc: 'Giải mật mã thoát phòng', icon: <Lock className="w-7 h-7" />, color: 'purple', gradient: 'from-purple/8 to-transparent' },
];

const COLOR_MAP: Record<string, string> = {
  blue: 'text-blue',
  green: 'text-green',
  purple: 'text-purple',
  gold: 'text-gold',
  red: 'text-red',
  pink: 'text-pink',
};

const BORDER_HOVER_MAP: Record<string, string> = {
  blue: 'hover:border-blue hover:bg-blue/5',
  green: 'hover:border-green hover:bg-green/5',
  purple: 'hover:border-purple hover:bg-purple/5',
  gold: 'hover:border-gold hover:bg-gold/5',
  red: 'hover:border-red hover:bg-red/5',
  pink: 'hover:border-pink hover:bg-pink/5',
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function GamesPage() {
  const [activeGame, setActiveGame] = useState<ActiveGame>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [activeTab, setActiveTab] = useState<GameTab>('vocab');
  const streakDays = useUserStore(s => s.streakDays);
  const gameHighScores = useUserStore(s => s.gameHighScores);

  const goBack = () => setActiveGame('menu');

  if (activeGame !== 'menu') {
    return (
      <div className="w-full flex flex-col min-h-[70vh]">
        <div className="flex-1 w-full flex flex-col relative rounded-2xl overflow-hidden border-2 border-gray-path shadow-sm bg-[var(--bg-card)] p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeGame}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              {activeGame === 'memory' && <MemoryMatch onComplete={goBack} difficulty={difficulty} />}
              {activeGame === 'falling' && <WordFalling onComplete={goBack} difficulty={difficulty} />}
              {activeGame === 'hangman' && <HangmanScramble onComplete={goBack} difficulty={difficulty} />}
              {activeGame === 'context' && <ContextFill onComplete={goBack} difficulty={difficulty} />}
              {activeGame === 'scramble' && <WordScramble onComplete={goBack} difficulty={difficulty} />}
              {activeGame === 'grammar-gap' && <GrammarGapFill onComplete={goBack} difficulty={difficulty} />}
              {activeGame === 'grammar-match' && <GrammarMatch onComplete={goBack} difficulty={difficulty} />}
              {activeGame === 'grammar-builder' && <SentenceBuilder onComplete={goBack} difficulty={difficulty} />}
              {activeGame === 'grammar-detective' && <PatternDetective onComplete={goBack} difficulty={difficulty} />}
              {activeGame === 'grammar-typing' && <GrammarTyping onComplete={goBack} difficulty={difficulty} />}
              {activeGame === 'vocab-rpg' && <VocabRPG onComplete={goBack} difficulty={difficulty} />}
              {activeGame === 'escape' && <LanguageEscape onComplete={goBack} difficulty={difficulty} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  const currentGames = activeTab === 'vocab' ? vocabGames : activeTab === 'grammar' ? grammarGames : adventureGames;

  return (
    <div className="w-full max-w-4xl flex flex-col items-center">
      {/* Header */}
      <div className="flex items-center gap-2 md:gap-3 mb-1.5 md:mb-2">
        <h1 className="text-xl md:text-3xl font-black text-text-main">
          <span className="text-gradient">Trò chơi Học tập</span>
        </h1>
        {streakDays > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 md:px-3 md:py-1.5 bg-gold/10 border-2 border-gold/20 rounded-full">
            <Flame className="w-3.5 h-3.5 md:w-4 md:h-4 text-gold animate-fire-pulse" />
            <span className="text-[10px] md:text-xs font-black text-gold">{streakDays} ngày</span>
          </div>
        )}
      </div>
      <p className="text-text-muted font-bold mb-4 md:mb-6 text-center max-w-lg text-xs md:text-sm">Vừa học vừa chơi! Nhận EXP để tăng cấp độ.</p>

      {/* Tab Selector */}
      <div className="flex gap-0.5 md:gap-1 mb-3 md:mb-5 bg-gray-bg rounded-xl md:rounded-2xl p-1 md:p-1.5 border-2 border-gray-path">
        {[
          { key: 'vocab' as const, label: 'Từ Vựng', color: 'blue' },
          { key: 'grammar' as const, label: 'Ngữ Pháp', color: 'purple' },
          { key: 'adventure' as const, label: 'Phiêu Lưu', color: 'red', icon: <Swords className="w-3.5 h-3.5 md:w-4 md:h-4" /> },
          { key: 'leaderboard' as const, label: 'Xếp hạng', color: 'gold', icon: <Trophy className="w-3.5 h-3.5 md:w-4 md:h-4" /> },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1 md:gap-1.5 px-3 py-2 md:px-5 md:py-2.5 rounded-lg md:rounded-xl font-black text-xs md:text-sm transition-all ${
              activeTab === tab.key
                ? `bg-${tab.color} text-white shadow-sm`
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Difficulty Selector */}
      <div className="flex gap-1 md:gap-1.5 mb-5 md:mb-8 bg-gray-bg rounded-xl md:rounded-2xl p-1 md:p-1.5 border-2 border-gray-path">
        {DIFFICULTY_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setDifficulty(opt.value)}
            className={`flex items-center gap-1 md:gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl font-black text-xs md:text-sm transition-all ${
              difficulty === opt.value
                ? 'bg-blue text-white shadow-sm'
                : 'text-text-muted hover:text-text-main'
            }`}
            title={opt.desc}
          >
            <span>{opt.emoji}</span>
            {opt.label}
          </button>
        ))}
      </div>

      {/* Grammar Mastery Panel */}
      {activeTab === 'grammar' && <GrammarMasteryPanel />}

      {/* Leaderboard */}
      {activeTab === 'leaderboard' && <GameLeaderboard />}

      {/* Games Grid */}
      {activeTab !== 'leaderboard' && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          key={activeTab}
          className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-5 w-full"
        >
          {currentGames.map((g) => {
            const highScore = gameHighScores[g.id as keyof typeof gameHighScores];
            const bestScore = highScore ? Math.max(highScore.easy, highScore.medium, highScore.hard) : 0;

            return (
              <motion.button
                key={g.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveGame(g.id)}
                className={`group relative flex flex-col items-center text-center p-4 md:p-7 rounded-xl md:rounded-2xl border-2 border-gray-path transition-all cursor-pointer bg-gradient-to-br ${g.gradient} bg-[var(--bg-card)] shadow-sm ${BORDER_HOVER_MAP[g.color]}`}
              >
                {/* Category badge */}
                <span className="absolute top-2 right-2 md:top-3 md:right-3 px-1.5 py-0.5 md:px-2 bg-gray-bg border border-gray-path rounded-full text-[7px] md:text-[9px] font-black uppercase tracking-wider text-text-muted">
                  {activeTab === 'vocab' ? 'Vocab' : 'Grammar'}
                </span>

                {/* High score badge */}
                {bestScore > 0 && (
                  <span className="absolute top-2 left-2 md:top-3 md:left-3 flex items-center gap-0.5 md:gap-1 px-1.5 py-0.5 md:px-2 bg-gold/10 border border-gold/20 rounded-full">
                    <Trophy className="w-2.5 h-2.5 md:w-3 md:h-3 text-gold" />
                    <span className="text-[8px] md:text-[10px] font-black text-gold">{bestScore}</span>
                  </span>
                )}

                {/* Icon */}
                <div className={`mb-2 md:mb-4 bg-gray-bg rounded-xl md:rounded-2xl p-2.5 md:p-4 shadow-sm border-2 border-gray-path group-hover:shadow-md transition-shadow ${COLOR_MAP[g.color]}`}>
                  <span className="[&>svg]:w-5 [&>svg]:h-5 md:[&>svg]:w-7 md:[&>svg]:h-7">{g.icon}</span>
                </div>

                {/* Title + Description */}
                <h2 className="text-sm md:text-lg font-black mb-0.5 md:mb-1.5 text-text-main leading-tight">{g.title}</h2>
                <p className="text-[9px] md:text-xs font-bold text-text-muted leading-snug md:leading-relaxed hidden md:block">{g.desc}</p>
              </motion.button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
