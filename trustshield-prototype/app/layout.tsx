import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrustShield",
  description: "AI-powered protection against digital threats, deepfakes, and privacy risks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-navy text-white antialiased">
        {children}
      </body>
    </html>
  );
}
