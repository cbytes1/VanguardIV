import Sidebar from "@/components/Sidebar";
import PageTransition from "@/components/PageTransition";

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * App layout wrapper: persistent sidebar navigation plus a scrollable
 * content area. Used by every screen under the app. The content is wrapped in
 * PageTransition so navigating between screens fades the new content in.
 */
export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-navy md:flex-row">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden px-5 py-6 md:px-10 md:py-8">
        <div className="mx-auto w-full max-w-5xl">
          <PageTransition>{children}</PageTransition>
        </div>
      </main>
    </div>
  );
}
