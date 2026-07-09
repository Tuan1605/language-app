import { motion } from 'framer-motion';

export type CharacterState = 'idle' | 'attack' | 'hurt' | 'dead';

interface CharacterProps {
  state: CharacterState;
  size?: number;
  freeze?: boolean;
  poisoned?: boolean;
  shielded?: boolean;
}

// ─── Wizard (Player) ───
export function WizardCharacter({ state, size = 120 }: CharacterProps) {
  const s = size / 120; // scale factor

  return (
    <motion.svg width={size} height={size} viewBox="0 0 120 120" overflow="visible">
      {/* Shadow */}
      <ellipse cx="60" cy="112" rx="22" ry="5" fill="rgba(0,0,0,0.15)" />

      {/* Body group */}
      <motion.g
        animate={
          state === 'attack' ? { y: [0, -12, 0], x: [0, 5, 0] } :
          state === 'hurt' ? { x: [0, -6, 6, -4, 4, 0] } :
          state === 'dead' ? { y: [0, 20], opacity: [1, 0], rotate: [0, 15] } :
          { y: [0, -3, 0] }
        }
        transition={
          state === 'idle' ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } :
          state === 'attack' ? { duration: 0.4 } :
          state === 'hurt' ? { duration: 0.3 } :
          { duration: 0.6 }
        }
      >
        {/* Robe */}
        <path d="M40 65 L35 105 Q60 112 85 105 L80 65 Z" fill="#4A90E2" stroke="#357ABD" strokeWidth="1.5" />
        <path d="M40 65 L35 105 Q60 112 85 105 L80 65" fill="none" stroke="#357ABD" strokeWidth="1" />

        {/* Robe detail - belt */}
        <rect x="42" y="72" width="36" height="4" rx="2" fill="#ED8936" />

        {/* Robe detail - stars */}
        <circle cx="50" cy="85" r="1.5" fill="#FBBF24" opacity="0.7" />
        <circle cx="65" cy="90" r="1" fill="#FBBF24" opacity="0.5" />
        <circle cx="55" cy="95" r="1.2" fill="#FBBF24" opacity="0.6" />

        {/* Arms */}
        <motion.g
          animate={state === 'attack' ? { rotate: [0, -30, 0] } : { rotate: 0 }}
          transition={{ duration: 0.4 }}
          style={{ transformOrigin: '75px 65px' }}
        >
          {/* Right arm (staff arm) */}
          <path d="M75 65 Q85 60 90 50" stroke="#E8B88A" strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* Staff */}
          <line x1="88" y1="25" x2="92" y2="55" stroke="#8B6914" strokeWidth="3" strokeLinecap="round" />
          {/* Staff orb */}
          <motion.circle
            cx="87" cy="22" r="6"
            fill="url(#orbGradient)"
            animate={state === 'attack' ? { r: [6, 10, 6], opacity: [1, 0.8, 1] } : { r: [5.5, 6.5, 5.5] }}
            transition={state === 'attack' ? { duration: 0.3 } : { duration: 1.5, repeat: Infinity }}
          />
          <circle cx="87" cy="22" r="3" fill="white" opacity="0.6" />
        </motion.g>

        {/* Left arm */}
        <path d="M45 65 Q35 60 32 55" stroke="#E8B88A" strokeWidth="4" fill="none" strokeLinecap="round" />

        {/* Head */}
        <circle cx="60" cy="48" r="16" fill="#E8B88A" />

        {/* Hat */}
        <path d="M40 42 L60 8 L80 42 Z" fill="#4A90E2" stroke="#357ABD" strokeWidth="1" />
        <ellipse cx="60" cy="42" rx="22" ry="6" fill="#4A90E2" stroke="#357ABD" strokeWidth="1" />
        {/* Hat star */}
        <motion.polygon
          points="60,15 62,20 67,20 63,23 65,28 60,25 55,28 57,23 53,20 58,20"
          fill="#FBBF24"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Face */}
        <circle cx="54" cy="46" r="2" fill="#2D3748" />
        <circle cx="66" cy="46" r="2" fill="#2D3748" />
        <circle cx="54" cy="45.5" r="0.8" fill="white" />
        <circle cx="66" cy="45.5" r="0.8" fill="white" />

        {/* Beard */}
        <path d="M52 54 Q60 62 68 54" stroke="#A0AEC0" strokeWidth="2" fill="none" strokeLinecap="round" />
      </motion.g>

      {/* Shield glow */}
      {state === 'idle' && (
        <motion.circle
          cx="60" cy="60" r="45"
          fill="none" stroke="#48BB78" strokeWidth="2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0.3, 0], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <defs>
        <radialGradient id="orbGradient" cx="40%" cy="40%">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="50%" stopColor="#63B3ED" />
          <stop offset="100%" stopColor="#3182CE" />
        </radialGradient>
      </defs>
    </motion.svg>
  );
}

