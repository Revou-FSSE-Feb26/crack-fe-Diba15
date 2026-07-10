import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
	icon: LucideIcon;
	title: string;
	description: string;
}

export default function EmptyState({
	icon: Icon,
	title,
	description,
}: EmptyStateProps) {
	return (
		<div className="rounded-2xl border border-dashed border-warm/30 py-16 flex flex-col items-center gap-3 text-center px-4 bg-warm/5">
			<div className="flex items-center justify-center w-16 h-16 rounded-full bg-warm/10">
				<Icon className="w-7 h-7 text-warm-hover" />
			</div>
			<p className="font-medium text-content">{title}</p>
			<p className="text-sm text-content-muted max-w-xs">{description}</p>
		</div>
	);
}
