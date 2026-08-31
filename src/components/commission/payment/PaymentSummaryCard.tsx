import { Lock, ShieldCheck } from "lucide-react";
import AvatarInitials from "@/components/home/AvatarInitials";
import Button from "@/components/ui/Button";
import { formatDate, formatPrice } from "@/utils";

interface PaymentSummaryCardProps {
	artistName: string;
	commissionTitle: string;
	commissionDate: string;
	price: number;
	paymentMethod: "wallet" | "credit_card";
	isBalanceSufficient: boolean;
	isPending: boolean;
	onPayWallet: () => void;
	onPayCard: () => void;
}

export function PaymentSummaryCard({
	artistName,
	commissionTitle,
	commissionDate,
	price,
	paymentMethod,
	isBalanceSufficient,
	isPending,
	onPayWallet,
	onPayCard,
}: PaymentSummaryCardProps) {
	return (
		<div className="space-y-4">
			<h2 className="text-sm font-bold uppercase tracking-wider text-content-muted">
				Ringkasan Pesanan
			</h2>

			<div className="bg-surface border border-content/10 rounded-2xl p-5 space-y-5 shadow-sm">
				{/* Item info */}
				<div className="flex items-start gap-3 pb-4 border-b border-content/10">
					<AvatarInitials
						name={artistName}
						className="w-10 h-10 text-xs shrink-0"
					/>
					<div className="min-w-0 flex-1">
						<h3 className="font-bold text-sm sm:text-base text-content line-clamp-1">
							{commissionTitle}
						</h3>
						<p className="text-xs text-content-muted mt-0.5">
							Artis: <strong className="text-content">{artistName}</strong>
						</p>
						<p className="text-[11px] text-content-muted mt-1">
							Dipesan: {formatDate(commissionDate)}
						</p>
					</div>
				</div>

				{/* Invoice breakdown */}
				<div className="space-y-2.5 text-xs sm:text-sm">
					<div className="flex justify-between text-content-muted">
						<span>Harga Jasa Komisi</span>
						<span className="font-medium text-content">
							{formatPrice(price)}
						</span>
					</div>
					<div className="flex justify-between text-content-muted">
						<span>Biaya Layanan Escrow</span>
						<span className="font-semibold text-emerald-600 dark:text-emerald-400">
							Rp 0 (Gratis)
						</span>
					</div>

					<div className="pt-3 border-t border-content/10 flex justify-between items-baseline">
						<span className="font-bold text-sm text-content">
							Total Tagihan
						</span>
						<span className="font-heading text-xl font-bold text-primary">
							{formatPrice(price)}
						</span>
					</div>
				</div>

				{/* Escrow Guarantee Box */}
				<div className="p-3.5 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 rounded-xl border border-emerald-500/20 text-xs leading-relaxed space-y-1">
					<div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
						<ShieldCheck className="w-4 h-4 shrink-0" />
						<span>Jaminan Perlindungan Escrow TruBrush</span>
					</div>
					<p className="text-[11px] opacity-90">
						Dana Anda ditahan dengan aman di rekening penampung (Escrow) dan
						baru akan dicairkan ke Artis setelah Anda menyetujui hasil karya
						akhir.
					</p>
				</div>

				{/* Execution Pay Button */}
				{paymentMethod === "wallet" ? (
					<Button
						type="button"
						disabled={!isBalanceSufficient || isPending}
						onClick={onPayWallet}
						className="w-full py-3 justify-center text-sm font-semibold flex items-center gap-2 shadow-sm"
					>
						{isPending ? (
							<>Memproses Pembayaran Escrow...</>
						) : (
							<>
								<Lock className="w-4 h-4" />
								Bayar Komisi ({formatPrice(price)})
							</>
						)}
					</Button>
				) : (
					<Button
						type="button"
						disabled={isPending}
						onClick={onPayCard}
						className="w-full py-3 justify-center text-sm font-semibold flex items-center gap-2 shadow-sm"
					>
						{isPending ? (
							<>Memproses Transaksi Kartu...</>
						) : (
							<>
								<Lock className="w-4 h-4" />
								Bayar via Kartu ({formatPrice(price)})
							</>
						)}
					</Button>
				)}

				<p className="text-[10px] text-center text-content-muted flex items-center justify-center gap-1">
					<Lock className="w-3 h-3 text-content-muted" />
					Koneksi aman terenkripsi SSL 256-bit
				</p>
			</div>
		</div>
	);
}
