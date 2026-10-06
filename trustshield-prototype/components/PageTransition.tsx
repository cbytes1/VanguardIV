"use client";

import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Fades the content area in whenever the route changes. The `key` is the
 * current pathname, so React remounts this wrapper on navigation and the
 * CSS `.page-transition` entrance animation replays for every screen.
 *
 * Marked "use client" only because it reads the active path; the animation
 * itself is pure CSS (see app/globals.css) and honors prefers-reduced-motion.
 */
export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  );
}
