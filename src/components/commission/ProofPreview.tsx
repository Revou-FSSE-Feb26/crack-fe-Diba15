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
				<div className="relative aspect-video bg-content/5">
					<Image
						src={src}
						alt={title}
						fill
						sizes="(max-width: 768px) 100vw, 50vw"
						className="object-cover"
					/>
				</div>
			) : (
				<div className="aspect-video bg-content/5 flex items-center justify-center px-4 text-center">
					<p className="text-sm text-content-muted">{empty}</p>
				</div>
			)}
		</div>
	);
}
