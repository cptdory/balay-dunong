"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare, BarChart3, Users, BookOpen, Calendar, Briefcase, FileText, Settings, UserCheck, BellIcon, PanelLeft } from "lucide-react";
import { Toaster } from "sileo";

type NavItem = {
  href: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  label: string;
};

type NavGroup = {
  group: string;
  items: NavItem[];
};

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
      { href: "/instructors", icon: Briefcase, label: "Instructors" },
      { href: "/reports", icon: FileText, label: "Reports" },
      { href: "/settings", icon: Settings, label: "Settings" },
    ],
  },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
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
        </div>

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
            <span>
              {!collapsed && (
                <button className="collapse-btn" onClick={() => setCollapsed(true)} title="Collapse">
                  <PanelLeft />
                </button>
              )}
              {collapsed && (
                <button className="collapse-btn" onClick={() => setCollapsed(false)} title="Collapse">
                  <PanelLeft />
                </button>
              )}
            </span>
          </div>
          <div className="header-actions">
            <div className="notification-icon">
              <span><BellIcon /></span>
              <div className="notification-dot" />
            </div>
            <div className="notification-icon">
              <span><MessageSquare /></span>
              <div className="notification-dot" />
            </div>
            <div className="sidebar-avatar" style={{ cursor: "pointer" }}>
              AD
            </div>
          </div>
        </header>

        <main className="dashboard-content fade-in" key={pathname}>
          {!pathname.startsWith("/programs/") && (
            <div className="page-header">
              <h1 className="page-title gold-text">{activeLabel}</h1>
            </div>
          )}

          {children}
        </main>

        <footer className="dashboard-footer">
          <div className="footer-text footer-text-uppercase">(c) 2025 Casa Del Sapere</div>
          <div className="footer-text">Admin Portal v1.0</div>
        </footer>
      </div>
    </div>
  );
}

// Wrapper component with AlertProvider
export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
      <DashboardLayoutContent>{children}
      <Toaster position="bottom-right" theme="dark" />
      </DashboardLayoutContent>
  );
}


