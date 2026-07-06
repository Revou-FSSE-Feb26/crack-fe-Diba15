import type { CreditCard } from "lucide-react";

export default function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CreditCard;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-content/5 px-3 py-2">
      <div className="flex items-center gap-1.5 text-xs text-content-muted">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <p className="mt-1 text-sm font-medium text-content truncate">{value}</p>
    </div>
  );
}