// ─── Slime ───
export function SlimeCharacter({ state, size = 100 }: CharacterProps) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 100 100" overflow="visible">
      <ellipse cx="50" cy="90" rx="25" ry="5" fill="rgba(0,0,0,0.12)" />

      <motion.g
        animate={
          state === 'attack' ? { y: [0, -15, 0], scaleX: [1, 1.2, 1] } :
          state === 'hurt' ? { x: [0, -5, 5, -3, 3, 0] } :
          state === 'dead' ? { y: [0, 30], opacity: [1, 0], scaleY: [1, 0.3] } :
          { scaleY: [1, 0.85, 1], scaleX: [1, 1.1, 1] }
        }
        transition={
          state === 'idle' ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } :
          { duration: 0.4 }
        }
        style={{ transformOrigin: '50px 80px' }}
      >
        {/* Body */}
        <ellipse cx="50" cy="65" rx="30" ry="25" fill="#48BB78" />
        <ellipse cx="50" cy="65" rx="30" ry="25" fill="url(#slimeGrad)" />

        {/* Highlight */}
        <ellipse cx="42" cy="55" rx="10" ry="7" fill="white" opacity="0.25" transform="rotate(-15 42 55)" />

        {/* Eyes */}
        <ellipse cx="40" cy="58" rx="5" ry="6" fill="white" />
        <ellipse cx="60" cy="58" rx="5" ry="6" fill="white" />
        <motion.circle cx="41" cy="59" r="3" fill="#1A202C"
          animate={state === 'hurt' ? { cy: [59, 61, 59] } : {}}
          transition={{ duration: 0.2 }}
        />
        <motion.circle cx="61" cy="59" r="3" fill="#1A202C"
          animate={state === 'hurt' ? { cy: [59, 61, 59] } : {}}
          transition={{ duration: 0.2 }}
        />
        <circle cx="40" cy="57" r="1.2" fill="white" />
        <circle cx="60" cy="57" r="1.2" fill="white" />

        {/* Mouth */}
        <motion.path
          d={state === 'hurt' ? "M42 70 Q50 65 58 70" : "M42 68 Q50 74 58 68"}
          stroke="#2F855A" strokeWidth="1.5" fill="none" strokeLinecap="round"
        />

        {/* Drool */}
        <motion.ellipse cx="55" cy="73" rx="2" ry="3" fill="#38A169" opacity="0.6"
          animate={{ ry: [3, 4, 3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.g>

      <defs>
        <radialGradient id="slimeGrad" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#68D391" />
          <stop offset="100%" stopColor="#38A169" />
        </radialGradient>
      </defs>
    </motion.svg>
  );
}

// ─── Bat ───
export function BatCharacter({ state, size = 100 }: CharacterProps) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 120 100" overflow="visible">
      <ellipse cx="60" cy="92" rx="18" ry="4" fill="rgba(0,0,0,0.1)" />

      <motion.g
        animate={
          state === 'attack' ? { x: [0, 20, 0], y: [0, -10, 0] } :
          state === 'hurt' ? { x: [0, -8, 8, -5, 5, 0] } :
          state === 'dead' ? { y: [0, 40], opacity: [1, 0], rotate: [0, 30] } :
          { y: [0, -5, 0] }
        }
        transition={
          state === 'idle' ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } :
          { duration: 0.4 }
        }
      >
        {/* Wings */}
        <motion.g
          animate={state === 'idle' ? { rotate: [0, -8, 0, 8, 0] } : state === 'attack' ? { rotate: [0, -15, 15, 0] } : {}}
          transition={{ duration: 0.6, repeat: state === 'idle' ? Infinity : 0 }}
          style={{ transformOrigin: '60px 55px' }}
        >
          {/* Left wing */}
          <path d="M45 50 Q20 30 10 50 Q20 45 25 55 Q15 50 8 65 Q25 55 35 60 Z" fill="#6B46C1" stroke="#553C9A" strokeWidth="0.8" />
          {/* Right wing */}
          <path d="M75 50 Q100 30 110 50 Q100 45 95 55 Q105 50 112 65 Q95 55 85 60 Z" fill="#6B46C1" stroke="#553C9A" strokeWidth="0.8" />
        </motion.g>

        {/* Body */}
        <ellipse cx="60" cy="60" rx="16" ry="18" fill="#553C9A" />
        <ellipse cx="60" cy="58" rx="12" ry="10" fill="#6B46C1" />

        {/* Ears */}
        <polygon points="48,42 44,28 54,40" fill="#553C9A" />
        <polygon points="72,42 76,28 66,40" fill="#553C9A" />

        {/* Eyes */}
        <motion.g
          animate={state === 'hurt' ? { scaleY: [1, 0.3, 1] } : {}}
          transition={{ duration: 0.2 }}
          style={{ transformOrigin: '60px 52px' }}
        >
          <ellipse cx="53" cy="52" rx="4" ry="4.5" fill="#F56565" />
          <ellipse cx="67" cy="52" rx="4" ry="4.5" fill="#F56565" />
          <circle cx="53" cy="51" r="1.5" fill="#FED7D7" />
          <circle cx="67" cy="51" r="1.5" fill="#FED7D7" />
        </motion.g>

        {/* Fangs */}
        <polygon points="55,62 53,68 57,65" fill="white" />
        <polygon points="65,62 67,68 63,65" fill="white" />

        {/* Mouth */}
        <path d="M54 62 Q60 66 66 62" stroke="#2D1B69" strokeWidth="1" fill="none" />
      </motion.g>
    </motion.svg>
  );
}

