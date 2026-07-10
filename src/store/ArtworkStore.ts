"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import initialArtworks from "@/data/artworks";
import initialArtworkTags from "@/data/artworkTags";
import initialTags from "@/data/tags";
import type { Artwork, ArtworkState, ArtworkTag, Tag } from "@/types";
import { syncVerificationAfterReview } from "@/utils/artistVerification";

const now = () => new Date().toISOString();
const normalizeTag = (value: string) => value.trim().toLowerCase();

export const useArtworkStore = create<ArtworkState>()(
	persist(
		(set, get) => ({
			artworks: initialArtworks,
			artworkTags: initialArtworkTags,
			tags: initialTags,

			createArtwork: (payload) => {
				const createdAt = now();
				const artwork: Artwork = {
					id: `a-${Date.now()}`,
					artists_id: payload.artists_id,
					title: payload.title,
					description: payload.description,
					images_url: payload.images_url,
					wip_proof_url: payload.wip_proof_url,
					upload_type: payload.upload_type,
					curation_status: payload.curation_status,
					is_visible_on_feed: payload.is_visible_on_feed,
					created_at: createdAt,
				};

				const existingTags = get().tags;
				const uniqueTagNames = Array.from(
					new Set(payload.tag_names.map(normalizeTag).filter(Boolean)),
				);

				const tagsToCreate: Tag[] = uniqueTagNames
					.filter(
						(tagName) =>
							!existingTags.some(
								(tag) => normalizeTag(tag.tag_name) === tagName,
							),
					)
					.map((tagName) => ({
						id: `t-${Date.now()}-${tagName.replace(/[^a-z0-9]+/g, "-")}`,
						tag_name: tagName.replace(/\b\w/g, (char) => char.toUpperCase()),
					}));

				const allTags = [...existingTags, ...tagsToCreate];
				const nextArtworkTags: ArtworkTag[] = uniqueTagNames
					.map((tagName) =>
						allTags.find((tag) => normalizeTag(tag.tag_name) === tagName),
					)
					.filter((tag): tag is Tag => Boolean(tag))
					.map((tag) => ({
						artwork_id: artwork.id,
						tag_id: tag.id,
					}));

				set((state) => ({
					artworks: [artwork, ...state.artworks],
					tags: [...state.tags, ...tagsToCreate],
					artworkTags: [...nextArtworkTags, ...state.artworkTags],
				}));

				return artwork;
			},

			approveArtwork: (id, curatorId) => {
				const target = get().artworks.find((artwork) => artwork.id === id);

				if (!target) {
					return { success: false, message: "Artwork tidak ditemukan." };
				}

				if (target.curation_status !== "pending") {
					return {
						success: false,
						message: "Artwork ini sudah diproses sebelumnya.",
					};
				}

				set((state) => ({
					artworks: state.artworks.map((artwork) =>
						artwork.id === id
							? {
									...artwork,
									curation_status: "approved",
									is_visible_on_feed: true,
									rejection_reason: null,
									reviewed_at: now(),
									reviewed_by: curatorId,
								}
							: artwork,
					),
				}));

				syncVerificationAfterReview(target.artists_id, get().artworks);

				return {
					success: true,
					message: `"${target.title}" berhasil disetujui dan tampil di feed.`,
				};
			},

			rejectArtwork: (id, curatorId, reason) => {
				const trimmedReason = reason.trim();
				const target = get().artworks.find((artwork) => artwork.id === id);

				if (!target) {
					return { success: false, message: "Artwork tidak ditemukan." };
				}

				if (target.curation_status !== "pending") {
					return {
						success: false,
						message: "Artwork ini sudah diproses sebelumnya.",
					};
				}

				if (trimmedReason.length < 10) {
					return {
						success: false,
						message: "Alasan penolakan minimal 10 karakter.",
					};
				}

				set((state) => ({
					artworks: state.artworks.map((artwork) =>
						artwork.id === id
							? {
									...artwork,
									curation_status: "rejected",
									is_visible_on_feed: false,
									rejection_reason: trimmedReason,
									reviewed_at: now(),
									reviewed_by: curatorId,
								}
							: artwork,
					),
				}));

				syncVerificationAfterReview(target.artists_id, get().artworks);

				return {
					success: true,
					message: `"${target.title}" ditolak. Artist akan menerima alasan penolakan.`,
				};
			},
		}),
		{
			name: "trubrush-artworks",
		},
	),
);
