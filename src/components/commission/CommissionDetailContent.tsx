"use client";

import {
	AlertTriangle,
	ArrowLeft,
	Briefcase,
	CheckCircle2,
	Clock3,
	CreditCard,
	Download,
	MessageSquare,
	Upload,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import FileDisputeModal from "@/components/commission/FileDisputeModal";
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
	useCompleteCommission,
	useRespondCommission,
	useUpdateProgress,
} from "@/hooks/useCommissionQueries";
import { useCreateDispute } from "@/hooks/useDisputeQueries";
import { useMounted } from "@/hooks/useMounted";
import { axiosClient } from "@/lib/axiosClient";
import { useModalStore } from "@/store/ModalStore";
import { useToastStore } from "@/store/ToastStore";
import { useUserStore } from "@/store/UserStore";
import type { Commission } from "@/types";
import { formatDate, formatPrice } from "@/utils";
import { commissionStatusConfig } from "@/utils/commissionStatus";

interface CommissionDetailContentProps {
	commissionId: string;
}

// Payment status badge config — adjust the keys to match your Commission["payment_status"] union exactly.
const paymentStatusConfig: Record<
	string,
	{ label: string; className: string }
> = {
	unpaid: {
		label: "Belum Dibayar",
		className: "bg-slate-500/10 text-slate-500 border-slate-500/30",
	},
	paid: {
		label: "Escrow Aktif",
		className: "bg-primary/10 text-primary border-primary/30",
	},
	refunded: {
		label: "Direfund",
		className: "bg-danger/10 text-danger border-danger/30",
	},
	released: {
		label: "Dana Dicairkan",
		className: "bg-success/10 text-success border-success/30",
	},
};

