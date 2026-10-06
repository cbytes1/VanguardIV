// =============================================================================
// TrustShield — mock data for the Johnson Family household (Denver, CO).
//
// ALL DATA IN THIS FILE IS FICTIONAL AND FOR DEMONSTRATION ONLY.
// Domains, names, phone numbers, and timestamps are invented for the demo and
// do not refer to real people, companies, or events. There is no backend,
// database, or network call anywhere in this prototype — every screen reads
// from the exports below.
//
// Every export is typed against lib/types.ts so the whole app stays coherent.
// =============================================================================

import type {
  ActivityEvent,
  AuditLogEntry,
  DashboardStat,
  DataBroker,
  DataDashboard,
  DeepfakeExample,
  Device,
  FamilyMember,
  LiveThreat,
  PrivacyControl,
  PrivacyMonitorItem,
  Recommendation,
  ScoreHistoryPoint,
  Threat,
  TrustCategory,
  TrustScoreSnapshot,
} from "@/lib/types";

// -----------------------------------------------------------------------------
// Household meta
// -----------------------------------------------------------------------------

export const household = {
  name: "Johnson Family",
  location: "Denver, CO",
} as const;

// -----------------------------------------------------------------------------
// Dashboard summary cards (Screen 1)
// Four spec values: 23 blocked / 156 scanned / 0 active risks / 4 protected.
// -----------------------------------------------------------------------------

export const dashboardStats: DashboardStat[] = [
  {
    id: "stat-blocked",
    label: "Threats Blocked This Week",
    value: "23",
    change: 18,
    trend: "up",
    tone: "safe",
  },
  {
    id: "stat-scanned",
    label: "Devices Scanned",
    value: "156",
    change: 6,
    trend: "up",
    tone: "accent",
  },
  {
    id: "stat-active",
    label: "Active Risks",
    value: "0",
    change: -100,
    trend: "down",
    tone: "threat",
  },
  {
    id: "stat-members",
    label: "Family Members Protected",
    value: "4",
    change: 0,
    trend: "flat",
    tone: "warning",
  },
];

// -----------------------------------------------------------------------------
// Devices — 12 across the household, spread over the device types.
// -----------------------------------------------------------------------------

export const devices: Device[] = [
  {
    id: "dev-01",
    name: "David's iPhone 15",
    type: "phone",
    owner: "David Johnson",
    status: "online",
    firmwareOk: true,
    lastSeen: "2026-01-14T10:12:00Z",
  },
  {
    id: "dev-02",
    name: "David's MacBook Pro",
    type: "laptop",
    owner: "David Johnson",
    status: "online",
    firmwareOk: true,
    lastSeen: "2026-01-14T10:05:00Z",
  },
  {
    id: "dev-03",
    name: "Sarah's Galaxy S24",
    type: "phone",
    owner: "Sarah Johnson",
    status: "online",
    firmwareOk: true,
    lastSeen: "2026-01-14T09:58:00Z",
  },
  {
    id: "dev-04",
    name: "Sarah's Surface Laptop",
    type: "laptop",
    owner: "Sarah Johnson",
    status: "offline",
    firmwareOk: true,
    lastSeen: "2026-01-13T22:40:00Z",
  },
  {
    id: "dev-05",
    name: "Alex's Pixel 8",
    type: "phone",
    owner: "Alex Johnson",
    status: "online",
    firmwareOk: true,
    lastSeen: "2026-01-14T10:11:00Z",
  },
  {
    id: "dev-06",
    name: "Alex's Gaming PC",
    type: "console",
    owner: "Alex Johnson",
    status: "online",
    firmwareOk: false,
    lastSeen: "2026-01-14T09:30:00Z",
  },
  {
    id: "dev-07",
    name: "Emma's iPad",
    type: "tablet",
    owner: "Emma Johnson",
    status: "online",
    firmwareOk: true,
    lastSeen: "2026-01-14T08:25:00Z",
  },
  {
    id: "dev-08",
    name: "Living Room Smart TV",
    type: "tv",
    owner: "Johnson Family",
    status: "online",
    firmwareOk: true,
    lastSeen: "2026-01-14T07:50:00Z",
  },
  {
    id: "dev-09",
    name: "Front Door Camera",
    type: "camera",
    owner: "Johnson Family",
    status: "online",
    firmwareOk: false,
    lastSeen: "2026-01-14T10:09:00Z",
  },
  {
    id: "dev-10",
    name: "Hallway Thermostat",
    type: "thermostat",
    owner: "Johnson Family",
    status: "online",
    firmwareOk: true,
    lastSeen: "2026-01-14T10:00:00Z",
  },
  {
    id: "dev-11",
    name: "Kitchen Smart Speaker",
    type: "speaker",
    owner: "Johnson Family",
    status: "online",
    firmwareOk: true,
    lastSeen: "2026-01-14T09:44:00Z",
  },
  {
    id: "dev-12",
    name: "Family Game Console",
    type: "console",
    owner: "Johnson Family",
    status: "offline",
    firmwareOk: true,
    lastSeen: "2026-01-13T20:15:00Z",
  },
];

