"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldAlert,
  ScanFace,
  Users,
  Lock,
  Gauge,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/threat-monitor", label: "Threat Monitor", icon: ShieldAlert },
  { href: "/deepfake-checker", label: "Deepfake Checker", icon: ScanFace },
  { href: "/family-protection", label: "Family Protection", icon: Users },
  { href: "/privacy-center", label: "Privacy Center", icon: Lock },
  { href: "/trust-score", label: "Trust Score", icon: Gauge },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-navy-lighter/60 bg-navy-light/60 md:h-screen md:w-64 md:border-b-0 md:border-r">
      <Link
        href="/"
        className="flex items-center gap-3 px-5 py-5 text-white transition-colors hover:text-teal"
      >
        <ShieldCheck className="h-6 w-6 shrink-0 text-teal" />
        <span className="flex flex-col leading-tight">
          <span className="text-lg font-semibold tracking-tight">
            TrustShield
          </span>
          <span className="text-[11px] font-medium uppercase tracking-wide text-teal/80">
            Team Vanguard IV
          </span>
        </span>
      </Link>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:gap-1 md:overflow-visible md:pb-0">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-teal/15 text-teal"
                  : "text-white/70 hover:bg-navy-lighter/40 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden px-5 py-4 text-xs text-white/40 md:block">
        <p>Demo prototype</p>
        <p>Team Vanguard IV · 2026</p>
      </div>
    </aside>
  );
}
