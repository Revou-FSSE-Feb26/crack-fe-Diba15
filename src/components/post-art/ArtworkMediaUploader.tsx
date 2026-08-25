import { ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";

interface ArtworkMediaUploaderProps {
	artworkFiles: File[];
	onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onRemoveFile: (index: number) => void;
}

export default function ArtworkMediaUploader({
	artworkFiles,
	onFileChange,
	onRemoveFile,
}: ArtworkMediaUploaderProps) {
	return (
		<div className="bg-surface border border-content/10 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="font-heading text-base font-bold text-content flex items-center gap-2">
						<ImageIcon className="h-5 w-5 text-primary" />
						Berkas Karya Seni (Artwork)
					</h2>
					<p className="text-xs text-content-muted mt-0.5">
						Unggah gambar karya seni utama Anda (Maksimal 5 file, maks
						10MB/gambar).
					</p>
				</div>
				<span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
					{artworkFiles.length}/5 File
				</span>
			</div>

			{/* Dropzone */}
			<label className="flex flex-col items-center justify-center border-2 border-dashed border-content/20 hover:border-primary hover:bg-primary/5 rounded-2xl p-6 cursor-pointer transition-all duration-200 group">
				<div className="flex flex-col items-center justify-center text-center">
					<div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
						<Upload className="h-6 w-6" />
					</div>
					<p className="text-sm font-semibold text-content">
						Klik atau seret file gambar ke sini
					</p>
					<p className="text-xs text-content-muted mt-1">
						PNG, JPG, JPEG, WEBP, atau GIF (Maks. 10MB per file)
					</p>
				</div>
				<input
					type="file"
					multiple
					accept="image/png, image/jpeg, image/webp, image/gif, image/jpg"
					className="hidden"
					onChange={onFileChange}
				/>
			</label>

			{/* Thumbnail List */}
			{artworkFiles.length > 0 && (
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
					{artworkFiles.map((file, index) => {
						const previewUrl = URL.createObjectURL(file);
						return (
							<div
								key={`${file.name}-${file.lastModified}-${file.size}`}
								className="relative group rounded-xl overflow-hidden border border-content/10 aspect-square bg-content/5"
							>
								<Image
									src={previewUrl}
									alt={file.name}
									fill
									className="object-cover"
								/>
								<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
									<button
										type="button"
										onClick={() => onRemoveFile(index)}
										className="h-8 w-8 rounded-full bg-danger text-white flex items-center justify-center hover:opacity-90 transition shadow-md"
										title="Hapus gambar"
									>
										<X className="h-4 w-4" />
									</button>
								</div>
								<span className="absolute bottom-1 left-1 bg-black/70 text-[10px] text-white px-1.5 py-0.5 rounded truncate max-w-[90%] font-medium">
									{file.name}
								</span>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
