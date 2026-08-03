import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axiosClient";
import { useToastStore } from "@/store/ToastStore";
import { useUserStore } from "@/store/UserStore";
import type { Report } from "@/types";

export function useReports(status?: string) {
	const isAuthenticated = useUserStore((state) => state.isAuthenticated);

	return useQuery<Report[]>({
		queryKey: ["reports", status],
		queryFn: async () => {
			const res = await axiosClient.get("/reports", {
				params: { status },
			});
			return res.data;
		},
		enabled: isAuthenticated,
	});
}

export function useCreateReport() {
	const queryClient = useQueryClient();
	const { addToast } = useToastStore();

	return useMutation({
		mutationFn: async (payload: {
			target_type: "artwork" | "artist";
			target_id: string;
			reason: string;
		}) => {
			const res = await axiosClient.post("/reports", payload);
			return res.data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["reports"] });
			addToast({
				message: data.message || "Laporan berhasil dikirim.",
				type: "success",
			});
		},
		onError: (error: unknown) => {
			const err = error as { response?: { data?: { message?: string } } };
			const msg = err.response?.data?.message || "Gagal mengirim laporan.";
			addToast({ message: msg, type: "error" });
		},
	});
}

export function useResolveReport() {
	const queryClient = useQueryClient();
	const { addToast } = useToastStore();

	return useMutation({
		mutationFn: async ({
			id,
			status,
			notes,
		}: {
			id: string;
			status: "reviewed" | "rejected";
			notes?: string;
		}) => {
			const res = await axiosClient.patch(`/reports/${id}/resolve`, {
				status,
				notes,
			});
			return res.data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["reports"] });
			addToast({
				message: data.message || "Laporan berhasil diproses.",
				type: "success",
			});
		},
		onError: (error: unknown) => {
			const err = error as { response?: { data?: { message?: string } } };
			const msg = err.response?.data?.message || "Gagal memproses laporan.";
			addToast({ message: msg, type: "error" });
		},
	});
}
