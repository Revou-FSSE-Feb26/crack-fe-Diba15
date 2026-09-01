import { History } from "lucide-react";
import type { ArtworkWithRelations } from "@/types";
import { formatShortDate } from "@/utils";

interface RecentArtworksReviewListProps {
	recentReviews: ArtworkWithRelations[];
	currentUserId?: string;
	currentUserName?: string;
}

export function RecentArtworksReviewList({
	recentReviews,
	currentUserId,
	currentUserName,
}: RecentArtworksReviewListProps) {
	const getReviewerName = (reviewerId?: string | null) => {
		if (!reviewerId) return "Kurator";
		if (currentUserId && currentUserId === reviewerId) {
			return currentUserName || "Kurator";
		}
		return "Kurator";
	};

	return (
		<div className="rounded-2xl border border-content/10 bg-surface overflow-hidden">
			<div className="border-b border-content/10 px-5 py-3.5 flex items-center justify-between">
				<div>
					<h2 className="text-sm font-bold text-content">
						Riwayat Keputusan Kurasi
					</h2>
					<p className="text-xs text-content-muted">
						Daftar karya yang telah selesai ditinjau beserta catatan kurator.
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
	);
}
