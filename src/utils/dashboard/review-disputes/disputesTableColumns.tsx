"use client";

import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

import Button from "@/components/ui/Button";
import type { DataTableColumn, JoinedDispute } from "@/types";
import { formatDate, formatPrice } from "@/utils";

interface CreateDisputesTableColumnsOptions {
	openLightbox: (urls: string[], index: number, title?: string) => void;
	handleResolve: (dispute: JoinedDispute, approved: boolean) => void;
	renderActions?: (dispute: JoinedDispute) => ReactNode;
}

export function createDisputesTableColumns({
	openLightbox,
	handleResolve,
	renderActions,
}: CreateDisputesTableColumnsOptions): DataTableColumn<JoinedDispute>[] {
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
							<p className="text-[10px] text-content-muted italic">Tidak ada</p>
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
							<p className="text-[10px] text-content-muted italic">Tidak ada</p>
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
			cell: (row) =>
				renderActions?.(row) ?? (
					<DefaultDisputeActions dispute={row} handleResolve={handleResolve} />
				),
		},
	];
}

function DefaultDisputeActions({
	dispute,
	handleResolve,
}: {
	dispute: JoinedDispute;
	handleResolve: (dispute: JoinedDispute, approved: boolean) => void;
}) {
	if (dispute.status !== "pending") {
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
				onClick={() => handleResolve(dispute, true)}
			>
				Setujui
			</Button>
			<Button
				variant="danger"
				className="text-xs py-1.5 px-3 cursor-pointer"
				onClick={() => handleResolve(dispute, false)}
			>
				Tolak
			</Button>
		</div>
	);
}
