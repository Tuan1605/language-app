import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Brain, Type, HelpCircle, FileText, Shuffle, BookOpen, Puzzle, Blocks, Search, PenTool, Trophy } from 'lucide-react';
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
import { GameLeaderboard } from '../components/games/GameLeaderboard';
import { GrammarMasteryPanel } from '../components/games/GrammarMasteryPanel';

type Difficulty = 'easy' | 'medium' | 'hard';
type GameTab = 'vocab' | 'grammar' | 'leaderboard';
type VocabGame = 'memory' | 'falling' | 'hangman' | 'context' | 'scramble';
type GrammarGame = 'grammar-gap' | 'grammar-match' | 'grammar-builder' | 'grammar-detective' | 'grammar-typing';
type ActiveGame = 'menu' | VocabGame | GrammarGame;

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string; desc: string }[] = [
  { value: 'easy', label: 'Easy', desc: 'Nhiều mạng, thời gian dài' },
  { value: 'medium', label: 'Medium', desc: 'Cân bằng' },
  { value: 'hard', label: 'Hard', desc: 'Ít mạng, thời gian ngắn' },
];

const vocabGames = [
  { id: 'memory' as const, title: 'Memory Match', desc: 'Lật thẻ và tìm cặp từ vựng tương ứng', icon: <Brain className="w-8 h-8 text-blue" />, color: 'hover:bg-blue/10 border-gray-path hover:border-blue' },
  { id: 'falling' as const, title: 'Speed Typing', desc: 'Gõ nhanh từ vựng trước khi chúng chạm đáy', icon: <Type className="w-8 h-8 text-green" />, color: 'hover:bg-green/10 border-gray-path hover:border-green' },
  { id: 'hangman' as const, title: 'Hangman / Scramble', desc: 'Đoán chữ cái để hoàn thành từ vựng', icon: <HelpCircle className="w-8 h-8 text-purple" />, color: 'hover:bg-purple/10 border-gray-path hover:border-purple' },
  { id: 'context' as const, title: 'Fill in Blanks', desc: 'Điền từ vựng đúng vào câu chuẩn TOEIC', icon: <FileText className="w-8 h-8 text-gold" />, color: 'hover:bg-gold/10 border-gray-path hover:border-gold' },
  { id: 'scramble' as const, title: 'Word Scramble', desc: 'Sắp xếp chữ cái bị xáo trộn thành từ đúng', icon: <Shuffle className="w-8 h-8 text-pink" />, color: 'hover:bg-pink/10 border-gray-path hover:border-pink' }
];

const grammarGames = [
  { id: 'grammar-gap' as const, title: 'Grammar Gap Fill', desc: 'Điền ngữ pháp đúng vào chỗ trống', icon: <BookOpen className="w-8 h-8 text-blue" />, color: 'hover:bg-blue/10 border-gray-path hover:border-blue' },
  { id: 'grammar-match' as const, title: 'Grammar Match', desc: 'Ghép cặp pattern với nghĩa', icon: <Puzzle className="w-8 h-8 text-green" />, color: 'hover:bg-green/10 border-gray-path hover:border-green' },
  { id: 'grammar-builder' as const, title: 'Sentence Builder', desc: 'Sắp xếp mảnh thành cấu trúc ngữ pháp', icon: <Blocks className="w-8 h-8 text-purple" />, color: 'hover:bg-purple/10 border-gray-path hover:border-purple' },
  { id: 'grammar-detective' as const, title: 'Pattern Detective', desc: 'Nhận diện grammar pattern từ câu ví dụ', icon: <Search className="w-8 h-8 text-gold" />, color: 'hover:bg-gold/10 border-gray-path hover:border-gold' },
  { id: 'grammar-typing' as const, title: 'Grammar Typing', desc: 'Gõ đúng tên grammar pattern', icon: <PenTool className="w-8 h-8 text-pink" />, color: 'hover:bg-pink/10 border-gray-path hover:border-pink' }
];

