import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useFollowStore } from "@/store/FollowStore";
import { useModalStore } from "@/store/ModalStore";
import { useUserStore } from "@/store/UserStore";

/**
 * 🔗 useFollowArtist (Custom Hook)
 * Merangkum seluruh pengecekan, login redirect modal, validasi role,
 * dan sinkronisasi status follow/unfollow artis di berbagai halaman.
 */
export function useFollowArtist(artistId: string) {
	const router = useRouter();
	const currentUser = useUserStore((state) => state.user);
	const isAuthenticated = useUserStore((state) => state.isAuthenticated);
	const { openModal } = useModalStore();
	const { followArtist, unfollowArtist, isFollowing } = useFollowStore();

	const isArtistFollowed = currentUser
		? isFollowing(currentUser.id, artistId)
		: false;

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

			if (isArtistFollowed) {
				unfollowArtist(currentUser.id, artistId);
			} else {
				followArtist(currentUser.id, artistId);
			}
		},
		[
			isAuthenticated,
			currentUser,
			isArtistFollowed,
			artistId,
			followArtist,
			unfollowArtist,
			openModal,
			router,
		],
	);

	return {
		isArtistFollowed,
		handleFollowToggle,
	};
}
