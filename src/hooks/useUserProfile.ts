import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useArtistDetail } from "@/hooks/useArtworkQueries";
import { useUserCommissions } from "@/hooks/useCommissionQueries";
import { useToggleFollow, useUserFollowing } from "@/hooks/useSocialQueries";
import { axiosClient } from "@/lib/axiosClient";
import { queryKeys } from "@/lib/queryKeys";
import { useToastStore } from "@/store/ToastStore";
import { useUserStore } from "@/store/UserStore";
import type { Profile } from "@/types";

/**
 * 👤 useUserProfile (Custom Hook)
 * Merangkum logika data profil, followed artists, riwayat komisi,
 * upload avatar (dengan validasi tipe & ukuran berkas), serta aksi unfollow via API Backend.
 */
export function useUserProfile(userId: string) {
	const queryClient = useQueryClient();
	const { user, updateCurrentUser } = useUserStore();
	const { addToast } = useToastStore();
	const { data: commissions = [] } = useUserCommissions();

	const { data: rawFollowedArtists = [] } = useUserFollowing();
	const toggleFollowMutation = useToggleFollow();

	const isSelf = user?.id === userId;
	const { data: artistDetail } = useArtistDetail(isSelf ? "" : userId);

	const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

	const profile = useMemo(() => {
		if (isSelf) {
			return user?.profile;
		}

		if (artistDetail) {
			return {
				id: artistDetail.id,
				user_id: artistDetail.user_id || artistDetail.id,
				avatar_url: artistDetail.avatar_url ?? null,
				bio: artistDetail.bio ?? null,
				social_links: artistDetail.social_links ?? null,
				is_verified: artistDetail.is_verified ?? false,
				approved_portfolio_count: artistDetail.approved_portfolio_count ?? 0,
				is_open_for_commission: artistDetail.is_open_for_commission ?? false,
				base_price_idr: artistDetail.base_price_idr ?? null,
				strike_count: 0,
				updated_at: new Date().toISOString(),
			} as Profile;
		}

		return undefined;
	}, [isSelf, user?.profile, artistDetail]);

	const updateProfile = async (
		targetUserId: string,
		payload: Partial<Profile>,
	) => {
		try {
			await axiosClient.patch("/profile", {
				avatarUrl: payload.avatar_url,
				bio: payload.bio,
				instagramUrl: payload.social_links?.instagram || null,
				twitterUrl: payload.social_links?.twitter || null,
				pixivUrl: payload.social_links?.pixiv || null,
				websiteUrl: payload.social_links?.website || null,
				isOpenForCommission: payload.is_open_for_commission,
				basePriceIdr: payload.base_price_idr,
			});

			if (user?.id === targetUserId && user.profile) {
				updateCurrentUser({
					profile: {
						...user.profile,
						...payload,
					},
				});
			}

			// Invalidate queries in cache
			queryClient.invalidateQueries({
				queryKey: queryKeys.artworks.artistDetail(targetUserId),
			});
			queryClient.invalidateQueries({
				queryKey: queryKeys.artworks.artistsList(),
			});

			return { success: true, message: "Profil berhasil diperbarui." };
		} catch (error) {
			const err = error as { response?: { data?: { message?: string } } };
			return {
				success: false,
				message: err.response?.data?.message || "Gagal memperbarui profil.",
			};
		}
	};

	const updateUserData = async (
		targetUserId: string,
		payload: { name?: string },
	) => {
		try {
			await axiosClient.patch(`/user/${targetUserId}`, payload);
			if (user?.id === targetUserId && payload.name) {
				updateCurrentUser({ name: payload.name });
			}
			queryClient.invalidateQueries({
				queryKey: queryKeys.artworks.artistDetail(targetUserId),
			});
			return { success: true, message: "Data pengguna berhasil diperbarui." };
		} catch (error) {
			const err = error as { response?: { data?: { message?: string } } };
			return {
				success: false,
				message:
					err.response?.data?.message || "Gagal memperbarui data pengguna.",
			};
		}
	};

	const followedArtists = useMemo(() => {
		return rawFollowedArtists.map((artist) => ({
			id: artist.id,
			name: artist.name,
			email: artist.email,
			profile: artist.profile
				? {
						id: artist.profile.id,
						avatar_url: artist.profile.avatarUrl,
						bio: artist.profile.bio,
						is_verified: artist.profile.isVerified,
					}
				: undefined,
		}));
	}, [rawFollowedArtists]);

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
		toggleFollowMutation.mutate(artistId);
	};

	return {
		profile,
		followedArtists,
		userCommissions,
		isUploadingAvatar,
		handleAvatarUpload,
		handleUnfollowArtist,
		updateProfile,
		updateUserData,
		updateCurrentUser,
		addToast,
	};
}
