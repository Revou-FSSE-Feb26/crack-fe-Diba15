"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import CommissionButton from "@/components/detail/CommissionButton";
import Button from "@/components/ui/Button";
import Pill from "@/components/ui/Pill";
import { useFavoriteArtwork } from "@/hooks/useFavoriteArtwork";
import type { ArtworkWithRelations, User } from "@/types";

interface ArtworkCardFooterProps {
	artwork: ArtworkWithRelations;
}

export function ArtworkCardFooter({ artwork }: ArtworkCardFooterProps) {
	const { artist, artist_profile, tags } = artwork;
	const { isArtworkFavorite, handleFavoriteToggle } = useFavoriteArtwork(
		artwork.id,
		artwork.title,
	);

	const basePrice =
		artist_profile?.base_price_idr ??
		(artist as Partial<User>)?.profile?.base_price_idr ??
		null;

	return (
		<>
			{/* Action Bar */}
			<div className="flex flex-col px-4 py-3 border-b border-content/5">
				<div className="flex justify-between items-center gap-2 w-full">
					<Link
						href={`/detail/${artwork.id}`}
						className="text-sm font-semibold text-content hover:text-primary transition-colors"
					>
						{artwork.title}
					</Link>
					<button
						type="button"
						onClick={handleFavoriteToggle}
						title={
							isArtworkFavorite ? "Hapus dari favorite" : "Tambah ke favorite"
						}
						aria-pressed={isArtworkFavorite}
						className="p-2 hover:bg-content/5 rounded-full transition-colors duration-150 -ml-2 group cursor-pointer"
					>
						<Heart
							size={20}
							className={`transition-colors duration-150 ${
								isArtworkFavorite
									? "text-red-500 fill-red-500"
									: "text-content-muted group-hover:text-red-500 group-hover:fill-red-500"
							}`}
						/>
					</button>
				</div>

				{/* Tags */}
				{tags && tags.length > 0 && (
					<div className="flex flex-wrap gap-1.5 pt-1">
						{tags.slice(0, 3).map((tag, i) => (
							<Pill
								key={tag.id}
								link={`/search/${encodeURIComponent(`tags:"${tag.tag_name}"`)}`}
								className={
									i % 2 === 0
										? "text-[11px] px-2 py-1 rounded-full bg-primary/10 text-primary"
										: "text-[11px] px-2 py-1 rounded-full bg-warm/15 text-warm-hover"
								}
							>
								{tag.tag_name}
							</Pill>
						))}
						{tags.length > 3 && <Pill>+{tags.length - 3}</Pill>}
					</div>
				)}
			</div>

			{/* Commission CTA Button */}
			<div className="px-4 py-3 space-y-2">
				{artist_profile.is_verified ? (
					<div>
						{artist_profile.is_open_for_commission ? (
							<CommissionButton
								artworkId={artwork.id}
								artworkTitle={artwork.title}
								artistId={artist.id}
								artistName={artist.name}
								basePrice={basePrice}
								className="text-sm"
							>
								Pesan Komisi
							</CommissionButton>
						) : (
							<Button
								variant="secondary"
								className="w-full text-sm pointer-events-none"
								disabled
							>
								Komisi Tutup
							</Button>
						)}
					</div>
				) : (
					<div>
						<Button
							variant="danger"
							className="w-full text-sm pointer-events-none"
							disabled
						>
							Belum Diverifikasi
						</Button>
					</div>
				)}
			</div>
		</>
	);
}
