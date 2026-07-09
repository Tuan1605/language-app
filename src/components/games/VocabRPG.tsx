import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../data/db';
import type { Flashcard } from '../../types';
import { useUserStore } from '../../stores/useUserStore';
import toast from 'react-hot-toast';
import { Swords, Zap, Flame, Skull, RotateCcw, Map as MapIcon, Heart, Tent, Eye } from 'lucide-react';
import { GameShell } from './GameShell';
import { GameLoading } from './GameLoading';
import { playCorrect, playWrong, playCombo, playGameOver, playVictory, playTap } from '../../utils/sound';
import { LevelSelector } from './LevelSelector';

import { PixiBattle } from './rpg/PixiBattle';
import type { ParticleEffect, DamagePopup } from './rpg/PixiBattle';

// ─── Utility ───
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const d: number[][] = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0));
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++)
    d[i][j] = a[i - 1] === b[j - 1] ? d[i - 1][j - 1] : 1 + Math.min(d[i - 1][j], d[i][j - 1], d[i - 1][j - 1]);
  return d[m][n];
}
function fuzzyMatch(guess: string, correct: string): 'exact' | 'close' | 'wrong' {
  if (guess === correct) return 'exact';
  const len = correct.length, dist = levenshtein(guess, correct);
  if (len <= 4) return 'wrong';
  if (len <= 8 && dist <= 1) return 'close';
  if (len > 8 && dist <= 2) return 'close';
  return 'wrong';
}

// ─── Game Data ───
interface HeroLevel { level: number; xpNeeded: number; atkBonus: number; hpBonus: number; skillUnlock?: SkillDef; title: string; }
const HERO_LEVELS: HeroLevel[] = [
  { level: 1, xpNeeded: 0, atkBonus: 0, hpBonus: 0, title: 'Tập Sự' },
  { level: 2, xpNeeded: 40, atkBonus: 15, hpBonus: 15, title: 'Phù Thủy', skillUnlock: { type: 'frost_bolt', name: 'Frost Bolt', emoji: '❄️', rageCost: 25, color: '#63B3ED', desc: 'Đóng băng quái 2 lượt', dmgMult: 0.5 } },
  { level: 3, xpNeeded: 100, atkBonus: 30, hpBonus: 30, title: 'Pháp Sư', skillUnlock: { type: 'fire_storm', name: 'Fire Storm', emoji: '🔥', rageCost: 45, color: '#F56565', desc: 'Thiêu đốt x2 DMG', dmgMult: 2 } },
  { level: 4, xpNeeded: 180, atkBonus: 50, hpBonus: 50, title: 'Đại Pháp Sư', skillUnlock: { type: 'holy_shield', name: 'Holy Shield', emoji: '🛡️', rageCost: 35, color: '#48BB78', desc: 'Chặn 2 đòn tấn công', dmgMult: 0 } },
  { level: 5, xpNeeded: 300, atkBonus: 75, hpBonus: 80, title: 'Tổng Phù Thủy', skillUnlock: { type: 'thunder_god', name: 'Thunder God', emoji: '⚡', rageCost: 70, color: '#FBBF24', desc: 'Sét thần x4 DMG + hồi 25% HP', dmgMult: 4 } },
  { level: 6, xpNeeded: 450, atkBonus: 100, hpBonus: 120, title: 'Huyền Thoại' },
];

type SkillTypeId = 'frost_bolt' | 'fire_storm' | 'holy_shield' | 'thunder_god';
interface SkillDef { type: SkillTypeId; name: string; emoji: string; rageCost: number; color: string; desc: string; dmgMult: number; }

interface Enemy { name: string; spriteUrl: string; hp: number; attack: number; isBoss: boolean; projectile: string; deathLine: string; introLine?: string; specialAbility?: string; specialEmoji?: string; }
const ENEMIES: Enemy[] = [
  { name: 'Slime', spriteUrl: 'https://robohash.org/slime?set=set2&size=150x150', hp: 40, attack: 5, isBoss: false, projectile: '💧', deathLine: 'Blub...' },
  { name: 'Bat', spriteUrl: 'https://robohash.org/bat?set=set2&size=150x150', hp: 55, attack: 7, isBoss: false, projectile: '🌀', deathLine: 'Screech!', specialAbility: 'dodge', specialEmoji: '💨' },
  { name: 'Goblin', spriteUrl: 'https://robohash.org/goblin?set=set2&size=150x150', hp: 70, attack: 9, isBoss: false, projectile: '🗡️', deathLine: 'Not fair!', specialAbility: 'rage', specialEmoji: '💢' },
  { name: 'Skeleton', spriteUrl: 'https://robohash.org/skeleton?set=set2&size=150x150', hp: 90, attack: 11, isBoss: false, projectile: '🦴', deathLine: 'My bones...!', specialAbility: 'poison', specialEmoji: '☠️' },
  { name: 'Dark Knight', spriteUrl: 'https://robohash.org/knight?set=set2&size=150x150', hp: 120, attack: 14, isBoss: false, projectile: '⚔️', deathLine: 'Impossible...', specialAbility: 'armor', specialEmoji: '🛡️' },
  { name: 'Demon Lord', spriteUrl: 'https://robohash.org/demon?set=set2&size=150x150', hp: 160, attack: 17, isBoss: false, projectile: '👁️', deathLine: 'This isn\'t over...', specialAbility: 'lifesteal', specialEmoji: '🩸' },
  { name: 'Dragon', spriteUrl: 'https://robohash.org/dragon?set=set2&size=200x200', hp: 220, attack: 20, isBoss: true, projectile: '🔥', deathLine: 'ROOAAARRR...', introLine: '"Ta là Ngọn Lửa Vĩnh Hằng!"' },
];


