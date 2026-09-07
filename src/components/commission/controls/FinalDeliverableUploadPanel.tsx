import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { axiosClient } from "@/lib/axiosClient";
import { useToastStore } from "@/store/ToastStore";
import { formatPrice } from "@/utils";

interface FinalDeliverableUploadPanelProps {
	commissionId: string;
	price: number;
	onCompleteCommission: () => Promise<unknown>;
}

export default function FinalDeliverableUploadPanel({
	commissionId,
	price,
	onCompleteCommission,
}: FinalDeliverableUploadPanelProps) {
	const { addToast } = useToastStore();
	const [deliverableFile, setDeliverableFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState(false);

	// Cegah pengguna menutup atau me-refresh tab saat berkas besar sedang diunggah
	useEffect(() => {
		if (!isUploading) return;
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			e.preventDefault();
		};
		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [isUploading]);

	const handleUploadFinal = async () => {
		if (!deliverableFile) return;
		try {
			setIsUploading(true);
			const formData = new FormData();
			formData.append("file", deliverableFile);
			await axiosClient.post(
				`/upload/commissions/${commissionId}/final`,
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
					err.response?.data?.message || "Gagal mengunggah berkas hasil akhir.",
				type: "error",
			});
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<div className="p-4 bg-success/10 rounded-xl border border-success/30 space-y-3">
			<p className="text-sm font-semibold text-content">
				Client Telah Menyutujui Preview Final! 🎉
			</p>
			<p className="text-xs text-content-muted">
				Silakan unggah berkas karya asli/arsip (.zip, .rar, .psd, .pdf, .png
				hingga 100MB) untuk menyelesaikan komisi dan mencairkan dana Escrow
				sebesar {formatPrice(price)} ke E-Wallet Anda.
			</p>
			<div className="space-y-2">
				<input
					type="file"
					disabled={isUploading}
					accept=".zip,.rar,.psd,.pdf,.png,.jpg,.jpeg"
					onChange={(e) => setDeliverableFile(e.target.files?.[0] || null)}
					className="w-full text-xs text-content file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-success file:text-white hover:file:bg-success-hover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
				/>

				{isUploading && (
					<div className="flex items-center gap-2.5 p-3 rounded-lg bg-success/20 border border-success/40 text-xs text-content animate-pulse">
						<Loader2 className="w-4 h-4 animate-spin text-success shrink-0" />
						<span>
							Sedang mengunggah berkas resolusi tinggi & memproses pencairan
							escrow...{" "}
							<strong>
								Harap jangan menutup atau memuat ulang halaman ini.
							</strong>
						</span>
					</div>
				)}

				{deliverableFile && (
					<Button
						type="button"
						disabled={isUploading}
						className="w-full text-sm py-2 justify-center bg-success hover:bg-success-hover text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
						onClick={handleUploadFinal}
					>
						{isUploading ? (
							<>
								<Loader2 className="w-4 h-4 mr-2 animate-spin shrink-0" />
								Mengunggah Berkas & Menyelesaikan Komisi...
							</>
						) : (
							<>
								<CheckCircle2 className="w-4 h-4 mr-1.5" />
								Kirim Berkas Akhir & Cairkan Escrow ({formatPrice(price)})
							</>
						)}
					</Button>
				)}
			</div>
		</div>
	);
}
