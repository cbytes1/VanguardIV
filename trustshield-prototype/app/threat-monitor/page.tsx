import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import ThreatMonitorClient from "./ThreatMonitorClient";

export const metadata: Metadata = {
  title: "Threat Monitor · TrustShield",
};

export default function ThreatMonitorPage() {
  return (
    <AppShell>
      <ThreatMonitorClient />
    </AppShell>
  );
}
