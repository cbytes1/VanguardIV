"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  Ban,
  Activity,
  Globe,
  Fingerprint,
  Search,
  AlertTriangle,
  Mail,
  MessageSquare,
  History,
  FileLock2,
  KeyRound,
  PhoneCall,
  Database,
  CalendarClock,
  Share2,
  Download,
  Trash2,
  ScrollText,
  ShieldCheck,
  X,
} from "lucide-react";
import type { PrivacyMonitorItem } from "@/lib/types";
import { cn, formatDateTime } from "@/lib/utils";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import { auditLog, dataDashboard, privacyMonitorItems } from "@/data/mock";

// ---------------------------------------------------------------------------
// Icon mapping: give each privacy monitor item a recognizable glyph. Keyed by
// the stable mock ids so the lists stay in sync with data/mock.ts.
// ---------------------------------------------------------------------------
const ITEM_ICONS: Record<string, typeof Activity> = {
  // Analyzed
  "pm-a1": Activity, // Traffic patterns
  "pm-a2": Globe, // Connection metadata
  "pm-a3": Fingerprint, // Device fingerprints
  "pm-a4": Search, // DNS queries
  "pm-a5": AlertTriangle, // Behavioral anomalies
  // Never seen
  "pm-n1": Mail, // Email content
  "pm-n2": MessageSquare, // Message text
  "pm-n3": History, // Browsing history details
  "pm-n4": FileLock2, // File contents
  "pm-n5": KeyRound, // Passwords
  "pm-n6": PhoneCall, // Personal communications
};

// Each analyzed capability maps to a per-feature monitoring toggle.
const FEATURE_TOGGLES = [
  { id: "pm-a1", label: "Traffic pattern analysis" },
  { id: "pm-a2", label: "Connection metadata checks" },
  { id: "pm-a3", label: "Device fingerprinting" },
  { id: "pm-a4", label: "DNS query filtering" },
  { id: "pm-a5", label: "Behavioral anomaly detection" },
] as const;

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  disabled?: boolean;
}

/** Reusable switch — the same pattern the original Privacy Center used. */
function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal/60",
        checked ? "bg-emerald" : "bg-navy-lighter",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-full bg-white transition-transform",
          checked ? "translate-x-5" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