// -----------------------------------------------------------------------------
// Threat history — ~a month of blocked/handled threats with fake domains.
// -----------------------------------------------------------------------------

export const threats: Threat[] = [
  {
    id: "thr-001",
    title: "Phishing email impersonating your bank",
    category: "phishing",
    severity: "high",
    status: "blocked",
    source: "email · alerts@fake-bank-login.com",
    detectedAt: "2026-01-14T09:12:00Z",
    description:
      "A message claiming your account was locked linked to a spoofed login page at fake-bank-login.com. Auto-blocked before anyone clicked.",
  },
  {
    id: "thr-002",
    title: "Fake Amazon verification page",
    category: "phishing",
    severity: "high",
    status: "blocked",
    source: "email · secure-amaz0n-verify.com",
    detectedAt: "2026-01-13T16:41:00Z",
    description:
      "A look-alike Amazon page (note the zero in 'amaz0n') tried to harvest login and payment details. Blocked at the network layer.",
  },
  {
    id: "thr-003",
    title: "Scam call intercepted: fake IRS agent",
    category: "scam-call",
    severity: "medium",
    status: "blocked",
    source: "call · +1 (555) 403-9981",
    detectedAt: "2026-01-13T13:22:00Z",
    description:
      "An automated call claimed to be a tax agency demanding gift-card payment. The number matched a known scam pattern and was silenced.",
  },
  {
    id: "thr-004",
    title: "Suspicious IoT camera connection",
    category: "malware",
    severity: "medium",
    status: "investigating",
    source: "device · Front Door Camera",
    detectedAt: "2026-01-13T11:08:00Z",
    description:
      "The front door camera attempted an outbound connection to an unfamiliar server at iot-telemetry-collect.net. Traffic paused pending review.",
  },
  {
    id: "thr-005",
    title: "Smishing text with malicious shipping link",
    category: "smishing",
    severity: "medium",
    status: "blocked",
    source: "sms · track-usps-delivery-alert.com",
    detectedAt: "2026-01-12T11:05:00Z",
    description:
      "A text about a delayed package linked to a credential-harvesting site. The link was blocked before it opened.",
  },
  {
    id: "thr-006",
    title: "Credential-stuffing attempt on email",
    category: "identity-theft",
    severity: "high",
    status: "blocked",
    source: "account · Lagos, NG",
    detectedAt: "2026-01-12T07:48:00Z",
    description:
      "Repeated login attempts from an unrecognized location used leaked passwords. We required verification and blocked the attempts.",
  },
  {
    id: "thr-007",
    title: "Malware download blocked in browser",
    category: "malware",
    severity: "high",
    status: "blocked",
    source: "web · free-movie-stream-hd.net",
    detectedAt: "2026-01-11T21:34:00Z",
    description:
      "A streaming site tried to push a disguised installer onto Alex's gaming PC. Download quarantined automatically.",
  },
  {
    id: "thr-008",
    title: "Robocall flagged as warranty scam",
    category: "scam-call",
    severity: "low",
    status: "blocked",
    source: "call · +1 (555) 771-6620",
    detectedAt: "2026-01-11T13:10:00Z",
    description:
      "An automated 'extended car warranty' call matched a known robocall campaign and was filtered.",
  },
  {
    id: "thr-009",
    title: "Phishing email: fake package refund",
    category: "phishing",
    severity: "medium",
    status: "blocked",
    source: "email · fedex-refund-center.com",
    detectedAt: "2026-01-10T15:22:00Z",
    description:
      "A refund lure asked for card details on fedex-refund-center.com. Blocked and reported.",
  },
  {
    id: "thr-010",
    title: "Data breach exposure: retail loyalty account",
    category: "data-breach",
    severity: "medium",
    status: "resolved",
    source: "monitor · dark-web scan",
    detectedAt: "2026-01-10T09:30:00Z",
    description:
      "Sarah's email appeared in a breached dataset. We prompted a password reset and enabled two-factor authentication.",
  },
  {
    id: "thr-011",
    title: "Deepfake voicemail requesting money",
    category: "deepfake",
    severity: "high",
    status: "resolved",
    source: "voicemail · +1 (555) 019-2284",
    detectedAt: "2026-01-09T21:03:00Z",
    description:
      "A voicemail used a synthetic voice resembling a relative asking for a wire transfer. Audio analysis flagged cloning artifacts.",
  },
  {
    id: "thr-012",
    title: "Smishing: fake bank fraud alert",
    category: "smishing",
    severity: "medium",
    status: "blocked",
    source: "sms · fake-bank-login.com",
    detectedAt: "2026-01-09T12:48:00Z",
    description:
      "A 'suspicious charge' text pushed a link to fake-bank-login.com. Blocked before it loaded.",
  },
  {
    id: "thr-013",
    title: "Suspicious login to streaming account",
    category: "identity-theft",
    severity: "low",
    status: "resolved",
    source: "account · unrecognized device",
    detectedAt: "2026-01-08T19:15:00Z",
    description:
      "A new device signed into a shared streaming account. We verified it was Alex and cleared the alert.",
  },
  {
    id: "thr-014",
    title: "Phishing email: fake Netflix billing",
    category: "phishing",
    severity: "medium",
    status: "blocked",
    source: "email · netflix-billing-update.com",
    detectedAt: "2026-01-08T10:02:00Z",
    description:
      "A billing-failure lure linked to netflix-billing-update.com asking for card re-entry. Blocked.",
  },
  {
    id: "thr-015",
    title: "Robocall: fake Social Security suspension",
    category: "scam-call",
    severity: "low",
    status: "blocked",
    source: "call · +1 (555) 288-7430",
    detectedAt: "2026-01-07T14:55:00Z",
    description:
      "An automated call claimed a benefits number was suspended. Known scam pattern, filtered.",
  },
  {
    id: "thr-016",
    title: "Malware-laced email attachment",
    category: "malware",
    severity: "high",
    status: "blocked",
    source: "email · invoice-docs-secure.com",
    detectedAt: "2026-01-06T08:41:00Z",
    description:
      "A fake invoice attachment carried a macro-based payload. Sandboxed and blocked before delivery.",
  },
  {
    id: "thr-017",
    title: "Phishing: fake Apple ID locked",
    category: "phishing",
    severity: "medium",
    status: "blocked",
    source: "email · appleid-verify-support.com",
    detectedAt: "2026-01-05T17:20:00Z",
    description:
      "An 'Apple ID locked' message linked to appleid-verify-support.com. Auto-blocked.",
  },
  {
    id: "thr-018",
    title: "Suspicious smart-speaker firmware request",
    category: "malware",
    severity: "low",
    status: "resolved",
    source: "device · Kitchen Smart Speaker",
    detectedAt: "2026-01-05T06:30:00Z",
    description:
      "An unexpected firmware endpoint was contacted. Verified as a vendor CDN and allow-listed.",
  },
  {
    id: "thr-019",
    title: "Smishing: fake prize notification",
    category: "smishing",
    severity: "low",
    status: "blocked",
    source: "sms · claim-your-reward-now.com",
    detectedAt: "2026-01-04T13:12:00Z",
    description:
      "A 'you won a gift card' text linked to claim-your-reward-now.com. Blocked.",
  },
  {
    id: "thr-020",
    title: "Phishing: fake utility shutoff notice",
    category: "phishing",
    severity: "medium",
    status: "blocked",
    source: "email · energy-billing-urgent.com",
    detectedAt: "2026-01-03T11:48:00Z",
    description:
      "A threatening 'service will be disconnected' email linked to energy-billing-urgent.com. Blocked.",
  },
  {
    id: "thr-021",
    title: "Credential leak detected in paste dump",
    category: "data-breach",
    severity: "medium",
    status: "resolved",
    source: "monitor · dark-web scan",
    detectedAt: "2026-01-02T22:05:00Z",
    description:
      "An old password for David appeared in a paste dump. We confirmed it was already rotated.",
  },
  {
    id: "thr-022",
    title: "Scam call: fake tech support",
    category: "scam-call",
    severity: "low",
    status: "blocked",
    source: "call · +1 (555) 660-1177",
    detectedAt: "2026-01-01T15:33:00Z",
    description:
      "A caller claimed the family PC was 'infected' and asked for remote access. Known scam, filtered.",
  },
  {
    id: "thr-023",
    title: "Phishing: fake crypto wallet reset",
    category: "phishing",
    severity: "high",
    status: "blocked",
    source: "email · wallet-recovery-secure.com",
    detectedAt: "2025-12-30T09:18:00Z",
    description:
      "A 'wallet recovery' lure linked to wallet-recovery-secure.com to steal seed phrases. Blocked.",
  },
  {
    id: "thr-024",
    title: "Suspicious thermostat outbound traffic",
    category: "malware",
    severity: "low",
    status: "resolved",
    source: "device · Hallway Thermostat",
    detectedAt: "2025-12-29T07:02:00Z",
    description:
      "Unusual telemetry volume from the thermostat was investigated and traced to a routine update.",
  },
  {
    id: "thr-025",
    title: "Smishing: fake toll-road payment",
    category: "smishing",
    severity: "medium",
    status: "blocked",
    source: "sms · pay-toll-balance-now.com",
    detectedAt: "2025-12-28T18:44:00Z",
    description:
      "An 'unpaid toll' text linked to pay-toll-balance-now.com requesting card details. Blocked.",
  },
];

