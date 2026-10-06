import {
  Mail,
  Bug,
  PhoneCall,
  Database,
  ScanFace,
  UserX,
  MessageSquare,
  ShieldCheck,
  ShieldAlert,
  Search,
  CircleDot,
} from "lucide-react";
import type { Threat, ThreatCategory, ThreatStatus } from "@/lib/types";
import { cn, formatDateTime } from "@/lib/utils";
import SeverityBadge from "@/components/SeverityBadge";

const CATEGORY_ICON: Record<
  ThreatCategory,
  React.ComponentType<{ className?: string }>
> = {
  phishing: Mail,
  malware: Bug,
  "scam-call": PhoneCall,
  "data-breach": Database,
  deepfake: ScanFace,
  "identity-theft": UserX,
  smishing: MessageSquare,
};

const STATUS_META: Record<
  ThreatStatus,
  { label: string; className: string; icon: React.ComponentType<{ className?: string }> }
> = {
  active: { label: "Active", className: "text-threat", icon: ShieldAlert },
  blocked: { label: "Blocked", className: "text-emerald", icon: ShieldCheck },
  resolved: { label: "Resolved", className: "text-emerald", icon: ShieldCheck },
  investigating: { label: "Investigating", className: "text-amber", icon: Search },
};

interface ThreatRowProps {
  threat: Threat;
}

export default function ThreatRow({ threat }: ThreatRowProps) {
  const CategoryIcon = CATEGORY_ICON[threat.category] ?? CircleDot;
  const status = STATUS_META[threat.status];
  const StatusIcon = status.icon;

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-navy-lighter/40 bg-navy/40 p-4 sm:flex-row sm:items-start sm:gap-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-lighter/40 text-teal">
        <CategoryIcon className="h-4 w-4" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-medium text-white">{threat.title}</h3>
          <SeverityBadge severity={threat.severity} />
        </div>
        <p className="mt-1 text-sm text-white/60">{threat.description}</p>
        <p className="mt-2 text-xs text-white/40">
          {threat.source} · {formatDateTime(threat.detectedAt)}
        </p>
      </div>

      <span
        className={cn(
          "inline-flex shrink-0 items-center gap-1.5 text-xs font-medium",
          status.className,
        )}
      >
        <StatusIcon className="h-3.5 w-3.5" />
        {status.label}
      </span>
    </li>
  );
}
