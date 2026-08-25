import { Building2, CreditCard } from "lucide-react";
import Select from "@/components/ui/form/Select";

export interface VaBankOption {
	id: string;
	name: string;
	code: string;
}

export const VA_BANK_OPTIONS: VaBankOption[] = [
	{ id: "BCA", name: "BCA Virtual Account", code: "8801234" },
	{ id: "Mandiri", name: "Mandiri Bill Payment", code: "8901234" },
	{ id: "BNI", name: "BNI Virtual Account", code: "8701234" },
	{ id: "BRI", name: "BRIVA (BRI)", code: "8601234" },
	{ id: "GoPay", name: "GoPay / GoPay Coins", code: "0812345" },
	{ id: "OVO", name: "OVO Cash", code: "0812345" },
	{ id: "DANA", name: "DANA Dompet Digital", code: "0812345" },
];

interface TopUpMethodSelectorProps {
	paymentMethod: "cc" | "va";
	onSelectMethod: (method: "cc" | "va") => void;
	selectedVa: string;
	onSelectVa: (va: string) => void;
	children?: React.ReactNode;
}

export function TopUpMethodSelector({
	paymentMethod,
	onSelectMethod,
	selectedVa,
	onSelectVa,
	children,
}: TopUpMethodSelectorProps) {
	return (
		<div className="bg-surface border border-content/10 rounded-2xl p-5 space-y-4 shadow-sm">
			<h2 className="text-sm font-bold uppercase tracking-wider text-content-muted">
				2. Pilih Metode Pembayaran
			</h2>

			<div className="space-y-3">
				{/* Option 1: Kartu Kredit / Debit */}
				<div
					className={`rounded-2xl border p-4 transition-all ${
						paymentMethod === "cc"
							? "border-primary bg-primary/5 ring-2 ring-primary/20"
							: "border-content/10 bg-background hover:border-content/20"
					}`}
				>
					<label className="flex items-start justify-between gap-3 cursor-pointer">
						<div className="flex items-center gap-3">
							<div
								className={`w-9 h-9 rounded-xl flex items-center justify-center ${
									paymentMethod === "cc"
										? "bg-primary text-background"
										: "bg-content/5 text-content-muted"
								}`}
							>
								<CreditCard className="w-4 h-4" />
							</div>
							<div>
								<p className="font-bold text-sm text-content">
									Kartu Kredit / Debit Online
								</p>
								<p className="text-xs text-content-muted">
									Visa, Mastercard, JCB (Mode Sandbox Aktif)
								</p>
							</div>
						</div>

						<input
							type="radio"
							name="topup_payment_method"
							value="cc"
							checked={paymentMethod === "cc"}
							onChange={() => onSelectMethod("cc")}
							className="radio radio-primary radio-sm mt-1"
						/>
					</label>

					{/* CC Form inside slot */}
					{paymentMethod === "cc" && children}
				</div>

				{/* Option 2: Virtual Account / E-Wallet Transfer */}
				<div
					className={`rounded-2xl border p-4 transition-all ${
						paymentMethod === "va"
							? "border-primary bg-primary/5 ring-2 ring-primary/20"
							: "border-content/10 bg-background hover:border-content/20"
					}`}
				>
					<label className="flex items-start justify-between gap-3 cursor-pointer">
						<div className="flex items-center gap-3">
							<div
								className={`w-9 h-9 rounded-xl flex items-center justify-center ${
									paymentMethod === "va"
										? "bg-primary text-background"
										: "bg-content/5 text-content-muted"
								}`}
							>
								<Building2 className="w-4 h-4" />
							</div>
							<div>
								<p className="font-bold text-sm text-content">
									Transfer Virtual Account / E-Wallet
								</p>
								<p className="text-xs text-content-muted">
									BCA, Mandiri, BNI, GoPay, OVO, DANA
								</p>
							</div>
						</div>

						<input
							type="radio"
							name="topup_payment_method"
							value="va"
							checked={paymentMethod === "va"}
							onChange={() => onSelectMethod("va")}
							className="radio radio-primary radio-sm mt-1"
						/>
					</label>

					{paymentMethod === "va" && (
						<div className="mt-4 pt-4 border-t border-content/10 space-y-3">
							<Select
								id="vaBankSelect"
								label="Pilih Bank / E-Wallet Pembayaran"
								value={selectedVa}
								onChange={(e) => onSelectVa(e.target.value)}
							>
								{VA_BANK_OPTIONS.map((opt) => (
									<option key={opt.id} value={opt.id}>
										{opt.name}
									</option>
								))}
							</Select>

							<div className="p-3 bg-content/5 rounded-xl border border-content/10 text-xs space-y-1">
								<p className="text-content font-medium">
									Nomor Virtual Account Simulasi:
								</p>
								<p className="font-mono text-sm font-bold text-primary">
									{VA_BANK_OPTIONS.find((v) => v.id === selectedVa)?.code}
									9981234
								</p>
								<p className="text-[11px] text-content-muted">
									Instruksi pembayaran otomatis terverifikasi secara instan
									setelah Anda menekan tombol konfirmasi.
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
