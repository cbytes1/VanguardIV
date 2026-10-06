import type { Severity } from "@/lib/types";
import { cn, severityStyle } from "@/lib/utils";

interface SeverityBadgeProps {
  severity: Severity;
  label?: string;
}

export default function SeverityBadge({ severity, label }: SeverityBadgeProps) {
  const style = severityStyle(severity);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        style.bg,
        style.border,
        style.text,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} aria-hidden />
      {label ?? style.label}
    </span>
  );
}
