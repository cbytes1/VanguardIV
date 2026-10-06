"use client";

import { useEffect, useRef, useState } from "react";
import { TrendingUp, ArrowUpRight, Users, ShieldCheck } from "lucide-react";
import Card from "@/components/Card";
import ProgressBar from "@/components/ProgressBar";
import CircularGauge, { type GaugeSegment } from "@/components/CircularGauge";
import AnimatedCounter from "@/components/AnimatedCounter";
import {
  trustScore,
  trustScoreLabel,
  trustCategories,
  scoreHistory,
  recommendations,
} from "@/data/mock";
import { cn, scoreTone } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Peer comparison copy. The spec fixes this at 78%; keeping it as a constant
// makes it easy for the Vanguard IV team to tweak later.
// ---------------------------------------------------------------------------
const SAFER_THAN_PERCENT = 78;

// Each category gets a palette color so the ring segments and the breakdown
// rows read as the same thing. Keyed by the stable mock category ids.
const CATEGORY_COLORS: Record<string, string> = {
  "tc-network": "#2dd4bf", // teal
  "tc-phishing": "#f59e0b", // amber
  "tc-device": "#34d399", // emerald
  "tc-privacy": "#38bdf8", // sky/cyan
  "tc-family": "#a78bfa", // violet accent
};

