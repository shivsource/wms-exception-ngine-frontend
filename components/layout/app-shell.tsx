"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  /** The login screen isn't part of the dashboard — no sidebar/nav chrome around it. */
  if (pathname === "/login") {
    return <div className="min-h-dvh w-full bg-background">{children}</div>;
  }

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
