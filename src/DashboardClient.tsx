"use client";

import { useSyncExternalStore } from "react";
import { BrowserRouter } from "react-router";
import DashboardApp from "@/src/DashboardApp";

export default function DashboardClient() {
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <main className="boot-screen" aria-label="Loading LumaDesk">
        <span className="brand-mark">L</span>
        <p>Opening your workspace…</p>
      </main>
    );
  }

  const basename = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

  return (
    <BrowserRouter basename={basename}>
      <DashboardApp />
    </BrowserRouter>
  );
}
