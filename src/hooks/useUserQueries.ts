import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axiosClient";
import { queryKeys } from "@/lib/queryKeys";
import type { ActionResult, DbUserResponse, User, UserPayload } from "@/types";

/**
 * Normalisasi data user dari respons database / backend ke model User frontend.
 */
function mapDbUserToUser(raw: DbUserResponse): User {
	const mappedProfile = raw.profile
		? {
				id: raw.profile.id || `p-${raw.id}`,
				user_id: raw.id,
				avatar_url: raw.profile.avatarUrl ?? null,
				bio: raw.profile.bio ?? null,
				social_links: raw.profile.socialLinks ?? {
					instagram: raw.profile.instagramUrl || undefined,
					twitter: raw.profile.twitterUrl || undefined,
					pixiv: raw.profile.pixivUrl || undefined,
					website: raw.profile.websiteUrl || undefined,
				},
				is_verified: raw.profile.isVerified ?? false,
				approved_portfolio_count: raw.profile.approvedPortfolioCount ?? 0,
				is_open_for_commission: raw.profile.isOpenForCommission ?? false,
				base_price_idr: raw.profile.basePriceIdr ?? null,
				strike_count: raw.profile.strikeCount ?? 0,
				updated_at: raw.profile.updatedAt || raw.updatedAt,
			}
		: undefined;

	return {
		id: raw.id,
		name: raw.name,
		email: raw.email,
		password: "",
		role: raw.role,
		balance: Number(raw.balance ?? 0),
		created_at: raw.createdAt,
		updated_at: raw.updatedAt,
		profile: mappedProfile,
	};
}

/**
 * Hook TanStack Query untuk mengambil daftar seluruh user (Admin Dashboard).
 */
export function useUsers(options?: { enabled?: boolean }) {
	return useQuery<User[]>({
		queryKey: queryKeys.users.list(),
		queryFn: async () => {
			const res = await axiosClient.get("/user");
			const data = Array.isArray(res.data) ? res.data : [];
			return data.map(mapDbUserToUser);
		},
		enabled: options?.enabled ?? true,
	});
}

/**
 * Hook TanStack Query untuk mengambil detail user spesifik berdasarkan ID.
 */
export function useUser(id?: string) {
	return useQuery<User | null>({
		queryKey: queryKeys.users.detail(id ?? ""),
		queryFn: async () => {
			if (!id) return null;
			const res = await axiosClient.get(`/user/${id}`);
			return mapDbUserToUser(res.data);
		},
		enabled: Boolean(id),
	});
}

/**
 * Hook TanStack Mutation untuk menambahkan user baru / kurator.
 */
export function useCreateUser() {
	const queryClient = useQueryClient();

	return useMutation<ActionResult, Error, UserPayload>({
		mutationFn: async (payload) => {
			try {
				await axiosClient.post("/user", {
					name: payload.name.trim(),
					email: payload.email.trim().toLowerCase(),
					password: payload.password,
					role: payload.role ?? "curator",
				});
				return { success: true, message: "User berhasil ditambahkan." };
			} catch (error) {
				const err = error as {
					response?: { data?: { message?: string } };
				};
				const msg = err.response?.data?.message ?? "Gagal menambahkan user.";
				return { success: false, message: msg };
			}
		},
		onSuccess: (result) => {
			if (result.success) {
				queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
			}
		},
	});
}

/**
 * Hook TanStack Mutation untuk memperbarui profil/role user tertentu.
 */
export function useUpdateUser() {
	const queryClient = useQueryClient();

	return useMutation<
		ActionResult,
		Error,
		{ id: string; payload: Partial<UserPayload> }
	>({
		mutationFn: async ({ id, payload }) => {
			try {
				await axiosClient.patch(`/user/${id}`, payload);
				return {
					success: true,
					message: "Perubahan user berhasil disimpan.",
				};
			} catch (error) {
				const err = error as {
					response?: { data?: { message?: string } };
				};
				const msg = err.response?.data?.message ?? "Gagal memperbarui user.";
				return { success: false, message: msg };
			}
		},
		onSuccess: (result) => {
			if (result.success) {
				queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
			}
		},
	});
}

/**
 * Hook TanStack Mutation untuk menghapus akun user dari sistem.
 */
export function useDeleteUser() {
	const queryClient = useQueryClient();

	return useMutation<ActionResult, Error, { id: string; name?: string }>({
		mutationFn: async ({ id, name }) => {
			try {
				await axiosClient.delete(`/user/${id}`);
				return {
					success: true,
					message: `${name ?? "User"} berhasil dihapus.`,
				};
			} catch (error) {
				const err = error as {
					response?: { data?: { message?: string } };
				};
				const msg = err.response?.data?.message ?? "Gagal menghapus user.";
				return { success: false, message: msg };
			}
		},
		onSuccess: (result) => {
			if (result.success) {
				queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
			}
		},
	});
}
