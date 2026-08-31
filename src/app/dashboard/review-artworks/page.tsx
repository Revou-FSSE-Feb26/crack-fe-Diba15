"use client";

import {
	CheckCircle2,
	Clock3,
	History,
	ImageIcon,
	RefreshCw,
	Search,
	XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

import AccessDenied from "@/components/dashboard/AccessDenied";
import ArtworkReviewCard from "@/components/dashboard/review-artworks/ArtworkReviewCard";
import RejectArtworkModal from "@/components/dashboard/review-artworks/RejectArtworkModal";
import Stat from "@/components/ui/Stat";
import {
	useCurateArtwork,
	usePendingArtworks,
} from "@/hooks/useArtworkQueries";
import { useModalStore } from "@/store/ModalStore";
import { useToastStore } from "@/store/ToastStore";
import { useUserStore } from "@/store/UserStore";
import type { ArtworkWithRelations } from "@/types";
import { formatShortDate } from "@/utils";
import { buildArtworkWithRelations } from "@/utils/search";

type ViewTab = "pending" | "recent" | "all";

export default function ReviewArtworksPage() {
	const { user, isCurator } = useUserStore();
	const { openModal } = useModalStore();
	const { addToast } = useToastStore();

	const [search, setSearch] = useState("");
	const [activeTab, setActiveTab] = useState<ViewTab>("pending");
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

	const getReviewerName = (reviewerId?: string | null) => {
		if (!reviewerId) return "Kurator";
		if (user && user.id === reviewerId) return user.name;
		return "Kurator";
	};

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

				{/* KPI Summary Cards (2 Rows x 2 Columns) */}
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<Stat
						variant="card"
						label="Menunggu Kurasi"
						value={
							isLoading ? (
								<span className="loading loading-dots loading-sm" />
							) : (
								`${counts.pending} Karya`
							)
						}
						icon={Clock3}
					/>
					<Stat
						variant="card"
						label="Lolos Verifikasi (Disetujui)"
						value={
							isLoading ? (
								<span className="loading loading-dots loading-sm" />
							) : (
								`${counts.approved} Karya`
							)
						}
						icon={CheckCircle2}
					/>
					<Stat
						variant="card"
						label="Ditolak (Pelanggaran/AI)"
						value={
							isLoading ? (
								<span className="loading loading-dots loading-sm" />
							) : (
								`${counts.rejected} Karya`
							)
						}
						icon={XCircle}
					/>
					<Stat
						variant="card"
						label="Total Antrian Masuk"
						value={
							isLoading ? (
								<span className="loading loading-dots loading-sm" />
							) : (
								`${counts.total} Karya`
							)
						}
						icon={ImageIcon}
					/>
				</div>

				{/* Filter Toolbar */}
				<div className="rounded-2xl border border-content/10 bg-surface p-4 space-y-3 print:hidden">
					{/* Search Box */}
					<div className="relative w-full max-w-md">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-muted" />
						<input
							type="text"
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Cari judul, nama artist, atau tag karya..."
							className="input input-sm w-full pl-9 bg-background border-content/10 text-xs"
						/>
					</div>

					{/* View Tabs */}
					<div className="flex flex-wrap items-center gap-2 pt-2 border-t border-content/5">
						<span className="text-xs font-semibold text-content-muted mr-1">
							Tampilan:
						</span>
						<button
							type="button"
							onClick={() => setActiveTab("pending")}
							className={`btn btn-xs rounded-lg ${
								activeTab === "pending"
									? "btn-primary"
									: "btn-ghost border border-content/10"
							}`}
						>
							Menunggu Kurasi ({counts.pending})
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("recent")}
							className={`btn btn-xs rounded-lg ${
								activeTab === "recent"
									? "btn-primary"
									: "btn-ghost border border-content/10"
							}`}
						>
							Riwayat Keputusan ({recentReviews.length})
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("all")}
							className={`btn btn-xs rounded-lg ${
								activeTab === "all"
									? "btn-primary"
									: "btn-ghost border border-content/10"
							}`}
						>
							Semua ({counts.total})
						</button>
					</div>
				</div>

				{/* Pending Queue Section */}
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
									<p className="text-xs">Memuat antrean pending...</p>
								</div>
							) : pendingArtworks.length === 0 ? (
								<div className="flex flex-col items-center justify-center py-12 text-center">
									<CheckCircle2 className="h-10 w-10 text-verified mb-2 opacity-60" />
									<p className="text-sm font-semibold text-content">
										Antrean Kurasi Bersih
									</p>
									<p className="text-xs text-content-muted mt-1 max-w-xs">
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

				{/* Recent Reviews History Section */}
				{(activeTab === "recent" || activeTab === "all") && (
					<div className="rounded-2xl border border-content/10 bg-surface overflow-hidden">
						<div className="border-b border-content/10 px-5 py-3.5 flex items-center justify-between">
							<div>
								<h2 className="text-sm font-bold text-content">
									Riwayat Keputusan Kurasi
								</h2>
								<p className="text-xs text-content-muted">
									Daftar karya yang telah selesai ditinjau beserta catatan
									kurator.
								</p>
							</div>
							<History className="h-4 w-4 text-content-muted" />
						</div>

						<div className="p-5">
							{recentReviews.length === 0 ? (
								<div className="flex flex-col items-center justify-center py-10 text-center">
									<History className="h-8 w-8 text-content-muted mb-2 opacity-50" />
									<p className="text-xs font-semibold text-content">
										Belum ada riwayat review
									</p>
								</div>
							) : (
								<div className="divide-y divide-content/10">
									{recentReviews.map((artwork) => (
										<div
											key={artwork.id}
											className="flex flex-col gap-2 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between"
										>
											<div className="space-y-1">
												<div className="flex flex-wrap items-center gap-2">
													<p className="font-semibold text-sm text-content">
														{artwork.title}
													</p>
													<span
														className={`badge badge-sm uppercase font-bold ${
															artwork.curation_status === "approved"
																? "badge-success"
																: "badge-error"
														}`}
													>
														{artwork.curation_status === "approved"
															? "Disetujui"
															: "Ditolak"}
													</span>
												</div>
												<p className="text-xs text-content-muted">
													{artwork.artist.name} · Ditinjau pada{" "}
													{formatShortDate(artwork.reviewed_at ?? "")} · Oleh{" "}
													<span className="text-content font-medium">
														{getReviewerName(artwork.reviewed_by)}
													</span>
												</p>
												{artwork.curation_status === "rejected" &&
													artwork.rejection_reason && (
														<p className="mt-2 rounded-xl border border-danger/20 bg-danger/5 px-3 py-2 text-xs leading-relaxed text-danger">
															<span className="font-semibold block mb-0.5">
																Alasan Penolakan:
															</span>
															{artwork.rejection_reason}
														</p>
													)}
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				)}
			</div>

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
