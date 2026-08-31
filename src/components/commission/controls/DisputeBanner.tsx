import { AlertTriangle, XCircle } from "lucide-react";
import type { DisputeLog } from "@/types";
import { formatPrice } from "@/utils";

interface DisputeBannerProps {
	commissionStatus: string;
	commissionPrice: number;
	paymentMethod?: string;
	cardLastFour?: string;
	commissionDispute: DisputeLog | null;
	isArtistView: boolean;
}

export default function DisputeBanner({
	commissionStatus,
	commissionPrice,
	paymentMethod,
	cardLastFour,
	commissionDispute,
	isArtistView,
}: DisputeBannerProps) {
	if (commissionDispute) {
		return (
			<div
				className={`rounded-xl border p-4 text-xs leading-relaxed ${
					commissionDispute.status === "pending"
						? "bg-premium/10 border-premium/30 text-premium"
						: commissionDispute.status === "approved"
							? "bg-verified/10 border-verified/30 text-verified"
							: "bg-content/5 border-content/10 text-content-muted"
				}`}
			>
				<div className="flex items-center gap-1.5 font-bold mb-1">
					<AlertTriangle className="w-4 h-4 shrink-0" />
					<span>
						{commissionDispute.status === "pending" &&
							"Komisi dalam Sengketa (Dispute)"}
						{commissionDispute.status === "approved" &&
							"Sengketa Disetujui Kurator"}
						{commissionDispute.status === "rejected" &&
							"Sengketa Ditolak Kurator"}
					</span>
				</div>
				<p className="font-semibold text-content mb-1">
					Alasan dispute: &ldquo;{commissionDispute.reason}&rdquo;
				</p>
				<p className="text-content-muted mt-1">
					{commissionDispute.status === "pending" &&
						"Laporan sengketa sedang ditinjau oleh Kurator TruBrush. Keputusan sengketa bersifat mutlak."}
					{commissionDispute.status === "approved" &&
						(paymentMethod === "wallet"
							? isArtistView
								? `Dana sebesar ${formatPrice(commissionPrice)} telah di-refund ke saldo E-Wallet Klien.`
								: `Dana sebesar ${formatPrice(commissionPrice)} telah di-refund ke saldo E-Wallet Anda.`
							: isArtistView
								? `Dana sebesar ${formatPrice(commissionPrice)} telah di-refund ke kartu kredit Klien (berakhir di ${cardLastFour ?? "••••"}).`
								: `Dana sebesar ${formatPrice(commissionPrice)} telah di-refund ke kartu kredit Anda (berakhir di ${cardLastFour ?? "••••"}).`)}
					{commissionDispute.status === "rejected" &&
						(isArtistView
							? `Dana sebesar ${formatPrice(commissionPrice)} telah dilepaskan ke dompet E-Wallet Anda karena dispute ditolak.`
							: `Dana sebesar ${formatPrice(commissionPrice)} telah dilepaskan ke dompet Artist karena dispute ditolak.`)}
				</p>
			</div>
		);
	}

	if (commissionStatus === "cancelled") {
		return (
			<div className="p-4 bg-danger/10 rounded-xl border border-danger/20 space-y-1">
				<div className="flex items-center gap-1.5 font-bold text-xs text-danger">
					<XCircle className="w-4 h-4 shrink-0" />
					<span>Pesanan Komisi Dibatalkan</span>
				</div>
				<p className="text-xs text-content-muted">
					Pesanan komisi ini telah dibatalkan.
				</p>
			</div>
		);
	}

	return null;
}
