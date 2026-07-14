import { create } from "zustand";
import { persist } from "zustand/middleware";
import initialProfiles from "@/data/profiles";
import { axiosClient } from "@/lib/axiosClient";
import type { ProfileState } from "@/types";

const now = () => new Date().toISOString();

export const useProfileStore = create<ProfileState>()(
	persist(
		(set, get) => ({
			profiles: initialProfiles,

			getProfileByUserId: (userId) =>
				get().profiles.find((profile) => profile.user_id === userId),

			updateProfile: async (userId, payload) => {
				try {
					// 1. Coba kirim data update ke API Route Handler Next.js
					const res = await axiosClient.patch("/profile", payload);
					const dbProfile = res.data;

					// Petakan properti dari backend (camelCase) ke tipe frontend (snake_case)
					const mappedProfile = {
						id: dbProfile.id,
						user_id: dbProfile.userId,
						avatar_url: dbProfile.avatarUrl,
						bio: dbProfile.bio,
						is_verified: dbProfile.isVerified,
						approved_portfolio_count: dbProfile.approvedPortfolioCount,
						is_open_for_commission: dbProfile.isOpenForCommission,
						base_price_idr: dbProfile.basePriceIdr,
						strike_count: dbProfile.strikeCount,
						updated_at: dbProfile.updatedAt,
					};

					set((state) => {
						const exists = state.profiles.some((p) => p.user_id === userId);
						const nextProfiles = exists
							? state.profiles.map((p) =>
									p.user_id === userId ? mappedProfile : p,
								)
							: [mappedProfile, ...state.profiles];
						return { profiles: nextProfiles };
					});

					return { success: true, message: "Profile berhasil diperbarui." };
				} catch (error) {
					const err = error as {
						response?: { status?: number; data?: { message?: string } };
					};

					// Jika backend offline, lakukan fallback ke update data lokal mock
					if (!err.response) {
						console.warn(
							"NestJS API offline. Falling back to local mock profile update...",
						);
						const target = get().profiles.find(
							(profile) => profile.user_id === userId,
						);

						if (!target) {
							return { success: false, message: "Profile tidak ditemukan." };
						}

						set((state) => ({
							profiles: state.profiles.map((profile) =>
								profile.user_id === userId
									? { ...profile, ...payload, updated_at: now() }
									: profile,
							),
						}));

						return {
							success: true,
							message: "Profile berhasil diperbarui via Mock (Offline).",
						};
					}

					const errMsg =
						err.response?.data?.message || "Gagal memperbarui profile.";
					return { success: false, message: errMsg };
				}
			},
		}),
		{
			name: "trubrush-profiles",
		},
	),
);
