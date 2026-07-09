import { motion } from 'framer-motion';
import { Trophy, ArrowRight, Zap } from 'lucide-react';

interface LevelCompleteScreenProps {
  currentLevel: number;
  totalLevels: number;
  correct: number;
  total: number;
  score: number;
  onNextLevel: () => void;
}

export function LevelCompleteScreen({ currentLevel, totalLevels, correct, total, score, onNextLevel }: LevelCompleteScreenProps) {
  const isLastLevel = currentLevel >= totalLevels;
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 flex flex-col items-center justify-center py-6 md:py-8"
    >
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-green/10 flex items-center justify-center mb-4 md:mb-6">
        <Trophy className="w-10 h-10 md:w-12 md:h-12 text-green" />
      </div>
      <h2 className="text-xl md:text-3xl font-black text-text-main mb-2">
        {isLastLevel ? 'Hoàn thành tất cả!' : `Màn ${currentLevel} xong!`}
      </h2>
      <p className="text-sm md:text-base text-text-muted font-bold mb-3">
        Đúng {correct}/{total} câu ({percent}%)
      </p>
      <div className="flex items-center gap-2 px-4 py-2 bg-green/10 border-2 border-green/20 rounded-full mb-4">
        <Zap className="w-4 h-4 text-green" />
        <span className="font-black text-green text-sm">+{score} điểm</span>
      </div>
      {!isLastLevel && (
        <p className="text-xs text-text-muted mb-6">Còn {totalLevels - currentLevel} màn nữa</p>
      )}
      <button onClick={onNextLevel} className="btn-duo btn-green px-6 md:px-8 py-3 md:py-4 text-sm md:text-lg">
        {isLastLevel ? 'Kết thúc' : 'Màn tiếp'} <ArrowRight className="w-4 h-4 md:w-5 md:h-5 inline ml-2" />
      </button>
    </motion.div>
  );
}
