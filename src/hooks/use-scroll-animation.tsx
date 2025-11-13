"use client";

import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

/**
 * Hook to detect when an element enters the viewport
 * Triggers animations when element scrolls into view
 *
 * Usage:
 * const ref = useScrollAnimation<HTMLDivElement>();
 *
 * <div ref={ref} className={ref.current ? "animate-in" : ""}>
 *   Content
 * </div>
 *
 * Or use the isInView state:
 * const [ref, isInView] = useScrollAnimation<HTMLDivElement>();
 *
 * <motion.div ref={ref} animate={isInView ? "visible" : "hidden"}>
 *   Content
 * </motion.div>
 */

export interface UseScrollAnimationOptions {
  /**
   * Percentage of the element that must be visible before triggering
   * @default 0.2 (20%)
   */
  threshold?: number | number[];

  /**
   * Margin around the viewport for early/late triggering
   * @default "0px"
   * @example "-100px" triggers 100px before entering viewport
   */
  rootMargin?: string;

  /**
   * Whether to only trigger once
   * @default true
   */
  once?: boolean;

  /**
   * Delay before triggering animation (in ms)
   * @default 0
   */
  delay?: number;

  /**
   * Whether the hook is enabled
   * @default true
   */
  enabled?: boolean;
}

/**
 * Returns a ref and isInView state
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollAnimationOptions = {}
): [RefObject<T | null>, boolean] {
  const {
    threshold = 0.2,
    rootMargin = "0px",
    once = true,
    delay = 0,
    enabled = true,
  } = options;

  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    if (!ref.current) return;
    if (once && hasTriggered) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => {
              setIsInView(true);
              setHasTriggered(true);
            }, delay);
          } else {
            setIsInView(true);
            setHasTriggered(true);
          }

          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsInView(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [enabled, threshold, rootMargin, once, delay, hasTriggered]);

  return [ref, isInView];
}

/**
 * Hook to detect when multiple elements enter the viewport
 * Useful for staggered animations
 *
 * Usage:
 * const itemsRef = useMultipleScrollAnimation<HTMLDivElement>(5);
 *
 * {items.map((item, i) => (
 *   <div key={i} ref={itemsRef[i]}>Content</div>
 * ))}
 */
export function useMultipleScrollAnimation<
  T extends HTMLElement = HTMLDivElement,
>(
  count: number,
  options: UseScrollAnimationOptions = {}
): Array<RefObject<T | null>> {
  const [refsArray] = useState<Array<RefObject<T | null>>>(() =>
    Array.from({ length: count }, () => ({ current: null }))
  );

  useEffect(() => {
    const { threshold = 0.2, rootMargin = "0px", once = true } = options;

    const observers = refsArray.map((ref) => {
      if (!ref.current) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry && entry.isIntersecting && ref.current) {
            // Add animation class or trigger animation
            ref.current.classList.add("in-view");

            if (once) {
              observer.disconnect();
            }
          } else if (!once && ref.current) {
            ref.current.classList.remove("in-view");
          }
        },
        {
          threshold,
          rootMargin,
        }
      );

      observer.observe(ref.current);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, [count, options, refsArray]);

  return refsArray;
}

/**
 * Hook for scroll progress (0 to 1)
 * Useful for scroll-linked animations
 *
 * Usage:
 * const scrollProgress = useScrollProgress();
 *
 * <motion.div style={{ scaleX: scrollProgress }}>
 *   Progress bar
 * </motion.div>
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const progress = scrollHeight > 0 ? scrolled / scrollHeight : 0;
      setProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return progress;
}

/**
 * Hook to detect if element is in viewport
 * More flexible version that returns additional info
 *
 * Usage:
 * const [ref, entry] = useInView<HTMLDivElement>();
 *
 * <div ref={ref}>
 *   {entry?.isIntersecting && "Visible!"}
 * </div>
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollAnimationOptions = {}
): [RefObject<T | null>, IntersectionObserverEntry | null] {
  const ref = useRef<T | null>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const { threshold = 0, rootMargin = "0px" } = options;

    const observer = new IntersectionObserver(
      ([observerEntry]) => {
        setEntry(observerEntry ?? null);
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return [ref, entry];
}

/**
 * Hook to detect scroll direction
 * Useful for hiding/showing headers on scroll
 *
 * Usage:
 * const scrollDirection = useScrollDirection();
 *
 * <header className={scrollDirection === "down" ? "hidden" : "visible"}>
 *   Navigation
 * </header>
 */
export function useScrollDirection(threshold = 10): "up" | "down" | null {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    null
  );
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (Math.abs(currentScrollY - lastScrollY) < threshold) {
        return;
      }

      setScrollDirection(currentScrollY > lastScrollY ? "down" : "up");
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, threshold]);

  return scrollDirection;
}
