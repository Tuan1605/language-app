import { Heart, Timer, Zap, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameHUDProps {
  score?: number;
  combo?: number;
  timer?: number;
  lives?: number;
  maxLives?: number;
  highScore?: number;
  progress?: number;
  progressLabel?: string;
}

export function GameHUD({ score, combo, timer, lives, maxLives, highScore, progress, progressLabel }: GameHUDProps) {
  const timerCritical = timer !== undefined && timer <= 10;
  const isHotCombo = combo !== undefined && combo >= 5;

  return (
    <div className="flex justify-between items-center mb-4 md:mb-6 px-0.5 gap-2">
      {/* Left side: Score + Combo */}
      <div className="flex items-center gap-2 min-w-0">
        {score !== undefined && (
          <motion.div
            key={score}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 md:px-4 md:py-2 bg-blue/10 rounded-xl shrink-0"
          >
            <span className="text-lg md:text-2xl font-black text-blue">{score}</span>
          </motion.div>
        )}
        <AnimatePresence>
          {combo !== undefined && combo > 0 && (
            <motion.div
              key={combo}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              className={`flex items-center gap-1 px-2 py-1 md:px-3 md:py-1.5 rounded-full font-black text-xs md:text-sm shrink-0 ${
                isHotCombo
                  ? 'bg-gold/25 text-gold shadow-[0_0_12px_rgba(237,137,54,0.3)]'
                  : combo >= 3
                    ? 'bg-gold/15 text-gold'
                    : 'bg-gray-bg text-text-muted'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 md:w-4 md:h-4 ${combo >= 3 ? 'fill-gold' : ''}`} />
              x{combo}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Center: Progress */}
      {progress !== undefined && progressLabel && (
        <div className="flex flex-col items-center gap-0.5 min-w-0 flex-shrink">
          <div className="w-20 md:w-32 h-1.5 md:h-2 bg-gray-path rounded-full overflow-hidden progress-shine">
            <motion.div
              className="h-full bg-blue rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress * 100, 100)}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <span className="text-[8px] md:text-[10px] font-bold text-text-muted uppercase tracking-wider truncate">{progressLabel}</span>
        </div>
      )}

      {/* Right side: Lives / Timer / High Score */}
      <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
        {lives !== undefined && maxLives !== undefined && (
          <div className="flex gap-0.5 md:gap-1">
            {[...Array(maxLives)].map((_, i) => (
              <motion.div
                key={i}
                initial={false}
                animate={i < lives ? { scale: [1, 1.3, 1] } : { scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Heart
                  className={`w-4 h-4 md:w-5 md:h-5 transition-all ${
                    i < lives ? 'fill-red text-red' : 'text-gray-path-dark'
                  }`}
                />
              </motion.div>
            ))}
          </div>
        )}
        {timer !== undefined && (
          <motion.div
            animate={timerCritical ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.5, repeat: timerCritical ? Infinity : 0 }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 md:px-4 md:py-2 rounded-xl font-black text-sm md:text-lg transition-all ${
              timerCritical ? 'bg-red/20 text-red animate-timer-urgent' : 'bg-gray-bg text-text-main'
            }`}
          >
            <Timer className="w-4 h-4 md:w-5 md:h-5" />
            {timer}s
          </motion.div>
        )}
        {highScore !== undefined && highScore > 0 && (
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 md:px-3 md:py-1.5 bg-gold/10 rounded-full">
            <Trophy className="w-3 h-3 md:w-3.5 md:h-3.5 text-gold" />
            <span className="text-[10px] md:text-xs font-black text-gold">{highScore}</span>
          </div>
        )}
      </div>
    </div>
  );
}
