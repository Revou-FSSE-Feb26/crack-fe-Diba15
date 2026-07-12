import Image from "next/image";

export default function ProofPreview({
	title,
	src,
	empty,
}: {
	title: string;
	src: string | null | undefined;
	empty: string;
}) {
	return (
		<div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
			<div className="flex items-center justify-between px-3 py-2">
				<p className="text-sm font-medium text-content">{title}</p>
				<span className="text-xs text-content-muted">Preview only</span>
			</div>
			{src ? (
				<div className="relative aspect-video bg-content/5 select-none pointer-events-none overflow-hidden group">
					<Image
						src={src}
						alt={title}
						fill
						sizes="(max-width: 768px) 100vw, 50vw"
						className="object-cover pointer-events-none select-none"
						draggable={false}
					/>
					{/* Watermark Diagonal Overlay */}
					<div
						className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-25 mix-blend-overlay"
						style={{
							backgroundImage:
								"repeating-linear-gradient(45deg, var(--color-content, #000) 0, var(--color-content, #000) 1px, transparent 0, transparent 50%)",
							backgroundSize: "24px 24px",
						}}
					/>
					<div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
						<span className="text-content/10 dark:text-content/25 font-bold tracking-widest text-lg md:text-xl uppercase select-none font-display">
							TruBrush Preview
						</span>
					</div>
				</div>
			) : (
				<div className="aspect-video bg-content/5 flex items-center justify-center px-4 text-center">
					<p className="text-sm text-content-muted">{empty}</p>
				</div>
			)}
		</div>
	);
}
