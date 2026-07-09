import { motion } from 'framer-motion';
import { Trophy, RotateCcw, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

interface GameOverScreenProps {
  score: number;
  expEarned: number;
  highScore?: number;
  isWin: boolean;
  onRestart: () => void;
  onMenu: () => void;
}

function ConfettiParticle({ index }: { index: number }) {
  const colors = ['var(--blue)', 'var(--green)', 'var(--gold)', 'var(--purple)', 'var(--red)', '#FF6B9D', '#00D2FF'];
  const color = colors[index % colors.length];
  const left = Math.random() * 100;
  const delay = Math.random() * 0.8;
  const size = 6 + Math.random() * 8;
  const rotation = Math.random() * 360;
  const isCircle = index % 3 === 0;

  return (
    <motion.div
      initial={{ y: -20, x: 0, opacity: 1, rotate: 0, scale: 1 }}
      animate={{
        y: [0, 300 + Math.random() * 200],
        x: [0, (Math.random() - 0.5) * 200],
        opacity: [1, 1, 0],
        rotate: rotation + 360 + Math.random() * 360,
        scale: [1, 0.6],
      }}
      transition={{
        duration: 1.5 + Math.random() * 1,
        delay,
        ease: 'easeOut',
      }}
      style={{
        position: 'absolute',
        left: `${left}%`,
        top: '-10px',
        width: `${size}px`,
        height: isCircle ? `${size}px` : `${size * 1.5}px`,
        backgroundColor: color,
        borderRadius: isCircle ? '50%' : '2px',
        pointerEvents: 'none' as const,
      }}
    />
  );
}

export function GameOverScreen({ score, expEarned, highScore, isWin, onRestart, onMenu }: GameOverScreenProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isWin) {
      const timer = setTimeout(() => setShowConfetti(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isWin]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 flex flex-col items-center justify-center relative overflow-hidden py-8"
    >
      {/* Confetti burst */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <ConfettiParticle key={i} index={i} />
          ))}
        </div>
      )}

      {/* Background glow for win */}
      {isWin && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.15, scale: 1.5 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="absolute w-64 h-64 rounded-full"
          style={{ background: 'radial-gradient(circle, var(--gold) 0%, transparent 70%)' }}
        />
      )}

      {/* Trophy icon */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        className={`relative w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center mb-4 md:mb-6 ${
          isWin ? 'bg-green/10 shadow-[0_0_40px_rgba(72,187,120,0.2)]' : 'bg-gold/10'
        }`}
      >
        <Trophy className={`w-10 h-10 md:w-14 md:h-14 ${isWin ? 'text-green' : 'text-gold'}`} />
        {isWin && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute -top-1 -right-1 w-6 h-6 md:w-8 md:h-8 bg-gold rounded-full flex items-center justify-center"
          >
            <span className="text-white text-xs md:text-sm font-black">★</span>
          </motion.div>
        )}
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl md:text-3xl font-black text-text-main mb-2"
      >
        {isWin ? 'Excellent!' : 'Game Over'}
      </motion.h2>

      {/* Score */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col items-center gap-2 mb-2"
      >
        <p className="text-lg md:text-xl font-bold text-text-muted">Score: <span className="text-text-main font-black">{score}</span></p>
      </motion.div>

      {/* EXP earned */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.5 }}
        className="px-4 py-1.5 md:px-5 md:py-2 bg-green/10 border-2 border-green/20 rounded-full mb-2"
      >
        <span className="font-black text-green text-xs md:text-sm">+{expEarned} EXP</span>
      </motion.div>

      {/* High score */}
      {highScore !== undefined && highScore > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xs md:text-sm font-bold text-gold mb-6 md:mb-8"
        >
          Best: {highScore}
        </motion.p>
      )}
      {(!highScore || highScore === 0) && <div className="mb-6 md:mb-8" />}

      {/* Action buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex gap-3 md:gap-4"
      >
        <button
          onClick={onRestart}
          className="btn-duo btn-blue px-4 py-2.5 md:px-6 md:py-3 text-xs md:text-sm"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Play Again
        </button>
        <button
          onClick={onMenu}
          className="btn-duo btn-outline px-4 py-2.5 md:px-6 md:py-3 text-xs md:text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Menu
        </button>
      </motion.div>
    </motion.div>
  );
}
