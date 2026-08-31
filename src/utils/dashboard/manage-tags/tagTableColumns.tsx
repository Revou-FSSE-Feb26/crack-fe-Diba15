import { Edit2, Tag as TagIcon, Trash2 } from "lucide-react";
import type { DataTableColumn, Tag } from "@/types";

interface TagTableColumnsProps {
	onEdit: (tag: Tag) => void;
	onDelete: (tag: Tag) => void;
}

export function createTagTableColumns({
	onEdit,
	onDelete,
}: TagTableColumnsProps): DataTableColumn<Tag>[] {
	return [
		{
			key: "tag_name",
			header: "Nama Tag",
			cell: (row) => (
				<div className="flex items-center gap-2.5">
					<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
						<TagIcon className="h-3.5 w-3.5" />
					</div>
					<div>
						<span className="font-semibold text-content text-xs font-mono">
							#{row.tag_name}
						</span>
						<p className="text-[10px] text-content-muted">ID: {row.id}</p>
					</div>
				</div>
			),
		},
		{
			key: "count",
			header: "Karya Terkait",
			cell: (row) => {
				const count = row.count ?? 0;
				return (
					<span
						className={`badge badge-sm font-semibold ${
							count > 0
								? "badge-primary"
								: "badge-ghost border border-content/10"
						}`}
					>
						{count} Karya
					</span>
				);
			},
		},
		{
			key: "status",
			header: "Status Tag",
			cell: (row) => {
				const isUsed = (row.count ?? 0) > 0;
				return (
					<span
						className={`badge badge-xs font-semibold ${
							isUsed ? "badge-success text-white" : "badge-warning"
						}`}
					>
						{isUsed ? "Aktif Digunakan" : "Belum Dipakai"}
					</span>
				);
			},
		},
		{
			key: "actions",
			header: "Aksi",
			headerClassName: "text-right",
			cellClassName: "text-right",
			cell: (row) => (
				<div className="flex items-center justify-end gap-1.5">
					<button
						type="button"
						onClick={() => onEdit(row)}
						className="btn btn-ghost btn-xs rounded-lg text-primary hover:bg-primary/10"
						title="Ubah nama tag"
					>
						<Edit2 className="h-3.5 w-3.5 mr-1" />
						Ubah
					</button>
					<button
						type="button"
						onClick={() => onDelete(row)}
						className="btn btn-ghost btn-xs rounded-lg text-danger hover:bg-danger/10"
						title="Hapus tag"
					>
						<Trash2 className="h-3.5 w-3.5 mr-1" />
						Hapus
					</button>
				</div>
			),
		},
	];
}
