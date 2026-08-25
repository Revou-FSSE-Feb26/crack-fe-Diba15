import { Download } from "lucide-react";
import Link from "next/link";
import ProofPreview from "@/components/commission/ProofPreview";
import type { Commission, CommissionProgress, DisputeLog } from "@/types";
import { formatPrice } from "@/utils";

interface CommissionDeliverablesProps {
	commission: Commission;
	progressItem: CommissionProgress | null;
	commissionDispute: DisputeLog | null;
	isArtistView: boolean;
}

export default function CommissionDeliverables({
	commission,
	progressItem,
	commissionDispute,
	isArtistView,
}: CommissionDeliverablesProps) {
	const isDisputeApproved = commissionDispute?.status === "approved";

	return (
		<div className="space-y-3">
			{/* Artwork Preview Section */}
			<div className="grid gap-3 sm:grid-cols-2">
				<ProofPreview
					title="WIP Proof"
					src={
						!isArtistView && isDisputeApproved ? null : progressItem?.sketch_url
					}
					empty={
						!isArtistView && isDisputeApproved
							? "WIP proof tidak dapat diakses karena sengketa disetujui."
							: "Artist belum upload WIP proof."
					}
				/>
				<ProofPreview
					title="Preview Final"
					src={
						!isArtistView && isDisputeApproved
							? null
							: progressItem?.final_artwork_url
					}
					empty={
						!isArtistView && isDisputeApproved
							? "Hasil tidak dapat diakses karena sengketa disetujui."
							: "Final artwork belum tersedia."
					}
				/>
			</div>

			{/* Completed Commission: Final Deliverable Download Card */}
			{commission.status === "completed" &&
				(progressItem?.final_file_url || progressItem?.final_artwork_url) && (
					<div className="p-4 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl border border-emerald-500/30 space-y-3">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
									<Download className="w-5 h-5" />
								</div>
								<div>
									<p className="font-bold text-sm text-content">
										Berkas Karya Asli (Deliverable Final)
									</p>
									<p className="text-xs text-content-muted">
										Komisi ini telah selesai dan saldo Escrow sebesar{" "}
										{formatPrice(commission.price)} telah dicairkan ke Artis.
										Berkas mentah/arsip hasil karya siap diunduh.
									</p>
								</div>
							</div>
							<Link
								href={
									progressItem?.final_file_url ||
									progressItem?.final_artwork_url ||
									"#"
								}
								target="_blank"
								rel="noopener noreferrer"
								download
								className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors shrink-0 flex items-center justify-center gap-1.5 shadow-sm"
							>
								<Download className="w-4 h-4" />
								Unduh Berkas Akhir
							</Link>
						</div>
					</div>
				)}
		</div>
	);
}
