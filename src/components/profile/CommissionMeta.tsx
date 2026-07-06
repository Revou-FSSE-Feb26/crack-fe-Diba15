import type { LucideIcon } from "lucide-react";

interface CommissionMetaProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

export default function CommissionMeta({ icon: Icon, label, value }: CommissionMetaProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-primary/5 px-3 py-2">
      <Icon className="w-4 h-4 text-primary shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-content-muted">{label}</p>
        <p className="truncate text-sm font-medium text-content capitalize">
          {value.replaceAll("_", " ")}
        </p>
      </div>
    </div>
  );
}
