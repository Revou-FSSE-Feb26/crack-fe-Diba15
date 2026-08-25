import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { axiosClient } from "@/lib/axiosClient";
import { queryKeys } from "@/lib/queryKeys";
import type {
	ActionResult,
	ArtistDetailResponse,
	Artwork,
	ArtworkWithRelations,
	CreateArtworkPayload,
	PaginatedArtworksResponse,
	ProfileWithUser,
	Tag,
} from "@/types";

// ─── Query Keys (Referencing Central Factory) ──────────────────────────────
export const artworkKeys = queryKeys.artworks;

// ─── Query Hooks ─────────────────────────────────────────────────────────────
export function useArtworks(filters?: {
	search?: string;
	tag?: string;
	artistId?: string;
	curationStatus?: string;
	isVisibleOnFeed?: string;
}) {
	return useQuery<ArtworkWithRelations[]>({
		queryKey: artworkKeys.list(filters),
		queryFn: async () => {
			const res = await axiosClient.get("/artwork", { params: filters });
			if (
				res.data &&
				!Array.isArray(res.data) &&
				Array.isArray(res.data.data)
			) {
				return res.data.data;
			}
			return res.data;
		},
	});
}

export function useInfiniteArtworks(
	filters?: {
		search?: string;
		tag?: string;
		artistId?: string;
		curationStatus?: string;
		isVisibleOnFeed?: string;
	},
	limit = 6,
) {
	return useInfiniteQuery<PaginatedArtworksResponse>({
		queryKey: artworkKeys.infiniteList(filters, limit),
		queryFn: async ({ pageParam = 1 }) => {
			const res = await axiosClient.get("/artwork", {
				params: {
					...filters,
					page: pageParam,
					limit,
				},
			});

			// Normalisasi respon jika mengembalikan array langsung
			if (Array.isArray(res.data)) {
				return {
					data: res.data,
					meta: {
						page: pageParam as number,
						limit,
						total: res.data.length,
						total_pages: 1,
						has_more: false,
					},
				};
			}

			return res.data;
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage) => {
			if (lastPage?.meta?.has_more) {
				return lastPage.meta.page + 1;
			}
			return undefined;
		},
	});
}

export function usePopularTags() {
	return useQuery<Tag[]>({
		queryKey: artworkKeys.popularTags(),
		queryFn: async () => {
			const res = await axiosClient.get("/artwork/tags/popular");
			return res.data;
		},
	});
}

export function usePopularArtists() {
	return useQuery<ProfileWithUser[]>({
		queryKey: artworkKeys.popularArtists(),
		queryFn: async () => {
			const res = await axiosClient.get("/artwork/artists/popular");
			return res.data;
		},
	});
}

export function useAllArtists() {
	return useQuery<ProfileWithUser[]>({
		queryKey: artworkKeys.artistsList(),
		queryFn: async () => {
			const res = await axiosClient.get("/artwork/artists");
			return res.data;
		},
	});
}

export function useArtistDetail(id: string) {
	return useQuery<ArtistDetailResponse>({
		queryKey: artworkKeys.artistDetail(id),
		queryFn: async () => {
			const res = await axiosClient.get(`/artwork/artists/${id}`);
			return res.data;
		},
		enabled: !!id,
	});
}

export function useAllTags() {
	return useQuery<Tag[]>({
		queryKey: artworkKeys.tagsList(),
		queryFn: async () => {
			const res = await axiosClient.get("/artwork/tags");
			return res.data;
		},
	});
}

export function useArtworkDetail(id: string) {
	return useQuery<ArtworkWithRelations>({
		queryKey: artworkKeys.detail(id),
		queryFn: async () => {
			const res = await axiosClient.get(`/artwork/${id}`);
			return res.data;
		},
		enabled: !!id,
	});
}

export function usePendingArtworks() {
	return useQuery<ArtworkWithRelations[]>({
		queryKey: artworkKeys.pending(),
		queryFn: async () => {
			const res = await axiosClient.get("/artwork/pending");
			return res.data;
		},
	});
}

// ─── Mutation Hooks ──────────────────────────────────────────────────────────
export function useCreateArtwork() {
	const queryClient = useQueryClient();
	return useMutation<Artwork, Error, CreateArtworkPayload>({
		mutationFn: async (payload) => {
			const res = await axiosClient.post("/artwork", {
				title: payload.title,
				description: payload.description,
				imagesUrl: payload.images_url,
				wipProofUrl: payload.wip_proof_url,
				uploadType: payload.upload_type,
				tagNames: payload.tag_names,
				curationStatus: payload.curation_status,
				isVisibleOnFeed: payload.is_visible_on_feed,
			});
			return res.data;
		},
		onSuccess: () => {
			// Otomatis refresh cache daftar artwork
			queryClient.invalidateQueries({ queryKey: artworkKeys.lists() });
		},
	});
}

export function useCurateArtwork() {
	const queryClient = useQueryClient();
	return useMutation<
		Artwork,
		Error,
		{ id: string; status: "approved" | "rejected"; reason?: string }
	>({
		mutationFn: async ({ id, status, reason }) => {
			const res = await axiosClient.patch(`/artwork/${id}/curate`, {
				curationStatus: status,
				rejectionReason: reason,
			});
			return res.data;
		},
		onSuccess: (_data, variables) => {
			// Invalidate list feed, pending curation list, and detail page
			queryClient.invalidateQueries({ queryKey: artworkKeys.lists() });
			queryClient.invalidateQueries({ queryKey: artworkKeys.pending() });
			queryClient.invalidateQueries({
				queryKey: artworkKeys.detail(variables.id),
			});
		},
	});
}

export function useDeleteArtwork() {
	const queryClient = useQueryClient();
	return useMutation<ActionResult, Error, string>({
		mutationFn: async (id) => {
			await axiosClient.delete(`/artwork/${id}`);
			return { success: true, message: "Artwork berhasil dihapus." };
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: artworkKeys.lists() });
		},
	});
}
