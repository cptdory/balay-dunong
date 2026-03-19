export function DashboardPlaceholder({
  icon,
  label,
}: {
  icon: string;
  label: string;
}) {
  return (
    <div className="empty-content" style={{ minHeight: 480 }}>
      <div className="empty-icon">{icon}</div>
      <div className="empty-title">{label} - Coming Soon</div>
      <div className="empty-description">
        This section is ready to be built. Content will appear here once connected to your backend.
      </div>
    </div>
  );
}