// -----------------------------------------------------------------------------
// Recent activity (dashboard) — the five spec examples, with colored dots.
// -----------------------------------------------------------------------------

export const recentActivity: ActivityEvent[] = [
  {
    id: "act-01",
    severityDot: "red",
    title: "Phishing email blocked",
    source: "fake-bank-login.com",
    timestamp: "2026-01-14T10:08:00Z",
    relativeLabel: "2 min ago",
  },
  {
    id: "act-02",
    severityDot: "amber",
    title: "Suspicious activity on IoT camera",
    source: "Front Door Camera",
    timestamp: "2026-01-14T09:40:00Z",
    relativeLabel: "30 min ago",
  },
  {
    id: "act-03",
    severityDot: "green",
    title: "Weekly security scan complete",
    source: "156 devices scanned",
    timestamp: "2026-01-14T08:10:00Z",
    relativeLabel: "2 hours ago",
  },
  {
    id: "act-04",
    severityDot: "red",
    title: "Scam call intercepted",
    source: "+1 (555) 403-9981",
    timestamp: "2026-01-13T13:22:00Z",
    relativeLabel: "Yesterday",
  },
  {
    id: "act-05",
    severityDot: "green",
    title: "New device connected",
    source: "Alex's Pixel 8",
    timestamp: "2026-01-12T18:30:00Z",
    relativeLabel: "2 days ago",
  },
];

