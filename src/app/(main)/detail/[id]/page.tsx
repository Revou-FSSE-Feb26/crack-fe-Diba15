"use client";

import {
	ArrowLeft,
	BadgeCheck,
	Check,
	ChevronDown,
	ImageIcon,
	PenTool,
	Share2,
	ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import CommissionButton from "@/components/detail/CommissionButton";
import FavoriteButton from "@/components/detail/FavoriteButton";
import AvatarInitials from "@/components/home/AvatarInitials";
import { useCopyLink } from "@/hooks/useCopyLink";
import { useArtworkStore } from "@/store/ArtworkStore";
import { useLightboxStore } from "@/store/LightboxStore";
import { useProfileStore } from "@/store/ProfileStore";
import { useUserManagementStore } from "@/store/UserManagementStore";
import { buildArtworkWithRelations } from "@/utils/search";

export default function Detail() {
	const params = useParams();
	const router = useRouter();
	const id = params.id as string;
	const { artworks, artworkTags, tags } = useArtworkStore();
	const { openLightbox } = useLightboxStore();
	const [showWip, setShowWip] = useState(false);
	const { users } = useUserManagementStore();
	const { profiles } = useProfileStore();
	const { copied, copyPath } = useCopyLink({
		successMessage: "Link karya berhasil disalin.",
	});
	const artwork = buildArtworkWithRelations(
		artworks,
		artworkTags,
		tags,
		users,
	).find((item) => item.id === id);

	if (!artwork) {
		return (
			<main className="min-h-screen bg-background text-content pb-20">
				<nav className="sticky top-0 z-45 bg-background/80 backdrop-blur-md border-b border-content/10 p-4">
					<Link
						href="/"
						className="inline-flex items-center gap-2 p-2 hover:bg-content/5 rounded-full transition-colors duration-200"
					>
						<ArrowLeft size={20} />
						<span className="text-sm font-medium">Kembali</span>
					</Link>
				</nav>

				<div className="max-w-3xl mx-auto px-4 py-16 text-center">
					<div className="bg-surface border border-content/10 rounded-2xl p-8">
						<ImageIcon className="w-10 h-10 text-content-muted mx-auto mb-3" />
						<h1 className="text-2xl font-bold text-content">
							Artwork tidak ditemukan
						</h1>
						<p className="mt-2 text-sm text-content-muted">
							Karya ini belum tersedia atau sudah tidak ada di daftar artwork.
						</p>
					</div>
				</div>
			</main>
		);
	}

	const artist = users.find((user) => user.id === artwork.artists_id);
	const artistProfile = profiles.find(
		(profile) => profile.user_id === artist?.id,
	);

	const handleCopyLink = (id: string) => {
		copyPath(id);
	};

	return (
		<main className="min-h-screen bg-background text-content pb-20">
			<nav className="bg-background/80 backdrop-blur-md border-b border-content/10 p-4">
				<div className=" flex items-center gap-4">
					<button
						type="button"
						onClick={() => router.back()}
						className="p-2 hover:bg-content/5 rounded-full transition-colors duration-200 cursor-pointer"
					>
						<ArrowLeft size={20} />
					</button>
					<h1 className="font-semibold truncate">{artwork.title}</h1>
				</div>
			</nav>

			<div className="max-w-6xl mx-auto px-4 py-6">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
					<div className="lg:col-span-2 space-y-4">
						{artwork.images_url.length > 0 ? (
							artwork.images_url.map((imgUrl, index) => (
								<div
									key={`${imgUrl}-${index}`}
									className="relative w-full rounded-xl overflow-hidden shadow-sm"
								>
									<button
										type="button"
										onClick={() =>
											openLightbox(artwork.images_url, index, artwork.title)
										}
										className="w-full h-auto bg-transparent cursor-pointer"
									>
										<Image
											src={imgUrl}
											alt={`${artwork.title} - Image ${index + 1}`}
											width={0}
											height={0}
											sizes="100vw"
											className="w-full h-auto"
											loading={index === 0 ? "eager" : "lazy"}
										/>
									</button>
								</div>
							))
						) : (
							<div className="w-full aspect-video bg-content/5 rounded-xl flex items-center justify-center">
								<p className="text-content-muted">Tidak ada gambar tersedia.</p>
							</div>
						)}

						{artwork.wip_proof_url && (
							<div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-surface">
								<button
									type="button"
									onClick={() => setShowWip((prev: boolean) => !prev)}
									className="w-full flex items-center justify-between px-4 py-3 text-left"
								>
									<span className="flex items-center gap-2 text-sm font-medium text-content">
										<PenTool className="w-4 h-4 text-primary" />
										Bukti Proses (WIP Proof)
									</span>
									<ChevronDown
										className={`w-4 h-4 text-content-muted transition-transform duration-200 ${showWip ? "rotate-180" : ""}`}
									/>
								</button>
								{showWip && (
									<div className="px-4 pb-4">
										<p className="text-xs text-content-muted mb-3">
											Bukti proses manual yang diverifikasi tim kurator TruBrush
											sebelum karya ini disetujui tampil.
										</p>
										<div className="relative w-full aspect-video rounded-lg overflow-hidden bg-content/5">
											<button
												type="button"
												onClick={() =>
													openLightbox(
														[
															artwork.wip_proof_url
																? artwork.wip_proof_url
																: "",
														],
														0,
														artwork.title,
													)
												}
												className="w-full h-auto bg-transparent cursor-pointer"
											>
												<Image
													src={artwork.wip_proof_url}
													alt={`WIP proof ${artwork.title}`}
													fill
													sizes="(max-width: 1024px) 100vw, 700px"
													className="object-cover"
												/>
											</button>
										</div>
									</div>
								)}
							</div>
						)}
					</div>

					<aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
						<div className="bg-surface p-5 rounded-xl border border-content/5 shadow-sm">
							<Link
								href={`/artists/${artwork.artist.id}`}
								className="flex items-center gap-3 mb-4"
							>
								<AvatarInitials
									name={artwork.artist.name}
									className="w-12 h-12 text-lg"
								/>
								<div>
									<div className="flex items-center gap-1.5">
										<h2 className="font-bold text-lg">{artwork.artist.name}</h2>
										{artwork.artist_profile.is_verified && (
											<BadgeCheck className="w-5 h-5 text-verified" />
										)}
									</div>
									<p className="text-sm text-content-muted">Artist</p>
								</div>
							</Link>

							{artwork.curation_status === "approved" && (
								<div className="flex items-center gap-2 mb-4 rounded-lg bg-verified/10 px-3 py-2">
									<ShieldCheck className="w-4 h-4 text-verified shrink-0" />
									<p className="text-xs text-verified font-medium">
										Karya ini telah lolos kurasi TruBrush.
									</p>
								</div>
							)}

							{artwork.artist_profile.is_open_for_commission && (
								<CommissionButton
									artworkId={artwork.id}
									artworkTitle={artwork.title}
									artistId={artwork.artist.id}
									artistName={artwork.artist.name}
									basePrice={artistProfile?.base_price_idr ?? null}
								/>
							)}
						</div>

						<div className="space-y-4">
							<div>
								<h1 className="text-2xl font-bold mb-2">{artwork.title}</h1>
								<p className="text-content-muted leading-relaxed whitespace-pre-line">
									{artwork.description}
								</p>
							</div>

							{artwork.tags.length > 0 && (
								<div className="flex flex-wrap gap-2 pt-2">
									{artwork.tags.map((tag) => (
										<Link
											key={tag.id}
											href={`/search/${encodeURIComponent(`tags:"${tag.tag_name}"`)}`}
											className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full hover:bg-primary/20 transition-colors"
										>
											#{tag.tag_name}
										</Link>
									))}
								</div>
							)}

							<hr className="border-content/10 my-4" />

							<div className="flex items-center gap-4">
								<FavoriteButton
									artworkId={artwork.id}
									artworkTitle={artwork.title}
								/>
								<button
									type="button"
									title="Share"
									className="p-2.5 rounded-lg bg-content/5 hover:bg-content/10 text-content transition-colors"
									onClick={() => handleCopyLink(artwork.id)}
								>
									{copied ? (
										<Check size={20} className="text-verified" />
									) : (
										<Share2 size={20} />
									)}
								</button>
							</div>
						</div>
					</aside>
				</div>
			</div>
		</main>
	);
}
