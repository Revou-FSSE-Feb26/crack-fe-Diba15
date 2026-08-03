"use client";

import {
	AlertTriangle,
	ArrowLeft,
	Briefcase,
	CheckCircle2,
	Clock3,
	CreditCard,
	MessageSquare,
	Upload,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import FileDisputeModal from "@/components/commission/FileDisputeModal";
import PaymentMethodModal from "@/components/commission/PaymentMethodModal";
import ProofPreview from "@/components/commission/ProofPreview";
import AvatarInitials from "@/components/home/AvatarInitials";
import Button from "@/components/ui/Button";
import Stat from "@/components/ui/Stat";
import users from "@/data/users";
import {
	useAddRevision,
	useApproveStep,
	useCancelCommission,
	useCommissionDetail,
	usePayCommission,
	useRespondCommission,
	useUpdateProgress,
} from "@/hooks/useCommissionQueries";
import { useCreateDispute } from "@/hooks/useDisputeQueries";
import { useMounted } from "@/hooks/useMounted";
import { useModalStore } from "@/store/ModalStore";
import { useToastStore } from "@/store/ToastStore";
import { useUserStore } from "@/store/UserStore";
import type { Commission } from "@/types";
import { formatDate, formatPrice } from "@/utils";
import { commissionStatusConfig } from "@/utils/commissionStatus";

interface CommissionDetailContentProps {
	commissionId: string;
}

export default function CommissionDetailContent({
	commissionId,
}: CommissionDetailContentProps) {
	const { user, isAuthenticated } = useUserStore();
	const { openModal } = useModalStore();
	const { addToast } = useToastStore();
	const { data: commission, isLoading } = useCommissionDetail(commissionId);

	const respondMutation = useRespondCommission();
	const payMutation = usePayCommission();
	const updateProgressMutation = useUpdateProgress();
	const approveStepMutation = useApproveStep();
	const addRevisionMutation = useAddRevision();
	const cancelMutation = useCancelCommission();
	const createDisputeMutation = useCreateDispute();

	const mounted = useMounted();
	const [comment, setComment] = useState("");
	const [isPaymentOpen, setIsPaymentOpen] = useState(false);
	const [isDisputeOpen, setIsDisputeOpen] = useState(false);

	if (!mounted) {
		return (
			<div className="max-w-6xl mx-auto px-4 py-8">
				<p className="text-sm text-content-muted">
					Memuat detail commission...
				</p>
			</div>
		);
	}

	if (!isAuthenticated || !user) {
		return (
			<div className="max-w-3xl mx-auto px-4 py-12">
				<div className="bg-surface border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center">
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
				<div className="bg-surface border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center">
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
				<div className="bg-surface border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center">
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

	const artist = users.find((item) => item.id === commission.artists_id);
	const client = users.find((item) => item.id === commission.client_id);
	const progressItem = commission.progress ?? null;
	const thread = commission.revisions ?? [];
	const commissionDispute = commission.disputes?.[0] ?? null;
	const status = commissionStatusConfig[commission.status];
	const canCancel =
		!["completed", "cancelled", "disputed"].includes(commission.status) &&
		!commissionDispute;
	const canApprove =
		Boolean(progressItem?.final_artwork_url) &&
		commission.status !== "completed" &&
		!commissionDispute;
	const counterpartName = isArtistView
		? (client?.name ?? "Client")
		: (artist?.name ?? "Artist");

	const confirmStatus = (
		selectedCommission: Commission,
		statusValue: "accepted" | "declined",
		title: string,
	) => {
		openModal({
			title,
			description: `Status "${selectedCommission.commission_title}" akan diubah menjadi ${statusValue === "accepted" ? "Diterima" : "Ditolak"}.`,
			type: "confirm",
			variant: statusValue === "declined" ? "danger" : "default",
			confirmLabel: "Konfirmasi",
			onConfirm: () =>
				respondMutation.mutate({
					id: selectedCommission.id,
					status: statusValue,
				}),
		});
	};

	return (
		<div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
			<Link
				href="/commissions"
				className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover"
			>
				<ArrowLeft className="w-4 h-4" />
				Kembali ke list commission
			</Link>

			<article className="bg-surface border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 xs:p-4 sm:p-5">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between w-full">
					<div className="flex items-start gap-2.5 sm:gap-3 min-w-0 w-full">
						<AvatarInitials
							name={counterpartName}
							className="w-10 h-10 sm:w-12 sm:h-12 text-sm shrink-0"
						/>
						<div className="min-w-0 flex-1">
							<div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
								<h1 className="font-heading text-xl sm:text-2xl font-bold text-content break-words min-w-0">
									{commission.commission_title}
								</h1>
								<span
									className={`rounded-full px-2 py-0.5 text-xs font-medium shrink-0 ${status.className}`}
								>
									{status.label}
								</span>
							</div>
							<p className="mt-1 text-xs sm:text-sm text-content-muted">
								{isArtistView
									? `Client: ${counterpartName}`
									: `Artist: ${counterpartName}`}
							</p>
							{commission.description && (
								<p className="mt-3 text-xs sm:text-sm leading-relaxed text-content-muted break-words">
									{commission.description}
								</p>
							)}
						</div>
					</div>

					<div className="grid grid-cols-2 gap-1.5 xs:gap-2 sm:grid-cols-4 lg:w-107.5 w-full">
						<Stat
							icon={CreditCard}
							label="Bayar"
							value={commission.payment_status}
						/>
						<Stat
							icon={Clock3}
							label="Update"
							value={formatDate(commission.updated_at)}
						/>
						<Stat
							icon={CheckCircle2}
							label="Harga"
							value={formatPrice(commission.price)}
						/>
						<Stat
							icon={Briefcase}
							label="Dibuat"
							value={formatDate(commission.created_at)}
						/>
					</div>
				</div>

				<div className="flex flex-col gap-5">
					<div className="space-y-3">
						{/*Artwork Preview Section*/}
						<div className="grid gap-3 sm:grid-cols-2">
							<ProofPreview
								title="WIP Proof"
								src={
									!isArtistView && commissionDispute?.status === "approved"
										? null
										: progressItem?.sketch_url
								}
								empty={
									!isArtistView && commissionDispute?.status === "approved"
										? "WIP proof tidak dapat diakses karena sengketa disetujui."
										: "Artist belum upload WIP proof."
								}
							/>
							<ProofPreview
								title="Preview Final"
								src={
									!isArtistView && commissionDispute?.status === "approved"
										? null
										: progressItem?.final_artwork_url
								}
								empty={
									!isArtistView && commissionDispute?.status === "approved"
										? "Hasil tidak dapat diakses karena sengketa disetujui."
										: "Final artwork belum tersedia."
								}
							/>
						</div>

						{/*Step Progress Timeline Indicator*/}
						<div className="p-4 bg-content/5 rounded-xl border border-content/10 space-y-3">
							<h3 className="text-xs font-bold uppercase tracking-wider text-content-muted">
								Alur Progres Komisi
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-5 gap-1.5 text-xs">
								<div
									className={`p-2 rounded-lg border text-center ${commission.status === "pending" ? "bg-primary/10 border-primary text-primary font-semibold" : "bg-surface border-content/10 text-content-muted"}`}
								>
									1. Diajukan
								</div>
								<div
									className={`p-2 rounded-lg border text-center ${commission.status === "accepted" && commission.payment_status === "unpaid" ? "bg-primary/10 border-primary text-primary font-semibold" : "bg-surface border-content/10 text-content-muted"}`}
								>
									2. Diterima Artis
								</div>
								<div
									className={`p-2 rounded-lg border text-center ${commission.payment_status === "paid" && commission.status !== "completed" ? "bg-primary/10 border-primary text-primary font-semibold" : "bg-surface border-content/10 text-content-muted"}`}
								>
									3. Dibayar (Escrow)
								</div>
								<div
									className={`p-2 rounded-lg border text-center ${progressItem?.final_artwork_url && commission.status !== "completed" ? "bg-primary/10 border-primary text-primary font-semibold" : "bg-surface border-content/10 text-content-muted"}`}
								>
									4. Review Hasil
								</div>
								<div
									className={`p-2 rounded-lg border text-center ${commission.status === "completed" ? "bg-success/10 border-success text-success font-semibold" : "bg-surface border-content/10 text-content-muted"}`}
								>
									5. Selesai
								</div>
							</div>
						</div>

						{/*Button & Action Section*/}
						<div className="space-y-3">
							{/* Artist Actions: Respond to Pending Order */}
							{isArtistView && commission.status === "pending" && (
								<div className="p-4 bg-primary/5 rounded-xl border border-primary/20 space-y-3">
									<p className="text-sm font-semibold text-content">
										Client mengajukan komisi sebesar{" "}
										{formatPrice(commission.price)}.
									</p>
									<p className="text-xs text-content-muted">
										Saldo Client belum dipotong. Terima pesanan ini untuk
										mengizinkan Client melakukan pembayaran.
									</p>
									<div className="flex gap-2">
										<Button
											className="flex items-center gap-1 flex-1 justify-center text-sm"
											onClick={() =>
												confirmStatus(commission, "accepted", "Terima komisi?")
											}
										>
											<CheckCircle2 className="w-4 h-4" />
											Terima Pesanan
										</Button>
										<Button
											variant="danger"
											className="flex items-center gap-1 flex-1 justify-center text-sm"
											onClick={() =>
												confirmStatus(commission, "declined", "Tolak komisi?")
											}
										>
											<XCircle className="w-4 h-4" />
											Tolak Pesanan
										</Button>
									</div>
								</div>
							)}

							{/* Client Actions: Pending Banner */}
							{!isArtistView && commission.status === "pending" && (
								<div className="p-4 bg-surface rounded-xl border border-content/10 space-y-2">
									<p className="text-sm text-content font-medium">
										Pesanan komisi Anda sebesar {formatPrice(commission.price)}{" "}
										telah diajukan ke Artis.
									</p>
									<p className="text-xs text-content-muted">
										Saldo Anda belum dipotong. Menunggu Artis meninjau &
										menerima pesanan sebelum Anda melakukan pembayaran.
									</p>
								</div>
							)}

							{/* Client Actions: Pay for Accepted Commission */}
							{!isArtistView &&
								commission.status === "accepted" &&
								commission.payment_status === "unpaid" && (
									<div className="p-4 bg-primary/5 rounded-xl border border-primary/20 space-y-3">
										<p className="text-sm font-semibold text-content">
											Artis telah menerima pesanan komisi Anda! 🎉
										</p>
										<p className="text-xs text-content-muted">
											Silakan lakukan pembayaran sebesar{" "}
											{formatPrice(commission.price)} (via E-Wallet / Kartu
											Kredit) untuk memulai pengerjaan karya. Dana Anda akan
											diamankan di Escrow.
										</p>
										<Button
											className="flex items-center gap-2 w-full justify-center text-sm font-semibold"
											onClick={() => setIsPaymentOpen(true)}
										>
											<CreditCard className="w-4 h-4" />
											Bayar Komisi ({formatPrice(commission.price)})
										</Button>
									</div>
								)}

							{/* Artist Actions: Accepted but Unpaid Banner */}
							{isArtistView &&
								commission.status === "accepted" &&
								commission.payment_status === "unpaid" && (
									<div className="p-4 bg-surface rounded-xl border border-content/10 space-y-2">
										<p className="text-sm text-content font-medium">
											Anda telah menerima pesanan komisi ini.
										</p>
										<p className="text-xs text-content-muted">
											Menunggu Client menyelesaikan pembayaran sebesar{" "}
											{formatPrice(commission.price)} sebelum Anda dapat
											mengunggah progress karya.
										</p>
									</div>
								)}

							{/* Artist Actions: Upload WIP / Final Artwork (Paid) */}
							{isArtistView &&
								commission.payment_status === "paid" &&
								["in_progress", "revision"].includes(commission.status) && (
									<div className="p-4 bg-surface rounded-xl border border-content/10 space-y-3">
										<p className="text-sm font-semibold text-content">
											Pembayaran Escrow Terkonfirmasi! Silakan Unggah Progress
											Komisi
										</p>
										<p className="text-xs text-content-muted">
											Unggah bukti sketsa WIP atau hasil akhir karya agar client
											dapat meninjau.
										</p>
										<Button
											variant="secondary"
											className="flex items-center gap-2 w-full justify-center text-sm"
											onClick={() =>
												updateProgressMutation.mutate({
													id: commission.id,
													sketchUrl:
														"https://picsum.photos/seed/commission-sketch-1/900/650",
													finalArtworkUrl:
														"https://picsum.photos/seed/commission-final-1/900/650",
												})
											}
										>
											<Upload className="w-4 h-4" />
											Upload Progress Sketsa & Hasil Akhir
										</Button>
									</div>
								)}

							{/* Client Actions: Approve Final Artwork */}
							{!isArtistView && canApprove && (
								<div className="p-4 bg-primary/5 rounded-xl border border-primary/20 space-y-3">
									<p className="text-sm font-semibold text-content">
										Artist telah mengunggah Karya Akhir
									</p>
									<p className="text-xs text-content-muted">
										Tinjau karya akhir di atas. Jika sudah sesuai, setujui hasil
										karya untuk melepaskan dana Escrow sebesar{" "}
										{formatPrice(commission.price)} ke E-Wallet artist.
									</p>
									<div className="flex gap-2">
										<Button
											className="flex gap-1 items-center flex-1 justify-center text-sm"
											onClick={() => {
												openModal({
													title: "Approve hasil?",
													description: `Dengan menyetujui hasil, dana sebesar ${formatPrice(commission.price)} akan dilepaskan ke wallet artist.`,
													type: "confirm",
													confirmLabel: "Approve Hasil",
													onConfirm: () => {
														approveStepMutation.mutate({
															id: commission.id,
															step: "final",
														});
													},
												});
											}}
										>
											<CheckCircle2 className="w-4 h-4" />
											Approve Hasil Akhir
										</Button>
										<Button
											variant="danger"
											className="flex gap-1 items-center justify-center text-sm"
											onClick={() => setIsDisputeOpen(true)}
										>
											<AlertTriangle className="w-4 h-4" />
											Ajukan Dispute
										</Button>
									</div>
								</div>
							)}

							{/* Client Actions: Cancel Commission */}
							{!isArtistView && canCancel && (
								<Button
									variant="secondary"
									className="flex gap-1 items-center w-full justify-center text-sm"
									onClick={() => {
										openModal({
											title: "Batalkan commission?",
											description: `Apakah Anda yakin ingin membatalkan pesanan "${commission.commission_title}"? Dana sebesar ${formatPrice(commission.price)} akan di-refund ke e-wallet Anda.`,
											type: "confirm",
											variant: "danger",
											confirmLabel: "Ya, Batalkan",
											cancelLabel: "Batal",
											onConfirm: () => cancelMutation.mutate(commission.id),
										});
									}}
								>
									Batalkan Commission (Refund)
								</Button>
							)}

							{/* Dispute status banner */}
							{commissionDispute && (
								<div
									className={`rounded-xl border p-4 text-xs leading-relaxed ${
										commissionDispute.status === "pending"
											? "bg-premium/10 border-premium/30 text-premium"
											: commissionDispute.status === "approved"
												? "bg-verified/10 border-verified/30 text-verified"
												: "bg-content/5 border-content/10 text-content-muted"
									}`}
								>
									<div className="flex items-center gap-1.5 font-bold mb-1">
										<AlertTriangle className="w-4 h-4 shrink-0" />
										<span>
											{commissionDispute.status === "pending" &&
												"Komisi dalam Sengketa (Dispute)"}
											{commissionDispute.status === "approved" &&
												"Sengketa Disetujui Kurator"}
											{commissionDispute.status === "rejected" &&
												"Sengketa Ditolak Kurator"}
										</span>
									</div>
									<p className="font-semibold text-content mb-1">
										Alasan dispute: &ldquo;{commissionDispute.reason}&rdquo;
									</p>
									<p className="text-content-muted mt-1">
										{commissionDispute.status === "pending" &&
											"Laporan sengketa sedang ditinjau oleh Kurator TruBrush. Keputusan sengketa bersifat mutlak."}
										{commissionDispute.status === "approved" &&
											(commission.payment_method === "wallet"
												? isArtistView
													? `Dana sebesar ${formatPrice(commission.price)} telah di-refund ke saldo E-Wallet Klien.`
													: `Dana sebesar ${formatPrice(commission.price)} telah di-refund ke saldo E-Wallet Anda.`
												: isArtistView
													? `Dana sebesar ${formatPrice(commission.price)} telah di-refund ke kartu kredit Klien (berakhir di ${commission.card_last_four ?? "••••"}).`
													: `Dana sebesar ${formatPrice(commission.price)} telah di-refund ke kartu kredit Anda (berakhir di ${commission.card_last_four ?? "••••"}).`)}
										{commissionDispute.status === "rejected" &&
											(isArtistView
												? `Dana sebesar ${formatPrice(commission.price)} telah dilepaskan ke dompet E-Wallet Anda karena dispute ditolak.`
												: `Dana sebesar ${formatPrice(commission.price)} telah dilepaskan ke dompet Artist karena dispute ditolak.`)}
									</p>
								</div>
							)}
						</div>

						{/*Comments Section*/}
						<div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3">
							<div className="flex items-center gap-2 mb-3">
								<MessageSquare className="w-4 h-4 text-primary" />
								<p className="font-medium text-sm text-content">
									Komentar dan revisi
								</p>
							</div>
							<div className="space-y-2">
								{thread.length === 0 ? (
									<p className="text-sm text-content-muted">
										Belum ada komentar.
									</p>
								) : (
									thread.map((item) => {
										const author = users.find(
											(entry) => entry.id === item.user_id,
										);
										return (
											<div
												key={item.id}
												className="rounded-lg bg-content/5 px-3 py-2"
											>
												<p className="text-xs text-content-muted">
													{author?.name ?? "User"} ·{" "}
													{formatDate(item.created_at)}
												</p>
												<p className="mt-1 text-sm text-content">
													{item.comment}
												</p>
											</div>
										);
									})
								)}
							</div>
							<form
								className="mt-3 flex flex-col gap-2 sm:flex-row"
								onSubmit={(event) => {
									event.preventDefault();
									if (!comment.trim()) return;
									addRevisionMutation.mutate({
										id: commission.id,
										comment: comment.trim(),
									});
									setComment("");
								}}
							>
								<input
									value={comment}
									onChange={(event) => setComment(event.target.value)}
									placeholder="Tulis komentar, negosiasi harga, atau balasan..."
									className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-background px-3 py-2 text-sm outline-none focus:border-primary dark:border-slate-700"
								/>
								<Button type="submit" className="justify-center text-sm">
									Kirim
								</Button>
							</form>
						</div>
					</div>
				</div>
			</article>

			{/* Modals for payment and dispute */}
			<PaymentMethodModal
				commissionId={commission.id}
				commissionTitle={commission.commission_title}
				price={commission.price}
				isOpen={isPaymentOpen}
				onClose={() => setIsPaymentOpen(false)}
				onSubmitSuccess={(method, lastFour) => {
					payMutation.mutate({
						id: commission.id,
						paymentMethod: method,
						cardLastFour: lastFour,
					});
					setIsPaymentOpen(false);
				}}
			/>

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
