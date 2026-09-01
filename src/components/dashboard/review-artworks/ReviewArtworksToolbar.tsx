import { Search } from "lucide-react";

export type ReviewArtworksTab = "pending" | "recent" | "all";

interface ReviewArtworksToolbarProps {
	search: string;
	onSearchChange: (value: string) => void;
	activeTab: ReviewArtworksTab;
	onTabChange: (tab: ReviewArtworksTab) => void;
	counts: {
		pending: number;
		recent: number;
		total: number;
	};
}

export function ReviewArtworksToolbar({
	search,
	onSearchChange,
	activeTab,
	onTabChange,
	counts,
}: ReviewArtworksToolbarProps) {
	return (
		<div className="rounded-2xl border border-content/10 bg-surface p-4 space-y-3 print:hidden">
			{/* Search Box */}
			<div className="relative w-full max-w-md">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-muted" />
				<input
					type="text"
					value={search}
					onChange={(event) => onSearchChange(event.target.value)}
					placeholder="Cari judul, nama artist, atau tag karya..."
					className="input input-sm w-full pl-9 bg-background border-content/10 text-xs"
				/>
			</div>

			{/* View Tabs */}
			<div className="flex flex-wrap items-center gap-2 pt-2 border-t border-content/5">
				<span className="text-xs font-semibold text-content-muted mr-1">
					Tampilan:
				</span>
				<button
					type="button"
					onClick={() => onTabChange("pending")}
					className={`btn btn-xs rounded-lg ${
						activeTab === "pending"
							? "btn-primary"
							: "btn-ghost border border-content/10"
					}`}
				>
					Menunggu Kurasi ({counts.pending})
				</button>
				<button
					type="button"
					onClick={() => onTabChange("recent")}
					className={`btn btn-xs rounded-lg ${
						activeTab === "recent"
							? "btn-primary"
							: "btn-ghost border border-content/10"
					}`}
				>
					Riwayat Keputusan ({counts.recent})
				</button>
				<button
					type="button"
					onClick={() => onTabChange("all")}
					className={`btn btn-xs rounded-lg ${
						activeTab === "all"
							? "btn-primary"
							: "btn-ghost border border-content/10"
					}`}
				>
					Semua ({counts.total})
				</button>
			</div>
		</div>
	);
}
