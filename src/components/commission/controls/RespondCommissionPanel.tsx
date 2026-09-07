import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/utils";

interface RespondCommissionPanelProps {
	price: number;
	isArtistView: boolean;
	onRespond: (status: "accepted" | "cancelled", title: string) => void;
	isResponding?: boolean;
}

export default function RespondCommissionPanel({
	price,
	isArtistView,
	onRespond,
	isResponding = false,
}: RespondCommissionPanelProps) {
	if (isArtistView) {
		return (
			<div className="p-4 bg-primary/5 rounded-xl border border-primary/20 space-y-3">
				<p className="text-sm font-semibold text-content">
					Client mengajukan komisi sebesar {formatPrice(price)}.
				</p>
				<p className="text-xs text-content-muted">
					Saldo Client belum dipotong. Terima pesanan ini untuk mengizinkan
					Client melakukan pembayaran.
				</p>
				<div className="flex gap-2">
					<Button
						disabled={isResponding}
						className="flex items-center gap-1 flex-1 justify-center text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
						onClick={() => onRespond("accepted", "Terima komisi?")}
					>
						{isResponding ? (
							<>
								<Loader2 className="w-4 h-4 animate-spin mr-1" />
								Memproses...
							</>
						) : (
							<>
								<CheckCircle2 className="w-4 h-4 mr-1" />
								Terima Pesanan
							</>
						)}
					</Button>
					<Button
						variant="danger"
						disabled={isResponding}
						className="flex items-center gap-1 flex-1 justify-center text-sm disabled:opacity-60 disabled:cursor-not-allowed"
						onClick={() => onRespond("cancelled", "Tolak komisi?")}
					>
						<XCircle className="w-4 h-4 mr-1" />
						Tolak Pesanan
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="p-4 bg-surface rounded-xl border border-content/10 space-y-2">
			<p className="text-sm text-content font-medium">
				Pesanan komisi Anda sebesar {formatPrice(price)} telah diajukan ke
				Artis.
			</p>
			<p className="text-xs text-content-muted">
				Saldo Anda belum dipotong. Menunggu Artis meninjau & menerima pesanan
				sebelum Anda melakukan pembayaran.
			</p>
		</div>
	);
}
