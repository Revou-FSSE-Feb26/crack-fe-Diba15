"use client";

import {
	Calendar,
	CircleDollarSign,
	Download,
	Filter,
	Lock,
	Percent,
	Printer,
	RefreshCw,
	Search,
	ShieldAlert,
	Wallet,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

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

type DatePreset = "all" | "today" | "7d" | "30d" | "this_month";

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

	// Date Range Calculation based on Preset
	const computedDateRange = useMemo(() => {
		const now = new Date();
		if (datePreset === "today") {
			const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			return { startDate: start.toISOString(), endDate: now.toISOString() };
		}
		if (datePreset === "7d") {
			const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
			return { startDate: start.toISOString(), endDate: now.toISOString() };
		}
		if (datePreset === "30d") {
			const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
			return { startDate: start.toISOString(), endDate: now.toISOString() };
		}
		if (datePreset === "this_month") {
			const start = new Date(now.getFullYear(), now.getMonth(), 1);
			return { startDate: start.toISOString(), endDate: now.toISOString() };
		}
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
		return { startDate: undefined, endDate: undefined };
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
			`"${tx.id}"`,
			`"${formatDateTime(tx.created_at)}"`,
			`"${tx.user?.name || "System"}"`,
			`"${tx.user?.role || "—"}"`,
			`"${transactionTypeLabels[tx.type] || tx.type}"`,
			tx.amount,
			`"${tx.title.replaceAll('"', '""')}"`,
			`"${tx.status}"`,
		]);

		const csvContent =
			"data:text/csv;charset=utf-8," +
			[headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute(
			"download",
			`laporan-finansial-trubrush-${new Date().toISOString().split("T")[0]}.csv`,
		);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
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
			<div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
				<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10 text-danger">
					<ShieldAlert className="h-8 w-8" />
				</div>
				<h1 className="text-xl font-bold text-content">Akses Dibatasi</h1>
				<p className="max-w-sm text-xs text-content-muted">
					Halaman Laporan Finansial hanya dapat diakses oleh Administrator
					platform TruBrush.
				</p>
				<Link href="/dashboard">
					<button type="button" className="btn btn-primary btn-sm">
						Kembali ke Dashboard
					</button>
				</Link>
			</div>
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

			{/* KPI Summary Cards */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
			<div className="rounded-2xl border border-content/10 bg-surface p-4 space-y-3 print:hidden">
				<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
					{/* Search Box */}
					<div className="relative flex-1 max-w-md">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-muted" />
						<input
							type="text"
							placeholder="Cari transaksi berdasarkan nama, keterangan, ID..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="input input-sm w-full pl-9 bg-background border-content/10 text-xs"
						/>
					</div>

					{/* Type Filter */}
					<div className="flex items-center gap-2">
						<Filter className="h-4 w-4 text-content-muted hidden sm:block" />
						<select
							value={typeFilter}
							onChange={(e) =>
								setTypeFilter(e.target.value as "all" | TransactionType)
							}
							className="select select-sm bg-background border-content/10 text-xs font-medium"
						>
							<option value="all">Semua Tipe Transaksi</option>
							<option value="topup">Top Up Saldo</option>
							<option value="payment">Pembayaran Komisi (Escrow)</option>
							<option value="release">Pencairan Komisi Artis</option>
							<option value="platform_fee">Fee Platform (5%)</option>
							<option value="refund">Pengembalian Dana</option>
							<option value="withdraw">Penarikan Dana Artis</option>
						</select>
					</div>
				</div>

				{/* Date Range Presets & Custom Pickers */}
				<div className="flex flex-wrap items-center gap-2 pt-2 border-t border-content/5">
					<span className="text-xs font-semibold text-content-muted mr-1">
						Periode:
					</span>
					{(
						[
							{ id: "all", label: "Semua Waktu" },
							{ id: "today", label: "Hari Ini" },
							{ id: "7d", label: "7 Hari Terakhir" },
							{ id: "30d", label: "30 Hari Terakhir" },
							{ id: "this_month", label: "Bulan Ini" },
						] as const
					).map((preset) => (
						<button
							key={preset.id}
							type="button"
							onClick={() => {
								setDatePreset(preset.id);
								setCustomStartDate("");
								setCustomEndDate("");
							}}
							className={`btn btn-xs rounded-lg ${
								datePreset === preset.id
									? "btn-primary"
									: "btn-ghost border border-content/10"
							}`}
						>
							{preset.label}
						</button>
					))}

					{/* Custom Date Inputs */}
					<div className="flex items-center gap-1.5 ml-auto text-xs">
						<Calendar className="h-3.5 w-3.5 text-content-muted hidden sm:block" />
						<input
							type="date"
							value={customStartDate}
							onChange={(e) => {
								setCustomStartDate(e.target.value);
								setDatePreset("all");
							}}
							className="input input-xs bg-background border-content/10 text-[11px]"
							title="Tanggal Mulai"
						/>
						<span className="text-content-muted">-</span>
						<input
							type="date"
							value={customEndDate}
							onChange={(e) => {
								setCustomEndDate(e.target.value);
								setDatePreset("all");
							}}
							className="input input-xs bg-background border-content/10 text-[11px]"
							title="Tanggal Selesai"
						/>
					</div>
				</div>
			</div>

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