// -----------------------------------------------------------------------------
// Live threat feed (threat monitor) — pool the client cycles through.
// -----------------------------------------------------------------------------

export const liveThreats: LiveThreat[] = [
  {
    id: "live-01",
    threatType: "phishing",
    source: "fake-bank-login.com",
    action: "blocked",
    aiExplanation:
      "The domain mimics a real bank but was registered 3 days ago and hosts a cloned login form.",
    timestamp: "2026-01-14T10:08:12Z",
  },
  {
    id: "live-02",
    threatType: "scam",
    source: "+1 (555) 403-9981",
    action: "blocked",
    aiExplanation:
      "Caller ID spoofing plus a script matching known IRS-impersonation robocalls.",
    timestamp: "2026-01-14T10:06:44Z",
  },
  {
    id: "live-03",
    threatType: "suspicious",
    source: "Front Door Camera",
    action: "monitoring",
    aiExplanation:
      "The camera reached out to an unrecognized server. Watching to confirm whether it is benign telemetry.",
    timestamp: "2026-01-14T10:04:03Z",
  },
  {
    id: "live-04",
    threatType: "malware",
    source: "free-movie-stream-hd.net",
    action: "blocked",
    aiExplanation:
      "The page tried to auto-download an executable disguised as a video codec.",
    timestamp: "2026-01-14T10:01:50Z",
  },
  {
    id: "live-05",
    threatType: "phishing",
    source: "secure-amaz0n-verify.com",
    action: "warned",
    aiExplanation:
      "Look-alike domain using a zero for the letter 'o'; warned the user before they entered credentials.",
    timestamp: "2026-01-14T09:59:21Z",
  },
  {
    id: "live-06",
    threatType: "suspicious",
    source: "unrecognized device · Alex's network",
    action: "monitoring",
    aiExplanation:
      "A new device joined the network at an unusual hour; flagged for confirmation.",
    timestamp: "2026-01-14T09:56:10Z",
  },
  {
    id: "live-07",
    threatType: "scam",
    source: "track-usps-delivery-alert.com",
    action: "blocked",
    aiExplanation:
      "Fake delivery-tracking link requesting card details to 'release' a package.",
    timestamp: "2026-01-14T09:53:38Z",
  },
  {
    id: "live-08",
    threatType: "malware",
    source: "invoice-docs-secure.com",
    action: "blocked",
    aiExplanation:
      "Attachment contained a macro that attempts to download a second-stage payload.",
    timestamp: "2026-01-14T09:50:05Z",
  },
];

