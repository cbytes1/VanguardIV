import { cn, scoreTone } from "@/lib/utils";

/** A colored arc segment for the multi-segment gauge variant. */
export interface GaugeSegment {
  /** Portion of the ring this segment occupies, 0-100. */
  value: number;
  /** Stroke color (hex or CSS color) for this segment. */
  color: string;
  /** Optional label for accessibility / legends. */
  label?: string;
}

interface CircularGaugeProps {
  /** Primary value 0-100 (used for the single-arc gauge and the center text). */
  value: number;
  /** Small caption under the big number, e.g. "Protected" or "Grade B". */
  label?: string;
  /** Diameter in pixels. Default 180. */
  size?: number;
  /** Ring thickness in pixels. Default 14. */
  strokeWidth?: number;
  /**
   * Optional colored segments. When provided, the ring is drawn as a stacked
   * set of arcs (used by the trust-score screen to show category weighting)
   * instead of a single progress arc.
   */
  segments?: GaugeSegment[];
  /** Override the automatic tone color for the single-arc variant. */
  color?: string;
  /** Hide the centered value/label text. Default false. */
  hideCenter?: boolean;
  className?: string;
}

/**
 * Reusable circular ring gauge rendered with inline SVG (no chart deps).
 *
 * Two modes:
 *  - Single arc: pass `value`; the arc length and tone follow the score.
 *  - Segmented ring: pass `segments`; each arc is drawn in sequence with its
 *    own color (good for showing how categories make up a total).
 *
 * This generalizes the original ScoreGauge, which still works on its own.
 */
export default function CircularGauge({
  value,
  label,
  size = 180,
  strokeWidth = 14,
  segments,
  color,
  hideCenter = false,
  className,
}: CircularGaugeProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const tone = scoreTone(clamped);

  // For the single-arc variant, how much of the ring to fill.
  const progressOffset = circumference - (clamped / 100) * circumference;

  // For the segmented variant, walk the segments and lay each arc end-to-end.
  let accumulated = 0;
  const segmentArcs = segments?.map((seg, index) => {
    const portion = Math.max(0, Math.min(100, seg.value)) / 100;
    const dash = portion * circumference;
    const gap = circumference - dash;
    const rotation = (accumulated / 100) * 360 - 90;
    accumulated += Math.max(0, Math.min(100, seg.value));
    return (
      <circle
        key={seg.label ?? index}
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={seg.color}
        strokeWidth={strokeWidth}
        strokeDasharray={`${dash} ${gap}`}
        transform={`rotate(${rotation} ${center} ${center})`}
      />
    );
  });

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={color ? undefined : tone.text}
        role="img"
        aria-label={label ? `${label}: ${clamped} out of 100` : `${clamped} out of 100`}
      >
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-navy-lighter/50"
          opacity={0.5}
        />

        {segments && segments.length > 0 ? (
          // Segmented ring.
          segmentArcs
        ) : (
          // Single progress arc.
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color ?? "currentColor"}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            transform={`rotate(-90 ${center} ${center})`}
          />
        )}
      </svg>

      {!hideCenter ? (
        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-bold text-white">{clamped}</span>
          {label ? (
            <span className="text-xs uppercase tracking-wide text-white/50">
              {label}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
