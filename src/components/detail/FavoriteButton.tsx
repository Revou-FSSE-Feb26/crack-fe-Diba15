"use client";

import { Heart } from "lucide-react";
import { useFavoriteArtwork } from "@/hooks/useFavoriteArtwork";

interface FavoriteButtonProps {
	artworkId: string;
	artworkTitle: string;
}

export default function FavoriteButton({
	artworkId,
	artworkTitle,
}: FavoriteButtonProps) {
	const { isArtworkFavorite, handleFavoriteToggle } = useFavoriteArtwork(
		artworkId,
		artworkTitle,
	);

	return (
		<button
			type="button"
			onClick={handleFavoriteToggle}
			title={isArtworkFavorite ? "Hapus dari favorite" : "Tambah ke favorite"}
			aria-pressed={isArtworkFavorite}
			className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-content/5 hover:bg-content/10 text-content transition-colors font-medium"
		>
			<Heart
				size={20}
				className={isArtworkFavorite ? "text-red-500 fill-red-500" : undefined}
			/>
			{isArtworkFavorite ? "Difavoritkan" : "Favorite"}
		</button>
	);
}
