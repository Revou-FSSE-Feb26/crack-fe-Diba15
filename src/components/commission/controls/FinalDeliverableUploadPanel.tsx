import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
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
					accept=".zip,.rar,.psd,.pdf,.png,.jpg,.jpeg"
					onChange={(e) => setDeliverableFile(e.target.files?.[0] || null)}
					className="w-full text-xs text-content file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-success file:text-white hover:file:bg-success-hover cursor-pointer"
				/>
				{deliverableFile && (
					<Button
						type="button"
						disabled={isUploading}
						className="w-full text-sm py-2 justify-center bg-success hover:bg-success-hover text-white font-semibold"
						onClick={handleUploadFinal}
					>
						<CheckCircle2 className="w-4 h-4 mr-1.5" />
						Kirim Berkas Akhir & Cairkan Escrow ({formatPrice(price)})
					</Button>
				)}
			</div>
		</div>
	);
}