// -----------------------------------------------------------------------------
// Deepfake checker
// -----------------------------------------------------------------------------

// Spec-aligned examples the demo "analyzes" instantly (FEAT-003+). Each one
// carries a verdict, plain-language markers, and a recommendation.
export const deepfakeExamples: DeepfakeExample[] = [
  {
    id: "dfe-01",
    mediaType: "video",
    fileName: "ceo-urgent-wire-request.mp4",
    verdict: "likely-ai",
    confidence: 87,
    indicators: [
      {
        label: "Inconsistent lighting",
        detail:
          "Light on the face does not match the shadows in the room, a common sign of a face swap.",
        flagged: true,
      },
      {
        label: "Audio sync drift",
        detail:
          "Lip movements fall slightly out of sync with the speech in several spots.",
        flagged: true,
      },
      {
        label: "Facial artifacts",
        detail:
          "Blurring and warping appear around the jawline when the head turns.",
        flagged: true,
      },
    ],
    recommendation:
      "Do not act on this video. Verify any money request by calling the person back on a known, trusted number.",
  },
  {
    id: "dfe-02",
    mediaType: "image",
    fileName: "receipt-screenshot.png",
    verdict: "authentic",
    confidence: 96,
    indicators: [
      {
        label: "Metadata intact",
        detail: "Image metadata is consistent and shows no re-encoding by an AI tool.",
        flagged: false,
      },
      {
        label: "Natural sensor noise",
        detail: "The pixel noise pattern matches a genuine camera capture.",
        flagged: false,
      },
      {
        label: "No warping detected",
        detail: "Text edges and lines are crisp with no generative distortion.",
        flagged: false,
      },
    ],
    recommendation:
      "This image looks authentic. Still, confirm the sender is who they claim before sharing sensitive info.",
  },
  {
    id: "dfe-03",
    mediaType: "audio",
    fileName: "grandma-voicemail.m4a",
    verdict: "likely-synthetic",
    confidence: 92,
    indicators: [
      {
        label: "Voice-cloning markers",
        detail:
          "Spectral patterns match AI voice-synthesis tools rather than a human recording.",
        flagged: true,
      },
      {
        label: "Unnatural pacing",
        detail: "Pauses and breathing are too regular to be natural speech.",
        flagged: true,
      },
      {
        label: "Missing background noise",
        detail: "The recording is unusually clean, with no room ambience.",
        flagged: true,
      },
    ],
    recommendation:
      "Treat this voicemail as a likely scam. Call the family member directly to confirm before sending any money.",
  },
  {
    id: "dfe-04",
    mediaType: "image",
    fileName: "ai-generated-profile.jpg",
    verdict: "likely-synthetic",
    confidence: 89,
    indicators: [
      {
        label: "Asymmetric features",
        detail: "Ears and eyes are subtly mismatched, typical of AI-generated faces.",
        flagged: true,
      },
      {
        label: "Background smearing",
        detail: "The background melts into vague shapes without clear edges.",
        flagged: true,
      },
      {
        label: "No capture metadata",
        detail: "The file has no camera metadata, suggesting it was generated, not photographed.",
        flagged: true,
      },
    ],
    recommendation:
      "This profile photo appears AI-generated. Be cautious of accounts using synthetic images.",
  },
];

