import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axiosClient";
import { queryKeys } from "@/lib/queryKeys";
import { useUserStore } from "@/store/UserStore";
import type {
	Appeal,
	AppealStatus,
	AuditLogFilterParams,
	AuditLogItem,
	CreateAppealDto,
	ResolveAppealDto,
} from "@/types";

export function useAppeals(status?: AppealStatus) {
	const isAuthenticated = useUserStore((state) => state.isAuthenticated);
	const isAdmin = useUserStore((state) => state.isAdmin());

	return useQuery<Appeal[]>({
		queryKey: queryKeys.appeals.list(status),
		queryFn: async () => {
			const res = await axiosClient.get("/appeals", {
				params: { status: status || undefined },
			});
			return res.data;
		},
		enabled: isAuthenticated && isAdmin,
	});
}

export function useMyAppeals() {
	const isAuthenticated = useUserStore((state) => state.isAuthenticated);
	const user = useUserStore((state) => state.user);

	return useQuery<Appeal[]>({
		queryKey: queryKeys.appeals.my(),
		queryFn: async () => {
			const res = await axiosClient.get("/appeals/my");
			return res.data;
		},
		enabled: isAuthenticated && user?.role === "artist",
	});
}

export function useCreateAppeal() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (dto: CreateAppealDto) => {
			const res = await axiosClient.post("/appeals", dto);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.appeals.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
		},
	});
}

export function useResolveAppeal() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, dto }: { id: string; dto: ResolveAppealDto }) => {
			const res = await axiosClient.patch(`/appeals/${id}/resolve`, dto);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.appeals.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.auditLogs.all });
		},
	});
}

export interface PaginatedAuditLogsResponse {
	data: AuditLogItem[];
	total: number;
	page: number;
	limit: number;
}

export function useAuditLogs(filters?: AuditLogFilterParams) {
	const isAuthenticated = useUserStore((state) => state.isAuthenticated);
	const role = useUserStore((state) => state.user?.role);
	const isStaff = role === "admin" || role === "curator";

	return useQuery<PaginatedAuditLogsResponse>({
		queryKey: queryKeys.auditLogs.list(
			filters as Record<string, unknown> | undefined,
		),
		queryFn: async () => {
			const res = await axiosClient.get("/audit-logs", {
				params: filters,
			});
			return res.data;
		},
		enabled: isAuthenticated && isStaff,
	});
}
