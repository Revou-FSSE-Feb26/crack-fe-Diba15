import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axiosClient";
import { useToastStore } from "@/store/ToastStore";
import { useUserStore } from "@/store/UserStore";
import type { Commission } from "@/types";

// Fetch user commissions
export function useUserCommissions(role?: "client" | "artist") {
	const isAuthenticated = useUserStore((state) => state.isAuthenticated);

	return useQuery<Commission[]>({
		queryKey: ["commissions", role],
		queryFn: async () => {
			const res = await axiosClient.get("/commissions", {
				params: { as: role },
			});
			return res.data;
		},
		enabled: isAuthenticated,
	});
}

// Fetch single commission detail
export function useCommissionDetail(id: string) {
	const isAuthenticated = useUserStore((state) => state.isAuthenticated);

	return useQuery<Commission>({
		queryKey: ["commission", id],
		queryFn: async () => {
			const res = await axiosClient.get(`/commissions/${id}`);
			return res.data;
		},
		enabled: isAuthenticated && Boolean(id),
	});
}

// Create new commission
export function useCreateCommission() {
	const queryClient = useQueryClient();
	const { addToast } = useToastStore();

	return useMutation({
		mutationFn: async (payload: {
			artist_id: string;
			commission_title: string;
			description?: string;
			price: number;
			deadline_days: number;
			reference_images?: string[];
		}) => {
			const res = await axiosClient.post("/commissions", payload);
			return res.data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["commissions"] });
			queryClient.invalidateQueries({ queryKey: ["user-balance"] });
			addToast({
				message: data.message || "Pesanan komisi berhasil dibuat.",
				type: "success",
			});
		},
		onError: (error: unknown) => {
			const err = error as { response?: { data?: { message?: string } } };
			const msg =
				err.response?.data?.message || "Gagal membuat pesanan komisi.";
			addToast({ message: msg, type: "error" });
		},
	});
}

// Respond commission (accept/decline)
export function useRespondCommission() {
	const queryClient = useQueryClient();
	const { addToast } = useToastStore();

	return useMutation({
		mutationFn: async ({
			id,
			status,
		}: {
			id: string;
			status: "accepted" | "declined";
		}) => {
			const res = await axiosClient.patch(`/commissions/${id}/respond`, {
				status,
			});
			return res.data;
		},
		onSuccess: (data, { id }) => {
			queryClient.invalidateQueries({ queryKey: ["commissions"] });
			queryClient.invalidateQueries({ queryKey: ["commission", id] });
			addToast({
				message: data.message || "Status komisi diperbarui.",
				type: "success",
			});
		},
		onError: (error: unknown) => {
			const err = error as { response?: { data?: { message?: string } } };
			const msg =
				err.response?.data?.message || "Gagal memperbarui status komisi.";
			addToast({ message: msg, type: "error" });
		},
	});
}

// Update progress (sketchUrl / finalArtworkUrl)
export function useUpdateProgress() {
	const queryClient = useQueryClient();
	const { addToast } = useToastStore();

	return useMutation({
		mutationFn: async ({
			id,
			sketchUrl,
			finalArtworkUrl,
		}: {
			id: string;
			sketchUrl?: string;
			finalArtworkUrl?: string;
		}) => {
			const res = await axiosClient.patch(`/commissions/${id}/progress`, {
				sketchUrl,
				finalArtworkUrl,
			});
			return res.data;
		},
		onSuccess: (data, { id }) => {
			queryClient.invalidateQueries({ queryKey: ["commissions"] });
			queryClient.invalidateQueries({ queryKey: ["commission", id] });
			addToast({
				message: data.message || "Progress komisi berhasil diperbarui.",
				type: "success",
			});
		},
		onError: (error: unknown) => {
			const err = error as { response?: { data?: { message?: string } } };
			const msg =
				err.response?.data?.message || "Gagal memperbarui progress komisi.";
			addToast({ message: msg, type: "error" });
		},
	});
}

// Approve step (sketch / final)
export function useApproveStep() {
	const queryClient = useQueryClient();
	const { addToast } = useToastStore();

	return useMutation({
		mutationFn: async ({
			id,
			step,
		}: {
			id: string;
			step: "sketch" | "final";
		}) => {
			const res = await axiosClient.patch(`/commissions/${id}/approve`, {
				step,
			});
			return res.data;
		},
		onSuccess: (data, { id }) => {
			queryClient.invalidateQueries({ queryKey: ["commissions"] });
			queryClient.invalidateQueries({ queryKey: ["commission", id] });
			addToast({
				message: data.message || "Penyetujuan komisi berhasil.",
				type: "success",
			});
		},
		onError: (error: unknown) => {
			const err = error as { response?: { data?: { message?: string } } };
			const msg = err.response?.data?.message || "Gagal menyetujui komisi.";
			addToast({ message: msg, type: "error" });
		},
	});
}

// Add revision comment
export function useAddRevision() {
	const queryClient = useQueryClient();
	const { addToast } = useToastStore();

	return useMutation({
		mutationFn: async ({ id, comment }: { id: string; comment: string }) => {
			const res = await axiosClient.post(`/commissions/${id}/revisions`, {
				comment,
			});
			return res.data;
		},
		onSuccess: (data, { id }) => {
			queryClient.invalidateQueries({ queryKey: ["commission", id] });
			addToast({
				message: data.message || "Catatan revisi berhasil ditambahkan.",
				type: "success",
			});
		},
		onError: (error: unknown) => {
			const err = error as { response?: { data?: { message?: string } } };
			const msg =
				err.response?.data?.message || "Gagal menambahkan catatan revisi.";
			addToast({ message: msg, type: "error" });
		},
	});
}

// Cancel commission
export function useCancelCommission() {
	const queryClient = useQueryClient();
	const { addToast } = useToastStore();

	return useMutation({
		mutationFn: async (id: string) => {
			const res = await axiosClient.patch(`/commissions/${id}/cancel`);
			return res.data;
		},
		onSuccess: (data, id) => {
			queryClient.invalidateQueries({ queryKey: ["commissions"] });
			queryClient.invalidateQueries({ queryKey: ["commission", id] });
			addToast({
				message: data.message || "Komisi berhasil dibatalkan.",
				type: "success",
			});
		},
		onError: (error: unknown) => {
			const err = error as { response?: { data?: { message?: string } } };
			const msg = err.response?.data?.message || "Gagal membatalkan komisi.";
			addToast({ message: msg, type: "error" });
		},
	});
}

// Pay commission
export function usePayCommission() {
	const queryClient = useQueryClient();
	const { addToast } = useToastStore();

	return useMutation({
		mutationFn: async ({
			id,
			paymentMethod,
			cardLastFour,
		}: {
			id: string;
			paymentMethod: "wallet" | "credit_card";
			cardLastFour?: string;
		}) => {
			const res = await axiosClient.patch(`/commissions/${id}/pay`, {
				paymentMethod,
				cardLastFour,
			});
			return res.data;
		},
		onSuccess: (data, { id }) => {
			queryClient.invalidateQueries({ queryKey: ["commissions"] });
			queryClient.invalidateQueries({ queryKey: ["commission", id] });
			queryClient.invalidateQueries({ queryKey: ["user-balance"] });
			addToast({
				message: data.message || "Pembayaran komisi berhasil.",
				type: "success",
			});
		},
		onError: (error: unknown) => {
			const err = error as { response?: { data?: { message?: string } } };
			const msg =
				err.response?.data?.message || "Gagal melakukan pembayaran komisi.";
			addToast({ message: msg, type: "error" });
		},
	});
}
