"use client";
import { useState, useMemo } from 'react';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import {
    ColumnDef, flexRender, getCoreRowModel, useReactTable,
} from "@tanstack/react-table";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Student = {
    id: string;
    name: string;
    email: string;
    status: "Active" | "Inactive" | "Pending";
    enrollmentDate: string;
};

export type StatItem = {
    label: string;
    value: string | number;
    delta: string;
    up: boolean;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const STARS = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() > 0.8 ? 3 : 2,
    duration: `${2 + Math.random() * 3}s`,
    delay: `${Math.random() * 3}s`,
}));

const columns: ColumnDef<Student>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "enrollmentDate", header: "Enrollment Date" },
];

// ─── Page Components ──────────────────────────────────────────────────────────

export function OverviewPage({ stats }: { stats: StatItem[] }) {
    return (
        <div className="flex flex-col gap-5">
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

            <div className="content-grid two-column">
                <div className="empty-content" style={{ minHeight: 320 }}>
                    <div className="empty-icon">◈</div>
                    <div className="empty-title">Recent Enrollments</div>
                    <div className="empty-description">
                        Latest enrollment activity will appear here once connected to your backend.
                    </div>
                </div>
                <div className="empty-content" style={{ minHeight: 320 }}>
                    <div className="empty-icon">◷</div>
                    <div className="empty-title">Recent Activity</div>
                    <div className="empty-description">
                        Activity feed will display enrollment updates, schedule changes, and notifications.
                    </div>
                </div>
            </div>
        </div>
    );
}