// ─── Map Data ───
type NodeType = 'battle' | 'elite' | 'camp' | 'boss';
interface MapNode { id: number; type: NodeType; enemyIndex?: number; }
const MAP_PATH: MapNode[] = [
  { id: 1, type: 'battle', enemyIndex: 0 },
  { id: 2, type: 'battle', enemyIndex: 1 },
  { id: 3, type: 'elite', enemyIndex: 2 },
  { id: 4, type: 'camp' },
  { id: 5, type: 'battle', enemyIndex: 3 },
  { id: 6, type: 'elite', enemyIndex: 4 },
  { id: 7, type: 'camp' },
  { id: 8, type: 'battle', enemyIndex: 5 },
  { id: 9, type: 'boss', enemyIndex: 6 },
];

// ─── Components ───


function RageBar({ current, max }: { current: number; max: number }) {
  const pct = Math.min(100, (current / max) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-0.5">
        <span className="text-[9px] font-black text-red uppercase">🔥 Rage</span>
        <span className="text-[9px] font-black text-text-muted">{current}/{max}</span>
      </div>
      <div className="w-full h-2 bg-gray-path rounded-full overflow-hidden">
        <motion.div className="h-full rounded-full" initial={false}
          animate={{ width: `${pct}%` }} transition={{ duration: 0.3 }}
          style={{ background: pct >= 100 ? 'linear-gradient(90deg, #F56565, #ED8936, #FBBF24)' : pct >= 60 ? 'linear-gradient(90deg, #F56565, #ED8936)' : '#F56565' }} />
      </div>
    </div>
  );
}



function HPBar({ current, max, label, color }: { current: number; max: number; label: string; color: string }) {
  const pct = Math.max(0, (current / max) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-0.5">
        <span className="text-[9px] md:text-[10px] font-black text-text-muted uppercase">{label}</span>
        <span className="text-[9px] md:text-[10px] font-black text-text-main">{Math.max(0, current)}/{max}</span>
      </div>
      <div className="relative w-full h-2 md:h-2.5 bg-gray-path rounded-full overflow-hidden">
        <motion.div className="absolute top-0 left-0 h-full rounded-full bg-white opacity-70"
          initial={false} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }} />
        <motion.div className="absolute top-0 left-0 h-full rounded-full"
          style={{ backgroundColor: color }} initial={false} animate={{ width: `${pct}%` }} transition={{ duration: 0.2 }} />
      </div>
    </div>
  );
}



