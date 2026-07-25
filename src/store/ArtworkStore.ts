"use client";

import { create } from "zustand";
import type { ArtworkState, ArtworkWithRelations } from "@/types";

/**
 * 🗄️ useArtworkStore (Client State Shell)
 *
 * Catatan: Semua server state (fetching feed, popular tags, detail karya, kurasi)
 * sekarang dikelola secara profesional oleh TanStack Query (React Query v5)
 * di `/hooks/useArtworkQueries.ts`.
 *
 * File store ini dipertahankan hanya sebagai cangkang (shell) untuk kompatibilitas
 * tipe dan tanda tangan fungsi di bagian lain kode.
 */
export const useArtworkStore = create<ArtworkState>()(() => ({
	artworks: [],
	artworkTags: [],
	tags: [],

	fetchArtworks: async () => {},
	fetchPopularTags: async () => [],
	fetchArtworkById: async () => null,
	createArtwork: async () => ({}) as unknown as ArtworkWithRelations,
	approveArtwork: async () => ({ success: true, message: "" }),
	rejectArtwork: async () => ({ success: true, message: "" }),
	deleteArtwork: async () => ({ success: true, message: "" }),
}));