// ─── Goblin ───
export function GoblinCharacter({ state, size = 100 }: CharacterProps) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 100 110" overflow="visible">
      <ellipse cx="50" cy="105" rx="18" ry="4" fill="rgba(0,0,0,0.12)" />

      <motion.g
        animate={
          state === 'attack' ? { x: [0, 10, 0], rotate: [0, -10, 0] } :
          state === 'hurt' ? { x: [0, -6, 6, -3, 3, 0] } :
          state === 'dead' ? { y: [0, 30], opacity: [1, 0], rotate: [0, 20] } :
          { y: [0, -2, 0] }
        }
        transition={
          state === 'idle' ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } :
          { duration: 0.35 }
        }
        style={{ transformOrigin: '50px 95px' }}
      >
        {/* Body */}
        <rect x="35" y="65" width="30" height="30" rx="8" fill="#48BB78" />
        <rect x="38" y="68" width="24" height="12" rx="4" fill="#38A169" />

        {/* Legs */}
        <rect x="38" y="92" width="8" height="12" rx="3" fill="#48BB78" />
        <rect x="54" y="92" width="8" height="12" rx="3" fill="#48BB78" />
        <ellipse cx="42" cy="104" rx="6" ry="3" fill="#38A169" />
        <ellipse cx="58" cy="104" rx="6" ry="3" fill="#38A169" />

        {/* Arms */}
        <motion.g
          animate={state === 'attack' ? { rotate: [0, -40, 0] } : {}}
          transition={{ duration: 0.3 }}
          style={{ transformOrigin: '68px 70px' }}
        >
          <path d="M68 70 Q80 65 85 55" stroke="#48BB78" strokeWidth="5" fill="none" strokeLinecap="round" />
          {/* Knife */}
          <line x1="83" y1="52" x2="90" y2="42" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" />
          <line x1="90" y1="42" x2="88" y2="38" stroke="#CBD5E0" strokeWidth="1.5" strokeLinecap="round" />
        </motion.g>
        <path d="M32 70 Q22 65 20 58" stroke="#48BB78" strokeWidth="5" fill="none" strokeLinecap="round" />

        {/* Head */}
        <circle cx="50" cy="45" r="18" fill="#48BB78" />

        {/* Ears */}
        <polygon points="32,40 18,30 30,48" fill="#48BB78" />
        <polygon points="68,40 82,30 70,48" fill="#48BB78" />
        <polygon points="33,42 22,34 31,47" fill="#38A169" />
        <polygon points="67,42 78,34 69,47" fill="#38A169" />

        {/* Bandana */}
        <path d="M32 38 Q50 32 68 38" stroke="#E53E3E" strokeWidth="4" fill="none" strokeLinecap="round" />
        <line x1="32" y1="38" x2="28" y2="48" stroke="#E53E3E" strokeWidth="2" strokeLinecap="round" />

        {/* Eyes */}
        <motion.g
          animate={state === 'hurt' ? { y: [0, 2, 0] } : {}}
          transition={{ duration: 0.15 }}
        >
          <ellipse cx="43" cy="44" rx="4" ry="5" fill="#FEFCBF" />
          <ellipse cx="57" cy="44" rx="4" ry="5" fill="#FEFCBF" />
          <circle cx="44" cy="44" r="2.5" fill="#1A202C" />
          <circle cx="58" cy="44" r="2.5" fill="#1A202C" />
          <circle cx="43.5" cy="43" r="0.8" fill="white" />
          <circle cx="57.5" cy="43" r="0.8" fill="white" />
        </motion.g>

        {/* Nose */}
        <ellipse cx="50" cy="50" rx="3" ry="2" fill="#2F855A" />

        {/* Mouth */}
        <path d={state === 'hurt' ? "M43 55 Q50 52 57 55" : "M43 55 Q50 60 57 55"} stroke="#276749" strokeWidth="1.5" fill="none" />
        {/* Teeth */}
        <rect x="46" y="55" width="3" height="3" rx="0.5" fill="white" />
        <rect x="51" y="55" width="3" height="3" rx="0.5" fill="white" />
      </motion.g>
    </motion.svg>
  );
}

