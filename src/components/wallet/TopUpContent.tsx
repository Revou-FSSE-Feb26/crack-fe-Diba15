"use client";

import { ArrowLeft, Wallet } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "@/components/ui/form/Input";
import AmountPresetSelector from "@/components/wallet/AmountPresetSelector";
import {
	TopUpCardForm,
	type TopUpCardFormValues,
} from "@/components/wallet/topup/TopUpCardForm";
import { TopUpMethodSelector } from "@/components/wallet/topup/TopUpMethodSelector";
import { TopUpSummaryCard } from "@/components/wallet/topup/TopUpSummaryCard";
import { useMounted } from "@/hooks/useMounted";
import { useModalStore } from "@/store/ModalStore";
import { useToastStore } from "@/store/ToastStore";
import { useTransactionStore } from "@/store/TransactionStore";
import { useUserStore } from "@/store/UserStore";
import { formatPrice } from "@/utils";
import { formatCardNumber, formatCvv, formatExpiry } from "@/utils/payments";

const QUICK_AMOUNTS = [50000, 100000, 250000, 500000, 1000000, 2000000];

export function TopUpContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const redirectUrl = searchParams.get("redirect") || "/profile";

	const mounted = useMounted();
	const { user, isAuthenticated } = useUserStore();
	const { addToast } = useToastStore();
	const { openModal } = useModalStore();

	const [paymentMethod, setPaymentMethod] = useState<"cc" | "va">("cc");
	const [selectedAmount, setSelectedAmount] = useState<number>(100000);
	const [customAmount, setCustomAmount] = useState<string>("");
	const [selectedVa, setSelectedVa] = useState<string>("BCA");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const activeAmount = customAmount
		? Number(customAmount) || 0
		: selectedAmount;
	const currentBalance = user?.balance ?? 0;
	const finalBalanceAfter = currentBalance + activeAmount;

	const {
		register,
		setValue,
		formState: { errors },
	} = useForm<TopUpCardFormValues>({
		defaultValues: {
			cardName: "DIMAS PRASETYO",
			cardNumber: "4242 4242 4242 4242",
			cardExpiry: "12/28",
			cardCvv: "123",
		},
		mode: "onChange",
	});

	const handleCardNumberChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const formattedValue = formatCardNumber(e.target.value);
			setValue("cardNumber", formattedValue, { shouldValidate: true });
		},
		[setValue],
	);

	const handleExpiryChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const formattedValue = formatExpiry(e.target.value);
			setValue("cardExpiry", formattedValue, { shouldValidate: true });
		},
		[setValue],
	);

	const handleCvvChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = formatCvv(e.target.value);
			setValue("cardCvv", value, { shouldValidate: true });
		},
		[setValue],
	);

	const handleQuickAmountClick = (amount: number) => {
		setSelectedAmount(amount);
		setCustomAmount("");
	};

	const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		setCustomAmount(val);
	};

	const executeTopUp = async () => {
		if (!user) return;

		if (activeAmount < 10000) {
			addToast({
				message: "Minimal top-up saldo adalah Rp 10.000.",
				type: "error",
			});
			return;
		}

		setIsSubmitting(true);
		try {
			const res = await useUserStore.getState().topUp(activeAmount);

			if (!res.success) {
				addToast({
					message: res.message,
					type: "error",
				});
				return;
			}

			// Catat mutasi di transaction store
			const methodTitle =
				paymentMethod === "cc"
					? "Top Up E-Wallet via Kartu Kredit"
					: `Top Up E-Wallet via ${selectedVa}`;

			useTransactionStore.getState().addTransaction({
				user_id: user.id,
				type: "topup",
				amount: activeAmount,
				title: methodTitle,
			});

			addToast({
				message: `Berhasil Top Up ${formatPrice(activeAmount)}. Saldo Anda telah diperbarui.`,
				type: "success",
			});

			router.push(redirectUrl);
		} finally {
			setIsSubmitting(false);
		}
	};

	const onConfirmSubmit = () => {
		if (activeAmount < 10000) {
			addToast({
				message: "Minimal top-up saldo adalah Rp 10.000.",
				type: "error",
			});
			return;
		}

		openModal({
			title: "Konfirmasi Pengisian Saldo",
			description: `Apakah Anda ingin mengisi saldo sebesar ${formatPrice(activeAmount)} menggunakan metode ${
				paymentMethod === "cc" ? "Kartu Kredit/Debit" : selectedVa
			}?`,
			type: "confirm",
			confirmLabel: "Top Up Sekarang",
			cancelLabel: "Batal",
			onConfirm: () => executeTopUp(),
		});
	};

	// Loading State
	if (!mounted) {
		return (
			<div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
				<div className="skeleton h-6 w-48 rounded-md" />
				<div className="grid gap-6 md:grid-cols-12">
					<div className="md:col-span-7 space-y-4">
						<div className="skeleton h-44 w-full rounded-2xl" />
						<div className="skeleton h-44 w-full rounded-2xl" />
					</div>
					<div className="md:col-span-5 space-y-4">
						<div className="skeleton h-80 w-full rounded-2xl" />
					</div>
				</div>
			</div>
		);
	}

	// Auth Guard
	if (!isAuthenticated || !user) {
		return (
			<div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
				<Wallet className="w-12 h-12 text-primary mx-auto" />
				<h1 className="text-2xl font-bold text-content">
					Login untuk Top Up E-Wallet
				</h1>
				<p className="text-sm text-content-muted">
					Isi ulang saldo dompet TruBrush untuk mempermudah transaksi komisi
					secara instan tanpa biaya admin.
				</p>
				<Link
					href="/login"
					className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-background hover:bg-primary-hover transition-colors"
				>
					Masuk ke Akun
				</Link>
			</div>
		);
	}

	return (
		<div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
			{/* Top Navigation */}
			<Link
				href={redirectUrl}
				className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
			>
				<ArrowLeft className="w-4 h-4" />
				Kembali ke halaman sebelumnya
			</Link>

			{/* Page Header */}
			<div className="space-y-1">
				<h1 className="font-heading text-2xl sm:text-3xl font-bold text-content flex items-center gap-2.5">
					<Wallet className="w-7 h-7 text-primary" />
					Top Up Saldo E-Wallet
				</h1>
				<p className="text-sm text-content-muted">
					Isi saldo akun TruBrush Anda untuk pembayaran komisi instan dan aman
					dengan proteksi Escrow.
				</p>
			</div>

			{/* Main Grid */}
			<div className="grid gap-6 lg:grid-cols-12 items-start">
				{/* Left Column: Input Nominal & Metode */}
				<div className="lg:col-span-7 space-y-5">
					{/* 1. Pilih Nominal Top Up */}
					<div className="bg-surface border border-content/10 rounded-2xl p-5 space-y-4 shadow-sm">
						<h2 className="text-sm font-bold uppercase tracking-wider text-content-muted">
							1. Pilih Nominal Top Up
						</h2>

						{/* Quick Amount Pills */}
						<AmountPresetSelector
							amounts={QUICK_AMOUNTS}
							selectedAmount={selectedAmount}
							onSelect={handleQuickAmountClick}
						/>

						{/* Custom Amount Input */}
						<div className="space-y-1.5 pt-2">
							<Input
								label="Atau Masukkan Nominal Kustom (Min. Rp 10.000)"
								type="number"
								placeholder="e.g. 150000"
								value={customAmount}
								onChange={handleCustomAmountChange}
							/>
							{activeAmount < 10000 && activeAmount > 0 && (
								<p className="text-danger text-xs">
									Minimal nominal top-up adalah Rp 10.000.
								</p>
							)}
						</div>
					</div>

					{/* 2. Pilih Metode Pembayaran */}
					<TopUpMethodSelector
						paymentMethod={paymentMethod}
						onSelectMethod={setPaymentMethod}
						selectedVa={selectedVa}
						onSelectVa={setSelectedVa}
					>
						<TopUpCardForm
							register={register}
							errors={errors}
							onCardNumberChange={handleCardNumberChange}
							onExpiryChange={handleExpiryChange}
							onCvvChange={handleCvvChange}
						/>
					</TopUpMethodSelector>
				</div>

				{/* Right Column: Ringkasan Transaksi */}
				<div className="lg:col-span-5">
					<TopUpSummaryCard
						currentBalance={currentBalance}
						activeAmount={activeAmount}
						finalBalanceAfter={finalBalanceAfter}
						paymentMethod={paymentMethod}
						selectedVa={selectedVa}
						isSubmitting={isSubmitting}
						onSubmit={onConfirmSubmit}
					/>
				</div>
			</div>
		</div>
	);
}
