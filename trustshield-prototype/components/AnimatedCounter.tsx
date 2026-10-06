"use client";

import { useCountUp } from "@/hooks/useCountUp";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  /** Final number to count up to. */
  value: number;
  /** Text appended after the number, e.g. "%" or "+". */
  suffix?: string;
  /** Text shown before the number, e.g. "$". */
  prefix?: string;
  /** Decimal places to display. Default 0. */
  decimals?: number;
  /** Animation duration in ms. Default 1200. */
  duration?: number;
  /** Start when scrolled into view (true) or on mount (false). Default true. */
  startOnView?: boolean;
  className?: string;
}

/**
 * Renders a number that animates from 0 up to `value`. Thin presentational
 * wrapper around the useCountUp hook. Marked "use client" because the
 * animation relies on requestAnimationFrame and IntersectionObserver.
 */
export default function AnimatedCounter({
  value,
  suffix,
  prefix,
  decimals = 0,
  duration = 1200,
  startOnView = true,
  className,
}: AnimatedCounterProps) {
  const { value: current, ref } = useCountUp<HTMLSpanElement>({
    target: value,
    duration,
    decimals,
    startOnView,
  });

  const display = current.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
