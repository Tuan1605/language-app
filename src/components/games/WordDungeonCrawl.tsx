import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../data/db';
import type { Flashcard } from '../../types';
import { useUserStore } from '../../stores/useUserStore';
import toast from 'react-hot-toast';
import {
  Zap, RotateCcw, Target, Heart, Crown
} from 'lucide-react';
import { GameShell } from './GameShell';
import { GameLoading } from './GameLoading';
import { playCorrect, playWrong, playCombo, playGameOver, playTap, playMatch, playLevelComplete, playStreakFire } from '../../utils/sound';
import { LevelSelector } from './LevelSelector';
import { COMMON_LIVES } from './gameBalancing';

// ═══════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════

interface WordBubble {
  id: string;
  card: Flashcard;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isCorrect: boolean;
  state: 'floating' | 'correct' | 'wrong' | 'exploding';
  hue: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface PowerUp {
  id: string;
  type: 'freeze' | 'nuke' | 'shield' | 'double' | 'heal';
  x: number;
  y: number;
  emoji: string;
}

type GamePhase = 'loading' | 'ready' | 'playing' | 'gameover';

// ═══════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════

const ARENA_W = 380;
const ARENA_H = 480;
const BUBBLE_RADIUS = 38;

const WAVE_CONFIGS = [
  { wave: 1, bubbles: 4, speed: 0.3, label: 'Khởi Động', emoji: '🌱' },
  { wave: 2, bubbles: 5, speed: 0.4, label: 'Tăng Tốc', emoji: '⚡' },
  { wave: 3, bubbles: 5, speed: 0.5, label: 'Nóng Dần', emoji: '🔥' },
  { wave: 4, bubbles: 6, speed: 0.55, label: 'Cuồng Phong', emoji: '🌪️' },
  { wave: 5, bubbles: 6, speed: 0.6, label: 'Điên Cuồng', emoji: '💀' },
  { wave: 6, bubbles: 7, speed: 0.65, label: 'Hỏa Ngục', emoji: '🔥🔥' },
  { wave: 7, bubbles: 7, speed: 0.7, label: 'Siêu Việt', emoji: '⭐' },
  { wave: 8, bubbles: 8, speed: 0.75, label: 'Huyền Thoại', emoji: '👑' },
];

const POWER_UP_DEFS: Record<string, { emoji: string }> = {
  freeze: { emoji: '❄️' },
  nuke: { emoji: '💣' },
  shield: { emoji: '🛡️' },
  double: { emoji: '✨' },
  heal: { emoji: '💚' },
};

// ═══════════════════════════════════════════════════
// UTILITY
// ═══════════════════════════════════════════════════

let particleIdCounter = 0;

function createExplosion(x: number, y: number, color: string, count: number = 8): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const speed = 2 + Math.random() * 3;
    particles.push({
      id: particleIdCounter++,
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 30 + Math.floor(Math.random() * 20),
      maxLife: 50,
      color,
      size: 3 + Math.random() * 4,
    });
  }
  return particles;
}



// ═══════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════