export default function PrivacyCenterClient() {
  const analyzed = useMemo(
    () => privacyMonitorItems.filter((i) => i.kind === "analyzed"),
    [],
  );
  const neverSeen = useMemo(
    () => privacyMonitorItems.filter((i) => i.kind === "never-seen"),
    [],
  );

  // --- Foggy-glass slider: 0 = fully clear, 100 = fully fogged ------------
  const [fog, setFog] = useState(70);
  const blurPx = (fog / 100) * 14; // 0px .. 14px of CSS blur

  // --- Monitoring toggles --------------------------------------------------
  const [features, setFeatures] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(FEATURE_TOGGLES.map((f) => [f.id, true])),
  );

  const enabledCount = useMemo(
    () => Object.values(features).filter(Boolean).length,
    [features],
  );
  // Master is "on" only when every per-feature toggle is on.
  const masterOn = enabledCount === FEATURE_TOGGLES.length;

  const toggleFeature = (id: string) =>
    setFeatures((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleMaster = () => {
    const next = !masterOn;
    setFeatures(Object.fromEntries(FEATURE_TOGGLES.map((f) => [f.id, next])));
  };

  // --- Data controls -------------------------------------------------------
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [downloadState, setDownloadState] = useState<"idle" | "working" | "done">(
    "idle",
  );
  const [deleted, setDeleted] = useState(false);

  // Simulated "download" — flips to a short-lived "done" state, no real file.
  useEffect(() => {
    if (downloadState !== "working") return;
    const t = setTimeout(() => setDownloadState("done"), 1200);
    return () => clearTimeout(t);
  }, [downloadState]);

  useEffect(() => {
    if (downloadState !== "done") return;
    const t = setTimeout(() => setDownloadState("idle"), 2500);
    return () => clearTimeout(t);
  }, [downloadState]);

  // Close the confirm dialog on Escape for accessibility.
  useEffect(() => {
    if (!confirmDelete) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setConfirmDelete(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirmDelete]);

  const confirmDeletion = () => {
    // Simulated deletion only — clears the dashboard view in local state.
    setDeleted(true);
    setConfirmDelete(false);
  };

  const dashboardCards = [
    {
      icon: Database,
      label: "Data collected",
      value: deleted ? "0 MB — cleared" : dataDashboard.collectedLabel,
      tone: "text-teal",
    },
    {
      icon: CalendarClock,
      label: "Data retention",
      value: dataDashboard.retentionLabel,
      tone: "text-amber",
    },
    {
      icon: Share2,
      label: "Data shared",
      value: dataDashboard.sharedLabel,
      tone: "text-emerald",
    },
  ];

  return (
    <>
      <PageHeader
        title="Privacy Center"
        description="Total transparency: see exactly what TrustShield analyzes, what it can never see, and take control of your data at any time."
        icon={<Lock className="h-5 w-5" />}
        action={
          <span className="inline-flex items-center gap-2 rounded-lg border border-emerald/40 bg-emerald/10 px-3 py-2 text-sm font-medium text-emerald">
            <ShieldCheck className="h-4 w-4" />
            {enabledCount}/{FEATURE_TOGGLES.length} protections on
          </span>
        }
      />

      {/* --- Two-column transparency model ---------------------------------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-teal/30">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal/15 text-teal">
              <Eye className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-white">
                What We Analyze
              </h2>
              <p className="text-xs text-white/50">
                Metadata only — never the contents.
              </p>
            </div>
          </div>
          <ul className="flex flex-col gap-3">
            {analyzed.map((item) => (
              <TransparencyRow key={item.id} item={item} />
            ))}
          </ul>
        </Card>

        <Card className="border-threat/30">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-threat/15 text-threat">
              <EyeOff className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-white">
                What We Never See
              </h2>
              <p className="text-xs text-white/50">
                Off-limits by design — not collected, ever.
              </p>
            </div>
          </div>
          <ul className="flex flex-col gap-3">
            {neverSeen.map((item) => (
              <TransparencyRow key={item.id} item={item} />
            ))}
          </ul>
        </Card>
      </div>

      {/* --- Interactive foggy-glass visualization -------------------------- */}
      <Card className="mt-6">
        <div className="mb-5 flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-white">
            The Foggy Glass
          </h2>
          <p className="max-w-2xl text-sm text-white/60">
            TrustShield only ever sees a blurred, anonymized shape of your
            activity. Drag the slider to compare what we see with what we never
            see.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Fogged pane — what TrustShield sees */}
          <div className="relative overflow-hidden rounded-xl border border-teal/30 bg-navy/60 p-5">
            <div className="relative h-44">
              <FoggyScene />
              {/* Frosted glass overlay driven by the slider */}
              <div
                className="pointer-events-none absolute inset-0 rounded-lg"
                style={{
                  backdropFilter: `blur(${blurPx}px)`,
                  WebkitBackdropFilter: `blur(${blurPx}px)`,
                  backgroundColor: `rgba(13, 20, 38, ${0.08 + (fog / 100) * 0.28})`,
                }}
              />
            </div>
            <p className="mt-3 flex items-center gap-2 text-sm font-medium text-teal">
              <Eye className="h-4 w-4" />
              This is what TrustShield sees
            </p>
          </div>

          {/* Clear pane — what TrustShield never sees */}
          <div className="relative overflow-hidden rounded-xl border border-threat/30 bg-navy/60 p-5">
            <div className="relative h-44">
              <ClearScene />
            </div>
            <p className="mt-3 flex items-center gap-2 text-sm font-medium text-threat">
              <Ban className="h-4 w-4" />
              This is what TrustShield NEVER sees
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-xs text-white/50">
            <span>Clear view</span>
            <span className="font-medium text-white/70">
              Privacy fog: {fog}%
            </span>
            <span>Fully fogged</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={fog}
            onChange={(e) => setFog(Number(e.target.value))}
            aria-label="Adjust the privacy fog to compare what TrustShield sees"
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-navy-lighter accent-teal"
          />
        </div>
      </Card>

      {/* --- Data dashboard ------------------------------------------------- */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {dashboardCards.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.label} className="flex flex-col gap-3">
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg bg-navy-lighter/50",
                  c.tone,
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <p className="text-sm text-white/60">{c.label}</p>
              <p className="text-base font-semibold text-white">{c.value}</p>
            </Card>
          );
        })}
      </div>

      {/* --- Controls + Audit log ------------------------------------------ */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Monitoring controls */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="mb-1 text-lg font-semibold text-white">
              Monitoring controls
            </h2>
            <p className="mb-4 text-sm text-white/55">
              You are always in charge. Turn protections on or off at any time.
            </p>

            {/* Master toggle */}
            <div className="flex items-center gap-4 rounded-xl border border-teal/30 bg-teal/5 px-4 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal/15 text-teal">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-white">All monitoring</p>
                <p className="text-sm text-white/55">
                  {masterOn
                    ? "Every protection is active."
                    : "Some protections are paused."}
                </p>
              </div>
              <Toggle
                checked={masterOn}
                onChange={toggleMaster}
                label="Toggle all monitoring"
              />
            </div>

            {/* Per-feature toggles */}
            <ul className="mt-2 flex flex-col divide-y divide-navy-lighter/40">
              {FEATURE_TOGGLES.map((f) => (
                <li
                  key={f.id}
                  className="flex items-center gap-4 py-3.5 last:pb-0"
                >
                  <p className="min-w-0 flex-1 text-sm text-white/85">
                    {f.label}
                  </p>
                  <Toggle
                    checked={features[f.id]}
                    onChange={() => toggleFeature(f.id)}
                    label={`Toggle ${f.label}`}
                  />
                </li>
              ))}
            </ul>

            {/* Data controls */}
            <div className="mt-5 flex flex-col gap-3 border-t border-navy-lighter/40 pt-5 sm:flex-row">
              <button
                type="button"
                onClick={() =>
                  downloadState === "idle" && setDownloadState("working")
                }
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
                  "border-teal/40 bg-teal/10 text-teal hover:bg-teal/20",
                )}
              >
                <Download className="h-4 w-4" />
                {downloadState === "working"
                  ? "Preparing…"
                  : downloadState === "done"
                    ? "Export ready"
                    : "Download My Data"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-threat/40 bg-threat/10 px-4 py-2.5 text-sm font-medium text-threat transition-colors hover:bg-threat/20"
              >
                <Trash2 className="h-4 w-4" />
                Delete All My Data
              </button>
            </div>
          </Card>
        </div>

        {/* Audit log */}
        <div>
          <Card>
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-lighter/50 text-white/70">
                <ScrollText className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-white">Audit log</h2>
                <p className="text-xs text-white/50">
                  Every data access, with a reason.
                </p>
              </div>
            </div>
            <ol className="flex flex-col gap-3">
              {auditLog.map((entry) => (
                <li
                  key={entry.id}
                  className="rounded-lg border border-navy-lighter/40 bg-navy/40 px-3 py-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-white">
                      {entry.dataAccessed}
                    </p>
                    <time className="shrink-0 text-xs text-white/40">
                      {formatDateTime(entry.timestamp)}
                    </time>
                  </div>
                  <p className="mt-1 text-xs text-white/55">{entry.reason}</p>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>

      {/* --- Delete confirmation dialog ------------------------------------ */}
      {confirmDelete ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setConfirmDelete(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-threat/40 bg-navy-light p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-threat/15 text-threat">
                  <AlertTriangle className="h-5 w-5" />
                </span>
                <h3
                  id="delete-dialog-title"
                  className="text-lg font-semibold text-white"
                >
                  Delete all your data?
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close dialog"
                onClick={() => setConfirmDelete(false)}
                className="text-white/50 transition-colors hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-white/60">
              This permanently removes the anonymized traffic patterns
              TrustShield has stored for your household. This action cannot be
              undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="rounded-lg border border-navy-lighter/60 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-navy-lighter/40"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeletion}
                className="inline-flex items-center gap-2 rounded-lg bg-threat px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-threat/90"
              >
                <Trash2 className="h-4 w-4" />
                Delete everything
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** One row in the two-column transparency model. */
function TransparencyRow({ item }: { item: PrivacyMonitorItem }) {
  const analyzed = item.kind === "analyzed";
  const Icon = ITEM_ICONS[item.id] ?? Activity;
  return (
    <li className="flex items-start gap-3 rounded-lg border border-navy-lighter/40 bg-navy/40 px-3 py-2.5">
      <span
        className={cn(
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          analyzed ? "bg-teal/15 text-teal" : "bg-threat/15 text-threat",
        )}
      >
        {analyzed ? (
          <Icon className="h-4 w-4" />
        ) : (
          <span className="relative inline-flex h-4 w-4 items-center justify-center">
            <Icon className="h-4 w-4 opacity-60" />
            <Ban className="absolute h-4 w-4" />
          </span>
        )}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-white">{item.label}</p>
        <p className="mt-0.5 text-xs text-white/55">{item.explanation}</p>
      </div>
    </li>
  );
}

/** Blurry decorative shapes — the "what TrustShield sees" scene. */
function FoggyScene() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-lg">
      <div className="absolute left-6 top-6 h-16 w-16 rounded-full bg-teal/50" />
      <div className="absolute right-10 top-10 h-20 w-20 rounded-2xl bg-emerald/40" />
      <div className="absolute bottom-6 left-16 h-14 w-28 rounded-xl bg-amber/40" />
      <div className="absolute bottom-8 right-6 h-12 w-12 rounded-full bg-white/30" />
      <div className="absolute left-1/2 top-1/2 h-10 w-40 -translate-x-1/2 -translate-y-1/2 rounded bg-white/15" />
    </div>
  );
}

/** Crisp, readable content — the "what TrustShield never sees" scene. */
function ClearScene() {
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-2 rounded-lg bg-navy-light/70 px-4 font-mono text-[11px] leading-relaxed text-white/80">
      <p>
        <span className="text-white/40">To:</span> mom@johnsonfamily.net
      </p>
      <p>
        <span className="text-white/40">Subject:</span> Emma&apos;s recital
        tonight 🎻
      </p>
      <p className="text-white/70">
        &quot;Don&apos;t forget to pick up Alex at 5. Password is
        <span className="rounded bg-threat/20 px-1 text-threat"> hunter2 </span>
        for the portal.&quot;
      </p>
      <p className="text-white/40">— bank balance, chats, photos, history —</p>
    </div>
  );
}
