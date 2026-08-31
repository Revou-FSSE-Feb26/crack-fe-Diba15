import { Upload } from "lucide-react";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { axiosClient } from "@/lib/axiosClient";
import { useToastStore } from "@/store/ToastStore";

interface ProgressUploadPanelProps {
	commissionId: string;
	onUpdateProgress: (payload: {
		sketch_url?: string;
		final_artwork_url?: string;
	}) => Promise<unknown>;
}

export default function ProgressUploadPanel({
	commissionId,
	onUpdateProgress,
}: ProgressUploadPanelProps) {
	const { addToast } = useToastStore();
	const [sketchFile, setSketchFile] = useState<File | null>(null);
	const [previewFile, setPreviewFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState(false);

	const handleUploadSketch = async () => {
		if (!sketchFile) return;
		try {
			setIsUploading(true);
			const formData = new FormData();
			formData.append("file", sketchFile);
			const res = await axiosClient.post(
				`/upload/commissions/${commissionId}/sketch`,
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
				message: err.response?.data?.message || "Gagal mengunggah WIP proof.",
				type: "error",
			});
		} finally {
			setIsUploading(false);
		}
	};

	const handleUploadPreview = async () => {
		if (!previewFile) return;
		try {
			setIsUploading(true);
			const formData = new FormData();
			formData.append("file", previewFile);
			const res = await axiosClient.post(
				`/upload/commissions/${commissionId}/preview`,
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
					err.response?.data?.message || "Gagal mengunggah preview final.",
				type: "error",
			});
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<div className="p-4 bg-surface rounded-xl border border-content/10 space-y-4">
			<div className="space-y-1">
				<p className="text-sm font-semibold text-content">
					Pembayaran Escrow Terkonfirmasi! Unggah Progress Komisi
				</p>
				<p className="text-xs text-content-muted">
					Pilih dan unggah berkas gambar nyata untuk WIP Proof (Sketsa) atau
					Preview Final agar Client dapat meninjau.
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
							onClick={handleUploadSketch}
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
							onClick={handleUploadPreview}
						>
							<Upload className="w-3.5 h-3.5 mr-1" />
							Submit Preview Final
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