export function WordBlitz({ onComplete }: {
  onComplete: () => void;
}) {
  // ─── Core State ───
  const [gamePhase, setGamePhase] = useState<GamePhase>('loading');
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [cardIndex, setCardIndex] = useState(0);

  // ─── Arena State ───
  const [bubbles, setBubbles] = useState<WordBubble[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);

  // ─── Game State ───
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [lives, setLives] = useState(COMMON_LIVES);
  const [wave, setWave] = useState(1);
  const [questionsInWave, setQuestionsInWave] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [timeLeft, setTimeLeft] = useState(8);
  const [shieldActive, setShieldActive] = useState(false);
  const [doubleActive, setDoubleActive] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const [screenFlash, setScreenFlash] = useState<'green' | 'red' | null>(null);
  const [missedWords, setMissedWords] = useState<{ word: string; def: string }[]>([]);
  const [showWaveBanner, setShowWaveBanner] = useState(false);
  const [perfectWave, setPerfectWave] = useState(true);

  // ─── Refs ───
  const arenaRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const bubblesRef = useRef(bubbles); bubblesRef.current = bubbles;
  const frozenRef = useRef(frozen); frozenRef.current = frozen;
  const gamePhaseRef = useRef(gamePhase); gamePhaseRef.current = gamePhase;
  const livesRef = useRef(lives); livesRef.current = lives;
  const shieldRef = useRef(shieldActive); shieldRef.current = shieldActive;
  const comboRef = useRef(combo); comboRef.current = combo;
  const doubleRef = useRef(doubleActive); doubleRef.current = doubleActive;
  const waveRef = useRef(wave); waveRef.current = wave;
  const questionsInWaveRef = useRef(questionsInWave); questionsInWaveRef.current = questionsInWave;
  const perfectWaveRef = useRef(perfectWave); perfectWaveRef.current = perfectWave;

  // ─── Store ───
  const activeTrack = useUserStore(s => s.activeTrack);
  const addExp = useUserStore(s => s.addExp);
  const updateGameProgress = useUserStore(s => s.updateGameProgress);
  const gameProgress = useUserStore(s => s.gameProgress);
  
  const currentProgress = gameProgress['word-blitz'] || { highScore: 0, maxLevel: 1 };

  const currentCard = deck.length > 0 ? deck[cardIndex % deck.length] : null;
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const waveConfig = WAVE_CONFIGS[Math.min(wave - 1, WAVE_CONFIGS.length - 1)];

  // ═══════════════════════════════════════════════════
  // GAME LOGIC
  // ═══════════════════════════════════════════════════

  // ─── Load Data ───
  useEffect(() => { loadGame(); }, [activeTrack]);

  const loadGame = async () => {
    try {
      const allCards = await db.cards.where('language').equals(activeTrack).toArray();
      if (allCards.length < 6) { toast.error('Cần ít nhất 6 flashcard!'); onComplete(); return; }
      const shuffled = allCards.sort(() => 0.5 - Math.random());
      setDeck(shuffled);
      setGamePhase('ready');
    } catch (e) {
      console.error(e);
      toast.error('Không tải được dữ liệu!');
    }
  };

  const startGame = (startWave: number = 1) => {
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setLives(COMMON_LIVES);
    setWave(startWave);
    setQuestionsInWave(0);
    setTotalCorrect(0);
    setTotalAnswered(0);
    
    const baseTime = 8;
    const waveReduction = Math.floor((startWave - 1) * 0.3);
    setTimeLeft(Math.max(3, baseTime - waveReduction));
    setMissedWords([]);
    setShieldActive(false);
    setDoubleActive(false);
    setFrozen(false);
    setPerfectWave(true);
    setCardIndex(0);
    setParticles([]);
    setPowerUps([]);
    setBubbles([]);
    setGamePhase('playing');

    // Spawn initial bubbles after a brief delay
    setTimeout(() => spawnBubbles(0, startWave), 300);
  };

  // ─── Spawn Bubbles ───
  const spawnBubbles = useCallback((currentCardIdx: number, currentWave: number) => {
    if (deck.length === 0) return;

    const cfg = WAVE_CONFIGS[Math.min(currentWave - 1, WAVE_CONFIGS.length - 1)];
    const count = cfg.bubbles;
    const speed = cfg.speed;
    const radius = BUBBLE_RADIUS;

    const correctCard = deck[currentCardIdx % deck.length];

    // Pick distractors (other cards)
    const distractors: Flashcard[] = [];
    const usedIds = new Set([correctCard.id]);
    const shuffledDeck = [...deck].sort(() => 0.5 - Math.random());
    for (const card of shuffledDeck) {
      if (!usedIds.has(card.id)) {
        distractors.push(card);
        usedIds.add(card.id);
        if (distractors.length >= count - 1) break;
      }
    }

    // Create bubble array
    const allCards = [correctCard, ...distractors].sort(() => 0.5 - Math.random());

    const newBubbles: WordBubble[] = allCards.map((card, i) => {
      // Spread bubbles around the arena, avoiding edges
      const angle = (Math.PI * 2 * i) / allCards.length + Math.random() * 0.5;
      const dist = 80 + Math.random() * 60;
      const cx = ARENA_W / 2 + Math.cos(angle) * dist;
      const cy = ARENA_H / 2 + Math.sin(angle) * dist - 30;

      const moveAngle = Math.random() * Math.PI * 2;
      return {
        id: `${Date.now()}-${i}`,
        card,
        x: Math.max(radius + 5, Math.min(ARENA_W - radius - 5, cx)),
        y: Math.max(radius + 5, Math.min(ARENA_H - radius - 5, cy)),
        vx: Math.cos(moveAngle) * speed,
        vy: Math.sin(moveAngle) * speed,
        radius,
        isCorrect: card.id === correctCard.id,
        state: 'floating' as const,
        hue: 200 + Math.random() * 160,
      };
    });

    setBubbles(newBubbles);
  }, [deck]);

  // ─── Animation Loop ───
  useEffect(() => {
    if (gamePhase !== 'playing') return;

    const animate = () => {
      if (gamePhaseRef.current !== 'playing') return;

      // Update bubble positions
      setBubbles(prev => prev.map(b => {
        if (b.state !== 'floating' || frozenRef.current) return b;

        let nx = b.x + b.vx;
        let ny = b.y + b.vy;
        let nvx = b.vx;
        let nvy = b.vy;

        // Bounce off walls
        if (nx < b.radius + 2 || nx > ARENA_W - b.radius - 2) {
          nvx = -nvx;
          nx = Math.max(b.radius + 2, Math.min(ARENA_W - b.radius - 2, nx));
        }
        if (ny < b.radius + 2 || ny > ARENA_H - b.radius - 2) {
          nvy = -nvy;
          ny = Math.max(b.radius + 2, Math.min(ARENA_H - b.radius - 2, ny));
        }

        return { ...b, x: nx, y: ny, vx: nvx, vy: nvy };
      }));

      // Update particles
      setParticles(prev => prev
        .map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.1,
          life: p.life - 1,
          size: p.size * 0.97,
        }))
        .filter(p => p.life > 0)
      );

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [gamePhase, frozen]);

  // ─── Timer ───
  useEffect(() => {
    if (gamePhase !== 'playing') return;

    const timer = setInterval(() => {
      if (frozenRef.current) return;

      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeout();
          return getQuestionTime();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gamePhase]);

  const getQuestionTime = () => {
    const base = 8;
    const waveReduction = Math.floor((waveRef.current - 1) * 0.3);
    return Math.max(3, base - waveReduction);
  };

  // ─── Handle Timeout ───
  const handleTimeout = () => {
    if (gamePhaseRef.current !== 'playing') return;

    const correctBubble = bubblesRef.current.find(b => b.isCorrect);
    if (correctBubble) {
      toast.error(`⏰ Hết giờ! Đáp án: ${correctBubble.card.word}`);
      setMissedWords(prev =>
        prev.find(m => m.word === correctBubble.card.word) ? prev
        : [...prev, { word: correctBubble.card.word, def: correctBubble.card.definition }]
      );
    }

    loseLife();
    setCombo(0);
    setPerfectWave(false);
    nextQuestion();
  };

  // ─── Handle Bubble Click ───
  const handleBubbleClick = (bubble: WordBubble) => {
    if (gamePhase !== 'playing' || bubble.state !== 'floating') return;

    setTotalAnswered(prev => prev + 1);

    if (bubble.isCorrect) {
      // ─── CORRECT! ───
      playCorrect();
      setTotalCorrect(prev => prev + 1);

      const newCombo = comboRef.current + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
      if (newCombo >= 3) playCombo(newCombo);
      if (newCombo >= 5) playStreakFire();

      // Score calculation
      const basePoints = 10 + waveRef.current * 2;
      const comboBonus = Math.floor(basePoints * Math.min(newCombo * 0.2, 3));
      const timeBonus = Math.floor(timeLeft * 1.5);
      let totalPoints = basePoints + comboBonus + timeBonus;
      if (doubleRef.current) totalPoints *= 2;
      setScore(prev => prev + totalPoints);

      // Visual feedback
      setScreenFlash('green');
      setTimeout(() => setScreenFlash(null), 200);

      // Explosion particles
      setParticles(prev => [...prev, ...createExplosion(bubble.x, bubble.y, '#48BB78', 12)]);

      // Mark as correct
      setBubbles(prev => prev.map(b =>
        b.id === bubble.id ? { ...b, state: 'correct' as const } : b
      ));

      // Check wave progress
      const qInWave = questionsInWaveRef.current + 1;
      setQuestionsInWave(qInWave);

      if (qInWave >= 6) {
        // Wave complete!
        handleWaveComplete();
      } else {
        nextQuestion();
      }
    } else {
      // ─── WRONG! ───
      playWrong();
      setCombo(0);
      setPerfectWave(false);

      setScreenFlash('red');
      setTimeout(() => setScreenFlash(null), 200);

      // Shake particles
      setParticles(prev => [...prev, ...createExplosion(bubble.x, bubble.y, '#F56565', 6)]);

      // Mark as wrong briefly
      setBubbles(prev => prev.map(b =>
        b.id === bubble.id ? { ...b, state: 'wrong' as const } : b
      ));
      setTimeout(() => {
        setBubbles(prev => prev.map(b =>
          b.id === bubble.id ? { ...b, state: 'floating' as const } : b
        ));
      }, 400);

      // Show correct answer
      const correct = bubblesRef.current.find(b => b.isCorrect);
      toast.error(`✗ Sai! Đáp án: ${correct?.card.word}`);
      if (correct) {
        setMissedWords(prev =>
          prev.find(m => m.word === correct.card.word) ? prev
          : [...prev, { word: correct.card.word, def: correct.card.definition }]
        );
      }

      loseLife();
      nextQuestion();
    }
  };

  // ─── Lose Life ───
  const loseLife = () => {
    if (shieldRef.current) {
      setShieldActive(false);
      toast.success('🛡️ Khiên đã chặn!');
      playTap();
      return;
    }

    setLives(prev => {
      const next = prev - 1;
      if (next <= 0) {
        playGameOver();
        setTimeout(() => setGamePhase('gameover'), 300);
      }
      return next;
    });
  };

  // ─── Next Question ───
  const nextQuestion = () => {
    const nextIdx = cardIndex + 1;
    setCardIndex(nextIdx);
    setTimeLeft(getQuestionTime());
    setTimeout(() => spawnBubbles(nextIdx, waveRef.current), 400);
  };

  // ─── Wave Complete ───
  const handleWaveComplete = () => {
    playLevelComplete();

    const isPerfect = perfectWaveRef.current;
    if (isPerfect) {
      const bonus = 50 * waveRef.current;
      setScore(prev => prev + bonus);
      toast.success(`🌟 Perfect Wave! +${bonus} bonus!`);
    }

    // Chance to spawn power-up
    if (Math.random() < 0.5) {
      spawnPowerUp();
    }

    setShowWaveBanner(true);
    setTimeout(() => {
      setShowWaveBanner(false);
      const nextWave = waveRef.current + 1;
      setWave(nextWave);
      setQuestionsInWave(0);
      setPerfectWave(true);
      setTimeLeft(getQuestionTime());
      const nextIdx = cardIndex + 1;
      setCardIndex(nextIdx);
      
      // Update max level in store when completing a wave
      updateGameProgress('word-blitz', score, nextWave);
      
      setTimeout(() => spawnBubbles(nextIdx, nextWave), 300);
    }, 1800);
  };

  // ─── Power-ups ───
  const spawnPowerUp = () => {
    const types: PowerUp['type'][] = ['freeze', 'nuke', 'shield', 'double', 'heal'];
    const type = types[Math.floor(Math.random() * types.length)];
    const def = POWER_UP_DEFS[type];
    const pu: PowerUp = {
      id: `pu-${Date.now()}`,
      type,
      x: 40 + Math.random() * (ARENA_W - 80),
      y: 40 + Math.random() * (ARENA_H - 200),
      emoji: def.emoji,
    };
    setPowerUps(prev => [...prev, pu]);

    // Auto-remove after 8s
    setTimeout(() => {
      setPowerUps(prev => prev.filter(p => p.id !== pu.id));
    }, 8000);
  };

  const handlePowerUpClick = (pu: PowerUp) => {
    playMatch();
    setPowerUps(prev => prev.filter(p => p.id !== pu.id));
    setParticles(prev => [...prev, ...createExplosion(pu.x, pu.y, '#FBBF24', 10)]);

    switch (pu.type) {
      case 'freeze':
        setFrozen(true);
        toast.success('❄️ Đóng băng 3 giây!');
        setTimeout(() => setFrozen(false), 3000);
        break;
      case 'nuke':
        toast.success('💣 Bom nổ! Xóa bubble sai!');
        setBubbles(prev => {
          const wrongOnes = prev.filter(b => !b.isCorrect && b.state === 'floating');
          wrongOnes.forEach(b => {
            setParticles(p => [...p, ...createExplosion(b.x, b.y, '#F56565', 6)]);
          });
          return prev.filter(b => b.isCorrect || b.state !== 'floating');
        });
        break;
      case 'shield':
        setShieldActive(true);
        toast.success('🛡️ Khiên bảo vệ 1 lần!');
        break;
      case 'double':
        setDoubleActive(true);
        toast.success('✨ x2 điểm trong 10 giây!');
        setTimeout(() => setDoubleActive(false), 10000);
        break;
      case 'heal':
        setLives(prev => Math.min(COMMON_LIVES, prev + 1));
        toast.success('💚 +1 mạng!');
        break;
    }
  };

  // ═══════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════

  if (gamePhase === 'loading') return <GameLoading text="Đang chuẩn bị bong bóng..." />;

  // ─── READY SCREEN ───
  if (gamePhase === 'ready') {
    return (
      <GameShell title="Word Blitz" icon={<Target className="w-5 h-5" />} onBack={onComplete}>
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            {/* Animated floating bubbles preview */}
            <div className="relative w-48 h-48 mx-auto mb-6">
              {['🔵', '🟢', '🟡', '🟣', '🔴'].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    x: [0, Math.cos(i * 1.2) * 30, 0],
                    y: [0, Math.sin(i * 0.8) * 25, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute w-14 h-14 rounded-full flex items-center justify-center text-lg font-black text-white shadow-lg"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${15 + (i % 3) * 25}%`,
                    background: `hsl(${200 + i * 35}, 70%, 55%)`,
                    boxShadow: `0 4px 15px hsla(${200 + i * 35}, 70%, 55%, 0.4)`,
                  }}
                >
                  <span className="text-[10px]">word</span>
                </motion.div>
              ))}
              {/* Center target */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 m-auto w-12 h-12 flex items-center justify-center"
              >
                <Target className="w-8 h-8 text-gold" />
              </motion.div>
            </div>

            <h2 className="text-2xl font-black text-text-main mb-2">
              <span className="text-gradient">Word Blitz</span>
            </h2>
            <p className="text-sm font-bold text-text-muted mb-1">Bong bóng bay — Chạm đúng từ!</p>
            <p className="text-xs text-text-muted mb-6 max-w-xs mx-auto">
              Nghĩa sẽ hiện ra, chạm vào bong bóng chứa <strong>từ đúng</strong>. Nhanh tay, chính xác, combo lên!
            </p>

            {/* How to play */}
            <div className="grid grid-cols-3 gap-2 mb-6 max-w-xs mx-auto">
              {[
                { icon: '👆', text: 'Chạm đúng từ' },
                { icon: '⚡', text: 'Combo x điểm' },
                { icon: '🌊', text: 'Sóng liên tục' },
              ].map((item, i) => (
                <div key={i} className="text-center p-2 rounded-xl bg-bg-card border border-gray-path/40">
                  <span className="text-xl">{item.icon}</span>
                  <p className="text-[9px] font-bold text-text-muted mt-1">{item.text}</p>
                </div>
              ))}
            </div>

            <LevelSelector maxLevel={currentProgress.maxLevel} highScore={currentProgress.highScore} onSelect={startGame} />
          </motion.div>
        </div>
      </GameShell>
    );
  }

  // ─── GAME OVER ───
  if (gamePhase === 'gameover') {
    return (
      <GameShell title="Word Blitz" icon={<Target className="w-5 h-5" />} onBack={onComplete}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center py-4 overflow-y-auto custom-scrollbar"
        >
          {/* Score display */}
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-gold/15 shadow-[0_0_40px_rgba(237,137,54,0.3)] flex items-center justify-center mb-4"
          >
            <Crown className="w-10 h-10 text-gold" />
          </motion.div>

          <h2 className="text-2xl font-black text-text-main mb-1">Game Over!</h2>
          <p className="text-xs text-text-muted font-bold mb-1">Sóng {wave} · {waveConfig.emoji} {waveConfig.label}</p>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="text-3xl font-black text-gold mb-1"
          >
            {score}
          </motion.div>
          <p className="text-xs font-bold text-text-muted mb-4">điểm</p>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 mb-4 w-full max-w-xs">
            {[
              { v: `${accuracy}%`, l: 'Chính xác', c: 'text-green' },
              { v: `x${maxCombo}`, l: 'Max Combo', c: 'text-gold' },
              { v: totalCorrect, l: 'Đúng', c: 'text-blue' },
              { v: `W${wave}`, l: 'Sóng', c: 'text-purple' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="text-center p-2 bg-bg-card rounded-xl border border-gray-path/40"
              >
                <p className={`text-sm font-black ${s.c}`}>{s.v}</p>
                <p className="text-[7px] font-bold text-text-muted uppercase">{s.l}</p>
              </motion.div>
            ))}
          </div>

          {/* Missed words */}
          {missedWords.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="w-full max-w-xs mb-4"
            >
              <p className="text-[9px] font-black uppercase tracking-wider mb-1.5 text-center text-gold">
                📖 Từ Cần Ôn ({missedWords.length})
              </p>
              <div className="space-y-1 max-h-28 overflow-y-auto custom-scrollbar">
                {missedWords.map((w, i) => (
                  <div key={i} className="flex justify-between px-2.5 py-1.5 bg-gold/5 border border-gold/10 rounded-lg text-[11px]">
                    <span className="font-black text-text-main">{w.word}</span>
                    <span className="text-text-muted truncate ml-2 text-right max-w-[55%]">{w.def}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex gap-3"
          >
            <button onClick={() => startGame(wave)} className="btn-duo btn-blue px-5 py-2.5 text-xs">
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Chơi Lại Sóng {wave}
            </button>
            <button
              onClick={() => {
                if (score > 0) { 
                  addExp(score); 
                  updateGameProgress('word-blitz', score, wave);
                }
                onComplete();
              }}
              className="btn-duo btn-outline px-5 py-2.5 text-xs"
            >
              Menu
            </button>
          </motion.div>
        </motion.div>
      </GameShell>
    );
  }

  // ─── PLAYING ───
  return (
    <GameShell title="Word Blitz" icon={<Target className="w-5 h-5" />} onBack={onComplete}>
      <div className="flex-1 flex flex-col w-full items-center">
        {/* ─── Top HUD ─── */}
        <div className="flex justify-between items-center w-full max-w-md mb-2 px-1">
          <div className="flex items-center gap-2">
            {/* Score */}
            <motion.div
              key={score}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="px-3 py-1 bg-blue/10 rounded-xl"
            >
              <span className="text-lg font-black text-blue">{score}</span>
            </motion.div>
            {/* Combo */}
            <AnimatePresence>
              {combo >= 2 && (
                <motion.div
                  key={combo}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-black text-[11px] ${
                    combo >= 10 ? 'bg-red/25 text-red shadow-[0_0_12px_rgba(245,101,101,0.4)]'
                    : combo >= 5 ? 'bg-gold/25 text-gold shadow-[0_0_10px_rgba(237,137,54,0.3)]'
                    : 'bg-gold/15 text-gold'
                  }`}
                >
                  <Zap className={`w-3 h-3 ${combo >= 3 ? 'fill-current' : ''}`} />
                  x{combo}
                  {combo >= 5 && <span className="text-[9px]">🔥</span>}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2">
            {/* Lives */}
            <div className="flex gap-0.5">
              {[...Array(COMMON_LIVES)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={i < lives ? { scale: [1, 1.2, 1] } : { scale: 0.8, opacity: 0.3 }}
                  transition={{ duration: 0.3 }}
                >
                  <Heart className={`w-4 h-4 ${i < lives ? 'fill-red text-red' : 'text-gray-path'}`} />
                </motion.div>
              ))}
            </div>
            {/* Wave */}
            <div className="px-2 py-0.5 bg-purple/10 rounded-full">
              <span className="text-[10px] font-black text-purple">W{wave}</span>
            </div>
          </div>
        </div>

        {/* Status indicators */}
        <div className="flex gap-1.5 mb-2">
          {shieldActive && (
            <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }}
              className="text-[10px] font-black text-blue px-2 py-0.5 bg-blue/10 rounded-full">🛡️ Khiên</motion.span>
          )}
          {doubleActive && (
            <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
              className="text-[10px] font-black text-gold px-2 py-0.5 bg-gold/10 rounded-full">✨ x2</motion.span>
          )}
          {frozen && (
            <motion.span animate={{ opacity: [1, 0.6, 1] }} transition={{ duration: 0.5, repeat: Infinity }}
              className="text-[10px] font-black text-blue px-2 py-0.5 bg-blue/10 rounded-full">❄️ Đóng băng</motion.span>
          )}
        </div>

        {/* ─── Timer Bar ─── */}
        <div className="w-full max-w-md px-1 mb-2">
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.15)' }}>
            <motion.div
              className="h-full rounded-full"
              initial={false}
              animate={{ width: `${(timeLeft / getQuestionTime()) * 100}%` }}
              style={{
                backgroundColor: timeLeft <= 3 ? '#F56565' : timeLeft <= 5 ? '#ED8936' : '#48BB78',
                boxShadow: timeLeft <= 3 ? '0 0 10px rgba(245,101,101,0.5)' : 'none',
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* ─── Question ─── */}
        {currentCard && (
          <motion.div
            key={cardIndex}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-md px-1 mb-3"
          >
            <div className="bg-bg-card rounded-xl border-2 border-gray-path/60 p-3 text-center">
              <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Chạm bong bóng chứa từ:</p>
              <p className="text-base font-black text-text-main leading-snug">{currentCard.definition}</p>
              {currentCard.phonetic && (
                <p className="text-[10px] text-text-muted italic mt-0.5">{currentCard.phonetic}</p>
              )}
            </div>
          </motion.div>
        )}

        {/* ─── ARENA ─── */}
        <div
          ref={arenaRef}
          className="relative rounded-2xl border-2 border-gray-path/60 overflow-hidden select-none"
          style={{
            width: '100%',
            maxWidth: `${ARENA_W}px`,
            height: `${ARENA_H}px`,
            background: frozen
              ? 'linear-gradient(180deg, rgba(99,179,237,0.08) 0%, rgba(99,179,237,0.03) 100%)'
              : 'linear-gradient(180deg, rgba(74,144,226,0.04) 0%, rgba(159,122,234,0.03) 100%)',
            touchAction: 'none',
          }}
        >
          {/* Background grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Screen flash overlay */}
          <AnimatePresence>
            {screenFlash && (
              <motion.div
                initial={{ opacity: 0.3 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 z-30 pointer-events-none rounded-2xl"
                style={{ backgroundColor: screenFlash === 'green' ? 'var(--green)' : 'var(--red)' }}
              />
            )}
          </AnimatePresence>

          {/* Wave Banner */}
          <AnimatePresence>
            {showWaveBanner && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
              >
                <div className="text-center bg-bg-card/95 px-6 py-4 rounded-2xl border-2 border-gold/40 shadow-[0_0_30px_rgba(237,137,54,0.3)]">
                  <p className="text-3xl mb-1">{waveConfig.emoji}</p>
                  <p className="text-lg font-black text-gold">Wave {wave} Complete!</p>
                  <p className="text-xs font-bold text-text-muted">{waveConfig.label}</p>
                  {perfectWave && <p className="text-xs font-black text-green mt-1">🌟 Perfect Wave!</p>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Frozen overlay */}
          {frozen && (
            <div className="absolute inset-0 z-20 pointer-events-none"
              style={{ background: 'rgba(99,179,237,0.08)', border: '2px solid rgba(99,179,237,0.3)', borderRadius: '16px' }}
            />
          )}

          {/* Bubbles */}
          {bubbles.map(bubble => (
            <motion.button
              key={bubble.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={
                bubble.state === 'correct'
                  ? { scale: [1, 1.5, 0], opacity: [1, 1, 0] }
                  : bubble.state === 'wrong'
                    ? { scale: [1, 0.8, 1], x: [-3, 3, -3, 0] }
                    : { scale: 1, opacity: 1 }
              }
              transition={
                bubble.state === 'correct'
                  ? { duration: 0.4 }
                  : bubble.state === 'wrong'
                    ? { duration: 0.3 }
                    : { type: 'spring', damping: 15 }
              }
              onClick={() => handleBubbleClick(bubble)}
              disabled={bubble.state !== 'floating'}
              className="absolute z-10 rounded-full flex items-center justify-center cursor-pointer select-none transition-shadow"
              style={{
                left: `${bubble.x}px`,
                top: `${bubble.y}px`,
                width: `${bubble.radius * 2}px`,
                height: `${bubble.radius * 2}px`,
                transform: 'translate(-50%, -50%)',
                background: bubble.state === 'correct'
                  ? 'radial-gradient(circle at 35% 35%, #68D391, #48BB78)'
                  : bubble.state === 'wrong'
                    ? 'radial-gradient(circle at 35% 35%, #FC8181, #F56565)'
                    : `radial-gradient(circle at 35% 35%, hsl(${bubble.hue}, 65%, 65%), hsl(${bubble.hue}, 60%, 48%))`,
                boxShadow: bubble.state === 'correct'
                  ? '0 4px 20px rgba(72,187,120,0.5), inset 0 -3px 6px rgba(0,0,0,0.15)'
                  : bubble.state === 'wrong'
                    ? '0 4px 20px rgba(245,101,101,0.5), inset 0 -3px 6px rgba(0,0,0,0.15)'
                    : `0 4px 15px hsla(${bubble.hue}, 60%, 48%, 0.35), inset 0 -3px 6px rgba(0,0,0,0.12)`,
                border: '2px solid rgba(255,255,255,0.25)',
              }}
            >
              {/* Shine */}
              <div className="absolute top-[15%] left-[20%] w-[30%] h-[25%] rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.5), transparent)' }} />

              {/* Word text */}
              <span className="text-white font-black text-center leading-tight px-1 drop-shadow-sm"
                style={{ fontSize: bubble.card.word.length > 10 ? '9px' : bubble.card.word.length > 7 ? '10px' : '11px' }}>
                {bubble.card.word}
              </span>

              {/* Correct checkmark */}
              {bubble.state === 'correct' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-green/80 rounded-full"
                >
                  <span className="text-white text-xl">✓</span>
                </motion.div>
              )}
            </motion.button>
          ))}

          {/* Power-ups */}
          {powerUps.map(pu => (
            <motion.button
              key={pu.id}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: [1, 1.15, 1], rotate: 0 }}
              transition={{ scale: { duration: 1.5, repeat: Infinity }, rotate: { duration: 0.5 } }}
              onClick={() => handlePowerUpClick(pu)}
              className="absolute z-20 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
              style={{
                left: `${pu.x}px`,
                top: `${pu.y}px`,
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(251,191,36,0.3), rgba(251,191,36,0.1))',
                border: '2px solid rgba(251,191,36,0.6)',
                boxShadow: '0 0 15px rgba(251,191,36,0.4)',
              }}
            >
              <span className="text-lg">{pu.emoji}</span>
            </motion.button>
          ))}

          {/* Particles */}
          {particles.map(p => (
            <div
              key={p.id}
              className="absolute rounded-full pointer-events-none z-30"
              style={{
                left: `${p.x}px`,
                top: `${p.y}px`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                opacity: p.life / p.maxLife,
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>

        {/* ─── Bottom info ─── */}
        <div className="flex items-center justify-between w-full max-w-md mt-2 px-2">
          <span className="text-[10px] font-bold text-text-muted">
            {waveConfig.emoji} {waveConfig.label} · {questionsInWave}/6
          </span>
          <span className="text-[10px] font-bold text-text-muted">
            {accuracy}% chính xác
          </span>
        </div>
      </div>
    </GameShell>
  );
}
