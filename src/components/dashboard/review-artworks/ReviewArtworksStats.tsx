import { CheckCircle2, Clock3, ImageIcon, XCircle } from "lucide-react";
import Stat from "@/components/ui/Stat";

interface ReviewArtworksStatsProps {
	counts: {
		pending: number;
		approved: number;
		rejected: number;
		total: number;
	};
	isLoading: boolean;
}

export function ReviewArtworksStats({
	counts,
	isLoading,
}: ReviewArtworksStatsProps) {
	return (
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
	);
}
