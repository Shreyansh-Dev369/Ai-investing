import type { Metadata } from "next";
import "./globals.css";
import { WorkspaceProvider } from "@/context/WorkspaceContext";

export const metadata: Metadata = {
  title: "AI Investment Intelligence — Research-First Investment Operating System",
  description:
    "An institutional-grade investment platform unifying security discovery, company deep-dives, DCF valuation, portfolio risk monitoring, multi-perspective committee debate, and thesis tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[var(--bg-base)] text-[var(--text-primary)]">
        <WorkspaceProvider>{children}</WorkspaceProvider>
      </body>
    </html>
  );
}
