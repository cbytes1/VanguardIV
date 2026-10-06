"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Eye,
  Router,
  Smartphone,
  Laptop,
  Tv,
  Camera,
  Thermometer,
  Speaker,
  Tablet,
  Gamepad2,
  CircleHelp,
  Activity,
} from "lucide-react";
import type {
  DeviceType,
  LiveThreat,
  LiveThreatAction,
  LiveThreatType,
  Severity,
} from "@/lib/types";
import { cn, formatDateTime, severityStyle } from "@/lib/utils";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import { devices, liveThreats } from "@/data/mock";

// -----------------------------------------------------------------------------
// Tuning knobs for the live simulation. Kept at module scope so they are easy
// for the Vanguard IV team to tweak.
// -----------------------------------------------------------------------------

/** How often a new threat is appended to the live feed (ms). */
const FEED_INTERVAL_MS = 3200;
/** Entries shown before the oldest ones scroll off (keeps memory bounded). */
const MAX_FEED_LENGTH = 12;
/** How many entries are visible on the very first (server + client) render. */
const SEED_COUNT = 4;

// -----------------------------------------------------------------------------
// Deterministic helpers.
//
// The server render and the first client render MUST be identical, so nothing
// here touches Date.now(), Math.random(), or new Date() at render time. The
// feed is seeded straight from the mock pool, and the layout/pulse choices are
// derived from stable indices. New timestamps are only generated inside the
// interval, which runs after hydration.
// -----------------------------------------------------------------------------

/**
 * Derive a severity from a live threat so the severity filter has something to
 * work with (LiveThreat has no severity field of its own). Pure + stable.
 */
function liveSeverity(threat: LiveThreat): Severity {
  if (threat.action === "monitoring") return "low";
  if (threat.threatType === "malware") return "high";
  if (threat.threatType === "phishing") {
    return threat.action === "blocked" ? "high" : "medium";
  }
  if (threat.threatType === "scam") return "medium";
  return "low"; // suspicious
}

/**
 * Map a live threat to a device id, so the device filter works. Matches on the
 * source text when it names a device, otherwise falls back to a stable hash so
 * every entry belongs to exactly one device.
 */