export function CommissionDetailContent({
	commissionId,
}: CommissionDetailContentProps) {
	const { user, isAuthenticated } = useUserStore();
	const { openModal } = useModalStore();
	const { addToast } = useToastStore();
	const { data: commission } = useCommissionDetail(commissionId);

	const respondMutation = useRespondCommission();
	const updateProgressMutation = useUpdateProgress();
	const approveStepMutation = useApproveStep();
	const addRevisionMutation = useAddRevision();
	const cancelMutation = useCancelCommission();
	const createDisputeMutation = useCreateDispute();
	const completeMutation = useCompleteCommission();

	const mounted = useMounted();
	const [comment, setComment] = useState("");
	const [isDisputeOpen, setIsDisputeOpen] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [sketchFile, setSketchFile] = useState<File | null>(null);
	const [previewFile, setPreviewFile] = useState<File | null>(null);
	const [deliverableFile, setDeliverableFile] = useState<File | null>(null);

	// Cek apakah sudah masuk atau belum
	if (!mounted) {
		return (
			<div className="max-w-6xl mx-auto px-4 py-8">
				<p className="text-sm text-content-muted">
					Memuat detail commission...
				</p>
			</div>
		);
	}

	// Cek apakah user sudah login atau belum
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

	// Cek apakah commission kosong atau tidak
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

	// Cek apakah user yang mengakses halaman detail commission ini adalah user yang memiliki commission tersebut
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
	const commissionDispute =
		commission.disputes?.[0] ?? commission.dispute ?? null;
	const status = commissionStatusConfig[commission.status];
	const paymentBadge = paymentStatusConfig[commission.payment_status] ?? {
		label: commission.payment_status,
		className: "bg-content/5 text-content-muted border-content/10",
	};

	// Transaksi komisi masih aktif (belum selesai, batal, sengketa pending, atau sengketa disetujui)
	const isCommissionActive =
		!["completed", "cancelled", "disputed"].includes(commission.status) &&
		commission.payment_status === "paid" &&
		commissionDispute?.status !== "approved";

	const canCancel =
		!isArtistView &&
		["pending", "accepted"].includes(commission.status) &&
		commission.payment_status === "unpaid" &&
		!commissionDispute;

	const canDispute =
		!isArtistView &&
		isCommissionActive &&
		Boolean(progressItem?.sketch_url) &&
		Boolean(progressItem?.final_artwork_url) &&
		!progressItem?.final_artwork_approved &&
		!commissionDispute;

	const canApprove =
		!isArtistView &&
		isCommissionActive &&
		Boolean(progressItem?.final_artwork_url) &&
		!progressItem?.final_artwork_approved &&
		(!commissionDispute || commissionDispute.status === "rejected");

	const canUploadFinalDeliverable =
		isArtistView &&
		isCommissionActive &&
		Boolean(progressItem?.final_artwork_approved);

	const counterpartName = isArtistView
		? (client?.name ?? "Client")
		: (artist?.name ?? "Artist");

	const confirmStatus = (
		selectedCommission: Commission,
		statusValue: "accepted" | "cancelled",
		title: string,
	) => {
		openModal({
			title,
			description: `Status "${selectedCommission.commission_title}" akan diubah menjadi ${statusValue === "accepted" ? "Diterima" : "Ditolak"}.`,
			type: "confirm",
			variant: statusValue === "cancelled" ? "danger" : "default",
			confirmLabel: "Konfirmasi",
			onConfirm: () =>
				respondMutation.mutate({
					id: selectedCommission.id,
					status: statusValue,
				}),
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

			<article className="bg-surface border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 xs:p-4 sm:p-5">
				<div className="flex flex-col gap-4 w-full">
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

					{/* Stat row — full width, no truncation */}
					<div className="grid grid-cols-3 gap-2 sm:gap-3">
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

				<div className="flex flex-col gap-5 mt-5">
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
									className={`p-2 rounded-lg border text-center ${commission.payment_status === "paid" && commission.status !== "completed" && commission.status !== "cancelled" ? "bg-primary/10 border-primary text-primary font-semibold" : "bg-surface border-content/10 text-content-muted"}`}
								>
									3. Dibayar (Escrow)
								</div>
								<div
									className={`p-2 rounded-lg border text-center ${progressItem?.final_artwork_url && commission.status !== "completed" && commission.status !== "cancelled" ? "bg-primary/10 border-primary text-primary font-semibold" : "bg-surface border-content/10 text-content-muted"}`}
								>
									4. Review Hasil
								</div>
								<div
									className={`p-2 rounded-lg border text-center ${
										commission.status === "completed"
											? "bg-success/10 border-success text-success font-semibold"
											: commission.status === "cancelled"
												? "bg-danger/10 border-danger text-danger font-semibold"
												: "bg-surface border-content/10 text-content-muted"
									}`}
								>
									{commission.status === "cancelled"
										? "5. Dibatalkan"
										: "5. Selesai"}
								</div>
							</div>
						</div>

						{/*Button & Action Section*/}
						<div className="space-y-3">
							{/* Completed Commission: Final Deliverable Download Card */}
							{commission.status === "completed" &&
								(progressItem?.final_file_url ||
									progressItem?.final_artwork_url) && (
									<div className="p-4 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl border border-emerald-500/30 space-y-3">
										<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
													<Download className="w-5 h-5" />
												</div>
												<div>
													<p className="font-bold text-sm text-content">
														Berkas Karya Asli (Deliverable Final)
													</p>
													<p className="text-xs text-content-muted">
														Komisi ini telah selesai dan saldo Escrow sebesar{" "}
														{formatPrice(commission.price)} telah dicairkan ke
														Artis. Berkas mentah/arsip hasil karya siap diunduh.
													</p>
												</div>
											</div>
											<Link
												href={
													progressItem?.final_file_url ||
													progressItem?.final_artwork_url ||
													"#"
												}
												target="_blank"
												rel="noopener noreferrer"
												download
												className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors shrink-0 flex items-center justify-center gap-1.5 shadow-sm"
											>
												<Download className="w-4 h-4" />
												Unduh Berkas Akhir
											</Link>
										</div>
									</div>
								)}

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
												confirmStatus(commission, "cancelled", "Tolak komisi?")
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
										<Link
											href={`/commissions/${commission.id}/payment`}
											className="flex items-center gap-2 w-full justify-center text-sm font-semibold rounded-xl bg-primary px-4 py-2.5 text-background hover:bg-primary-hover transition-colors shadow-sm"
										>
											<CreditCard className="w-4 h-4" />
											Bayar Komisi ({formatPrice(commission.price)})
										</Link>
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

							{/* Artist Actions: Upload Real WIP / Preview Final (Paid) */}
							{isArtistView &&
								commission.payment_status === "paid" &&
								!progressItem?.final_artwork_approved &&
								["accepted", "in_progress", "revision"].includes(
									commission.status,
								) && (
									<div className="p-4 bg-surface rounded-xl border border-content/10 space-y-4">
										<div className="space-y-1">
											<p className="text-sm font-semibold text-content">
												Pembayaran Escrow Terkonfirmasi! Unggah Progress Komisi
											</p>
											<p className="text-xs text-content-muted">
												Pilih dan unggah berkas gambar nyata untuk WIP Proof
												(Sketsa) atau Preview Final agar Client dapat meninjau.
											</p>
										</div>

										<div className="grid gap-3 sm:grid-cols-2 text-xs">
											{/* WIP Proof Upload Input */}
											<div className="p-3 rounded-lg border border-content/10 bg-content/5 space-y-2">
												<label
													htmlFor="wip-file-input"
													className="font-semibold block text-content"
												>
													1. Unggah Sketsa / Video WIP Proof
												</label>
												<input
													id="wip-file-input"
													type="file"
													accept="image/png,image/jpeg,image/webp,image/jpg,image/gif,video/mp4,video/quicktime,video/webm,.gif,.mp4,.mov,.webm"
													onChange={(e) =>
														setSketchFile(e.target.files?.[0] || null)
													}
													className="w-full text-xs text-content file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-background hover:file:bg-primary-hover cursor-pointer"
												/>
												{sketchFile && (
													<Button
														type="button"
														disabled={isUploading}
														className="w-full text-xs py-1.5 justify-center"
														onClick={async () => {
															try {
																setIsUploading(true);
																const formData = new FormData();
																formData.append("file", sketchFile);
																const res = await axiosClient.post(
																	`/upload/commissions/${commission.id}/sketch`,
																	formData,
																	{
																		headers: {
																			"Content-Type": "multipart/form-data",
																		},
																	},
																);
																await updateProgressMutation.mutateAsync({
																	id: commission.id,
																	sketch_url: res.data.url,
																});
																setSketchFile(null);
															} catch (error: unknown) {
																const err = error as {
																	response?: { data?: { message?: string } };
																};
																addToast({
																	message:
																		err.response?.data?.message ||
																		"Gagal mengunggah WIP proof.",
																	type: "error",
																});
															} finally {
																setIsUploading(false);
															}
														}}
													>
														<Upload className="w-3.5 h-3.5 mr-1" />
														Submit WIP Proof
													</Button>
												)}
											</div>

											{/* Preview Final Upload Input */}
											<div className="p-3 rounded-lg border border-content/10 bg-content/5 space-y-2">
												<label
													htmlFor="preview-file-input"
													className="font-semibold block text-content"
												>
													2. Unggah Preview Final
												</label>
												<input
													id="preview-file-input"
													type="file"
													accept="image/png,image/jpeg,image/webp,image/jpg,image/gif,.gif"
													onChange={(e) =>
														setPreviewFile(e.target.files?.[0] || null)
													}
													className="w-full text-xs text-content file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-background hover:file:bg-primary-hover cursor-pointer"
												/>
												{previewFile && (
													<Button
														type="button"
														disabled={isUploading}
														className="w-full text-xs py-1.5 justify-center"
														onClick={async () => {
															try {
																setIsUploading(true);
																const formData = new FormData();
																formData.append("file", previewFile);
																const res = await axiosClient.post(
																	`/upload/commissions/${commission.id}/preview`,
																	formData,
																	{
																		headers: {
																			"Content-Type": "multipart/form-data",
																		},
																	},
																);
																await updateProgressMutation.mutateAsync({
																	id: commission.id,
																	final_artwork_url: res.data.url,
																});
																setPreviewFile(null);
															} catch (error: unknown) {
																const err = error as {
																	response?: { data?: { message?: string } };
																};
																addToast({
																	message:
																		err.response?.data?.message ||
																		"Gagal mengunggah preview final.",
																	type: "error",
																});
															} finally {
																setIsUploading(false);
															}
														}}
													>
														<Upload className="w-3.5 h-3.5 mr-1" />
														Submit Preview Final
													</Button>
												)}
											</div>
										</div>
									</div>
								)}

							{/* Artist Actions: Final Deliverable File Upload (Step 5) */}
							{canUploadFinalDeliverable && (
								<div className="p-4 bg-success/10 rounded-xl border border-success/30 space-y-3">
									<p className="text-sm font-semibold text-content">
										Client Telah Menyutujui Preview Final! 🎉
									</p>
									<p className="text-xs text-content-muted">
										Silakan unggah berkas karya asli/arsip (.zip, .rar, .psd,
										.pdf, .png hingga 100MB) untuk menyelesaikan komisi dan
										mencairkan dana Escrow sebesar{" "}
										{formatPrice(commission.price)} ke E-Wallet Anda.
									</p>
									<div className="space-y-2">
										<input
											type="file"
											accept=".zip,.rar,.psd,.pdf,.png,.jpg,.jpeg"
											onChange={(e) =>
												setDeliverableFile(e.target.files?.[0] || null)
											}
											className="w-full text-xs text-content file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-success file:text-white hover:file:bg-success-hover cursor-pointer"
										/>
										{deliverableFile && (
											<Button
												type="button"
												disabled={isUploading}
												className="w-full text-sm py-2 justify-center bg-success hover:bg-success-hover text-white font-semibold"
												onClick={async () => {
													try {
														setIsUploading(true);
														const formData = new FormData();
														formData.append("file", deliverableFile);
														await axiosClient.post(
															`/upload/commissions/${commission.id}/final`,
															formData,
															{
																headers: {
																	"Content-Type": "multipart/form-data",
																},
															},
														);
														await completeMutation.mutateAsync(commission.id);
														setDeliverableFile(null);
													} catch (error: unknown) {
														const err = error as {
															response?: { data?: { message?: string } };
														};
														addToast({
															message:
																err.response?.data?.message ||
																"Gagal mengunggah berkas hasil akhir.",
															type: "error",
														});
													} finally {
														setIsUploading(false);
													}
												}}
											>
												<CheckCircle2 className="w-4 h-4 mr-1.5" />
												Kirim Berkas Akhir & Cairkan Escrow (
												{formatPrice(commission.price)})
											</Button>
										)}
									</div>
								</div>
							)}

							{/* Client Actions: Approve Final Artwork & Dispute */}
							{!isArtistView && canApprove && (
								<div className="p-4 bg-primary/5 rounded-xl border border-primary/20 space-y-3">
									<p className="text-sm font-semibold text-content">
										Artist telah mengunggah Preview Final
									</p>
									<p className="text-xs text-content-muted">
										Tinjau karya akhir di atas. Jika sudah sesuai, setujui
										pratinjau agar Artist dapat mengunggah berkas karya asli dan
										menerima pembayaran.
									</p>
									<div className="flex gap-2">
										<Button
											className="flex gap-1 items-center flex-1 justify-center text-sm font-semibold"
											onClick={() => {
												openModal({
													title: "Approve Pratinjau Final?",
													description: `Apakah Anda menyetujui pratinjau hasil karya untuk "${commission.commission_title}"? Artist akan diizinkan mengirimkan berkas asli dan dana sebesar ${formatPrice(commission.price)} akan dilepaskan setelah pengiriman berkas.`,
													type: "confirm",
													confirmLabel: "Approve Pratinjau",
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
										{canDispute && (
											<Button
												variant="danger"
												className="flex gap-1 items-center justify-center text-sm"
												onClick={() => setIsDisputeOpen(true)}
											>
												<AlertTriangle className="w-4 h-4" />
												Ajukan Dispute
											</Button>
										)}
									</div>
								</div>
							)}

							{/* Client Actions: Dispute Button when not approving */}
							{!isArtistView && !canApprove && canDispute && (
								<Button
									variant="danger"
									className="flex gap-1 items-center w-full justify-center text-sm"
									onClick={() => setIsDisputeOpen(true)}
								>
									<AlertTriangle className="w-4 h-4" />
									Ajukan Dispute Komisi
								</Button>
							)}

							{/* Client Actions: Cancel Commission (Pending/Accepted Unpaid only) */}
							{!isArtistView && canCancel && (
								<Button
									variant="secondary"
									className="flex gap-1 items-center w-full justify-center text-sm"
									onClick={() => {
										openModal({
											title: "Batalkan commission?",
											description: `Apakah Anda yakin ingin membatalkan pesanan "${commission.commission_title}"?`,
											type: "confirm",
											variant: "danger",
											confirmLabel: "Ya, Batalkan",
											cancelLabel: "Batal",
											onConfirm: () => cancelMutation.mutate(commission.id),
										});
									}}
								>
									Batalkan Commission
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

							{/* Cancelled without dispute banner */}
							{commission.status === "cancelled" && !commissionDispute && (
								<div className="p-4 bg-danger/10 rounded-xl border border-danger/20 space-y-1">
									<div className="flex items-center gap-1.5 font-bold text-xs text-danger">
										<XCircle className="w-4 h-4 shrink-0" />
										<span>Pesanan Komisi Dibatalkan</span>
									</div>
									<p className="text-xs text-content-muted">
										{isArtistView
											? "Pesanan komisi ini telah dibatalkan."
											: "Pesanan komisi ini telah dibatalkan."}
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