// ─── Skeleton ───
export function SkeletonCharacter({ state, size = 100 }: CharacterProps) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 100 110" overflow="visible">
      <ellipse cx="50" cy="105" rx="16" ry="3.5" fill="rgba(0,0,0,0.1)" />

      <motion.g
        animate={
          state === 'attack' ? { x: [0, 8, 0], rotate: [0, -8, 0] } :
          state === 'hurt' ? { x: [0, -5, 5, -3, 3, 0] } :
          state === 'dead' ? { y: [0, 20], opacity: [1, 0], rotate: [0, -15] } :
          { y: [0, -2, 0] }
        }
        transition={
          state === 'idle' ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } :
          { duration: 0.35 }
        }
        style={{ transformOrigin: '50px 100px' }}
      >
        {/* Ribcage */}
        <rect x="38" y="58" width="24" height="28" rx="4" fill="none" stroke="#E2E8F0" strokeWidth="2" />
        {[0, 1, 2, 3].map(i => (
          <line key={i} x1="40" y1={63 + i * 6} x2="60" y2={63 + i * 6} stroke="#CBD5E0" strokeWidth="1.5" />
        ))}
        <line x1="50" y1="58" x2="50" y2="86" stroke="#E2E8F0" strokeWidth="2" />

        {/* Arms */}
        <motion.g
          animate={state === 'attack' ? { rotate: [0, -35, 0] } : {}}
          transition={{ duration: 0.3 }}
          style={{ transformOrigin: '65px 62px' }}
        >
          <line x1="62" y1="62" x2="80" y2="50" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="80" y1="50" x2="85" y2="40" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
          {/* Sword */}
          <line x1="84" y1="38" x2="86" y2="20" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" />
          <line x1="82" y1="22" x2="90" y2="22" stroke="#A0AEC0" strokeWidth="1.5" strokeLinecap="round" />
        </motion.g>
        <line x1="38" y1="62" x2="22" y2="52" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />

        {/* Skull */}
        <circle cx="50" cy="38" r="16" fill="#F7FAFC" stroke="#E2E8F0" strokeWidth="1" />
        {/* Eye sockets */}
        <motion.g
          animate={state === 'hurt' ? { scaleY: [1, 0.5, 1] } : {}}
          transition={{ duration: 0.2 }}
          style={{ transformOrigin: '50px 38px' }}
        >
          <ellipse cx="43" cy="36" rx="5" ry="5.5" fill="#1A202C" />
          <ellipse cx="57" cy="36" rx="5" ry="5.5" fill="#1A202C" />
          <motion.ellipse cx="43" cy="35" rx="2" ry="2.5" fill="#F56565"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.ellipse cx="57" cy="35" rx="2" ry="2.5" fill="#F56565"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          />
        </motion.g>
        {/* Nose */}
        <polygon points="50,42 48,46 52,46" fill="#1A202C" />
        {/* Jaw */}
        <path d="M38 48 Q50 56 62 48" stroke="#E2E8F0" strokeWidth="1.5" fill="none" />
        {/* Teeth */}
        {[0, 1, 2, 3, 4].map(i => (
          <rect key={i} x={42 + i * 4} y="47" width="2.5" height="3" rx="0.5" fill="#F7FAFC" stroke="#E2E8F0" strokeWidth="0.5" />
        ))}

        {/* Legs */}
        <line x1="44" y1="86" x2="40" y2="102" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="56" y1="86" x2="60" y2="102" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
      </motion.g>
    </motion.svg>
  );
}

