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
		<div className="rounded-2xl border border-dashed border-warm/30 py-10 sm:py-16 flex flex-col items-center gap-2.5 sm:gap-3 text-center px-4 bg-warm/5 w-full">
			<div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-warm/10">
				<Icon className="w-6 h-6 sm:w-7 sm:h-7 text-warm-hover" />
			</div>
			<p className="font-medium text-sm sm:text-base text-content">{title}</p>
			<p className="text-xs sm:text-sm text-content-muted w-full max-w-xs">
				{description}
			</p>
		</div>
	);
}
