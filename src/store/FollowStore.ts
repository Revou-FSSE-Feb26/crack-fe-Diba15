"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FollowRecord, FollowState } from "@/types";

// TODO(backend): Store ini masih 100% client-side (Zustand + persist ke localStorage).
// Belum ada Next.js API route / panggilan axiosServer yang menghubungkannya ke backend NestJS.
// Perlu dibuatkan route handler (mirip src/app/api/artwork atau src/app/api/user) dan
// diganti pemanggilannya di sini sebelum fitur follow ini dianggap production-ready.

export const useFollowStore = create<FollowState>()(
	persist(
		(set, get) => ({
			follows: [],

			followArtist: (followerId, artistId) => {
				if (followerId === artistId) {
					return {
						success: false,
						message: "Anda tidak dapat mengikuti diri sendiri.",
					};
				}

				const alreadyFollowing = get().follows.some(
					(f) => f.follower_id === followerId && f.artist_id === artistId,
				);

				if (alreadyFollowing) {
					return {
						success: false,
						message: "Anda sudah mengikuti artis ini.",
					};
				}

				const newRecord: FollowRecord = {
					id: `follow-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
					follower_id: followerId,
					artist_id: artistId,
					created_at: new Date().toISOString(),
				};

				set((state) => ({
					follows: [...state.follows, newRecord],
				}));

				return {
					success: true,
					message: "Berhasil mengikuti artis.",
				};
			},

			unfollowArtist: (followerId, artistId) => {
				const isExist = get().follows.some(
					(f) => f.follower_id === followerId && f.artist_id === artistId,
				);

				if (!isExist) {
					return {
						success: false,
						message: "Anda belum mengikuti artis ini.",
					};
				}

				set((state) => ({
					follows: state.follows.filter(
						(f) => !(f.follower_id === followerId && f.artist_id === artistId),
					),
				}));

				return {
					success: true,
					message: "Batal mengikuti artis.",
				};
			},

			isFollowing: (followerId, artistId) => {
				return get().follows.some(
					(f) => f.follower_id === followerId && f.artist_id === artistId,
				);
			},

			getFollowedArtistIds: (followerId) => {
				return get()
					.follows.filter((f) => f.follower_id === followerId)
					.map((f) => f.artist_id);
			},
		}),
		{
			name: "trubrush-follows",
		},
	),
);
