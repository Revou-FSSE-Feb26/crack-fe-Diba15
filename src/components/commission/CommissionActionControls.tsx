import {
	AlertTriangle,
	CheckCircle2,
	CreditCard,
	Upload,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { axiosClient } from "@/lib/axiosClient";
import { useToastStore } from "@/store/ToastStore";
import type { Commission, CommissionProgress, DisputeLog } from "@/types";
import { formatPrice } from "@/utils";

interface CommissionActionControlsProps {
	commission: Commission;
	progressItem: CommissionProgress | null;
	commissionDispute: DisputeLog | null;
	isArtistView: boolean;
	onRespond: (status: "accepted" | "cancelled", title: string) => void;
	onApproveFinal: () => void;
	onCancel: () => void;
	onOpenDispute: () => void;
	onUpdateProgress: (payload: {
		sketch_url?: string;
		final_artwork_url?: string;
	}) => Promise<unknown>;
	onCompleteCommission: () => Promise<unknown>;
}

export default function CommissionActionControls({
	commission,
	progressItem,
	commissionDispute,
	isArtistView,
	onRespond,
	onApproveFinal,
	onCancel,
	onOpenDispute,
	onUpdateProgress,
	onCompleteCommission,
}: CommissionActionControlsProps) {
	const { addToast } = useToastStore();
	const [sketchFile, setSketchFile] = useState<File | null>(null);
	const [previewFile, setPreviewFile] = useState<File | null>(null);
	const [deliverableFile, setDeliverableFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState(false);

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

	return (
		<div className="space-y-3">
			{/* Artist Actions: Respond to Pending Order */}
			{isArtistView && commission.status === "pending" && (
				<div className="p-4 bg-primary/5 rounded-xl border border-primary/20 space-y-3">
					<p className="text-sm font-semibold text-content">
						Client mengajukan komisi sebesar {formatPrice(commission.price)}.
					</p>
					<p className="text-xs text-content-muted">
						Saldo Client belum dipotong. Terima pesanan ini untuk mengizinkan
						Client melakukan pembayaran.
					</p>
					<div className="flex gap-2">
						<Button
							className="flex items-center gap-1 flex-1 justify-center text-sm"
							onClick={() => onRespond("accepted", "Terima komisi?")}
						>
							<CheckCircle2 className="w-4 h-4" />
							Terima Pesanan
						</Button>
						<Button
							variant="danger"
							className="flex items-center gap-1 flex-1 justify-center text-sm"
							onClick={() => onRespond("cancelled", "Tolak komisi?")}
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
						Pesanan komisi Anda sebesar {formatPrice(commission.price)} telah
						diajukan ke Artis.
					</p>
					<p className="text-xs text-content-muted">
						Saldo Anda belum dipotong. Menunggu Artis meninjau & menerima
						pesanan sebelum Anda melakukan pembayaran.
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
							Silakan lakukan pembayaran sebesar {formatPrice(commission.price)}{" "}
							(via E-Wallet / Kartu Kredit) untuk memulai pengerjaan karya. Dana
							Anda akan diamankan di Escrow.
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
							{formatPrice(commission.price)} sebelum Anda dapat mengunggah
							progress karya.
						</p>
					</div>
				)}

			{/* Artist Actions: Upload Real WIP / Preview Final (Paid) */}
			{isArtistView &&
				commission.payment_status === "paid" &&
				!progressItem?.final_artwork_approved &&
				["accepted", "in_progress", "revision"].includes(commission.status) && (
					<div className="p-4 bg-surface rounded-xl border border-content/10 space-y-4">
						<div className="space-y-1">
							<p className="text-sm font-semibold text-content">
								Pembayaran Escrow Terkonfirmasi! Unggah Progress Komisi
							</p>
							<p className="text-xs text-content-muted">
								Pilih dan unggah berkas gambar nyata untuk WIP Proof (Sketsa)
								atau Preview Final agar Client dapat meninjau.
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
									onChange={(e) => setSketchFile(e.target.files?.[0] || null)}
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
												await onUpdateProgress({ sketch_url: res.data.url });
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
									onChange={(e) => setPreviewFile(e.target.files?.[0] || null)}
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
												await onUpdateProgress({
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
						Silakan unggah berkas karya asli/arsip (.zip, .rar, .psd, .pdf, .png
						hingga 100MB) untuk menyelesaikan komisi dan mencairkan dana Escrow
						sebesar {formatPrice(commission.price)} ke E-Wallet Anda.
					</p>
					<div className="space-y-2">
						<input
							type="file"
							accept=".zip,.rar,.psd,.pdf,.png,.jpg,.jpeg"
							onChange={(e) => setDeliverableFile(e.target.files?.[0] || null)}
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
										await onCompleteCommission();
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
						Tinjau karya akhir di atas. Jika sudah sesuai, setujui pratinjau
						agar Artist dapat mengunggah berkas karya asli dan menerima
						pembayaran.
					</p>
					<div className="flex gap-2">
						<Button
							className="flex gap-1 items-center flex-1 justify-center text-sm font-semibold"
							onClick={onApproveFinal}
						>
							<CheckCircle2 className="w-4 h-4" />
							Approve Hasil Akhir
						</Button>
						{canDispute && (
							<Button
								variant="danger"
								className="flex gap-1 items-center justify-center text-sm"
								onClick={onOpenDispute}
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
					onClick={onOpenDispute}
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
					onClick={onCancel}
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
						Pesanan komisi ini telah dibatalkan.
					</p>
				</div>
			)}
		</div>
	);
}
