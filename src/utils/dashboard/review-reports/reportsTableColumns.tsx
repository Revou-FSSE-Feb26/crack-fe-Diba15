"use client";

import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

import Button from "@/components/ui/Button";
import type { DataTableColumn, JoinedReport } from "@/types";
import { formatDate } from "@/utils";

interface CreateReportsTableColumnsOptions {
	openLightbox: (urls: string[], index: number, title?: string) => void;
	handleResolve: (report: JoinedReport, approved: boolean) => void;
	renderActions?: (report: JoinedReport) => ReactNode;
}

export function createReportsTableColumns({
	openLightbox,
	handleResolve,
	renderActions,
}: CreateReportsTableColumnsOptions): DataTableColumn<JoinedReport>[] {
	return [
		{
			key: "artwork_info",
			header: "Art / Artist",
			cellClassName: "align-top font-medium text-content min-w-[200px]",
			cell: (row) => (
				<div className="space-y-1 py-1">
					<p className="font-semibold text-sm text-content">
						{row.artwork?.title || "Tidak diketahui"}
					</p>
					<p className="text-xs text-content-muted">
						Artist: {row.artist?.name ?? "Tidak diketahui"}
					</p>
					<p className="text-xs text-content-muted">
						ID: {row.artwork?.id || "-"}
					</p>
				</div>
			),
		},
		{
			key: "artwork_preview",
			header: "Preview Art",
			cellClassName: "align-top",
			cell: (row) => {
				const firstImage = row.artwork?.images_url?.[0];
				return (
					<div className="py-1">
						{firstImage ? (
							<button
								type="button"
								onClick={() =>
									openLightbox(
										row.artwork?.images_url ?? [],
										0,
										`Artwork: ${row.artwork?.title}`,
									)
								}
								className="relative w-16 aspect-video bg-content/5 rounded-md overflow-hidden border border-content/10 group cursor-pointer block"
							>
								<Image
									src={firstImage}
									alt={row.artwork?.title || "Preview"}
									fill
									sizes="64px"
									className="object-cover group-hover:scale-105 transition-transform"
								/>
							</button>
						) : (
							<span className="text-xs text-content-muted italic">
								Tidak ada gambar
							</span>
						)}
					</div>
				);
			},
		},
		{
			key: "reporter_info",
			header: "Pelapor",
			cellClassName: "align-top text-xs text-content",
			cell: (row) => (
				<div className="py-1 space-y-1">
					<p className="font-medium">
						{row.reporter?.name || "Tidak diketahui"}
					</p>
					<p className="text-[10px] text-content-muted capitalize">
						Role: {row.reporter?.role || "-"}
					</p>
				</div>
			),
		},
		{
			key: "report_reason",
			header: "Alasan Laporan",
			cellClassName:
				"align-top min-w-[250px] max-w-[350px] text-xs text-content-muted leading-relaxed break-words",
			cell: (row) => (
				<div className="py-1">
					<p className="font-medium text-content mb-1">
						Dilaporkan: {formatDate(row.created_at)}
					</p>
					<p className="italic bg-content/5 p-2 rounded-lg border border-content/5">
						&ldquo;{row.reason}&rdquo;
					</p>
				</div>
			),
		},
		{
			key: "report_status",
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
				if (row.status === "resolved") {
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
					<DefaultReportActions report={row} handleResolve={handleResolve} />
				),
		},
	];
}

function DefaultReportActions({
	report,
	handleResolve,
}: {
	report: JoinedReport;
	handleResolve: (report: JoinedReport, approved: boolean) => void;
}) {
	if (report.status !== "pending") {
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
				onClick={() => handleResolve(report, true)}
			>
				Setujui
			</Button>
			<Button
				variant="danger"
				className="text-xs py-1.5 px-3 cursor-pointer"
				onClick={() => handleResolve(report, false)}
			>
				Tolak
			</Button>
		</div>
	);
}
