"use client";

import { ImageIcon, ShieldAlert } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useCopyProtection } from "@/hooks/useCopyProtection";
import { useLightboxStore } from "@/store/LightboxStore";

export default function ProofPreview({
	title,
	src,
	empty,
}: {
	title: string;
	src: string | null | undefined;
	empty: string;
}) {
	const [hasError, setHasError] = useState(false);
	const { openLightbox } = useLightboxStore();
	const { isWindowBlurred } = useCopyProtection();

	const isVideo =
		src &&
		(src.endsWith(".mp4") ||
			src.endsWith(".webm") ||
			src.endsWith(".mov") ||
			src.includes("/video/"));

	const handleOpenLightbox = () => {
		if (src && !isVideo && !hasError) {
			openLightbox([src], 0, title, true);
		}
	};

	return (
		<div className="rounded-xl border border-content/10 overflow-hidden bg-surface">
			<div className="flex items-center justify-between px-3 py-2 border-b border-content/10">
				<p className="text-sm font-medium text-content">{title}</p>
				<span className="text-xs text-content-muted">
					{isVideo ? "Video WIP" : "Pratinjau Terproteksi"}
				</span>
			</div>
			{src && !hasError ? (
				isVideo ? (
					<div className="relative aspect-video w-full bg-black overflow-hidden">
						<video
							src={src}
							controls
							controlsList="nodownload"
							disablePictureInPicture
							onContextMenu={(e) => e.preventDefault()}
							className="w-full h-full object-contain"
						>
							<track kind="captions" />
						</video>
					</div>
				) : (
					<button
						type="button"
						onClick={handleOpenLightbox}
						onContextMenu={(e) => e.preventDefault()}
						onDragStart={(e) => e.preventDefault()}
						className="relative aspect-video w-full bg-content/5 overflow-hidden group cursor-pointer block select-none focus:outline-none p-0 border-0 text-left"
						style={{
							WebkitTouchCallout: "none",
							WebkitUserSelect: "none",
							KhtmlUserSelect: "none",
							MozUserSelect: "none",
							msUserSelect: "none",
							userSelect: "none",
						}}
					>
						<div className="relative w-full h-full">
							<Image
								src={src}
								alt={title}
								fill
								loading={"eager"}
								unoptimized
								onError={() => setHasError(true)}
								className={`object-cover group-hover:scale-105 transition-all duration-300 pointer-events-none ${
									isWindowBlurred ? "filter blur-2xl scale-110 opacity-30" : ""
								}`}
								draggable={false}
								priority={false}
							/>

							{/* Window Blur Defense Anti-Screenshot Curtain */}
							{isWindowBlurred && (
								<div className="absolute inset-0 z-30 bg-black/80 flex flex-col items-center justify-center p-4 text-center gap-2 backdrop-blur-md">
									<ShieldAlert className="w-8 h-8 text-white/80 animate-pulse" />
									<p className="text-xs font-bold text-white tracking-wide">
										Pratinjau Disamarkan
									</p>
									<p className="text-[11px] text-white/60 max-w-xs">
										Layar kehilangan fokus atau terdeteksi tangkapan layar. Klik
										kembali pada browser untuk melanjutkan.
									</p>
								</div>
							)}

							{/* Watermark Diagonal Overlay */}
							<div
								className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-25 mix-blend-overlay"
								style={{
									backgroundImage:
										"repeating-linear-gradient(45deg, var(--color-content, #000) 0, var(--color-content, #000) 1px, transparent 0, transparent 50%)",
									backgroundSize: "24px 24px",
								}}
							/>

							{/* Center Watermark Text */}
							<div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
								<span className="text-content/20 dark:text-content/30 font-extrabold tracking-widest text-lg md:text-xl uppercase select-none font-display drop-shadow-sm">
									TRUBRUSH PREVIEW ONLY
								</span>
							</div>

							{/* Transparent Anti-Touch Cover */}
							<div className="absolute inset-0 z-10 bg-transparent pointer-events-none" />
						</div>
					</button>
				)
			) : (
				<div className="aspect-video bg-content/5 flex flex-col items-center justify-center px-4 text-center gap-2">
					{hasError ? (
						<>
							<ImageIcon className="w-8 h-8 text-content-muted/40" />
							<p className="text-xs text-content-muted">
								Berkas pratinjau tidak dapat dimuat (URL kedaluwarsa atau berkas
								telah dipindahkan).
							</p>
						</>
					) : (
						<p className="text-sm text-content-muted">{empty}</p>
					)}
				</div>
			)}
		</div>
	);
}
