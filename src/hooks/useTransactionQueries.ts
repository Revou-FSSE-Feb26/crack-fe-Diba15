import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axiosClient";
import { queryKeys } from "@/lib/queryKeys";
import { useUserStore } from "@/store/UserStore";
import type {
	FinancialSummary,
	TransactionFilterParams,
	WalletTransaction,
} from "@/types";

export function useMyTransactions() {
	const isAuthenticated = useUserStore((state) => state.isAuthenticated);

	return useQuery<WalletTransaction[]>({
		queryKey: queryKeys.transactions.my(),
		queryFn: async () => {
			const res = await axiosClient.get("/transactions/me");
			return res.data;
		},
		enabled: isAuthenticated,
	});
}

export interface PaginatedTransactionsResponse {
	data: WalletTransaction[];
	total: number;
	page: number;
	limit: number;
}

export function useAllTransactions(filters?: TransactionFilterParams) {
	const isAuthenticated = useUserStore((state) => state.isAuthenticated);
	const isAdmin = useUserStore((state) => state.isAdmin());

	return useQuery<PaginatedTransactionsResponse>({
		queryKey: queryKeys.transactions.list(
			filters as Record<string, unknown> | undefined,
		),
		queryFn: async () => {
			const res = await axiosClient.get("/transactions", {
				params: filters,
			});
			return res.data;
		},
		enabled: isAuthenticated && isAdmin,
	});
}

export function useFinancialSummary() {
	const isAuthenticated = useUserStore((state) => state.isAuthenticated);
	const isAdmin = useUserStore((state) => state.isAdmin());

	return useQuery<FinancialSummary>({
		queryKey: queryKeys.transactions.summary(),
		queryFn: async () => {
			const res = await axiosClient.get("/transactions/summary");
			return res.data;
		},
		enabled: isAuthenticated && isAdmin,
	});
}

export function useTransactionDetail(id: string) {
	const isAuthenticated = useUserStore((state) => state.isAuthenticated);

	return useQuery<WalletTransaction>({
		queryKey: queryKeys.transactions.detail(id),
		queryFn: async () => {
			const res = await axiosClient.get(`/transactions/${id}`);
			return res.data;
		},
		enabled: isAuthenticated && !!id,
	});
}
