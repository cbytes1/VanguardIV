import type { Metadata } from "next";
import { Gauge } from "lucide-react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import TrustScoreClient from "./TrustScoreClient";

export const metadata: Metadata = {
  title: "Trust Score · TrustShield",
};

export default function TrustScorePage() {
  return (
    <AppShell>
      <PageHeader
        title="Trust Score"
        description="A single measure of your household's digital safety, calculated from your security habits, exposures, and privacy settings."
        icon={<Gauge className="h-5 w-5" />}
      />
      <TrustScoreClient />
    </AppShell>
  );
}
