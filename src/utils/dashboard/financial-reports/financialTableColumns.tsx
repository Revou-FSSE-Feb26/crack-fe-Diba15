"use client";

import { Eye } from "lucide-react";
import type {
	DataTableColumn,
	TransactionStatus,
	TransactionType,
	WalletTransaction,
} from "@/types";
import { formatDateTime, formatPrice } from "@/utils";

export const transactionTypeLabels: Record<TransactionType, string> = {
	topup: "Top Up",
	withdraw: "Penarikan Artis",
	payment: "Bayar Komisi (Escrow)",
	release: "Pencairan Komisi",
	platform_fee: "Fee Platform (5%)",
	refund: "Pengembalian Dana",
};

export const transactionTypeBadges: Record<TransactionType, string> = {
	topup: "bg-success/10 text-success border-success/20",
	withdraw: "bg-warning/10 text-warning border-warning/20",
	payment: "bg-info/10 text-info border-info/20",
	release: "bg-success/15 text-success border-success/30",
	platform_fee: "bg-primary/10 text-primary border-primary/20",
	refund: "bg-secondary/15 text-secondary border-secondary/30",
};

export const statusBadges: Record<TransactionStatus, string> = {
	success: "badge-success",
	pending: "badge-warning",
	failed: "badge-error",
};

interface CreateFinancialColumnsOptions {
	onViewDetail: (tx: WalletTransaction) => void;
}

export function createFinancialTableColumns({
	onViewDetail,
}: CreateFinancialColumnsOptions): DataTableColumn<WalletTransaction>[] {
	return [
		{
			key: "created_at",
			header: "Tanggal & Waktu",
			cell: (tx) => (
				<span className="text-xs text-content-muted whitespace-nowrap">
					{formatDateTime(tx.created_at)}
				</span>
			),
		},
		{
			key: "user",
			header: "Pengguna",
			cell: (tx) => (
				<div className="flex flex-col min-w-0">
					<span className="text-xs font-medium text-content truncate max-w-[140px]">
						{tx.user?.name || "System"}
					</span>
					<span className="text-[11px] text-content-muted capitalize truncate max-w-[140px]">
						{tx.user?.role ? `Role: ${tx.user.role}` : tx.user_id}
					</span>
				</div>
			),
		},
		{
			key: "type",
			header: "Tipe",
			cell: (tx) => {
				const badgeClass =
					transactionTypeBadges[tx.type] || "bg-content/10 text-content";
				const label = transactionTypeLabels[tx.type] || tx.type;
				return (
					<span
						className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badgeClass} whitespace-nowrap`}
					>
						{label}
					</span>
				);
			},
		},
		{
			key: "amount",
			header: "Nominal",
			headerClassName: "text-right",
			cellClassName: "text-right",
			cell: (tx) => {
				const isPositive =
					tx.type === "topup" ||
					tx.type === "release" ||
					tx.type === "platform_fee";
				return (
					<div className="flex flex-col items-end">
						<span
							className={`text-xs font-bold font-mono ${
								isPositive ? "text-success" : "text-content"
							}`}
						>
							{isPositive ? "+" : "-"} {formatPrice(tx.amount)}
						</span>
					</div>
				);
			},
		},
		{
			key: "title",
			header: "Keterangan",
			cell: (tx) => (
				<div
					className="max-w-[200px] truncate text-xs text-content"
					title={tx.title}
				>
					{tx.title}
				</div>
			),
		},
		{
			key: "status",
			header: "Status",
			cell: (tx) => {
				const badge = statusBadges[tx.status] || "badge-ghost";
				return (
					<span
						className={`badge badge-sm badge-soft uppercase text-[10px] font-bold ${badge}`}
					>
						{tx.status}
					</span>
				);
			},
		},
		{
			key: "actions",
			header: "Aksi",
			headerClassName: "text-right",
			cellClassName: "text-right",
			cell: (tx) => (
				<button
					type="button"
					onClick={() => onViewDetail(tx)}
					className="btn btn-ghost btn-xs btn-square text-content-muted hover:text-content"
					title="Lihat Detail Transaksi"
				>
					<Eye className="h-3.5 w-3.5" />
				</button>
			),
		},
	];
}