export default function TrustScoreClient() {
  // Build the ring's colored segments from the five categories. Each category's
  // share of the ring is weighted by its score so a stronger category fills
  // more of the arc, giving a quick visual read of where protection is strong.
  const totalScore = trustCategories.reduce((sum, c) => sum + c.score, 0);
  const segments: GaugeSegment[] = trustCategories.map((category) => ({
    value: (category.score / totalScore) * 100,
    color: CATEGORY_COLORS[category.id] ?? "#2dd4bf",
    label: category.name,
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* Top row: the big animated ring + the category breakdown. */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center gap-4 text-center">
          <ScoreRing segments={segments} />
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald">
              <TrendingUp className="h-4 w-4" />+{Math.abs(trustScore.change)} pts
              this month
            </span>
          </div>
          <p className="text-sm text-white/55">
            Your household is well protected. The colored segments below show how
            each area contributes to your overall score.
          </p>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="mb-5 text-lg font-semibold text-white">
            Category breakdown
          </h2>
          <ul className="flex flex-col gap-5">
            {trustCategories.map((category) => {
              const tone = scoreTone(category.score);
              const color = CATEGORY_COLORS[category.id] ?? "#2dd4bf";
              return (
                <li key={category.id} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-sm font-medium text-white">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: color }}
                        aria-hidden
                      />
                      {category.name}
                    </span>
                    <span className={cn("text-sm font-semibold", tone.text)}>
                      {category.score}
                      <span className="text-white/40">/100</span>
                    </span>
                  </div>
                  <ProgressBar
                    value={category.score}
                    barClassName=""
                    // Inline color keeps the bar in sync with the ring segment.
                    barColor={color}
                  />
                  <p className="text-xs text-white/50">{category.note}</p>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      {/* Middle row: score history line chart + recommendations. */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Score history</h2>
            <span className="text-xs text-white/40">Last 6 months</span>
          </div>
          <ScoreHistoryChart />
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Recommendations
          </h2>
          <ul className="flex flex-col gap-3">
            {recommendations.map((rec) => (
              <li
                key={rec.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-navy-lighter/50 bg-navy/40 p-3"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-white">
                    {rec.title}
                  </span>
                  <span className="text-xs text-white/50">{rec.detail}</span>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald/40 bg-emerald/10 px-2.5 py-1 text-xs font-semibold text-emerald">
                  <ArrowUpRight className="h-3.5 w-3.5" />+{rec.pointImpact} pts
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Bottom: peer comparison. */}
      <Card className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal/15 text-teal">
          <Users className="h-6 w-6" />
        </span>
        <div>
          <p className="text-sm text-white">
            Your household is safer than{" "}
            <span className="font-semibold text-emerald">
              {SAFER_THAN_PERCENT}%
            </span>{" "}
            of TrustShield users in your area.
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-white/50">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald" />
            Based on anonymized comparison across the Denver, CO region.
          </p>
        </div>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// The headline ring. CircularGauge draws the static colored segments; we
// overlay our own animated center number so the big 87 counts up on load.
// hideCenter keeps the gauge from drawing its own static value underneath.
// ---------------------------------------------------------------------------
function ScoreRing({ segments }: { segments: GaugeSegment[] }) {
  return (
    <div className="relative inline-flex items-center justify-center">
      <CircularGauge
        value={trustScore.overall}
        segments={segments}
        size={200}
        strokeWidth={16}
        hideCenter
      />
      <div className="absolute flex flex-col items-center">
        <span className="flex items-baseline text-5xl font-bold text-white">
          <AnimatedCounter value={trustScore.overall} startOnView={false} />
          <span className="ml-1 text-lg font-medium text-white/40">/100</span>
        </span>
        <span className="mt-1 text-xs font-medium uppercase tracking-wide text-emerald">
          {trustScoreLabel}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hand-rolled SVG line chart for the 6-month score history. No chart library:
// we map each month to an (x, y) point in a fixed viewBox, draw the trend line
// plus a soft area fill underneath, and label the axis. The line animates in
// with a stroke-dash reveal once the chart mounts.
// ---------------------------------------------------------------------------
function ScoreHistoryChart() {
  const [revealed, setRevealed] = useState(false);
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  // ViewBox geometry. Fixed numbers keep server and client paint identical.
  const width = 520;
  const height = 220;
  const padX = 36;
  const padTop = 24;
  const padBottom = 36;

  // Y axis is scaled to a readable window below/above the data range rather
  // than 0-100, so the upward trend is clearly visible.
  const scores = scoreHistory.map((p) => p.score);
  const minScore = Math.min(...scores) - 6;
  const maxScore = Math.max(...scores) + 4;
  const span = maxScore - minScore;

  const plotWidth = width - padX * 2;
  const plotHeight = height - padTop - padBottom;

  const points = scoreHistory.map((point, index) => {
    const x =
      padX +
      (scoreHistory.length === 1
        ? plotWidth / 2
        : (index / (scoreHistory.length - 1)) * plotWidth);
    const y = padTop + (1 - (point.score - minScore) / span) * plotHeight;
    return { ...point, x, y };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const areaPath =
    `M ${points[0].x.toFixed(1)} ${(height - padBottom).toFixed(1)} ` +
    points.map((p) => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ") +
    ` L ${points[points.length - 1].x.toFixed(1)} ${(height - padBottom).toFixed(1)} Z`;

  // Measure the path length so the dash-reveal animation covers it exactly.
  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
    const id = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-56 w-full"
      role="img"
      aria-label="Trust Score over the past six months, trending upward"
    >
      <defs>
        <linearGradient id="scoreArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Horizontal gridlines for a little structure. */}
      {[0, 0.5, 1].map((frac) => {
        const y = padTop + frac * plotHeight;
        return (
          <line
            key={frac}
            x1={padX}
            y1={y}
            x2={width - padX}
            y2={y}
            stroke="currentColor"
            className="text-navy-lighter/50"
            strokeWidth={1}
          />
        );
      })}

      {/* Area fill under the line. */}
      <path d={areaPath} fill="url(#scoreArea)" />

      {/* The trend line, revealed with a stroke-dash animation. */}
      <path
        ref={pathRef}
        d={linePath}
        fill="none"
        stroke="#2dd4bf"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: pathLength || undefined,
          strokeDashoffset: revealed ? 0 : pathLength || undefined,
          transition: "stroke-dashoffset 1200ms ease-out",
        }}
      />

      {/* Data points and value labels. */}
      {points.map((p) => (
        <g key={p.month}>
          <circle cx={p.x} cy={p.y} r={4} fill="#2dd4bf" />
          <text
            x={p.x}
            y={p.y - 10}
            textAnchor="middle"
            className="fill-white/70"
            fontSize={11}
          >
            {p.score}
          </text>
          <text
            x={p.x}
            y={height - padBottom + 20}
            textAnchor="middle"
            className="fill-white/40"
            fontSize={11}
          >
            {p.month}
          </text>
        </g>
      ))}
    </svg>
  );
}
