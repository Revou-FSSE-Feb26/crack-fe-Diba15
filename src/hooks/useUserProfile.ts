import { useMemo, useState } from "react";
import { axiosClient } from "@/lib/axiosClient";
import { useCommissionStore } from "@/store/CommissionStore";
import { useFollowStore } from "@/store/FollowStore";
import { useProfileStore } from "@/store/ProfileStore";
import { useToastStore } from "@/store/ToastStore";
import { useUserManagementStore } from "@/store/UserManagementStore";
import { useUserStore } from "@/store/UserStore";

/**
 * 👤 useUserProfile (Custom Hook)
 * Merangkum logika data profil, followed artists, riwayat komisi,
 * upload avatar (dengan validasi tipe & ukuran berkas), serta aksi unfollow.
 */
export function useUserProfile(userId: string) {
	const { profiles, updateProfile } = useProfileStore();
	const { updateCurrentUser } = useUserStore();
	const { addToast } = useToastStore();
	const { getFollowedArtistIds, unfollowArtist } = useFollowStore();
	const { users } = useUserManagementStore();
	const { commissions } = useCommissionStore();

	const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

	const profile = useMemo(() => {
		return profiles.find((p) => p.user_id === userId);
	}, [profiles, userId]);

	const followedArtistIds = useMemo(() => {
		return getFollowedArtistIds(userId);
	}, [getFollowedArtistIds, userId]);

	const followedArtists = useMemo(() => {
		return users
			.filter((u) => followedArtistIds.includes(u.id))
			.map((u) => {
				const prof = profiles.find((p) => p.user_id === u.id);
				return {
					...u,
					profile: prof,
				};
			});
	}, [users, followedArtistIds, profiles]);

	const userCommissions = useMemo(() => {
		return commissions.filter(
			(c) => c.artists_id === userId || c.client_id === userId,
		);
	}, [commissions, userId]);

	const handleAvatarUpload = async (file: File) => {
		// Validasi tipe berkas
		const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
		if (!allowed.includes(file.type)) {
			addToast({
				message:
					"Format file tidak valid. Hanya png, jpg, jpeg, dan webp yang diperbolehkan.",
				type: "error",
			});
			return;
		}

		// Validasi ukuran berkas (maks 2MB)
		const maxSize = 2 * 1024 * 1024;
		if (file.size > maxSize) {
			addToast({
				message: "Ukuran file terlalu besar. Maksimal 2MB.",
				type: "error",
			});
			return;
		}

		const formData = new FormData();
		formData.append("file", file);

		setIsUploadingAvatar(true);
		try {
			// Request ke BFF Next.js
			const response = await axiosClient.post("/upload", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			if (response.data?.url) {
				const avatarUrl = response.data.url;

				// Update di level database backend
				await axiosClient.patch("/profile", {
					avatarUrl,
				});

				// Update di level store lokal
				updateProfile(userId, { avatar_url: avatarUrl });

				addToast({
					message: "Foto profil berhasil diperbarui.",
					type: "success",
				});
			}
		} catch (error) {
			console.error("Gagal mengunggah avatar:", error);
			addToast({
				message: "Gagal mengunggah foto profil.",
				type: "error",
			});
		} finally {
			setIsUploadingAvatar(false);
		}
	};

	const handleUnfollowArtist = async (artistId: string) => {
		unfollowArtist(userId, artistId);
		addToast({
			message: "Berhasil berhenti mengikuti artis.",
			type: "success",
		});
	};

	return {
		profile,
		followedArtists,
		userCommissions,
		isUploadingAvatar,
		handleAvatarUpload,
		handleUnfollowArtist,
		updateProfile,
		updateCurrentUser,
		addToast,
	};
}
