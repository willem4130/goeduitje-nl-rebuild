"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef, type ReactNode } from "react";

/**
 * Scroll reveal wrapper that animates elements when they enter the viewport
 * Uses Intersection Observer API via Framer Motion's useInView
 *
 * Usage:
 * <ScrollReveal>
 *   <YourContent />
 * </ScrollReveal>
 *
 * <ScrollReveal animation="slideLeft" delay={0.2}>
 *   <YourContent />
 * </ScrollReveal>
 */

export type AnimationType =
  | "fade"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "scale"
  | "scaleUp";

interface ScrollRevealProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  once?: boolean;
  amount?: number; // How much of the element should be visible before triggering (0-1)
  className?: string;
}

// Animation variants
const variants: Record<AnimationType, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  },
  slideDown: {
    hidden: { opacity: 0, y: -60 },
    visible: { opacity: 1, y: 0 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  scaleUp: {
    hidden: { scale: 0.95 },
    visible: { scale: 1 },
  },
};

export function ScrollReveal({
  children,
  animation = "slideUp",
  delay = 0,
  duration = 0.6,
  once = true,
  amount = 0.2,
  className,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once,
    amount,
    margin: "-100px", // Trigger 100px before element enters viewport
  });

  const selectedVariants = variants[animation];

  return (
    <motion.div
      ref={ref}
      variants={selectedVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // Custom easing
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger children component
 * Animates children with a stagger effect as they enter viewport
 *
 * Usage:
 * <StaggerChildren>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </StaggerChildren>
 */

interface StaggerChildrenProps {
  children: ReactNode;
  staggerDelay?: number;
  childAnimation?: AnimationType;
  className?: string;
}

export function StaggerChildren({
  children,
  staggerDelay = 0.1,
  childAnimation = "slideUp",
  className,
}: StaggerChildrenProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.2,
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  const childVariants = variants[childAnimation];

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <motion.div key={index} variants={childVariants}>
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div variants={childVariants}>{children}</motion.div>
      )}
    </motion.div>
  );
}

/**
 * Parallax scroll effect
 * Creates a subtle parallax effect on scroll
 *
 * Usage:
 * <ParallaxScroll speed={0.5}>
 *   <YourContent />
 * </ParallaxScroll>
 */

interface ParallaxScrollProps {
  children: ReactNode;
  speed?: number; // 0-1, where 0.5 is half speed
  className?: string;
}

export function ParallaxScroll({
  children,
  speed = 0.5,
  className,
}: ParallaxScrollProps) {
  const ref = useRef(null);

  return (
    <motion.div
      ref={ref}
      style={{
        y: useInView(ref) ? 0 : 100 * speed,
      }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
