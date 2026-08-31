import { AlertCircle, CheckCircle2, CreditCard, Wallet } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/utils";

interface PaymentMethodSelectorProps {
	paymentMethod: "wallet" | "credit_card";
	onSelectMethod: (method: "wallet" | "credit_card") => void;
	userBalance: number;
	totalPrice: number;
	commissionId: string;
	children?: React.ReactNode; // Optional slot for CreditCardForm
}

export function PaymentMethodSelector({
	paymentMethod,
	onSelectMethod,
	userBalance,
	totalPrice,
	commissionId,
	children,
}: PaymentMethodSelectorProps) {
	const isBalanceSufficient = userBalance >= totalPrice;
	const balanceShortage = Math.max(0, totalPrice - userBalance);

	return (
		<div className="space-y-4">
			<h2 className="text-sm font-bold uppercase tracking-wider text-content-muted">
				Pilih Metode Pembayaran
			</h2>

			{/* Option 1: TruBrush E-Wallet */}
			<div
				className={`rounded-2xl border p-4 sm:p-5 transition-all ${
					paymentMethod === "wallet"
						? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
						: "border-content/10 bg-surface hover:border-content/20"
				}`}
			>
				<label className="flex items-start justify-between gap-3 cursor-pointer">
					<div className="flex items-center gap-3">
						<div
							className={`w-10 h-10 rounded-xl flex items-center justify-center ${
								paymentMethod === "wallet"
									? "bg-primary text-background"
									: "bg-content/5 text-content-muted"
							}`}
						>
							<Wallet className="w-5 h-5" />
						</div>
						<div>
							<p className="font-bold text-sm sm:text-base text-content flex items-center gap-2">
								Saldo TruBrush E-Wallet
								<span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/20">
									Instan & Bebas Biaya
								</span>
							</p>
							<p className="text-xs text-content-muted mt-0.5">
								Sisa saldo akun Anda saat ini:{" "}
								<span className="font-semibold text-content">
									{formatPrice(userBalance)}
								</span>
							</p>
						</div>
					</div>

					<input
						type="radio"
						name="payment_method"
						value="wallet"
						checked={paymentMethod === "wallet"}
						onChange={() => onSelectMethod("wallet")}
						className="radio radio-primary radio-sm mt-1"
					/>
				</label>

				{/* Wallet Status Details (shown when active) */}
				{paymentMethod === "wallet" && (
					<div className="mt-4 pt-4 border-t border-content/10 space-y-3">
						{isBalanceSufficient ? (
							<div className="flex items-center gap-2 p-3 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-xl border border-emerald-500/20 text-xs font-medium">
								<CheckCircle2 className="w-4 h-4 shrink-0" />
								<span>
									Saldo mencukupi. Sisa saldo setelah pembayaran:{" "}
									<strong className="font-bold">
										{formatPrice(userBalance - totalPrice)}
									</strong>
								</span>
							</div>
						) : (
							<div className="space-y-2.5">
								<div className="flex items-start gap-2 p-3 bg-danger/10 text-danger rounded-xl border border-danger/20 text-xs">
									<AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
									<div className="space-y-0.5">
										<p className="font-bold">Saldo Tidak Mencukupi</p>
										<p className="text-content-muted">
											Kekurangan saldo sebesar{" "}
											<strong className="text-danger font-semibold">
												{formatPrice(balanceShortage)}
											</strong>
											. Silakan lakukan Top Up untuk melanjutkan.
										</p>
									</div>
								</div>

								<Link
									href={`/topup?redirect=/commissions/${commissionId}/payment`}
									className="w-full text-xs py-2 justify-center flex items-center gap-1.5 rounded-xl bg-surface border border-content/10 text-content hover:bg-content/5 font-semibold transition-colors"
								>
									<Wallet className="w-3.5 h-3.5" />
									Top Up Saldo E-Wallet Sekarang
								</Link>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Option 2: Credit / Debit Card */}
			<div
				className={`rounded-2xl border p-4 sm:p-5 transition-all ${
					paymentMethod === "credit_card"
						? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
						: "border-content/10 bg-surface hover:border-content/20"
				}`}
			>
				<label className="flex items-start justify-between gap-3 cursor-pointer">
					<div className="flex items-center gap-3">
						<div
							className={`w-10 h-10 rounded-xl flex items-center justify-center ${
								paymentMethod === "credit_card"
									? "bg-primary text-background"
									: "bg-content/5 text-content-muted"
							}`}
						>
							<CreditCard className="w-5 h-5" />
						</div>
						<div>
							<p className="font-bold text-sm sm:text-base text-content">
								Kartu Kredit / Debit Online
							</p>
							<p className="text-xs text-content-muted mt-0.5">
								Mendukung Visa, Mastercard, JCB & GPN
							</p>
						</div>
					</div>

					<input
						type="radio"
						name="payment_method"
						value="credit_card"
						checked={paymentMethod === "credit_card"}
						onChange={() => onSelectMethod("credit_card")}
						className="radio radio-primary radio-sm mt-1"
					/>
				</label>

				{/* Card Form Slot */}
				{paymentMethod === "credit_card" && children}
			</div>
		</div>
	);
}
