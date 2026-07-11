"use client";

import { CheckCircle, FileWarning } from "lucide-react";
import { useCallback, useMemo } from "react";

import DataTable from "@/components/ui/data-table/DataTable";
import { usePagination } from "@/hooks/usePagination";
import { useCommissionStore } from "@/store/CommissionStore";
import { useLightboxStore } from "@/store/LightboxStore";
import { useModalStore } from "@/store/ModalStore";
import { useToastStore } from "@/store/ToastStore";
import { useUserManagementStore } from "@/store/UserManagementStore";
import { useUserStore } from "@/store/UserStore";
import { formatPrice } from "@/utils";
import type { JoinedDispute } from "@/types";
import { createDisputesTableColumns } from "@/utils/dashboard/review-disputes/disputesTableColumns";

export default function ReviewDisputesPage() {
	const { user: curator } = useUserStore();
	const { users } = useUserManagementStore();
	const { disputes, commissions, progress, resolveDispute } =
		useCommissionStore();
	const { openModal } = useModalStore();
	const { addToast } = useToastStore();
	const { openLightbox } = useLightboxStore();

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

	const paginatedDisputes = useMemo(
		() => paginate(joinedDisputes),
		[joinedDisputes, paginate],
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
			<div className="flex flex-col gap-1">
				<h1 className="font-heading text-2xl font-bold text-content flex items-center gap-2">
					<FileWarning className="w-6 h-6 text-danger" />
					Review Disputes
				</h1>
				<p className="text-sm text-content-muted">
					Tinjau perselisihan transaksi komisi aktif antara klien dan artis di
					platform TruBrush.
				</p>
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
	);
}
