import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axiosClient";
import { queryKeys } from "@/lib/queryKeys";
import { useToastStore } from "@/store/ToastStore";
import { useUserStore } from "@/store/UserStore";
import type { JoinedDispute } from "@/types";

export function useDisputes(status?: string) {
	const isAuthenticated = useUserStore((state) => state.isAuthenticated);

	return useQuery<JoinedDispute[]>({
		queryKey: queryKeys.disputes.list(status),
		queryFn: async () => {
			const res = await axiosClient.get("/disputes", {
				params: { status },
			});
			return res.data;
		},
		enabled: isAuthenticated,
	});
}

export function useCreateDispute() {
	const queryClient = useQueryClient();
	const { addToast } = useToastStore();

	return useMutation({
		mutationFn: async (payload: { commission_id: string; reason: string }) => {
			const res = await axiosClient.post("/disputes", payload);
			return res.data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.disputes.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.commissions.all });
			addToast({
				message: data.message || "Sengketa komisi berhasil diajukan.",
				type: "success",
			});
		},
		onError: (error: unknown) => {
			const err = error as { response?: { data?: { message?: string } } };
			const msg =
				err.response?.data?.message || "Gagal mengajukan sengketa komisi.";
			addToast({ message: msg, type: "error" });
		},
	});
}

export function useResolveDispute() {
	const queryClient = useQueryClient();
	const { addToast } = useToastStore();

	return useMutation({
		mutationFn: async ({
			id,
			status,
			resolutionNotes,
		}: {
			id: string;
			status: "approved" | "rejected";
			resolutionNotes?: string;
		}) => {
			const res = await axiosClient.patch(`/disputes/${id}/resolve`, {
				status,
				resolutionNotes,
			});
			return res.data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.disputes.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.commissions.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.users.balance() });
			addToast({
				message: data.message || "Sengketa komisi berhasil diputuskan.",
				type: "success",
			});
		},
		onError: (error: unknown) => {
			const err = error as { response?: { data?: { message?: string } } };
			const msg =
				err.response?.data?.message || "Gagal memutuskan sengketa komisi.";
			addToast({ message: msg, type: "error" });
		},
	});
}
