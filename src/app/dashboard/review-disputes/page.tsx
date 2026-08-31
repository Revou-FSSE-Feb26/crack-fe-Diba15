"use client";

import {
	AlertCircle,
	CheckCircle,
	FileWarning,
	RefreshCw,
	Search,
	ShieldAlert,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

import DataTable from "@/components/ui/data-table/DataTable";
import Stat from "@/components/ui/Stat";
import { useDisputes, useResolveDispute } from "@/hooks/useDisputeQueries";
import { usePagination, useResetPageOnChange } from "@/hooks/usePagination";
import { useLightboxStore } from "@/store/LightboxStore";
import { useModalStore } from "@/store/ModalStore";
import { useUserStore } from "@/store/UserStore";
import type { JoinedDispute } from "@/types";
import { formatPrice } from "@/utils";
import { createDisputesTableColumns } from "@/utils/dashboard/review-disputes/disputesTableColumns";

type DisputeStatusFilter = "all" | "pending" | "approved" | "rejected";

export default function ReviewDisputesPage() {
	const { isCurator } = useUserStore();
	const {
		data: disputesList = [],
		isLoading,
		isRefetching,
		refetch,
	} = useDisputes();
	const resolveDisputeMutation = useResolveDispute();
	const { openModal } = useModalStore();
	const { openLightbox } = useLightboxStore();

	const [statusFilter, setStatusFilter] = useState<DisputeStatusFilter>("all");
	const [search, setSearch] = useState("");

	const { pending, disputed, rejected } = useMemo(() => {
		const pending = disputesList.filter((d) => d.status === "pending");
		const disputed = disputesList.filter((d) => d.status === "approved");
		const rejected = disputesList.filter((d) => d.status === "rejected");
		return { pending, disputed, rejected };
	}, [disputesList]);

	const { setPage, setPerPage, paginate, resetPage } = usePagination({
		initialPerPage: 10,
	});

	useResetPageOnChange(resetPage, [search, statusFilter]);

	// Normalize dispute with client & artist details
	const joinedDisputes = useMemo(() => {
		return disputesList
			.map((dispute) => ({
				...dispute,
				client: dispute.commission?.client,
				artist: dispute.commission?.artist,
			}))
			.sort(
				(a, b) =>
					new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
			);
	}, [disputesList]);

	const filteredDisputes = useMemo(() => {
		const query = search.trim().toLowerCase();
		let list = joinedDisputes;

		if (statusFilter !== "all") {
			list = list.filter((item) => item.status === statusFilter);
		}

		if (query) {
			list = list.filter((item) => {
				return (
					item.commission?.commission_title?.toLowerCase().includes(query) ||
					item.client?.name?.toLowerCase().includes(query) ||
					item.artist?.name?.toLowerCase().includes(query) ||
					item.reason?.toLowerCase().includes(query) ||
					item.id.toLowerCase().includes(query)
				);
			});
		}

		return list;
	}, [joinedDisputes, search, statusFilter]);

	const paginatedDisputes = useMemo(
		() => paginate(filteredDisputes),
		[filteredDisputes, paginate],
	);

	const handleResolve = useCallback(
		(dispute: JoinedDispute, approved: boolean) => {
			const confirmMessage = approved
				? `Apakah Anda yakin ingin menyetujui dispute untuk "${dispute.commission?.commission_title}"? Ini akan me-refund dana sebesar ${formatPrice(dispute.commission?.price ?? 0)} kepada klien dan memberikan +1 strike count pada artis.`
				: `Apakah Anda yakin ingin menolak dispute untuk "${dispute.commission?.commission_title}"? Ini akan melepaskan dana sebesar ${formatPrice(dispute.commission?.price ?? 0)} ke dompet artis.`;

			openModal({
				title: `${approved ? "Setujui" : "Tolak"} Dispute?`,
				description: confirmMessage,
				type: "confirm",
				variant: approved ? "default" : "danger",
				confirmLabel: approved ? "Setujui" : "Tolak",
				cancelLabel: "Batal",
				onConfirm: () => {
					resolveDisputeMutation.mutate({
						id: dispute.id,
						status: approved ? "approved" : "rejected",
					});
				},
			});
		},
		[openModal, resolveDisputeMutation],
	);

	const columns = useMemo(
		() =>
			createDisputesTableColumns({
				openLightbox,
				handleResolve,
			}),
		[handleResolve, openLightbox],
	);

	if (!isCurator()) {
		return (
			<div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
				<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10 text-danger">
					<ShieldAlert className="h-8 w-8" />
				</div>
				<h1 className="text-xl font-bold text-content">Akses Dibatasi</h1>
				<p className="max-w-sm text-xs text-content-muted">
					Halaman Mediasi Dispute hanya dapat diakses oleh akun Kurator platform
					TruBrush.
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
						Mediasi Dispute (Dispute Review)
					</h1>
					<p className="text-xs text-content-muted">
						Mediasi sengketa transaksi komisi antara klien dan artist secara
						transparan dan adil.
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-2 print:hidden">
					<button
						type="button"
						className="btn btn-outline btn-sm"
						onClick={() => refetch()}
						disabled={isLoading || isRefetching}
						title="Segarkan data sengketa"
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
					label="Sengketa Pending"
					value={
						isLoading ? (
							<span className="loading loading-dots loading-sm" />
						) : (
							`${pending.length} Kasus`
						)
					}
					icon={AlertCircle}
				/>
				<Stat
					variant="card"
					label="Mediasi Disetujui (Refund)"
					value={
						isLoading ? (
							<span className="loading loading-dots loading-sm" />
						) : (
							`${disputed.length} Kasus`
						)
					}
					icon={CheckCircle}
				/>
				<Stat
					variant="card"
					label="Mediasi Ditolak (Release)"
					value={
						isLoading ? (
							<span className="loading loading-dots loading-sm" />
						) : (
							`${rejected.length} Kasus`
						)
					}
					icon={XCircle}
				/>
				<Stat
					variant="card"
					label="Total Kasus Sengketa"
					value={
						isLoading ? (
							<span className="loading loading-dots loading-sm" />
						) : (
							`${disputesList.length} Kasus`
						)
					}
					icon={FileWarning}
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
						placeholder="Cari komisi, nama klien, nama artis, ID, alasan..."
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
							{ id: "all", label: `Semua (${disputesList.length})` },
							{ id: "pending", label: `Pending (${pending.length})` },
							{ id: "approved", label: `Disetujui (${disputed.length})` },
							{ id: "rejected", label: `Ditolak (${rejected.length})` },
						] as const
					).map((preset) => (
						<button
							key={preset.id}
							type="button"
							onClick={() => setStatusFilter(preset.id as DisputeStatusFilter)}
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

			{/* Disputes Table */}
			<div className="rounded-2xl border border-content/10 bg-surface overflow-hidden">
				<DataTable
					columns={columns}
					pagination={paginatedDisputes}
					getRowKey={(row) => row.id}
					isLoading={isLoading}
					onPageChange={setPage}
					onPerPageChange={setPerPage}
					itemLabel="sengketa"
					emptyState={
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<CheckCircle className="h-10 w-10 text-verified mb-2 opacity-60" />
							<p className="text-sm font-semibold text-content">
								Tidak Ada Sengketa Ditemukan
							</p>
							<p className="text-xs text-content-muted mt-1 max-w-xs">
								Semua sengketa komisi berada dalam status bersih atau tidak ada
								yang cocok dengan filter saat ini.
							</p>
						</div>
					}
				/>
			</div>
		</div>
	);
}
