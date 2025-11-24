"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseVideoLazyLoadOptions {
  /**
   * Root margin for intersection observer (e.g., "100px" loads video 100px before entering viewport)
   * @default "200px"
   */
  rootMargin?: string;

  /**
   * Threshold for intersection observer (0-1, how much of video must be visible)
   * @default 0.1
   */
  threshold?: number;

  /**
   * Whether to pause video when it leaves viewport
   * @default false
   */
  pauseOnExit?: boolean;

  /**
   * Whether to preload video metadata
   * @default "metadata"
   */
  preload?: "none" | "metadata" | "auto";
}

interface UseVideoLazyLoadReturn {
  /**
   * Ref to attach to the video element
   */
  videoRef: React.RefObject<HTMLVideoElement>;

  /**
   * Whether the video is currently in viewport
   */
  isInView: boolean;

  /**
   * Whether the video has been loaded
   */
  isLoaded: boolean;

  /**
   * Whether the video is currently playing
   */
  isPlaying: boolean;

  /**
   * Manually trigger video load
   */
  load: () => void;

  /**
   * Manually play video
   */
  play: () => Promise<void>;

  /**
   * Manually pause video
   */
  pause: () => void;
}

/**
 * Hook for lazy loading videos with Intersection Observer
 *
 * @example
 * ```tsx
 * const { videoRef, isInView, isLoaded } = useVideoLazyLoad({
 *   rootMargin: "200px",
 *   pauseOnExit: true,
 * });
 *
 * return (
 *   <video
 *     ref={videoRef}
 *     poster="/images/hero/hero-poster.jpg"
 *     muted
 *     loop
 *     playsInline
 *   >
 *     <source src="/videos/hero-background.mp4" type="video/mp4" />
 *   </video>
 * );
 * ```
 */
export function useVideoLazyLoad(
  options: UseVideoLazyLoadOptions = {}
): UseVideoLazyLoadReturn {
  const {
    rootMargin = "200px",
    threshold = 0.1,
    pauseOnExit = false,
    preload = "metadata",
  } = options;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Load video sources
  const load = useCallback(() => {
    const video = videoRef.current;
    if (!video || isLoaded) return;

    // Set preload attribute
    video.preload = preload;

    // If video has sources, load them
    if (video.children.length > 0) {
      video.load();
      setIsLoaded(true);
    }
  }, [isLoaded, preload]);

  // Play video
  const play = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      await video.play();
      setIsPlaying(true);
    } catch (error) {
      // Handle play() promise rejection (e.g., user hasn't interacted with page)
      console.warn("Video play failed:", error);
      setIsPlaying(false);
    }
  }, []);

  // Pause video
  const pause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Create Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);

          if (entry.isIntersecting) {
            // Video entered viewport - load and play
            if (!isLoaded) {
              load();
            }

            // Auto-play when in view (for videos with autoplay attribute)
            if (video.autoplay) {
              void play();
            }
          } else if (pauseOnExit && isPlaying) {
            // Video left viewport - pause if option enabled
            pause();
          }
        });
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(video);

    // Listen for play/pause events
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleLoadedData = () => setIsLoaded(true);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("loadeddata", handleLoadedData);

    // Cleanup
    return () => {
      observer.disconnect();
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("loadeddata", handleLoadedData);
    };
  }, [
    rootMargin,
    threshold,
    pauseOnExit,
    isLoaded,
    isPlaying,
    load,
    play,
    pause,
  ]);

  return {
    videoRef,
    isInView,
    isLoaded,
    isPlaying,
    load,
    play,
    pause,
  };
}
