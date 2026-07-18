import { useFavoriteStore } from "@/store/FavoriteStore";
import { useToastStore } from "@/store/ToastStore";
import { useUserStore } from "@/store/UserStore";

/**
 * ❤️ useFavoriteArtwork (Custom Hook)
 * Merangkum logika penambahan & penghapusan karya dari daftar favorit.
 */
export function useFavoriteArtwork(artworkId: string, artworkTitle: string) {
	const { user, isAuthenticated } = useUserStore();
	const { isFavorite, toggleFavorite } = useFavoriteStore();
	const { addToast } = useToastStore();

	const isArtworkFavorite = user ? isFavorite(user.id, artworkId) : false;

	const handleFavoriteToggle = () => {
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

	return {
		isArtworkFavorite,
		handleFavoriteToggle,
	};
}
