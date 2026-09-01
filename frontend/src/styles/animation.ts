import type { Variants } from 'framer-motion';

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.15, ease: 'easeOut' } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.1, ease: 'easeIn' } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.2, ease: 'easeOut' } 
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 0.15, ease: 'easeOut' } 
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.15, ease: 'easeOut' } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.97, 
    transition: { duration: 0.1, ease: 'easeIn' } 
  },
};

export const drawerLeftVariants: Variants = {
  hidden: { x: '-100%' },
  visible: { 
    x: 0, 
    transition: { type: 'spring', damping: 25, stiffness: 220 } 
  },
  exit: { 
    x: '-100%', 
    transition: { duration: 0.15, ease: 'easeIn' } 
  },
};

export const drawerRightVariants: Variants = {
  hidden: { x: '100%' },
  visible: { 
    x: 0, 
    transition: { type: 'spring', damping: 25, stiffness: 220 } 
  },
  exit: { 
    x: '100%', 
    transition: { duration: 0.15, ease: 'easeIn' } 
  },
};

export const microHoverLift = {
  whileHover: { y: -2, transition: { duration: 0.15 } },
  whileTap: { scale: 0.98 },
};

export const buttonPress = {
  whileTap: { scale: 0.97 },
};
