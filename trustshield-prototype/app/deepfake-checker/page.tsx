import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import DeepfakeCheckerClient from "./DeepfakeCheckerClient";

export const metadata: Metadata = {
  title: "Deepfake Checker · TrustShield",
};

export default function DeepfakeCheckerPage() {
  return (
    <AppShell>
      <DeepfakeCheckerClient />
    </AppShell>
  );
}
