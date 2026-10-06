import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // TrustShield design-system palette
        navy: {
          DEFAULT: "#0F172A", // primary background
          light: "#1E293B", // card / panel surface
          lighter: "#334155", // borders / muted surface
        },
        teal: "#06B6D4", // accent (teal/cyan)
        cyan: "#06B6D4", // alias for accent
        emerald: "#10B981", // safe / protected
        amber: "#F59E0B", // warning
        threat: "#EF4444", // threat / danger
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      // Shared motion vocabulary used across screens (page transitions,
      // live-feed highlights, status indicators). Reference as e.g.
      // `animate-fade-in`, `animate-pulse-slow`, `animate-ping-soft`.
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        "ping-soft": {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out both",
        "pulse-slow": "pulse-slow 2.4s ease-in-out infinite",
        "ping-soft": "ping-soft 1.6s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
