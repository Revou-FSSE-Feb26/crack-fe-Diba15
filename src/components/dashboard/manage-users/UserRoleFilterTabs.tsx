import { Search } from "lucide-react";
import type { UserRole } from "@/types";

export type RoleFilter = "all" | UserRole;

interface UserRoleFilterTabsProps {
	search: string;
	onSearchChange: (value: string) => void;
	roleFilter: RoleFilter;
	onRoleFilterChange: (role: RoleFilter) => void;
	roleCounts: {
		all: number;
		artist: number;
		client: number;
		curator: number;
		admin: number;
	};
}

export default function UserRoleFilterTabs({
	search,
	onSearchChange,
	roleFilter,
	onRoleFilterChange,
	roleCounts,
}: UserRoleFilterTabsProps) {
	const ROLE_PRESETS: { id: RoleFilter; label: string }[] = [
		{ id: "all", label: `Semua (${roleCounts.all})` },
		{ id: "artist", label: `Artist (${roleCounts.artist})` },
		{ id: "client", label: `Client (${roleCounts.client})` },
		{ id: "curator", label: `Curator (${roleCounts.curator})` },
		{ id: "admin", label: `Admin (${roleCounts.admin})` },
	];

	return (
		<div className="rounded-2xl border border-content/10 bg-surface p-4 space-y-3 print:hidden">
			{/* Search Box */}
			<div className="relative w-full max-w-md">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-muted" />
				<input
					type="text"
					placeholder="Cari pengguna berdasarkan nama, email, ID..."
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
					className="input input-sm w-full pl-9 bg-background border-content/10 text-xs"
				/>
			</div>

			{/* Role Filter Presets */}
			<div className="flex flex-wrap items-center gap-2 pt-2 border-t border-content/5">
				<span className="text-xs font-semibold text-content-muted mr-1">
					Role:
				</span>
				{ROLE_PRESETS.map((preset) => (
					<button
						key={preset.id}
						type="button"
						onClick={() => onRoleFilterChange(preset.id)}
						className={`btn btn-xs rounded-lg ${
							roleFilter === preset.id
								? "btn-primary"
								: "btn-ghost border border-content/10"
						}`}
					>
						{preset.label}
					</button>
				))}
			</div>
		</div>
	);
}
