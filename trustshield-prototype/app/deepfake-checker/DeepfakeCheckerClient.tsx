"use client";

import { useEffect, useRef, useState } from "react";
import {
  ScanFace,
  Upload,
  Film,
  FileImage,
  Volume2,
  CircleCheck,
  CircleAlert,
  Scan,
  ChevronDown,
  Flag,
  ShieldCheck,
  Eye,
  Waves,
  FileSearch,
} from "lucide-react";
import type { DeepfakeExample, DeepfakeVerdict } from "@/lib/types";
import { cn } from "@/lib/utils";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import ProgressBar from "@/components/ProgressBar";
import { deepfakeExamples } from "@/data/mock";

type Phase = "idle" | "checking" | "done";

const MEDIA_ICON: Record<
  DeepfakeExample["mediaType"],
  React.ComponentType<{ className?: string }>
> = {
  video: Film,
  image: FileImage,
  audio: Volume2,
};

const MEDIA_LABEL: Record<DeepfakeExample["mediaType"], string> = {
  video: "Video",
  image: "Image",
  audio: "Audio",
};

interface VerdictStyle {
  /** Headline shown in the result banner. */
  label: string;
  text: string;
  bg: string;
  border: string;
  bar: string;
  icon: React.ComponentType<{ className?: string }>;
  /** true == the content is a likely fake / manipulated. */
  isAlarming: boolean;
}

const VERDICT: Record<DeepfakeVerdict, VerdictStyle> = {
  "likely-ai": {
    label: "Likely AI-generated",
    text: "text-threat",
    bg: "bg-threat/10",
    border: "border-threat/40",
    bar: "bg-threat",
    icon: CircleAlert,
    isAlarming: true,
  },
  "likely-synthetic": {
    label: "Likely synthetic",
    text: "text-threat",
    bg: "bg-threat/10",
    border: "border-threat/40",
    bar: "bg-threat",
    icon: CircleAlert,
    isAlarming: true,
  },
  authentic: {
    label: "Likely authentic — no manipulation detected",
    text: "text-emerald",
    bg: "bg-emerald/10",
    border: "border-emerald/40",
    bar: "bg-emerald",
    icon: CircleCheck,
    isAlarming: false,
  },
};

// Steps shown next to the progress bar while the demo "analyzes" content.
const CHECK_STEPS = [
  "Extracting media frames…",
  "Inspecting visual & audio signals…",
  "Comparing against known AI patterns…",
  "Scoring confidence & compiling report…",
];

const CHECK_DURATION_MS = 2400;

