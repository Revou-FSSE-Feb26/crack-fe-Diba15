"use client";

import { ImageIcon, Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import DataTable from "@/components/ui/data-table/DataTable";
import { useDeleteArtwork, useUpdateArtwork } from "@/hooks/useArtworkQueries";
import { usePagination, useResetPageOnChange } from "@/hooks/usePagination";
import { useLightboxStore } from "@/store/LightboxStore";
import { useModalStore } from "@/store/ModalStore";
import type { ArtworkWithRelations } from "@/types";
import { createCatalogTableColumns } from "@/utils/dashboard/manage-tags/catalogTableColumns";

type CatalogVisibilityFilter = "all" | "visible" | "hidden";

interface CatalogManagementTabProps {
	artworksList: ArtworkWithRelations[];
	isLoading: boolean;
	hiddenCount: number;
}

export function CatalogManagementTab({
	artworksList,
	isLoading,
	hiddenCount,
}: CatalogManagementTabProps) {
	const { openModal } = useModalStore();
	const { openLightbox } = useLightboxStore();
	const updateArtworkMutation = useUpdateArtwork();
	const deleteArtworkMutation = useDeleteArtwork();

	const [catalogSearch, setCatalogSearch] = useState("");
	const [catalogFilter, setCatalogFilter] =
		useState<CatalogVisibilityFilter>("all");

	const { setPage, setPerPage, paginate, resetPage } = usePagination({
		initialPerPage: 10,
	});

	useResetPageOnChange(resetPage, [catalogSearch, catalogFilter]);

	const filteredCatalog = useMemo(() => {
		const query = catalogSearch.trim().toLowerCase();
		let list = artworksList;

		if (catalogFilter === "visible") {
			list = list.filter((a) => a.is_visible_on_feed);
		} else if (catalogFilter === "hidden") {
			list = list.filter((a) => !a.is_visible_on_feed);
		}

		if (query) {
			list = list.filter(
				(a) =>
					a.title.toLowerCase().includes(query) ||
					a.artist?.name?.toLowerCase().includes(query) ||
					a.id.toLowerCase().includes(query),
			);
		}

		return list;
	}, [artworksList, catalogSearch, catalogFilter]);

	const paginatedCatalog = useMemo(
		() => paginate(filteredCatalog),
		[filteredCatalog, paginate],
	);

	const handleToggleVisibility = useCallback(
		(artwork: ArtworkWithRelations) => {
			const willHide = artwork.is_visible_on_feed;
			const actionTitle = willHide
				? "Takedown Karya?"
				: "Pulihkan Karya ke Feed?";
			const actionDesc = willHide
				? `Apakah Anda yakin ingin menyembunyikan karya "${artwork.title}" dari feed publik? Karya ini tidak akan muncul dalam pencarian atau beranda publik.`
				: `Apakah Anda yakin ingin memulihkan karya "${artwork.title}" agar kembali dapat dilihat di feed publik?`;

			openModal({
				title: actionTitle,
				description: actionDesc,
				type: "confirm",
				variant: willHide ? "danger" : "default",
				confirmLabel: willHide ? "Takedown Karya" : "Pulihkan Karya",
				cancelLabel: "Batal",
				onConfirm: () => {
					updateArtworkMutation.mutate({
						id: artwork.id,
						isVisibleOnFeed: !willHide,
					});
				},
			});
		},
		[openModal, updateArtworkMutation],
	);

	const handleDeleteArtwork = useCallback(
		(artwork: ArtworkWithRelations) => {
			openModal({
				title: `Hapus Permanen "${artwork.title}"?`,
				description:
					"Tindakan ini akan menghapus karya seni secara permanen dari basis data dan tidak dapat dibatalkan.",
				type: "confirm",
				variant: "danger",
				confirmLabel: "Hapus Permanen",
				cancelLabel: "Batal",
				onConfirm: () => {
					deleteArtworkMutation.mutate(artwork.id);
				},
			});
		},
		[openModal, deleteArtworkMutation],
	);

	const catalogColumns = useMemo(
		() =>
			createCatalogTableColumns({
				openLightbox,
				onToggleVisibility: handleToggleVisibility,
				onDeleteArtwork: handleDeleteArtwork,
			}),
		[handleDeleteArtwork, handleToggleVisibility, openLightbox],
	);

	return (
		<div className="space-y-4">
			{/* Filter Toolbar */}
			<div className="rounded-2xl border border-content/10 bg-surface p-4 space-y-3 print:hidden">
				<div className="relative w-full max-w-md">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-muted" />
					<input
						type="text"
						value={catalogSearch}
						onChange={(event) => setCatalogSearch(event.target.value)}
						placeholder="Cari judul karya seni, nama artis, ID..."
						className="input input-sm w-full pl-9 bg-background border-content/10 text-xs"
					/>
				</div>

				{/* Visibility Filter Presets */}
				<div className="flex flex-wrap items-center gap-2 pt-2 border-t border-content/5">
					<span className="text-xs font-semibold text-content-muted mr-1">
						Status Feed:
					</span>
					{(
						[
							{ id: "all", label: `Semua (${artworksList.length})` },
							{
								id: "visible",
								label: `Tayang di Feed (${
									artworksList.filter((a) => a.is_visible_on_feed).length
								})`,
							},
							{
								id: "hidden",
								label: `Disembunyikan / Takedown (${hiddenCount})`,
							},
						] as const
					).map((preset) => (
						<button
							key={preset.id}
							type="button"
							onClick={() =>
								setCatalogFilter(preset.id as CatalogVisibilityFilter)
							}
							className={`btn btn-xs rounded-lg ${
								catalogFilter === preset.id
									? "btn-primary"
									: "btn-ghost border border-content/10"
							}`}
						>
							{preset.label}
						</button>
					))}
				</div>
			</div>

			{/* Catalog Table */}
			<div className="rounded-2xl border border-content/10 bg-surface overflow-hidden">
				<DataTable
					columns={catalogColumns}
					pagination={paginatedCatalog}
					getRowKey={(row) => row.id}
					isLoading={isLoading}
					onPageChange={setPage}
					onPerPageChange={setPerPage}
					itemLabel="karya seni"
					emptyState={
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<ImageIcon className="h-10 w-10 text-content-muted mb-2 opacity-40" />
							<p className="text-sm font-semibold text-content">
								Tidak Ada Karya Seni Ditemukan
							</p>
							<p className="text-xs text-content-muted mt-1 max-w-xs">
								Tidak ada karya seni yang sesuai dengan filter pencarian saat
								ini.
							</p>
						</div>
					}
				/>
			</div>
		</div>
	);
}
