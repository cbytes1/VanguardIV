// Shared domain types for the TrustShield prototype.
//
// This file is the single source of truth for the shapes used across every
// screen. The foundation feature (FEAT-001) expanded it to the full product
// data model; later features (threat monitor, deepfake checker, family
// protection, privacy center, trust score) all consume these types.

export type Severity = "safe" | "low" | "medium" | "high" | "critical";

export type ThreatCategory =
  | "phishing"
  | "malware"
  | "scam-call"
  | "data-breach"
  | "deepfake"
  | "identity-theft"
  | "smishing";

export type ThreatStatus = "active" | "blocked" | "resolved" | "investigating";

export interface Threat {
  id: string;
  title: string;
  category: ThreatCategory;
  severity: Severity;
  status: ThreatStatus;
  source: string;
  detectedAt: string; // ISO timestamp
  description: string;
}

export interface DashboardStat {
  id: string;
  label: string;
  value: string;
  change: number; // percentage change vs. previous period
  trend: "up" | "down" | "flat";
  tone: "safe" | "warning" | "threat" | "accent";
}

// ---------------------------------------------------------------------------
// Devices
// ---------------------------------------------------------------------------

/** The kinds of connected devices a household can have. */
export type DeviceType =
  | "phone"
  | "laptop"
  | "tv"
  | "camera"
  | "thermostat"
  | "speaker"
  | "tablet"
  | "console"
  | "other";

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  owner: string; // family member name
  status: "online" | "offline";
  firmwareOk: boolean; // true == firmware up to date
  lastSeen: string; // ISO timestamp
}

// ---------------------------------------------------------------------------
// Activity feed (dashboard "recent activity")
// ---------------------------------------------------------------------------

/** Colored status dot shown next to an activity row. */
export type SeverityDot = "red" | "amber" | "green";

export interface ActivityEvent {
  id: string;
  severityDot: SeverityDot;
  title: string;
  source: string;
  timestamp: string; // ISO timestamp
  relativeLabel: string; // e.g. "2 min ago"
}

// ---------------------------------------------------------------------------
// Live threat feed (threat monitor real-time stream)
// ---------------------------------------------------------------------------

export type LiveThreatType = "phishing" | "malware" | "scam" | "suspicious";
export type LiveThreatAction = "blocked" | "warned" | "monitoring";

export interface LiveThreat {
  id: string;
  threatType: LiveThreatType;
  source: string;
  action: LiveThreatAction;
  aiExplanation: string; // plain-language reason the AI flagged it
  timestamp: string; // ISO timestamp
}

// ---------------------------------------------------------------------------
// Deepfake checker
// ---------------------------------------------------------------------------

export type DeepfakeVerdict = "likely-ai" | "authentic" | "likely-synthetic";

/** A single analysis marker surfaced in a deepfake report. */
export interface DeepfakeMarker {
  label: string;
  detail: string;
  flagged: boolean; // true == this marker counts against authenticity
}

/**
 * A pre-canned deepfake analysis the demo can "run" instantly, aligned to the
 * product spec (verdict + markers + advice).
 */
export interface DeepfakeExample {
  id: string;
  mediaType: "video" | "image" | "audio";
  fileName: string;
  verdict: DeepfakeVerdict;
  confidence: number; // 0-100
  indicators: DeepfakeMarker[];
  recommendation: string;
}

// ---------------------------------------------------------------------------
// Family members
// ---------------------------------------------------------------------------

/** Per-member protection settings. All optional so each role shows only the
 *  controls that make sense for it (e.g. a child has app restrictions). */
export interface FamilyMemberSettings {
  safeSearch?: boolean;
  socialMonitoring?: boolean;
  screenTimeVisible?: boolean;
  contentFiltering?: boolean;
  appRestrictions?: boolean;
}

export interface MemberAlert {
  id: string;
  title: string;
  severity: Severity;
  timestamp: string; // ISO timestamp
}

export interface NotifyChannels {
  push: boolean;
  email: boolean;
  inApp: boolean;
}

export interface FamilyMember {
  id: string;
  name: string;
  role: "guardian" | "teen" | "child";
  /** Human-friendly label, e.g. "Dad (Account Owner)". */
  roleLabel: string;
  avatarInitials: string;
  /** Tailwind-friendly accent for the avatar bubble (palette token). */
  avatarColor: string;
  protectionLevel: Severity;
  trustScore: number; // 0-100
  devices: number;
  activeThreats: number;
  lastActivity: string;
  settings: FamilyMemberSettings;
  memberAlerts: MemberAlert[];
  memberDevices: string[]; // device names belonging to this member
  notifyChannels: NotifyChannels;
  notifySeverity: Severity; // minimum severity that triggers a notification
}

// ---------------------------------------------------------------------------
// Privacy center
// ---------------------------------------------------------------------------

export interface PrivacyControl {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  category: "tracking" | "data-sharing" | "visibility" | "ai";
}

export interface DataBroker {
  id: string;
  name: string;
  exposure: "removed" | "pending" | "found";
  recordsFound: number;
}

/** A line item in the "what we look at vs. what we never see" transparency
 *  model (the foggy-glass privacy view). */
export interface PrivacyMonitorItem {
  id: string;
  label: string;
  explanation: string;
  kind: "analyzed" | "never-seen";
}

export interface AuditLogEntry {
  id: string;
  timestamp: string; // ISO timestamp
  dataAccessed: string;
  reason: string;
}

export interface DataDashboard {
  collectedLabel: string;
  retentionLabel: string;
  sharedLabel: string;
}

// ---------------------------------------------------------------------------
// Trust score
// ---------------------------------------------------------------------------

export interface TrustScoreFactor {
  id: string;
  label: string;
  score: number; // 0-100
  weight: number; // 0-1
  summary: string;
}

export interface TrustScoreSnapshot {
  overall: number; // 0-100
  grade: "A" | "B" | "C" | "D" | "F";
  trend: "up" | "down" | "flat";
  change: number;
  factors: TrustScoreFactor[];
}

/** One scored category contributing to the overall trust score. */
export interface TrustCategory {
  id: string;
  name: string;
  score: number; // 0-100
  note: string;
}

export interface ScoreHistoryPoint {
  month: string; // short month label, e.g. "Jan"
  score: number; // 0-100
}

export interface Recommendation {
  id: string;
  title: string;
  detail: string;
  pointImpact: number; // estimated trust-score points if actioned
}
