"use client";

import {
	AlertCircle,
	CheckCircle2,
	ClipboardList,
	ExternalLink,
	ImageIcon,
	Tag,
	User,
	XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import Button from "@/components/ui/Button";
import Pill from "@/components/ui/Pill";
import type { ArtworkWithRelations } from "@/types";

interface ArtworkReviewCardProps {
	artwork: ArtworkWithRelations;
	onApprove: () => void;
	onReject: () => void;
	isProcessing?: boolean;
}

const uploadTypeLabel = {
	original: "Orisinal",
	fanart: "Fan Art",
	commission: "Komisi",
} as const;

function formatDate(value: string) {
	return new Intl.DateTimeFormat("id-ID", {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(value));
}

function getReviewLabel(artwork: ArtworkWithRelations) {
	if (!artwork.wip_proof_url) {
		return {
			label: "WIP proof tidak tersedia",
			className: "border-premium/30 bg-premium/5 text-premium",
			icon: AlertCircle,
		};
	}

	return {
		label: "Perlu review manual",
		className: "border-primary/20 bg-primary/5 text-primary",
		icon: ClipboardList,
	};
}

function PreviewPanel({
	label,
	src,
	alt,
	href,
}: {
	label: string;
	src?: string;
	alt: string;
	href?: string;
}) {
	return (
		<div className="rounded-xl border border-content/10 bg-background/50 p-3">
			<div className="mb-2 flex items-center justify-between gap-2">
				<p className="text-xs font-semibold text-content">{label}</p>
				{href && (
					<a
						href={href}
						target="_blank"
						rel="noreferrer"
						className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
					>
						Buka
						<ExternalLink className="h-3 w-3" />
					</a>
				)}
			</div>
			<div className="relative aspect-video overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
				{src ? (
					<Image
						src={src}
						alt={alt}
						fill
						sizes="(max-width: 640px) 100vw, 50vw"
						className="object-cover"
					/>
				) : (
					<div className="absolute inset-0 flex items-center justify-center">
						<ImageIcon className="h-8 w-8 text-content-muted/30" />
					</div>
				)}
			</div>
		</div>
	);
}

export default function ArtworkReviewCard({
	artwork,
	onApprove,
	onReject,
	isProcessing = false,
}: ArtworkReviewCardProps) {
	const review = getReviewLabel(artwork);
	const ReviewIcon = review.icon;
	const hasWip = Boolean(artwork.wip_proof_url);

	return (
		<article className="overflow-hidden rounded-2xl border border-content/10 bg-surface p-5">
			<div className="space-y-4">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<div className="flex flex-wrap items-center gap-2">
							<h3 className="font-heading text-lg font-semibold text-content">
								{artwork.title}
							</h3>
							<span className="rounded-full bg-premium/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-premium">
								Pending
							</span>
						</div>
						<p className="mt-1 text-sm text-content-muted">
							{artwork.description ?? "Tidak ada deskripsi."}
						</p>
					</div>

					<div
						className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium ${review.className}`}
					>
						<ReviewIcon className="h-3.5 w-3.5" />
						{review.label}
					</div>
				</div>

				<div className="grid gap-3 text-sm sm:grid-cols-2">
					<div className="flex items-center gap-2 text-content-muted">
						<User className="h-4 w-4 shrink-0" />
						<span>
							Artist:{" "}
							<Link
								href={`/artists/${artwork.artist.id}`}
								className="font-medium text-primary hover:underline"
							>
								{artwork.artist.name}
							</Link>
						</span>
					</div>
					<div className="text-content-muted">
						Tipe:{" "}
						<span className="font-medium text-content">
							{uploadTypeLabel[artwork.upload_type]}
						</span>
					</div>
					<div className="text-content-muted">
						Diunggah:{" "}
						<span className="font-medium text-content">
							{formatDate(artwork.created_at)}
						</span>
					</div>
					<div className="text-content-muted">
						Gambar:{" "}
						<span className="font-medium text-content">
							{artwork.images_url.length} file
						</span>
					</div>
				</div>

				{artwork.tags.length > 0 && (
					<div className="flex flex-wrap items-center gap-2">
						<Tag className="h-3.5 w-3.5 text-content-muted" />
						{artwork.tags.map((tag) => (
							<Pill key={tag.id}>{tag.tag_name}</Pill>
						))}
					</div>
				)}

				<div className={hasWip ? "grid gap-4 sm:grid-cols-2" : ""}>
					<PreviewPanel
						label="Preview Artwork"
						src={artwork.images_url[0]}
						alt={artwork.title}
						href={artwork.images_url[0]}
					/>
					{hasWip && (
						<PreviewPanel
							label="Bukti WIP / Proses Manual"
							src={artwork.wip_proof_url}
							alt={`WIP ${artwork.title}`}
							href={artwork.wip_proof_url}
						/>
					)}
				</div>

				<div className="flex flex-col gap-2 border-t border-content/10 pt-4 sm:flex-row sm:justify-end">
					<Button
						variant="danger"
						className="flex gap-1 items-center justify-center sm:min-w-[140px]"
						onClick={onReject}
						disabled={isProcessing}
					>
						<XCircle className="h-4 w-4" />
						Tolak
					</Button>
					<Button
						className="flex gap-1 items-center justify-center sm:min-w-[140px]"
						onClick={onApprove}
						disabled={isProcessing}
					>
						<CheckCircle2 className="h-4 w-4" />
						Setujui
					</Button>
				</div>
			</div>
		</article>
	);
}
