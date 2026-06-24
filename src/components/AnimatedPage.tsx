import { motion, type Transition } from 'framer-motion';
import type { ReactNode } from 'react';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition: Transition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3
};

interface Props {
  children: ReactNode;
  className?: string;
}

export function AnimatedPage({ children, className = '' }: Props) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
}
