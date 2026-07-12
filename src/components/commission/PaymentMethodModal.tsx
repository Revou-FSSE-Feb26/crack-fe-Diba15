"use client";

import { AlertCircle, CheckCircle, CreditCard, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import Button from "@/components/ui/Button";
import { useModalStore } from "@/store/ModalStore";
import { useToastStore } from "@/store/ToastStore";
import { useUserManagementStore } from "@/store/UserManagementStore";
import { useUserStore } from "@/store/UserStore";
import { formatPrice } from "@/utils";

interface PaymentFormValues {
	cardName: string;
	cardNumber: string;
	cardExpiry: string;
	cardCvv: string;
}

interface PaymentMethodModalProps {
	commissionId: string;
	commissionTitle: string;
	price: number;
	isOpen: boolean;
	onClose: () => void;
	onSubmitSuccess: (
		method: "wallet" | "credit_card",
		lastFour?: string,
	) => void;
}

export default function PaymentMethodModal({
	commissionId,
	commissionTitle,
	price,
	isOpen,
	onClose,
	onSubmitSuccess,
}: PaymentMethodModalProps) {
	const modalId = "payment-method-modal";
	const { openModal, closeModal, isOpen: globalOpen, config } = useModalStore();
	const { user, updateCurrentUser } = useUserStore();
	const { updateUser } = useUserManagementStore();
	const { addToast } = useToastStore();

	const [activeTab, setActiveTab] = useState<"wallet" | "credit_card">(
		"wallet",
	);

	const {
		register,
		handleSubmit,
		setValue,
		control,
		formState: { errors },
		reset,
	} = useForm<PaymentFormValues>({
		defaultValues: {
			cardName: "",
			cardNumber: "",
			cardExpiry: "",
			cardCvv: "",
		},
		mode: "onChange",
	});

	// Watch values for CC preview
	const ccName =
		useWatch({ control, name: "cardName" }) || "NAMA PEMEGANG KARTU";
	const ccNumber =
		useWatch({ control, name: "cardNumber" }) || "•••• •••• •••• ••••";
	const ccExpiry = useWatch({ control, name: "cardExpiry" }) || "MM/YY";
	const ccCvv = useWatch({ control, name: "cardCvv" }) || "•••";

	useEffect(() => {
		if (!isOpen) return;
		reset();
		setActiveTab("wallet");
	}, [isOpen, reset]);

	const balance = user?.balance ?? 0;
	const isBalanceSufficient = balance >= price;

	const handleTopUp = () => {
		if (!user) return;
		const amount = 500000;
		const nextBalance = balance + amount;
		updateUser(user.id, { balance: nextBalance });
		updateCurrentUser({ balance: nextBalance });
		addToast({
			message: `Berhasil Top Up ${formatPrice(amount)}. Saldo Anda sekarang ${formatPrice(nextBalance)}.`,
			type: "success",
		});
	};

	const onWalletPay = () => {
		if (!isBalanceSufficient) {
			addToast({
				message:
					"Saldo tidak mencukupi. Silakan lakukan Top Up terlebih dahulu.",
				type: "error",
			});
			return;
		}
		onSubmitSuccess("wallet");
		closeModal();
	};

	const onCcPay = (values: PaymentFormValues) => {
		const cleanCardNum = values.cardNumber.replace(/\s+/g, "");
		const lastFour = cleanCardNum.slice(-4);
		onSubmitSuccess("credit_card", lastFour);
		closeModal();
	};

	// Formats CC Number: XXXX XXXX XXXX XXXX
	const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let value = e.target.value.replace(/\D/g, "");
		value = value.slice(0, 16);
		const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ");
		setValue("cardNumber", formattedValue, { shouldValidate: true });
	};

	// Formats Expiry: MM/YY
	const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let value = e.target.value.replace(/\D/g, "");
		value = value.slice(0, 4);
		if (value.length >= 2) {
			value = `${value.slice(0, 2)}/${value.slice(2)}`;
		}
		setValue("cardExpiry", value, { shouldValidate: true });
	};

	// Formats CVV: 3 digits
	const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/\D/g, "").slice(0, 3);
		setValue("cardCvv", value, { shouldValidate: true });
	};

	// We render the CC and Wallet options dynamically inside the modal content
	// biome-ignore lint/correctness/useExhaustiveDependencies: dynamic render requires form states and functions
	useEffect(() => {
		if (!isOpen) {
			if (globalOpen && config?.id === modalId) {
				closeModal();
			}
			return;
		}

		const renderContent = () => {
			return (
				<div className="space-y-5">
					{/* Header summary */}
					<div className="rounded-xl bg-content/5 p-4 border border-slate-200 dark:border-slate-700">
						<div className="flex justify-between items-center text-sm">
							<span className="font-semibold text-content">
								{commissionTitle}
							</span>
							<span className="text-xs text-content-muted">
								ID: {commissionId}
							</span>
						</div>
						<div className="mt-2 flex justify-between items-end border-t border-content/5 pt-2">
							<span className="text-xs text-content-muted">
								Total Pembayaran Uang Muka
							</span>
							<span className="text-lg font-bold text-primary">
								{formatPrice(price)}
							</span>
						</div>
					</div>

					{/* Tabs */}
					<div className="flex rounded-lg bg-content/5 p-1">
						<button
							type="button"
							onClick={() => setActiveTab("wallet")}
							className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm font-semibold rounded-md transition-colors cursor-pointer ${
								activeTab === "wallet"
									? "bg-surface text-primary shadow-sm"
									: "text-content-muted hover:text-content"
							}`}
						>
							<Wallet className="w-4 h-4" />
							E-Wallet
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("credit_card")}
							className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm font-semibold rounded-md transition-colors cursor-pointer ${
								activeTab === "credit_card"
									? "bg-surface text-primary shadow-sm"
									: "text-content-muted hover:text-content"
							}`}
						>
							<CreditCard className="w-4 h-4" />
							Kartu Kredit
						</button>
					</div>

					{activeTab === "wallet" ? (
						<div className="space-y-4 py-2">
							<div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex justify-between items-center bg-surface">
								<div className="flex items-center gap-3">
									<div className="p-3 bg-verified/10 text-verified rounded-xl">
										<Wallet className="w-6 h-6" />
									</div>
									<div>
										<p className="text-xs text-content-muted">
											Saldo E-Wallet Anda
										</p>
										<p className="text-xl font-bold text-content">
											{formatPrice(balance)}
										</p>
									</div>
								</div>
								<button
									type="button"
									onClick={handleTopUp}
									className="px-3 py-1.5 text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors cursor-pointer"
								>
									Top Up Rp 500k
								</button>
							</div>

							{!isBalanceSufficient ? (
								<div className="flex gap-2 items-start p-3 bg-danger/10 text-danger border border-danger/20 rounded-xl text-xs">
									<AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
									<div>
										<p className="font-semibold">Saldo Tidak Cukup</p>
										<p className="mt-0.5">
											Silakan lakukan Top Up untuk menyelesaikan pembayaran.
										</p>
									</div>
								</div>
							) : (
								<div className="flex gap-2 items-start p-3 bg-verified/10 text-verified border border-verified/20 rounded-xl text-xs">
									<CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
									<div>
										<p className="font-semibold">Saldo Mencukupi</p>
										<p className="mt-0.5">
											Saldo Anda siap digunakan untuk transaksi ini.
										</p>
									</div>
								</div>
							)}

							<div className="flex gap-3 justify-end pt-3">
								<Button
									type="button"
									variant="secondary"
									onClick={onClose}
									className="text-sm"
								>
									Batal
								</Button>
								<Button
									type="button"
									disabled={!isBalanceSufficient}
									onClick={onWalletPay}
									className="text-sm justify-center flex-1 sm:flex-initial"
								>
									Bayar dengan E-Wallet
								</Button>
							</div>
						</div>
					) : (
						<div className="space-y-4">
							{/* Premium Credit Card Live Preview */}
							<div className="relative aspect-[1.586/1] w-full rounded-2xl p-6 text-white font-mono flex flex-col justify-between overflow-hidden shadow-lg select-none bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-900 border border-white/10">
								<div className="flex justify-between items-start">
									<div>
										<p className="text-[10px] text-white/50 tracking-wider">
											PREMIUM SECURE PAYMENT
										</p>
										<div className="mt-1.5 h-6 w-9 rounded bg-amber-400/80 border border-amber-300/40 shadow-inner opacity-90" />
									</div>
									<span className="text-lg font-bold italic tracking-widest text-white/90">
										TRUBRUSH
									</span>
								</div>

								<div className="mt-6">
									<p className="text-lg tracking-widest text-center">
										{ccNumber}
									</p>
								</div>

								<div className="flex justify-between items-end mt-4">
									<div className="min-w-0">
										<p className="text-[8px] text-white/50">CARDHOLDER</p>
										<p className="text-xs tracking-wider uppercase truncate max-w-[180px]">
											{ccName}
										</p>
									</div>
									<div className="flex gap-4 text-center shrink-0">
										<div>
											<p className="text-[8px] text-white/50">EXPIRES</p>
											<p className="text-xs">{ccExpiry}</p>
										</div>
										<div>
											<p className="text-[8px] text-white/50">CVV</p>
											<p className="text-xs">{ccCvv}</p>
										</div>
									</div>
								</div>
							</div>

							{/* Inputs */}
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="sm:col-span-2">
									<label
										htmlFor="cardName"
										className="mb-1 block text-xs font-semibold text-content"
									>
										Nama Pemegang Kartu
									</label>
									<input
										id="cardName"
										type="text"
										placeholder="CONTOH NAMA"
										className="w-full rounded-lg border border-slate-200 bg-background px-3 py-2 text-sm outline-none focus:border-primary uppercase dark:border-slate-700"
										{...register("cardName", {
											required: "Nama wajib diisi",
											minLength: { value: 3, message: "Minimal 3 huruf" },
										})}
									/>
									{errors.cardName && (
										<p className="mt-1 text-[10px] text-danger">
											{errors.cardName.message}
										</p>
									)}
								</div>

								<div className="sm:col-span-2">
									<label
										htmlFor="cardNumber"
										className="mb-1 block text-xs font-semibold text-content"
									>
										Nomor Kartu
									</label>
									<input
										id="cardNumber"
										type="text"
										placeholder="0000 0000 0000 0000"
										className="w-full rounded-lg border border-slate-200 bg-background px-3 py-2 text-sm outline-none focus:border-primary dark:border-slate-700"
										{...register("cardNumber", {
											required: "Nomor kartu wajib diisi",
											validate: (v) =>
												v.replace(/\s+/g, "").length === 16 || "Harus 16 digit",
										})}
										onChange={handleCardNumberChange}
									/>
									{errors.cardNumber && (
										<p className="mt-1 text-[10px] text-danger">
											{errors.cardNumber.message}
										</p>
									)}
								</div>

								<div>
									<label
										htmlFor="cardExpiry"
										className="mb-1 block text-xs font-semibold text-content"
									>
										Masa Berlaku (MM/YY)
									</label>
									<input
										id="cardExpiry"
										type="text"
										placeholder="MM/YY"
										className="w-full rounded-lg border border-slate-200 bg-background px-3 py-2 text-sm outline-none focus:border-primary dark:border-slate-700 animate-none"
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
										<p className="mt-1 text-[10px] text-danger">
											{errors.cardExpiry.message}
										</p>
									)}
								</div>

								<div>
									<label
										htmlFor="cardCvv"
										className="mb-1 block text-xs font-semibold text-content"
									>
										CVV
									</label>
									<input
										id="cardCvv"
										type="password"
										placeholder="•••"
										className="w-full rounded-lg border border-slate-200 bg-background px-3 py-2 text-sm outline-none focus:border-primary dark:border-slate-700"
										{...register("cardCvv", {
											required: "CVV wajib diisi",
											minLength: { value: 3, message: "Minimal 3 digit" },
										})}
										onChange={handleCvvChange}
									/>
									{errors.cardCvv && (
										<p className="mt-1 text-[10px] text-danger">
											{errors.cardCvv.message}
										</p>
									)}
								</div>
							</div>

							<div className="flex gap-3 justify-end pt-3">
								<Button
									type="button"
									variant="secondary"
									onClick={onClose}
									className="text-sm"
								>
									Batal
								</Button>
								<Button
									type="submit"
									className="text-sm justify-center flex-1 sm:flex-initial"
								>
									Bayar dengan Kartu Kredit
								</Button>
							</div>
						</div>
					)}
				</div>
			);
		};

		if (!globalOpen || config?.id !== modalId) {
			openModal({
				id: modalId,
				type: "form",
				title: "Metode Pembayaran",
				maxWidthClassName: "max-w-md",
				content: renderContent(),
				onCancel: onClose,
				onSubmit: (e) => {
					e.preventDefault();
					if (activeTab === "wallet") {
						onWalletPay();
					} else {
						handleSubmit(onCcPay)(e);
					}
					return false; // prevent closing immediately without state updates
				},
			});
		}
	}, [
		isOpen,
		activeTab,
		balance,
		ccName,
		ccNumber,
		ccExpiry,
		ccCvv,
		errors.cardName,
		errors.cardNumber,
		errors.cardExpiry,
		errors.cardCvv,
	]);

	return null;
}
