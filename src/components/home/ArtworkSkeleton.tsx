"use client";

export default function ArtworkSkeleton() {
	return (
		<div className="bg-surface rounded-lg overflow-hidden shadow-sm border border-transparent animate-pulse">
			{/* Header */}
			<div className="flex items-center justify-between px-4 py-3 border-b border-content/5">
				<div className="flex items-center gap-2.5 flex-1 min-w-0">
					{/* Avatar */}
					<div className="w-9 h-9 rounded-full bg-content/10 shrink-0" />
					<div className="min-w-0 flex-1 space-y-1.5">
						{/* Name */}
						<div className="h-3.5 bg-content/10 rounded w-24" />
					</div>
				</div>
				{/* Options button */}
				<div className="w-8 h-8 rounded-full bg-content/10" />
			</div>

			{/* Image block */}
			<div className="aspect-[4/3] w-full bg-content/10 relative" />

			{/* Info section */}
			<div className="p-4 space-y-3.5">
				{/* Title and price row */}
				<div className="flex justify-between items-start gap-4">
					<div className="space-y-1.5 flex-1">
						<div className="h-4 bg-content/10 rounded w-3/4" />
					</div>
					<div className="h-6 bg-content/10 rounded w-20 shrink-0" />
				</div>

				{/* Description lines */}
				<div className="space-y-2">
					<div className="h-3 bg-content/10 rounded w-full" />
					<div className="h-3 bg-content/10 rounded w-5/6" />
				</div>

				{/* Tags */}
				<div className="flex flex-wrap gap-1.5 pt-1">
					<div className="h-5 bg-content/10 rounded-full w-12" />
					<div className="h-5 bg-content/10 rounded-full w-16" />
					<div className="h-5 bg-content/10 rounded-full w-14" />
				</div>

				{/* Divider */}
				<hr className="border-content/5" />

				{/* Footer Actions */}
				<div className="flex items-center justify-between pt-1">
					<div className="flex gap-4">
						<div className="w-16 h-7 bg-content/10 rounded-lg" />
						<div className="w-16 h-7 bg-content/10 rounded-lg" />
					</div>
					<div className="w-8 h-7 bg-content/10 rounded-lg" />
				</div>
			</div>
		</div>
	);
}