function liveDeviceId(threat: LiveThreat): string {
  const named = devices.find((d) =>
    threat.source.toLowerCase().includes(d.name.toLowerCase()),
  );
  if (named) return named.id;
  // Stable hash of the id -> device, so the mapping never changes between
  // renders (important for hydration parity).
  let hash = 0;
  for (let i = 0; i < threat.id.length; i += 1) {
    hash = (hash * 31 + threat.id.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % devices.length;
  return devices[index].id;
}

// Device-type -> icon, matching the lucide usage elsewhere in the app.
const DEVICE_ICONS: Record<DeviceType, React.ComponentType<{ className?: string }>> = {
  phone: Smartphone,
  laptop: Laptop,
  tv: Tv,
  camera: Camera,
  thermostat: Thermometer,
  speaker: Speaker,
  tablet: Tablet,
  console: Gamepad2,
  other: CircleHelp,
};

const THREAT_TYPE_LABELS: Record<LiveThreatType, string> = {
  phishing: "Phishing",
  malware: "Malware",
  scam: "Scam",
  suspicious: "Suspicious",
};

const ACTION_STYLES: Record<
  LiveThreatAction,
  { label: string; text: string; bg: string; border: string }
> = {
  blocked: {
    label: "Blocked",
    text: "text-emerald",
    bg: "bg-emerald/10",
    border: "border-emerald/40",
  },
  warned: {
    label: "Warned",
    text: "text-amber",
    bg: "bg-amber/10",
    border: "border-amber/40",
  },
  monitoring: {
    label: "Monitoring",
    text: "text-teal",
    bg: "bg-teal/10",
    border: "border-teal/40",
  },
};

// -----------------------------------------------------------------------------
// A feed entry is a LiveThreat plus the deterministic metadata we derived once.
// -----------------------------------------------------------------------------

interface FeedEntry extends LiveThreat {
  severity: Severity;
  deviceId: string;
}

function toFeedEntry(threat: LiveThreat): FeedEntry {
  return {
    ...threat,
    severity: liveSeverity(threat),
    deviceId: liveDeviceId(threat),
  };
}

// The seed list: the first SEED_COUNT pool entries, newest first. Computed once
// at module load so the server and first client render produce the exact same
// markup (no hydration mismatch).
const SEED_FEED: FeedEntry[] = liveThreats
  .slice(0, SEED_COUNT)
  .map(toFeedEntry);

// Filter option definitions.
const TYPE_FILTERS: { value: LiveThreatType | "all"; label: string }[] = [
  { value: "all", label: "All types" },
  { value: "phishing", label: "Phishing" },
  { value: "malware", label: "Malware" },
  { value: "scam", label: "Scam" },
  { value: "suspicious", label: "Suspicious" },
];

const SEVERITY_FILTERS: { value: Severity | "all"; label: string }[] = [
  { value: "all", label: "All severities" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export default function ThreatMonitorClient() {
  // ---- Live feed state --------------------------------------------------
  const [feed, setFeed] = useState<FeedEntry[]>(SEED_FEED);

  // Filters.
  const [typeFilter, setTypeFilter] = useState<LiveThreatType | "all">("all");
  const [severityFilter, setSeverityFilter] = useState<Severity | "all">("all");
  const [deviceFilter, setDeviceFilter] = useState<string>("all");

  // The pool cursor advances as new entries arrive. It starts just past the
  // seed so the first appended entry is genuinely new. Held in a ref because it
  // changes only inside the interval, never during render.
  const cursorRef = useRef<number>(SEED_COUNT);
  // Monotonic counter guaranteeing unique React keys for appended entries.
  const serialRef = useRef<number>(0);

  // ---- Append a new feed entry on an interval (post-hydration only) -----
  useEffect(() => {
    const interval = setInterval(() => {
      const pool = liveThreats;
      const base = pool[cursorRef.current % pool.length];
      cursorRef.current += 1;
      serialRef.current += 1;

      // Give the appended entry a fresh timestamp and a unique id so it reads
      // as a live event. This runs only after hydration, so using the real
      // clock here cannot cause a server/client mismatch.
      const entry: FeedEntry = {
        ...toFeedEntry(base),
        id: `live-stream-${serialRef.current}`,
        timestamp: new Date().toISOString(),
      };

      setFeed((prev) => [entry, ...prev].slice(0, MAX_FEED_LENGTH));
    }, FEED_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  // ---- Derived: filtered feed ------------------------------------------
  const filteredFeed = useMemo(() => {
    return feed.filter((entry) => {
      if (typeFilter !== "all" && entry.threatType !== typeFilter) return false;
      if (severityFilter !== "all" && entry.severity !== severityFilter) {
        return false;
      }
      if (deviceFilter !== "all" && entry.deviceId !== deviceFilter) return false;
      return true;
    });
  }, [feed, typeFilter, severityFilter, deviceFilter]);

  // ---- Derived: real-time counters (recomputed as the feed grows) -------
  const stats = useMemo(() => {
    let detected = 0;
    let blocked = 0;
    let warnings = 0;
    for (const entry of feed) {
      detected += 1;
      if (entry.action === "blocked") blocked += 1;
      if (entry.action === "warned") warnings += 1;
    }
    return { detected, blocked, warnings };
  }, [feed]);

  // Device ids that currently have a visible threat in the (filtered) feed —
  // used to light up the matching node on the network map.
  const flaggedDeviceIds = useMemo(
    () => new Set(filteredFeed.map((entry) => entry.deviceId)),
    [filteredFeed],
  );

  const activeFilterCount =
    (typeFilter !== "all" ? 1 : 0) +
    (severityFilter !== "all" ? 1 : 0) +
    (deviceFilter !== "all" ? 1 : 0);

  return (
    <>
      <PageHeader
        title="Threat Monitor"
        description="A live view of your home network: traffic being scanned in real time, with every blocked threat explained in plain language."
        icon={<ShieldAlert className="h-5 w-5" />}
        action={
          <span className="inline-flex items-center gap-2 rounded-lg border border-emerald/40 bg-emerald/10 px-3 py-2 text-sm font-medium text-emerald">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald/70 animate-ping-soft" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald" />
            </span>
            Live · protection active
          </span>
        }
      />

      {/* Real-time statistics -------------------------------------------- */}
      <section
        aria-label="Today's threat statistics"
        className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        <StatTile
          label="Threats detected"
          value={stats.detected}
          icon={<Activity className="h-5 w-5" />}
          tone="accent"
        />
        <StatTile
          label="Threats blocked"
          value={stats.blocked}
          icon={<ShieldCheck className="h-5 w-5" />}
          tone="safe"
        />
        <StatTile
          label="Warnings issued"
          value={stats.warnings}
          icon={<Eye className="h-5 w-5" />}
          tone="warning"
        />
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Network map ---------------------------------------------------- */}
        <div className="lg:col-span-3">
          <Card className="h-full">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Home network
                </h2>
                <p className="text-sm text-white/55">
                  Traffic is scanned as it flows. Green pulses are safe; a red
                  pulse is a blocked threat.
                </p>
              </div>
            </div>
            <NetworkMap flaggedDeviceIds={flaggedDeviceIds} />
          </Card>
        </div>

        {/* Live feed ------------------------------------------------------ */}
        <div className="lg:col-span-2">
          <Card className="flex h-full flex-col">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">
                Live threat feed
              </h2>
              <span className="text-xs text-white/45">
                {filteredFeed.length} shown
              </span>
            </div>

            {/* Filters */}
            <div className="mb-4 flex flex-col gap-3">
              <FilterGroup
                label="Type"
                options={TYPE_FILTERS}
                value={typeFilter}
                onChange={(v) => setTypeFilter(v as LiveThreatType | "all")}
              />
              <FilterGroup
                label="Severity"
                options={SEVERITY_FILTERS}
                value={severityFilter}
                onChange={(v) => setSeverityFilter(v as Severity | "all")}
              />
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-white/40">
                  Device
                </span>
                <select
                  value={deviceFilter}
                  onChange={(e) => setDeviceFilter(e.target.value)}
                  aria-label="Filter feed by device"
                  className="rounded-lg border border-navy-lighter/60 bg-navy px-3 py-2 text-sm text-white/80 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
                >
                  <option value="all">All devices</option>
                  {devices.map((device) => (
                    <option key={device.id} value={device.id}>
                      {device.name}
                    </option>
                  ))}
                </select>
              </div>
              {activeFilterCount > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    setTypeFilter("all");
                    setSeverityFilter("all");
                    setDeviceFilter("all");
                  }}
                  className="self-start text-xs font-medium text-teal hover:underline"
                >
                  Clear filters ({activeFilterCount})
                </button>
              ) : null}
            </div>

            {/* Feed list */}
            <div className="flex-1 overflow-hidden">
              {filteredFeed.length > 0 ? (
                <ul className="flex flex-col gap-3">
                  {filteredFeed.map((entry) => (
                    <FeedItem key={entry.id} entry={entry} />
                  ))}
                </ul>
              ) : (
                <p className="py-8 text-center text-sm text-white/50">
                  No live events match these filters.
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

// -----------------------------------------------------------------------------
// Real-time statistic tile.
// -----------------------------------------------------------------------------

const STAT_TONES: Record<string, string> = {
  accent: "text-teal",
  safe: "text-emerald",
  warning: "text-amber",
};

function StatTile({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: "accent" | "safe" | "warning";
}) {
  return (
    <Card className="flex items-center gap-4">
      <span
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-xl bg-navy-lighter/40",
          STAT_TONES[tone],
        )}
      >
        {icon}
      </span>
      <div>
        {/* Updates whenever the feed grows; tabular-nums keeps width steady. */}
        <p className={cn("text-2xl font-semibold tabular-nums", STAT_TONES[tone])}>
          {value}
        </p>
        <p className="text-sm text-white/55">{label}</p>
      </div>
    </Card>
  );
}

// -----------------------------------------------------------------------------
// Pill-style filter group.
// -----------------------------------------------------------------------------

function FilterGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-white/40">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label={`Filter by ${label}`}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                selected
                  ? "border-teal bg-teal/15 text-teal"
                  : "border-navy-lighter/50 text-white/60 hover:border-navy-lighter hover:text-white",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// A single live-feed row. The newest row fades in via the shared keyframe.
// -----------------------------------------------------------------------------

function FeedItem({ entry }: { entry: FeedEntry }) {
  const action = ACTION_STYLES[entry.action];
  const sev = severityStyle(entry.severity);
  return (
    <li className="animate-fade-in rounded-xl border border-navy-lighter/50 bg-navy/40 p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2 shrink-0 rounded-full", sev.dot)} />
          <span className="text-sm font-medium text-white">
            {THREAT_TYPE_LABELS[entry.threatType]}
          </span>
        </div>
        <span
          className={cn(
            "rounded-full border px-2 py-0.5 text-xs font-medium",
            action.border,
            action.bg,
            action.text,
          )}
        >
          {action.label}
        </span>
      </div>
      <p className="mt-1.5 truncate text-xs text-white/55" title={entry.source}>
        {entry.source}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-white/70">
        {entry.aiExplanation}
      </p>
      <p className="mt-1.5 text-[11px] uppercase tracking-wide text-white/35">
        {formatDateTime(entry.timestamp)}
      </p>
    </li>
  );
}

// -----------------------------------------------------------------------------
// Animated home-network map.
//
// A central gateway with the 12 devices laid out on a ring around it. SVG
// connector lines carry a repeating "pulse" dot (CSS keyframes), mostly green
// with the occasional red one to represent a blocked threat. Devices currently
// implicated in a visible feed entry glow red; the rest glow green.
// -----------------------------------------------------------------------------

function NetworkMap({ flaggedDeviceIds }: { flaggedDeviceIds: Set<string> }) {
  // The map is a fixed-aspect SVG so positions are deterministic (no layout
  // measurement, so server and client agree).
  const WIDTH = 760;
  const HEIGHT = 440;
  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;
  const radius = 165;

  // Which connections show a red (threat) pulse. Deterministic: every 5th
  // device, so it does not depend on random values at render time.
  const positioned = useMemo(() => {
    return devices.map((device, index) => {
      const angle = (index / devices.length) * Math.PI * 2 - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      const threatPulse = index % 5 === 2; // sparse red pulses
      return { device, x, y, threatPulse };
    });
  }, [cx, cy]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-navy/40">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full"
        role="img"
        aria-label="Home network map showing the gateway connected to twelve devices with live traffic being scanned"
      >
        {/* Connections + traveling pulses */}
        {positioned.map(({ device, x, y, threatPulse }, index) => {
          const flagged = flaggedDeviceIds.has(device.id);
          const pulseIsRed = threatPulse || flagged;
          const pulseColor = pulseIsRed ? "#EF4444" : "#10B981";
          const lineColor = pulseIsRed
            ? "rgba(239,68,68,0.35)"
            : "rgba(16,185,129,0.22)";
          // Stagger the pulses so they do not all move in lockstep.
          const delay = (index * 0.37).toFixed(2);
          return (
            <g key={device.id}>
              <line
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                stroke={lineColor}
                strokeWidth={1.5}
              />
              {/* A dot that animates from the gateway out to the device. */}
              <circle r={4} fill={pulseColor}>
                <animateMotion
                  dur="2.4s"
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                  keyPoints="0;1"
                  keyTimes="0;1"
                  calcMode="linear"
                  path={`M ${cx} ${cy} L ${x} ${y}`}
                />
                <animate
                  attributeName="opacity"
                  dur="2.4s"
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                  values="0;1;1;0"
                  keyTimes="0;0.1;0.85;1"
                />
              </circle>
            </g>
          );
        })}

        {/* Gateway (center) */}
        <g>
          <circle
            cx={cx}
            cy={cy}
            r={46}
            className="fill-teal/10 stroke-teal/60"
            strokeWidth={2}
          />
          <circle
            cx={cx}
            cy={cy}
            r={46}
            className="fill-none stroke-teal/40 animate-ping-soft"
            strokeWidth={2}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />
        </g>
      </svg>

      {/* Device + gateway labels/icons are HTML overlaid on the SVG so we can
          reuse the lucide icons and Tailwind tokens. Positioned by percentage
          to track the viewBox. */}
      <div className="pointer-events-none absolute inset-0">
        {/* Gateway label */}
        <NodeChip
          xPct={(cx / WIDTH) * 100}
          yPct={(cy / HEIGHT) * 100}
          label="Gateway"
          tone="gateway"
          icon={<Router className="h-5 w-5" />}
        />
        {positioned.map(({ device, x, y }) => {
          const Icon = DEVICE_ICONS[device.type];
          const flagged = flaggedDeviceIds.has(device.id);
          return (
            <NodeChip
              key={device.id}
              xPct={(x / WIDTH) * 100}
              yPct={(y / HEIGHT) * 100}
              label={device.name}
              tone={flagged ? "threat" : "safe"}
              icon={<Icon className="h-4 w-4" />}
            />
          );
        })}
      </div>
    </div>
  );
}

function NodeChip({
  xPct,
  yPct,
  label,
  tone,
  icon,
}: {
  xPct: number;
  yPct: number;
  label: string;
  tone: "gateway" | "safe" | "threat";
  icon: React.ReactNode;
}) {
  const toneStyles =
    tone === "gateway"
      ? "border-teal/60 bg-navy text-teal"
      : tone === "threat"
        ? "border-threat/60 bg-navy text-threat"
        : "border-emerald/50 bg-navy text-emerald";
  return (
    <div
      className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
      style={{ left: `${xPct}%`, top: `${yPct}%` }}
    >
      <span
        className={cn(
          "flex items-center justify-center rounded-full border",
          toneStyles,
          tone === "gateway" ? "h-12 w-12" : "h-9 w-9",
          tone === "threat" && "animate-pulse-slow",
        )}
      >
        {icon}
      </span>
      <span className="max-w-[88px] truncate rounded bg-navy/80 px-1.5 py-0.5 text-center text-[10px] leading-tight text-white/70">
        {label}
      </span>
    </div>
  );
}
