"use client";

export default function ArtworkSkeleton() {
	return (
		<div className="bg-surface rounded-lg overflow-hidden shadow-sm border border-content/10">
			{/* Header */}
			<div className="flex items-center justify-between px-4 py-3 border-b border-content/5">
				<div className="flex items-center gap-2.5 flex-1 min-w-0">
					{/* Avatar */}
					<div className="skeleton w-9 h-9 rounded-full shrink-0" />
					<div className="min-w-0 flex-1 space-y-1.5">
						{/* Name */}
						<div className="skeleton h-3.5 w-24" />
					</div>
				</div>
				{/* Options button */}
				<div className="skeleton w-8 h-8 rounded-full" />
			</div>

			{/* Image block */}
			<div className="skeleton aspect-[4/3] w-full" />

			{/* Info section */}
			<div className="p-4 space-y-3.5">
				{/* Title and price row */}
				<div className="flex justify-between items-start gap-4">
					<div className="space-y-1.5 flex-1">
						<div className="skeleton h-4 w-3/4" />
					</div>
					<div className="skeleton h-6 w-20 shrink-0" />
				</div>

				{/* Description lines */}
				<div className="space-y-2">
					<div className="skeleton h-3 w-full" />
					<div className="skeleton h-3 w-5/6" />
				</div>

				{/* Tags */}
				<div className="flex flex-wrap gap-1.5 pt-1">
					<div className="skeleton h-5 w-12 rounded-full" />
					<div className="skeleton h-5 w-16 rounded-full" />
					<div className="skeleton h-5 w-14 rounded-full" />
				</div>

				{/* Divider */}
				<div className="divider my-1" />

				{/* Footer Actions */}
				<div className="flex items-center justify-between pt-1">
					<div className="flex gap-4">
						<div className="skeleton w-16 h-7 rounded-lg" />
						<div className="skeleton w-16 h-7 rounded-lg" />
					</div>
					<div className="skeleton w-8 h-7 rounded-lg" />
				</div>
			</div>
		</div>
	);
}