// ─── Dark Knight ───
export function DarkKnightCharacter({ state, size = 110 }: CharacterProps) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 110 120" overflow="visible">
      <ellipse cx="55" cy="115" rx="22" ry="5" fill="rgba(0,0,0,0.15)" />

      <motion.g
        animate={
          state === 'attack' ? { x: [0, 12, 0], rotate: [0, -5, 0] } :
          state === 'hurt' ? { x: [0, -6, 6, -4, 4, 0] } :
          state === 'dead' ? { y: [0, 25], opacity: [1, 0], rotate: [0, 10] } :
          { y: [0, -2, 0] }
        }
        transition={
          state === 'idle' ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } :
          { duration: 0.4 }
        }
        style={{ transformOrigin: '55px 110px' }}
      >
        {/* Cape */}
        <motion.path
          d="M35 55 Q30 80 28 110 L82 110 Q80 80 75 55"
          fill="#1A202C" stroke="#2D3748" strokeWidth="1"
          animate={state === 'idle' ? { d: ["M35 55 Q30 80 28 110 L82 110 Q80 80 75 55", "M35 55 Q28 82 30 110 L80 110 Q82 82 75 55"] } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Armor body */}
        <path d="M38 55 L35 95 Q55 100 75 95 L72 55 Z" fill="#2D3748" stroke="#1A202C" strokeWidth="1" />
        <path d="M40 60 L70 60 L68 90 Q55 95 42 90 Z" fill="#4A5568" />

        {/* Shoulder pads */}
        <ellipse cx="35" cy="58" rx="10" ry="7" fill="#2D3748" stroke="#1A202C" strokeWidth="1" />
        <ellipse cx="75" cy="58" rx="10" ry="7" fill="#2D3748" stroke="#1A202C" strokeWidth="1" />
        <circle cx="35" cy="58" r="3" fill="#E53E3E" opacity="0.6" />
        <circle cx="75" cy="58" r="3" fill="#E53E3E" opacity="0.6" />

        {/* Arms */}
        <motion.g
          animate={state === 'attack' ? { rotate: [0, -45, 0] } : {}}
          transition={{ duration: 0.35 }}
          style={{ transformOrigin: '78px 60px' }}
        >
          <rect x="75" y="58" width="8" height="25" rx="3" fill="#4A5568" />
          {/* Great sword */}
          <line x1="82" y1="55" x2="95" y2="15" stroke="#A0AEC0" strokeWidth="3" strokeLinecap="round" />
          <line x1="78" y1="18" x2="100" y2="18" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" />
          <polygon points="93,15 95,5 97,15" fill="#CBD5E0" />
        </motion.g>
        <rect x="27" y="58" width="8" height="25" rx="3" fill="#4A5568" />

        {/* Helmet */}
        <path d="M38 25 Q55 5 72 25 L70 48 Q55 52 40 48 Z" fill="#2D3748" stroke="#1A202C" strokeWidth="1" />
        {/* Visor */}
        <path d="M42 35 L68 35 L66 42 Q55 45 44 42 Z" fill="#1A202C" />
        {/* Visor glow */}
        <motion.line x1="46" y1="38" x2="54" y2="38" stroke="#E53E3E" strokeWidth="2" strokeLinecap="round"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.line x1="56" y1="38" x2="64" y2="38" stroke="#E53E3E" strokeWidth="2" strokeLinecap="round"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
        {/* Helmet crest */}
        <path d="M55 8 L52 20 L58 20 Z" fill="#E53E3E" opacity="0.8" />

        {/* Legs */}
        <rect x="40" y="92" width="10" height="18" rx="3" fill="#2D3748" />
        <rect x="60" y="92" width="10" height="18" rx="3" fill="#2D3748" />
        <rect x="38" y="106" width="14" height="6" rx="2" fill="#1A202C" />
        <rect x="58" y="106" width="14" height="6" rx="2" fill="#1A202C" />
      </motion.g>
    </motion.svg>
  );
}

