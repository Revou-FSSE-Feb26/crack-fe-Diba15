"use client";

import {
	AlertCircle,
	AlertTriangle,
	ArrowLeft,
	ArrowUpRight,
	CheckCircle2,
	Lock,
	Wallet,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
	WithdrawDestinationForm,
	type WithdrawFormValues,
} from "@/components/wallet/withdraw/WithdrawDestinationForm";
import { WithdrawSummaryCard } from "@/components/wallet/withdraw/WithdrawSummaryCard";
import { useMounted } from "@/hooks/useMounted";
import { useModalStore } from "@/store/ModalStore";
import { useToastStore } from "@/store/ToastStore";
import { useTransactionStore } from "@/store/TransactionStore";
import { useUserStore } from "@/store/UserStore";
import { formatPrice } from "@/utils";

export function WithdrawContent() {
	const router = useRouter();
	const mounted = useMounted();
	const { user, isAuthenticated, isArtist } = useUserStore();
	const { addToast } = useToastStore();
	const { openModal } = useModalStore();

	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<WithdrawFormValues>({
		defaultValues: {
			amount: 100000,
			bankName: "BCA",
			accountNumber: "",
			accountName: "",
		},
		mode: "onChange",
	});

	const currentBalance = user?.balance ?? 0;
	const enteredAmount = watch("amount") || 0;
	const selectedBank = watch("bankName");

	const isEligibleToWithdraw = currentBalance >= 100000;
	const adminFee = enteredAmount > 0 ? 2500 : 0;
	const netAmount = Math.max(0, enteredAmount - adminFee);
	const balanceAfterWithdraw = Math.max(0, currentBalance - enteredAmount);

	const handleQuickAmountSelect = (amount: number) => {
		const targetAmount = Math.min(amount, currentBalance);
		setValue("amount", targetAmount, { shouldValidate: true });
	};

	const handleWithdrawAll = () => {
		setValue("amount", currentBalance, { shouldValidate: true });
	};

	const onConfirmWithdraw = (values: WithdrawFormValues) => {
		if (!user) return;

		if (Number(values.amount) < 100000) {
			addToast({
				message: "Minimal penarikan dana adalah Rp 100.000.",
				type: "error",
			});
			return;
		}

		if (Number(values.amount) > currentBalance) {
			addToast({
				message: "Saldo Anda tidak mencukupi untuk nominal penarikan ini.",
				type: "error",
			});
			return;
		}

		openModal({
			title: "Konfirmasi Pencairan Dana",
			description: `Apakah Anda yakin ingin mencairkan saldo sebesar ${formatPrice(
				Number(values.amount),
			)} ke ${values.bankName} - ${values.accountNumber} a/n ${
				values.accountName
			}?`,
			type: "confirm",
			confirmLabel: "Cairkan Sekarang",
			cancelLabel: "Batal",
			onConfirm: async () => {
				setIsSubmitting(true);
				try {
					const res = await useUserStore.getState().withdraw({
						amount: Number(values.amount),
						bankName: values.bankName,
						accountNumber: values.accountNumber,
						accountName: values.accountName,
					});

					if (!res.success) {
						addToast({
							message: res.message,
							type: "error",
						});
						return;
					}

					// Catat transaksi mutasi di store
					useTransactionStore.getState().addTransaction({
						user_id: user.id,
						type: "withdraw",
						amount: Number(values.amount),
						title: `Pencairan Dana ke ${values.bankName} (${values.accountNumber})`,
					});

					addToast({
						message: res.message,
						type: "success",
					});

					router.push("/profile");
				} finally {
					setIsSubmitting(false);
				}
			},
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
					Login untuk Mencairkan Dana
				</h1>
				<p className="text-sm text-content-muted">
					Halaman pencairan dana hanya dapat diakses oleh artis yang terdaftar.
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

	// Role Guard: Only Artist
	if (!isArtist()) {
		return (
			<div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
				<AlertTriangle className="w-12 h-12 text-warning mx-auto" />
				<h1 className="text-2xl font-bold text-content">Khusus Akun Artis</h1>
				<p className="text-sm text-content-muted">
					Fitur pencairan dana (*payout*) khusus ditujukan bagi Artis untuk
					menarik penghasilan komisi.
				</p>
				<Link
					href="/profile"
					className="inline-flex items-center justify-center gap-2 rounded-xl bg-surface border border-content/10 px-5 py-2.5 text-sm font-semibold text-content hover:bg-content/5 transition-colors"
				>
					<ArrowLeft className="w-4 h-4" />
					Kembali ke Profil
				</Link>
			</div>
		);
	}

	const isFormValid =
		enteredAmount >= 100000 &&
		enteredAmount <= currentBalance &&
		isEligibleToWithdraw;

	return (
		<div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
			{/* Top Navigation */}
			<Link
				href="/profile"
				className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
			>
				<ArrowLeft className="w-4 h-4" />
				Kembali ke profil saya
			</Link>

			{/* Page Header */}
			<div className="space-y-1">
				<h1 className="font-heading text-2xl sm:text-3xl font-bold text-content flex items-center gap-2.5">
					<ArrowUpRight className="w-7 h-7 text-emerald-500" />
					Pencairan Dana Artis (Payout)
				</h1>
				<p className="text-sm text-content-muted">
					Tarik saldo hasil pesanan komisi Anda langsung ke rekening bank atau
					e-wallet lokal.
				</p>
			</div>

			{/* Main Grid */}
			<div className="grid gap-6 lg:grid-cols-12 items-start">
				{/* Left Column: Form Penarikan */}
				<div className="lg:col-span-7 space-y-5">
					{/* Balance Status Card */}
					<div className="rounded-2xl border border-content/10 bg-surface p-5 space-y-3 shadow-sm">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2.5">
								<div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
									<Wallet className="w-5 h-5" />
								</div>
								<div>
									<p className="text-xs text-content-muted">Saldo Tersedia</p>
									<p className="font-heading text-xl sm:text-2xl font-bold text-content">
										{formatPrice(currentBalance)}
									</p>
								</div>
							</div>

							{isEligibleToWithdraw ? (
								<span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20">
									<CheckCircle2 className="w-3.5 h-3.5" />
									Siap Ditarik
								</span>
							) : (
								<span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-danger/10 text-danger px-2.5 py-1 rounded-full border border-danger/20">
									<AlertCircle className="w-3.5 h-3.5" />
									Kurang dari Min. Rp 100.000
								</span>
							)}
						</div>

						{!isEligibleToWithdraw && (
							<div className="p-3 rounded-xl bg-danger/5 border border-danger/20 text-xs text-content-muted flex items-start gap-2">
								<AlertCircle className="w-4 h-4 text-danger shrink-0 mt-0.5" />
								<span>
									Saldo Anda saat ini belum mencapai batas minimal penarikan
									dana (<strong>Rp 100.000</strong>). Kumpulkan saldo dari
									komisi yang telah diselesaikan untuk dapat mencairkannya.
								</span>
							</div>
						)}
					</div>

					{/* Form Destination & Amounts */}
					<form onSubmit={handleSubmit(onConfirmWithdraw)}>
						<WithdrawDestinationForm
							register={register}
							errors={errors}
							enteredAmount={enteredAmount}
							currentBalance={currentBalance}
							isEligibleToWithdraw={isEligibleToWithdraw}
							onQuickAmountSelect={handleQuickAmountSelect}
							onWithdrawAll={handleWithdrawAll}
						/>
					</form>
				</div>

				{/* Right Column: Summary Card */}
				<div className="lg:col-span-5">
					<WithdrawSummaryCard
						currentBalance={currentBalance}
						enteredAmount={enteredAmount}
						adminFee={adminFee}
						netAmount={netAmount}
						balanceAfterWithdraw={balanceAfterWithdraw}
						selectedBank={selectedBank}
						isSubmitting={isSubmitting}
						isFormValid={isFormValid}
						onSubmit={handleSubmit(onConfirmWithdraw)}
					/>
				</div>
			</div>
		</div>
	);
}
