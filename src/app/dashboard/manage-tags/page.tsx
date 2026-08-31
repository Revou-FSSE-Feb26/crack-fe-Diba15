"use client";

import {
	CheckCircle2,
	EyeOff,
	ImageIcon,
	Plus,
	RefreshCw,
	Search,
	ShieldAlert,
	Sparkles,
	Tags,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

import TagFormModal from "@/components/dashboard/manage-tags/TagFormModal";
import DataTable from "@/components/ui/data-table/DataTable";
import Stat from "@/components/ui/Stat";
import {
	useAllTags,
	useArtworks,
	useCreateTag,
	useDeleteArtwork,
	useDeleteTag,
	useUpdateArtwork,
	useUpdateTag,
} from "@/hooks/useArtworkQueries";
import { usePagination, useResetPageOnChange } from "@/hooks/usePagination";
import { useLightboxStore } from "@/store/LightboxStore";
import { useModalStore } from "@/store/ModalStore";
import { useUserStore } from "@/store/UserStore";
import type { ArtworkWithRelations, Tag } from "@/types";
import { createCatalogTableColumns } from "@/utils/dashboard/manage-tags/catalogTableColumns";
import { createTagTableColumns } from "@/utils/dashboard/manage-tags/tagTableColumns";

type ActiveTab = "tags" | "catalog";
type CatalogVisibilityFilter = "all" | "visible" | "hidden";

export default function ManageTagsPage() {
	const { isAdmin } = useUserStore();
	const {
		data: tagsList = [],
		isLoading: isTagsLoading,
		isRefetching: isTagsRefetching,
		refetch: refetchTags,
	} = useAllTags();
	const {
		data: artworksList = [],
		isLoading: isArtworksLoading,
		isRefetching: isArtworksRefetching,
		refetch: refetchArtworks,
	} = useArtworks();

	const createTagMutation = useCreateTag();
	const updateTagMutation = useUpdateTag();
	const deleteTagMutation = useDeleteTag();
	const updateArtworkMutation = useUpdateArtwork();
	const deleteArtworkMutation = useDeleteArtwork();

	const { openModal } = useModalStore();
	const { openLightbox } = useLightboxStore();

	const [activeTab, setActiveTab] = useState<ActiveTab>("tags");
	const [tagSearch, setTagSearch] = useState("");
	const [catalogSearch, setCatalogSearch] = useState("");
	const [catalogFilter, setCatalogFilter] =
		useState<CatalogVisibilityFilter>("all");

	// Tag modal state
	const [isTagModalOpen, setIsTagModalOpen] = useState(false);
	const [tagToEdit, setTagToEdit] = useState<Tag | null>(null);

	// Stats calculation
	const stats = useMemo(() => {
		const usedTags = tagsList.filter((t) => (t.count ?? 0) > 0);
		const hiddenArtworks = artworksList.filter((a) => !a.is_visible_on_feed);
		return {
			totalTags: tagsList.length,
			usedTags: usedTags.length,
			totalArtworks: artworksList.length,
			hiddenArtworks: hiddenArtworks.length,
		};
	}, [tagsList, artworksList]);

	// ─── Pagination for Tags ──────────────────────────────────────────────────
	const {
		setPage: setTagPage,
		setPerPage: setTagPerPage,
		paginate: paginateTags,
		resetPage: resetTagPage,
	} = usePagination({ initialPerPage: 10 });

	useResetPageOnChange(resetTagPage, [tagSearch]);

	const filteredTags = useMemo(() => {
		const query = tagSearch.trim().toLowerCase();
		if (!query) return tagsList;
		return tagsList.filter(
			(t) =>
				t.tag_name.toLowerCase().includes(query) ||
				t.id.toLowerCase().includes(query),
		);
	}, [tagsList, tagSearch]);

	const paginatedTags = useMemo(
		() => paginateTags(filteredTags),
		[filteredTags, paginateTags],
	);

	// ─── Pagination for Catalog ───────────────────────────────────────────────
	const {
		setPage: setCatalogPage,
		setPerPage: setCatalogPerPage,
		paginate: paginateCatalog,
		resetPage: resetCatalogPage,
	} = usePagination({ initialPerPage: 10 });

	useResetPageOnChange(resetCatalogPage, [catalogSearch, catalogFilter]);

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
		() => paginateCatalog(filteredCatalog),
		[filteredCatalog, paginateCatalog],
	);

	// ─── Handlers for Tags ────────────────────────────────────────────────────
	const handleOpenCreateTag = useCallback(() => {
		setTagToEdit(null);
		setIsTagModalOpen(true);
	}, []);

	const handleOpenEditTag = useCallback((tag: Tag) => {
		setTagToEdit(tag);
		setIsTagModalOpen(true);
	}, []);

	const handleSubmitTag = (tagName: string) => {
		if (tagToEdit) {
			updateTagMutation.mutate(
				{ id: tagToEdit.id, payload: { tagName } },
				{
					onSuccess: () => {
						setIsTagModalOpen(false);
						setTagToEdit(null);
					},
				},
			);
		} else {
			createTagMutation.mutate(
				{ tagName },
				{
					onSuccess: () => {
						setIsTagModalOpen(false);
					},
				},
			);
		}
	};

	const handleDeleteTag = useCallback(
		(tag: Tag) => {
			const count = tag.count ?? 0;
			const warningExtra =
				count > 0
					? ` Tag ini saat ini masih digunakan pada ${count} karya seni. Menghapusnya akan melepaskan tag ini dari karya tersebut.`
					: "";

			openModal({
				title: `Hapus Tag "${tag.tag_name}"?`,
				description: `Apakah Anda yakin ingin menghapus tag #${tag.tag_name} dari database?${warningExtra}`,
				type: "confirm",
				variant: "danger",
				confirmLabel: "Hapus Tag",
				cancelLabel: "Batal",
				onConfirm: () => {
					deleteTagMutation.mutate(tag.id);
				},
			});
		},
		[openModal, deleteTagMutation],
	);

	// ─── Handlers for Catalog ─────────────────────────────────────────────────
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
				description: `Tindakan ini akan menghapus karya seni secara permanen dari basis data dan tidak dapat dibatalkan.`,
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

	const tagColumns = useMemo(
		() =>
			createTagTableColumns({
				onEdit: handleOpenEditTag,
				onDelete: handleDeleteTag,
			}),
		[handleDeleteTag, handleOpenEditTag],
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

	const handleRefresh = () => {
		if (activeTab === "tags") {
			refetchTags();
		} else {
			refetchArtworks();
		}
	};

	const isRefetching = isTagsRefetching || isArtworksRefetching;
	const isLoading = isTagsLoading || isArtworksLoading;

	if (!isAdmin()) {
		return (
			<div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
				<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10 text-danger">
					<ShieldAlert className="h-8 w-8" />
				</div>
				<h1 className="text-xl font-bold text-content">Akses Dibatasi</h1>
				<p className="max-w-sm text-xs text-content-muted">
					Halaman Manajemen Tag & Katalog hanya dapat diakses oleh Administrator
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
						Manajemen Tag & Katalog Karya
					</h1>
					<p className="text-xs text-content-muted">
						Kelola master tag kategori seni dan pengawasan katalog karya
						terpublikasi platform.
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-2 print:hidden">
					{activeTab === "tags" && (
						<button
							type="button"
							className="btn btn-primary btn-sm"
							onClick={handleOpenCreateTag}
						>
							<Plus className="h-4 w-4 mr-1" />
							Tambah Master Tag
						</button>
					)}

					<button
						type="button"
						className="btn btn-outline btn-sm"
						onClick={handleRefresh}
						disabled={isLoading || isRefetching}
						title="Segarkan data"
					>
						<RefreshCw
							className={`h-4 w-4 mr-1 ${isRefetching ? "animate-spin" : ""}`}
						/>
						Segarkan
					</button>
				</div>
			</div>

			{/* KPI Summary Cards (2 Rows x 2 Columns) */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Stat
					variant="card"
					label="Total Master Tag"
					value={
						isTagsLoading ? (
							<span className="loading loading-dots loading-sm" />
						) : (
							`${stats.totalTags} Tag`
						)
					}
					icon={Tags}
				/>
				<Stat
					variant="card"
					label="Tag Aktif Digunakan"
					value={
						isTagsLoading ? (
							<span className="loading loading-dots loading-sm" />
						) : (
							`${stats.usedTags} Tag`
						)
					}
					icon={CheckCircle2}
				/>
				<Stat
					variant="card"
					label="Total Karya Terdaftar"
					value={
						isArtworksLoading ? (
							<span className="loading loading-dots loading-sm" />
						) : (
							`${stats.totalArtworks} Karya`
						)
					}
					icon={ImageIcon}
				/>
				<Stat
					variant="card"
					label="Karya di-Takedown / Tersembunyi"
					value={
						isArtworksLoading ? (
							<span className="loading loading-dots loading-sm" />
						) : (
							`${stats.hiddenArtworks} Karya`
						)
					}
					icon={EyeOff}
				/>
			</div>

			{/* Tabs Switcher */}
			<div className="flex items-center gap-2 border-b border-content/10 pb-2">
				<button
					type="button"
					onClick={() => setActiveTab("tags")}
					className={`btn btn-sm rounded-xl transition-all ${
						activeTab === "tags"
							? "btn-primary"
							: "btn-ghost text-content-muted hover:text-content"
					}`}
				>
					<Tags className="h-4 w-4 mr-1" />
					Master Tag ({tagsList.length})
				</button>
				<button
					type="button"
					onClick={() => setActiveTab("catalog")}
					className={`btn btn-sm rounded-xl transition-all ${
						activeTab === "catalog"
							? "btn-primary"
							: "btn-ghost text-content-muted hover:text-content"
					}`}
				>
					<Sparkles className="h-4 w-4 mr-1" />
					Katalog Karya Global ({artworksList.length})
				</button>
			</div>

			{/* Tab 1: Master Tags Management */}
			{activeTab === "tags" && (
				<div className="space-y-4">
					{/* Filter Toolbar */}
					<div className="rounded-2xl border border-content/10 bg-surface p-4 space-y-3 print:hidden">
						<div className="relative w-full max-w-md">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-muted" />
							<input
								type="text"
								value={tagSearch}
								onChange={(event) => setTagSearch(event.target.value)}
								placeholder="Cari nama tag atau ID..."
								className="input input-sm w-full pl-9 bg-background border-content/10 text-xs"
							/>
						</div>
					</div>

					{/* Tags Table */}
					<div className="rounded-2xl border border-content/10 bg-surface overflow-hidden">
						<DataTable
							columns={tagColumns}
							pagination={paginatedTags}
							getRowKey={(row) => row.id}
							isLoading={isTagsLoading}
							onPageChange={setTagPage}
							onPerPageChange={setTagPerPage}
							itemLabel="tag"
							emptyState={
								<div className="flex flex-col items-center justify-center py-12 text-center">
									<Tags className="h-10 w-10 text-content-muted mb-2 opacity-40" />
									<p className="text-sm font-semibold text-content">
										Tidak Ada Tag Ditemukan
									</p>
									<p className="text-xs text-content-muted mt-1 max-w-xs">
										Belum ada tag yang cocok dengan kata kunci pencarian Anda.
									</p>
								</div>
							}
						/>
					</div>
				</div>
			)}

			{/* Tab 2: Global Artwork Catalog & Takedown */}
			{activeTab === "catalog" && (
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
										label: `Disembunyikan / Takedown (${stats.hiddenArtworks})`,
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
							isLoading={isArtworksLoading}
							onPageChange={setCatalogPage}
							onPerPageChange={setCatalogPerPage}
							itemLabel="karya seni"
							emptyState={
								<div className="flex flex-col items-center justify-center py-12 text-center">
									<ImageIcon className="h-10 w-10 text-content-muted mb-2 opacity-40" />
									<p className="text-sm font-semibold text-content">
										Tidak Ada Karya Seni Ditemukan
									</p>
									<p className="text-xs text-content-muted mt-1 max-w-xs">
										Tidak ada karya seni yang sesuai dengan filter pencarian
										saat ini.
									</p>
								</div>
							}
						/>
					</div>
				</div>
			)}

			{/* Tag Form Modal (Create / Edit) */}
			<TagFormModal
				isOpen={isTagModalOpen}
				tagToEdit={tagToEdit}
				isLoading={createTagMutation.isPending || updateTagMutation.isPending}
				onClose={() => {
					setIsTagModalOpen(false);
					setTagToEdit(null);
				}}
				onSubmit={handleSubmitTag}
			/>
		</div>
	);
}
