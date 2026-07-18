"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useArtworkStore } from "@/store/ArtworkStore";
import { useProfileStore } from "@/store/ProfileStore";
import { useUserManagementStore } from "@/store/UserManagementStore";
import type { Report, ReportState } from "@/types";

// TODO(backend): Store ini masih 100% client-side (Zustand + persist ke localStorage).
// Belum ada Next.js API route / panggilan axiosServer yang menghubungkannya ke backend NestJS.
// Perlu dibuatkan route handler (mirip src/app/api/artwork atau src/app/api/user) dan
// diganti pemanggilannya di sini sebelum fitur report ini dianggap production-ready.

const now = () => new Date().toISOString();

export const useReportStore = create<ReportState>()(
	persist(
		(set, get) => ({
			reports: [],

			createReport: (payload) => {
				const { reporter_id, target_type, target_id, reason } = payload;
				const trimmedReason = reason.trim();

				const users = useUserManagementStore.getState().users;
				const reporter = users.find((u) => u.id === reporter_id);
				if (
					reporter &&
					reporter.role !== "artist" &&
					reporter.role !== "client"
				) {
					return {
						success: false,
						message: "Hanya client dan artist yang dapat melaporkan karya.",
					};
				}

				if (trimmedReason.length < 15) {
					return {
						success: false,
						message: "Alasan laporan minimal 15 karakter.",
					};
				}

				// Check if this user has already reported this artwork
				const alreadyReported = get().reports.some(
					(r) =>
						r.reporter_id === reporter_id &&
						r.target_type === target_type &&
						r.target_id === target_id &&
						r.status === "pending",
				);

				if (alreadyReported) {
					return {
						success: false,
						message:
							"Anda sudah melaporkan karya ini dan sedang dalam peninjauan.",
					};
				}

				const report: Report = {
					id: `rep-${Date.now()}`,
					reporter_id,
					target_type,
					target_id,
					reason: trimmedReason,
					status: "pending",
					created_at: now(),
				};

				set((state) => ({ reports: [report, ...state.reports] }));

				return {
					success: true,
					message: "Laporan berhasil dikirim dan akan ditinjau oleh Kurator.",
				};
			},

			resolveReport: (reportId, curatorId) => {
				const reports = get().reports;
				const targetReport = reports.find((r) => r.id === reportId);

				if (!targetReport) {
					return { success: false, message: "Laporan tidak ditemukan." };
				}

				if (targetReport.status !== "pending") {
					return {
						success: false,
						message: "Laporan ini sudah diproses sebelumnya.",
					};
				}

				// Find reported artwork
				const artworks = useArtworkStore.getState().artworks;
				const targetArtwork = artworks.find(
					(a) => a.id === targetReport.target_id,
				);

				if (!targetArtwork) {
					return {
						success: false,
						message: "Karya yang dilaporkan tidak ditemukan.",
					};
				}

				const artistId = targetArtwork.artists_id;

				// 1. Update report status to resolved
				set((state) => ({
					reports: state.reports.map((r) =>
						r.id === reportId ? { ...r, status: "resolved" } : r,
					),
				}));

				// 2. Hide artwork from feed and mark it flagged
				useArtworkStore.setState((state) => ({
					artworks: state.artworks.map((a) =>
						a.id === targetReport.target_id
							? {
									...a,
									is_visible_on_feed: false,
									curation_status: "flagged",
									reviewed_at: now(),
									reviewed_by: curatorId,
								}
							: a,
					),
				}));

				// 3. Increment artist strike count
				const profileStore = useProfileStore.getState();
				const artistProfile = profileStore.getProfileByUserId(artistId);

				if (artistProfile) {
					const currentStrike = artistProfile.strike_count ?? 0;
					const nextStrike = currentStrike + 1;
					profileStore.updateProfile(artistId, {
						strike_count: nextStrike,
					});
				}

				return {
					success: true,
					message:
						"Laporan disetujui. Karya telah disembunyikan dan artist menerima strike.",
				};
			},

			dismissReport: (reportId, _curatorId) => {
				const reports = get().reports;
				const targetReport = reports.find((r) => r.id === reportId);

				if (!targetReport) {
					return { success: false, message: "Laporan tidak ditemukan." };
				}

				if (targetReport.status !== "pending") {
					return {
						success: false,
						message: "Laporan ini sudah diproses sebelumnya.",
					};
				}

				// Update report status to dismissed
				set((state) => ({
					reports: state.reports.map((r) =>
						r.id === reportId ? { ...r, status: "dismissed" } : r,
					),
				}));

				return {
					success: true,
					message: "Laporan ditolak. Tidak ada tindakan yang diambil.",
				};
			},
		}),
		{
			name: "trubrush-reports",
		},
	),
);
