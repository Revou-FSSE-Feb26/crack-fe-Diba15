import {
	useToggleFavorite,
	useUserFavoriteIds,
} from "@/hooks/useSocialQueries";
import { useToastStore } from "@/store/ToastStore";
import { useUserStore } from "@/store/UserStore";

/**
 * ❤️ useFavoriteArtwork (Custom Hook)
 * Merangkum logika penambahan & penghapusan karya dari daftar favorit via API Backend.
 */
export function useFavoriteArtwork(artworkId: string, _artworkTitle?: string) {
	const { isAuthenticated } = useUserStore();
	const { data: favoriteIds = [] } = useUserFavoriteIds();
	const toggleFavoriteMutation = useToggleFavorite();
	const { addToast } = useToastStore();

	const isArtworkFavorite = favoriteIds.includes(artworkId);

	const handleFavoriteToggle = () => {
		if (!isAuthenticated) {
			addToast({
				message: "Login terlebih dahulu untuk menambahkan ke favorit.",
				type: "warning",
			});
			return;
		}

		toggleFavoriteMutation.mutate(artworkId);
	};

	return {
		isArtworkFavorite,
		handleFavoriteToggle,
		isLoading: toggleFavoriteMutation.isPending,
	};
}