export function StudentsPage({ studentsData }: { studentsData: Student[] }) {
    const table = useReactTable({ data: studentsData, columns, getCoreRowModel: getCoreRowModel() });

    return (
        <div className="empty-content" style={{ minHeight: 480, display: 'block', padding: '24px' }}>
            <p className="text-sm text-gray-400 mb-6">Manage and view all registered students.</p>
            <div className="rounded-md border border-[#c9a84c22]">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id} className="border-b-[#c9a84c22] hover:bg-transparent">
                                {hg.headers.map((header) => (
                                    <TableHead key={header.id} className="text-[#c9a84c]">
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="border-b-[#c9a84c22] hover:bg-[#c9a84c11]">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="text-gray-300">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-400">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export function EnrollmentsPage() { return <ComingSoonPage icon="✦" label="Enrollments" />; }
export function SchedulePage()    { return <ComingSoonPage icon="◷" label="Schedule" />; }
export function FacultyPage()     { return <ComingSoonPage icon="◑" label="Faculty" />; }
export function ReportsPage()     { return <ComingSoonPage icon="◧" label="Reports" />; }
export function SettingsPage()    { return <ComingSoonPage icon="◎" label="Settings" />; }

export function ComingSoonPage({ icon, label }: { icon: string; label: string }) {
    return (
        <div className="empty-content" style={{ minHeight: 480 }}>
            <div className="empty-icon">{icon}</div>
            <div className="empty-title">{label} — Coming Soon</div>
            <div className="empty-description">
                This section is ready to be built. Content will appear here once connected to your backend.
            </div>
        </div>
    );
}

// ─── Page Router ──────────────────────────────────────────────────────────────

function PageRouter({ active, stats, studentsData }: {
    active: string;
    stats: StatItem[];
    studentsData: Student[];
}) {
    const pages: Record<string, React.ReactNode> = {
        overview:    <OverviewPage stats={stats} />,
        students:    <StudentsPage studentsData={studentsData} />,
        enrollments: <EnrollmentsPage />,
        schedule:    <SchedulePage />,
        faculty:     <FacultyPage />,
        reports:     <ReportsPage />,
        settings:    <SettingsPage />,
    };

    return <>{pages[active] ?? <ComingSoonPage icon="🕮" label="Program" />}</>;
}

// ─── Dashboard Shell ──────────────────────────────────────────────────────────

export default function Dashboard() {
    const [active, setActive] = useState('overview');
    const [collapsed, setCollapsed] = useState(false);

    const courses      = useQuery(api._courses.getUserCourses, { userId: "jd7b9aqkvb5eqde7r3xhgcjp9d826ngv" as any });
    const studentStats = useQuery(api._users.getStudents, { role: "Student" });
    const coursesStats = useQuery(api._courses.countCourses, { status: "Active" });

    const stats: StatItem[] = [
        { label: 'Total Students',     value: studentStats?.totalStudents ?? 0, delta: `+${studentStats?.studentsThisMonth ?? 0} this month`, up: true },
        { label: 'Active Courses',     value: coursesStats?.activeCourses ?? 0, delta: 'All running',   up: true },
        { label: 'Pending Enrollments', value: '8',                             delta: '3 need review', up: false },
    ];

    const navItems = [
        {
            group: 'Main',
            items: [
                { id: 'overview',    icon: '◈', label: 'Overview' },
                { id: 'enrollments', icon: '✦', label: 'Enrollments' },
                { id: 'students',    icon: '◉', label: 'Students' },
            ],
        },
        {
            group: 'Programs',
            items: courses
                ? courses.map((c) => ({ id: String(c._id), icon: '🕮', label: c.name }))
                : [{ id: 'loading', icon: '⏳', label: 'Loading...' }],
        },
        {
            group: 'Management',
            items: [
                { id: 'schedule', icon: '◷', label: 'Schedule' },
                { id: 'faculty',  icon: '◑', label: 'Faculty' },
                { id: 'reports',  icon: '◧', label: 'Reports' },
                { id: 'settings', icon: '◎', label: 'Settings' },
            ],
        },
    ];

    const allItems    = navItems.flatMap((g) => g.items) as any[];
    const activeLabel = allItems.find((i) => i.id === active)?.label ?? 'Overview';

    const studentsData = useMemo<Student[]>(() =>
        studentStats?.students?.map((s) => ({
            id: s._id,
            name: s.name,
            email: s.email,
            status: "Active" as const,
            enrollmentDate: new Date(s._creationTime).toISOString().split("T")[0],
        })) ?? []
    , [studentStats]);

    return (
        <div className="dashboard-container">
            {STARS.map((s) => (
                <div key={s.id} className="star-background" style={{
                    left: s.left, top: s.top, width: s.size, height: s.size,
                    animation: `twinkle ${s.duration} ${s.delay} infinite alternate`,
                }} />
            ))}

            {/* ── Sidebar ── */}
            <aside className={`dashboard-sidebar ${collapsed ? 'collapsed' : ''}`} style={{ width: collapsed ? 60 : 240 }}>
                <div className={`sidebar-header ${collapsed ? 'collapsed' : ''}`}>
                    <div className="sidebar-logo">
                        <img src="/casa-del-sapere-logo.png" alt="Casa Del Sapere"
                            style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                        {!collapsed && (
                            <div className="sidebar-logo-text">
                                <div className="gold-text">Casa del Sapere</div>
                                <div>Admin Portal</div>
                            </div>
                        )}
                    </div>
                    {!collapsed && (
                        <button className="collapse-btn" onClick={() => setCollapsed(true)} title="Collapse">‹‹</button>
                    )}
                </div>

                {collapsed && (
                    <button className="collapse-btn" onClick={() => setCollapsed(false)}
                        style={{ padding: '10px 0', width: '100%', borderBottom: '1px solid #c9a84c22' }} title="Expand">
                        ››
                    </button>
                )}

                <nav style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>
                    {navItems.map((group) => (
                        <div key={group.group}>
                            {!collapsed ? (
                                <div className="sidebar-group-label">{group.group}</div>
                            ) : (
                                <div style={{ height: 12 }} />
                            )}
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

            {/* ── Main ── */}
            <div className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-title">
                        <span className="header-breadcrumb">Dashboard</span>
                        <span className="header-separator">◆</span>
                        <span className="header-page-name">{activeLabel}</span>
                    </div>
                    <div className="header-actions">
                        <div className="notification-icon">
                            <span>◉</span>
                            <div className="notification-dot" />
                        </div>
                        <button className="topbar-btn">+ New Enrollment</button>
                        <div className="sidebar-avatar" style={{ cursor: 'pointer' }}>AD</div>
                    </div>
                </header>

                <main className="dashboard-content fade-in" key={active}>
                    <div className="page-header">
                        <p className="page-label">Casa Del Sapere · Admin Portal</p>
                        <h1 className="page-title gold-text">{activeLabel}</h1>
                    </div>

                    <PageRouter active={active} stats={stats} studentsData={studentsData} />
                </main>

                <footer className="dashboard-footer">
                    <div className="footer-text footer-text-uppercase">© 2025 Casa Del Sapere</div>
                    <div className="footer-text">Admin Portal v1.0</div>
                </footer>
            </div>
        </div>
    );
}