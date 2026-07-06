"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import initialArtworks from "@/data/artworks";
import initialArtworkTags from "@/data/artworkTags";
import initialTags from "@/data/tags";
import type { Artwork, ArtworkTag, CurationStatus, Tag, UploadType } from "@/types";

interface CreateArtworkPayload {
  artists_id: string;
  title: string;
  description: string | null;
  images_url: string[];
  wip_proof_url?: string;
  upload_type: UploadType;
  curation_status: CurationStatus;
  is_visible_on_feed: boolean;
  tag_names: string[];
}

interface ArtworkState {
  artworks: Artwork[];
  artworkTags: ArtworkTag[];
  tags: Tag[];
  createArtwork: (payload: CreateArtworkPayload) => Artwork;
}

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
          .filter((tagName) =>
            !existingTags.some((tag) => normalizeTag(tag.tag_name) === tagName),
          )
          .map((tagName) => ({
            id: `t-${Date.now()}-${tagName.replace(/[^a-z0-9]+/g, "-")}`,
            tag_name: tagName.replace(/\b\w/g, (char) => char.toUpperCase()),
          }));

        const allTags = [...existingTags, ...tagsToCreate];
        const nextArtworkTags: ArtworkTag[] = uniqueTagNames
          .map((tagName) => allTags.find((tag) => normalizeTag(tag.tag_name) === tagName))
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
    }),
    {
      name: "trubrush-artworks",
    },
  ),
);
