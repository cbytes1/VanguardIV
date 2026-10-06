"use client";

import { useMemo, useState } from "react";
import {
  Users,
  Smartphone,
  ShieldAlert,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Mail,
  Bell,
  MonitorSmartphone,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import ProgressBar from "@/components/ProgressBar";
import SeverityBadge from "@/components/SeverityBadge";
import { familyMembers } from "@/data/mock";
import { cn, formatDateTime, scoreTone } from "@/lib/utils";
import type {
  FamilyMember,
  FamilyMemberSettings,
  NotifyChannels,
  Severity,
} from "@/lib/types";

// ---------------------------------------------------------------------------
// Reusable toggle switch (same pattern used in PrivacyCenterClient.tsx).
// ---------------------------------------------------------------------------

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
        checked ? "bg-emerald" : "bg-navy-lighter",
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

// ---------------------------------------------------------------------------
// Protection setting metadata — human-friendly label + description per key.
// Only keys present in a member's `settings` object are shown for them.
// ---------------------------------------------------------------------------

const SETTING_META: Record<
  keyof FamilyMemberSettings,
  { label: string; description: string }
> = {
  safeSearch: {
    label: "SafeSearch",
    description: "Filter explicit results out of web and image searches.",
  },
  socialMonitoring: {
    label: "Social media monitoring",
    description: "Watch for risky contacts and harmful content on social apps.",
  },
  screenTimeVisible: {
    label: "Screen time visibility",
    description: "Show daily usage so guardians can keep an eye on balance.",
  },
  contentFiltering: {
    label: "Content filtering",
    description: "Block age-inappropriate websites, videos, and apps.",
  },
  appRestrictions: {
    label: "App restrictions",
    description: "Require approval before new apps can be installed or used.",
  },
};

const SETTING_ORDER: Array<keyof FamilyMemberSettings> = [
  "safeSearch",
  "socialMonitoring",
  "screenTimeVisible",
  "contentFiltering",
  "appRestrictions",
];

const SEVERITY_LEVELS: Severity[] = ["safe", "low", "medium", "high", "critical"];

// Map a member's palette-token avatarColor to a static Tailwind class so the
// JIT compiler can see the full class name (dynamic `bg-${x}` strings are
// purged). Falls back to a neutral bubble for unknown tokens.
const AVATAR_BG: Record<string, string> = {
  teal: "bg-teal/25",
  cyan: "bg-cyan/25",
  emerald: "bg-emerald/25",
  amber: "bg-amber/25",
  threat: "bg-threat/25",
};

function avatarBg(color: string): string {
  return AVATAR_BG[color] ?? "bg-navy-lighter/60";
}

// ---------------------------------------------------------------------------
// Family Trust Digest — a weekly-email preview, one row per member. Static
// demo figures that mirror the household's recent activity.
// ---------------------------------------------------------------------------

interface DigestRow {
  memberId: string;
  threatsBlocked: number;
  newRisks: number;
  recommendedAction: string;
  scoreChange: number;
}

const DIGEST_ROWS: DigestRow[] = [
  {
    memberId: "fam-dad",
    threatsBlocked: 6,
    newRisks: 0,
    recommendedAction: "No action needed — all devices healthy.",
    scoreChange: 2,
  },
  {
    memberId: "fam-mom",
    threatsBlocked: 5,
    newRisks: 1,
    recommendedAction: "Reset password exposed in a retail breach.",
    scoreChange: -1,
  },
  {
    memberId: "fam-alex",
    threatsBlocked: 9,
    newRisks: 1,
    recommendedAction: "Review the malware download blocked on the gaming PC.",
    scoreChange: 3,
  },
  {
    memberId: "fam-emma",
    threatsBlocked: 3,
    newRisks: 0,
    recommendedAction: "Keep content filtering on — working as expected.",
    scoreChange: 1,
  },
];

function ScoreChange({ change }: { change: number }) {
  const Icon = change > 0 ? TrendingUp : change < 0 ? TrendingDown : Minus;
  const tone =
    change > 0 ? "text-emerald" : change < 0 ? "text-threat" : "text-white/50";
  const sign = change > 0 ? "+" : "";
  return (
    <span className={cn("inline-flex items-center gap-1 font-medium", tone)}>
      <Icon className="h-3.5 w-3.5" />
      {sign}
      {change}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Local editable copy of the pieces of a member we let the demo change:
// their protection settings and their alert-notification preferences.
// ---------------------------------------------------------------------------

interface MemberState {
  settings: FamilyMemberSettings;
  notifyChannels: NotifyChannels;
  notifySeverity: Severity;
}

function initialState(members: FamilyMember[]): Record<string, MemberState> {
  return members.reduce<Record<string, MemberState>>((acc, m) => {
    acc[m.id] = {
      settings: { ...m.settings },
      notifyChannels: { ...m.notifyChannels },
      notifySeverity: m.notifySeverity,
    };
    return acc;
  }, {});
}

export default function FamilyProtectionClient() {
  const [state, setState] = useState<Record<string, MemberState>>(() =>
    initialState(familyMembers),
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(
    () => familyMembers.find((m) => m.id === selectedId) ?? null,
    [selectedId],
  );

  const totalDevices = familyMembers.reduce((sum, m) => sum + m.devices, 0);
  const totalThreats = familyMembers.reduce(
    (sum, m) => sum + m.activeThreats,
    0,
  );

  const toggleSetting = (
    memberId: string,
    key: keyof FamilyMemberSettings,
  ) => {
    setState((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        settings: {
          ...prev[memberId].settings,
          [key]: !prev[memberId].settings[key],
        },
      },
    }));
  };

  const toggleChannel = (memberId: string, key: keyof NotifyChannels) => {
    setState((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        notifyChannels: {
          ...prev[memberId].notifyChannels,
          [key]: !prev[memberId].notifyChannels[key],
        },
      },
    }));
  };

  const setSeverity = (memberId: string, severity: Severity) => {
    setState((prev) => ({
      ...prev,
      [memberId]: { ...prev[memberId], notifySeverity: severity },
    }));
  };

  return (
    <>
      <PageHeader
        title="Family Protection"
        description="Monitor and manage digital safety for everyone in your household from one place."
        icon={<Users className="h-5 w-5" />}
      />

      {/* Summary stats */}
      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/15 text-teal">
            <Users className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm text-white/60">Members</p>
            <p className="text-xl font-semibold text-white">
              {familyMembers.length}
            </p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/15 text-teal">
            <Smartphone className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm text-white/60">Protected devices</p>
            <p className="text-xl font-semibold text-white">{totalDevices}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl",
              totalThreats > 0
                ? "bg-threat/15 text-threat"
                : "bg-emerald/15 text-emerald",
            )}
          >
            {totalThreats > 0 ? (
              <ShieldAlert className="h-5 w-5" />
            ) : (
              <ShieldCheck className="h-5 w-5" />
            )}
          </span>
          <div>
            <p className="text-sm text-white/60">Active threats</p>
            <p className="text-xl font-semibold text-white">{totalThreats}</p>
          </div>
        </Card>
      </section>

      {/* Member drill-in OR member grid */}
      {selected ? (
        <MemberDetail
          member={selected}
          memberState={state[selected.id]}
          onBack={() => setSelectedId(null)}
          onToggleSetting={(key) => toggleSetting(selected.id, key)}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {familyMembers.map((member) => {
            const tone = scoreTone(member.trustScore);
            return (
              <button
                key={member.id}
                type="button"
                onClick={() => setSelectedId(member.id)}
                className="group text-left"
                aria-label={`Open ${member.name}'s protection settings`}
              >
                <Card className="flex h-full flex-col gap-4 transition-colors group-hover:border-teal/50">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold text-white",
                        avatarBg(member.avatarColor),
                      )}
                    >
                      {member.avatarInitials}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-white">
                        {member.name}
                      </p>
                      <p className="text-xs text-white/50">
                        {member.roleLabel}
                      </p>
                    </div>
                    <span className="ml-auto flex items-center gap-2">
                      <SeverityBadge severity={member.protectionLevel} />
                      <ChevronRight className="h-4 w-4 text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:text-teal" />
                    </span>
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="text-white/60">Trust score</span>
                      <span className={cn("font-semibold", tone.text)}>
                        {member.trustScore}
                      </span>
                    </div>
                    <ProgressBar
                      value={member.trustScore}
                      barClassName={tone.dot}
                    />
                  </div>

                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-white/50">Devices</dt>
                      <dd className="font-medium text-white">
                        {member.devices}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-white/50">Active threats</dt>
                      <dd
                        className={cn(
                          "font-medium",
                          member.activeThreats > 0
                            ? "text-threat"
                            : "text-emerald",
                        )}
                      >
                        {member.activeThreats}
                      </dd>
                    </div>
                  </dl>

                  <p className="mt-auto text-xs text-white/40">
                    Last active {formatDateTime(member.lastActivity)}
                  </p>
                </Card>
              </button>
            );
          })}
        </div>
      )}

      {/* Family Trust Digest preview */}
      <section className="mt-8">
        <Card>
          <div className="mb-4 flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/15 text-teal">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Family Trust Digest
              </h2>
              <p className="text-sm text-white/60">
                Preview of the weekly email report sent to guardians.
              </p>
            </div>
            <span className="ml-auto rounded-full border border-navy-lighter/50 bg-navy/40 px-3 py-1 text-xs text-white/50">
              Week of Jan 8 – Jan 14, 2026
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-navy-lighter/40 text-xs uppercase tracking-wide text-white/40">
                  <th className="pb-2 font-medium">Member</th>
                  <th className="pb-2 font-medium">Threats blocked</th>
                  <th className="pb-2 font-medium">New risks</th>
                  <th className="pb-2 font-medium">Recommended action</th>
                  <th className="pb-2 text-right font-medium">Score change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-lighter/30">
                {DIGEST_ROWS.map((row) => {
                  const member = familyMembers.find(
                    (m) => m.id === row.memberId,
                  );
                  if (!member) return null;
                  return (
                    <tr key={row.memberId}>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold text-white",
                              avatarBg(member.avatarColor),
                            )}
                          >
                            {member.avatarInitials}
                          </span>
                          <span className="font-medium text-white">
                            {member.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 font-medium text-emerald">
                        {row.threatsBlocked}
                      </td>
                      <td
                        className={cn(
                          "py-3 font-medium",
                          row.newRisks > 0 ? "text-amber" : "text-white/50",
                        )}
                      >
                        {row.newRisks}
                      </td>
                      <td className="py-3 text-white/70">
                        {row.recommendedAction}
                      </td>
                      <td className="py-3 text-right">
                        <ScoreChange change={row.scoreChange} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* Alert Preferences */}
      <section className="mt-8">
        <Card>
          <div className="mb-4 flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/15 text-teal">
              <Bell className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Alert Preferences
              </h2>
              <p className="text-sm text-white/60">
                Choose how each member is notified and the minimum severity that
                triggers an alert.
              </p>
            </div>
          </div>

          <ul className="flex flex-col divide-y divide-navy-lighter/40">
            {familyMembers.map((member) => {
              const ms = state[member.id];
              return (
                <li
                  key={member.id}
                  className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white",
                        avatarBg(member.avatarColor),
                      )}
                    >
                      {member.avatarInitials}
                    </span>
                    <div>
                      <p className="font-medium text-white">{member.name}</p>
                      <p className="text-xs text-white/50">
                        {member.roleLabel}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                    <ChannelToggle
                      label="Push"
                      checked={ms.notifyChannels.push}
                      onChange={() => toggleChannel(member.id, "push")}
                    />
                    <ChannelToggle
                      label="Email"
                      checked={ms.notifyChannels.email}
                      onChange={() => toggleChannel(member.id, "email")}
                    />
                    <ChannelToggle
                      label="In-app"
                      checked={ms.notifyChannels.inApp}
                      onChange={() => toggleChannel(member.id, "inApp")}
                    />

                    <label className="flex items-center gap-2 text-sm text-white/60">
                      Severity
                      <select
                        value={ms.notifySeverity}
                        onChange={(e) =>
                          setSeverity(member.id, e.target.value as Severity)
                        }
                        className="rounded-lg border border-navy-lighter/50 bg-navy px-2.5 py-1.5 text-sm text-white outline-none focus:border-teal/60"
                        aria-label={`Minimum alert severity for ${member.name}`}
                      >
                        {SEVERITY_LEVELS.map((level) => (
                          <option key={level} value={level}>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      </section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Channel toggle (push / email / in-app) with inline label.
// ---------------------------------------------------------------------------

function ChannelToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-white/60">{label}</span>
      <Toggle checked={checked} onChange={onChange} label={`${label} alerts`} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Per-member drill-in: protection settings (toggles), member-specific alerts,
// and the devices associated with the member.
// ---------------------------------------------------------------------------

function MemberDetail({
  member,
  memberState,
  onBack,
  onToggleSetting,
}: {
  member: FamilyMember;
  memberState: MemberState;
  onBack: () => void;
  onToggleSetting: (key: keyof FamilyMemberSettings) => void;
}) {
  const tone = scoreTone(member.trustScore);
  // Only the setting keys this member actually has configured.
  const settingKeys = SETTING_ORDER.filter(
    (key) => member.settings[key] !== undefined,
  );

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex w-fit items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to family
      </button>

      {/* Member header */}
      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <span
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold text-white",
            avatarBg(member.avatarColor),
          )}
        >
          {member.avatarInitials}
        </span>
        <div>
          <p className="text-lg font-semibold text-white">{member.name}</p>
          <p className="text-sm text-white/50">{member.roleLabel}</p>
        </div>
        <div className="flex items-center gap-6 sm:ml-auto">
          <div className="text-right">
            <p className="text-xs text-white/50">Trust score</p>
            <p className={cn("text-xl font-semibold", tone.text)}>
              {member.trustScore}
            </p>
          </div>
          <SeverityBadge severity={member.protectionLevel} />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Protection settings */}
        <Card>
          <h3 className="mb-4 text-base font-semibold text-white">
            Protection settings
          </h3>
          {settingKeys.length > 0 ? (
            <ul className="flex flex-col divide-y divide-navy-lighter/40">
              {settingKeys.map((key) => {
                const meta = SETTING_META[key];
                return (
                  <li
                    key={key}
                    className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-white">{meta.label}</p>
                      <p className="mt-1 text-sm text-white/55">
                        {meta.description}
                      </p>
                    </div>
                    <Toggle
                      checked={Boolean(memberState.settings[key])}
                      onChange={() => onToggleSetting(key)}
                      label={`Toggle ${meta.label} for ${member.name}`}
                    />
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-white/50">
              No managed controls — this member has full, unrestricted access.
            </p>
          )}
        </Card>

        <div className="flex flex-col gap-4">
          {/* Member-specific alerts */}
          <Card>
            <h3 className="mb-4 text-base font-semibold text-white">
              Recent alerts
            </h3>
            {member.memberAlerts.length > 0 ? (
              <ul className="flex flex-col gap-3">
                {member.memberAlerts.map((alert) => (
                  <li
                    key={alert.id}
                    className="flex items-start gap-3 rounded-lg border border-navy-lighter/40 bg-navy/40 px-3 py-2.5"
                  >
                    <span className="mt-0.5">
                      <SeverityBadge severity={alert.severity} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white">
                        {alert.title}
                      </p>
                      <p className="text-xs text-white/40">
                        {formatDateTime(alert.timestamp)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="inline-flex items-center gap-2 text-sm text-emerald">
                <ShieldCheck className="h-4 w-4" />
                No recent alerts — all clear.
              </p>
            )}
          </Card>

          {/* Associated devices */}
          <Card>
            <h3 className="mb-4 text-base font-semibold text-white">
              Associated devices
            </h3>
            <ul className="flex flex-col gap-3">
              {member.memberDevices.map((device) => (
                <li
                  key={device}
                  className="flex items-center gap-3 rounded-lg border border-navy-lighter/40 bg-navy/40 px-3 py-2.5"
                >
                  <MonitorSmartphone className="h-4 w-4 shrink-0 text-teal" />
                  <span className="text-sm font-medium text-white">
                    {device}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