// -----------------------------------------------------------------------------
// Family members — Dad, Mom, Alex (teen, 16), Emma (child, 10).
// -----------------------------------------------------------------------------

export const familyMembers: FamilyMember[] = [
  {
    id: "fam-dad",
    name: "David Johnson",
    role: "guardian",
    roleLabel: "Dad (Account Owner)",
    avatarInitials: "DJ",
    avatarColor: "teal",
    protectionLevel: "safe",
    trustScore: 91,
    devices: 2,
    activeThreats: 0,
    lastActivity: "2026-01-14T10:12:00Z",
    // Account owner: full access with every protection feature available/on.
    settings: {
      safeSearch: true,
      socialMonitoring: true,
      screenTimeVisible: true,
      contentFiltering: true,
      appRestrictions: true,
    },
    memberAlerts: [],
    memberDevices: ["David's iPhone 15", "David's MacBook Pro"],
    notifyChannels: { push: true, email: true, inApp: true },
    notifySeverity: "low",
  },
  {
    id: "fam-mom",
    name: "Sarah Johnson",
    role: "guardian",
    roleLabel: "Mom (Full Access)",
    avatarInitials: "SJ",
    avatarColor: "emerald",
    protectionLevel: "safe",
    trustScore: 89,
    devices: 2,
    activeThreats: 0,
    lastActivity: "2026-01-14T09:58:00Z",
    // Full access with every protection feature available/on.
    settings: {
      safeSearch: true,
      socialMonitoring: true,
      screenTimeVisible: true,
      contentFiltering: true,
      appRestrictions: true,
    },
    memberAlerts: [
      {
        id: "ma-mom-1",
        title: "Email found in retail loyalty breach",
        severity: "medium",
        timestamp: "2026-01-10T09:30:00Z",
      },
    ],
    memberDevices: ["Sarah's Galaxy S24", "Sarah's Surface Laptop"],
    notifyChannels: { push: true, email: true, inApp: true },
    notifySeverity: "low",
  },
  {
    id: "fam-alex",
    name: "Alex Johnson",
    role: "teen",
    roleLabel: "Alex (Teen, 16)",
    avatarInitials: "AJ",
    avatarColor: "amber",
    protectionLevel: "medium",
    trustScore: 74,
    devices: 2,
    activeThreats: 1,
    lastActivity: "2026-01-14T10:11:00Z",
    settings: {
      safeSearch: true,
      socialMonitoring: true,
      screenTimeVisible: true,
    },
    memberAlerts: [
      {
        id: "ma-alex-1",
        title: "Malware download blocked on gaming PC",
        severity: "high",
        timestamp: "2026-01-11T21:34:00Z",
      },
      {
        id: "ma-alex-2",
        title: "New device signed into streaming account",
        severity: "low",
        timestamp: "2026-01-08T19:15:00Z",
      },
    ],
    memberDevices: ["Alex's Pixel 8", "Alex's Gaming PC"],
    notifyChannels: { push: true, email: false, inApp: true },
    notifySeverity: "medium",
  },
  {
    id: "fam-emma",
    name: "Emma Johnson",
    role: "child",
    roleLabel: "Emma (Child, 10)",
    avatarInitials: "EJ",
    avatarColor: "cyan",
    protectionLevel: "high",
    trustScore: 82,
    devices: 1,
    activeThreats: 0,
    lastActivity: "2026-01-14T08:25:00Z",
    settings: {
      safeSearch: true,
      contentFiltering: true,
      appRestrictions: true,
      screenTimeVisible: true,
    },
    memberAlerts: [
      {
        id: "ma-emma-1",
        title: "Blocked an age-inappropriate website",
        severity: "low",
        timestamp: "2026-01-12T15:02:00Z",
      },
    ],
    memberDevices: ["Emma's iPad"],
    notifyChannels: { push: true, email: true, inApp: true },
    notifySeverity: "low",
  },
];

