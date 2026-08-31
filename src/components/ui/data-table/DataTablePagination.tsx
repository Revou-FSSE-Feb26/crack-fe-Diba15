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
		<div className="flex flex-col gap-2.5 sm:gap-3 border-t border-content/10 p-3 sm:p-4 sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm">
			<p className="text-content-muted">
				Menampilkan {start}-{end} dari {total} {itemLabel}
			</p>

			<div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-3">
				<label className="flex items-center gap-1.5 sm:gap-2 text-content-muted">
					<span className="whitespace-nowrap">Per halaman</span>
					<select
						value={perPage}
						onChange={(event) =>
							onPerPageChange(Number(event.target.value) as 5 | 10)
						}
						className="select select-bordered select-xs text-content font-medium h-7 min-h-7 text-xs"
					>
						{PAGE_SIZE_OPTIONS.map((size) => (
							<option key={size} value={size}>
								{size}
							</option>
						))}
					</select>
				</label>

				<div className="join items-center">
					<button
						type="button"
						onClick={() => onPageChange(page - 1)}
						disabled={page <= 1}
						className="join-item btn btn-outline btn-xs gap-1 px-2 sm:px-2.5 h-7 min-h-7"
						title="Halaman sebelumnya"
					>
						<ChevronLeft className="h-3.5 w-3.5" />
						<span className="hidden sm:inline">Sebelumnya</span>
					</button>
					<span className="join-item btn btn-xs btn-ghost no-animation cursor-default px-2 min-w-10 sm:min-w-14 text-xs font-medium text-content-muted h-7 min-h-7">
						{page} / {totalPages}
					</span>
					<button
						type="button"
						onClick={() => onPageChange(page + 1)}
						disabled={page >= totalPages}
						className="join-item btn btn-outline btn-xs gap-1 px-2 sm:px-2.5 h-7 min-h-7"
						title="Halaman berikutnya"
					>
						<span className="hidden sm:inline">Berikutnya</span>
						<ChevronRight className="h-3.5 w-3.5" />
					</button>
				</div>
			</div>
		</div>
	);
}
