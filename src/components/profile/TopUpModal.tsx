"use client";

import { CreditCard, Wallet, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/form/Input";
import { formatPrice } from "@/utils";

interface TopUpModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmitSuccess: (amount: number) => void;
}

interface TopUpForm {
	cardNumber: string;
	cardExpiry: string;
	cardCvv: string;
}

const NOMINAL_OPTIONS = [50000, 100000, 200000, 250000, 400000, 500000];

export default function TopUpModal({
	isOpen,
	onClose,
	onSubmitSuccess,
}: TopUpModalProps) {
	const [selectedAmount, setSelectedAmount] = useState<number>(100000);
	const {
		register,
		handleSubmit,
		setValue,
		reset,
		formState: { errors },
	} = useForm<TopUpForm>();

	const handleCardNumberChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			let value = e.target.value.replace(/\D/g, "");
			value = value.slice(0, 16);
			const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ");
			setValue("cardNumber", formattedValue, { shouldValidate: true });
		},
		[setValue],
	);

	const handleExpiryChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			let value = e.target.value.replace(/\D/g, "");
			value = value.slice(0, 4);
			if (value.length >= 2) {
				value = `${value.slice(0, 2)}/${value.slice(2)}`;
			}
			setValue("cardExpiry", value, { shouldValidate: true });
		},
		[setValue],
	);

	const handleCvvChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value.replace(/\D/g, "").slice(0, 3);
			setValue("cardCvv", value, { shouldValidate: true });
		},
		[setValue],
	);

	if (!isOpen) return null;

	const handleClose = () => {
		reset();
		onClose();
	};

	const onFormSubmit = (_data: TopUpForm) => {
		onSubmitSuccess(selectedAmount);
		reset();
	};

	return (
		<div className="fixed inset-0 z-9998 flex items-center justify-center p-4">
			{/* Backdrop */}
			<button
				type="button"
				onClick={handleClose}
				className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm cursor-pointer"
				aria-label="Tutup modal"
			/>

			{/* Dialog Card */}
			<div className="relative z-10 w-full max-w-md bg-surface rounded-2xl shadow-2xl border border-content/10 p-6 space-y-5">
				{/* Close Button */}
				<button
					type="button"
					onClick={handleClose}
					className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-content/5 transition-colors cursor-pointer"
					aria-label="Tutup"
				>
					<X size={16} className="text-content-muted" />
				</button>

				<div className="space-y-1">
					<h2 className="text-lg font-bold text-content flex items-center gap-2">
						<Wallet className="w-5 h-5 text-primary" />
						Top Up Saldo E-Wallet
					</h2>
					<p className="text-sm text-content-muted">
						Pilih nominal top-up dan isi detail pembayaran simulasi.
					</p>
				</div>

				<hr className="border-content/5" />

				{/* Nominal Selection Grid */}
				<div className="space-y-2">
					<span className="block text-xs font-bold text-content-muted uppercase tracking-wider">
						Pilih Nominal
					</span>
					<div className="grid grid-cols-3 gap-2">
						{NOMINAL_OPTIONS.map((amount) => (
							<button
								key={amount}
								type="button"
								onClick={() => setSelectedAmount(amount)}
								className={`px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer text-center ${
									selectedAmount === amount
										? "border-primary bg-primary/10 text-primary shadow-sm"
										: "border-content/10 bg-background text-content hover:border-content/20"
								}`}
							>
								{formatPrice(amount).replace(",00", "").replace("Rp\u00A0", "")}
							</button>
						))}
					</div>
				</div>

				{/* Credit Card Info Form */}
				<form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
					<div className="space-y-1.5">
						<label
							htmlFor="cardNumber"
							className="block text-xs font-semibold text-content"
						>
							Nomor Kartu Kredit/Debit
						</label>
						<Input
							id="cardNumber"
							type="text"
							placeholder="0000 0000 0000 0000"
							{...register("cardNumber", {
								required: "Nomor kartu wajib diisi",
								validate: (v) =>
									v.replace(/\s+/g, "").length === 16 || "Harus 16 digit",
							})}
							onChange={handleCardNumberChange}
						>
							<CreditCard className="h-5 w-5 text-gray-400" />
						</Input>
						{errors.cardNumber && (
							<p className="text-danger text-xs">{errors.cardNumber.message}</p>
						)}
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1.5">
							<label
								htmlFor="cardExpiry"
								className="block text-xs font-semibold text-content"
							>
								Masa Berlaku (MM/YY)
							</label>
							<Input
								id="cardExpiry"
								type="text"
								placeholder="MM/YY"
								{...register("cardExpiry", {
									required: "Expiry wajib diisi",
									pattern: {
										value: /^(0[1-9]|1[0-2])\/?([0-9]{2})$/,
										message: "Format MM/YY",
									},
								})}
								onChange={handleExpiryChange}
							/>
							{errors.cardExpiry && (
								<p className="text-danger text-xs">
									{errors.cardExpiry.message}
								</p>
							)}
						</div>

						<div className="space-y-1.5">
							<label
								htmlFor="cardCvv"
								className="block text-xs font-semibold text-content"
							>
								CVV
							</label>
							<Input
								id="cardCvv"
								type="password"
								placeholder="•••"
								{...register("cardCvv", {
									required: "CVV wajib diisi",
									minLength: { value: 3, message: "Minimal 3 digit" },
								})}
								onChange={handleCvvChange}
							/>
							{errors.cardCvv && (
								<p className="text-danger text-xs">{errors.cardCvv.message}</p>
							)}
						</div>
					</div>

					<div className="flex gap-3 pt-2">
						<Button
							type="button"
							variant="secondary"
							className="flex-1 justify-center"
							onClick={handleClose}
						>
							Batal
						</Button>
						<Button type="submit" className="flex-1 justify-center">
							Top Up {formatPrice(selectedAmount)}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
