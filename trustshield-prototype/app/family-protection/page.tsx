import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import FamilyProtectionClient from "./FamilyProtectionClient";

export const metadata: Metadata = {
  title: "Family Protection · TrustShield",
};

export default function FamilyProtectionPage() {
  return (
    <AppShell>
      <FamilyProtectionClient />
    </AppShell>
  );
}
