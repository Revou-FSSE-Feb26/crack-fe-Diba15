"use client";

import { AlertCircle, CheckCircle, CreditCard, Wallet } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import TopUpModal from "@/components/profile/TopUpModal";
import { useModalStore } from "@/store/ModalStore";
import { useToastStore } from "@/store/ToastStore";
import { useTransactionStore } from "@/store/TransactionStore";
import { useUserManagementStore } from "@/store/UserManagementStore";
import { useUserStore } from "@/store/UserStore";
import { formatPrice } from "@/utils";
import {
	formatCardNumber,
	formatCvv,
	formatExpiry,
	getLastFourDigits,
} from "@/utils/payments";

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

	const onCloseRef = useRef(onClose);
	const onSubmitSuccessRef = useRef(onSubmitSuccess);

	useEffect(() => {
		onCloseRef.current = onClose;
		onSubmitSuccessRef.current = onSubmitSuccess;
	}, [onClose, onSubmitSuccess]);

	const [activeTab, setActiveTab] = useState<"wallet" | "credit_card">(
		"wallet",
	);
	const [isTopUpOpen, setIsTopUpOpen] = useState(false);

	const {
		register,
		handleSubmit,
		setValue,
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

	useEffect(() => {
		if (!isOpen) return;
		reset();
		setActiveTab("wallet");
	}, [isOpen, reset]);

	const balance = user?.balance ?? 0;
	const isBalanceSufficient = balance >= price;

	const handleTopUpSuccess = useCallback(
		(amount: number) => {
			if (!user) return;
			const nextBalance = balance + amount;
			updateUser(user.id, { balance: nextBalance });
			updateCurrentUser({ balance: nextBalance });

			// Log transaction
			useTransactionStore.getState().addTransaction({
				user_id: user.id,
				type: "topup",
				amount: amount,
				title: "Top Up E-Wallet via Credit Card",
			});

			addToast({
				message: `Berhasil Top Up ${formatPrice(amount)}. Saldo Anda sekarang ${formatPrice(nextBalance)}.`,
				type: "success",
			});
			setIsTopUpOpen(false);
		},
		[user, balance, updateUser, updateCurrentUser, addToast],
	);

	const onWalletPay = useCallback(() => {
		if (!isBalanceSufficient) {
			addToast({
				message:
					"Saldo tidak mencukupi. Silakan lakukan Top Up terlebih dahulu.",
				type: "error",
			});
			return;
		}
		onSubmitSuccessRef.current("wallet");
		closeModal();
	}, [isBalanceSufficient, addToast, closeModal]);

	const onCcPay = useCallback(
		(values: PaymentFormValues) => {
			const lastFour = getLastFourDigits(values.cardNumber);
			onSubmitSuccessRef.current("credit_card", lastFour);
			closeModal();
		},
		[closeModal],
	);

	// Formats CC Number: XXXX XXXX XXXX XXXX
	const handleCardNumberChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const formattedValue = formatCardNumber(e.target.value);
			setValue("cardNumber", formattedValue, { shouldValidate: true });
		},
		[setValue],
	);

	// Formats Expiry: MM/YY
	const handleExpiryChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const formattedValue = formatExpiry(e.target.value);
			setValue("cardExpiry", formattedValue, { shouldValidate: true });
		},
		[setValue],
	);

	// Formats CVV: 3 digits
	const handleCvvChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = formatCvv(e.target.value);
			setValue("cardCvv", value, { shouldValidate: true });
		},
		[setValue],
	);

	// render the CC and Wallet options dynamically inside the modal content
	useEffect(() => {
		// If the modal is not open, close it if the global open state matches
		if (!isOpen) {
			if (globalOpen && config?.id === modalId) {
				closeModal();
			}
			return;
		}

		// If top-up is open, close the modal if it's open and matches the modal ID
		if (isTopUpOpen) {
			if (globalOpen && config?.id === modalId) {
				closeModal();
			}
			return;
		}

		// Render the modal content
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
									onClick={() => setIsTopUpOpen(true)}
									className="px-3 py-1.5 text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors cursor-pointer"
								>
									Top Up Saldo
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
						</div>
					) : (
						<div className="space-y-4">
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
						</div>
					)}
				</div>
			);
		};

		// close the modal if it's not open and the global open state matches
		if (!isOpen) {
			if (globalOpen && config?.id === modalId) {
				closeModal();
			}
			return;
		}

		openModal({
			id: modalId,
			type: "form",
			title: "Metode Pembayaran",
			maxWidthClassName: "max-w-md",
			content: renderContent(),
			confirmLabel:
				activeTab === "wallet"
					? "Bayar dengan E-Wallet"
					: "Bayar dengan Kartu Kredit",
			cancelLabel: "Batal",
			confirmDisabled: activeTab === "wallet" ? !isBalanceSufficient : false,
			onCancel: () => {
				onCloseRef.current();
			},
			onSubmit: (e) => {
				e.preventDefault();
				if (activeTab === "wallet") {
					onWalletPay();
				} else {
					handleSubmit(onCcPay)(e);
				}
				return false;
			},
		});
	}, [
		isOpen,
		isTopUpOpen,
		activeTab,
		balance,
		errors,
		openModal,
		closeModal,
		globalOpen,
		config?.id,
		handleSubmit,
		register,
		price,
		onWalletPay,
		isBalanceSufficient,
		commissionTitle,
		onCcPay,
		handleExpiryChange,
		handleCardNumberChange,
		handleCvvChange,
		commissionId,
	]);

	return (
		<TopUpModal
			isOpen={isTopUpOpen}
			onClose={() => setIsTopUpOpen(false)}
			onSubmitSuccess={handleTopUpSuccess}
		/>
	);
}
