"use client";

import { Eye } from "lucide-react";
import type { AuditLogItem, DataTableColumn } from "@/types";
import { formatDateTime } from "@/utils";

export const categoryLabels: Record<string, string> = {
	all: "Semua Kategori",
	curation: "Kurasi Artwork",
	report: "Laporan Konten",
	dispute: "Dispute Komisi",
	appeal: "Banding Akun",
};

export const categoryBadges: Record<string, string> = {
	curation: "bg-info/10 text-info border-info/20",
	report: "bg-error/10 text-error border-error/20",
	dispute: "bg-warning/10 text-warning border-warning/20",
	appeal: "bg-success/10 text-success border-success/20",
};

export const auditStatusBadges: Record<string, string> = {
	approved: "badge-success",
	resolved: "badge-success",
	success: "badge-success",
	unblocked: "badge-success",
	rejected: "badge-error",
	failed: "badge-error",
	flagged: "badge-warning",
	pending: "badge-warning",
	dismissed: "badge-ghost",
};

export function createAuditTableColumns({
	onViewDetail,
}: {
	onViewDetail: (item: AuditLogItem) => void;
}): DataTableColumn<AuditLogItem>[] {
	return [
		{
			key: "createdAt",
			header: "Tanggal & Waktu",
			cell: (item) => (
				<span className="text-xs text-content-muted whitespace-nowrap">
					{formatDateTime(item.createdAt ?? item.created_at)}
				</span>
			),
		},
		{
			key: "actor",
			header: "Aktor / Staf",
			cell: (item) => (
				<div className="flex flex-col min-w-0">
					<span className="text-xs font-medium text-content truncate max-w-[140px]">
						{item.actor.name}
					</span>
					<span className="text-[11px] text-content-muted capitalize truncate max-w-[140px]">
						{item.actor.role} • {item.actor.email}
					</span>
				</div>
			),
		},
		{
			key: "category",
			header: "Kategori",
			cell: (item) => {
				const badgeClass =
					categoryBadges[item.category] || "bg-content/10 text-content";
				return (
					<span
						className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badgeClass} whitespace-nowrap`}
					>
						{categoryLabels[item.category] || item.category}
					</span>
				);
			},
		},
		{
			key: "action",
			header: "Tindakan Moderasi",
			cell: (item) => (
				<div className="flex flex-col min-w-0 max-w-[220px]">
					<span className="text-xs font-medium text-content truncate">
						{item.action}
					</span>
					{item.details && (
						<span className="text-[11px] text-content-muted truncate max-w-full">
							{item.details}
						</span>
					)}
				</div>
			),
		},
		{
			key: "target",
			header: "Subjek Target",
			cell: (item) => (
				<div className="flex flex-col min-w-0 max-w-[160px]">
					<span className="text-xs text-content font-medium truncate">
						{item.targetTitle ??
							item.target_title ??
							item.targetId ??
							item.target_id}
					</span>
					<span className="text-[11px] text-content-muted uppercase truncate">
						{item.targetType ?? item.target_type}
					</span>
				</div>
			),
		},
		{
			key: "status",
			header: "Status Hasil",
			cell: (item) => {
				const statusKey = item.status.toLowerCase();
				const badgeClass = auditStatusBadges[statusKey] || "badge-ghost";

				return (
					<span className={`badge badge-sm uppercase font-bold ${badgeClass}`}>
						{item.status}
					</span>
				);
			},
		},
		{
			key: "actions",
			header: <span className="text-right block">Aksi</span>,
			headerClassName: "text-right",
			cellClassName: "text-right",
			cell: (item) => (
				<button
					type="button"
					onClick={() => onViewDetail(item)}
					className="btn btn-ghost btn-xs btn-square text-content-muted hover:text-primary cursor-pointer"
					title="Lihat Detail Log"
				>
					<Eye className="h-4 w-4" />
				</button>
			),
		},
	];
}
