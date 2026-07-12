"use client";

import {
	ArrowDownLeft,
	ArrowUpRight,
	Plus,
	RefreshCw,
	Wallet,
} from "lucide-react";
import { useTransactionStore } from "@/store/TransactionStore";
import { formatDate, formatPrice } from "@/utils";

interface WalletTransactionsListProps {
	userId: string;
}

export default function WalletTransactionsList({
	userId,
}: WalletTransactionsListProps) {
	const { getTransactionsByUserId } = useTransactionStore();
	const userTransactions = getTransactionsByUserId(userId);

	if (userTransactions.length === 0) {
		return (
			<div className="bg-surface border border-content/10 rounded-2xl p-8 text-center">
				<Wallet className="mx-auto mb-3 h-10 w-10 text-content-muted" />
				<p className="font-semibold text-content text-base">
					Belum Ada Transaksi
				</p>
				<p className="text-sm text-content-muted mt-1">
					Semua riwayat pengeluaran, pengisian saldo, dan refund komisi akan
					muncul di sini.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="rounded-2xl border border-content/10 bg-surface overflow-hidden">
				<div className="border-b border-content/10 p-4">
					<h2 className="font-heading text-lg font-semibold text-content">
						Riwayat Transaksi E-Wallet
					</h2>
					<p className="text-sm text-content-muted">
						Daftar seluruh aktivitas mutasi saldo akun Anda.
					</p>
				</div>

				<div className="divide-y divide-content/5">
					{userTransactions.map((tx) => {
						const isIncoming = ["topup", "refund", "release"].includes(tx.type);

						return (
							<div
								key={tx.id}
								className="flex items-center justify-between p-4 hover:bg-content/5 transition-colors gap-4"
							>
								<div className="flex items-center gap-3 min-w-0">
									{/* Type Icon */}
									<div
										className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
											tx.type === "topup"
												? "bg-verified/10 text-verified"
												: tx.type === "refund"
													? "bg-mint/10 text-verified"
													: tx.type === "release"
														? "bg-primary/10 text-primary"
														: "bg-danger/10 text-danger"
										}`}
									>
										{tx.type === "topup" && <Plus size={18} />}
										{tx.type === "refund" && <RefreshCw size={16} />}
										{tx.type === "release" && <ArrowDownLeft size={18} />}
										{tx.type === "payment" && <ArrowUpRight size={18} />}
									</div>

									{/* Detail Title */}
									<div className="min-w-0">
										<p className="text-sm font-semibold text-content break-words">
											{tx.title}
										</p>
										<p className="text-xs text-content-muted mt-0.5">
											{formatDate(tx.created_at)}
										</p>
									</div>
								</div>

								{/* Amount Text */}
								<div
									className={`text-sm font-bold shrink-0 ${isIncoming ? "text-verified" : "text-danger"}`}
								>
									{isIncoming ? "+ " : "- "}
									{formatPrice(tx.amount)}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
