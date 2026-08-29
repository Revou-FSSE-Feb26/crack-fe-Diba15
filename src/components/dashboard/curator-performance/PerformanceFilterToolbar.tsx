import { Search } from "lucide-react";

export type DatePreset = "all" | "today" | "7d" | "30d" | "this_month";

interface PerformanceFilterToolbarProps {
	search: string;
	onSearchChange: (value: string) => void;
	datePreset: DatePreset;
	onDatePresetChange: (preset: DatePreset) => void;
}

const DATE_PRESETS: { id: DatePreset; label: string }[] = [
	{ id: "all", label: "Semua Waktu" },
	{ id: "today", label: "Hari Ini" },
	{ id: "7d", label: "7 Hari Terakhir" },
	{ id: "30d", label: "30 Hari Terakhir" },
	{ id: "this_month", label: "Bulan Ini" },
];

export default function PerformanceFilterToolbar({
	search,
	onSearchChange,
	datePreset,
	onDatePresetChange,
}: PerformanceFilterToolbarProps) {
	return (
		<div className="rounded-2xl border border-content/10 bg-surface p-4 space-y-3 print:hidden">
			{/* Search Box */}
			<div className="relative w-full max-w-md">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-muted" />
				<input
					type="text"
					value={search}
					onChange={(event) => onSearchChange(event.target.value)}
					placeholder="Cari nama kurator atau email..."
					className="input input-sm w-full pl-9 bg-background border-content/10 text-xs"
				/>
			</div>

			{/* Date Presets */}
			<div className="flex flex-wrap items-center gap-2 pt-2 border-t border-content/5">
				<span className="text-xs font-semibold text-content-muted mr-1">
					Periode:
				</span>
				{DATE_PRESETS.map((preset) => (
					<button
						key={preset.id}
						type="button"
						onClick={() => onDatePresetChange(preset.id)}
						className={`btn btn-xs rounded-lg ${
							datePreset === preset.id
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
