"use client";

import { AlertCircle, CheckCircle, Search, XCircle } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import DataTable from "@/components/ui/data-table/DataTable";
import Stat from "@/components/ui/Stat";
import { usePagination } from "@/hooks/usePagination";
import { useCommissionStore } from "@/store/CommissionStore";
import { useLightboxStore } from "@/store/LightboxStore";
import { useModalStore } from "@/store/ModalStore";
import { useToastStore } from "@/store/ToastStore";
import { useUserManagementStore } from "@/store/UserManagementStore";
import { useUserStore } from "@/store/UserStore";
import type { JoinedDispute } from "@/types";
import { formatPrice } from "@/utils";
import { createDisputesTableColumns } from "@/utils/dashboard/review-disputes/disputesTableColumns";

export default function ReviewDisputesPage() {
	const { user: curator } = useUserStore();
	const { users } = useUserManagementStore();
	const { disputes, commissions, progress, resolveDispute } =
		useCommissionStore();
	const { openModal } = useModalStore();
	const { addToast } = useToastStore();
	const { openLightbox } = useLightboxStore();

	const { pending, disputed, rejected } = useMemo(() => {
		const pending = disputes.filter((d) => d.status === "pending");
		const disputed = disputes.filter((d) => d.status === "approved");
		const rejected = disputes.filter((d) => d.status === "rejected");
		return { pending, disputed, rejected };
	}, [disputes]);

	const { setPage, setPerPage, paginate } = usePagination({
		initialPerPage: 5,
	});

	// Join dispute with commission, progress, client, artist
	const joinedDisputes = useMemo(() => {
		return disputes
			.map((dispute) => {
				const commission = commissions.find(
					(c) => c.id === dispute.commission_id,
				);
				const comProgress = progress.find(
					(p) => p.commission_id === dispute.commission_id,
				);
				const clientUser = users.find((u) => u.id === commission?.client_id);
				const artistUser = users.find((u) => u.id === commission?.artists_id);

				return {
					...dispute,
					commission,
					progress: comProgress,
					client: clientUser,
					artist: artistUser,
				};
			})
			.sort(
				(a, b) =>
					new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
			);
	}, [disputes, commissions, progress, users]);

	const [search, setSearch] = useState("");

	const filteredDisputes = useMemo(() => {
		const query = search.trim().toLowerCase();
		if (!query) return joinedDisputes;
		return joinedDisputes.filter((item) => {
			return (
				item.commission?.commission_title?.toLowerCase().includes(query) ||
				item.client?.name?.toLowerCase().includes(query) ||
				item.artist?.name?.toLowerCase().includes(query) ||
				item.reason?.toLowerCase().includes(query)
			);
		});
	}, [joinedDisputes, search]);

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
					const res = resolveDispute(
						dispute.commission_id,
						approved,
						curator?.id || "u-008",
					);
					if (res.success) {
						addToast({ message: res.message, type: "success" });
					} else {
						addToast({ message: res.message, type: "error" });
					}
				},
			});
		},
		[curator?.id, openModal, resolveDispute, addToast],
	);

	const columns = useMemo(
		() =>
			createDisputesTableColumns({
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
					label="Dispute Pending"
					value={pending.length}
					icon={AlertCircle}
				/>
				<Stat
					variant="card"
					label="Disetujui (total)"
					value={disputed.length}
					icon={CheckCircle}
				/>
				<Stat
					variant="card"
					label="Ditolak (total)"
					value={rejected.length}
					icon={XCircle}
				/>
			</div>

			<div className="rounded-2xl border border-content/10 bg-surface">
				<div className="flex flex-col gap-3 border-b border-content/10 p-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2 className="font-heading text-lg font-semibold text-content">
							Daftar Sengketa
						</h2>
						<p className="text-sm text-content-muted">
							Tinjau sengketa aktif atau riwayat sengketa transaksi komisi.
						</p>
					</div>
					<div className="relative w-full sm:max-w-sm">
						<Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-content-muted" />
						<input
							type="search"
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Cari komisi, klien, artis, atau alasan..."
							className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pr-4 pl-10 text-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#33658A] dark:border-gray-600 dark:bg-[#1D2D37] dark:focus:ring-[#86BBD8]"
						/>
					</div>
				</div>

				<DataTable
					columns={columns}
					pagination={paginatedDisputes}
					getRowKey={(row) => row.id}
					onPageChange={setPage}
					onPerPageChange={setPerPage}
					itemLabel="sengketa"
					emptyState={
						<div className="py-12 text-center">
							<CheckCircle className="mx-auto mb-3 h-10 w-10 text-verified" />
							<p className="font-semibold text-content text-base">
								Semua Sengketa Bersih
							</p>
							<p className="text-sm text-content-muted mt-1">
								Tidak ada komisi yang saat ini berada dalam tahap sengketa
								(dispute) pending.
							</p>
						</div>
					}
				/>
			</div>
		</div>
	);
}
