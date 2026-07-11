"use client";

import { AlertCircle, CheckCircle, FileWarning, XCircle } from "lucide-react";
import Image from "next/image";
import { useCallback, useMemo } from "react";

import Button from "@/components/ui/Button";
import DataTable from "@/components/ui/data-table/DataTable";
import { usePagination } from "@/hooks/usePagination";
import { useCommissionStore } from "@/store/CommissionStore";
import { useLightboxStore } from "@/store/LightboxStore";
import { useModalStore } from "@/store/ModalStore";
import { useToastStore } from "@/store/ToastStore";
import { useUserManagementStore } from "@/store/UserManagementStore";
import { useUserStore } from "@/store/UserStore";
import type { DataTableColumn } from "@/types";
import { formatDate, formatPrice } from "@/utils";

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
		(dispute: (typeof joinedDisputes)[0], approved: boolean) => {
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

	const columns = useMemo((): DataTableColumn<(typeof joinedDisputes)[0]>[] => {
		return [
			{
				key: "commission_info",
				header: "Art / Komisi",
				cellClassName: "align-top font-medium text-content min-w-[200px]",
				cell: (row) => (
					<div className="space-y-1 py-1">
						<p className="font-semibold text-sm text-content">
							{row.commission?.commission_title || "Tidak diketahui"}
						</p>
						<p className="text-xs text-content-muted">
							Client: {row.client?.name ?? "Tidak diketahui"}
						</p>
						<p className="text-xs text-content-muted">
							Artist: {row.artist?.name ?? "Tidak diketahui"}
						</p>
						<p className="text-xs font-bold text-primary mt-1">
							Nilai: {formatPrice(row.commission?.price ?? 0)}
						</p>
					</div>
				),
			},
			{
				key: "artwork_previews",
				header: "WIP / Preview",
				cellClassName: "align-top",
				cell: (row) => (
					<div className="flex gap-2 py-1 select-none">
						<div className="space-y-1">
							<p className="text-[10px] font-bold text-content-muted">
								WIP Proof
							</p>
							{row.progress?.sketch_url ? (
								<button
									type="button"
									onClick={() =>
										openLightbox(
											[row.progress?.sketch_url ?? ""],
											0,
											`WIP Proof - ${row.commission?.commission_title}`,
										)
									}
									className="relative w-16 aspect-video bg-content/5 rounded-md overflow-hidden border border-content/10 group cursor-pointer block"
								>
									<Image
										src={row.progress.sketch_url}
										alt="WIP Sketch"
										fill
										sizes="64px"
										className="object-cover group-hover:scale-105 transition-transform"
									/>
								</button>
							) : (
								<p className="text-[10px] text-content-muted italic">
									Tidak ada
								</p>
							)}
						</div>
						<div className="space-y-1">
							<p className="text-[10px] font-bold text-content-muted">
								Final Art
							</p>
							{row.progress?.final_artwork_url ? (
								<button
									type="button"
									onClick={() =>
										openLightbox(
											[row.progress?.final_artwork_url ?? ""],
											0,
											`Final Art - ${row.commission?.commission_title}`,
										)
									}
									className="relative w-16 aspect-video bg-content/5 rounded-md overflow-hidden border border-content/10 group cursor-pointer block"
								>
									<Image
										src={row.progress.final_artwork_url}
										alt="Final Artwork"
										fill
										sizes="64px"
										className="object-cover group-hover:scale-105 transition-transform"
									/>
								</button>
							) : (
								<p className="text-[10px] text-content-muted italic">
									Tidak ada
								</p>
							)}
						</div>
					</div>
				),
			},
			{
				key: "dispute_reason",
				header: "Alasan Dispute",
				cellClassName:
					"align-top min-w-[250px] max-w-[350px] text-xs text-content-muted leading-relaxed break-words",
				cell: (row) => (
					<div className="py-1">
						<p className="font-medium text-content mb-1">
							Diajukan: {formatDate(row.created_at)}
						</p>
						<p className="italic bg-content/5 p-2 rounded-lg border border-content/5">
							&ldquo;{row.reason}&rdquo;
						</p>
					</div>
				),
			},
			{
				key: "dispute_status",
				header: "Status",
				cellClassName: "align-top shrink-0",
				cell: (row) => {
					if (row.status === "pending") {
						return (
							<span className="inline-flex items-center gap-1 rounded-full bg-premium/10 px-2.5 py-0.5 text-xs font-semibold text-premium mt-1">
								<AlertCircle className="w-3.5 h-3.5" />
								Pending
							</span>
						);
					}
					if (row.status === "approved") {
						return (
							<span className="inline-flex items-center gap-1 rounded-full bg-verified/10 px-2.5 py-0.5 text-xs font-semibold text-verified mt-1">
								<CheckCircle className="w-3.5 h-3.5" />
								Disetujui
							</span>
						);
					}
					return (
						<span className="inline-flex items-center gap-1 rounded-full bg-content/10 px-2.5 py-0.5 text-xs font-semibold text-content-muted mt-1">
							<XCircle className="w-3.5 h-3.5" />
							Ditolak
						</span>
					);
				},
			},
			{
				key: "actions",
				header: "Aksi",
				cellClassName: "align-top text-right",
				cell: (row) => {
					if (row.status !== "pending") {
						return (
							<span className="text-xs text-content-muted italic block py-2 pr-2">
								Sudah diputuskan
							</span>
						);
					}
					return (
						<div className="flex gap-1.5 justify-end py-1">
							<Button
								variant="primary"
								className="text-xs py-1.5 px-3 bg-verified border-verified text-white hover:bg-verified-hover cursor-pointer"
								onClick={() => handleResolve(row, true)}
							>
								Setujui
							</Button>
							<Button
								variant="danger"
								className="text-xs py-1.5 px-3 cursor-pointer"
								onClick={() => handleResolve(row, false)}
							>
								Tolak
							</Button>
						</div>
					);
				},
			},
		];
	}, [handleResolve, openLightbox]);

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
