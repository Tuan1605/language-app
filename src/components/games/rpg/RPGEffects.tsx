import { motion, AnimatePresence } from 'framer-motion';

// ─── Frost Nova Effect ───
export function FrostNovaEffect({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: [0, 1.5], opacity: [1, 0] }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="absolute w-3 h-3 rounded-full"
              style={{
                background: 'radial-gradient(circle, #E0F2FE, #63B3ED)',
                transform: `rotate(${i * 45}deg) translateY(-60px)`,
              }}
            />
          ))}
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: [0, 3], opacity: [0.8, 0] }}
            transition={{ duration: 0.5 }}
            className="absolute w-20 h-20 rounded-full border-2 border-blue"
            style={{ background: 'radial-gradient(circle, rgba(99,179,237,0.3), transparent)' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Fire Storm Effect ───
export function FireStormEffect({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
          {[...Array(12)].map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const dist = 40 + Math.random() * 30;
            return (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                animate={{
                  x: Math.cos(angle) * dist,
                  y: Math.sin(angle) * dist,
                  scale: [0, 1.5, 0],
                  opacity: [1, 0.8, 0],
                }}
                transition={{ duration: 0.6, delay: i * 0.03 }}
                className="absolute w-4 h-4 rounded-full"
                style={{
                  background: i % 3 === 0 ? '#FBBF24' : i % 3 === 1 ? '#F56565' : '#ED8936',
                  boxShadow: `0 0 8px ${i % 2 === 0 ? '#F56565' : '#ED8936'}`,
                }}
              />
            );
          })}
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: [0, 2, 0], rotate: [0, 180] }}
            transition={{ duration: 0.5 }}
            className="absolute w-16 h-16"
            style={{
              background: 'conic-gradient(from 0deg, #FBBF24, #F56565, #ED8936, #FBBF24)',
              borderRadius: '50%',
              opacity: 0.6,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Thunder God Effect ───
export function ThunderGodEffect({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="absolute inset-0 pointer-events-none z-30">
          {/* Lightning bolt */}
          <motion.svg
            className="absolute left-1/2 top-0 -translate-x-1/2"
            width="60" height="200" viewBox="0 0 60 200"
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: [0, 1, 1, 0], y: [-100, 0, 0, 50] }}
            transition={{ duration: 0.4 }}
          >
            <motion.path
              d="M30 0 L20 60 L35 55 L15 120 L40 110 L10 200"
              stroke="#FBBF24"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.path
              d="M30 0 L20 60 L35 55 L15 120 L40 110 L10 200"
              stroke="white"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            />
          </motion.svg>

          {/* Impact flash */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.8, 0], scale: [0, 2, 0] }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.6), transparent)' }}
          />

          {/* Sparks */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{
                x: (Math.random() - 0.5) * 120,
                y: (Math.random() - 0.5) * 120,
                opacity: 0,
              }}
              transition={{ duration: 0.4, delay: 0.25 + i * 0.03 }}
              className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full bg-gold"
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Shield Effect ───
export function ShieldEffect({ show, charges }: { show: boolean; charges: number }) {
  if (!show || charges <= 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center"
    >
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="w-24 h-24 md:w-32 md:h-32 rounded-full border-3"
        style={{
          border: '3px solid rgba(72,187,120,0.5)',
          background: 'radial-gradient(circle, rgba(72,187,120,0.1), transparent)',
          boxShadow: '0 0 20px rgba(72,187,120,0.2)',
        }}
      />
      <motion.div
        className="absolute text-[10px] font-black text-green"
        style={{ bottom: '10%' }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        🛡️ x{charges}
      </motion.div>
    </motion.div>
  );
}

// ─── Poison Effect ───
export function PoisonEffect({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="absolute inset-0 pointer-events-none z-20">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 0 }}
              animate={{
                opacity: [0, 0.6, 0],
                y: [-20, -40],
                x: (Math.random() - 0.5) * 30,
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              className="absolute text-sm"
              style={{ left: `${40 + Math.random() * 20}%`, top: '60%' }}
            >
              ☠️
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Freeze Effect ───
export function FreezeEffect({ show, seconds }: { show: boolean; seconds: number }) {
  if (!show) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-blue/10 rounded-2xl" />
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        className="absolute"
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-xs"
            style={{
              transform: `rotate(${i * 60}deg) translateY(-35px)`,
            }}
          >
            ❄️
          </motion.div>
        ))}
      </motion.div>
      <motion.span
        className="absolute text-[10px] font-black text-blue bg-blue/10 px-2 py-0.5 rounded-full"
        style={{ bottom: '15%' }}
      >
        ❄️ {seconds}s
      </motion.span>
    </motion.div>
  );
}

// ─── Critical Hit Flash ───
export function CritFlash({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.4, 0] }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 pointer-events-none z-40 bg-gold/30 rounded-2xl"
        />
      )}
    </AnimatePresence>
  );
}

// ─── Combo Fire Effect (for high combos) ───
export function ComboFireEffect({ combo }: { combo: number }) {
  if (combo < 8) return null;
  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none z-10 overflow-hidden rounded-b-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.6 }}
    >
      <motion.div
        className="w-full h-full"
        style={{
          background: 'linear-gradient(0deg, rgba(237,137,54,0.4), transparent)',
        }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
    </motion.div>
  );
}
