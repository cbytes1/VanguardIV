"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShieldCheck,
  ScanLine,
  Link2,
  Users,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import Card from "@/components/Card";
import CircularGauge from "@/components/CircularGauge";
import AnimatedCounter from "@/components/AnimatedCounter";
import { cn } from "@/lib/utils";
import type { ActivityEvent, DashboardStat, TrustScoreSnapshot } from "@/lib/types";

interface DashboardClientProps {
  trustScore: TrustScoreSnapshot;
  trustScoreLabel: string;
  dashboardStats: DashboardStat[];
  recentActivity: ActivityEvent[];
}

// Map a stat id to the tone color used for its animating number.
const STAT_TONE: Record<DashboardStat["tone"], string> = {
  safe: "text-emerald",
  warning: "text-amber",
  threat: "text-threat",
  accent: "text-teal",
};

// Color-coded severity dot for the activity feed.
const DOT_CLASS: Record<ActivityEvent["severityDot"], string> = {
  red: "bg-threat",
  amber: "bg-amber",
  green: "bg-emerald",
};

export default function DashboardClient({
  trustScore,
  trustScoreLabel,
  dashboardStats,
  recentActivity,
}: DashboardClientProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Trust Score gauge */}
        <TrustScoreCard trustScore={trustScore} label={trustScoreLabel} />

        {/* Threat summary cards (2x2 on the right) */}
        <section
          aria-label="Threat summary"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2"
        >
          {dashboardStats.map((stat) => (
            <SummaryCard key={stat.id} stat={stat} />
          ))}
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent activity feed */}
        <Card className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Recent activity
          </h2>
          <ul className="flex max-h-80 flex-col gap-2 overflow-y-auto pr-1">
            {recentActivity.map((event) => (
              <ActivityRow key={event.id} event={event} />
            ))}
          </ul>
        </Card>

        {/* Quick actions */}
        <QuickActions />
      </div>
    </div>
  );
}

function TrustScoreCard({
  trustScore,
  label,
}: {
  trustScore: TrustScoreSnapshot;
  label: string;
}) {
  const trendingUp = trustScore.trend === "up";
  return (
    <Card className="flex flex-col items-center justify-center gap-4 text-center">
      <div className="flex items-center gap-2 text-white">
        <ShieldCheck className="h-5 w-5 text-emerald" />
        <h2 className="text-lg font-semibold">Family Trust Score</h2>
      </div>

      <CircularGauge value={trustScore.overall} label={label} size={200} />

      {trendingUp ? (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald/10 px-3 py-1 text-sm font-medium text-emerald">
          <TrendingUp className="h-4 w-4" />
          Up {Math.abs(trustScore.change)} points this month
        </span>
      ) : null}
    </Card>
  );
}

function SummaryCard({ stat }: { stat: DashboardStat }) {
  // The spec card values are plain integers; parse so AnimatedCounter can
  // count up to them. Falls back to showing the raw string if non-numeric.
  const numeric = Number(stat.value.replace(/[^0-9.-]/g, ""));
  const isNumeric = Number.isFinite(numeric) && stat.value.trim() !== "";

  return (
    <Card className="flex flex-col gap-2">
      <p className="text-sm text-white/60">{stat.label}</p>
      <span className={cn("text-4xl font-bold", STAT_TONE[stat.tone])}>
        {isNumeric ? <AnimatedCounter value={numeric} /> : stat.value}
      </span>
    </Card>
  );
}

function ActivityRow({ event }: { event: ActivityEvent }) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-navy-lighter/40 bg-navy/40 px-3 py-2.5">
      <span
        className={cn(
          "mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full",
          DOT_CLASS[event.severityDot],
        )}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">
          {event.title}
        </p>
        <p className="truncate text-xs text-white/50">{event.source}</p>
      </div>
      <span className="shrink-0 text-xs text-white/40">
        {event.relativeLabel}
      </span>
    </li>
  );
}

function QuickActions() {
  // "Run Security Scan" plays a short simulated scanning animation.
  const [scanning, setScanning] = useState(false);
  const [scanDone, setScanDone] = useState(false);
  const scanTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const doneTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // "Check a Link" opens a small simulated inline result.
  const [linkChecking, setLinkChecking] = useState(false);
  const [linkResult, setLinkResult] = useState<string | null>(null);
  const linkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up any pending timers on unmount.
  useEffect(() => {
    return () => {
      if (scanTimer.current) clearTimeout(scanTimer.current);
      if (doneTimer.current) clearTimeout(doneTimer.current);
      if (linkTimer.current) clearTimeout(linkTimer.current);
    };
  }, []);

  function runScan() {
    if (scanning) return;
    setScanDone(false);
    setScanning(true);
    scanTimer.current = setTimeout(() => {
      setScanning(false);
      setScanDone(true);
      // Clear the "complete" badge after a few seconds.
      doneTimer.current = setTimeout(() => setScanDone(false), 4000);
    }, 2600);
  }

  function checkLink() {
    if (linkChecking) return;
    setLinkResult(null);
    setLinkChecking(true);
    linkTimer.current = setTimeout(() => {
      setLinkChecking(false);
      setLinkResult("No threats found — this link looks safe.");
    }, 1800);
  }

  return (
    <Card className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-white">Quick actions</h2>

      {/* Run Security Scan */}
      <button
        type="button"
        onClick={runScan}
        disabled={scanning}
        className={cn(
          "group inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
          scanning
            ? "cursor-wait border-teal/40 bg-teal/10 text-teal"
            : "border-navy-lighter/50 bg-navy/40 text-white hover:border-teal/50 hover:bg-teal/10",
        )}
      >
        {scanning ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : scanDone ? (
          <CheckCircle2 className="h-4 w-4 text-emerald" />
        ) : (
          <ScanLine className="h-4 w-4 text-teal" />
        )}
        {scanning
          ? "Scanning devices…"
          : scanDone
            ? "Scan complete — all clear"
            : "Run Security Scan"}
      </button>
      {scanning ? (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-navy-lighter/50">
          <div className="h-full w-1/3 animate-pulse-slow rounded-full bg-teal" />
        </div>
      ) : null}

      {/* Check a Link */}
      <button
        type="button"
        onClick={checkLink}
        disabled={linkChecking}
        className={cn(
          "inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
          linkChecking
            ? "cursor-wait border-teal/40 bg-teal/10 text-teal"
            : "border-navy-lighter/50 bg-navy/40 text-white hover:border-teal/50 hover:bg-teal/10",
        )}
      >
        {linkChecking ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Link2 className="h-4 w-4 text-teal" />
        )}
        {linkChecking ? "Checking link…" : "Check a Link"}
      </button>
      {linkResult ? (
        <p className="flex items-center gap-2 rounded-lg bg-emerald/10 px-3 py-2 text-xs text-emerald">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {linkResult}
        </p>
      ) : null}

      {/* View Family Report */}
      <Link
        href="/family-protection"
        className="inline-flex items-center gap-2 rounded-xl border border-navy-lighter/50 bg-navy/40 px-4 py-3 text-sm font-medium text-white transition-colors hover:border-teal/50 hover:bg-teal/10"
      >
        <Users className="h-4 w-4 text-teal" />
        View Family Report
      </Link>
    </Card>
  );
}
