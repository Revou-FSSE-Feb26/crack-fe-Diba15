"use client";

import {
	AlertCircle,
	AlertTriangle,
	ArrowLeft,
	Briefcase,
	CheckCircle2,
	CreditCard,
	Lock,
	ShieldCheck,
	Sparkles,
	Wallet,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import AvatarInitials from "@/components/home/AvatarInitials";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/form/Input";
import users from "@/data/users";
import {
	useCommissionDetail,
	usePayCommission,
} from "@/hooks/useCommissionQueries";
import { useMounted } from "@/hooks/useMounted";
import { useToastStore } from "@/store/ToastStore";
import { useUserStore } from "@/store/UserStore";
import { formatDate, formatPrice } from "@/utils";
import {
	formatCardNumber,
	formatCvv,
	formatExpiry,
	getLastFourDigits,
} from "@/utils/payments";

interface CommissionPaymentContentProps {
	commissionId: string;
}

interface PaymentFormValues {
	cardName: string;
	cardNumber: string;
	cardExpiry: string;
	cardCvv: string;
}

export function CommissionPaymentContent({
	commissionId,
}: CommissionPaymentContentProps) {
	const router = useRouter();
	const mounted = useMounted();
	const { user, isAuthenticated } = useUserStore();
	const { addToast } = useToastStore();

	const { data: commission, isLoading: isCommissionLoading } =
		useCommissionDetail(commissionId);
	const payMutation = usePayCommission();

	const [paymentMethod, setPaymentMethod] = useState<"wallet" | "credit_card">(
		"wallet",
	);

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<PaymentFormValues>({
		defaultValues: {
			cardName: "",
			cardNumber: "",
			cardExpiry: "",
			cardCvv: "",
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

	const handlePaymentSubmit = async (formData?: PaymentFormValues) => {
		if (!commission) return;

		if (paymentMethod === "wallet") {
			const currentBalance = user?.balance ?? 0;
			if (currentBalance < commission.price) {
				addToast({
					message:
						"Saldo E-Wallet Anda tidak mencukupi. Silakan lakukan Top Up terlebih dahulu.",
					type: "error",
				});
				return;
			}

			payMutation.mutate(
				{
					id: commission.id,
					paymentMethod: "wallet",
				},
				{
					onSuccess: () => {
						router.push(`/commissions/${commission.id}`);
					},
				},
			);
		} else {
			if (!formData) return;
			const lastFour = getLastFourDigits(formData.cardNumber);

			payMutation.mutate(
				{
					id: commission.id,
					paymentMethod: "credit_card",
					cardLastFour: lastFour,
				},
				{
					onSuccess: () => {
						router.push(`/commissions/${commission.id}`);
					},
				},
			);
		}
	};

	// Loading State
	if (!mounted || isCommissionLoading) {
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
				<Briefcase className="w-12 h-12 text-primary mx-auto" />
				<h1 className="text-2xl font-bold text-content">
					Login untuk Melakukan Pembayaran
				</h1>
				<p className="text-sm text-content-muted">
					Halaman pembayaran komisi hanya dapat diakses oleh klien pemesan.
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

	// Commission Not Found Guard
	if (!commission) {
		return (
			<div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
				<AlertCircle className="w-12 h-12 text-content-muted mx-auto" />
				<h1 className="text-2xl font-bold text-content">
					Pesanan Komisi Tidak Ditemukan
				</h1>
				<p className="text-sm text-content-muted">
					Pesanan ini belum tersedia atau sudah tidak ada di sistem.
				</p>
				<Link
					href="/commissions"
					className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-background hover:bg-primary-hover transition-colors"
				>
					<ArrowLeft className="w-4 h-4" />
					Kembali ke Daftar Komisi
				</Link>
			</div>
		);
	}

	// Ownership Guard
	const isClientOwner = commission.client_id === user.id;
	if (!isClientOwner) {
		return (
			<div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
				<AlertTriangle className="w-12 h-12 text-danger mx-auto" />
				<h1 className="text-2xl font-bold text-content">
					Akses Pembayaran Ditolak
				</h1>
				<p className="text-sm text-content-muted">
					Hanya klien yang memesan komisi ini yang dapat mengakses halaman
					pembayaran.
				</p>
				<Link
					href={`/commissions/${commission.id}`}
					className="inline-flex items-center justify-center gap-2 rounded-xl bg-surface border border-content/10 px-5 py-2.5 text-sm font-semibold text-content hover:bg-content/5 transition-colors"
				>
					<ArrowLeft className="w-4 h-4" />
					Kembali ke Detail Komisi
				</Link>
			</div>
		);
	}

	// Status Guard: Check if already paid
	if (
		commission.payment_status === "paid" ||
		commission.status === "completed"
	) {
		return (
			<div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
				<CheckCircle2 className="w-12 h-12 text-success mx-auto" />
				<h1 className="text-2xl font-bold text-content">
					Komisi Sudah Dibayar
				</h1>
				<p className="text-sm text-content-muted">
					Dana sebesar {formatPrice(commission.price)} telah diamankan di Escrow
					TruBrush dan pengerjaan sedang berlangsung.
				</p>
				<Link
					href={`/commissions/${commission.id}`}
					className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-background hover:bg-primary-hover transition-colors"
				>
					Lihat Detail & Progress Komisi
				</Link>
			</div>
		);
	}

	// Status Guard: Check if commission was not yet accepted
	if (commission.status !== "accepted") {
		return (
			<div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
				<AlertCircle className="w-12 h-12 text-warning mx-auto" />
				<h1 className="text-2xl font-bold text-content">
					Menunggu Persetujuan Artis
				</h1>
				<p className="text-sm text-content-muted">
					Pesanan komisi ini belum diterima oleh artis atau saat ini tidak dalam
					status menunggu pembayaran.
				</p>
				<Link
					href={`/commissions/${commission.id}`}
					className="inline-flex items-center justify-center gap-2 rounded-xl bg-surface border border-content/10 px-5 py-2.5 text-sm font-semibold text-content hover:bg-content/5 transition-colors"
				>
					<ArrowLeft className="w-4 h-4" />
					Kembali ke Detail Komisi
				</Link>
			</div>
		);
	}

	const artist = users.find((item) => item.id === commission.artists_id);
	const artistName = artist?.name ?? "Artist TruBrush";
	const userBalance = user.balance ?? 0;
	const isBalanceSufficient = userBalance >= commission.price;
	const balanceShortage = Math.max(0, commission.price - userBalance);

	return (
		<div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
			{/* Top Navigation */}
			<Link
				href={`/commissions/${commission.id}`}
				className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
			>
				<ArrowLeft className="w-4 h-4" />
				Kembali ke detail pesanan
			</Link>

			{/* Page Header */}
			<div className="space-y-1">
				<h1 className="font-heading text-2xl sm:text-3xl font-bold text-content flex items-center gap-2.5">
					<CreditCard className="w-7 h-7 text-primary" />
					Checkout & Pembayaran Komisi
				</h1>
				<p className="text-sm text-content-muted">
					Selesaikan pembayaran aman via Escrow TruBrush untuk memulai
					pengerjaan karya oleh Artis.
				</p>
			</div>

			{/* Main Content Grid */}
			<div className="grid gap-6 lg:grid-cols-12 items-start">
				{/* Left Column: Payment Method Selection & Forms */}
				<div className="lg:col-span-7 space-y-4">
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
								onChange={() => setPaymentMethod("wallet")}
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
												{formatPrice(userBalance - commission.price)}
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
											href={`/topup?redirect=/commissions/${commission.id}/payment`}
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
								onChange={() => setPaymentMethod("credit_card")}
								className="radio radio-primary radio-sm mt-1"
							/>
						</label>

						{/* Credit Card Form (shown when active) */}
						{paymentMethod === "credit_card" && (
							<div className="mt-4 pt-4 border-t border-content/10 space-y-3">
								<div className="p-3 rounded-xl bg-content/5 border border-content/10 text-xs text-content-muted flex items-center gap-2">
									<Sparkles className="w-4 h-4 text-primary shrink-0" />
									<span>
										Mode Sandbox Testing: Gunakan kartu dummy{" "}
										<strong className="text-content font-mono font-bold">
											4242 4242 4242 4242
										</strong>
									</span>
								</div>

								<div className="space-y-3">
									<div className="space-y-1">
										<Input
											label="Nama Pemegang Kartu"
											placeholder="e.g. DIMAS PRASETYO"
											required
											{...register("cardName", {
												required: "Nama pemegang kartu wajib diisi.",
												minLength: {
													value: 3,
													message: "Nama minimal 3 karakter.",
												},
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
											label="Nomor Kartu Kredit / Debit"
											placeholder="4242 4242 4242 4242"
											required
											maxLength={19}
											{...register("cardNumber", {
												required: "Nomor kartu wajib diisi.",
												validate: (val) =>
													val.replace(/\s+/g, "").length === 16 ||
													"Nomor kartu harus terdiri dari 16 digit.",
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
												placeholder="MM/YY"
												required
												maxLength={5}
												{...register("cardExpiry", {
													required: "Masa berlaku wajib diisi.",
													pattern: {
														value: /^(0[1-9]|1[0-2])\/?([0-9]{2})$/,
														message: "Format harus MM/YY (contoh: 12/28).",
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

										<div className="space-y-1">
											<Input
												label="CVV / CVC"
												placeholder="123"
												type="password"
												required
												maxLength={4}
												{...register("cardCvv", {
													required: "CVV wajib diisi.",
													minLength: {
														value: 3,
														message: "CVV minimal 3 digit.",
													},
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
				</div>

				{/* Right Column: Order & Escrow Protection Summary */}
				<div className="lg:col-span-5 space-y-4">
					<h2 className="text-sm font-bold uppercase tracking-wider text-content-muted">
						Ringkasan Pesanan
					</h2>

					<div className="bg-surface border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-5 shadow-sm">
						{/* Item info */}
						<div className="flex items-start gap-3 pb-4 border-b border-content/10">
							<AvatarInitials
								name={artistName}
								className="w-10 h-10 text-xs shrink-0"
							/>
							<div className="min-w-0 flex-1">
								<h3 className="font-bold text-sm sm:text-base text-content line-clamp-1">
									{commission.commission_title}
								</h3>
								<p className="text-xs text-content-muted mt-0.5">
									Artis: <strong className="text-content">{artistName}</strong>
								</p>
								<p className="text-[11px] text-content-muted mt-1">
									Dipesan: {formatDate(commission.created_at)}
								</p>
							</div>
						</div>

						{/* Invoice breakdown */}
						<div className="space-y-2.5 text-xs sm:text-sm">
							<div className="flex justify-between text-content-muted">
								<span>Harga Jasa Komisi</span>
								<span className="font-medium text-content">
									{formatPrice(commission.price)}
								</span>
							</div>
							<div className="flex justify-between text-content-muted">
								<span>Biaya Layanan Escrow</span>
								<span className="font-semibold text-emerald-600 dark:text-emerald-400">
									Rp 0 (Gratis)
								</span>
							</div>

							<div className="pt-3 border-t border-content/10 flex justify-between items-baseline">
								<span className="font-bold text-sm text-content">
									Total Tagihan
								</span>
								<span className="font-heading text-xl font-bold text-primary">
									{formatPrice(commission.price)}
								</span>
							</div>
						</div>

						{/* Escrow Guarantee Box */}
						<div className="p-3.5 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 rounded-xl border border-emerald-500/20 text-xs leading-relaxed space-y-1">
							<div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
								<ShieldCheck className="w-4 h-4 shrink-0" />
								<span>Jaminan Perlindungan Escrow TruBrush</span>
							</div>
							<p className="text-[11px] opacity-90">
								Dana Anda ditahan dengan aman di rekening penampung (Escrow) dan
								baru akan dicairkan ke Artis setelah Anda menyetujui hasil karya
								akhir.
							</p>
						</div>

						{/* Execution Pay Button */}
						{paymentMethod === "wallet" ? (
							<Button
								type="button"
								disabled={!isBalanceSufficient || payMutation.isPending}
								onClick={() => handlePaymentSubmit()}
								className="w-full py-3 justify-center text-sm font-semibold flex items-center gap-2 shadow-sm"
							>
								{payMutation.isPending ? (
									<>Memproses Pembayaran Escrow...</>
								) : (
									<>
										<Lock className="w-4 h-4" />
										Bayar Komisi ({formatPrice(commission.price)})
									</>
								)}
							</Button>
						) : (
							<Button
								type="button"
								disabled={payMutation.isPending}
								onClick={handleSubmit(handlePaymentSubmit)}
								className="w-full py-3 justify-center text-sm font-semibold flex items-center gap-2 shadow-sm"
							>
								{payMutation.isPending ? (
									<>Memproses Transaksi Kartu...</>
								) : (
									<>
										<Lock className="w-4 h-4" />
										Bayar via Kartu ({formatPrice(commission.price)})
									</>
								)}
							</Button>
						)}

						<p className="text-[10px] text-center text-content-muted flex items-center justify-center gap-1">
							<Lock className="w-3 h-3 text-content-muted" />
							Koneksi aman terenkripsi SSL 256-bit
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
