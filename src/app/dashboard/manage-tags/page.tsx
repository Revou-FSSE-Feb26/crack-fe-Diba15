"use client";

import {
	CheckCircle2,
	EyeOff,
	ImageIcon,
	Plus,
	RefreshCw,
	Sparkles,
	Tags,
} from "lucide-react";
import { useMemo, useState } from "react";

import AccessDenied from "@/components/dashboard/AccessDenied";
import { CatalogManagementTab } from "@/components/dashboard/manage-tags/CatalogManagementTab";
import { TagsManagementTab } from "@/components/dashboard/manage-tags/TagsManagementTab";
import Stat from "@/components/ui/Stat";
import { useAllTags, useArtworks } from "@/hooks/useArtworkQueries";
import { useUserStore } from "@/store/UserStore";

type ActiveTab = "tags" | "catalog";

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

	const [activeTab, setActiveTab] = useState<ActiveTab>("tags");
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
			<AccessDenied description="Halaman Manajemen Tag & Katalog hanya dapat diakses oleh Administrator platform TruBrush." />
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
							onClick={() => setIsCreateModalOpen(true)}
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
				<TagsManagementTab
					tagsList={tagsList}
					isLoading={isTagsLoading}
					isCreateModalOpen={isCreateModalOpen}
					onCloseCreateModal={() => setIsCreateModalOpen(false)}
				/>
			)}

			{/* Tab 2: Global Artwork Catalog & Takedown */}
			{activeTab === "catalog" && (
				<CatalogManagementTab
					artworksList={artworksList}
					isLoading={isArtworksLoading}
					hiddenCount={stats.hiddenArtworks}
				/>
			)}
		</div>
	);
}
