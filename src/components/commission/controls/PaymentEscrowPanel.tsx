import { CreditCard } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/utils";

interface PaymentEscrowPanelProps {
	commissionId: string;
	price: number;
	isArtistView: boolean;
}

export default function PaymentEscrowPanel({
	commissionId,
	price,
	isArtistView,
}: PaymentEscrowPanelProps) {
	if (!isArtistView) {
		return (
			<div className="p-4 bg-primary/5 rounded-xl border border-primary/20 space-y-3">
				<p className="text-sm font-semibold text-content">
					Artis telah menerima pesanan komisi Anda! 🎉
				</p>
				<p className="text-xs text-content-muted">
					Silakan lakukan pembayaran sebesar {formatPrice(price)} (via E-Wallet
					/ Kartu Kredit) untuk memulai pengerjaan karya. Dana Anda akan
					diamankan di Escrow.
				</p>
				<Link
					href={`/commissions/${commissionId}/payment`}
					className="flex items-center gap-2 w-full justify-center text-sm font-semibold rounded-xl bg-primary px-4 py-2.5 text-background hover:bg-primary-hover transition-colors shadow-sm"
				>
					<CreditCard className="w-4 h-4" />
					Bayar Komisi ({formatPrice(price)})
				</Link>
			</div>
		);
	}

	return (
		<div className="p-4 bg-surface rounded-xl border border-content/10 space-y-2">
			<p className="text-sm text-content font-medium">
				Anda telah menerima pesanan komisi ini.
			</p>
			<p className="text-xs text-content-muted">
				Menunggu Client menyelesaikan pembayaran sebesar {formatPrice(price)}{" "}
				sebelum Anda dapat mengunggah progress karya.
			</p>
		</div>
	);
}
