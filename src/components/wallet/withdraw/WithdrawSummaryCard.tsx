import { ArrowUpRight, Clock3, Lock, ShieldCheck, Wallet } from "lucide-react";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/utils";

interface WithdrawSummaryCardProps {
	currentBalance: number;
	enteredAmount: number;
	adminFee: number;
	netAmount: number;
	balanceAfterWithdraw: number;
	selectedBank: string;
	isSubmitting: boolean;
	isFormValid: boolean;
	onSubmit: () => void;
}

export function WithdrawSummaryCard({
	currentBalance,
	enteredAmount,
	adminFee,
	netAmount,
	balanceAfterWithdraw,
	selectedBank,
	isSubmitting,
	isFormValid,
	onSubmit,
}: WithdrawSummaryCardProps) {
	return (
		<div className="space-y-4">
			<h2 className="text-sm font-bold uppercase tracking-wider text-content-muted">
				Ringkasan Pencairan
			</h2>

			<div className="bg-surface border border-content/10 rounded-2xl p-5 space-y-5 shadow-sm">
				{/* Breakdown */}
				<div className="space-y-3 text-xs sm:text-sm">
					<div className="flex justify-between text-content-muted">
						<span>Saldo Awal</span>
						<span className="font-medium text-content">
							{formatPrice(currentBalance)}
						</span>
					</div>

					<div className="flex justify-between text-content-muted">
						<span>Nominal Ditarik</span>
						<span className="font-bold text-content">
							{formatPrice(enteredAmount)}
						</span>
					</div>

					<div className="flex justify-between text-content-muted">
						<span>Biaya Transfer Antar Bank</span>
						<span className="font-medium text-content">
							{adminFee > 0 ? formatPrice(adminFee) : "Rp 0 (Gratis)"}
						</span>
					</div>

					<div className="flex justify-between text-content-muted">
						<span>Tujuan Pencairan</span>
						<span className="font-medium text-content">{selectedBank}</span>
					</div>

					<div className="pt-3 border-t border-content/10 flex justify-between items-baseline">
						<span className="font-bold text-sm text-content">
							Dana Bersih Diterima
						</span>
						<span className="font-heading text-xl font-bold text-emerald-600 dark:text-emerald-400">
							{formatPrice(netAmount)}
						</span>
					</div>
				</div>

				{/* Sisa Saldo Preview */}
				<div className="p-3.5 bg-content/5 rounded-xl border border-content/10 text-xs space-y-1.5">
					<div className="flex items-center gap-1.5 font-semibold text-content-muted">
						<Wallet className="w-4 h-4 text-primary" />
						<span>Sisa Saldo Dompet Setelah Penarikan</span>
					</div>
					<p className="font-heading text-lg font-bold text-content">
						{formatPrice(balanceAfterWithdraw)}
					</p>
				</div>

				{/* Payout Guarantee Box */}
				<div className="p-3.5 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 rounded-xl border border-emerald-500/20 text-xs leading-relaxed space-y-1">
					<div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
						<ShieldCheck className="w-4 h-4 shrink-0" />
						<span>Pencairan Dana Otomatis & Terverifikasi</span>
					</div>
					<p className="text-[11px] opacity-90">
						Permintaan payout diproses 1x24 jam kerja langsung ke rekening bank
						atau nomor e-wallet yang terdaftar.
					</p>
				</div>

				{/* Estimated Arrival Box */}
				<div className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-xs flex items-center gap-2 text-primary font-medium">
					<Clock3 className="w-4 h-4 shrink-0" />
					<span>Estimasi dana masuk: 10 - 30 Menit (Realtime Transfer)</span>
				</div>

				{/* Submit Button */}
				<Button
					type="button"
					disabled={!isFormValid || isSubmitting}
					onClick={onSubmit}
					className="w-full py-3 justify-center text-sm font-semibold flex items-center gap-2 shadow-sm"
				>
					{isSubmitting ? (
						<>Memproses Permintaan Pencairan...</>
					) : (
						<>
							<ArrowUpRight className="w-4 h-4" />
							Ajukan Pencairan Sekarang
						</>
					)}
				</Button>

				<p className="text-[10px] text-center text-content-muted flex items-center justify-center gap-1">
					<Lock className="w-3 h-3 text-content-muted" />
					Transaksi aman terenkripsi SSL 256-bit
				</p>
			</div>
		</div>
	);
}
