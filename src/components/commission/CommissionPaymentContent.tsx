"use client";

import {
	AlertCircle,
	AlertTriangle,
	ArrowLeft,
	Briefcase,
	CheckCircle2,
	CreditCard,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import {
	PaymentCardForm,
	type PaymentFormValues,
} from "@/components/commission/payment/PaymentCardForm";
import { PaymentMethodSelector } from "@/components/commission/payment/PaymentMethodSelector";
import { PaymentSummaryCard } from "@/components/commission/payment/PaymentSummaryCard";
import {
	useCommissionDetail,
	usePayCommission,
} from "@/hooks/useCommissionQueries";
import { useMounted } from "@/hooks/useMounted";
import { useToastStore } from "@/store/ToastStore";
import { useUserStore } from "@/store/UserStore";
import { formatPrice } from "@/utils";
import {
	formatCardNumber,
	formatCvv,
	formatExpiry,
	getLastFourDigits,
} from "@/utils/payments";

interface CommissionPaymentContentProps {
	commissionId: string;
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

	const artistName = commission.artist?.name ?? "Artist TruBrush";
	const userBalance = user.balance ?? 0;
	const isBalanceSufficient = userBalance >= commission.price;

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
				<div className="lg:col-span-7">
					<PaymentMethodSelector
						paymentMethod={paymentMethod}
						onSelectMethod={setPaymentMethod}
						userBalance={userBalance}
						totalPrice={commission.price}
						commissionId={commission.id}
					>
						<PaymentCardForm
							register={register}
							errors={errors}
							onCardNumberChange={handleCardNumberChange}
							onExpiryChange={handleExpiryChange}
							onCvvChange={handleCvvChange}
						/>
					</PaymentMethodSelector>
				</div>

				{/* Right Column: Order & Escrow Protection Summary */}
				<div className="lg:col-span-5">
					<PaymentSummaryCard
						artistName={artistName}
						commissionTitle={commission.commission_title}
						commissionDate={commission.created_at}
						price={commission.price}
						paymentMethod={paymentMethod}
						isBalanceSufficient={isBalanceSufficient}
						isPending={payMutation.isPending}
						onPayWallet={() => handlePaymentSubmit()}
						onPayCard={handleSubmit(handlePaymentSubmit)}
					/>
				</div>
			</div>
		</div>
	);
}
