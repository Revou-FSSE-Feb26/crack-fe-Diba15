"use client";

import {
	ArrowLeft,
	Building2,
	CheckCircle2,
	CreditCard,
	Loader2,
	Lock,
	ShieldCheck,
	Sparkles,
	Wallet,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/form/Input";
import { useMounted } from "@/hooks/useMounted";
import { useModalStore } from "@/store/ModalStore";
import { useToastStore } from "@/store/ToastStore";
import { useTransactionStore } from "@/store/TransactionStore";
import { useUserStore } from "@/store/UserStore";
import { formatPrice } from "@/utils";
import { formatCardNumber, formatCvv, formatExpiry } from "@/utils/payments";

const QUICK_AMOUNTS = [50000, 100000, 250000, 500000, 1000000, 2000000];

const VA_BANK_OPTIONS = [
	{ id: "BCA", name: "BCA Virtual Account", code: "8801234" },
	{ id: "Mandiri", name: "Mandiri Bill Payment", code: "8901234" },
	{ id: "BNI", name: "BNI Virtual Account", code: "8701234" },
	{ id: "BRI", name: "BRIVA (BRI)", code: "8601234" },
	{ id: "GoPay", name: "GoPay / GoPay Coins", code: "0812345" },
	{ id: "OVO", name: "OVO Cash", code: "0812345" },
	{ id: "DANA", name: "DANA Dompet Digital", code: "0812345" },
];

interface CreditCardFormValues {
	cardName: string;
	cardNumber: string;
	cardExpiry: string;
	cardCvv: string;
}

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
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<CreditCardFormValues>({
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
				<Lock className="w-12 h-12 text-primary mx-auto" />
				<h1 className="text-2xl font-bold text-content">
					Login untuk Top Up Saldo
				</h1>
				<p className="text-sm text-content-muted">
					Silakan login terlebih dahulu untuk mengakses dompet digital TruBrush.
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
				{redirectUrl.includes("commissions")
					? "Kembali ke pembayaran komisi"
					: "Kembali ke profil saya"}
			</Link>

			{/* Page Header */}
			<div className="space-y-1">
				<h1 className="font-heading text-2xl sm:text-3xl font-bold text-content flex items-center gap-2.5">
					<Wallet className="w-7 h-7 text-primary" />
					Top Up Saldo E-Wallet
				</h1>
				<p className="text-sm text-content-muted">
					Isi saldo dompet TruBrush Anda untuk kemudahan bertransaksi komisi
					karya seni.
				</p>
			</div>

			{/* Main Grid */}
			<div className="grid gap-6 lg:grid-cols-12 items-start">
				{/* Left Column: Form & Method Selection */}
				<div className="lg:col-span-7 space-y-5">
					{/* Current Balance Card */}
					<div className="rounded-2xl border border-content/10 bg-surface p-5 space-y-2 shadow-sm">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
									<Wallet className="w-5 h-5" />
								</div>
								<div>
									<p className="text-xs text-content-muted">
										Saldo Dompet Saat Ini
									</p>
									<p className="font-heading text-xl sm:text-2xl font-bold text-content">
										{formatPrice(currentBalance)}
									</p>
								</div>
							</div>
							<span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
								Aktif & Siap Pakai
							</span>
						</div>
					</div>

					{/* 1. Pilih Nominal */}
					<div className="bg-surface border border-content/10 rounded-2xl p-5 space-y-4 shadow-sm">
						<h2 className="text-sm font-bold uppercase tracking-wider text-content-muted">
							1. Pilih Nominal Top Up
						</h2>

						{/* Quick Amount Grid */}
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
							{QUICK_AMOUNTS.map((amt) => {
								const isSelected = !customAmount && selectedAmount === amt;
								return (
									<button
										key={amt}
										type="button"
										onClick={() => handleQuickAmountClick(amt)}
										className={`py-3 px-3 rounded-xl border text-sm font-bold transition-all cursor-pointer text-center ${
											isSelected
												? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20 shadow-sm"
												: "border-content/10 bg-background text-content hover:border-content/20"
										}`}
									>
										{formatPrice(amt).replace(",00", "")}
									</button>
								);
							})}
						</div>

						{/* Custom Amount Input */}
						<div className="space-y-1 pt-1">
							<Input
								label="Atau Masukkan Nominal Kustom (Min. Rp 10.000)"
								type="number"
								placeholder="e.g. 750000"
								value={customAmount}
								onChange={handleCustomAmountChange}
								min={10000}
							/>
							{activeAmount < 10000 && activeAmount > 0 && (
								<p className="text-danger text-xs">
									Minimal nominal top-up adalah Rp 10.000.
								</p>
							)}
						</div>
					</div>

					{/* 2. Pilih Metode Pembayaran */}
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
										onChange={() => setPaymentMethod("cc")}
										className="radio radio-primary radio-sm mt-1"
									/>
								</label>

								{/* CC Form inside */}
								{paymentMethod === "cc" && (
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
													<p className="text-danger text-xs">
														{errors.cardName.message}
													</p>
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
															val.replace(/\s+/g, "").length === 16 ||
															"Harus 16 digit.",
													})}
													onChange={handleCardNumberChange}
												/>
												{errors.cardNumber && (
													<p className="text-danger text-xs">
														{errors.cardNumber.message}
													</p>
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
														})}
														onChange={handleExpiryChange}
													/>
													{errors.cardExpiry && (
														<p className="text-danger text-xs">
															{errors.cardExpiry.message}
														</p>
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
														})}
														onChange={handleCvvChange}
													/>
													{errors.cardCvv && (
														<p className="text-danger text-xs">
															{errors.cardCvv.message}
														</p>
													)}
												</div>
											</div>
										</div>
									</div>
								)}
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
										onChange={() => setPaymentMethod("va")}
										className="radio radio-primary radio-sm mt-1"
									/>
								</label>

								{paymentMethod === "va" && (
									<div className="mt-4 pt-4 border-t border-content/10 space-y-3">
										<label
											htmlFor="vaBankSelect"
											className="block text-xs font-semibold text-content"
										>
											Pilih Bank / E-Wallet Pembayaran
										</label>
										<select
											id="vaBankSelect"
											value={selectedVa}
											onChange={(e) => setSelectedVa(e.target.value)}
											className="select select-bordered w-full rounded-lg bg-surface text-content text-sm"
										>
											{VA_BANK_OPTIONS.map((opt) => (
												<option key={opt.id} value={opt.name}>
													{opt.name}
												</option>
											))}
										</select>

										<div className="p-3 bg-content/5 rounded-xl border border-content/10 text-xs text-content-muted space-y-1">
											<p className="font-semibold text-content">
												Instruksi Pembayaran:
											</p>
											<p>
												Nomor Virtual Account simulasi akan otomatis
												terkonfirmasi saat Anda menekan tombol di samping.
											</p>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Right Column: Invoice & Execution Summary */}
				<div className="lg:col-span-5 space-y-4">
					<h2 className="text-sm font-bold uppercase tracking-wider text-content-muted">
						Ringkasan Tagihan
					</h2>

					<div className="bg-surface border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-5 shadow-sm">
						<div className="space-y-3 pb-4 border-b border-content/10 text-xs sm:text-sm">
							<div className="flex justify-between text-content-muted">
								<span>Nominal Top Up</span>
								<span className="font-semibold text-content">
									{formatPrice(activeAmount)}
								</span>
							</div>

							<div className="flex justify-between text-content-muted">
								<span>Biaya Layanan Admin</span>
								<span className="font-semibold text-emerald-600 dark:text-emerald-400">
									Rp 0 (Bebas Biaya Promo)
								</span>
							</div>

							<div className="flex justify-between text-content-muted">
								<span>Metode</span>
								<span className="font-medium text-content">
									{paymentMethod === "cc" ? "Kartu Kredit / Debit" : selectedVa}
								</span>
							</div>

							<div className="pt-2 border-t border-content/10 flex justify-between items-baseline">
								<span className="font-bold text-sm text-content">
									Total Tagihan
								</span>
								<span className="font-heading text-xl font-bold text-primary">
									{formatPrice(activeAmount)}
								</span>
							</div>

							<div className="flex justify-between text-xs text-content-muted pt-1">
								<span>Saldo Akun Setelah Top Up</span>
								<span className="font-bold text-emerald-600 dark:text-emerald-400">
									{formatPrice(finalBalanceAfter)}
								</span>
							</div>
						</div>

						{/* Guarantee info */}
						<div className="p-3.5 bg-primary/10 text-content rounded-xl border border-primary/20 text-xs leading-relaxed space-y-1">
							<div className="flex items-center gap-1.5 font-bold text-primary">
								<CheckCircle2 className="w-4 h-4 shrink-0" />
								<span>Saldo Masuk Instan</span>
							</div>
							<p className="text-[11px] text-content-muted">
								Saldo akan langsung ditambahkan ke akun dompet Anda dan siap
								digunakan untuk memesan komisi karya seni.
							</p>
						</div>

						{/* Action Button */}
						{paymentMethod === "cc" ? (
							<Button
								type="button"
								disabled={activeAmount < 10000 || isSubmitting}
								onClick={handleSubmit(onConfirmSubmit)}
								className="w-full py-3 justify-center text-sm font-semibold flex items-center gap-2 shadow-sm"
							>
								{isSubmitting ? (
									<>
										<Loader2 className="w-4 h-4 animate-spin" />
										Memproses Pembayaran...
									</>
								) : (
									<>
										<Lock className="w-4 h-4" />
										Bayar Top Up ({formatPrice(activeAmount)})
									</>
								)}
							</Button>
						) : (
							<Button
								type="button"
								disabled={activeAmount < 10000 || isSubmitting}
								onClick={onConfirmSubmit}
								className="w-full py-3 justify-center text-sm font-semibold flex items-center gap-2 shadow-sm"
							>
								{isSubmitting ? (
									<>
										<Loader2 className="w-4 h-4 animate-spin" />
										Memproses Pembayaran...
									</>
								) : (
									<>
										<Lock className="w-4 h-4" />
										Konfirmasi Top Up ({formatPrice(activeAmount)})
									</>
								)}
							</Button>
						)}

						<p className="text-[10px] text-center text-content-muted flex items-center justify-center gap-1">
							<ShieldCheck className="w-3.5 h-3.5 text-primary" />
							Pembayaran aman terenkripsi SSL 256-bit
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
