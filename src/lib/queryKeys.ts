/**
 * Centralized TanStack Query Key Factory
 * Standardized query keys for type-safe query matching and cache invalidation.
 */
export const queryKeys = {
	artworks: {
		all: ["artworks"] as const,
		lists: () => [...queryKeys.artworks.all, "list"] as const,
		list: (filters?: Record<string, unknown>) =>
			[...queryKeys.artworks.lists(), { filters }] as const,
		infiniteList: (filters?: Record<string, unknown>, limit?: number) =>
			[...queryKeys.artworks.lists(), "infinite", { filters, limit }] as const,
		details: () => [...queryKeys.artworks.all, "detail"] as const,
		detail: (id: string) => [...queryKeys.artworks.details(), id] as const,
		pending: () => [...queryKeys.artworks.all, "pending"] as const,
		tags: ["artwork-tags"] as const,
		popularTags: () => [...queryKeys.artworks.tags, "popular"] as const,
		tagsList: () => [...queryKeys.artworks.tags, "all"] as const,
		artists: ["artists"] as const,
		popularArtists: () => [...queryKeys.artworks.artists, "popular"] as const,
		artistsList: () => [...queryKeys.artworks.artists, "all"] as const,
		artistDetail: (id: string) =>
			[...queryKeys.artworks.artists, "detail", id] as const,
	},
	commissions: {
		all: ["commissions"] as const,
		list: (role?: string) =>
			[...queryKeys.commissions.all, "list", role] as const,
		detail: (id: string) =>
			[...queryKeys.commissions.all, "detail", id] as const,
	},
	disputes: {
		all: ["disputes"] as const,
		list: (status?: string) =>
			[...queryKeys.disputes.all, "list", status] as const,
		detail: (id: string) => [...queryKeys.disputes.all, "detail", id] as const,
	},
	reports: {
		all: ["reports"] as const,
		list: (status?: string) =>
			[...queryKeys.reports.all, "list", status] as const,
		detail: (id: string) => [...queryKeys.reports.all, "detail", id] as const,
	},
	users: {
		all: ["users"] as const,
		detail: (id: string) => [...queryKeys.users.all, "detail", id] as const,
		profile: (id: string) => [...queryKeys.users.all, "profile", id] as const,
		balance: () => [...queryKeys.users.all, "balance"] as const,
	},
	social: {
		all: ["social"] as const,
		favoriteIds: () => [...queryKeys.social.all, "favorite-ids"] as const,
		favorites: () => [...queryKeys.social.all, "favorites"] as const,
		followingIds: () => [...queryKeys.social.all, "following-ids"] as const,
		following: () => [...queryKeys.social.all, "following"] as const,
	},
	transactions: {
		all: ["transactions"] as const,
		my: () => [...queryKeys.transactions.all, "my"] as const,
		list: (filters?: Record<string, unknown>) =>
			[...queryKeys.transactions.all, "list", filters] as const,
		summary: () => [...queryKeys.transactions.all, "summary"] as const,
		detail: (id: string) =>
			[...queryKeys.transactions.all, "detail", id] as const,
	},
};
