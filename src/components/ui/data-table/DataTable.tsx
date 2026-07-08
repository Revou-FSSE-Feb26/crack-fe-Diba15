"use client";

import DataTablePagination from "@/components/ui/data-table/DataTablePagination";
import type { DataTableProps } from "@/types";

export default function DataTable<T>({
  columns,
  pagination,
  getRowKey,
  emptyState,
  isLoading = false,
  toolbar,
  onPageChange,
  onPerPageChange,
  itemLabel = "data",
}: DataTableProps<T>) {
  const { data, page, per_page, total, total_pages } = pagination;
  const columnCount = columns.length;

  return (
    <div className="rounded-2xl border border-content/10 bg-surface">
      {toolbar && (
        <div className="border-b border-content/10 p-4">{toolbar}</div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-content/10 text-left text-content-muted">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={["px-4 py-3 font-medium", column.headerClassName].filter(Boolean).join(" ")}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columnCount} className="px-4 py-10 text-center text-content-muted">
                  Memuat data...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columnCount} className="px-4 py-10 text-center text-content-muted">
                  {emptyState ?? "Tidak ada data."}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={getRowKey(row)} className="border-b border-content/5 last:border-b-0">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={["px-4 py-3", column.cellClassName].filter(Boolean).join(" ")}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <DataTablePagination
        page={page}
        perPage={per_page as 5 | 10}
        total={total}
        totalPages={total_pages}
        onPageChange={onPageChange}
        onPerPageChange={onPerPageChange}
        itemLabel={itemLabel}
      />
    </div>
  );
}
