import { Film, Upload, X } from "lucide-react";
import Image from "next/image";

interface ArtworkWipUploaderProps {
	wipFile: File | null;
	onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onRemoveFile: () => void;
}

export default function ArtworkWipUploader({
	wipFile,
	onFileChange,
	onRemoveFile,
}: ArtworkWipUploaderProps) {
	return (
		<div className="bg-surface border border-content/10 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
			<div>
				<h2 className="font-heading text-base font-bold text-content flex items-center gap-2">
					<Film className="h-5 w-5 text-accent" />
					Bukti Proses Pengerjaan (WIP Proof)
					<span className="text-xs font-normal text-content-muted ml-auto">
						Opsional (Sangat disarankan)
					</span>
				</h2>
				<p className="text-xs text-content-muted mt-0.5">
					Unggah bukti rekaman timelapse, sketsa awal, atau layer PSD untuk
					mempercepat verifikasi kurator.
				</p>
			</div>

			{!wipFile ? (
				<label className="flex flex-col items-center justify-center border-2 border-dashed border-content/20 hover:border-accent hover:bg-accent/5 rounded-2xl p-6 cursor-pointer transition-all duration-200 group">
					<div className="flex flex-col items-center justify-center text-center">
						<div className="h-10 w-10 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-2 group-hover:scale-110 transition-transform">
							<Upload className="h-5 w-5" />
						</div>
						<p className="text-sm font-semibold text-content">
							Klik atau seret file WIP ke sini
						</p>
						<p className="text-xs text-content-muted mt-1">
							Gambar (Maks. 10MB) atau Video MP4/MOV/WEBM (Maks. 30MB)
						</p>
					</div>
					<input
						type="file"
						accept="image/*,video/mp4,video/quicktime,video/webm"
						className="hidden"
						onChange={onFileChange}
					/>
				</label>
			) : (
				<div className="flex items-center justify-between p-3.5 rounded-xl border border-content/10 bg-content/5">
					<div className="flex items-center gap-3 overflow-hidden">
						{wipFile.type.startsWith("image/") ? (
							<div className="relative h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 bg-content/10">
								<Image
									src={URL.createObjectURL(wipFile)}
									alt="WIP Preview"
									fill
									className="object-cover"
								/>
							</div>
						) : (
							<div className="h-12 w-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
								<Film className="h-6 w-6" />
							</div>
						)}
						<div className="overflow-hidden">
							<p className="text-sm font-medium text-content truncate">
								{wipFile.name}
							</p>
							<p className="text-xs text-content-muted">
								{(wipFile.size / (1024 * 1024)).toFixed(2)} MB
							</p>
						</div>
					</div>
					<button
						type="button"
						onClick={onRemoveFile}
						className="h-8 w-8 rounded-full hover:bg-content/10 text-content-muted hover:text-danger flex items-center justify-center transition-colors"
						title="Hapus file WIP"
					>
						<X className="h-4 w-4" />
					</button>
				</div>
			)}
		</div>
	);
}