// ─── Main Component ───
export function VocabRPG({ onComplete }: { onComplete: () => void; }) {
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [gameState, setGameState] = useState<'loading' | 'ready' | 'map' | 'battle' | 'camp' | 'level_up' | 'gameover' | 'victory'>('loading');
  const [campaignLevel, setCampaignLevel] = useState(1);
  
  // Turn-Based State
  const [turnTimeLimit, setTurnTimeLimit] = useState(15);
  const [timeLeft, setTimeLeft] = useState(15);
  const [showHint, setShowHint] = useState(false);
  const [frozenTurns, setFrozenTurns] = useState(0);

  // Map Progress
  const [currentNodeId, setCurrentNodeId] = useState(1);
  const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null);
  
  // Persistent Player Stats
  const [playerHp, setPlayerHp] = useState(100);
  const [playerMaxHp, setPlayerMaxHp] = useState(100);
  const [heroXp, setHeroXp] = useState(0);
  const [heroLevel, setHeroLevel] = useState(1);
  const [unlockedSkills, setUnlockedSkills] = useState<SkillDef[]>([]);
  const [rage, setRage] = useState(0);
  const [maxRage] = useState(100);
  
  // Score & Stats
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [enemiesDefeated, setEnemiesDefeated] = useState(0);
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [missedWords, setMissedWords] = useState<{ word: string; definition: string }[]>([]);
  
  // Battle Transient State
  const [enemyHp, setEnemyHp] = useState(0);
  const [shieldCharges, setShieldCharges] = useState(0);
  const [isPoisoned, setIsPoisoned] = useState(false);
  const [showAttackEffect, setShowAttackEffect] = useState<'player' | 'enemy' | null>(null);
  const [pixiEffects, setPixiEffects] = useState<ParticleEffect[]>([]);
  const [pixiPopups, setPixiPopups] = useState<DamagePopup[]>([]);
  const [inputValue, setInputValue] = useState('');
  
  // Misc
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState<HeroLevel | null>(null);

  const [showEnemyDeathLine, setShowEnemyDeathLine] = useState<string | null>(null);


  const activeTrack = useUserStore(s => s.activeTrack);
  const addExp = useUserStore(s => s.addExp);
  const updateGameProgress = useUserStore(s => s.updateGameProgress);
  const gameProgress = useUserStore(s => s.gameProgress);
  const currentProgress = gameProgress['vocab-rpg'] || { highScore: 0, maxLevel: 1 };
  
  const inputRef = useRef<HTMLInputElement>(null);


  // Refs for stale closure prevention
  const shieldChargesRef = useRef(shieldCharges); shieldChargesRef.current = shieldCharges;
  const frozenTurnsRef = useRef(frozenTurns); frozenTurnsRef.current = frozenTurns;
  const isPoisonedRef = useRef(isPoisoned); isPoisonedRef.current = isPoisoned;
  const currentEnemyRef = useRef(currentEnemy); currentEnemyRef.current = currentEnemy;
  const heroXpRef = useRef(heroXp); heroXpRef.current = heroXp;
  const heroLevelRef = useRef(heroLevel); heroLevelRef.current = heroLevel;
  const playerMaxHpRef = useRef(playerMaxHp); playerMaxHpRef.current = playerMaxHp;
  const playerAtkRef = useRef(0);
  const gameStateRef = useRef(gameState); gameStateRef.current = gameState;
  const timeLeftRef = useRef(timeLeft); timeLeftRef.current = timeLeft;

  const BASE_HP = 120;
  const BASE_ATK = 15;

  const heroLevelData = HERO_LEVELS.find(h => h.level === heroLevel) || HERO_LEVELS[0];
  const playerAtk = Math.round(BASE_ATK * (1 + heroLevelData.atkBonus / 100));
  playerAtkRef.current = playerAtk;

  const getCard = useCallback(() => deck.length === 0 ? null : deck[cardIndex % deck.length], [deck, cardIndex]);
  const currentCardRef = useRef(getCard()); currentCardRef.current = getCard();

  useEffect(() => { loadGame(); }, [activeTrack]);
  useEffect(() => { if (gameState === 'battle') inputRef.current?.focus(); }, [gameState, cardIndex]);

  // Save progress on game end
  useEffect(() => {
    if (gameState === 'gameover' || gameState === 'victory') {
      if (score > 0) {
        addExp(score);
        updateGameProgress('vocab-rpg', score, campaignLevel);
      }
    }
  }, [gameState]);

  // ─── Turn Timer Effect ───
  useEffect(() => {
    if (gameState !== 'battle' || !currentEnemy) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          executeEnemyTurn(true);
          return turnTimeLimit;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, currentEnemy, cardIndex]);

  const loadGame = async () => {
    try {
      const allCards = await db.cards.where('language').equals(activeTrack).toArray();
      if (allCards.length < 5) { toast.error('Not enough flashcards.'); onComplete(); return; }
      setDeck(allCards.sort(() => 0.5 - Math.random()));
      setGameState('ready');
    } catch (e) { console.error(e); toast.error('Failed to load'); }
  };

  const startGame = (level: number = 1) => {
    setCampaignLevel(level);
    const newTimer = Math.max(5, 15 - (level - 1) * 2);
    setTurnTimeLimit(newTimer);
    setTimeLeft(newTimer);
    
    setCardIndex(0); setScore(0); setCombo(0); setMaxCombo(0); setEnemiesDefeated(0);
    setHeroXp(0); setHeroLevel(1); setUnlockedSkills([]); setRage(0);
    setTotalAnswers(0); setCorrectAnswers(0); setMissedWords([]);
    setCurrentNodeId(1);
    
    setPlayerMaxHp(BASE_HP); setPlayerHp(BASE_HP);
    setGameState('map');
  };

  const enterNode = (node: MapNode) => {
    setCurrentNodeId(node.id);
    if (node.type === 'camp') {
      setGameState('camp');
    } else if (node.enemyIndex !== undefined) {
      const enemy = ENEMIES[node.enemyIndex];
      const isElite = node.type === 'elite';
      const campMult = 1 + (campaignLevel - 1) * 0.3; // +30% stats per campaign level
      const scaled = { 
        ...enemy, 
        hp: Math.round(enemy.hp * (isElite ? 1.5 : 1) * campMult), 
        attack: Math.round(enemy.attack * (isElite ? 1.3 : 1) * campMult) 
      };
      setCurrentEnemy(scaled);
      setEnemyHp(scaled.hp);
      setShowEnemyDeathLine(null);
      setFrozenTurns(0);
      setShieldCharges(0);
      setIsPoisoned(false);
      setTimeLeft(turnTimeLimit);
      setShowHint(false);
      setGameState('battle');
    }
  };

  const checkLevelUp = useCallback((newXp: number) => {
    let currentLvl = heroLevelRef.current;
    let nextLevelData = HERO_LEVELS.find(h => h.level === currentLvl + 1);

    while (nextLevelData && newXp >= nextLevelData.xpNeeded) {
      const nl = nextLevelData;
      setHeroLevel(nl.level);
      heroLevelRef.current = nl.level;
      const newMaxHp = BASE_HP + nl.hpBonus;
      setPlayerMaxHp(newMaxHp);
      setPlayerHp(prev => Math.min(newMaxHp, prev + nl.hpBonus));
      if (nl.skillUnlock) setUnlockedSkills(prev => [...prev, nl.skillUnlock!]);
      setLevelUpInfo(nl);
      setShowLevelUp(true);
      playVictory();
      setTimeout(() => setShowLevelUp(false), 2000);
      currentLvl = nl.level;
      nextLevelData = HERO_LEVELS.find(h => h.level === currentLvl + 1);
    }
  }, []);

  const castSkill = (skill: SkillDef) => {
    if (rage < skill.rageCost) { toast.error(`Cần ${skill.rageCost} Rage!`); return; }
    playTap();
    setRage(prev => prev - skill.rageCost);

    switch (skill.type) {
      case 'frost_bolt': {
        setFrozenTurns(2);
        toast.success('❄️ Đóng băng 2 lượt!');
        const dmg = Math.round(playerAtkRef.current * skill.dmgMult);
        setEnemyHp(prev => { const n = prev - dmg; if (n <= 0) handleEnemyDefeated(); return n; });
        dispatchPixiEffect('ice', 72, 40);
        dispatchPixiPopup(dmg, 72, 35, false, false);
        break;
      }
      case 'fire_storm': {
        const dmg = Math.round(playerAtkRef.current * skill.dmgMult);
        setEnemyHp(prev => { const n = prev - dmg; if (n <= 0) handleEnemyDefeated(); return n; });
        setShowAttackEffect('player');
        setTimeout(() => setShowAttackEffect(null), 400);
        toast.success(`🔥 Fire Storm! -${dmg} DMG!`);
        dispatchPixiEffect('fire', 72, 40);
        dispatchPixiPopup(dmg, 72, 35, true, false);
        break;
      }
      case 'holy_shield':
        setShieldCharges(2);
        toast.success('🛡️ Holy Shield! Chặn 2 đòn!');
        dispatchPixiEffect('shield', 25, 55);
        break;
      case 'thunder_god': {
        const dmg = Math.round(playerAtkRef.current * skill.dmgMult);
        setEnemyHp(prev => { const n = prev - dmg; if (n <= 0) handleEnemyDefeated(); return n; });
        const healAmt = Math.floor(playerMaxHpRef.current * 0.25);
        setPlayerHp(prev => Math.min(playerMaxHpRef.current, prev + healAmt));
        playVictory();
        toast.success(`⚡ Thunder God! -${dmg} DMG +${healAmt} HP!`);
        dispatchPixiEffect('thunder', 72, 40);
        dispatchPixiEffect('heal', 25, 55);
        dispatchPixiPopup(dmg, 72, 35, true, false);
        dispatchPixiPopup(healAmt, 25, 55, false, true);
        break;
      }
    }
    inputRef.current?.focus();
  };

  // ─── PixiJS Effects Dispatchers ───
  const pixiTimeoutRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const dispatchPixiEffect = useCallback((type: ParticleEffect['type'], x?: number, y?: number) => {
    const effect: ParticleEffect = { type, x: x ?? 50, y: y ?? 40, timestamp: Date.now() };
    setPixiEffects(prev => [...prev, effect]);
    const t = setTimeout(() => setPixiEffects(prev => prev.filter(e => e !== effect)), 800);
    pixiTimeoutRef.current.push(t);
  }, []);

  const dispatchPixiPopup = useCallback((value: number, x: number, y: number, isCrit: boolean, isHeal: boolean) => {
    const popup: DamagePopup = { value, x, y, isCrit, isHeal, timestamp: Date.now() };
    setPixiPopups(prev => [...prev, popup]);
    const t = setTimeout(() => setPixiPopups(prev => prev.filter(p => p !== popup)), 1200);
    pixiTimeoutRef.current.push(t);
  }, []);

  // Cleanup pixi timeouts
  useEffect(() => {
    return () => { pixiTimeoutRef.current.forEach(t => clearTimeout(t)); };
  }, []);

  // ─── Turn Resolution ───
  const advanceTurn = () => {
    setInputValue('');
    setShowHint(false);
    setTimeLeft(turnTimeLimit);
    setCardIndex(i => i + 1);
    
    // Poison tick on new turn
    if (isPoisonedRef.current) {
      toast('☠️ Bị trúng độc! -3 HP', { icon: '☠️' });
      dispatchPixiPopup(3, 25, 55, false, false);
      setPlayerHp(prev => {
        const next = prev - 3;
        if (next <= 0) { playGameOver(); setGameState('gameover'); }
        return next;
      });
    }
  };

  const executeEnemyTurn = (isTimeout: boolean = false) => {
    if (gameStateRef.current !== 'battle' || !currentEnemyRef.current) return;
    const card = currentCardRef.current;
    
    if (isTimeout) {
      toast.error(`Hết giờ! Đáp án: ${card?.word}`);
      setCombo(0);
      setMissedWords(prev => { if (prev.find(m => m.word === card?.word)) return prev; return [...prev, { word: card!.word, definition: card!.definition }]; });
    }

    const enemy = currentEnemyRef.current;
    if (frozenTurnsRef.current > 0) {
      toast.success(`❄️ Quái bị đóng băng! (${frozenTurnsRef.current} lượt)`);
      setFrozenTurns(prev => prev - 1);
      advanceTurn();
      return;
    }

    // Shield check
    if (shieldChargesRef.current > 0) {
      setShieldCharges(prev => prev - 1);
      playTap();
      dispatchPixiPopup(0, 25, 55, false, false); // Shield blocked
      setShowAttackEffect('enemy');
      setTimeout(() => setShowAttackEffect(null), 300);
      advanceTurn();
      return;
    }

    // Attack
    const dmg = enemy.attack;
    setPlayerHp(prev => {
      const next = prev - dmg;
      if (next <= 0) { playGameOver(); setGameState('gameover'); }
      return next;
    });
    setRage(prev => Math.min(100, prev + 8));
    setShowAttackEffect('enemy');
    dispatchPixiPopup(dmg, 25, 55, false, false);
    setTimeout(() => setShowAttackEffect(null), 400);

    // Abilities
    if (enemy.specialAbility === 'poison' && Math.random() < 0.3 && !isPoisonedRef.current) {
      setIsPoisoned(true);
      toast('☠️ Đã bị trúng độc!', { icon: '☠️' });
    }

    setTimeout(advanceTurn, 600); // Small delay to let animation play before next turn starts
  };

  const handleHint = () => {
    if (showHint) return;
    if (rage >= 25) {
      setRage(prev => prev - 25);
      toast.success('Dùng 25 Nộ để mở gợi ý!');
      setShowHint(true);
    } else if (playerHp > 15) {
      setPlayerHp(prev => prev - 15);
      toast('🩸 Ma pháp huyết! -15 HP để mở gợi ý!', { icon: '🩸' });
      dispatchPixiPopup(15, 25, 55, false, false); // Show as damage
      setShowHint(true);
    } else {
      toast.error('Không đủ Nộ hoặc HP để dùng gợi ý!');
    }
    inputRef.current?.focus();
  };

  const handleEnemyDefeated = () => {
    if (!currentEnemy) return;
    const newDefeated = enemiesDefeated + 1;
    setEnemiesDefeated(newDefeated);
    setShowEnemyDeathLine(currentEnemy.deathLine);
    
    const currentNode = MAP_PATH.find(n => n.id === currentNodeId);
    const isElite = currentNode?.type === 'elite';
    const isBoss = currentNode?.type === 'boss';
    
    setScore(s => s + (isBoss ? 80 : isElite ? 45 : 25));

    const killXp = isBoss ? 60 : isElite ? 35 : 15;
    const newXp = heroXpRef.current + killXp;
    setHeroXp(newXp);
    checkLevelUp(newXp);

    if (isBoss) {
      updateGameProgress('vocab-rpg', score + 100, campaignLevel + 1);
      setTimeout(() => { playVictory(); setGameState('victory'); }, 1200);
    } else {
      setTimeout(() => {
        setGameState('map');
        setCurrentNodeId(currentNodeId + 1);
      }, 1500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameState !== 'battle' || !currentEnemy) return;
    const card = getCard();
    if (!card) return;

    const guess = inputValue.trim().toLowerCase();
    const correct = card.word.toLowerCase();
    const result = fuzzyMatch(guess, correct);
    setTotalAnswers(prev => prev + 1);

    if (result !== 'wrong') {
      // ─── PLAYER TURN (Correct) ───
      setCorrectAnswers(prev => prev + 1);
      const newCombo = combo + 1;
      if (newCombo > maxCombo) setMaxCombo(newCombo);

      let totalDmg = playerAtkRef.current + Math.floor(playerAtkRef.current * 0.25 * Math.min(newCombo, 10));
      const isCrit = newCombo >= 5;
      if (result === 'close') { totalDmg = Math.floor(totalDmg * 0.7); toast.success(`Close! ✓ (${card.word})`); }

      if (currentEnemy.specialAbility === 'dodge' && Math.random() < 0.15) {
        toast('💨 Dodge! Enemy evaded!', { icon: '💨' });
        dispatchPixiPopup(0, 72, 35, false, false); // Miss
      } else if (currentEnemy.specialAbility === 'armor') {
        totalDmg = Math.floor(totalDmg * 0.6);
      }

      if (currentEnemy.specialAbility === 'lifesteal') {
        const healAmt = Math.floor(totalDmg * 0.2);
        setEnemyHp(prev => Math.min(currentEnemy.hp, prev + healAmt));
        toast(`🩸 Lifesteal! +${healAmt} HP`, { icon: '🩸' });
      }

      playCorrect();
      if (newCombo >= 3) playCombo(newCombo);

      setEnemyHp(prev => { const n = prev - totalDmg; if (n <= 0) handleEnemyDefeated(); return n; });
      dispatchPixiEffect(isCrit ? 'crit' : 'fire', 72, 40);
      dispatchPixiPopup(totalDmg, 72, 35, isCrit, false);

      setShowAttackEffect('player');
      setTimeout(() => setShowAttackEffect(null), 400);

      const rageGain = 12 + (newCombo >= 5 ? 5 : newCombo >= 3 ? 3 : 0);
      setRage(prev => Math.min(maxRage, prev + rageGain));

      const xpGain = result === 'exact' ? 10 : 6;
      const newXp = heroXpRef.current + xpGain;
      setHeroXp(newXp);
      checkLevelUp(newXp);

      setCombo(newCombo); setScore(s => s + totalDmg); 
      
      // Advance immediately
      advanceTurn();

    } else {
      // ─── ENEMY TURN (Wrong) ───
      playWrong(); setCombo(0); setRage(prev => Math.max(0, prev - 10));
      setMissedWords(prev => { if (prev.find(m => m.word === card.word)) return prev; return [...prev, { word: card.word, definition: card.definition }]; });
      toast.error(`✗ Sai! Đáp án: ${card.word}`);
      
      executeEnemyTurn(false);
    }
  };

  const handleCampRest = () => {
    playVictory();
    const healAmt = Math.floor(playerMaxHp * 0.4);
    setPlayerHp(prev => Math.min(playerMaxHp, prev + healAmt));
    toast.success(`⛺ Rested! +${healAmt} HP`);
    setTimeout(() => {
      setCurrentNodeId(currentNodeId + 1);
      setGameState('map');
    }, 1500);
  };

  const handleCampTrain = () => {
    playTap();
    const trainXp = 50;
    toast.success(`⚔️ Trained! +${trainXp} XP`);
    const newXp = heroXpRef.current + trainXp;
    setHeroXp(newXp);
    checkLevelUp(newXp);
    setTimeout(() => {
      setCurrentNodeId(currentNodeId + 1);
      setGameState('map');
    }, 1500);
  };



  const card = getCard();
  const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;
  
  // Create hint text e.g., A P _ _ _
  const hintText = card ? card.word.split('').map((char, i) => (i < Math.max(2, Math.ceil(card.word.length / 3)) || char === ' ' ? char : '_')).join(' ') : '';

  if (gameState === 'loading') return <GameLoading text="Loading map..." />;

  // ─── Ready Screen ───
  if (gameState === 'ready') return (
    <GameShell title="Vocab RPG" icon={<Swords className="w-5 h-5" />} onBack={onComplete}>
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center w-full">
          <h2 className="text-2xl font-black text-text-main mb-2">Vocab RPG</h2>
          <p className="text-sm font-bold text-text-muted mb-6">Đánh bại quái vật bằng sức mạnh từ vựng!</p>
          <LevelSelector maxLevel={currentProgress.maxLevel} highScore={currentProgress.highScore} onSelect={startGame} />
        </motion.div>
      </div>
    </GameShell>
  );

  // ─── MAP NAVIGATION ───
  if (gameState === 'map') {
    return (
      <GameShell title="World Map" icon={<MapIcon className="w-5 h-5" />} onBack={onComplete}>
        <div className="flex-1 flex flex-col p-2">
          {/* Hero HUD on Map */}
          <div className="flex items-center gap-3 mb-6 p-3 bg-bg-card rounded-xl border-2 border-gray-path/60">
            <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=transparent" alt="Hero" className="w-12 h-12 rounded-full bg-blue/10 border-2 border-blue/30" />
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-black text-text-main">Lv.{heroLevel} {heroLevelData.title}</p>
                <p className="text-xs font-black text-blue">{score} pts</p>
              </div>
              <HPBar current={playerHp} max={playerMaxHp} label="HP" color="var(--green)" />
            </div>
          </div>

          <h3 className="text-lg font-black text-text-main mb-4 text-center">Chọn Cửa Ải</h3>
          
          <div className="flex-1 relative max-w-sm w-full mx-auto flex flex-col items-center justify-start overflow-y-auto custom-scrollbar py-4 space-y-6">
            {/* Draw lines behind nodes */}
            <div className="absolute top-8 bottom-8 left-1/2 -translate-x-1/2 w-1.5 bg-gray-path/50 rounded-full z-0" />
            
            {MAP_PATH.map((node) => {
              const isPast = node.id < currentNodeId;
              const isCurrent = node.id === currentNodeId;
              
              let nodeColor = 'bg-gray-path/40 text-text-muted border-gray-path';
              let nodeIcon = '⚔️';
              let nodeLabel = 'Battle';
              
              if (node.type === 'elite') { nodeIcon = '💀'; nodeLabel = 'Elite'; }
              else if (node.type === 'camp') { nodeIcon = '⛺'; nodeLabel = 'Camp'; }
              else if (node.type === 'boss') { nodeIcon = '🐉'; nodeLabel = 'Boss'; }

              if (isPast) nodeColor = 'bg-green/20 text-green border-green/50';
              if (isCurrent) nodeColor = node.type === 'boss' ? 'bg-red text-white border-red animate-pulse shadow-[0_0_15px_rgba(245,101,101,0.5)]' : 'bg-blue text-white border-blue shadow-[0_0_15px_rgba(66,153,225,0.4)] scale-110';

              return (
                <div key={node.id} className="relative z-10 flex items-center justify-center group">
                  <motion.button 
                    initial={isCurrent ? { scale: 0.8, opacity: 0 } : false}
                    animate={isCurrent ? { scale: 1.1, opacity: 1 } : { scale: 1, opacity: 1 }}
                    onClick={() => isCurrent && enterNode(node)}
                    disabled={!isCurrent}
                    className={`relative w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl transition-all ${nodeColor} ${isCurrent ? 'cursor-pointer hover:scale-125' : 'cursor-not-allowed opacity-60'}`}>
                    {isPast ? '✓' : nodeIcon}
                    
                    {isCurrent && (
                      <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute -inset-2 rounded-full border-2 border-current" />
                    )}
                  </motion.button>
                  
                  {/* Label */}
                  <div className="absolute left-20 w-24 text-left">
                    <p className={`text-xs font-black uppercase ${isCurrent ? 'text-text-main' : 'text-text-muted'}`}>{nodeLabel}</p>
                    {isCurrent && node.type === 'elite' && <p className="text-[9px] text-red font-bold">Hard Battle!</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </GameShell>
    );
  }

  // ─── CAMPFIRE ───
  if (gameState === 'camp') {
    return (
      <GameShell title="Campfire" icon={<Tent className="w-5 h-5" />} onBack={onComplete}>
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <motion.div animate={{ scale: [1, 1.05, 1], filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)'] }} transition={{ duration: 2, repeat: Infinity }}
            className="text-8xl mb-8">⛺</motion.div>
          <h2 className="text-2xl font-black text-text-main mb-2">Trạm Nghỉ Ngơi</h2>
          <p className="text-sm text-text-muted font-bold mb-8 text-center">Một đống lửa ấm áp... Bạn muốn làm gì?</p>
          
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <button onClick={handleCampRest} className="btn-duo btn-green px-6 py-4 flex flex-col items-center gap-1">
              <span className="flex items-center gap-2 text-lg font-black"><Heart className="w-5 h-5" /> Nghỉ Ngơi</span>
              <span className="text-xs font-bold opacity-80">Hồi 40% HP</span>
            </button>
            <button onClick={handleCampTrain} className="btn-duo btn-blue px-6 py-4 flex flex-col items-center gap-1">
              <span className="flex items-center gap-2 text-lg font-black"><Swords className="w-5 h-5" /> Luyện Tập</span>
              <span className="text-xs font-bold opacity-80">Nhận 50 XP</span>
            </button>
          </div>
        </div>
      </GameShell>
    );
  }

  // ─── GAME OVER / VICTORY ───
  if (gameState === 'gameover' || gameState === 'victory') {
    const isWin = gameState === 'victory';
    return (
      <GameShell title="Vocab RPG" icon={<Swords className="w-5 h-5" />} onBack={onComplete}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center p-6 bg-bg-main relative overflow-y-auto custom-scrollbar">
          <motion.div initial={{ scale: 0, rotate: isWin ? -20 : 0 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', delay: 0.2 }}
            className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-3 ${isWin ? 'bg-gold/10 shadow-[0_0_40px_rgba(237,137,54,0.2)]' : 'bg-red/10'}`}>
            {isWin ? <Swords className="w-8 h-8 md:w-10 md:h-10 text-gold" /> : <Skull className="w-8 h-8 md:w-10 md:h-10 text-red" />}
          </motion.div>
          <h2 className="text-xl md:text-2xl font-black text-text-main mb-0.5">{isWin ? 'Victory!' : 'Defeated!'}</h2>
          <p className="text-xs text-text-muted font-bold mb-0.5">Lv.{heroLevel} {heroLevelData.title}</p>
          {isWin && <p className="text-base font-black text-gold mb-2">+{score} EXP</p>}
          <div className="grid grid-cols-4 gap-2 mb-3 w-full max-w-xs">
            {[{ v: score, l: 'Score', c: 'text-blue' }, { v: `${accuracy}%`, l: 'Accuracy', c: 'text-green' }, { v: `x${maxCombo}`, l: 'Combo', c: 'text-gold' }, { v: `${enemiesDefeated}`, l: 'Kills', c: 'text-red' }]
              .map((s, i) => (
              <div key={i} className="text-center p-1.5 bg-bg-hover rounded-xl">
                <p className={`text-sm font-black ${s.c}`}>{s.v}</p>
                <p className="text-[8px] font-bold text-text-muted uppercase">{s.l}</p>
              </div>
            ))}
          </div>
          {missedWords.length > 0 && (
            <div className="w-full max-w-xs mb-3">
              <p className={`text-[9px] font-black uppercase tracking-wider mb-1.5 text-center ${isWin ? 'text-gold' : 'text-red'}`}>📖 Từ Cần Ôn</p>
              <div className="space-y-1 max-h-24 overflow-y-auto custom-scrollbar">
                {missedWords.map((w, i) => (
                  <div key={i} className={`flex justify-between px-2.5 py-1 border rounded-lg text-[11px] ${isWin ? 'bg-gold/5 border-gold/10' : 'bg-red/5 border-red/10'}`}>
                    <span className="font-black text-text-main">{w.word}</span>
                    <span className="text-text-muted truncate ml-2 text-right">{w.definition}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Buttons */}
          <div className="flex gap-4">
            <button onClick={() => startGame(campaignLevel)} className="btn-duo btn-blue px-6 py-3 text-sm">
              <RotateCcw className="w-4 h-4 mr-2" /> Chơi Lại {campaignLevel}
            </button>
            <button
              onClick={onComplete}
              className="btn-duo btn-outline px-4 py-2 text-xs">Menu</button>
          </div>
        </motion.div>
      </GameShell>
    );
  }

  // ─── BATTLE ───
  if (gameState === 'battle' && currentEnemy) {
    const timePct = (timeLeft / turnTimeLimit) * 100;
    
    return (
      <GameShell title="Vocab RPG" icon={<Swords className="w-5 h-5" />} onBack={onComplete}>
        <div className="flex-1 flex flex-col bg-bg-main relative overflow-hidden">
          {/* HUD Row 1 */}
          <div className="flex justify-between items-center mb-1.5 px-1">
            <div className="flex items-center gap-2">
              <div className="px-2.5 py-1 bg-blue/10 rounded-xl font-black text-base md:text-lg text-blue">{score}</div>
              {combo >= 2 && (
                <motion.div key={combo} initial={{ scale: 0.5 }} animate={{ scale: 1 }}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-black text-[10px] ${
                    combo >= 10 ? 'bg-gold/30 text-gold animate-combo-glow' : combo >= 5 ? 'bg-gold/25 text-gold animate-combo-glow' : combo >= 3 ? 'bg-gold/15 text-gold' : 'bg-gray-bg text-text-muted'
                  }`}><Zap className={`w-2.5 h-2.5 ${combo >= 3 ? 'fill-gold' : ''}`} />x{combo}</motion.div>
              )}
            </div>
            <div className="text-right flex flex-col items-end">
              <div className="px-2.5 py-0.5 bg-purple/10 border border-purple/20 text-purple font-black text-[10px] rounded-full mb-0.5 uppercase tracking-wider">
                Stage {currentNodeId}/{MAP_PATH.length}
              </div>
              <p className="text-[8px] text-text-muted">ATK: {playerAtk} · {accuracy}%</p>
            </div>
          </div>

          {/* Rage bar */}
          <div className="px-1 mb-2">
            <RageBar current={rage} max={maxRage} />
          </div>

          {/* Level Up Overlay */}
          <AnimatePresence>
            {showLevelUp && levelUpInfo && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-gold/95 text-white px-4 py-2.5 rounded-2xl shadow-lg text-center">
                <p className="text-xs font-black uppercase">⬆️ Level Up!</p>
                <p className="text-sm font-black">Lv.{levelUpInfo.level} {levelUpInfo.title}</p>
                {levelUpInfo.skillUnlock && (
                  <p className="text-[10px] mt-0.5">New: {levelUpInfo.skillUnlock.emoji} {levelUpInfo.skillUnlock.name}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Battle Area - PixiJS Canvas */}
          <div className="flex-1 relative rounded-2xl border-2 border-gray-path/60 bg-bg-card mb-2 overflow-hidden"
            style={{ minHeight: '280px' }}>
            <PixiBattle
              width={600}
              height={280}
              player={{
                name: `${heroLevel} ${heroLevelData.title}`,
                hp: playerHp,
                maxHp: playerMaxHp,
                x: 25,
                y: 55,
                state: showAttackEffect === 'player' ? 'attack' : showAttackEffect === 'enemy' ? 'hurt' : 'idle',
                isPlayer: true,
              }}
              enemy={{
                name: currentEnemy.name,
                hp: enemyHp,
                maxHp: currentEnemy.hp,
                x: 72,
                y: 40,
                state: showAttackEffect === 'player' ? 'hurt' : 'idle',
                isPlayer: false,
                scale: currentEnemy.isBoss ? 1.2 : 1,
              }}
              effects={pixiEffects}
              damagePopups={pixiPopups}
              combo={combo}
            />

            {/* Overlay: Enemy info */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
              {currentEnemy.introLine && enemyHp === currentEnemy.hp && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9px] italic text-gold font-bold bg-bg-main/80 px-2 py-0.5 rounded">{currentEnemy.introLine}</motion.p>
              )}
              {showEnemyDeathLine && enemyHp <= 0 && (
                <motion.p initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-[9px] italic text-red font-bold bg-bg-main/80 px-2 py-0.5 rounded">"{showEnemyDeathLine}"</motion.p>
              )}
            </div>

            {/* Overlay: Enemy status */}
            <div className="absolute bottom-2 right-2 z-20 text-right pointer-events-none">
              {currentEnemy.isBoss && <span className="px-1.5 py-0 bg-red/10 border border-red/20 rounded-full text-[7px] font-black text-red uppercase">Boss</span>}
              {frozenTurns > 0 && <p className="text-[9px] text-blue font-black">❄️ Frozen ({frozenTurns})</p>}
            </div>

            {/* Overlay: Player shield */}
            {shieldCharges > 0 && (
              <div className="absolute bottom-2 left-2 z-20 pointer-events-none">
                <p className="text-[9px] text-green font-black">🛡️ Shield x{shieldCharges}</p>
              </div>
            )}
          </div>

          {/* Skill Bar */}
          {unlockedSkills.length > 0 && (
            <div className="flex gap-1.5 mb-1.5 justify-center px-1">
              {unlockedSkills.map(skill => {
                const canUse = rage >= skill.rageCost;
                return (
                  <button key={skill.type} onClick={() => castSkill(skill)} disabled={!canUse} title={skill.desc}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-black text-[10px] border-2 transition-all ${
                      canUse ? 'text-white border-white/20 cursor-pointer shadow-sm hover:scale-105' : 'bg-gray-bg text-text-muted border-gray-path/30 opacity-60 cursor-not-allowed'
                    }`}
                    style={canUse ? { backgroundColor: skill.color } : {}}>
                    <span className="text-sm">{skill.emoji}</span>
                    <span className="hidden md:inline">{skill.name}</span>
                    <span className="text-[8px] opacity-75">({skill.rageCost})</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Spell Area (Turn-Based) */}
          <div className="bg-bg-card rounded-xl border-2 border-gray-path/60 p-2.5 md:p-3 relative overflow-hidden">
            {/* Timer Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-path/30">
              <motion.div className="h-full" animate={{ width: `${timePct}%`, backgroundColor: timePct < 30 ? '#F56565' : '#48BB78' }} transition={{ duration: 1, ease: 'linear' }} />
            </div>

            <div className="flex justify-between items-start mb-2 relative z-10 pt-1">
              <p className="text-[9px] md:text-[10px] font-bold text-text-muted uppercase tracking-wider">
                {currentEnemy.isBoss ? '🔥 Ultimate Spell!' : '✨ Cast a spell!'}
              </p>
              <button onClick={handleHint} disabled={showHint} className="flex items-center gap-1 text-[9px] font-black uppercase text-gold bg-gold/10 px-2 py-0.5 rounded-lg border border-gold/20 hover:bg-gold/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <Eye className="w-3 h-3" /> Gợi ý (25 Nộ)
              </button>
            </div>
            
            <p className="text-sm md:text-base font-bold text-text-main text-center mb-1 leading-relaxed relative z-10">{card?.definition}</p>
            
            <AnimatePresence>
              {showHint && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-black text-gold text-center mb-2 tracking-[0.2em] uppercase">
                  {hintText}
                </motion.p>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="flex gap-2 relative z-10 mt-2">
              <input ref={inputRef} type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type the word..."
                className="flex-1 bg-bg-hover border-2 border-gray-path/60 rounded-xl px-3 py-2 md:py-2.5 font-bold text-sm text-text-main focus:outline-none focus:border-blue/60 transition-all text-center placeholder:text-text-muted/50"
                autoComplete="off" spellCheck={false} />
              <button type="submit" className="btn-duo btn-blue px-3 py-2 md:px-5 md:py-2.5 text-xs shrink-0">
                <Flame className="w-3.5 h-3.5 mr-1" />Cast
              </button>
            </form>
          </div>
        </div>
      </GameShell>
    );
  }

  return null;
}
