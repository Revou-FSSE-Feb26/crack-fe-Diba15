import { Calendar, Filter, Search } from "lucide-react";
import type { TransactionType } from "@/types";

export type DatePreset = "all" | "today" | "7d" | "30d" | "this_month";

interface FinancialFilterToolbarProps {
	search: string;
	onSearchChange: (value: string) => void;
	typeFilter: "all" | TransactionType;
	onTypeFilterChange: (type: "all" | TransactionType) => void;
	datePreset: DatePreset;
	onDatePresetChange: (preset: DatePreset) => void;
	customStartDate: string;
	onCustomStartDateChange: (value: string) => void;
	customEndDate: string;
	onCustomEndDateChange: (value: string) => void;
}

const DATE_PRESETS: { id: DatePreset; label: string }[] = [
	{ id: "all", label: "Semua Waktu" },
	{ id: "today", label: "Hari Ini" },
	{ id: "7d", label: "7 Hari Terakhir" },
	{ id: "30d", label: "30 Hari Terakhir" },
	{ id: "this_month", label: "Bulan Ini" },
];

export default function FinancialFilterToolbar({
	search,
	onSearchChange,
	typeFilter,
	onTypeFilterChange,
	datePreset,
	onDatePresetChange,
	customStartDate,
	onCustomStartDateChange,
	customEndDate,
	onCustomEndDateChange,
}: FinancialFilterToolbarProps) {
	return (
		<div className="rounded-2xl border border-content/10 bg-surface p-4 space-y-3 print:hidden">
			<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
				{/* Search Box */}
				<div className="relative flex-1 max-w-md">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-muted" />
					<input
						type="text"
						placeholder="Cari transaksi berdasarkan nama, keterangan, ID..."
						value={search}
						onChange={(e) => onSearchChange(e.target.value)}
						className="input input-sm w-full pl-9 bg-background border-content/10 text-xs"
					/>
				</div>

				{/* Type Filter */}
				<div className="flex items-center gap-2">
					<Filter className="h-4 w-4 text-content-muted hidden sm:block" />
					<select
						value={typeFilter}
						onChange={(e) =>
							onTypeFilterChange(e.target.value as "all" | TransactionType)
						}
						className="select select-sm bg-background border-content/10 text-xs font-medium"
					>
						<option value="all">Semua Tipe Transaksi</option>
						<option value="topup">Top Up Saldo</option>
						<option value="payment">Pembayaran Komisi (Escrow)</option>
						<option value="release">Pencairan Komisi Artis</option>
						<option value="platform_fee">Fee Platform (5%)</option>
						<option value="refund">Pengembalian Dana</option>
						<option value="withdraw">Penarikan Dana Artis</option>
					</select>
				</div>
			</div>

			{/* Date Range Presets & Custom Pickers */}
			<div className="flex flex-wrap items-center gap-2 pt-2 border-t border-content/5">
				<span className="text-xs font-semibold text-content-muted mr-1">
					Periode:
				</span>
				{DATE_PRESETS.map((preset) => (
					<button
						key={preset.id}
						type="button"
						onClick={() => {
							onDatePresetChange(preset.id);
							onCustomStartDateChange("");
							onCustomEndDateChange("");
						}}
						className={`btn btn-xs rounded-lg ${
							datePreset === preset.id
								? "btn-primary"
								: "btn-ghost border border-content/10"
						}`}
					>
						{preset.label}
					</button>
				))}

				{/* Custom Date Inputs */}
				<div className="flex items-center gap-1.5 ml-auto text-xs">
					<Calendar className="h-3.5 w-3.5 text-content-muted hidden sm:block" />
					<input
						type="date"
						value={customStartDate}
						onChange={(e) => {
							onCustomStartDateChange(e.target.value);
							onDatePresetChange("all");
						}}
						className="input input-xs bg-background border-content/10 text-[11px]"
						title="Tanggal Mulai"
					/>
					<span className="text-content-muted">-</span>
					<input
						type="date"
						value={customEndDate}
						onChange={(e) => {
							onCustomEndDateChange(e.target.value);
							onDatePresetChange("all");
						}}
						className="input input-xs bg-background border-content/10 text-[11px]"
						title="Tanggal Akhir"
					/>
				</div>
			</div>
		</div>
	);
}
