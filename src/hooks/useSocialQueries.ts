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

// Toggle Favorite Mutation
export function useToggleFavorite() {
	const queryClient = useQueryClient();
	const { addToast } = useToastStore();

	return useMutation({
		mutationFn: async (artworkId: string) => {
			const res = await axiosClient.post(`/social/favorite/${artworkId}`);
			return res.data;
		},
		onSuccess: (data, artworkId) => {
			queryClient.invalidateQueries({ queryKey: ["user-favorite-ids"] });
			queryClient.invalidateQueries({ queryKey: ["user-favorites"] });
			queryClient.invalidateQueries({ queryKey: ["artworks"] });
			queryClient.invalidateQueries({ queryKey: ["artwork", artworkId] });
			addToast({
				message: data.message,
				type: data.isFavorited ? "success" : "info",
			});
		},
		onError: (error) => {
			let msg = "Gagal mengubah status favorit.";
			if (error && typeof error === "object" && "response" in error) {
				const errObj = error as { response?: { data?: { message?: string } } };
				if (errObj.response?.data?.message) {
					msg = errObj.response.data.message;
				}
			}
			addToast({ message: msg, type: "error" });
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

// Toggle Follow Mutation
export function useToggleFollow() {
	const queryClient = useQueryClient();
	const { addToast } = useToastStore();

	return useMutation({
		mutationFn: async (artistId: string) => {
			const res = await axiosClient.post(`/social/follow/${artistId}`);
			return res.data;
		},
		onSuccess: (data, artistId) => {
			queryClient.invalidateQueries({ queryKey: ["user-following-ids"] });
			queryClient.invalidateQueries({ queryKey: ["user-following"] });
			queryClient.invalidateQueries({ queryKey: ["artist-detail", artistId] });
			addToast({
				message: data.message,
				type: data.isFollowing ? "success" : "info",
			});
		},
		onError: (error) => {
			let msg = "Gagal mengubah status follow.";
			if (error && typeof error === "object" && "response" in error) {
				const errObj = error as { response?: { data?: { message?: string } } };
				if (errObj.response?.data?.message) {
					msg = errObj.response.data.message;
				}
			}
			addToast({ message: msg, type: "error" });
		},
	});
}
