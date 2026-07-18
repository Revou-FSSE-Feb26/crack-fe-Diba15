"use client";

import {
	CheckCircle2,
	Clock3,
	ImageIcon,
	Search,
	ShieldAlert,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import ArtworkReviewCard from "@/components/dashboard/review-artworks/ArtworkReviewCard";
import RejectArtworkModal from "@/components/dashboard/review-artworks/RejectArtworkModal";
import Stat from "@/components/ui/Stat";
import {
	useCurateArtwork,
	usePendingArtworks,
} from "@/hooks/useArtworkQueries";
import { useModalStore } from "@/store/ModalStore";
import { useToastStore } from "@/store/ToastStore";
import { useUserManagementStore } from "@/store/UserManagementStore";
import { useUserStore } from "@/store/UserStore";
import type { ArtworkWithRelations } from "@/types";
import { formatShortDate } from "@/utils";
import { buildArtworkWithRelations } from "@/utils/search";

export default function ReviewArtworksPage() {
	const { user, isCurator } = useUserStore();
	const { users } = useUserManagementStore();
	const { openModal } = useModalStore();
	const { addToast } = useToastStore();

	const [search, setSearch] = useState("");
	const [rejectTarget, setRejectTarget] = useState<ArtworkWithRelations | null>(
		null,
	);
	const [processingId, setProcessingId] = useState<string | null>(null);

	// Menggunakan TanStack Query v5 untuk mengambil antrean pending & melakukan kurasi
	const { data: artworks = [], isLoading } = usePendingArtworks();
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

	const recentReviews = useMemo(
		() =>
			artworksWithRelations
				.filter(
					(item) =>
						item.curation_status === "approved" ||
						item.curation_status === "rejected",
				)
				.filter((item) => item.reviewed_at)
				.sort(
					(a, b) =>
						new Date(b.reviewed_at || "").getTime() -
						new Date(a.reviewed_at || "").getTime(),
				)
				.slice(0, 5),
		[artworksWithRelations],
	);

	const getReviewerName = (reviewerId?: string | null) => {
		if (!reviewerId) return "Kurator";
		return users.find((item) => item.id === reviewerId)?.name ?? "Kurator";
	};

	const handleApprove = (artwork: ArtworkWithRelations) => {
		if (!user) return;

		openModal({
			title: "Setujui artwork?",
			description: `"${artwork.title}" akan ditampilkan di feed setelah disetujui.`,
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
					// biome-ignore lint/suspicious/noExplicitAny: error proxy casting
					const err = error as any;
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
			// biome-ignore lint/suspicious/noExplicitAny: error proxy casting
			const err = error as any;
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
			<div className="rounded-2xl border border-content/10 bg-surface p-6 text-center">
				<ShieldAlert className="mx-auto mb-3 h-10 w-10 text-danger" />
				<h1 className="font-heading text-2xl font-semibold text-content">
					Akses Kurator Diperlukan
				</h1>
				<p className="mt-2 text-sm text-content-muted">
					Halaman review artwork hanya tersedia untuk akun curator.
				</p>
				<Link
					href="/dashboard"
					className="mt-5 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-primary-hover"
				>
					Kembali ke Dashboard
				</Link>
			</div>
		);
	}

	return (
		<>
			<div className="space-y-4">
				<div className="grid gap-4 sm:grid-cols-3">
					<Stat
						variant="card"
						label="Menunggu Review"
						value={pendingArtworks.length}
						icon={Clock3}
					/>
					<Stat
						variant="card"
						label="Disetujui (total)"
						value={
							artworks.filter((item) => item.curation_status === "approved")
								.length
						}
						icon={CheckCircle2}
					/>
					<Stat
						variant="card"
						label="Ditolak (total)"
						value={
							artworks.filter((item) => item.curation_status === "rejected")
								.length
						}
						icon={XCircle}
					/>
				</div>

				<div className="rounded-2xl border border-content/10 bg-surface">
					<div className="flex flex-col gap-3 border-b border-content/10 p-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h2 className="font-heading text-lg font-semibold text-content">
								Antrian Pending
							</h2>
							<p className="text-sm text-content-muted">
								Hanya artwork dengan status pending yang meminta pemeriksaan
								kurator.
							</p>
						</div>
						<div className="relative w-full sm:max-w-sm">
							<Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-content-muted" />
							<input
								type="search"
								value={search}
								onChange={(event) => setSearch(event.target.value)}
								placeholder="Cari judul, artist, atau tag..."
								className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pr-4 pl-10 text-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#33658A] dark:border-gray-600 dark:bg-[#1D2D37] dark:focus:ring-[#86BBD8]"
							/>
						</div>
					</div>

					<div className="space-y-4 p-4">
						{isLoading ? (
							<div className="py-12 text-center text-content-muted">
								Memuat antrean pending...
							</div>
						) : pendingArtworks.length === 0 ? (
							<div className="rounded-xl border border-dashed border-content/15 px-4 py-12 text-center">
								<ImageIcon className="mx-auto mb-2 h-8 w-8 text-content-muted" />
								<p className="font-medium text-content">
									Tidak ada artwork pending
								</p>
								<p className="mt-1 text-sm text-content-muted">
									Semua antrian review sudah diproses. Karya baru akan muncul di
									sini setelah artist mengunggah dengan opsi pemeriksaan
									kurator.
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

				{recentReviews.length > 0 && (
					<div className="rounded-2xl border border-content/10 bg-surface p-4">
						<h2 className="font-heading text-lg font-semibold text-content">
							Riwayat Review Terbaru
						</h2>
						<p className="mt-1 text-sm text-content-muted">
							Keputusan kurator terakhir beserta alasan penolakan jika ada.
						</p>

						<div className="mt-4 divide-y divide-content/10">
							{recentReviews.map((artwork) => (
								<div
									key={artwork.id}
									className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between"
								>
									<div>
										<div className="flex flex-wrap items-center gap-2">
											<p className="font-medium text-content">
												{artwork.title}
											</p>
											<span
												className={[
													"rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
													artwork.curation_status === "approved"
														? "bg-verified/10 text-verified"
														: "bg-danger/10 text-danger",
												].join(" ")}
											>
												{artwork.curation_status === "approved"
													? "Disetujui"
													: "Ditolak"}
											</span>
										</div>
										<p className="mt-0.5 text-xs text-content-muted">
											{artwork.artist.name} ·{" "}
											{formatShortDate(artwork.reviewed_at ?? "")} ·{" "}
											{getReviewerName(artwork.reviewed_by)}
										</p>
										{artwork.curation_status === "rejected" &&
											artwork.rejection_reason && (
												<p className="mt-2 rounded-lg border border-danger/15 bg-danger/5 px-3 py-2 text-xs leading-relaxed text-danger">
													{artwork.rejection_reason}
												</p>
											)}
									</div>
								</div>
							))}
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
