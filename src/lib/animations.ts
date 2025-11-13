import type { Variants } from "framer-motion";

/**
 * Reusable Framer Motion animation variants for the Goeduitje.nl rebuild
 *
 * Usage:
 * import { fadeIn, slideUp, staggerContainer } from "@/lib/animations";
 *
 * <motion.div variants={fadeIn} initial="hidden" animate="visible">
 *   Content
 * </motion.div>
 */

// ============================================================================
// TIMING & EASING - High-End Editorial
// ============================================================================

export const ANIMATION_DURATION = {
  fast: 0.15, // Instant feedback - refined from 0.2
  normal: 0.3, // Standard transitions - refined from 0.4
  slow: 0.5, // Elegant reveals - refined from 0.6
  verySlow: 0.8, // Dramatic effects
} as const;

export const EASING = {
  // Original easing curves
  easeOut: [0.16, 1, 0.3, 1],
  easeIn: [0.7, 0, 0.84, 0],
  easeInOut: [0.65, 0, 0.35, 1],
  spring: { type: "spring", damping: 20, stiffness: 100 },

  // High-end editorial easing curves
  smooth: [0.25, 0.46, 0.45, 0.94], // Ultra smooth, sophisticated
  editorial: [0.16, 1, 0.3, 1], // Editorial reveal (refined easeOut)
  snappy: [0.6, 0.04, 0.98, 0.34], // Quick, responsive micro-interactions
  gentle: [0.25, 0.1, 0.25, 1], // Subtle, gentle transitions
  springBounce: { type: "spring", damping: 15, stiffness: 120 }, // More bounce
  springSmooth: { type: "spring", damping: 25, stiffness: 80 }, // Smoother spring
} as const;

// ============================================================================
// FADE ANIMATIONS
// ============================================================================

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATION.normal,
      ease: EASING.easeOut,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: ANIMATION_DURATION.fast,
    },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION.slow,
      ease: EASING.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: -40,
    transition: {
      duration: ANIMATION_DURATION.fast,
    },
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION.slow,
      ease: EASING.easeOut,
    },
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: ANIMATION_DURATION.slow,
      ease: EASING.easeOut,
    },
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: ANIMATION_DURATION.slow,
      ease: EASING.easeOut,
    },
  },
};

// ============================================================================
// SLIDE ANIMATIONS
// ============================================================================

export const slideUp: Variants = {
  hidden: { y: "100%" },
  visible: {
    y: 0,
    transition: {
      duration: ANIMATION_DURATION.slow,
      ease: EASING.easeOut,
    },
  },
  exit: {
    y: "-100%",
    transition: {
      duration: ANIMATION_DURATION.slow,
      ease: EASING.easeIn,
    },
  },
};

export const slideDown: Variants = {
  hidden: { y: "-100%" },
  visible: {
    y: 0,
    transition: {
      duration: ANIMATION_DURATION.slow,
      ease: EASING.easeOut,
    },
  },
};

export const slideLeft: Variants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: {
      duration: ANIMATION_DURATION.slow,
      ease: EASING.easeOut,
    },
  },
};

export const slideRight: Variants = {
  hidden: { x: "-100%" },
  visible: {
    x: 0,
    transition: {
      duration: ANIMATION_DURATION.slow,
      ease: EASING.easeOut,
    },
  },
};

// ============================================================================
// SCALE ANIMATIONS
// ============================================================================

export const scaleIn: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATION.normal,
      ease: EASING.easeOut,
    },
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    transition: {
      duration: ANIMATION_DURATION.fast,
    },
  },
};

export const scaleUp: Variants = {
  hidden: { scale: 0.95 },
  visible: {
    scale: 1,
    transition: {
      duration: ANIMATION_DURATION.normal,
      ease: EASING.easeOut,
    },
  },
};

// ============================================================================
// STAGGER ANIMATIONS
// ============================================================================

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION.normal,
      ease: EASING.easeOut,
    },
  },
};

export const staggerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const staggerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

// ============================================================================
// PAGE TRANSITION ANIMATIONS
// ============================================================================

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION.slow,
      ease: EASING.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: ANIMATION_DURATION.normal,
      ease: EASING.easeIn,
    },
  },
};

export const pageSlideUp: Variants = {
  initial: { y: "100vh" },
  animate: {
    y: 0,
    transition: {
      duration: ANIMATION_DURATION.verySlow,
      ease: EASING.easeOut,
    },
  },
  exit: {
    y: "-100vh",
    transition: {
      duration: ANIMATION_DURATION.verySlow,
      ease: EASING.easeIn,
    },
  },
};

// ============================================================================
// HOVER ANIMATIONS - High-End Editorial
// ============================================================================

export const hoverScale = {
  scale: 1.02, // Reduced from 1.05 for subtlety
  transition: {
    duration: ANIMATION_DURATION.normal,
    ease: EASING.smooth,
  },
};

export const hoverLift = {
  y: -2, // Reduced from -4 for subtlety
  transition: {
    duration: ANIMATION_DURATION.normal,
    ease: EASING.smooth,
  },
};

export const hoverLiftScale = {
  y: -2,
  scale: 1.01, // Very subtle scale
  transition: {
    duration: ANIMATION_DURATION.normal,
    ease: EASING.smooth,
  },
};

export const hoverGlow = {
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)", // Refined from 0.12
  transition: {
    duration: ANIMATION_DURATION.normal,
    ease: EASING.smooth,
  },
};

// Editorial-specific hover effects
export const hoverEditorial = {
  y: -2,
  transition: {
    duration: 0.3,
    ease: EASING.editorial,
  },
};

// ============================================================================
// LOADING ANIMATIONS
// ============================================================================

export const pulseAnimation: Variants = {
  hidden: { scale: 0.95, opacity: 0.8 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATION.slow,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
};

export const spinAnimation: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// ============================================================================
// VIEWPORT ANIMATIONS (for use with whileInView)
// ============================================================================

export const viewportFadeIn = {
  initial: { opacity: 0, y: 40 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION.slow,
      ease: EASING.easeOut,
    },
  },
  viewport: { once: true, margin: "-100px" },
};

export const viewportSlideLeft = {
  initial: { opacity: 0, x: -60 },
  whileInView: {
    opacity: 1,
    x: 0,
    transition: {
      duration: ANIMATION_DURATION.slow,
      ease: EASING.easeOut,
    },
  },
  viewport: { once: true, margin: "-100px" },
};

export const viewportSlideRight = {
  initial: { opacity: 0, x: 60 },
  whileInView: {
    opacity: 1,
    x: 0,
    transition: {
      duration: ANIMATION_DURATION.slow,
      ease: EASING.easeOut,
    },
  },
  viewport: { once: true, margin: "-100px" },
};

export const viewportScale = {
  initial: { opacity: 0, scale: 0.8 },
  whileInView: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: ANIMATION_DURATION.slow,
      ease: EASING.easeOut,
    },
  },
  viewport: { once: true, margin: "-100px" },
};

// ============================================================================
// NUMBER COUNTER ANIMATION (for impact stats)
// ============================================================================

export const counterAnimation = (from: number, to: number, duration = 2) => ({
  initial: { value: from },
  animate: { value: to },
  transition: {
    duration,
    ease: "easeOut",
  },
});
