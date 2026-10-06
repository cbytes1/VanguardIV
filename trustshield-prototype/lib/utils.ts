// Small presentation helpers shared across screens.

import type { Severity } from "@/lib/types";

/**
 * Join conditional class names, skipping falsy values.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Format an ISO timestamp as a short, locale-friendly string.
 * Uses a fixed locale/options so server and client render identically
 * (avoids React hydration mismatches).
 */
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(date);
}

export interface SeverityStyle {
  label: string;
  text: string;
  bg: string;
  border: string;
  dot: string;
}

const SEVERITY_STYLES: Record<Severity, SeverityStyle> = {
  safe: {
    label: "Safe",
    text: "text-emerald",
    bg: "bg-emerald/10",
    border: "border-emerald/40",
    dot: "bg-emerald",
  },
  low: {
    label: "Low",
    text: "text-teal",
    bg: "bg-teal/10",
    border: "border-teal/40",
    dot: "bg-teal",
  },
  medium: {
    label: "Medium",
    text: "text-amber",
    bg: "bg-amber/10",
    border: "border-amber/40",
    dot: "bg-amber",
  },
  high: {
    label: "High",
    text: "text-threat",
    bg: "bg-threat/10",
    border: "border-threat/40",
    dot: "bg-threat",
  },
  critical: {
    label: "Critical",
    text: "text-threat",
    bg: "bg-threat/20",
    border: "border-threat/60",
    dot: "bg-threat",
  },
};

export function severityStyle(severity: Severity): SeverityStyle {
  return SEVERITY_STYLES[severity];
}

/**
 * Map a 0-100 score to a palette tone.
 */
export function scoreTone(score: number): SeverityStyle {
  if (score >= 85) return SEVERITY_STYLES.safe;
  if (score >= 70) return SEVERITY_STYLES.low;
  if (score >= 50) return SEVERITY_STYLES.medium;
  return SEVERITY_STYLES.high;
}
