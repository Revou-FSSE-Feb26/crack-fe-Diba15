"use client";

import {
	AlertTriangle,
	ArrowLeft,
	Briefcase,
	CheckCircle2,
	Clock3,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CommissionActionControls from "@/components/commission/CommissionActionControls";
import CommissionDeliverables from "@/components/commission/CommissionDeliverables";
import CommissionMilestones from "@/components/commission/CommissionMilestones";
import CommissionRevisionLogs from "@/components/commission/CommissionRevisionLogs";
import FileDisputeModal from "@/components/commission/FileDisputeModal";
import AvatarInitials from "@/components/home/AvatarInitials";
import Stat from "@/components/ui/Stat";
import {
	useAddRevision,
	useApproveStep,
	useCancelCommission,
	useCommissionDetail,
	useCompleteCommission,
	useRespondCommission,
	useUpdateProgress,
} from "@/hooks/useCommissionQueries";
import { useCopyProtection } from "@/hooks/useCopyProtection";
import { useCreateDispute } from "@/hooks/useDisputeQueries";
import { useMounted } from "@/hooks/useMounted";
import { useModalStore } from "@/store/ModalStore";
import { useUserStore } from "@/store/UserStore";
import { formatDate, formatPrice } from "@/utils";
import { commissionStatusConfig } from "@/utils/commissionStatus";

interface CommissionDetailContentProps {
	commissionId: string;
}

const paymentStatusConfig: Record<
	string,
	{ label: string; className: string }
> = {
	unpaid: {
		label: "Belum Dibayar",
		className: "bg-content/5 text-content-muted border-content/20",
	},
	paid: {
		label: "Escrow Aktif",
		className: "bg-primary/10 text-primary border-primary/30",
	},
	refunded: {
		label: "Di-refund",
		className: "bg-danger/10 text-danger border-danger/30",
	},
	released: {
		label: "Escrow Dicairkan",
		className: "bg-success/10 text-success border-success/30",
	},
};

export function CommissionDetailContent({
	commissionId,
}: CommissionDetailContentProps) {
	useCopyProtection();
	const mounted = useMounted();
	const { user, isAuthenticated } = useUserStore();
	const { openModal } = useModalStore();

	const [isDisputeOpen, setIsDisputeOpen] = useState(false);

	const { data: commission, isLoading } = useCommissionDetail(commissionId);
	const respondMutation = useRespondCommission();
	const updateProgressMutation = useUpdateProgress();
	const approveStepMutation = useApproveStep();
	const addRevisionMutation = useAddRevision();
	const cancelMutation = useCancelCommission();
	const completeMutation = useCompleteCommission();
	const createDisputeMutation = useCreateDispute();

	if (!mounted || isLoading) {
		return (
			<div className="max-w-3xl mx-auto px-4 py-12 text-center">
				<p className="text-sm text-content-muted animate-pulse">
					Memuat detail commission...
				</p>
			</div>
		);
	}

	if (!isAuthenticated || !user) {
		return (
			<div className="max-w-3xl mx-auto px-4 py-12">
				<div className="bg-surface border border-content/10 rounded-2xl p-6 text-center">
					<Briefcase className="w-10 h-10 text-primary mx-auto mb-3" />
					<h1 className="font-heading text-2xl font-semibold text-content">
						Login untuk melihat detail commission
					</h1>
					<p className="mt-2 text-sm text-content-muted">
						Detail commission hanya tersedia untuk client yang memesan dan
						artist yang menerima order.
					</p>
				</div>
			</div>
		);
	}

	if (!commission) {
		return (
			<div className="max-w-3xl mx-auto px-4 py-12">
				<div className="bg-surface border border-content/10 rounded-2xl p-6 text-center">
					<Briefcase className="w-10 h-10 text-content-muted mx-auto mb-3" />
					<h1 className="font-heading text-2xl font-semibold text-content">
						Commission tidak ditemukan
					</h1>
					<p className="mt-2 text-sm text-content-muted">
						Order ini belum tersedia atau sudah tidak ada di daftar commission.
					</p>
					<Link
						href="/commissions"
						className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-background shadow-sm transition-colors hover:bg-primary-hover"
					>
						<ArrowLeft className="w-4 h-4" />
						Kembali ke list
					</Link>
				</div>
			</div>
		);
	}

	const isArtistView = user.role === "artist";
	const hasAccess = isArtistView
		? commission.artists_id === user.id
		: commission.client_id === user.id;

	if (!hasAccess) {
		return (
			<div className="max-w-3xl mx-auto px-4 py-12">
				<div className="bg-surface border border-content/10 rounded-2xl p-6 text-center">
					<AlertTriangle className="w-10 h-10 text-danger mx-auto mb-3" />
					<h1 className="font-heading text-2xl font-semibold text-content">
						Kamu tidak punya akses
					</h1>
					<p className="mt-2 text-sm text-content-muted">
						Commission ini hanya bisa dilihat oleh client terkait dan artist
						yang menerima order.
					</p>
				</div>
			</div>
		);
	}

	const artist = commission.artist;
	const client = commission.client;
	const progressItem = commission.progress ?? null;
	const thread = commission.revisions ?? [];
	const commissionDispute =
		commission.disputes?.[0] ?? commission.dispute ?? null;
	const status = commissionStatusConfig[commission.status];
	const paymentBadge = paymentStatusConfig[commission.payment_status] ?? {
		label: commission.payment_status,
		className: "bg-content/5 text-content-muted border-content/10",
	};

	const counterpartName = isArtistView
		? (client?.name ?? "Client")
		: (artist?.name ?? "Artist");

	const handleRespond = (
		statusValue: "accepted" | "cancelled",
		title: string,
	) => {
		openModal({
			title,
			description: `Status "${commission.commission_title}" akan diubah menjadi ${
				statusValue === "accepted" ? "Diterima" : "Ditolak"
			}.`,
			type: "confirm",
			variant: statusValue === "cancelled" ? "danger" : "default",
			confirmLabel: "Konfirmasi",
			onConfirm: () =>
				respondMutation.mutate({
					id: commission.id,
					status: statusValue,
				}),
		});
	};

	const handleApproveFinal = () => {
		openModal({
			title: "Approve Pratinjau Final?",
			description: `Apakah Anda menyetujui pratinjau hasil karya untuk "${commission.commission_title}"? Artist akan diizinkan mengirimkan berkas asli dan dana sebesar ${formatPrice(
				commission.price,
			)} akan dilepaskan setelah pengiriman berkas.`,
			type: "confirm",
			confirmLabel: "Approve Pratinjau",
			onConfirm: () => {
				approveStepMutation.mutate({
					id: commission.id,
					step: "final",
				});
			},
		});
	};

	const handleCancel = () => {
		openModal({
			title: "Batalkan commission?",
			description: `Apakah Anda yakin ingin membatalkan pesanan "${commission.commission_title}"?`,
			type: "confirm",
			variant: "danger",
			confirmLabel: "Ya, Batalkan",
			cancelLabel: "Batal",
			onConfirm: () => cancelMutation.mutate(commission.id),
		});
	};

	return (
		<div className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
			<Link
				href="/commissions"
				className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover"
			>
				<ArrowLeft className="w-4 h-4" />
				Kembali ke list commission
			</Link>

			<article className="bg-surface border border-content/10 rounded-2xl p-3.5 xs:p-4 sm:p-5">
				<div className="flex flex-col gap-4 w-full">
					{/* Header */}
					<div className="flex items-start gap-2.5 sm:gap-3 min-w-0 w-full">
						<AvatarInitials
							name={counterpartName}
							className="w-10 h-10 sm:w-12 sm:h-12 text-sm shrink-0"
						/>
						<div className="min-w-0 flex-1">
							<div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
								<h1 className="font-heading text-xl sm:text-2xl font-bold text-content wrap-break-word min-w-0">
									{commission.commission_title}
								</h1>
								<span
									className={`rounded-full px-2 py-0.5 text-xs font-medium shrink-0 ${status.className}`}
								>
									{status.label}
								</span>
								<span
									className={`rounded-full border px-2 py-0.5 text-xs font-medium shrink-0 ${paymentBadge.className}`}
								>
									{paymentBadge.label}
								</span>
							</div>
							<p className="mt-1 text-xs sm:text-sm text-content-muted">
								{isArtistView
									? `Client: ${counterpartName}`
									: `Artist: ${counterpartName}`}
							</p>
							{commission.description && (
								<p className="mt-3 text-xs sm:text-sm leading-relaxed text-content-muted wrap-break-word">
									{commission.description}
								</p>
							)}
						</div>
					</div>

					{/* Stats Row */}
					<div className="grid grid-cols-3 gap-2 sm:gap-3">
						<Stat
							icon={Clock3}
							label="Update"
							value={formatDate(commission.updated_at)}
						/>
						<Stat
							icon={CheckCircle2}
							label={isArtistView ? "Pendapatan Bersih" : "Harga"}
							value={
								isArtistView ? (
									<span className="flex flex-col">
										<span>
											{formatPrice(
												commission.net_artist_amount ??
													Math.round(commission.price * 0.95),
											)}
										</span>
										<span className="text-[10px] text-content-muted font-normal">
											Fee 5%: -
											{formatPrice(
												commission.platform_fee ??
													Math.round(commission.price * 0.05),
											)}
										</span>
									</span>
								) : (
									formatPrice(commission.price)
								)
							}
						/>
						<Stat
							icon={Briefcase}
							label="Dibuat"
							value={formatDate(commission.created_at)}
						/>
					</div>
				</div>

				<div className="flex flex-col gap-5 mt-5">
					<div className="space-y-3">
						{/* 1. Deliverables Previews & Master File */}
						<CommissionDeliverables
							commission={commission}
							progressItem={progressItem}
							commissionDispute={commissionDispute}
							isArtistView={isArtistView}
						/>

						{/* 2. Step Progress Milestones */}
						<CommissionMilestones
							commission={commission}
							progressItem={progressItem}
						/>

						{/* 3. Action Controls */}
						<CommissionActionControls
							commission={commission}
							progressItem={progressItem}
							commissionDispute={commissionDispute}
							isArtistView={isArtistView}
							onRespond={handleRespond}
							onApproveFinal={handleApproveFinal}
							onCancel={handleCancel}
							onOpenDispute={() => setIsDisputeOpen(true)}
							onUpdateProgress={(payload) =>
								updateProgressMutation.mutateAsync({
									id: commission.id,
									...payload,
								})
							}
							onCompleteCommission={() =>
								completeMutation.mutateAsync(commission.id)
							}
						/>

						{/* 4. Revision Logs & Comments */}
						<CommissionRevisionLogs
							thread={thread}
							artistName={artist?.name}
							clientName={client?.name}
							artistId={commission.artists_id}
							onAddComment={(commentText) =>
								addRevisionMutation.mutate({
									id: commission.id,
									comment: commentText,
								})
							}
						/>
					</div>
				</div>
			</article>

			{/* Dispute Modal */}
			<FileDisputeModal
				commissionTitle={commission.commission_title}
				isOpen={isDisputeOpen}
				onClose={() => setIsDisputeOpen(false)}
				onSubmit={(reason) => {
					createDisputeMutation.mutate({
						commission_id: commission.id,
						reason,
					});
					setIsDisputeOpen(false);
				}}
			/>
		</div>
	);
}

export default CommissionDetailContent;
