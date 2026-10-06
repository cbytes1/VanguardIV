import Link from "next/link";
import {
  ShieldCheck,
  ShieldAlert,
  ScanFace,
  Users,
  Lock,
  Gauge,
  ArrowRight,
} from "lucide-react";

const FEATURES = [
  {
    href: "/dashboard",
    title: "Dashboard",
    description: "Your household's safety at a glance.",
    icon: Gauge,
  },
  {
    href: "/threat-monitor",
    title: "Threat Monitor",
    description: "Catch phishing, scams, and breaches in real time.",
    icon: ShieldAlert,
  },
  {
    href: "/deepfake-checker",
    title: "Deepfake Checker",
    description: "Analyze media for AI manipulation.",
    icon: ScanFace,
  },
  {
    href: "/family-protection",
    title: "Family Protection",
    description: "Protect everyone from one place.",
    icon: Users,
  },
  {
    href: "/privacy-center",
    title: "Privacy Center",
    description: "Control how your data is tracked and shared.",
    icon: Lock,
  },
  {
    href: "/trust-score",
    title: "Trust Score",
    description: "One measure of your digital safety.",
    icon: ShieldCheck,
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16">
      <div className="flex flex-col items-start gap-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/10 px-3 py-1 text-xs font-medium text-teal">
          <ShieldCheck className="h-3.5 w-3.5" />
          A guided demo of the Johnson Family household
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          TrustShield
        </h1>
        <p className="max-w-xl text-base text-white/60">
          AI-powered protection against phishing, scams, deepfakes, and privacy
          risks, for you and your whole family. Follow the Johnson family of
          Denver, CO through all six screens to see how one broadband app keeps
          a household safe.
        </p>
        <Link
          href="/dashboard"
          className="mt-2 inline-flex items-center gap-2 rounded-lg bg-teal px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-cyan"
        >
          Start the tour
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <section className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.href}
              href={feature.href}
              className="group flex flex-col gap-3 rounded-2xl border border-navy-lighter/50 bg-navy-light/60 p-5 transition-colors hover:border-teal/50"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/15 text-teal">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-semibold text-white group-hover:text-teal">
                  {feature.title}
                </h2>
                <p className="mt-1 text-sm text-white/55">
                  {feature.description}
                </p>
              </div>
            </Link>
          );
        })}
      </section>

      <p className="mt-14 text-xs text-white/40">
        Demo prototype · Team Vanguard IV · 2026 High School Innovation Challenge
      </p>
    </main>
  );
}
