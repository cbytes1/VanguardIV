import { scoreTone } from "@/lib/utils";
import type { TrustScoreSnapshot } from "@/lib/types";

interface ScoreGaugeProps {
  /** 0-100 */
  value: number;
  grade: TrustScoreSnapshot["grade"];
}

/**
 * Circular progress gauge rendered with inline SVG (no runtime deps).
 */
export default function ScoreGauge({ value, grade }: ScoreGaugeProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const tone = scoreTone(clamped);

  // Map the tone's text class to a stroke color via currentColor.
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={tone.text}
        role="img"
        aria-label={`Trust score ${clamped} out of 100, grade ${grade}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-navy-lighter/50"
          opacity={0.5}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold text-white">{clamped}</span>
        <span className="text-xs uppercase tracking-wide text-white/50">
          Grade {grade}
        </span>
      </div>
    </div>
  );
}
