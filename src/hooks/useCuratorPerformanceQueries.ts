import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axiosClient";
import { queryKeys } from "@/lib/queryKeys";
import type {
	CuratorPerformanceQuery,
	CuratorPerformanceResponse,
} from "@/types";

export const curatorPerformanceKeys = queryKeys.curatorPerformance;

export function useCuratorPerformance(filters?: CuratorPerformanceQuery) {
	return useQuery<CuratorPerformanceResponse>({
		queryKey: curatorPerformanceKeys.metrics(filters),
		queryFn: async () => {
			const res = await axiosClient.get("/curator-performance", {
				params: filters,
			});
			return res.data;
		},
	});
}
