"use client";

import {
	CircleDollarSign,
	Download,
	Lock,
	Percent,
	Printer,
	RefreshCw,
	Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";

import AccessDenied from "@/components/dashboard/AccessDenied";
import FinancialFilterToolbar, {
	type DatePreset,
} from "@/components/dashboard/financial-reports/FinancialFilterToolbar";
import TransactionDetailModal from "@/components/dashboard/financial-reports/TransactionDetailModal";
import DataTable from "@/components/ui/data-table/DataTable";
import Stat from "@/components/ui/Stat";
import { usePagination, useResetPageOnChange } from "@/hooks/usePagination";
import {
	useAllTransactions,
	useFinancialSummary,
} from "@/hooks/useTransactionQueries";
import { useUserStore } from "@/store/UserStore";
import type { TransactionType, WalletTransaction } from "@/types";
import { formatDateTime, formatPrice } from "@/utils";
import {
	createFinancialTableColumns,
	transactionTypeLabels,
} from "@/utils/dashboard/financial-reports/financialTableColumns";
import { getDatePresetRange } from "@/utils/datePresets";
import { exportToCsv } from "@/utils/exportCsv";

export default function FinancialReportsPage() {
	const { isAdmin } = useUserStore();
	const { setPage, setPerPage, paginate, resetPage } = usePagination({
		initialPerPage: 10,
	});

	// Filter States
	const [typeFilter, setTypeFilter] = useState<"all" | TransactionType>("all");
	const [datePreset, setDatePreset] = useState<DatePreset>("all");
	const [customStartDate, setCustomStartDate] = useState<string>("");
	const [customEndDate, setCustomEndDate] = useState<string>("");
	const [search, setSearch] = useState<string>("");
	const [selectedTx, setSelectedTx] = useState<WalletTransaction | null>(null);

	// Date Range Calculation based on Preset Utility
	const computedDateRange = useMemo(() => {
		if (customStartDate || customEndDate) {
			return {
				startDate: customStartDate
					? new Date(customStartDate).toISOString()
					: undefined,
				endDate: customEndDate
					? new Date(customEndDate).toISOString()
					: undefined,
			};
		}
		return getDatePresetRange(datePreset);
	}, [datePreset, customStartDate, customEndDate]);

	// Backend Queries
	const {
		data: summary,
		isLoading: isSummaryLoading,
		refetch: refetchSummary,
	} = useFinancialSummary();

	const {
		data: transactionsResponse,
		isLoading: isTransactionsLoading,
		refetch: refetchTransactions,
	} = useAllTransactions({
		type: typeFilter === "all" ? undefined : typeFilter,
		startDate: computedDateRange.startDate,
		endDate: computedDateRange.endDate,
		limit: 100, // Fetch up to 100 records for client pagination & search filtering
	});

	useResetPageOnChange(resetPage, [
		search,
		typeFilter,
		datePreset,
		customStartDate,
		customEndDate,
	]);

	const rawTransactions = transactionsResponse?.data || [];

	// Local search filter
	const filteredTransactions = useMemo(() => {
		const query = search.trim().toLowerCase();
		if (!query) return rawTransactions;

		return rawTransactions.filter((tx) => {
			const userName = tx.user?.name?.toLowerCase() || "";
			const title = tx.title.toLowerCase();
			const id = tx.id.toLowerCase();
			return (
				userName.includes(query) || title.includes(query) || id.includes(query)
			);
		});
	}, [rawTransactions, search]);

	const paginatedData = paginate(filteredTransactions);

	// Columns definition
	const columns = useMemo(
		() =>
			createFinancialTableColumns({
				onViewDetail: (tx) => setSelectedTx(tx),
			}),
		[],
	);

	// Export CSV Handler
	const handleExportCSV = () => {
		if (filteredTransactions.length === 0) return;

		const headers = [
			"ID Transaksi",
			"Waktu",
			"Nama Pengguna",
			"Role Pengguna",
			"Tipe Transaksi",
			"Nominal (IDR)",
			"Keterangan",
			"Status",
		];

		const rows = filteredTransactions.map((tx) => [
			tx.id,
			formatDateTime(tx.created_at),
			tx.user?.name || "System",
			tx.user?.role || "—",
			transactionTypeLabels[tx.type] || tx.type,
			tx.amount,
			tx.title,
			tx.status,
		]);

		exportToCsv(
			`laporan-finansial-trubrush-${new Date().toISOString().split("T")[0]}.csv`,
			headers,
			rows,
		);
	};

	// Print Summary Handler
	const handlePrint = () => {
		window.print();
	};

	const handleRefresh = () => {
		refetchSummary();
		refetchTransactions();
	};

	if (!isAdmin()) {
		return (
			<AccessDenied description="Halaman Laporan Finansial hanya dapat diakses oleh Administrator platform TruBrush." />
		);
	}

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold text-content">
						Laporan Finansial & Audit Transaksi
					</h1>
					<p className="text-xs text-content-muted">
						Monitoring perputaran dana, saldo escrow, pendapatan platform fee
						5%, dan buku kas platform.
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-2 print:hidden">
					<button
						type="button"
						className="btn btn-outline btn-sm"
						onClick={handleRefresh}
						disabled={isSummaryLoading || isTransactionsLoading}
					>
						<RefreshCw
							className={`h-4 w-4 mr-1 ${
								isSummaryLoading || isTransactionsLoading ? "animate-spin" : ""
							}`}
						/>
						Segarkan
					</button>
					<button
						type="button"
						className="btn btn-outline btn-sm"
						onClick={handleExportCSV}
						disabled={filteredTransactions.length === 0}
					>
						<Download className="h-4 w-4 mr-1" />
						Ekspor CSV
					</button>
					<button
						type="button"
						className="btn btn-primary btn-sm"
						onClick={handlePrint}
					>
						<Printer className="h-4 w-4 mr-1" />
						Cetak Laporan
					</button>
				</div>
			</div>

			{/* KPI Summary Cards (2 Rows x 2 Columns) */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Stat
					variant="card"
					icon={CircleDollarSign}
					label="Total Transaksi GMV"
					value={
						isSummaryLoading ? (
							<span className="loading loading-dots loading-sm" />
						) : (
							formatPrice(summary?.total_gmv ?? 0)
						)
					}
				/>
				<Stat
					variant="card"
					icon={Lock}
					label="Dana Tertahan di Escrow"
					value={
						isSummaryLoading ? (
							<span className="loading loading-dots loading-sm" />
						) : (
							formatPrice(summary?.escrow_balance ?? 0)
						)
					}
				/>
				<Stat
					variant="card"
					icon={Percent}
					label="Pendapatan Fee Platform (5%)"
					value={
						isSummaryLoading ? (
							<span className="loading loading-dots loading-sm" />
						) : (
							formatPrice(summary?.platform_fee_revenue ?? 0)
						)
					}
				/>
				<Stat
					variant="card"
					icon={Wallet}
					label="Total Pencairan Artis"
					value={
						isSummaryLoading ? (
							<span className="loading loading-dots loading-sm" />
						) : (
							formatPrice(summary?.total_withdrawals ?? 0)
						)
					}
				/>
			</div>

			{/* Filter Toolbar */}
			<FinancialFilterToolbar
				search={search}
				onSearchChange={setSearch}
				typeFilter={typeFilter}
				onTypeFilterChange={setTypeFilter}
				datePreset={datePreset}
				onDatePresetChange={setDatePreset}
				customStartDate={customStartDate}
				onCustomStartDateChange={setCustomStartDate}
				customEndDate={customEndDate}
				onCustomEndDateChange={setCustomEndDate}
			/>

			{/* Transactions Table */}
			<div className="rounded-2xl border border-content/10 bg-surface overflow-hidden">
				<DataTable
					columns={columns}
					pagination={paginatedData}
					getRowKey={(tx) => tx.id}
					isLoading={isTransactionsLoading}
					itemLabel="transaksi"
					onPageChange={setPage}
					onPerPageChange={setPerPage}
					emptyState={
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<CircleDollarSign className="h-10 w-10 text-content-muted mb-2 opacity-50" />
							<p className="text-sm font-semibold text-content">
								Tidak ada transaksi ditemukan
							</p>
							<p className="text-xs text-content-muted mt-1 max-w-xs">
								Coba sesuaikan filter tipe transaksi atau rentang tanggal untuk
								melihat data lainnya.
							</p>
						</div>
					}
				/>
			</div>

			{/* Detail Modal */}
			<TransactionDetailModal
				transaction={selectedTx}
				isOpen={!!selectedTx}
				onClose={() => setSelectedTx(null)}
			/>
		</div>
	);
}
