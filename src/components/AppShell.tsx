"use client";

import { useState, type ReactNode } from "react";
import {
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  PackageCheck,
  Search,
  Settings,
  Sun,
  Users,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useDemoState } from "@/src/state/DemoContext";
import type { DemoState } from "@/src/types";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/orders", label: "Orders", icon: PackageCheck },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

function Navigation({ collapsed = false, mobile = false }: { collapsed?: boolean; mobile?: boolean }) {
  const navigate = useNavigate();
  return (
    <>
      <nav className="sidebar-nav" aria-label="Main navigation">
        {navItems.map(({ to, label, icon: Icon }) => {
          const link = (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              title={collapsed ? label : undefined}
            >
              <Icon aria-hidden="true" size={19} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          );
          return mobile ? <SheetClose asChild key={to}>{link}</SheetClose> : link;
        })}
      </nav>
      <button className="nav-link logout" onClick={() => navigate("/login")}>
        <LogOut aria-hidden="true" size={19} />
        {!collapsed && <span>Log out</span>}
      </button>
    </>
  );
}

export default function AppShell({
  theme,
  onTheme,
  children,
}: {
  theme: "light" | "dark";
  onTheme: () => void;
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const { demoState, setDemoState } = useDemoState();
  const location = useLocation();
  const pageName = navItems.find((item) => location.pathname.startsWith(item.to))?.label ?? "Workspace";

  return (
    <div className={`app-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      <aside className="desktop-sidebar">
        <div className="brand">
          <span className="brand-mark">L</span>
          {!collapsed && <span><strong>LumaDesk</strong><small>Commerce studio</small></span>}
        </div>
        <Navigation collapsed={collapsed} />
        <button
          className="collapse-button"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </aside>

      <div className="app-column">
        <header className="topbar">
          <div className="topbar-left">
            <Sheet>
              <SheetTrigger asChild>
                <button className="icon-button mobile-menu" aria-label="Open navigation menu">
                  <Menu aria-hidden="true" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="mobile-sheet">
                <SheetHeader>
                  <SheetTitle className="mobile-brand"><span className="brand-mark">L</span> LumaDesk</SheetTitle>
                  <SheetDescription>Commerce studio navigation</SheetDescription>
                </SheetHeader>
                <Navigation mobile />
              </SheetContent>
            </Sheet>
            <div><span className="topbar-label">Workspace</span><strong>{pageName}</strong></div>
          </div>

          <div className="topbar-actions">
            <label className="demo-state">
              <span>Demo state</span>
              <select
                value={demoState}
                onChange={(event) => setDemoState(event.target.value as DemoState)}
                aria-label="Select a demo data state"
              >
                <option value="ready">Ready</option>
                <option value="loading">Loading</option>
                <option value="empty">Empty</option>
                <option value="error">Error</option>
              </select>
            </label>
            <button className="icon-button desktop-search" aria-label="Search workspace">
              <Search aria-hidden="true" size={19} />
            </button>
            <button className="icon-button has-dot" aria-label="Notifications, 3 unread">
              <Bell aria-hidden="true" size={19} />
            </button>
            <button className="icon-button" onClick={onTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}>
              {theme === "light" ? <Moon aria-hidden="true" size={19} /> : <Sun aria-hidden="true" size={19} />}
            </button>
            <button className="profile-button" aria-label="Open Ahmad's profile menu">
              <span>AK</span><span className="profile-copy"><strong>Ahmad Kali</strong><small>Administrator</small></span>
            </button>
          </div>
        </header>
        <main className="page-content" id="main-content">{children}</main>
      </div>
    </div>
  );
}
