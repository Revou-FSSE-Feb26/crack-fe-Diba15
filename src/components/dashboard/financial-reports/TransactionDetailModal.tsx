"use client";

import { CreditCard, DollarSign, User as UserIcon, X } from "lucide-react";
import type { WalletTransaction } from "@/types";
import { formatDateTime, formatPrice } from "@/utils";
import {
	statusBadges,
	transactionTypeBadges,
	transactionTypeLabels,
} from "@/utils/dashboard/financial-reports/financialTableColumns";

interface TransactionDetailModalProps {
	transaction: WalletTransaction | null;
	isOpen: boolean;
	onClose: () => void;
}

export default function TransactionDetailModal({
	transaction,
	isOpen,
	onClose,
}: TransactionDetailModalProps) {
	if (!isOpen || !transaction) return null;

	const typeLabel = transactionTypeLabels[transaction.type] || transaction.type;
	const typeBadge =
		transactionTypeBadges[transaction.type] || "bg-content/10 text-content";
	const statusBadge = statusBadges[transaction.status] || "badge-ghost";

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in">
			<div className="bg-surface border border-content/10 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in zoom-in-95">
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-content/10">
					<div className="flex items-center gap-2.5">
						<div className="p-2 rounded-xl bg-primary/10 text-primary">
							<DollarSign className="h-5 w-5" />
						</div>
						<div>
							<h3 className="text-base font-bold text-content">
								Detail Transaksi
							</h3>
							<p className="text-xs text-content-muted font-mono">
								{transaction.id}
							</p>
						</div>
					</div>
					<button
						type="button"
						className="btn btn-ghost btn-xs btn-square text-content-muted hover:text-content"
						onClick={onClose}
					>
						<X className="h-4 w-4" />
					</button>
				</div>

				{/* Body */}
				<div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
					{/* Amount Box */}
					<div className="rounded-xl bg-content/5 p-4 text-center border border-content/10">
						<span className="text-xs font-medium text-content-muted block mb-1">
							Nominal Transaksi
						</span>
						<span className="text-2xl font-extrabold text-content font-mono">
							{formatPrice(transaction.amount)}
						</span>
						<div className="flex items-center justify-center gap-2 mt-2">
							<span
								className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${typeBadge}`}
							>
								{typeLabel}
							</span>
							<span
								className={`badge badge-sm uppercase font-bold ${statusBadge}`}
							>
								{transaction.status}
							</span>
						</div>
					</div>

					{/* Detail List */}
					<div className="space-y-3 text-xs">
						<div className="flex justify-between items-center py-2 border-b border-content/5">
							<span className="text-content-muted">Keterangan:</span>
							<span className="font-medium text-content text-right max-w-[260px]">
								{transaction.title}
							</span>
						</div>

						<div className="flex justify-between items-center py-2 border-b border-content/5">
							<span className="text-content-muted">Waktu Transaksi:</span>
							<span className="font-medium text-content">
								{formatDateTime(transaction.created_at)}
							</span>
						</div>

						{/* User Info */}
						<div className="rounded-xl bg-content/5 p-3.5 space-y-2 border border-content/5">
							<div className="flex items-center gap-1.5 font-semibold text-content text-xs">
								<UserIcon className="h-3.5 w-3.5 text-primary" />
								<span>Informasi Pengguna</span>
							</div>
							<div className="flex justify-between text-content-muted">
								<span>Nama:</span>
								<span className="font-medium text-content">
									{transaction.user?.name || "System"}
								</span>
							</div>
							<div className="flex justify-between text-content-muted">
								<span>Email:</span>
								<span className="font-medium text-content font-mono">
									{transaction.user?.email || "—"}
								</span>
							</div>
							<div className="flex justify-between text-content-muted">
								<span>Role:</span>
								<span className="font-medium text-content capitalize">
									{transaction.user?.role || "—"}
								</span>
							</div>
						</div>

						{/* Commission Info (if linked) */}
						{transaction.commission && (
							<div className="rounded-xl bg-content/5 p-3.5 space-y-2 border border-content/5">
								<div className="flex items-center gap-1.5 font-semibold text-content text-xs">
									<CreditCard className="h-3.5 w-3.5 text-primary" />
									<span>Informasi Komisi Terkait</span>
								</div>
								<div className="flex justify-between text-content-muted">
									<span>Judul Komisi:</span>
									<span className="font-medium text-content text-right max-w-[200px] truncate">
										{transaction.commission.commission_title}
									</span>
								</div>
								<div className="flex justify-between text-content-muted">
									<span>Total Harga:</span>
									<span className="font-medium text-content font-mono">
										{formatPrice(transaction.commission.price)}
									</span>
								</div>
								<div className="flex justify-between text-content-muted">
									<span>Status Komisi:</span>
									<span className="font-medium text-content uppercase">
										{transaction.commission.status}
									</span>
								</div>
							</div>
						)}

						{/* Metadata */}
						{transaction.metadata &&
							Object.keys(transaction.metadata).length > 0 && (
								<div className="rounded-xl bg-content/5 p-3.5 space-y-1.5 border border-content/5">
									<span className="font-semibold text-content text-xs block mb-1">
										Metadata Tambahan
									</span>
									<pre className="text-[11px] font-mono text-content-muted whitespace-pre-wrap bg-background p-2 rounded-lg border border-content/5">
										{JSON.stringify(transaction.metadata, null, 2)}
									</pre>
								</div>
							)}
					</div>
				</div>

				{/* Footer */}
				<div className="px-6 py-3.5 border-t border-content/10 bg-content/5 flex justify-end">
					<button
						type="button"
						className="btn btn-outline btn-sm"
						onClick={onClose}
					>
						Tutup
					</button>
				</div>
			</div>
		</div>
	);
}
