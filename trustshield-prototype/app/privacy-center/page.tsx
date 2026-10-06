import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import PrivacyCenterClient from "./PrivacyCenterClient";

export const metadata: Metadata = {
  title: "Privacy Center · TrustShield",
};

export default function PrivacyCenterPage() {
  return (
    <AppShell>
      <PrivacyCenterClient />
    </AppShell>
  );
}
