"use client";

import { useEffect, useRef, useState } from "react";

export interface UseCountUpOptions {
  /** The value to animate up to. */
  target: number;
  /** Animation duration in milliseconds. Default 1200. */
  duration?: number;
  /** Decimal places to keep in the rendered value. Default 0. */
  decimals?: number;
  /**
   * When true, the count-up only begins once the attached element scrolls
   * into view (via IntersectionObserver). When false, it starts on mount.
   * Default true.
   */
  startOnView?: boolean;
}

export interface UseCountUpResult<T extends HTMLElement = HTMLElement> {
  /** The current animated value (rounded to `decimals`). */
  value: number;
  /**
   * Ref to attach to the element whose visibility starts the animation.
   * Only required when `startOnView` is true.
   */
  ref: React.RefObject<T | null>;
}

/**
 * Animate a number from 0 up to a target using requestAnimationFrame.
 *
 * The animation can either start on mount or when the ref'd element first
 * enters the viewport. All timers/observers live inside effects and are
 * cleaned up on unmount, and the initial render is always 0 on both server
 * and client, so there is no hydration mismatch.
 */
export function useCountUp<T extends HTMLElement = HTMLElement>({
  target,
  duration = 1200,
  decimals = 0,
  startOnView = true,
}: UseCountUpOptions): UseCountUpResult<T> {
  const ref = useRef<T | null>(null);
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);

  // Decide when to begin: immediately, or when the element scrolls into view.
  useEffect(() => {
    if (!startOnView) {
      setStarted(true);
      return;
    }

    const el = ref.current;
    // If we can't observe (no element or no IO support), just start.
    if (!el || typeof IntersectionObserver === "undefined") {
      setStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [startOnView]);

  // Run the actual count-up once started.
  useEffect(() => {
    if (!started) return;

    const factor = 10 ** decimals;
    let frame = 0;
    let startTime: number | null = null;

    const tick = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic for a natural deceleration.
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = Math.round(target * eased * factor) / factor;
      setValue(next);

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, target, duration, decimals]);

  return { value, ref };
}
