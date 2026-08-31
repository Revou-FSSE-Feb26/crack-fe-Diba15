import { Clock } from "lucide-react";
import type { CuratorMetricItem, DataTableColumn } from "@/types";
import { formatDateTime } from "@/utils";

function formatDuration(minutes: number): string {
	if (minutes <= 0) return "—";
	if (minutes < 60) return `${minutes} mnt`;
	const totalHours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;
	if (totalHours < 24) {
		if (remainingMinutes === 0) return `${totalHours} jam`;
		return `${totalHours}j ${remainingMinutes}m`;
	}
	const days = Math.floor(totalHours / 24);
	const remainingHours = totalHours % 24;
	if (remainingHours === 0) return `${days} hari`;
	return `${days} hari ${remainingHours} jam`;
}

export function createCuratorPerformanceTableColumns(): DataTableColumn<CuratorMetricItem>[] {
	return [
		{
			key: "name",
			header: "Kurator / Moderator",
			cell: (row) => (
				<div className="space-y-0.5 min-w-0">
					<div className="flex items-center gap-1.5">
						<span className="font-semibold text-content text-xs truncate max-w-[170px]">
							{row.name}
						</span>
						<span
							className={`badge badge-xs font-semibold ${
								row.role === "admin"
									? "badge-error text-white"
									: "badge-primary"
							}`}
						>
							{row.role === "admin" ? "Admin" : "Curator"}
						</span>
					</div>
					<p className="text-[11px] text-content-muted font-mono truncate max-w-[200px]">
						{row.email}
					</p>
				</div>
			),
		},
		{
			key: "artworks",
			header: "Kurasi Karya",
			cell: (row) => (
				<div className="space-y-1">
					<div className="flex items-center gap-1.5 text-xs font-semibold text-content">
						<span>{row.artworks_reviewed} Karya</span>
					</div>
					<div className="flex items-center gap-1 text-[10px]">
						<span className="text-verified font-medium">
							✓ {row.artworks_approved} Lolos
						</span>
						<span className="text-content-muted">•</span>
						<span className="text-danger font-medium">
							✕ {row.artworks_rejected} Tolak
						</span>
					</div>
				</div>
			),
		},
		{
			key: "approval_rate",
			header: "Rasio Kelolosan",
			cell: (row) => {
				const rate = row.approval_rate;
				return (
					<div className="space-y-1 w-28">
						<div className="flex items-center justify-between text-xs font-semibold">
							<span className="text-content">{rate}%</span>
							<span className="text-[10px] text-content-muted">Anti-AI</span>
						</div>
						<div className="w-full bg-content/10 rounded-full h-1.5 overflow-hidden">
							<div
								className="bg-verified h-1.5 rounded-full transition-all"
								style={{ width: `${Math.min(100, Math.max(0, rate))}%` }}
							/>
						</div>
					</div>
				);
			},
		},
		{
			key: "cases",
			header: "Mediasi & Aduan",
			cell: (row) => (
				<div className="text-xs space-y-0.5">
					<p className="text-content font-medium">
						{row.disputes_resolved} Sengketa
					</p>
					<p className="text-[11px] text-content-muted">
						{row.reports_resolved} Laporan
					</p>
				</div>
			),
		},
		{
			key: "total_actions",
			header: "Total Tindakan",
			cell: (row) => (
				<span className="badge badge-sm font-semibold badge-ghost border border-content/10 text-content">
					{row.total_actions} Aksi
				</span>
			),
		},
		{
			key: "sla",
			header: "Rata-rata SLA",
			cell: (row) => {
				const durationStr = formatDuration(row.avg_response_time_minutes);
				const isFast =
					row.avg_response_time_minutes > 0 &&
					row.avg_response_time_minutes <= 60;
				return (
					<span
						className={`badge badge-xs font-semibold flex items-center gap-1 ${
							isFast
								? "badge-success text-white"
								: "badge-ghost border border-content/10 text-content-muted"
						}`}
						title="Rata-rata durasi dari karya diunggah hingga ditinjau"
					>
						<Clock className="h-3 w-3" />
						{durationStr}
					</span>
				);
			},
		},
		{
			key: "last_active_at",
			header: "Aktivitas Terakhir",
			headerClassName: "text-right",
			cellClassName: "text-right",
			cell: (row) => (
				<span className="text-xs text-content-muted">
					{formatDateTime(row.last_active_at)}
				</span>
			),
		},
	];
}
