"use client";

import {
	Calendar,
	Download,
	FileWarning,
	Filter,
	History,
	ImageIcon,
	Printer,
	RefreshCw,
	Search,
	ShieldCheck,
	Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import AccessDenied from "@/components/dashboard/AccessDenied";
import { AuditLogDetailModal } from "@/components/dashboard/audit-logs/AuditLogDetailModal";
import DataTable from "@/components/ui/data-table/DataTable";
import Stat from "@/components/ui/Stat";
import { useAuditLogs } from "@/hooks/useAppealQueries";
import { usePagination, useResetPageOnChange } from "@/hooks/usePagination";
import { useUserStore } from "@/store/UserStore";
import type { AuditLogCategory, AuditLogItem } from "@/types";
import { formatDateTime } from "@/utils";
import {
	categoryLabels,
	createAuditTableColumns,
} from "@/utils/dashboard/audit-logs/auditTableColumns";
import { type DatePreset, getDatePresetRange } from "@/utils/datePresets";
import { exportToCsv } from "@/utils/exportCsv";

export default function AuditLogsPage() {
	const { user } = useUserStore();
	const isStaff = user?.role === "admin" || user?.role === "curator";

	const { setPage, setPerPage, paginate, resetPage } = usePagination({
		initialPerPage: 10,
	});

	// Filter States
	const [categoryFilter, setCategoryFilter] = useState<AuditLogCategory>("all");
	const [datePreset, setDatePreset] = useState<DatePreset>("all");
	const [customStartDate, setCustomStartDate] = useState<string>("");
	const [customEndDate, setCustomEndDate] = useState<string>("");
	const [search, setSearch] = useState<string>("");
	const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

	// Date Range Calculation based on Preset Utility
	const computedDateRange = useMemo(() => {
		if (customStartDate || customEndDate) {
			return {
				startDate: customStartDate
					? new Date(customStartDate).toISOString()
					: undefined,
				endDate: customEndDate
					? new Date(customEndDate).toISOString()
					: undefined,
			};
		}
		return getDatePresetRange(datePreset);
	}, [datePreset, customStartDate, customEndDate]);

	// Backend Query
	const {
		data: auditResponse,
		isLoading,
		isRefetching,
		refetch,
	} = useAuditLogs({
		category: categoryFilter,
		search: search.trim() || undefined,
		startDate: computedDateRange.startDate,
		endDate: computedDateRange.endDate,
		limit: 100, // Fetch up to 100 records for client-side responsive filtering & pagination
	});

	// Reset page when filters change
	useResetPageOnChange(resetPage, [
		categoryFilter,
		datePreset,
		customStartDate,
		customEndDate,
		search,
	]);

	const allLogs = auditResponse?.data || [];

	// Summary KPI counts
	const stats = useMemo(() => {
		const curationCount = allLogs.filter(
			(l) => l.category === "curation",
		).length;
		const reportDisputeCount = allLogs.filter((l) =>
			["report", "dispute"].includes(l.category),
		).length;
		const appealCount = allLogs.filter((l) => l.category === "appeal").length;

		return {
			totalLogs: auditResponse?.total || allLogs.length,
			curationCount,
			reportDisputeCount,
			appealCount,
		};
	}, [allLogs, auditResponse?.total]);

	// Filtered Logs
	const filteredLogs = useMemo(() => {
		let list = [...allLogs];

		if (search.trim()) {
			const q = search.toLowerCase().trim();
			list = list.filter(
				(l) =>
					l.action.toLowerCase().includes(q) ||
					l.actor.name.toLowerCase().includes(q) ||
					l.actor.email.toLowerCase().includes(q) ||
					((l.targetTitle ?? l.target_title)?.toLowerCase().includes(q) ??
						false) ||
					(l.details?.toLowerCase().includes(q) ?? false) ||
					(l.targetId ?? l.target_id ?? "").toLowerCase().includes(q),
			);
		}

		return list;
	}, [allLogs, search]);

	const paginationData = paginate(filteredLogs);

	// Export CSV Handler
	const handleExportCSV = () => {
		if (filteredLogs.length === 0) return;

		const headers = [
			"ID Log",
			"Waktu Eksekusi",
			"Aktor / Staf",
			"Email Staf",
			"Role Staf",
			"Kategori",
			"Tindakan Moderasi",
			"Tipe Target",
			"ID Target",
			"Subjek Target",
			"Hasil Keputusan",
			"Rincian / Alasan",
		];

		const rows = filteredLogs.map((l) => [
			l.id,
			formatDateTime(l.createdAt ?? l.created_at),
			l.actor.name,
			l.actor.email,
			l.actor.role,
			categoryLabels[l.category] || l.category,
			l.action,
			l.targetType ?? l.target_type ?? "",
			l.targetId ?? l.target_id ?? "",
			l.targetTitle ?? l.target_title ?? l.targetId ?? l.target_id ?? "",
			l.status,
			l.details || "",
		]);

		exportToCsv(
			`Log_Audit_Moderasi_TruBrush_${new Date().toISOString().slice(0, 10)}.csv`,
			headers,
			rows,
		);
	};

	// Print Handler
	const handlePrint = () => {
		window.print();
	};

	const handleRefresh = () => {
		refetch();
	};

	const columns = useMemo(
		() =>
			createAuditTableColumns({
				onViewDetail: (item) => setSelectedLog(item),
			}),
		[],
	);

	if (!isStaff) {
		return (
			<AccessDenied description="Halaman Log Audit Moderasi hanya dapat diakses oleh Admin dan Kurator platform TruBrush." />
		);
	}

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold text-content">
						Log Audit Moderasi
					</h1>
					<p className="text-xs text-content-muted">
						Rekam jejak kronologis dan akuntabilitas tindakan staf (Kurasi
						karya, penindakan laporan, sengketa, dan banding).
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-2 print:hidden">
					<button
						type="button"
						className="btn btn-outline btn-sm"
						onClick={handleRefresh}
						disabled={isLoading || isRefetching}
					>
						<RefreshCw
							className={`h-4 w-4 mr-1 ${isRefetching ? "animate-spin" : ""}`}
						/>
						Segarkan
					</button>
					<button
						type="button"
						className="btn btn-outline btn-sm"
						onClick={handleExportCSV}
						disabled={filteredLogs.length === 0}
					>
						<Download className="h-4 w-4 mr-1" />
						Ekspor CSV
					</button>
					<button
						type="button"
						className="btn btn-primary btn-sm"
						onClick={handlePrint}
					>
						<Printer className="h-4 w-4 mr-1" />
						Cetak Log
					</button>
				</div>
			</div>

			{/* KPI Summary Cards (2 Rows x 2 Columns) */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Stat
					variant="card"
					icon={History}
					label="Total Aktivitas Moderasi"
					value={
						isLoading ? (
							<span className="loading loading-dots loading-sm" />
						) : (
							`${stats.totalLogs} Tindakan`
						)
					}
				/>
				<Stat
					variant="card"
					icon={ImageIcon}
					label="Tinjauan Kurasi Karya"
					value={
						isLoading ? (
							<span className="loading loading-dots loading-sm" />
						) : (
							`${stats.curationCount} Karya`
						)
					}
				/>
				<Stat
					variant="card"
					icon={FileWarning}
					label="Resolusi Laporan & Dispute"
					value={
						isLoading ? (
							<span className="loading loading-dots loading-sm" />
						) : (
							`${stats.reportDisputeCount} Kasus`
						)
					}
				/>
				<Stat
					variant="card"
					icon={Users}
					label="Banding Akun (Appeals)"
					value={
						isLoading ? (
							<span className="loading loading-dots loading-sm" />
						) : (
							`${stats.appealCount} Pengajuan`
						)
					}
				/>
			</div>

			{/* Filter Toolbar */}
			<div className="rounded-2xl border border-content/10 bg-surface p-4 space-y-3 print:hidden">
				<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
					{/* Search Box */}
					<div className="relative flex-1 max-w-md">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-muted" />
						<input
							type="text"
							placeholder="Cari nama staf, subjek karya, ID, atau alasan..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="input input-sm w-full pl-9 bg-background border-content/10 text-xs"
						/>
					</div>

					{/* Category Dropdown */}
					<div className="flex items-center gap-2">
						<Filter className="h-4 w-4 text-content-muted hidden sm:block" />
						<select
							value={categoryFilter}
							onChange={(e) =>
								setCategoryFilter(e.target.value as AuditLogCategory)
							}
							aria-label="Filter kategori log"
							className="select select-sm bg-background border-content/10 text-xs font-medium"
						>
							<option value="all">Semua Kategori</option>
							<option value="curation">Kurasi Artwork</option>
							<option value="report">Laporan Konten</option>
							<option value="dispute">Dispute Komisi</option>
							<option value="appeal">Banding Akun</option>
						</select>
					</div>
				</div>

				{/* Date Range Presets & Custom Pickers */}
				<div className="flex flex-wrap items-center gap-2 pt-2 border-t border-content/5">
					<span className="text-xs font-semibold text-content-muted mr-1">
						Periode:
					</span>
					{(
						[
							{ id: "all", label: "Semua Waktu" },
							{ id: "today", label: "Hari Ini" },
							{ id: "7d", label: "7 Hari Terakhir" },
							{ id: "30d", label: "30 Hari Terakhir" },
							{ id: "this_month", label: "Bulan Ini" },
						] as const
					).map((preset) => (
						<button
							key={preset.id}
							type="button"
							onClick={() => {
								setDatePreset(preset.id);
								setCustomStartDate("");
								setCustomEndDate("");
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
								setCustomStartDate(e.target.value);
								setDatePreset("all");
							}}
							className="input input-xs bg-background border-content/10 text-[11px]"
							title="Tanggal Mulai"
						/>
						<span className="text-content-muted">-</span>
						<input
							type="date"
							value={customEndDate}
							onChange={(e) => {
								setCustomEndDate(e.target.value);
								setDatePreset("all");
							}}
							className="input input-xs bg-background border-content/10 text-[11px]"
							title="Tanggal Selesai"
						/>
					</div>
				</div>
			</div>

			{/* Audit Log DataTable */}
			<div className="rounded-2xl border border-content/10 bg-surface overflow-hidden">
				<DataTable
					columns={columns}
					pagination={paginationData}
					getRowKey={(row) => row.id}
					isLoading={isLoading}
					itemLabel="log audit"
					onPageChange={setPage}
					onPerPageChange={setPerPage}
					emptyState={
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<ShieldCheck className="h-10 w-10 text-content-muted mb-2 opacity-50" />
							<p className="text-sm font-semibold text-content">
								Tidak ada log audit ditemukan
							</p>
							<p className="text-xs text-content-muted mt-1 max-w-xs">
								Coba sesuaikan filter kategori atau rentang tanggal untuk
								melihat data lainnya.
							</p>
						</div>
					}
				/>
			</div>

			{/* Detail Modal */}
			<AuditLogDetailModal
				log={selectedLog}
				isOpen={!!selectedLog}
				onClose={() => setSelectedLog(null)}
			/>
		</div>
	);
}
