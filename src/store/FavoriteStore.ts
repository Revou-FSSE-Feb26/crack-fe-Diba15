import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FavoriteState } from "@/types";

// TODO(backend): Store ini masih 100% client-side (Zustand + persist ke localStorage).
// Belum ada Next.js API route / panggilan axiosServer yang menghubungkannya ke backend NestJS.
// Perlu dibuatkan route handler (mirip src/app/api/artwork atau src/app/api/user) dan
// diganti pemanggilannya di sini sebelum fitur favorite ini dianggap production-ready.

export const useFavoriteStore = create<FavoriteState>()(
	persist(
		(set, get) => ({
			favoritesByUser: {},

			getFavoriteIds: (userId) => get().favoritesByUser[userId] ?? [],

			isFavorite: (userId, artworkId) =>
				get().getFavoriteIds(userId).includes(artworkId),

			addFavorite: (userId, artworkId) =>
				set((state) => {
					const currentFavorites = state.favoritesByUser[userId] ?? [];

					if (currentFavorites.includes(artworkId)) {
						return state;
					}

					return {
						favoritesByUser: {
							...state.favoritesByUser,
							[userId]: [...currentFavorites, artworkId],
						},
					};
				}),

			removeFavorite: (userId, artworkId) =>
				set((state) => ({
					favoritesByUser: {
						...state.favoritesByUser,
						[userId]: (state.favoritesByUser[userId] ?? []).filter(
							(favoriteId) => favoriteId !== artworkId,
						),
					},
				})),

			toggleFavorite: (userId, artworkId) => {
				const isCurrentlyFavorite = get().isFavorite(userId, artworkId);

				if (isCurrentlyFavorite) {
					get().removeFavorite(userId, artworkId);
					return false;
				}

				get().addFavorite(userId, artworkId);
				return true;
			},

			clearFavorites: (userId) =>
				set((state) => ({
					favoritesByUser: {
						...state.favoritesByUser,
						[userId]: [],
					},
				})),
		}),
		{
			name: "trubrush-favorites",
		},
	),
);
