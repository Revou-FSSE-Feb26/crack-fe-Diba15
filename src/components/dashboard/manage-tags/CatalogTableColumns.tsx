import { Eye, EyeOff, Sparkles, Trash2 } from "lucide-react";
import Image from "next/image";
import type { ArtworkWithRelations, DataTableColumn } from "@/types";
import { formatShortDate } from "@/utils";

interface CatalogTableColumnsProps {
	openLightbox: (images: string[], index?: number) => void;
	onToggleVisibility: (artwork: ArtworkWithRelations) => void;
	onDeleteArtwork: (artwork: ArtworkWithRelations) => void;
}

export function createCatalogTableColumns({
	openLightbox,
	onToggleVisibility,
	onDeleteArtwork,
}: CatalogTableColumnsProps): DataTableColumn<ArtworkWithRelations>[] {
	return [
		{
			key: "artwork",
			header: "Karya Seni",
			cell: (row) => {
				const mainImg = row.images_url?.[0] || "/placeholder-image.png";
				return (
					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={() => openLightbox(row.images_url || [mainImg], 0)}
							className="group relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-content/10 bg-surface-muted transition-transform hover:scale-105"
							title="Klik untuk memperbesar karya"
						>
							<Image
								src={mainImg}
								alt={row.title}
								fill
								className="object-cover"
								sizes="48px"
							/>
							<div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center text-white">
								<Eye className="h-4 w-4" />
							</div>
						</button>
						<div className="min-w-0">
							<p className="font-semibold text-content text-xs truncate max-w-[200px]">
								{row.title}
							</p>
							<p className="text-[11px] text-content-muted">
								Oleh:{" "}
								<span className="font-medium text-content">
									{row.artist?.name || "Artis"}
								</span>
							</p>
						</div>
					</div>
				);
			},
		},
		{
			key: "curation_status",
			header: "Kurasi Anti-AI",
			cell: (row) => {
				switch (row.curation_status) {
					case "approved":
						return (
							<span className="badge badge-xs badge-success text-white font-semibold flex items-center gap-1">
								<Sparkles className="h-3 w-3" />
								Lolos Kurasi
							</span>
						);
					case "rejected":
						return (
							<span className="badge badge-xs badge-error font-semibold">
								Ditolak
							</span>
						);
					default:
						return (
							<span className="badge badge-xs badge-warning font-semibold">
								Pending
							</span>
						);
				}
			},
		},
		{
			key: "visibility",
			header: "Visibilitas Feed",
			cell: (row) => {
				const isVisible = row.is_visible_on_feed;
				return (
					<span
						className={`badge badge-sm font-semibold ${
							isVisible
								? "badge-primary"
								: "badge-ghost border border-content/20 text-content-muted"
						}`}
					>
						{isVisible ? "Tayang di Feed" : "Disembunyikan (Takedown)"}
					</span>
				);
			},
		},
		{
			key: "created_at",
			header: "Diunggah",
			cell: (row) => (
				<span className="text-xs text-content-muted">
					{formatShortDate(row.created_at)}
				</span>
			),
		},
		{
			key: "actions",
			header: "Aksi Administrator",
			headerClassName: "text-right",
			cellClassName: "text-right",
			cell: (row) => {
				const isVisible = row.is_visible_on_feed;
				return (
					<div className="flex items-center justify-end gap-1.5">
						<button
							type="button"
							onClick={() => onToggleVisibility(row)}
							className={`btn btn-xs rounded-lg ${
								isVisible
									? "btn-outline btn-warning"
									: "btn-outline btn-success"
							}`}
							title={
								isVisible
									? "Sembunyikan karya dari feed publik (Takedown)"
									: "Pulihkan karya agar tayang kembali di feed"
							}
						>
							{isVisible ? (
								<>
									<EyeOff className="h-3.5 w-3.5 mr-1" />
									Takedown
								</>
							) : (
								<>
									<Eye className="h-3.5 w-3.5 mr-1" />
									Pulihkan
								</>
							)}
						</button>
						<button
							type="button"
							onClick={() => onDeleteArtwork(row)}
							className="btn btn-ghost btn-xs rounded-lg text-danger hover:bg-danger/10"
							title="Hapus karya permanen"
						>
							<Trash2 className="h-3.5 w-3.5 mr-1" />
							Hapus
						</button>
					</div>
				);
			},
		},
	];
}
