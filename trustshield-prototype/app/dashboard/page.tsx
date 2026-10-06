import { LayoutDashboard } from "lucide-react";
import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import DashboardClient from "@/app/dashboard/DashboardClient";
import {
  dashboardStats,
  household,
  recentActivity,
  trustScore,
  trustScoreLabel,
} from "@/data/mock";

export const metadata: Metadata = {
  title: "Dashboard · TrustShield",
};

export default function DashboardPage() {
  return (
    <AppShell>
      <PageHeader
        title={`${household.name} · Home`}
        description={`A snapshot of your household's digital safety in ${household.location}.`}
        icon={<LayoutDashboard className="h-5 w-5" />}
      />

      <DashboardClient
        trustScore={trustScore}
        trustScoreLabel={trustScoreLabel}
        dashboardStats={dashboardStats}
        recentActivity={recentActivity}
      />
    </AppShell>
  );
}
