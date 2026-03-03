"use client";
import { useState } from 'react';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';

export default function Dashboard() {
    const [active, setActive] = useState('overview');
    const [collapsed, setCollapsed] = useState(false);

    const courses = useQuery(api._courses.getUserCourses, {
        userId: "jd70brbkmht2t95rc3f27qwpbx81vzah" as any
    });

    const studentStats = useQuery(api._users.countStudents, {
        role: "student",
    });
    const coursesStats = useQuery(api._courses.countCourses, {
        status: "Active",
    });

    const stats = [
        { label: 'Total Students', value: studentStats?.totalStudents ?? 0, delta: `+${studentStats?.studentsThisMonth ?? 0} this month`, up: true },
        { label: 'Active Courses', value: coursesStats?.activeCourses ?? 0, delta: 'All running', up: true },
        { label: 'Pending Enrollments', value: '8', delta: '3 need review', up: false },
    ];

    const navItems = [
        {
            group: 'Main',
            items: [
                { id: 'overview', icon: '◈', label: 'Overview' },
                { id: 'enrollments', icon: '✦', label: 'Enrollments' },
                { id: 'students', icon: '◉', label: 'Students' },
            ],
        },
        {
            group: "Programs",
            items: courses
                ? courses.map((course) => ({
                    id: course._id,
                    icon: '🕮',
                    label: course.name,
                }))
                : [{ id: "loading", icon: "⏳", label: "Loading..." }],
        },
        {
            group: 'Management',
            items: [
                { id: 'schedule', icon: '◷', label: 'Schedule' },
                { id: 'faculty', icon: '◑', label: 'Faculty' },
                { id: 'reports', icon: '◧', label: 'Reports' },
                { id: 'settings', icon: '◎', label: 'Settings' },
            ],
        },
    ];

    const activeLabel = (navItems.flatMap((g: any) => g.items).find((i: any) => i.id === active) as any)?.label ?? 'Overview';

    return (
        <>
            <div className="dashboard-container">
                {/* Stars */}
                {[...Array(30)].map((_, i) => (
                    <div key={i} className="star-background" style={{
                        left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
                        width: Math.random() > 0.8 ? 3 : 2, height: Math.random() > 0.8 ? 3 : 2,
                        animation: `twinkle ${2 + Math.random() * 3}s ${Math.random() * 3}s infinite alternate`,
                    }} />
                ))}

                {/* ── SIDEBAR ── */}
                <aside
                    className={`dashboard-sidebar ${collapsed ? 'collapsed' : ''}`}
                    style={{
                        width: collapsed ? 60 : 240,
                    }}
                >
                    {/* Logo */}
                    <div className={`sidebar-header ${collapsed ? 'collapsed' : ''}`}>
                        <div className="sidebar-logo">
                                <img
                                    src="/casa-del-sapere-logo.png"
                                    alt="Casa Del Sapere"
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: "50%", // makes it round
                                        objectFit: "cover",
                                    }}
                                />
                            {!collapsed && (
                                <div className="sidebar-logo-text">
                                    <div className="gold-text">Casa del Sapere</div>
                                    <div>Admin Portal</div>
                                </div>
                            )}
                        </div>
                        {!collapsed && (
                            <button
                                className="collapse-btn"
                                onClick={() => setCollapsed(true)}
                                title="Collapse"
                            >
                                ‹‹
                            </button>
                        )}
                    </div>

                    {/* Collapsed expand btn */}
                    {collapsed && (
                        <button
                            className="collapse-btn"
                            onClick={() => setCollapsed(false)}
                            style={{ padding: '10px 0', width: '100%', borderBottom: '1px solid #c9a84c22' }}
                            title="Expand"
                        >
                            ››
                        </button>
                    )}

                    {/* Nav */}
                    <nav style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>
                        {navItems.map((group) => (
                            <div key={group.group}>
                                {!collapsed && <div className="sidebar-group-label">{group.group}</div>}
                                {collapsed && <div style={{ height: 12 }} />}
                                {group.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`sidebar-link ${active === item.id ? 'active' : ''}`}
                                        style={{ justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '11px 0' : '10px 16px' }}
                                        onClick={() => setActive(String(item.id))}
                                        title={collapsed ? String(item.label) : undefined}
                                    >
                                        <span className="sidebar-icon">{item.icon}</span>
                                        {!collapsed && <span className="sidebar-label">{item.label}</span>}
                                    </div>
                                ))}
                                <div className="sidebar-divider" />
                            </div>
                        ))}
                    </nav>

                    {/* User profile */}
                    <div className={`sidebar-footer ${collapsed ? 'collapsed' : ''}`}>
                        <div className="sidebar-avatar">AD</div>
                        {!collapsed && (
                            <div className="sidebar-user-info" style={{ overflow: 'hidden' }}>
                                <div>Admin</div>
                                <div>admin@casadelsapere.com</div>
                            </div>
                        )}
                    </div>
                </aside>

                {/* ── MAIN ── */}
                <div className="dashboard-main">

                    {/* Top bar */}
                    <header className="dashboard-header">
                        <div className="header-title">
                            <span className="header-breadcrumb">Dashboard</span>
                            <span className="header-separator">◆</span>
                            <span className="header-page-name">{activeLabel}</span>
                        </div>

                        <div className="header-actions">
                            {/* Notification bell */}
                            <div className="notification-icon">
                                <span>◉</span>
                                <div className="notification-dot" />
                            </div>
                            <button className="topbar-btn">+ New Enrollment</button>
                            <div className="sidebar-avatar" style={{ cursor: 'pointer' }}>AD</div>
                        </div>
                    </header>

                    {/* Page content */}
                    <main className="dashboard-content fade-in" key={active}>

                        {/* Page title */}
                        <div className="page-header">
                            <p className="page-label">Casa Del Sapere · Admin Portal</p>
                            <h1 className="page-title gold-text">{activeLabel}</h1>
                        </div>

                        {/* Stats row — shown only on overview */}
                        {active === 'overview' && (
                            <div className="stats-grid">
                                {stats.map((stat) => (
                                    <div key={stat.label} className="stat-card">
                                        <div className="stat-label">{stat.label}</div>
                                        <div className="stat-value gold-text">{stat.value}</div>
                                        <div className={`stat-delta ${stat.up ? 'positive' : 'negative'}`}>
                                            {stat.up ? '↑' : '↓'} {stat.delta}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Empty content area */}
                        <div className={`content-grid ${active === 'overview' ? 'two-column' : ''}`}>
                            {/* Main empty panel */}
                            <div
                                className="empty-content"
                                style={{ minHeight: active === 'overview' ? 320 : 480 }}
                            >
                                <div className="empty-icon">
                                    {((navItems as any).flatMap((g: any) => g.items).find((i: any) => i.id === active) as any)?.icon ?? '◈'}
                                </div>
                                <div className="empty-title">{activeLabel} — Coming Soon</div>
                                <div className="empty-description">
                                    This section is ready to be built. Content will appear here once connected to your backend.
                                </div>
                            </div>

                            {/* Side panel — only on overview */}
                            {active === 'overview' && (
                                <div className="empty-content">
                                    <div className="empty-icon">◷</div>
                                    <div className="empty-title">Recent Activity</div>
                                    <div className="empty-description">
                                        Activity feed will display enrollment updates, schedule changes, and notifications.
                                    </div>
                                </div>
                            )}
                        </div>

                    </main>

                    {/* Footer bar */}
                    <footer className="dashboard-footer">
                        <div className="footer-text footer-text-uppercase">© 2025 Casa Del Sapere</div>
                        <div className="footer-text">Admin Portal v1.0</div>
                    </footer>
                </div>
            </div>
        </>
    );
}