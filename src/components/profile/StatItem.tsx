import type { LucideIcon } from "lucide-react";

interface StatItemProps {
  icon: LucideIcon;
  children: React.ReactNode;
}

export default function StatItem({ icon: Icon, children }: StatItemProps) {
  return (
    <div className="flex items-center gap-1.5 text-content-muted">
      <Icon className="w-4 h-4 text-primary" />
      <span>{children}</span>
    </div>
  );
}