// ─── Demon Lord ───
export function DemonLordCharacter({ state, size = 120 }: CharacterProps) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 120 120" overflow="visible">
      <ellipse cx="60" cy="115" rx="25" ry="5" fill="rgba(0,0,0,0.15)" />

      <motion.g
        animate={
          state === 'attack' ? { x: [0, 10, 0], scale: [1, 1.05, 1] } :
          state === 'hurt' ? { x: [0, -8, 8, -5, 5, 0] } :
          state === 'dead' ? { y: [0, 20], opacity: [1, 0], scale: [1, 0.8] } :
          { y: [0, -3, 0] }
        }
        transition={
          state === 'idle' ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } :
          { duration: 0.4 }
        }
        style={{ transformOrigin: '60px 110px' }}
      >
        {/* Wings */}
        <motion.g
          animate={state === 'idle' ? { rotate: [0, -3, 0, 3, 0] } : {}}
          transition={{ duration: 4, repeat: Infinity }}
          style={{ transformOrigin: '60px 50px' }}
        >
          <path d="M35 45 Q10 20 5 50 Q15 40 20 55 Q10 50 5 70 Q25 55 35 65 Z" fill="#9B2C2C" stroke="#742A2A" strokeWidth="0.8" />
          <path d="M85 45 Q110 20 115 50 Q105 40 100 55 Q110 50 115 70 Q95 55 85 65 Z" fill="#9B2C2C" stroke="#742A2A" strokeWidth="0.8" />
        </motion.g>

        {/* Body */}
        <path d="M40 55 L38 95 Q60 102 82 95 L80 55 Z" fill="#9B2C2C" stroke="#742A2A" strokeWidth="1" />
        <path d="M45 60 L75 60 L73 90 Q60 96 47 90 Z" fill="#C53030" />

        {/* Armor plate */}
        <path d="M48 65 L72 65 L70 80 Q60 84 50 80 Z" fill="#742A2A" stroke="#9B2C2C" strokeWidth="0.5" />
        <circle cx="60" cy="72" r="4" fill="#FBBF24" opacity="0.8" />

        {/* Arms */}
        <motion.g
          animate={state === 'attack' ? { rotate: [0, -40, 0] } : {}}
          transition={{ duration: 0.35 }}
          style={{ transformOrigin: '82px 58px' }}
        >
          <rect x="78" y="55" width="10" height="28" rx="4" fill="#9B2C2C" />
          {/* Claw */}
          <path d="M88 52 L95 45 M88 55 L96 50 M88 58 L95 55" stroke="#742A2A" strokeWidth="2" strokeLinecap="round" />
        </motion.g>
        <rect x="32" y="55" width="10" height="28" rx="4" fill="#9B2C2C" />

        {/* Head */}
        <circle cx="60" cy="38" r="18" fill="#C53030" />

        {/* Horns */}
        <path d="M42 30 Q35 15 30 10" stroke="#742A2A" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M78 30 Q85 15 90 10" stroke="#742A2A" strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="30" cy="10" r="2" fill="#FBBF24" opacity="0.6" />
        <circle cx="90" cy="10" r="2" fill="#FBBF24" opacity="0.6" />

        {/* Eyes */}
        <motion.g
          animate={state === 'hurt' ? { scaleY: [1, 0.3, 1] } : {}}
          transition={{ duration: 0.2 }}
          style={{ transformOrigin: '60px 38px' }}
        >
          <ellipse cx="52" cy="36" rx="5" ry="4" fill="#FBBF24" />
          <ellipse cx="68" cy="36" rx="5" ry="4" fill="#FBBF24" />
          <motion.ellipse cx="52" cy="36" rx="2.5" ry="3" fill="#742A2A"
            animate={{ ry: [3, 2, 3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.ellipse cx="68" cy="36" rx="2.5" ry="3" fill="#742A2A"
            animate={{ ry: [3, 2, 3] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          />
        </motion.g>

        {/* Mouth */}
        <motion.path
          d={state === 'attack' ? "M50 46 Q60 56 70 46" : "M50 46 Q60 50 70 46"}
          stroke="#742A2A" strokeWidth="2" fill="none"
        />
        {/* Fangs */}
        <polygon points="52,46 50,52 54,49" fill="white" />
        <polygon points="68,46 70,52 66,49" fill="white" />

        {/* Legs */}
        <rect x="42" y="92" width="12" height="16" rx="4" fill="#9B2C2C" />
        <rect x="66" y="92" width="12" height="16" rx="4" fill="#9B2C2C" />
        {/* Hooves */}
        <path d="M42 106 L40 112 L54 112 L54 106" fill="#742A2A" />
        <path d="M66 106 L66 112 L80 112 L78 106" fill="#742A2A" />

        {/* Lifesteal aura */}
        {state === 'idle' && (
          <motion.circle cx="60" cy="65" r="40" fill="none" stroke="#C53030" strokeWidth="1"
            animate={{ r: [38, 42, 38], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.g>
    </motion.svg>
  );
}

// ─── Dragon (Boss) ───
export function DragonCharacter({ state, size = 140 }: CharacterProps) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 140 130" overflow="visible">
      <ellipse cx="70" cy="125" rx="30" ry="6" fill="rgba(0,0,0,0.15)" />

      <motion.g
        animate={
          state === 'attack' ? { x: [0, 15, 0], scale: [1, 1.08, 1] } :
          state === 'hurt' ? { x: [0, -10, 10, -6, 6, 0] } :
          state === 'dead' ? { y: [0, 30], opacity: [1, 0], rotate: [0, -10] } :
          { y: [0, -4, 0] }
        }
        transition={
          state === 'idle' ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } :
          { duration: 0.4 }
        }
        style={{ transformOrigin: '70px 120px' }}
      >
        {/* Wings */}
        <motion.g
          animate={state === 'idle' ? { rotate: [0, -5, 0, 5, 0] } : state === 'attack' ? { rotate: [0, -15, 15, 0] } : {}}
          transition={{ duration: state === 'attack' ? 0.4 : 3, repeat: state === 'idle' ? Infinity : 0 }}
          style={{ transformOrigin: '70px 55px' }}
        >
          <path d="M45 50 Q15 15 5 45 Q18 35 22 50 Q12 42 8 65 Q28 50 40 60 Z" fill="#C53030" stroke="#9B2C2C" strokeWidth="0.8" />
          <path d="M95 50 Q125 15 135 45 Q122 35 118 50 Q128 42 132 65 Q112 50 100 60 Z" fill="#C53030" stroke="#9B2C2C" strokeWidth="0.8" />
          {/* Wing membrane lines */}
          <line x1="20" y1="48" x2="10" y2="55" stroke="#9B2C2C" strokeWidth="0.5" opacity="0.5" />
          <line x1="30" y1="50" x2="15" y2="58" stroke="#9B2C2C" strokeWidth="0.5" opacity="0.5" />
          <line x1="120" y1="48" x2="130" y2="55" stroke="#9B2C2C" strokeWidth="0.5" opacity="0.5" />
          <line x1="110" y1="50" x2="125" y2="58" stroke="#9B2C2C" strokeWidth="0.5" opacity="0.5" />
        </motion.g>

        {/* Tail */}
        <motion.path
          d="M70 95 Q90 100 105 95 Q115 90 120 85"
          stroke="#C53030" strokeWidth="6" fill="none" strokeLinecap="round"
          animate={state === 'idle' ? { d: ["M70 95 Q90 100 105 95 Q115 90 120 85", "M70 95 Q90 95 105 100 Q115 95 120 90"] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Tail spike */}
        <polygon points="118,83 125,80 120,88" fill="#ED8936" />

        {/* Body */}
        <ellipse cx="70" cy="75" rx="30" ry="25" fill="#C53030" />
        <ellipse cx="70" cy="72" rx="22" ry="18" fill="#E53E3E" />
        {/* Belly scales */}
        {[0, 1, 2, 3].map(i => (
          <ellipse key={i} cx="70" cy={62 + i * 7} rx={14 - i * 1} ry="3" fill="#FED7D7" opacity="0.3" />
        ))}

        {/* Legs */}
        <rect x="45" y="90" width="12" height="20" rx="4" fill="#C53030" />
        <rect x="83" y="90" width="12" height="20" rx="4" fill="#C53030" />
        <path d="M45 108 L42 118 L57 118 L57 108" fill="#9B2C2C" />
        <path d="M83 108 L83 118 L98 118 L95 108" fill="#9B2C2C" />
        {/* Claws */}
        <polygon points="42,118 38,122 44,120" fill="#FBBF24" opacity="0.8" />
        <polygon points="48,118 46,122 52,120" fill="#FBBF24" opacity="0.8" />
        <polygon points="85,118 83,122 89,120" fill="#FBBF24" opacity="0.8" />
        <polygon points="93,118 91,122 97,120" fill="#FBBF24" opacity="0.8" />

        {/* Neck */}
        <path d="M58 55 Q60 40 65 30" stroke="#C53030" strokeWidth="12" fill="none" strokeLinecap="round" />

        {/* Head */}
        <ellipse cx="65" cy="28" rx="18" ry="14" fill="#C53030" transform="rotate(-5 65 28)" />
        <ellipse cx="65" cy="26" rx="14" ry="10" fill="#E53E3E" transform="rotate(-5 65 26)" />

        {/* Horns */}
        <path d="M52 20 Q45 8 42 2" stroke="#742A2A" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M78 20 Q85 8 88 2" stroke="#742A2A" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Eyes */}
        <motion.g
          animate={state === 'hurt' ? { scaleY: [1, 0.3, 1] } : {}}
          transition={{ duration: 0.2 }}
          style={{ transformOrigin: '65px 25px' }}
        >
          <ellipse cx="57" cy="24" rx="5" ry="4" fill="#FBBF24" />
          <ellipse cx="73" cy="24" rx="5" ry="4" fill="#FBBF24" />
          <motion.ellipse cx="57" cy="24" rx="2" ry="3.5" fill="#742A2A"
            animate={{ ry: [3.5, 2, 3.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.ellipse cx="73" cy="24" rx="2" ry="3.5" fill="#742A2A"
            animate={{ ry: [3.5, 2, 3.5] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          />
        </motion.g>

        {/* Nostrils */}
        <circle cx="60" cy="32" r="2" fill="#742A2A" />
        <circle cx="70" cy="32" r="2" fill="#742A2A" />

        {/* Fire breath (attack state) */}
        {state === 'attack' && (
          <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5], x: [0, -30, -50] }}>
            <ellipse cx="35" cy="30" rx="15" ry="8" fill="#FBBF24" opacity="0.6" />
            <ellipse cx="28" cy="30" rx="10" ry="5" fill="#F56565" opacity="0.8" />
            <ellipse cx="22" cy="30" rx="6" ry="3" fill="#FFF5F5" opacity="0.9" />
          </motion.g>
        )}

        {/* Boss aura */}
        {state === 'idle' && (
          <motion.ellipse cx="70" cy="70" rx="50" ry="45" fill="none" stroke="#FBBF24" strokeWidth="1.5"
            animate={{ rx: [48, 55, 48], ry: [43, 50, 43], opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}
      </motion.g>
    </motion.svg>
  );
}
