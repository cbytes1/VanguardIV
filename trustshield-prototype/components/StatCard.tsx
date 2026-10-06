import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import type { DashboardStat } from "@/lib/types";
import { cn } from "@/lib/utils";
import Card from "@/components/Card";

const TONE_CLASSES: Record<DashboardStat["tone"], string> = {
  safe: "text-emerald",
  warning: "text-amber",
  threat: "text-threat",
  accent: "text-teal",
};

interface StatCardProps {
  stat: DashboardStat;
}

export default function StatCard({ stat }: StatCardProps) {
  const TrendIcon =
    stat.trend === "up"
      ? ArrowUpRight
      : stat.trend === "down"
        ? ArrowDownRight
        : Minus;

  // For most stats, "up" is good; for active threats, down is good.
  const positive =
    stat.tone === "threat" ? stat.trend === "down" : stat.trend === "up";

  return (
    <Card className="flex flex-col gap-3">
      <p className="text-sm text-white/60">{stat.label}</p>
      <div className="flex items-end justify-between">
        <span className={cn("text-3xl font-semibold", TONE_CLASSES[stat.tone])}>
          {stat.value}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1 text-xs font-medium",
            positive ? "text-emerald" : "text-threat",
          )}
        >
          <TrendIcon className="h-3.5 w-3.5" />
          {Math.abs(stat.change)}%
        </span>
      </div>
    </Card>
  );
}
