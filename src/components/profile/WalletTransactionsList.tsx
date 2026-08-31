"use client";

import {
	ArrowDownLeft,
	ArrowUpRight,
	Loader2,
	Plus,
	RefreshCw,
	Wallet,
} from "lucide-react";
import DataTablePagination from "@/components/ui/data-table/DataTablePagination";
import { usePagination } from "@/hooks/usePagination";
import { useMyTransactions } from "@/hooks/useTransactionQueries";
import { formatDate, formatPrice } from "@/utils";

interface WalletTransactionsListProps {
	userId?: string;
}

export default function WalletTransactionsList({
	userId: _userId,
}: WalletTransactionsListProps) {
	const { data: transactions, isLoading } = useMyTransactions();
	const userTransactions = transactions || [];

	const { setPage, setPerPage, paginate } = usePagination({
		initialPerPage: 5,
	});

	const paginatedData = paginate(userTransactions);

	if (isLoading) {
		return (
			<div className="bg-surface border border-content/10 rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center justify-center">
				<Loader2 className="h-7 w-7 sm:h-8 sm:w-8 animate-spin text-primary mb-2" />
				<p className="text-xs sm:text-sm text-content-muted">
					Memuat riwayat transaksi...
				</p>
			</div>
		);
	}

	if (userTransactions.length === 0) {
		return (
			<div className="bg-surface border border-content/10 rounded-2xl p-6 sm:p-8 text-center">
				<Wallet className="mx-auto mb-3 h-9 w-9 sm:h-10 sm:w-10 text-content-muted" />
				<p className="font-semibold text-content text-sm sm:text-base">
					Belum Ada Transaksi
				</p>
				<p className="text-xs sm:text-sm text-content-muted mt-1 max-w-sm mx-auto">
					Semua riwayat pengeluaran, pengisian saldo, dan pencairan komisi akan
					muncul di sini.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="rounded-2xl border border-content/10 bg-surface overflow-hidden">
				<div className="border-b border-content/10 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
					<div>
						<h2 className="font-heading text-base sm:text-lg font-semibold text-content">
							Riwayat Transaksi E-Wallet
						</h2>
						<p className="text-xs sm:text-sm text-content-muted">
							Daftar seluruh aktivitas mutasi saldo akun Anda.
						</p>
					</div>
					<span className="self-start sm:self-auto text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-full bg-content/5 text-content-muted">
						Total {userTransactions.length} transaksi
					</span>
				</div>

				<div className="divide-y divide-content/5">
					{paginatedData.data.map((tx) => {
						const isIncoming = ["topup", "refund", "release"].includes(tx.type);

						return (
							<div
								key={tx.id}
								className="flex items-center justify-between p-3 sm:p-4 hover:bg-content/5 transition-colors gap-2.5 sm:gap-4"
							>
								<div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
									{/* Type Icon */}
									<div
										className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${
											tx.type === "topup"
												? "bg-success/10 text-success"
												: tx.type === "refund"
													? "bg-secondary/10 text-secondary"
													: tx.type === "release"
														? "bg-primary/10 text-primary"
														: "bg-danger/10 text-danger"
										}`}
									>
										{tx.type === "topup" && (
											<Plus className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
										)}
										{tx.type === "refund" && (
											<RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
										)}
										{tx.type === "release" && (
											<ArrowDownLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
										)}
										{tx.type === "payment" && (
											<ArrowUpRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
										)}
										{tx.type === "withdraw" && (
											<ArrowUpRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
										)}
										{tx.type === "platform_fee" && (
											<ArrowUpRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
										)}
									</div>

									{/* Detail Title */}
									<div className="min-w-0">
										<p className="text-xs sm:text-sm font-semibold text-content break-words leading-snug">
											{tx.title}
										</p>
										<p className="text-[11px] sm:text-xs text-content-muted mt-0.5">
											{formatDate(tx.created_at)}
										</p>
									</div>
								</div>

								{/* Amount Text */}
								<div
									className={`text-xs sm:text-sm font-bold shrink-0 font-mono ${
										isIncoming ? "text-success" : "text-danger"
									}`}
								>
									{isIncoming ? "+ " : "- "}
									{formatPrice(tx.amount)}
								</div>
							</div>
						);
					})}
				</div>

				{/* Pagination Controls */}
				<DataTablePagination
					page={paginatedData.page}
					perPage={paginatedData.per_page as 5 | 10}
					total={paginatedData.total}
					totalPages={paginatedData.total_pages}
					onPageChange={setPage}
					onPerPageChange={setPerPage}
					itemLabel="transaksi"
				/>
			</div>
		</div>
	);
}
