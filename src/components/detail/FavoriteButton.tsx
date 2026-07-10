"use client";

import { Heart } from "lucide-react";
import { useFavoriteStore } from "@/store/FavoriteStore";
import { useToastStore } from "@/store/ToastStore";
import { useUserStore } from "@/store/UserStore";

interface FavoriteButtonProps {
	artworkId: string;
	artworkTitle: string;
}

export default function FavoriteButton({
	artworkId,
	artworkTitle,
}: FavoriteButtonProps) {
	const { user, isAuthenticated } = useUserStore();
	const { isFavorite, toggleFavorite } = useFavoriteStore();
	const { addToast } = useToastStore();

	const isArtworkFavorite = user ? isFavorite(user.id, artworkId) : false;

	const handleFavorite = () => {
		if (!isAuthenticated || !user) {
			addToast({
				message: "Login terlebih dahulu untuk menambahkan favorite.",
				type: "warning",
			});
			return;
		}

		const addedToFavorite = toggleFavorite(user.id, artworkId);

		addToast({
			message: addedToFavorite
				? `Berhasil ditambahkan ke favorite: ${artworkTitle}.`
				: `Dihapus dari favorite: ${artworkTitle}.`,
			type: addedToFavorite ? "success" : "info",
		});
	};

	return (
		<button
			type="button"
			onClick={handleFavorite}
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
