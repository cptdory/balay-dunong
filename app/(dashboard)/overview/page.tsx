"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

type StatItem = {
  label: string;
  value: string | number;
  delta: string;
  up: boolean;
};

export default function OverviewPage() {
  const studentStats = useQuery(api._users.getUsers, { role: "student" });
  const coursesStats = useQuery(api._courses.countCourses, { status: "active" });

  const stats: StatItem[] = [
    {
      label: "Total Students",
      value: studentStats?.totalStudents ?? 0,
      delta: `+${studentStats?.studentsThisMonth ?? 0} this month`,
      up: true,
    },
    {
      label: "Active Courses",
      value: coursesStats?.activeCourses ?? 0,
      delta: "All running",
      up: true,
    },
    {
      label: "Pending Enrollments",
      value: 8,
      delta: "3 need review",
      up: false,
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value gold-text">{stat.value}</div>
            <div className={`stat-delta ${stat.up ? "positive" : "negative"}`}>
              {stat.up ? "^" : "v"} {stat.delta}
            </div>
          </div>
        ))}
      </div>

      <div className="content-grid two-column">
        <div className="empty-content" style={{ minHeight: 320 }}>
          <div className="empty-icon">E</div>
          <div className="empty-title">Recent Enrollments</div>
          <div className="empty-description">
            Latest enrollment activity will appear here once connected to your backend.
          </div>
        </div>

        <div className="empty-content" style={{ minHeight: 320 }}>
          <div className="empty-icon">A</div>
          <div className="empty-title">Recent Activity</div>
          <div className="empty-description">
            Activity feed will display enrollment updates, schedule changes, and notifications.
          </div>
        </div>
      </div>
    </div>
  );
}
