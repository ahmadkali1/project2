"use client";

import { Navigate, Route, Routes } from "react-router";
import AppShell from "@/src/components/AppShell";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { AuthProvider, useAuth } from "@/src/state/AuthContext";
import { DemoContext } from "@/src/state/DemoContext";
import { ThemeProvider } from "@/src/state/ThemeContext";
import type { DemoState } from "@/src/types";
import { useState } from "react";
import LoginPage from "@/src/views/LoginPage";
import DashboardPage from "@/src/views/DashboardPage";
import CustomersPage from "@/src/views/CustomersPage";
import OrdersPage from "@/src/views/OrdersPage";
import AnalyticsPage from "@/src/views/AnalyticsPage";
import SettingsPage from "@/src/views/SettingsPage";
import NotFoundPage from "@/src/views/NotFoundPage";

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppShell>
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
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function DashboardApp() {
  const [demoState, setDemoState] = useState<DemoState>("ready");

  return (
    <AuthProvider>
      <ThemeProvider>
        <DemoContext.Provider value={{ demoState, setDemoState }}>
          <AppRoutes />
        </DemoContext.Provider>
      </ThemeProvider>
    </AuthProvider>
  );
}
