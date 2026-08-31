"use client";

import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import AppShell from "@/src/components/AppShell";
import { DemoContext } from "@/src/state/DemoContext";
import type { DemoState } from "@/src/types";
import LoginPage from "@/src/views/LoginPage";
import DashboardPage from "@/src/views/DashboardPage";
import CustomersPage from "@/src/views/CustomersPage";
import OrdersPage from "@/src/views/OrdersPage";
import AnalyticsPage from "@/src/views/AnalyticsPage";
import SettingsPage from "@/src/views/SettingsPage";
import NotFoundPage from "@/src/views/NotFoundPage";

export default function DashboardApp() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const stored = window.localStorage.getItem("lumadesk-theme");
    return stored === "dark" ? "dark" : "light";
  });
  const [demoState, setDemoState] = useState<DemoState>("ready");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("lumadesk-theme", theme);
  }, [theme]);

  return (
    <DemoContext.Provider value={{ demoState, setDemoState }}>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <AppShell theme={theme} onTheme={() => setTheme((value) => value === "light" ? "dark" : "light")}>
              <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </AppShell>
          }
        />
      </Routes>
    </DemoContext.Provider>
  );
}
