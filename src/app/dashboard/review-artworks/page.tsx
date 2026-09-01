"use client";

import { RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";

import AccessDenied from "@/components/dashboard/AccessDenied";
import ArtworkReviewCard from "@/components/dashboard/review-artworks/ArtworkReviewCard";
import { RecentArtworksReviewList } from "@/components/dashboard/review-artworks/RecentArtworksReviewList";
import RejectArtworkModal from "@/components/dashboard/review-artworks/RejectArtworkModal";
import { ReviewArtworksStats } from "@/components/dashboard/review-artworks/ReviewArtworksStats";
import {
	type ReviewArtworksTab,
	ReviewArtworksToolbar,
} from "@/components/dashboard/review-artworks/ReviewArtworksToolbar";
import {
	useCurateArtwork,
	usePendingArtworks,
} from "@/hooks/useArtworkQueries";
import { useModalStore } from "@/store/ModalStore";
import { useToastStore } from "@/store/ToastStore";
import { useUserStore } from "@/store/UserStore";
import type { ArtworkWithRelations } from "@/types";
import { buildArtworkWithRelations } from "@/utils/search";

export default function ReviewArtworksPage() {
	const { user, isCurator } = useUserStore();
	const { openModal } = useModalStore();
	const { addToast } = useToastStore();

	const [search, setSearch] = useState("");
	const [activeTab, setActiveTab] = useState<ReviewArtworksTab>("pending");
	const [rejectTarget, setRejectTarget] = useState<ArtworkWithRelations | null>(
		null,
	);
	const [processingId, setProcessingId] = useState<string | null>(null);

	// TanStack Query v5 pending queue
	const {
		data: artworks = [],
		isLoading,
		isRefetching,
		refetch,
	} = usePendingArtworks();
	const curateMutation = useCurateArtwork();

	const artworksWithRelations = useMemo(
		() => buildArtworkWithRelations(artworks, [], []),
		[artworks],
	);

	const pendingArtworks = useMemo(() => {
		const query = search.trim().toLowerCase();

		return artworksWithRelations
			.filter((item) => item.curation_status === "pending")
			.filter((item) => {
				if (!query) return true;
				return (
					item.title.toLowerCase().includes(query) ||
					item.artist.name.toLowerCase().includes(query) ||
					item.tags.some((tag) => tag.tag_name.toLowerCase().includes(query))
				);
			})
			.sort(
				(a, b) =>
					new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
			);
	}, [artworksWithRelations, search]);

	const recentReviews = useMemo(() => {
		const query = search.trim().toLowerCase();

		return artworksWithRelations
			.filter(
				(item) =>
					item.curation_status === "approved" ||
					item.curation_status === "rejected",
			)
			.filter((item) => item.reviewed_at)
			.filter((item) => {
				if (!query) return true;
				return (
					item.title.toLowerCase().includes(query) ||
					item.artist.name.toLowerCase().includes(query) ||
					item.tags.some((tag) => tag.tag_name.toLowerCase().includes(query))
				);
			})
			.sort(
				(a, b) =>
					new Date(b.reviewed_at || "").getTime() -
					new Date(a.reviewed_at || "").getTime(),
			);
	}, [artworksWithRelations, search]);

	const counts = useMemo(() => {
		const approvedCount = artworks.filter(
			(item) => item.curation_status === "approved",
		).length;
		const rejectedCount = artworks.filter(
			(item) => item.curation_status === "rejected",
		).length;
		return {
			pending: pendingArtworks.length,
			approved: approvedCount,
			rejected: rejectedCount,
			total: artworks.length,
		};
	}, [artworks, pendingArtworks.length]);

	const handleApprove = (artwork: ArtworkWithRelations) => {
		if (!user) return;

		openModal({
			title: "Setujui artwork?",
			description: `"${artwork.title}" akan dipublikasikan ke feed platform setelah disetujui.`,
			type: "confirm",
			confirmLabel: "Setujui",
			cancelLabel: "Batal",
			onConfirm: async () => {
				setProcessingId(artwork.id);
				try {
					await curateMutation.mutateAsync({
						id: artwork.id,
						status: "approved",
					});
					addToast({
						message: `"${artwork.title}" berhasil disetujui dan tampil di feed.`,
						type: "success",
					});
				} catch (error: unknown) {
					const err = error as {
						response?: { data?: { message?: string } };
					};
					addToast({
						message: err.response?.data?.message || "Gagal menyetujui artwork.",
						type: "error",
					});
				} finally {
					setProcessingId(null);
				}
			},
		});
	};

	const handleRejectSubmit = async (reason: string) => {
		if (!user || !rejectTarget) return;

		setProcessingId(rejectTarget.id);
		try {
			await curateMutation.mutateAsync({
				id: rejectTarget.id,
				status: "rejected",
				reason,
			});
			addToast({
				message: `"${rejectTarget.title}" ditolak.`,
				type: "success",
			});
			setRejectTarget(null);
		} catch (error: unknown) {
			const err = error as {
				response?: { data?: { message?: string } };
			};
			addToast({
				message: err.response?.data?.message || "Gagal menolak artwork.",
				type: "error",
			});
		} finally {
			setProcessingId(null);
		}
	};

	if (!isCurator()) {
		return (
			<AccessDenied description="Halaman Review Artwork hanya dapat diakses oleh akun Kurator platform TruBrush." />
		);
	}

	return (
		<>
			<div className="space-y-6">
				{/* Page Header */}
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-2xl font-bold text-content">
							Kurasi Karya (Artwork Review)
						</h1>
						<p className="text-xs text-content-muted">
							Verifikasi keaslian karya manual anti-AI sebelum dipublikasikan ke
							feed komunitas platform.
						</p>
					</div>

					<div className="flex flex-wrap items-center gap-2 print:hidden">
						<button
							type="button"
							className="btn btn-outline btn-sm"
							onClick={() => refetch()}
							disabled={isLoading || isRefetching}
							title="Segarkan antrian karya"
						>
							<RefreshCw
								className={`h-4 w-4 mr-1 ${isRefetching ? "animate-spin" : ""}`}
							/>
							Segarkan
						</button>
					</div>
				</div>

				{/* 1. Summary Cards */}
				<ReviewArtworksStats counts={counts} isLoading={isLoading} />

				{/* 2. Filter Toolbar */}
				<ReviewArtworksToolbar
					search={search}
					onSearchChange={setSearch}
					activeTab={activeTab}
					onTabChange={setActiveTab}
					counts={{
						pending: counts.pending,
						recent: recentReviews.length,
						total: counts.total,
					}}
				/>

				{/* 3. Pending Queue Section */}
				{(activeTab === "pending" || activeTab === "all") && (
					<div className="rounded-2xl border border-content/10 bg-surface overflow-hidden">
						<div className="border-b border-content/10 px-5 py-3.5 flex items-center justify-between">
							<div>
								<h2 className="text-sm font-bold text-content">
									Antrian Menunggu Kurasi
								</h2>
								<p className="text-xs text-content-muted">
									Karya dengan status pending yang memerlukan verifikasi manual
									keaslian.
								</p>
							</div>
							<span className="badge badge-sm font-semibold badge-warning">
								{pendingArtworks.length} Pending
							</span>
						</div>

						<div className="p-5 space-y-4">
							{isLoading ? (
								<div className="flex flex-col items-center justify-center py-12 text-content-muted">
									<span className="loading loading-spinner loading-md text-primary mb-2" />
									<p className="text-xs">Memuat antrian kurasi karya...</p>
								</div>
							) : pendingArtworks.length === 0 ? (
								<div className="flex flex-col items-center justify-center py-12 text-center">
									<p className="text-sm font-semibold text-content">
										Antrian Kurasi Bersih! 🎉
									</p>
									<p className="text-xs text-content-muted mt-1 max-w-sm">
										Semua karya seni telah ditinjau. Karya baru akan muncul saat
										artis mengunggah karya dengan opsi pemeriksaan.
									</p>
								</div>
							) : (
								pendingArtworks.map((artwork) => (
									<ArtworkReviewCard
										key={artwork.id}
										artwork={artwork}
										onApprove={() => handleApprove(artwork)}
										onReject={() => setRejectTarget(artwork)}
										isProcessing={processingId === artwork.id}
									/>
								))
							)}
						</div>
					</div>
				)}

				{/* 4. Recent Reviews History Section */}
				{(activeTab === "recent" || activeTab === "all") && (
					<RecentArtworksReviewList
						recentReviews={recentReviews}
						currentUserId={user?.id}
						currentUserName={user?.name}
					/>
				)}
			</div>

			{/* Reject Modal */}
			{rejectTarget && (
				<RejectArtworkModal
					artworkTitle={rejectTarget.title}
					isOpen={!!rejectTarget}
					onClose={() => setRejectTarget(null)}
					onSubmit={handleRejectSubmit}
				/>
			)}
		</>
	);
}
