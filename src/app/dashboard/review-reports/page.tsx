"use client";

import {
	AlertCircle,
	CheckCircle,
	RefreshCw,
	Search,
	Users,
	XCircle,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import AccessDenied from "@/components/dashboard/AccessDenied";
import DataTable from "@/components/ui/data-table/DataTable";
import Stat from "@/components/ui/Stat";
import { usePagination, useResetPageOnChange } from "@/hooks/usePagination";
import { useReports, useResolveReport } from "@/hooks/useReportQueries";
import { useLightboxStore } from "@/store/LightboxStore";
import { useModalStore } from "@/store/ModalStore";
import { useUserStore } from "@/store/UserStore";
import type { JoinedReport } from "@/types";
import { createReportsTableColumns } from "@/utils/dashboard/review-reports/reportsTableColumns";

type ReportStatusFilter = "all" | "pending" | "resolved" | "dismissed";

export default function ReviewReportsPage() {
	const { isCurator } = useUserStore();
	const {
		data: reportsList = [],
		isLoading,
		isRefetching,
		refetch,
	} = useReports();
	const resolveReportMutation = useResolveReport();
	const { openModal } = useModalStore();
	const { openLightbox } = useLightboxStore();

	const [statusFilter, setStatusFilter] = useState<ReportStatusFilter>("all");
	const [search, setSearch] = useState("");

	const { pending, resolved, dismissed } = useMemo(() => {
		const pending = reportsList.filter((r) => r.status === "pending");
		const resolved = reportsList.filter((r) => r.status === "resolved");
		const dismissed = reportsList.filter((r) => r.status === "dismissed");
		return { pending, resolved, dismissed };
	}, [reportsList]);

	const { setPage, setPerPage, paginate, resetPage } = usePagination({
		initialPerPage: 10,
	});

	useResetPageOnChange(resetPage, [search, statusFilter]);

	// Normalize reports with artwork, reporter, artist
	const joinedReports = useMemo(() => {
		return reportsList
			.map((report) => ({
				...report,
				artwork: report.artwork,
				reporter: report.reporter,
				artist: report.artwork?.artist,
			}))
			.sort(
				(a, b) =>
					new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
			);
	}, [reportsList]);

	const filteredReports = useMemo(() => {
		const query = search.trim().toLowerCase();
		let list = joinedReports;

		if (statusFilter !== "all") {
			list = list.filter((item) => item.status === statusFilter);
		}

		if (query) {
			list = list.filter((item) => {
				return (
					item.artwork?.title?.toLowerCase().includes(query) ||
					item.reporter?.name?.toLowerCase().includes(query) ||
					item.artist?.name?.toLowerCase().includes(query) ||
					item.reason?.toLowerCase().includes(query) ||
					item.id.toLowerCase().includes(query)
				);
			});
		}

		return list;
	}, [joinedReports, search, statusFilter]);

	const paginatedReports = useMemo(
		() => paginate(filteredReports),
		[filteredReports, paginate],
	);

	const handleResolve = useCallback(
		(report: JoinedReport, approved: boolean) => {
			const confirmMessage = approved
				? `Apakah Anda yakin ingin menyetujui laporan untuk karya "${report.artwork?.title}"? Ini akan menyembunyikan karya dari feed publik dan menambahkan +1 strike count pada artis "${report.artist?.name}".`
				: `Apakah Anda yakin ingin menolak laporan untuk karya "${report.artwork?.title}"? Tidak ada tindakan yang akan diambil pada karya atau artist.`;

			openModal({
				title: `${approved ? "Setujui" : "Tolak"} Laporan?`,
				description: confirmMessage,
				type: "confirm",
				variant: approved ? "default" : "danger",
				confirmLabel: approved ? "Setujui" : "Tolak",
				cancelLabel: "Batal",
				onConfirm: () => {
					resolveReportMutation.mutate({
						id: report.id,
						status: approved ? "resolved" : "dismissed",
					});
				},
			});
		},
		[openModal, resolveReportMutation],
	);

	const columns = useMemo(
		() =>
			createReportsTableColumns({
				openLightbox,
				handleResolve,
			}),
		[handleResolve, openLightbox],
	);

	if (!isCurator()) {
		return (
			<AccessDenied description="Halaman Review Laporan hanya dapat diakses oleh akun Kurator platform TruBrush." />
		);
	}

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold text-content">
						Review Laporan Konten (Report Review)
					</h1>
					<p className="text-xs text-content-muted">
						Tindak lanjuti aduan pelanggaran hak cipta dan dugaan konten AI dari
						komunitas pengguna.
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-2 print:hidden">
					<button
						type="button"
						className="btn btn-outline btn-sm"
						onClick={() => refetch()}
						disabled={isLoading || isRefetching}
						title="Segarkan daftar laporan"
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
					label="Laporan Pending"
					value={
						isLoading ? (
							<span className="loading loading-dots loading-sm" />
						) : (
							`${pending.length} Laporan`
						)
					}
					icon={AlertCircle}
				/>
				<Stat
					variant="card"
					label="Laporan Diterima (Takedown)"
					value={
						isLoading ? (
							<span className="loading loading-dots loading-sm" />
						) : (
							`${resolved.length} Laporan`
						)
					}
					icon={CheckCircle}
				/>
				<Stat
					variant="card"
					label="Laporan Diabaikan (Ditolak)"
					value={
						isLoading ? (
							<span className="loading loading-dots loading-sm" />
						) : (
							`${dismissed.length} Laporan`
						)
					}
					icon={XCircle}
				/>
				<Stat
					variant="card"
					label="Total Aduan Masuk"
					value={
						isLoading ? (
							<span className="loading loading-dots loading-sm" />
						) : (
							`${reportsList.length} Aduan`
						)
					}
					icon={Users}
				/>
			</div>

			{/* Filter Toolbar */}
			<div className="rounded-2xl border border-content/10 bg-surface p-4 space-y-3 print:hidden">
				{/* Search Box */}
				<div className="relative w-full max-w-md">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-muted" />
					<input
						type="text"
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						placeholder="Cari judul karya, nama pelapor, nama artis, ID..."
						className="input input-sm w-full pl-9 bg-background border-content/10 text-xs"
					/>
				</div>

				{/* Status Filter Presets */}
				<div className="flex flex-wrap items-center gap-2 pt-2 border-t border-content/5">
					<span className="text-xs font-semibold text-content-muted mr-1">
						Status:
					</span>
					{(
						[
							{ id: "all", label: `Semua (${reportsList.length})` },
							{ id: "pending", label: `Pending (${pending.length})` },
							{ id: "resolved", label: `Diterima (${resolved.length})` },
							{ id: "dismissed", label: `Diabaikan (${dismissed.length})` },
						] as const
					).map((preset) => (
						<button
							key={preset.id}
							type="button"
							onClick={() => setStatusFilter(preset.id as ReportStatusFilter)}
							className={`btn btn-xs rounded-lg ${
								statusFilter === preset.id
									? "btn-primary"
									: "btn-ghost border border-content/10"
							}`}
						>
							{preset.label}
						</button>
					))}
				</div>
			</div>

			{/* Reports Table */}
			<div className="rounded-2xl border border-content/10 bg-surface overflow-hidden">
				<DataTable
					columns={columns}
					pagination={paginatedReports}
					getRowKey={(row) => row.id}
					isLoading={isLoading}
					onPageChange={setPage}
					onPerPageChange={setPerPage}
					itemLabel="laporan"
					emptyState={
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<CheckCircle className="h-10 w-10 text-verified mb-2 opacity-60" />
							<p className="text-sm font-semibold text-content">
								Tidak Ada Laporan Ditemukan
							</p>
							<p className="text-xs text-content-muted mt-1 max-w-xs">
								Semua karya yang dilaporkan telah ditindaklanjuti atau tidak ada
								yang cocok dengan filter saat ini.
							</p>
						</div>
					}
				/>
			</div>
		</div>
	);
}
