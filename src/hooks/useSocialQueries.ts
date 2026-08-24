import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axiosClient";
import { useToastStore } from "@/store/ToastStore";
import { useUserStore } from "@/store/UserStore";
import type { ArtworkWithRelations } from "@/types";

// Fetch user's favorite artwork IDs
export function useUserFavoriteIds() {
	const isAuthenticated = useUserStore((state) => state.isAuthenticated);

	return useQuery<string[]>({
		queryKey: ["user-favorite-ids"],
		queryFn: async () => {
			const res = await axiosClient.get("/social/favorite/ids");
			return res.data;
		},
		enabled: isAuthenticated,
		staleTime: 1000 * 60 * 5,
	});
}

// Fetch user's favorite artworks
export function useUserFavorites() {
	const isAuthenticated = useUserStore((state) => state.isAuthenticated);

	return useQuery<ArtworkWithRelations[]>({
		queryKey: ["user-favorites"],
		queryFn: async () => {
			const res = await axiosClient.get("/social/favorite");
			return res.data;
		},
		enabled: isAuthenticated,
	});
}

// Toggle Favorite Mutation with Optimistic UI Update (Instagram-speed)
export function useToggleFavorite() {
	const queryClient = useQueryClient();
	const { addToast } = useToastStore();

	return useMutation({
		mutationFn: async (artworkId: string) => {
			const res = await axiosClient.post(`/social/favorite/${artworkId}`);
			return res.data;
		},
		onMutate: async (artworkId: string) => {
			// 1. Batalkan refetch berjalan agar tidak menimpa update instan kita
			await queryClient.cancelQueries({ queryKey: ["user-favorite-ids"] });

			// 2. Simpan snapshot data sebelumnya untuk rollback jika error
			const previousFavoriteIds =
				queryClient.getQueryData<string[]>(["user-favorite-ids"]) ?? [];

			// 3. Ubah data di cache secara instan (0 ms)
			const isCurrentlyFavorite = previousFavoriteIds.includes(artworkId);
			const updatedFavoriteIds = isCurrentlyFavorite
				? previousFavoriteIds.filter((id) => id !== artworkId)
				: [...previousFavoriteIds, artworkId];

			queryClient.setQueryData(["user-favorite-ids"], updatedFavoriteIds);

			return { previousFavoriteIds };
		},
		onError: (error, _artworkId, context) => {
			// Rollback cache ke kondisi awal jika request gagal
			if (context?.previousFavoriteIds) {
				queryClient.setQueryData(
					["user-favorite-ids"],
					context.previousFavoriteIds,
				);
			}
			let msg = "Gagal mengubah status favorit.";
			if (error && typeof error === "object" && "response" in error) {
				const errObj = error as { response?: { data?: { message?: string } } };
				if (errObj.response?.data?.message) {
					msg = errObj.response.data.message;
				}
			}
			addToast({ message: msg, type: "error" });
		},
		onSettled: (_data, _error, artworkId) => {
			// Sinkronisasi data di latar belakang
			queryClient.invalidateQueries({ queryKey: ["user-favorite-ids"] });
			queryClient.invalidateQueries({ queryKey: ["user-favorites"] });
			queryClient.invalidateQueries({ queryKey: ["artworks"] });
			queryClient.invalidateQueries({ queryKey: ["artwork", artworkId] });
		},
	});
}

// Fetch user's following artist IDs
export function useUserFollowingIds() {
	const isAuthenticated = useUserStore((state) => state.isAuthenticated);

	return useQuery<string[]>({
		queryKey: ["user-following-ids"],
		queryFn: async () => {
			const res = await axiosClient.get("/social/following/ids");
			return res.data;
		},
		enabled: isAuthenticated,
		staleTime: 1000 * 60 * 5,
	});
}

// Fetch user's followed artists list
export function useUserFollowing() {
	const isAuthenticated = useUserStore((state) => state.isAuthenticated);

	return useQuery<
		Array<{
			id: string;
			name: string;
			email: string;
			profile?: {
				id?: string;
				avatarUrl?: string;
				bio?: string;
				isVerified?: boolean;
			};
		}>
	>({
		queryKey: ["user-following"],
		queryFn: async () => {
			const res = await axiosClient.get("/social/following");
			return res.data;
		},
		enabled: isAuthenticated,
	});
}

// Toggle Follow Mutation with Optimistic UI Update
export function useToggleFollow() {
	const queryClient = useQueryClient();
	const { addToast } = useToastStore();

	return useMutation({
		mutationFn: async (artistId: string) => {
			const res = await axiosClient.post(`/social/follow/${artistId}`);
			return res.data;
		},
		onMutate: async (artistId: string) => {
			// 1. Batalkan query berjalan
			await queryClient.cancelQueries({ queryKey: ["user-following-ids"] });

			// 2. Simpan snapshot data sebelumnya
			const previousFollowingIds =
				queryClient.getQueryData<string[]>(["user-following-ids"]) ?? [];

			// 3. Ubah data di cache secara instan (0 ms)
			const isCurrentlyFollowing = previousFollowingIds.includes(artistId);
			const updatedFollowingIds = isCurrentlyFollowing
				? previousFollowingIds.filter((id) => id !== artistId)
				: [...previousFollowingIds, artistId];

			queryClient.setQueryData(["user-following-ids"], updatedFollowingIds);

			return { previousFollowingIds };
		},
		onError: (error, _artistId, context) => {
			if (context?.previousFollowingIds) {
				queryClient.setQueryData(
					["user-following-ids"],
					context.previousFollowingIds,
				);
			}
			let msg = "Gagal mengubah status follow.";
			if (error && typeof error === "object" && "response" in error) {
				const errObj = error as { response?: { data?: { message?: string } } };
				if (errObj.response?.data?.message) {
					msg = errObj.response.data.message;
				}
			}
			addToast({ message: msg, type: "error" });
		},
		onSettled: (_data, _error, artistId) => {
			queryClient.invalidateQueries({ queryKey: ["user-following-ids"] });
			queryClient.invalidateQueries({ queryKey: ["user-following"] });
			queryClient.invalidateQueries({ queryKey: ["artist-detail", artistId] });
		},
	});
}
