"use client";

import {
	Award,
	CheckCircle2,
	Clock,
	Download,
	RefreshCw,
	ShieldAlert,
	ShieldCheck,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import PerformanceFilterToolbar, {
	type DatePreset,
} from "@/components/dashboard/curator-performance/PerformanceFilterToolbar";
import TopModeratorSpotlight from "@/components/dashboard/curator-performance/TopModeratorSpotlight";
import DataTable from "@/components/ui/data-table/DataTable";
import Stat from "@/components/ui/Stat";
import { useCuratorPerformance } from "@/hooks/useCuratorPerformanceQueries";
import { usePagination, useResetPageOnChange } from "@/hooks/usePagination";
import { useUserStore } from "@/store/UserStore";
import { createCuratorPerformanceTableColumns } from "@/utils/dashboard/curator-performance/curatorPerformanceTableColumns";

function formatDuration(minutes: number): string {
	if (minutes <= 0) return "—";
	if (minutes < 60) return `${minutes} Menit`;
	const totalHours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;
	if (totalHours < 24) {
		if (remainingMinutes === 0) return `${totalHours} Jam`;
		return `${totalHours}j ${remainingMinutes}m`;
	}
	const days = Math.floor(totalHours / 24);
	const remainingHours = totalHours % 24;
	if (remainingHours === 0) return `${days} Hari`;
	return `${days} Hari ${remainingHours} Jam`;
}

export default function CuratorPerformancePage() {
	const { isAdmin, isCurator } = useUserStore();
	const [search, setSearch] = useState("");
	const [datePreset, setDatePreset] = useState<DatePreset>("all");

	// Date range calculation based on preset
	const dateRange = useMemo(() => {
		const now = new Date();
		if (datePreset === "today") {
			const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			return { startDate: start.toISOString(), endDate: now.toISOString() };
		}
		if (datePreset === "7d") {
			const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
			return { startDate: start.toISOString(), endDate: now.toISOString() };
		}
		if (datePreset === "30d") {
			const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
			return { startDate: start.toISOString(), endDate: now.toISOString() };
		}
		if (datePreset === "this_month") {
			const start = new Date(now.getFullYear(), now.getMonth(), 1);
			return { startDate: start.toISOString(), endDate: now.toISOString() };
		}
		return { startDate: undefined, endDate: undefined };
	}, [datePreset]);

	const {
		data: responseData,
		isLoading,
		isRefetching,
		refetch,
	} = useCuratorPerformance({
		search: search.trim() || undefined,
		startDate: dateRange.startDate,
		endDate: dateRange.endDate,
	});

	const summary = responseData?.summary;
	const curators = responseData?.curators || [];

	const { setPage, setPerPage, paginate, resetPage } = usePagination({
		initialPerPage: 10,
	});

	useResetPageOnChange(resetPage, [search, datePreset]);

	const paginatedCurators = useMemo(
		() => paginate(curators),
		[curators, paginate],
	);

	const columns = useMemo(() => createCuratorPerformanceTableColumns(), []);

	// Top performer spotlight
	const topPerformer = useMemo(() => {
		if (curators.length === 0) return null;
		return curators[0]; // Already sorted by totalActions in backend
	}, [curators]);

	// Export CSV Handler
	const handleExportCSV = () => {
		if (curators.length === 0) return;

		const headers = [
			"ID Kurator",
			"Nama Kurator",
			"Email",
			"Role",
			"Karya Ditinjau",
			"Karya Lolos",
			"Karya Ditolak",
			"Rasio Kelolosan (%)",
			"Sengketa Selesai",
			"Laporan Selesai",
			"Total Tindakan",
			"Rata-rata SLA (Menit)",
			"Aktivitas Terakhir",
		];

		const rows = curators.map((c) => [
			c.id,
			`"${c.name}"`,
			c.email,
			c.role,
			c.artworks_reviewed,
			c.artworks_approved,
			c.artworks_rejected,
			`${c.approval_rate}%`,
			c.disputes_resolved,
			c.reports_resolved,
			c.total_actions,
			c.avg_response_time_minutes,
			c.last_active_at || "—",
		]);

		const csvContent =
			"data:text/csv;charset=utf-8," +
			[headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute(
			"download",
			`laporan_kinerja_kurator_trubrush_${new Date().toISOString().slice(0, 10)}.csv`,
		);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	if (!isAdmin() && !isCurator()) {
		return (
			<div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
				<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10 text-danger">
					<ShieldAlert className="h-8 w-8" />
				</div>
				<h1 className="text-xl font-bold text-content">Akses Dibatasi</h1>
				<p className="max-w-sm text-xs text-content-muted">
					Halaman Laporan Kinerja Kurator hanya dapat diakses oleh Staf Kurator
					dan Administrator platform TruBrush.
				</p>
				<Link href="/dashboard">
					<button type="button" className="btn btn-primary btn-sm">
						Kembali ke Dashboard
					</button>
				</Link>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold text-content">
						Laporan Kinerja Moderasi & Metrik Kurator
					</h1>
					<p className="text-xs text-content-muted">
						Evaluasi SLA kecepatan verifikasi karya anti-AI, beban kerja kurasi,
						dan akuntabilitas moderasi platform.
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-2 print:hidden">
					<button
						type="button"
						onClick={handleExportCSV}
						disabled={isLoading || curators.length === 0}
						className="btn btn-outline btn-sm text-xs"
						title="Unduh laporan kinerja dalam format CSV"
					>
						<Download className="h-4 w-4 mr-1" />
						Export CSV
					</button>

					<button
						type="button"
						className="btn btn-outline btn-sm"
						onClick={() => refetch()}
						disabled={isLoading || isRefetching}
						title="Segarkan metrik kinerja"
					>
						<RefreshCw
							className={`h-4 w-4 mr-1 ${isRefetching ? "animate-spin" : ""}`}
						/>
						Segarkan
					</button>
				</div>
			</div>

			{/* KPI Summary Cards (2 Rows x 2 Columns) */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Stat
					variant="card"
					label="Rata-rata Waktu Respons (SLA)"
					value={
						isLoading ? (
							<span className="loading loading-dots loading-sm" />
						) : (
							formatDuration(summary?.average_response_time_minutes ?? 0)
						)
					}
					icon={Clock}
				/>
				<Stat
					variant="card"
					label="Total Karya Selesai Dikurasi"
					value={
						isLoading ? (
							<span className="loading loading-dots loading-sm" />
						) : (
							`${summary?.total_artworks_reviewed ?? 0} Karya`
						)
					}
					icon={CheckCircle2}
				/>
				<Stat
					variant="card"
					label="Tingkat Kelolosan Anti-AI Platform"
					value={
						isLoading ? (
							<span className="loading loading-dots loading-sm" />
						) : (
							`${summary?.overall_approval_rate ?? 100}% Lolos`
						)
					}
					icon={ShieldCheck}
				/>
				<Stat
					variant="card"
					label="Total Sengketa & Laporan Selesai"
					value={
						isLoading ? (
							<span className="loading loading-dots loading-sm" />
						) : (
							`${
								(summary?.total_disputes_resolved ?? 0) +
								(summary?.total_reports_resolved ?? 0)
							} Kasus`
						)
					}
					icon={Award}
				/>
			</div>

			{/* Top Performer Spotlight Banner */}
			<TopModeratorSpotlight
				topPerformer={topPerformer}
				formatDuration={formatDuration}
			/>

			{/* Filter Toolbar */}
			<PerformanceFilterToolbar
				search={search}
				onSearchChange={setSearch}
				datePreset={datePreset}
				onDatePresetChange={setDatePreset}
			/>

			{/* Performance Metrics Table */}
			<div className="rounded-2xl border border-content/10 bg-surface overflow-hidden">
				<DataTable
					columns={columns}
					pagination={paginatedCurators}
					getRowKey={(row) => row.id}
					isLoading={isLoading}
					onPageChange={setPage}
					onPerPageChange={setPerPage}
					itemLabel="kurator"
					emptyState={
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<Users className="h-10 w-10 text-content-muted mb-2 opacity-40" />
							<p className="text-sm font-semibold text-content">
								Tidak Ada Data Kinerja Ditemukan
							</p>
							<p className="text-xs text-content-muted mt-1 max-w-xs">
								Belum ada staf kurator yang cocok dengan pencarian atau filter
								periode saat ini.
							</p>
						</div>
					}
				/>
			</div>
		</div>
	);
}
