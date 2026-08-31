import type { FieldErrors, UseFormRegister } from "react-hook-form";
import Input from "@/components/ui/form/Input";
import Select from "@/components/ui/form/Select";
import AmountPresetSelector from "@/components/wallet/AmountPresetSelector";
import { formatPrice } from "@/utils";

export interface WithdrawFormValues {
	amount: number;
	bankName: string;
	accountNumber: string;
	accountName: string;
}

export const DESTINATION_OPTIONS = [
	{ id: "BCA", label: "Bank Central Asia (BCA)", type: "bank" },
	{ id: "Mandiri", label: "Bank Mandiri", type: "bank" },
	{ id: "BNI", label: "Bank Negara Indonesia (BNI)", type: "bank" },
	{ id: "BRI", label: "Bank Rakyat Indonesia (BRI)", type: "bank" },
	{ id: "CIMB", label: "Bank CIMB Niaga", type: "bank" },
	{ id: "Jago", label: "Bank Jago", type: "bank" },
	{ id: "GoPay", label: "GoPay", type: "ewallet" },
	{ id: "OVO", label: "OVO", type: "ewallet" },
	{ id: "DANA", label: "DANA", type: "ewallet" },
	{ id: "ShopeePay", label: "ShopeePay", type: "ewallet" },
];

export const QUICK_AMOUNTS = [100000, 250000, 500000, 1000000];

interface WithdrawDestinationFormProps {
	register: UseFormRegister<WithdrawFormValues>;
	errors: FieldErrors<WithdrawFormValues>;
	enteredAmount: number;
	currentBalance: number;
	isEligibleToWithdraw: boolean;
	onQuickAmountSelect: (amount: number) => void;
	onWithdrawAll: () => void;
}

export function WithdrawDestinationForm({
	register,
	errors,
	enteredAmount,
	currentBalance,
	isEligibleToWithdraw,
	onQuickAmountSelect,
	onWithdrawAll,
}: WithdrawDestinationFormProps) {
	return (
		<div className="space-y-4 bg-surface border border-content/10 rounded-2xl p-5 shadow-sm">
			<h2 className="text-sm font-bold uppercase tracking-wider text-content-muted">
				Detail Penarikan
			</h2>

			{/* Amount Input */}
			<div className="space-y-2">
				<div className="space-y-1">
					<Input
						label="Nominal Penarikan (IDR)"
						type="number"
						placeholder="100000"
						required
						min={100000}
						max={currentBalance}
						{...register("amount", {
							required: "Nominal penarikan wajib diisi.",
							valueAsNumber: true,
							min: {
								value: 100000,
								message: "Minimal penarikan dana adalah Rp 100.000.",
							},
							max: {
								value: currentBalance,
								message: "Nominal penarikan melebihi saldo dompet Anda.",
							},
						})}
					/>
					{errors.amount && (
						<p className="text-danger text-xs">{errors.amount.message}</p>
					)}
				</div>

				{/* Quick Amount Selection */}
				<div className="space-y-2 pt-1">
					<AmountPresetSelector
						amounts={QUICK_AMOUNTS}
						selectedAmount={enteredAmount}
						onSelect={onQuickAmountSelect}
						disabled={false}
					/>
					<button
						type="button"
						disabled={!isEligibleToWithdraw}
						onClick={onWithdrawAll}
						className="w-full py-2 px-3 rounded-xl border border-dashed border-primary/40 bg-primary/5 text-primary hover:bg-primary/10 text-xs font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-center"
					>
						Tarik Semua ({formatPrice(currentBalance).replace(",00", "")})
					</button>
				</div>
			</div>

			{/* Destination Bank / E-Wallet */}
			<div className="space-y-1">
				<Select
					id="bankName"
					label="Bank / E-Wallet Tujuan"
					{...register("bankName", {
						required: "Pilih bank atau e-wallet tujuan.",
					})}
				>
					<optgroup label="Transfer Bank">
						{DESTINATION_OPTIONS.filter((d) => d.type === "bank").map((opt) => (
							<option key={opt.id} value={opt.id}>
								{opt.label}
							</option>
						))}
					</optgroup>
					<optgroup label="E-Wallet">
						{DESTINATION_OPTIONS.filter((d) => d.type === "ewallet").map(
							(opt) => (
								<option key={opt.id} value={opt.id}>
									{opt.label}
								</option>
							),
						)}
					</optgroup>
				</Select>
				{errors.bankName && (
					<p className="text-danger text-xs">{errors.bankName.message}</p>
				)}
			</div>

			{/* Account Number */}
			<div className="space-y-1">
				<Input
					label="Nomor Rekening / Akun E-Wallet"
					placeholder="e.g. 1234567890 / 08123456789"
					required
					{...register("accountNumber", {
						required: "Nomor rekening/e-wallet wajib diisi.",
						minLength: {
							value: 8,
							message: "Nomor rekening minimal 8 digit.",
						},
					})}
				/>
				{errors.accountNumber && (
					<p className="text-danger text-xs">{errors.accountNumber.message}</p>
				)}
			</div>

			{/* Account Name */}
			<div className="space-y-1">
				<Input
					label="Nama Pemilik Rekening (Sesuai KTP / Buku Tabungan)"
					placeholder="e.g. ARI RAMADAN"
					required
					{...register("accountName", {
						required: "Nama pemilik rekening wajib diisi.",
						minLength: {
							value: 3,
							message: "Nama pemilik rekening minimal 3 karakter.",
						},
					})}
				/>
				{errors.accountName && (
					<p className="text-danger text-xs">{errors.accountName.message}</p>
				)}
			</div>
		</div>
	);
}