export function GamesPage() {
  const [activeGame, setActiveGame] = useState<ActiveGame>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [activeTab, setActiveTab] = useState<GameTab>('vocab');

  const goBack = () => setActiveGame('menu');

  if (activeGame !== 'menu') {
    return (
      <div className="w-full flex flex-col min-h-[70vh]">
        <button
          onClick={goBack}
          className="self-start flex items-center gap-2 text-text-muted hover:text-blue mb-4 font-bold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Games Menu
        </button>
        <div className="flex-1 w-full flex flex-col relative rounded-2xl overflow-hidden border-2 border-gray-path shadow-sm bg-[var(--bg-card)] p-4 md:p-6">
          {/* Vocab Games */}
          {activeGame === 'memory' && <MemoryMatch onComplete={goBack} difficulty={difficulty} />}
          {activeGame === 'falling' && <WordFalling onComplete={goBack} difficulty={difficulty} />}
          {activeGame === 'hangman' && <HangmanScramble onComplete={goBack} difficulty={difficulty} />}
          {activeGame === 'context' && <ContextFill onComplete={goBack} difficulty={difficulty} />}
          {activeGame === 'scramble' && <WordScramble onComplete={goBack} difficulty={difficulty} />}
          {/* Grammar Games */}
          {activeGame === 'grammar-gap' && <GrammarGapFill onComplete={goBack} difficulty={difficulty} />}
          {activeGame === 'grammar-match' && <GrammarMatch onComplete={goBack} difficulty={difficulty} />}
          {activeGame === 'grammar-builder' && <SentenceBuilder onComplete={goBack} difficulty={difficulty} />}
          {activeGame === 'grammar-detective' && <PatternDetective onComplete={goBack} difficulty={difficulty} />}
          {activeGame === 'grammar-typing' && <GrammarTyping onComplete={goBack} difficulty={difficulty} />}
        </div>
      </div>
    );
  }

  const currentGames = activeTab === 'vocab' ? vocabGames : grammarGames;

  return (
    <div className="w-full max-w-4xl flex flex-col items-center">
      <h1 className="text-3xl font-black mb-2 text-text-main">Trò chơi Học tập</h1>
      <p className="text-text-muted font-bold mb-6 text-center max-w-lg">Vừa học vừa chơi! Nhận EXP để tăng cấp độ và duy trì chuỗi học mỗi ngày.</p>

      {/* Tab Selector */}
      <div className="flex gap-2 mb-6 bg-gray-bg rounded-xl p-1.5 border-2 border-gray-path">
        <button
          onClick={() => setActiveTab('vocab')}
          className={`px-6 py-2.5 rounded-lg font-black text-sm transition-all ${
            activeTab === 'vocab' ? 'bg-blue text-white shadow-sm' : 'text-text-muted hover:text-text-main'
          }`}
        >
          Từ Vựng
        </button>
        <button
          onClick={() => setActiveTab('grammar')}
          className={`px-6 py-2.5 rounded-lg font-black text-sm transition-all ${
            activeTab === 'grammar' ? 'bg-purple text-white shadow-sm' : 'text-text-muted hover:text-text-main'
          }`}
        >
          Ngữ Pháp
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-6 py-2.5 rounded-lg font-black text-sm transition-all flex items-center gap-1.5 ${
            activeTab === 'leaderboard' ? 'bg-gold text-white shadow-sm' : 'text-text-muted hover:text-text-main'
          }`}
        >
          <Trophy className="w-4 h-4" />
          Bảng xếp hạng
        </button>
      </div>

      {/* Difficulty Selector */}
      <div className="flex gap-2 mb-8 bg-gray-bg rounded-xl p-1.5 border-2 border-gray-path">
        {DIFFICULTY_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setDifficulty(opt.value)}
            className={`px-4 py-2 rounded-lg font-black text-sm transition-all ${
              difficulty === opt.value
                ? 'bg-blue text-white shadow-sm'
                : 'text-text-muted hover:text-text-main'
            }`}
          >
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {currentGames.map((g) => (
            <motion.button
              key={g.id}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveGame(g.id)}
              className={`flex flex-col items-center text-center p-8 rounded-2xl border-2 transition-all cursor-pointer bg-[var(--bg-card)] shadow-sm ${g.color}`}
            >
              <div className="mb-4 bg-gray-bg rounded-2xl p-4 shadow-sm border-2 border-gray-path">{g.icon}</div>
              <h2 className="text-xl font-black mb-2 text-text-main">{g.title}</h2>
              <p className="text-sm font-bold text-text-muted">{g.desc}</p>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