// -----------------------------------------------------------------------------
// Privacy center
// -----------------------------------------------------------------------------

export const privacyControls: PrivacyControl[] = [
  {
    id: "pc-001",
    label: "Block cross-site trackers",
    description: "Prevent advertisers from following you across websites.",
    enabled: true,
    category: "tracking",
  },
  {
    id: "pc-002",
    label: "Limit data sharing with partners",
    description: "Stop apps from selling or sharing your personal data.",
    enabled: true,
    category: "data-sharing",
  },
  {
    id: "pc-003",
    label: "Hide profile from search engines",
    description: "Keep your public profiles out of search results.",
    enabled: false,
    category: "visibility",
  },
  {
    id: "pc-004",
    label: "Opt out of AI model training",
    description: "Exclude your content from being used to train AI systems.",
    enabled: true,
    category: "ai",
  },
  {
    id: "pc-005",
    label: "Mask email on sign-ups",
    description: "Use a relay address instead of your real email.",
    enabled: false,
    category: "data-sharing",
  },
];

export const dataBrokers: DataBroker[] = [
  { id: "db-001", name: "InfoAggregate", exposure: "removed", recordsFound: 12 },
  { id: "db-002", name: "PeopleFinderNow", exposure: "pending", recordsFound: 8 },
  { id: "db-003", name: "LeadVault", exposure: "found", recordsFound: 21 },
  { id: "db-004", name: "ContactSphere", exposure: "removed", recordsFound: 5 },
];

// The "foggy-glass" transparency model: what TrustShield analyzes vs. what it
// is designed to never see.
export const privacyMonitorItems: PrivacyMonitorItem[] = [
  {
    id: "pm-a1",
    label: "Traffic patterns",
    explanation: "We look at the shape and timing of network traffic, not what it contains.",
    kind: "analyzed",
  },
  {
    id: "pm-a2",
    label: "Connection metadata",
    explanation: "Which servers devices talk to, so we can spot known-bad destinations.",
    kind: "analyzed",
  },
  {
    id: "pm-a3",
    label: "Device fingerprints",
    explanation: "Hardware signatures that help us notice when a new device joins.",
    kind: "analyzed",
  },
  {
    id: "pm-a4",
    label: "DNS queries",
    explanation: "Domain lookups so we can block phishing and malware domains.",
    kind: "analyzed",
  },
  {
    id: "pm-a5",
    label: "Behavioral anomalies",
    explanation: "Unusual activity, like a camera suddenly uploading at 3 a.m.",
    kind: "analyzed",
  },
  {
    id: "pm-n1",
    label: "Email content",
    explanation: "We never read the body of your emails.",
    kind: "never-seen",
  },
  {
    id: "pm-n2",
    label: "Message text",
    explanation: "The contents of your texts and chats stay private.",
    kind: "never-seen",
  },
  {
    id: "pm-n3",
    label: "Browsing history details",
    explanation: "We do not log the specific pages you read.",
    kind: "never-seen",
  },
  {
    id: "pm-n4",
    label: "File contents",
    explanation: "Your documents, photos, and files are never opened.",
    kind: "never-seen",
  },
  {
    id: "pm-n5",
    label: "Passwords",
    explanation: "We never see or store your account passwords.",
    kind: "never-seen",
  },
  {
    id: "pm-n6",
    label: "Personal communications",
    explanation: "Calls and private conversations are off-limits.",
    kind: "never-seen",
  },
];

export const dataDashboard: DataDashboard = {
  collectedLabel: "2.3 MB of anonymized traffic patterns",
  retentionLabel: "Auto-deleted after 30 days",
  sharedLabel: "None — analysis stays on-device",
};

