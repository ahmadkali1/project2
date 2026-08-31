"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  BarChart3,
  Bell,
  CheckCheck,
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
  UserRound,
  Users,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router";
import { toast, Toaster } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/src/state/AuthContext";
import { useDemoState } from "@/src/state/DemoContext";
import { useTheme } from "@/src/state/ThemeContext";
import type { DemoState } from "@/src/types";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, description: "Overview and KPIs" },
  { to: "/customers", label: "Customers", icon: Users, description: "Customer relationships" },
  { to: "/orders", label: "Orders", icon: PackageCheck, description: "Orders and fulfillment" },
  { to: "/analytics", label: "Analytics", icon: BarChart3, description: "Reports and trends" },
  { to: "/settings", label: "Settings", icon: Settings, description: "Workspace preferences" },
] as const;

function Navigation({ collapsed = false, mobile = false }: { collapsed?: boolean; mobile?: boolean }) {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  function logout() {
    signOut();
    navigate("/login", { replace: true });
  }

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
      <button className="nav-link logout" onClick={logout}>
        <LogOut aria-hidden="true" size={19} />
        {!collapsed && <span>Log out</span>}
      </button>
    </>
  );
}

function WorkspaceSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return navItems.filter((item) => !normalized || `${item.label} ${item.description}`.toLowerCase().includes(normalized));
  }, [query]);

  function go(to: string) {
    navigate(to);
    setOpen(false);
    setQuery("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="icon-button desktop-search" aria-label="Search workspace">
          <Search aria-hidden="true" size={19} />
        </button>
      </DialogTrigger>
      <DialogContent className="details-dialog workspace-search-dialog">
        <DialogHeader>
          <DialogTitle>Search workspace</DialogTitle>
          <DialogDescription>Jump directly to a LumaDesk section.</DialogDescription>
        </DialogHeader>
        <label className="search-field workspace-search-field">
          <span className="sr-only">Search sections</span>
          <Search aria-hidden="true" size={17} />
          <input autoFocus type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Dashboard, customers, analytics…" />
        </label>
        <div className="workspace-search-results" role="list">
          {matches.map(({ to, label, description, icon: Icon }) => (
            <button key={to} type="button" onClick={() => go(to)} role="listitem">
              <Icon aria-hidden="true" size={18} /><span><strong>{label}</strong><small>{description}</small></span>
            </button>
          ))}
          {matches.length === 0 && <p className="workspace-search-empty">No matching section.</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [unread, setUnread] = useState(3);
  const { demoState, setDemoState } = useDemoState();
  const { theme, toggleTheme } = useTheme();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pageName = navItems.find((item) => location.pathname.startsWith(item.to))?.label ?? "Workspace";

  function logout() {
    signOut();
    navigate("/login", { replace: true });
  }

  return (
    <div className={`app-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      <a className="skip-link" href="#main-content">Skip to main content</a>
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
          {collapsed ? <ChevronRight aria-hidden="true" size={16} /> : <ChevronLeft aria-hidden="true" size={16} />}
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

            <WorkspaceSearch />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`icon-button ${unread ? "has-dot" : ""}`} aria-label={`Notifications, ${unread} unread`}>
                  <Bell aria-hidden="true" size={19} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="topbar-menu w-72">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => navigate("/orders")}>Order LM-1048 was delivered</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate("/customers")}>Maya Chen joined Wholesale</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate("/analytics")}>August report is ready</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => { setUnread(0); toast.success("Notifications marked as read"); }}>
                  <CheckCheck aria-hidden="true" /> Mark all as read
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button className="icon-button" onClick={toggleTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}>
              {theme === "light" ? <Moon aria-hidden="true" size={19} /> : <Sun aria-hidden="true" size={19} />}
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="profile-button" aria-label="Open Ahmad's profile menu">
                  <span>AK</span><span className="profile-copy"><strong>Ahmad Kali</strong><small>Administrator</small></span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="topbar-menu w-56">
                <DropdownMenuLabel>Ahmad Kali</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => navigate("/settings")}><UserRound aria-hidden="true" /> Profile & settings</DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onSelect={logout}><LogOut aria-hidden="true" /> Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="page-content" id="main-content" tabIndex={-1}>{children}</main>
      </div>
      <Toaster position="bottom-right" theme={theme} richColors closeButton />
    </div>
  );
}
