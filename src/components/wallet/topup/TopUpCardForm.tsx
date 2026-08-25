import { Sparkles } from "lucide-react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import Input from "@/components/ui/form/Input";

export interface TopUpCardFormValues {
	cardName: string;
	cardNumber: string;
	cardExpiry: string;
	cardCvv: string;
}

interface TopUpCardFormProps {
	register: UseFormRegister<TopUpCardFormValues>;
	errors: FieldErrors<TopUpCardFormValues>;
	onCardNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onExpiryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onCvvChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TopUpCardForm({
	register,
	errors,
	onCardNumberChange,
	onExpiryChange,
	onCvvChange,
}: TopUpCardFormProps) {
	return (
		<div className="mt-4 pt-4 border-t border-content/10 space-y-3">
			<div className="p-2.5 rounded-xl bg-content/5 border border-content/10 text-xs text-content-muted flex items-center gap-2">
				<Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
				<span>
					Sandbox Testing: Gunakan kartu{" "}
					<strong className="text-content font-mono font-bold">
						4242 4242 4242 4242
					</strong>
				</span>
			</div>

			<div className="space-y-3">
				<div className="space-y-1">
					<Input
						label="Nama Pemegang Kartu"
						placeholder="DIMAS PRASETYO"
						required
						{...register("cardName", {
							required: "Nama pemegang kartu wajib diisi.",
						})}
					/>
					{errors.cardName && (
						<p className="text-danger text-xs">{errors.cardName.message}</p>
					)}
				</div>

				<div className="space-y-1">
					<Input
						label="Nomor Kartu Kredit"
						placeholder="4242 4242 4242 4242"
						required
						maxLength={19}
						{...register("cardNumber", {
							required: "Nomor kartu wajib diisi.",
							validate: (val) =>
								val.replace(/\s+/g, "").length === 16 || "Harus 16 digit.",
						})}
						onChange={onCardNumberChange}
					/>
					{errors.cardNumber && (
						<p className="text-danger text-xs">{errors.cardNumber.message}</p>
					)}
				</div>

				<div className="grid grid-cols-2 gap-3">
					<div className="space-y-1">
						<Input
							label="Masa Berlaku"
							placeholder="12/28"
							required
							maxLength={5}
							{...register("cardExpiry", {
								required: "Expiry wajib diisi.",
								pattern: {
									value: /^(0[1-9]|1[0-2])\/?([0-9]{2})$/,
									message: "Format MM/YY.",
								},
							})}
							onChange={onExpiryChange}
						/>
						{errors.cardExpiry && (
							<p className="text-danger text-xs">{errors.cardExpiry.message}</p>
						)}
					</div>

					<div className="space-y-1">
						<Input
							label="CVV"
							placeholder="123"
							type="password"
							required
							maxLength={4}
							{...register("cardCvv", {
								required: "CVV wajib diisi.",
								minLength: {
									value: 3,
									message: "Minimal 3 digit.",
								},
							})}
							onChange={onCvvChange}
						/>
						{errors.cardCvv && (
							<p className="text-danger text-xs">{errors.cardCvv.message}</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
