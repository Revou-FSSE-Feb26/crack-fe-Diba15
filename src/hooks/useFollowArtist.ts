import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useToggleFollow, useUserFollowingIds } from "@/hooks/useSocialQueries";
import { useModalStore } from "@/store/ModalStore";
import { useUserStore } from "@/store/UserStore";

/**
 * 🔗 useFollowArtist (Custom Hook)
 * Merangkum seluruh pengecekan, login redirect modal, validasi role,
 * dan sinkronisasi status follow/unfollow artis via API Backend.
 */
export function useFollowArtist(artistId: string) {
	const router = useRouter();
	const currentUser = useUserStore((state) => state.user);
	const isAuthenticated = useUserStore((state) => state.isAuthenticated);
	const { openModal } = useModalStore();

	const { data: followingIds = [] } = useUserFollowingIds();
	const toggleFollowMutation = useToggleFollow();

	const isArtistFollowed = followingIds.includes(artistId);

	const handleFollowToggle = useCallback(
		(e?: React.MouseEvent) => {
			if (e) {
				e.preventDefault();
				e.stopPropagation();
			}

			if (!isAuthenticated || !currentUser) {
				openModal({
					title: "Login diperlukan",
					description: "Silakan login terlebih dahulu untuk mengikuti artist.",
					type: "confirm",
					confirmLabel: "Login",
					cancelLabel: "Batal",
					onConfirm: () => router.push("/login"),
				});
				return;
			}

			if (currentUser.role !== "artist" && currentUser.role !== "client") {
				openModal({
					title: "Akses Terbatas",
					description:
						"Hanya akun client dan artist yang dapat mengikuti artis.",
				});
				return;
			}

			toggleFollowMutation.mutate(artistId);
		},
		[
			isAuthenticated,
			currentUser,
			artistId,
			toggleFollowMutation,
			openModal,
			router,
		],
	);

	return {
		isArtistFollowed,
		handleFollowToggle,
		isLoading: toggleFollowMutation.isPending,
	};
}
