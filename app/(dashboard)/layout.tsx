"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { BarChart3, Users, BookOpen, Calendar, Briefcase, FileText, Settings, UserCheck } from "lucide-react";
import { AlertProvider, useAlert } from "./alert-context";
import { ErrorAlert } from "@/components/error-alert";

type NavItem = {
  href: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  label: string;
};

type NavGroup = {
  group: string;
  items: NavItem[];
};

const STARS = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: Math.random() > 0.8 ? 3 : 2,
  duration: `${2 + Math.random() * 3}s`,
  delay: `${Math.random() * 3}s`,
}));

const NAV_GROUPS: NavGroup[] = [
  {
    group: "Main",
    items: [
      { href: "/overview", icon: BarChart3, label: "Overview" },
      { href: "/enrollments", icon: UserCheck, label: "Enrollments" },
      { href: "/students", icon: Users, label: "Students" },
      { href: "/programs", icon: BookOpen, label: "Programs" },
    ],
  },
  {
    group: "Management",
    items: [
      { href: "/schedule", icon: Calendar, label: "Schedule" },
      { href: "/faculty", icon: Briefcase, label: "Faculty" },
      { href: "/reports", icon: FileText, label: "Reports" },
      { href: "/settings", icon: Settings, label: "Settings" },
    ],
  },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Alert Container Component
function AlertContainer() {
  const { alert, clearAlert } = useAlert();

  if (!alert) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 z-50">
      <ErrorAlert
        title={alert.title}
        message={alert.message}
        variant={alert.variant}
        onClose={clearAlert}
      />
    </div>
  );
}

// Dashboard Layout Component
function DashboardLayoutContent({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const allItems = useMemo(() => NAV_GROUPS.flatMap((group) => group.items), []);
  const activeItem = allItems.find((item) => isActivePath(pathname, item.href));
  const activeLabel = activeItem?.label ?? "Dashboard";

  return (
    <div className="dashboard-container">
      {STARS.map((s) => (
        <div
          key={s.id}
          className="star-background"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animation: `twinkle ${s.duration} ${s.delay} infinite alternate`,
          }}
        />
      ))}

      <aside
        className={`dashboard-sidebar ${collapsed ? "collapsed" : ""}`}
        style={{ width: collapsed ? 60 : 240 }}
      >
        <div className={`sidebar-header ${collapsed ? "collapsed" : ""}`}>
          <div className="sidebar-logo">
            <img
              src="/casa-del-sapere-logo.png"
              alt="Casa Del Sapere"
              style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
            />
            {!collapsed && (
              <div className="sidebar-logo-text">
                <div className="gold-text">Casa del Sapere</div>
                <div>Admin Portal</div>
              </div>
            )}
          </div>
          {!collapsed && (
            <button className="collapse-btn" onClick={() => setCollapsed(true)} title="Collapse">
              {"<<"}
            </button>
          )}
        </div>

        {collapsed && (
          <button
            className="collapse-btn"
            onClick={() => setCollapsed(false)}
            style={{ padding: "10px 0", width: "100%", borderBottom: "1px solid #c9a84c22" }}
            title="Expand"
          >
            {">>"}
          </button>
        )}

        <nav style={{ flex: 1, overflowY: "auto", paddingBottom: 16 }}>
          {NAV_GROUPS.map((group) => (
            <div key={group.group}>
              {!collapsed ? <div className="sidebar-group-label">{group.group}</div> : <div style={{ height: 12 }} />}

              {group.items.map((item) => {
                const active = isActivePath(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`sidebar-link ${active ? "active" : ""}`}
                    style={{
                      justifyContent: collapsed ? "center" : "flex-start",
                      padding: collapsed ? "11px 0" : "10px 16px",
                    }}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon size={16} className="sidebar-icon" />
                    {!collapsed && <span className="sidebar-label">{item.label}</span>}
                  </Link>
                );
              })}

              <div className="sidebar-divider" />
            </div>
          ))}
        </nav>

        <div className={`sidebar-footer ${collapsed ? "collapsed" : ""}`}>
          <div className="sidebar-avatar">AD</div>
          {!collapsed && (
            <div className="sidebar-user-info" style={{ overflow: "hidden" }}>
              <div>Admin</div>
              <div>admin@casadelsapere.com</div>
            </div>
          )}
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-title">
            <span className="header-breadcrumb">Dashboard</span>
            <span className="header-separator">/</span>
            <span className="header-page-name">{activeLabel}</span>
          </div>
          <div className="header-actions">
            <div className="notification-icon">
              <span>N</span>
              <div className="notification-dot" />
            </div>
            <button className="topbar-btn">+ New Enrollment</button>
            <div className="sidebar-avatar" style={{ cursor: "pointer" }}>
              AD
            </div>
          </div>
        </header>

        <main className="dashboard-content fade-in" key={pathname}>
          <div className="page-header">
            <p className="page-label">Casa Del Sapere - Admin Portal</p>
            <h1 className="page-title gold-text">{activeLabel}</h1>
          </div>

          {children}
        </main>

        <footer className="dashboard-footer">
          <div className="footer-text footer-text-uppercase">(c) 2025 Casa Del Sapere</div>
          <div className="footer-text">Admin Portal v1.0</div>
        </footer>

        <AlertContainer />
      </div>
    </div>
  );
}

// Wrapper component with AlertProvider
export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AlertProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </AlertProvider>
  );
}