export default function DeepfakeCheckerClient() {
  const [selectedId, setSelectedId] = useState<string>(deepfakeExamples[0].id);
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  // Timers are tracked so an unmount mid-check cleans them up (no state
  // updates after unmount, which would warn in React).
  const timersRef = useRef<number[]>([]);

  const example =
    deepfakeExamples.find((e) => e.id === selectedId) ?? deepfakeExamples[0];

  // Clear any pending timers on unmount.
  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => window.clearTimeout(t));
      timersRef.current = [];
    };
  }, []);

  function clearTimers() {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  }

  function runCheck(id?: string) {
    const targetId = id ?? selectedId;
    clearTimers();
    setSelectedId(targetId);
    setPhase("checking");
    setProgress(0);

    // Animate the progress bar in a few discrete steps, then reveal the result.
    const ticks = [18, 46, 72, 94];
    ticks.forEach((value, index) => {
      const t = window.setTimeout(
        () => setProgress(value),
        (CHECK_DURATION_MS / (ticks.length + 1)) * (index + 1),
      );
      timersRef.current.push(t);
    });

    const done = window.setTimeout(() => {
      setProgress(100);
      setPhase("done");
    }, CHECK_DURATION_MS);
    timersRef.current.push(done);
  }

  // Which analysis step label to show, derived from current progress.
  const activeStep =
    CHECK_STEPS[
      Math.min(
        CHECK_STEPS.length - 1,
        Math.floor((progress / 100) * CHECK_STEPS.length),
      )
    ];

  const verdict = VERDICT[example.verdict];
  const VerdictIcon = verdict.icon;
  const flaggedCount = example.indicators.filter((i) => i.flagged).length;

  // Recommended actions depend on whether the content looks manipulated.
  const recommendedActions = verdict.isAlarming
    ? [
        example.recommendation,
        "Do not forward, pay, or act on this content until you verify it.",
        "Confirm with the person directly using a trusted phone number or in person.",
        "Report the message to the platform it came from.",
      ]
    : [
        example.recommendation,
        "Even authentic-looking media can be used out of context — stay alert.",
        "When money or personal info is involved, confirm through a second channel.",
      ];

  return (
    <>
      <PageHeader
        title="Deepfake Checker"
        description="Upload media to analyze it for AI manipulation. Our model inspects visual, audio, and metadata signals, then explains what it found in plain language."
        icon={<ScanFace className="h-5 w-5" />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* ---- Left column: upload + sample picker --------------------- */}
        <div className="lg:col-span-2">
          <Card className="flex flex-col gap-4">
            {/* Drag-and-drop zone (visual/demo only — no real file processing). */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                // Demo only: a real build would read e.dataTransfer.files here.
                runCheck();
              }}
              className={cn(
                "flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-10 text-center transition-colors",
                dragging
                  ? "border-teal bg-teal/10"
                  : "border-navy-lighter bg-navy-lighter/10",
              )}
            >
              <Upload
                className={cn(
                  "h-8 w-8 transition-colors",
                  dragging ? "text-teal" : "text-teal/80",
                )}
              />
              <p className="mt-3 text-sm font-medium text-white">
                Drag &amp; drop a file to analyze
              </p>
              <p className="mt-1 text-xs text-white/50">
                Images, video, or audio up to 50 MB
              </p>
              <button
                type="button"
                onClick={() => runCheck()}
                disabled={phase === "checking"}
                className={cn(
                  "mt-4 inline-flex items-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-teal/90 disabled:cursor-not-allowed disabled:opacity-60",
                )}
              >
                <Scan className="h-4 w-4" />
                {phase === "checking" ? "Checking…" : "Check Content"}
              </button>
            </div>

            <p className="text-xs font-medium uppercase tracking-wide text-white/40">
              Or try a sample
            </p>
            <ul className="flex flex-col gap-2">
              {deepfakeExamples.map((item) => {
                const Icon = MEDIA_ICON[item.mediaType];
                const active = item.id === selectedId;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => runCheck(item.id)}
                      disabled={phase === "checking"}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors disabled:cursor-not-allowed",
                        active
                          ? "border-teal bg-teal/10 text-white"
                          : "border-navy-lighter/50 text-white/70 hover:border-navy-lighter hover:text-white",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-teal" />
                      <span className="flex-1 truncate">{item.fileName}</span>
                      <span className="shrink-0 rounded-md bg-navy-lighter/60 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/50">
                        {MEDIA_LABEL[item.mediaType]}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>

        {/* ---- Right column: result panel ------------------------------ */}
        <div className="lg:col-span-3">
          <Card className="min-h-full">
            {phase === "checking" ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Scan className="h-10 w-10 animate-pulse text-teal" />
                <p className="mt-4 text-sm font-medium text-white">
                  Analyzing {example.fileName}…
                </p>
                <p className="mt-1 text-xs text-white/50">{activeStep}</p>
                <div className="mt-6 w-full max-w-sm">
                  <ProgressBar value={progress} barClassName="bg-teal" />
                  <p className="mt-2 text-right text-xs font-medium text-teal">
                    {progress}%
                  </p>
                </div>
              </div>
            ) : phase === "idle" ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <ScanFace className="h-10 w-10 text-white/30" />
                <p className="mt-4 text-sm text-white/60">
                  Drop a file or pick a sample, then press{" "}
                  <span className="font-medium text-white/80">Check Content</span>{" "}
                  to see a detection report.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {/* Verdict banner */}
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-4 py-3",
                    verdict.bg,
                    verdict.border,
                  )}
                >
                  <VerdictIcon className={cn("h-6 w-6 shrink-0", verdict.text)} />
                  <div>
                    <p className={cn("font-semibold", verdict.text)}>
                      {verdict.isAlarming
                        ? `${example.confidence}% ${verdict.label.toLowerCase()}`
                        : verdict.label}
                    </p>
                    <p className="text-xs text-white/60">
                      {MEDIA_LABEL[example.mediaType]} · {example.fileName}
                    </p>
                  </div>
                </div>

                {/* Confidence meter */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">
                      Confidence
                    </h3>
                    <span className={cn("text-sm font-semibold", verdict.text)}>
                      {example.confidence}%
                    </span>
                  </div>
                  <ProgressBar
                    value={example.confidence}
                    barClassName={verdict.bar}
                  />
                  <p className="mt-1.5 text-xs text-white/50">
                    {verdict.isAlarming
                      ? `How confident our model is that this content was AI-generated or altered. ${flaggedCount} warning sign${flaggedCount === 1 ? "" : "s"} detected.`
                      : "How confident our model is that this content is genuine."}
                  </p>
                </div>

                {/* Per-indicator breakdown */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-white">
                    Why we think this
                  </h3>
                  <ul className="flex flex-col gap-2.5">
                    {example.indicators.map((indicator) => (
                      <li
                        key={indicator.label}
                        className={cn(
                          "flex items-start gap-3 rounded-lg border px-3 py-2.5",
                          indicator.flagged
                            ? "border-threat/30 bg-threat/5"
                            : "border-emerald/30 bg-emerald/5",
                        )}
                      >
                        {indicator.flagged ? (
                          <Flag className="mt-0.5 h-4 w-4 shrink-0 text-threat" />
                        ) : (
                          <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-white">
                            {indicator.label}
                            <span
                              className={cn(
                                "ml-2 rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                                indicator.flagged
                                  ? "bg-threat/15 text-threat"
                                  : "bg-emerald/15 text-emerald",
                              )}
                            >
                              {indicator.flagged ? "Issue" : "Clear"}
                            </span>
                          </p>
                          <p className="mt-0.5 text-xs text-white/60">
                            {indicator.detail}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommended actions */}
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                    <ShieldCheck className="h-4 w-4 text-teal" />
                    Recommended actions
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {recommendedActions.map((action, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2.5 text-sm text-white/80"
                      >
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* ---- How It Works (expandable) --------------------------------- */}
      <Card className="mt-6">
        <button
          type="button"
          onClick={() => setHowItWorksOpen((open) => !open)}
          aria-expanded={howItWorksOpen}
          className="flex w-full items-center justify-between gap-3 text-left"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-white">
            <FileSearch className="h-4 w-4 text-teal" />
            How It Works
          </span>
          <ChevronDown
            className={cn(
              "h-5 w-5 text-white/50 transition-transform",
              howItWorksOpen && "rotate-180",
            )}
          />
        </button>

        {howItWorksOpen ? (
          <div className="mt-5 grid grid-cols-1 gap-4 border-t border-navy-lighter/50 pt-5 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal/15 text-teal">
                <Eye className="h-4 w-4" />
              </span>
              <p className="text-sm font-medium text-white">Visual analysis</p>
              <p className="text-xs text-white/60">
                We examine lighting, shadows, edges, and facial details frame by
                frame. AI-generated media often leaves tell-tale artifacts a
                human eye can miss.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal/15 text-teal">
                <Waves className="h-4 w-4" />
              </span>
              <p className="text-sm font-medium text-white">Audio analysis</p>
              <p className="text-xs text-white/60">
                For voice and video we check speech pacing, breathing, and sound
                patterns. Cloned voices tend to be too clean and too evenly
                timed to be real.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal/15 text-teal">
                <FileSearch className="h-4 w-4" />
              </span>
              <p className="text-sm font-medium text-white">
                Metadata &amp; scoring
              </p>
              <p className="text-xs text-white/60">
                We inspect the file&apos;s hidden metadata and sensor noise, then
                combine every signal into a single confidence score with the
                reasons behind it.
              </p>
            </div>
            <p className="text-xs text-white/40 sm:col-span-3">
              This is a demonstration prototype. Results are pre-determined
              examples, not a live AI model.
            </p>
          </div>
        ) : null}
      </Card>
    </>
  );
}
