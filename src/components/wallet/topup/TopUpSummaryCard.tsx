import { CheckCircle2, Lock, ShieldCheck, Wallet } from "lucide-react";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/utils";

interface TopUpSummaryCardProps {
	currentBalance: number;
	activeAmount: number;
	finalBalanceAfter: number;
	paymentMethod: "cc" | "va";
	selectedVa: string;
	isSubmitting: boolean;
	onSubmit: () => void;
}

export function TopUpSummaryCard({
	currentBalance,
	activeAmount,
	finalBalanceAfter,
	paymentMethod,
	selectedVa,
	isSubmitting,
	onSubmit,
}: TopUpSummaryCardProps) {
	const isAmountValid = activeAmount >= 10000;

	return (
		<div className="space-y-4">
			<h2 className="text-sm font-bold uppercase tracking-wider text-content-muted">
				Ringkasan Transaksi
			</h2>

			<div className="bg-surface border border-content/10 rounded-2xl p-5 space-y-5 shadow-sm">
				{/* Breakdown */}
				<div className="space-y-3 text-xs sm:text-sm">
					<div className="flex justify-between text-content-muted">
						<span>Saldo Akun Saat Ini</span>
						<span className="font-medium text-content">
							{formatPrice(currentBalance)}
						</span>
					</div>

					<div className="flex justify-between text-content-muted">
						<span>Nominal Top Up</span>
						<span className="font-bold text-content">
							{formatPrice(activeAmount)}
						</span>
					</div>

					<div className="flex justify-between text-content-muted">
						<span>Biaya Transaksi / Admin</span>
						<span className="font-semibold text-emerald-600 dark:text-emerald-400">
							Rp 0 (Gratis)
						</span>
					</div>

					<div className="flex justify-between text-content-muted">
						<span>Metode Pembayaran</span>
						<span className="font-medium text-content">
							{paymentMethod === "cc"
								? "Kartu Kredit/Debit"
								: `Virtual Account ${selectedVa}`}
						</span>
					</div>

					<div className="pt-3 border-t border-content/10 flex justify-between items-baseline">
						<span className="font-bold text-sm text-content">Total Bayar</span>
						<span className="font-heading text-xl font-bold text-primary">
							{formatPrice(activeAmount)}
						</span>
					</div>
				</div>

				{/* Saldo Akhir Preview Box */}
				<div className="p-3.5 bg-primary/5 rounded-xl border border-primary/10 text-xs space-y-1.5">
					<div className="flex items-center gap-1.5 font-bold text-primary">
						<Wallet className="w-4 h-4" />
						<span>Estimasi Saldo Setelah Top Up</span>
					</div>
					<p className="font-heading text-lg font-bold text-content">
						{formatPrice(finalBalanceAfter)}
					</p>
					<p className="text-[11px] text-content-muted">
						Saldo dapat langsung digunakan untuk transaksi pemesanan komisi
						karya.
					</p>
				</div>

				{/* Escrow Guarantee Box */}
				<div className="p-3 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 rounded-xl border border-emerald-500/20 text-xs space-y-1">
					<div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
						<ShieldCheck className="w-4 h-4 shrink-0" />
						<span>Jaminan Perlindungan TruBrush Escrow</span>
					</div>
					<p className="text-[11px] opacity-90 leading-relaxed">
						Dana tersimpan aman dan terenkripsi. Pembayaran ke Artis hanya
						dilepas setelah Anda menyetujui hasil karya akhir.
					</p>
				</div>

				{/* Submit Button */}
				<Button
					type="button"
					disabled={!isAmountValid || isSubmitting}
					onClick={onSubmit}
					className="w-full py-3 justify-center text-sm font-semibold flex items-center gap-2 shadow-sm"
				>
					{isSubmitting ? (
						<>Memproses Pengisian Saldo...</>
					) : (
						<>
							<CheckCircle2 className="w-4 h-4" />
							Konfirmasi & Top Up Sekarang
						</>
					)}
				</Button>

				<p className="text-[10px] text-center text-content-muted flex items-center justify-center gap-1">
					<Lock className="w-3 h-3 text-content-muted" />
					Koneksi aman terenkripsi SSL 256-bit
				</p>
			</div>
		</div>
	);
}
