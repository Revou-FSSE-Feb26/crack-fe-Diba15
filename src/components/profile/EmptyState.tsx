import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 py-16 flex flex-col items-center gap-3 text-center px-4">
      <Icon className="w-10 h-10 text-content-muted/40" />
      <p className="font-medium text-content">{title}</p>
      <p className="text-sm text-content-muted max-w-xs">{description}</p>
    </div>
  );
}
