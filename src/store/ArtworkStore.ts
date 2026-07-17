"use client";

import { create } from "zustand";
import type { ArtworkState } from "@/types";

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
	// biome-ignore lint/suspicious/noExplicitAny: shell compatibility
	createArtwork: async () => ({}) as any,
	approveArtwork: async () => ({ success: true, message: "" }),
	rejectArtwork: async () => ({ success: true, message: "" }),
	deleteArtwork: async () => ({ success: true, message: "" }),
}));
