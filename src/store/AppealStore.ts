"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useProfileStore } from "@/store/ProfileStore";

// TODO(backend): Store ini masih 100% client-side (Zustand + persist ke localStorage).
// Belum ada Next.js API route / panggilan axiosServer yang menghubungkannya ke backend NestJS.
// Perlu dibuatkan route handler (mirip src/app/api/artwork atau src/app/api/user) dan
// diganti pemanggilannya di sini sebelum fitur appeal ini dianggap production-ready.

export interface Appeal {
	id: string;
	artist_id: string;
	reason: string;
	status: "pending" | "approved" | "rejected";
	created_at: string;
}

interface AppealState {
	appeals: Appeal[];
	createAppeal: (
		artistId: string,
		reason: string,
	) => { success: boolean; message: string };
	resolveAppeal: (
		appealId: string,
		approved: boolean,
	) => { success: boolean; message: string };
	getAppealByArtistId: (artistId: string) => Appeal | undefined;
}

export const useAppealStore = create<AppealState>()(
	persist(
		(set, get) => ({
			appeals: [],

			createAppeal: (artistId, reason) => {
				const trimmed = reason.trim();
				if (trimmed.length < 30) {
					return {
						success: false,
						message: "Alasan banding minimal harus 30 karakter.",
					};
				}

				// Check if there is already a pending appeal
				const existing = get().appeals.find(
					(app) => app.artist_id === artistId && app.status === "pending",
				);
				if (existing) {
					return {
						success: false,
						message:
							"Anda sudah memiliki pengajuan banding yang sedang ditinjau.",
					};
				}

				const newAppeal: Appeal = {
					id: `app-${Date.now()}`,
					artist_id: artistId,
					reason: trimmed,
					status: "pending",
					created_at: new Date().toISOString(),
				};

				set((state) => ({ appeals: [newAppeal, ...state.appeals] }));
				return {
					success: true,
					message:
						"Permohonan banding berhasil dikirim. Menunggu tinjauan admin.",
				};
			},

			resolveAppeal: (appealId, approved) => {
				const appeals = get().appeals;
				const target = appeals.find((app) => app.id === appealId);

				if (!target) {
					return {
						success: false,
						message: "Pengajuan banding tidak ditemukan.",
					};
				}

				if (target.status !== "pending") {
					return {
						success: false,
						message: "Banding ini sudah diproses sebelumnya.",
					};
				}

				// Update appeal status
				set((state) => ({
					appeals: state.appeals.map((app) =>
						app.id === appealId
							? { ...app, status: approved ? "approved" : "rejected" }
							: app,
					),
				}));

				if (approved) {
					// Reset the artist's strike count to 0 in ProfileStore
					useProfileStore.getState().updateProfile(target.artist_id, {
						strike_count: 0,
					});
					return {
						success: true,
						message:
							"Banding disetujui. Akun artis berhasil dipulihkan (strike count di-reset ke 0).",
					};
				}

				return {
					success: true,
					message: "Banding ditolak. Akun artis tetap ditangguhkan.",
				};
			},

			getAppealByArtistId: (artistId) => {
				return get().appeals.find((app) => app.artist_id === artistId);
			},
		}),
		{
			name: "trubrush-appeals",
		},
	),
);