export const auditLog: AuditLogEntry[] = [
  {
    id: "al-01",
    timestamp: "2026-01-14T10:08:00Z",
    dataAccessed: "DNS query log",
    reason: "Checked a domain against the phishing blocklist",
  },
  {
    id: "al-02",
    timestamp: "2026-01-14T09:40:00Z",
    dataAccessed: "Connection metadata (Front Door Camera)",
    reason: "Investigated an unusual outbound connection",
  },
  {
    id: "al-03",
    timestamp: "2026-01-14T08:10:00Z",
    dataAccessed: "Device fingerprints",
    reason: "Weekly scan to confirm all devices are recognized",
  },
  {
    id: "al-04",
    timestamp: "2026-01-13T13:22:00Z",
    dataAccessed: "Call metadata",
    reason: "Matched an incoming number to known scam patterns",
  },
  {
    id: "al-05",
    timestamp: "2026-01-12T18:30:00Z",
    dataAccessed: "Device fingerprint (new device)",
    reason: "Confirmed a newly connected phone belonged to the household",
  },
];

// -----------------------------------------------------------------------------
// Trust score — overall 87 "Protected", trending up.
// -----------------------------------------------------------------------------

export const trustScore: TrustScoreSnapshot = {
  overall: 87,
  grade: "B",
  trend: "up",
  change: 4,
  factors: [
    {
      id: "tsf-001",
      label: "Network Security",
      score: 92,
      weight: 0.25,
      summary: "Router firmware current and intrusion detection active.",
    },
    {
      id: "tsf-002",
      label: "Phishing Protection",
      score: 85,
      weight: 0.2,
      summary: "Blocking is strong; a few risky clicks were caught just in time.",
    },
    {
      id: "tsf-003",
      label: "Device Health",
      score: 88,
      weight: 0.2,
      summary: "Most devices are patched; two need firmware updates.",
    },
    {
      id: "tsf-004",
      label: "Privacy Posture",
      score: 90,
      weight: 0.2,
      summary: "Tracker blocking and data-sharing limits are enabled.",
    },
    {
      id: "tsf-005",
      label: "Family Safety",
      score: 80,
      weight: 0.15,
      summary: "Parental controls are set; teen account could use tighter limits.",
    },
  ],
};

export const trustScoreLabel = "Protected" as const;

export const trustCategories: TrustCategory[] = [
  {
    id: "tc-network",
    name: "Network Security",
    score: 92,
    note: "All devices updated, firewall active.",
  },
  {
    id: "tc-phishing",
    name: "Phishing Protection",
    score: 85,
    note: "3 attempts blocked this month, 1 near-miss.",
  },
  {
    id: "tc-device",
    name: "Device Health",
    score: 88,
    note: "12 devices connected, all recognized, 1 needs firmware update.",
  },
  {
    id: "tc-privacy",
    name: "Privacy Posture",
    score: 90,
    note: "All controls configured, data minimization active.",
  },
  {
    id: "tc-family",
    name: "Family Safety",
    score: 80,
    note: "Teen account needs updated safe-browsing settings.",
  },
];

export const scoreHistory: ScoreHistoryPoint[] = [
  { month: "Aug", score: 72 },
  { month: "Sep", score: 76 },
  { month: "Oct", score: 79 },
  { month: "Nov", score: 82 },
  { month: "Dec", score: 85 },
  { month: "Jan", score: 87 },
];

export const recommendations: Recommendation[] = [
  {
    id: "rec-01",
    title: "Update firmware on 2 devices",
    detail:
      "Alex's gaming PC and the Front Door Camera are running outdated firmware with known fixes.",
    pointImpact: 4,
  },
  {
    id: "rec-02",
    title: "Tighten Alex's teen account limits",
    detail:
      "Enable app approval for new installs to raise the Family Safety score.",
    pointImpact: 3,
  },
  {
    id: "rec-03",
    title: "Turn on email masking for sign-ups",
    detail:
      "Use relay addresses on new accounts to reduce future breach exposure.",
    pointImpact: 2,
  },
  {
    id: "rec-04",
    title: "Hide profiles from search engines",
    detail:
      "Reduce your public footprint by keeping family profiles out of search results.",
    pointImpact: 2,
  },
];
