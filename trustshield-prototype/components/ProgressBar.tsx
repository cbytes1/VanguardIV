import { cn } from "@/lib/utils";

interface ProgressBarProps {
  /** 0-100 */
  value: number;
  /** Tailwind background class for the filled portion, e.g. "bg-emerald". */
  barClassName?: string;
  /**
   * Optional inline color for the filled portion (hex/CSS color). Use when the
   * bar needs to match a dynamic color that isn't a palette token, e.g. the
   * per-category colors on the Trust Score screen. Takes precedence over the
   * background set via `barClassName`.
   */
  barColor?: string;
  className?: string;
}

export default function ProgressBar({
  value,
  barClassName = "bg-teal",
  barColor,
  className,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-navy-lighter/60",
        className,
      )}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn("h-full rounded-full transition-all", barClassName)}
        style={{
          width: `${clamped}%`,
          ...(barColor ? { backgroundColor: barColor } : {}),
        }}
      />
    </div>
  );
}
