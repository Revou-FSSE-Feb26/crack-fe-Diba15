"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { PAGE_SIZE_OPTIONS } from "@/utils/pagination";

interface DataTablePaginationProps {
	page: number;
	perPage: 5 | 10;
	total: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	onPerPageChange: (perPage: 5 | 10) => void;
	itemLabel?: string;
}

export default function DataTablePagination({
	page,
	perPage,
	total,
	totalPages,
	onPageChange,
	onPerPageChange,
	itemLabel = "data",
}: DataTablePaginationProps) {
	const start = total === 0 ? 0 : (page - 1) * perPage + 1;
	const end = Math.min(page * perPage, total);

	return (
		<div className="flex flex-col gap-3 border-t border-content/10 p-4 sm:flex-row sm:items-center sm:justify-between">
			<p className="text-sm text-content-muted">
				Menampilkan {start}-{end} dari {total} {itemLabel}
			</p>

			<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
				<label className="flex items-center gap-2 text-sm text-content-muted">
					<span>Per halaman</span>
					<select
						value={perPage}
						onChange={(event) =>
							onPerPageChange(Number(event.target.value) as 5 | 10)
						}
						className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-sm text-content outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#33658A] dark:border-gray-600 dark:bg-[#1D2D37] dark:focus:ring-[#86BBD8]"
					>
						{PAGE_SIZE_OPTIONS.map((size) => (
							<option key={size} value={size}>
								{size}
							</option>
						))}
					</select>
				</label>

				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={() => onPageChange(page - 1)}
						disabled={page <= 1}
						className="inline-flex items-center gap-1 rounded-lg border border-content/10 px-3 py-1.5 text-xs font-medium text-content transition-colors hover:bg-content/5 disabled:cursor-not-allowed disabled:opacity-40"
					>
						<ChevronLeft className="h-3.5 w-3.5" />
						Sebelumnya
					</button>
					<span className="min-w-[72px] text-center text-xs font-medium text-content-muted">
						{page} / {totalPages}
					</span>
					<button
						type="button"
						onClick={() => onPageChange(page + 1)}
						disabled={page >= totalPages}
						className="inline-flex items-center gap-1 rounded-lg border border-content/10 px-3 py-1.5 text-xs font-medium text-content transition-colors hover:bg-content/5 disabled:cursor-not-allowed disabled:opacity-40"
					>
						Berikutnya
						<ChevronRight className="h-3.5 w-3.5" />
					</button>
				</div>
			</div>
		</div>
	);
}
