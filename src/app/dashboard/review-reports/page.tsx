"use client";

import { AlertCircle, CheckCircle, Search, XCircle } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import DataTable from "@/components/ui/data-table/DataTable";
import Stat from "@/components/ui/Stat";
import { usePagination } from "@/hooks/usePagination";
import { useArtworkStore } from "@/store/ArtworkStore";
import { useLightboxStore } from "@/store/LightboxStore";
import { useModalStore } from "@/store/ModalStore";
import { useReportStore } from "@/store/ReportStore";
import { useToastStore } from "@/store/ToastStore";
import { useUserManagementStore } from "@/store/UserManagementStore";
import { useUserStore } from "@/store/UserStore";
import type { JoinedReport } from "@/types";
import { createReportsTableColumns } from "@/utils/dashboard/review-reports/reportsTableColumns";

export default function ReviewReportsPage() {
	const { user: curator } = useUserStore();
	const { users } = useUserManagementStore();
	const { artworks } = useArtworkStore();
	const { reports, resolveReport, dismissReport } = useReportStore();
	const { openModal } = useModalStore();
	const { addToast } = useToastStore();
	const { openLightbox } = useLightboxStore();

	const { pending, resolved, dismissed } = useMemo(() => {
		const pending = reports.filter((r) => r.status === "pending");
		const resolved = reports.filter((r) => r.status === "resolved");
		const dismissed = reports.filter((r) => r.status === "dismissed");
		return { pending, resolved, dismissed };
	}, [reports]);

	const { setPage, setPerPage, paginate } = usePagination({
		initialPerPage: 5,
	});

	// Join reports with artwork, reporter, artist
	const joinedReports = useMemo(() => {
		return reports
			.map((report) => {
				const artwork = artworks.find((a) => a.id === report.target_id);
				const reporter = users.find((u) => u.id === report.reporter_id);
				const artist = users.find((u) => u.id === artwork?.artists_id);

				return {
					...report,
					artwork,
					reporter,
					artist,
				};
			})
			.sort(
				(a, b) =>
					new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
			);
	}, [reports, artworks, users]);

	const [search, setSearch] = useState("");

	const filteredReports = useMemo(() => {
		const query = search.trim().toLowerCase();
		if (!query) return joinedReports;
		return joinedReports.filter((item) => {
			return (
				item.artwork?.title?.toLowerCase().includes(query) ||
				item.reporter?.name?.toLowerCase().includes(query) ||
				item.artist?.name?.toLowerCase().includes(query) ||
				item.reason?.toLowerCase().includes(query)
			);
		});
	}, [joinedReports, search]);

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
					const res = approved
						? resolveReport(report.id, curator?.id || "u-008")
						: dismissReport(report.id, curator?.id || "u-008");

					if (res.success) {
						addToast({ message: res.message, type: "success" });
					} else {
						addToast({ message: res.message, type: "error" });
					}
				},
			});
		},
		[curator?.id, openModal, resolveReport, dismissReport, addToast],
	);

	const columns = useMemo(
		() =>
			createReportsTableColumns({
				openLightbox,
				handleResolve,
			}),
		[handleResolve, openLightbox],
	);

	return (
		<div className="space-y-6">
			<div className="grid gap-4 sm:grid-cols-3">
				<Stat
					variant="card"
					label="Laporan Pending"
					value={pending.length}
					icon={AlertCircle}
				/>
				<Stat
					variant="card"
					label="Disetujui (total)"
					value={resolved.length}
					icon={CheckCircle}
				/>
				<Stat
					variant="card"
					label="Ditolak (total)"
					value={dismissed.length}
					icon={XCircle}
				/>
			</div>

			<div className="rounded-2xl border border-content/10 bg-surface">
				<div className="flex flex-col gap-3 border-b border-content/10 p-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2 className="font-heading text-lg font-semibold text-content">
							Daftar Laporan Karya (Art Reports)
						</h2>
						<p className="text-sm text-content-muted">
							Tinjau laporan aktif dari pengguna atau riwayat keputusan laporan.
						</p>
					</div>
					<div className="relative w-full sm:max-w-sm">
						<Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-content-muted" />
						<input
							type="search"
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Cari karya, pelapor, artist, atau alasan..."
							className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pr-4 pl-10 text-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#33658A] dark:border-gray-600 dark:bg-[#1D2D37] dark:focus:ring-[#86BBD8]"
						/>
					</div>
				</div>

				<DataTable
					columns={columns}
					pagination={paginatedReports}
					getRowKey={(row) => row.id}
					onPageChange={setPage}
					onPerPageChange={setPerPage}
					itemLabel="laporan"
					emptyState={
						<div className="py-12 text-center">
							<CheckCircle className="mx-auto mb-3 h-10 w-10 text-verified" />
							<p className="font-semibold text-content text-base">
								Semua Laporan Bersih
							</p>
							<p className="text-sm text-content-muted mt-1">
								Tidak ada karya yang dilaporkan oleh pengguna saat ini.
							</p>
						</div>
					}
				/>
			</div>
		</div>
	);
}
