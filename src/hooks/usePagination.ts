"use client";

import { useCallback, useEffect, useState } from "react";

import type { PaginatedResponse } from "@/types";
import { type PageSize, paginateItems } from "@/utils/pagination";

interface UsePaginationOptions {
	initialPage?: number;
	initialPerPage?: PageSize;
}

/**
 * Hook pagination lokal — shape output mengikuti PaginatedResponse
 * agar nanti mudah diganti ke useSWR + API.
 */
export function usePagination(options: UsePaginationOptions = {}) {
	const { initialPage = 1, initialPerPage = 5 } = options;
	const [page, setPage] = useState(initialPage);
	const [perPage, setPerPage] = useState<PageSize>(initialPerPage);

	const paginate = useCallback(
		<T>(items: T[]): PaginatedResponse<T> =>
			paginateItems(items, page, perPage),
		[page, perPage],
	);

	const resetPage = useCallback(() => setPage(1), []);

	const handlePerPageChange = useCallback((nextPerPage: PageSize) => {
		setPerPage(nextPerPage);
		setPage(1);
	}, []);

	return {
		page,
		perPage,
		setPage,
		setPerPage: handlePerPageChange,
		paginate,
		resetPage,
	};
}

/** Reset halaman saat filter/search berubah. */
export function useResetPageOnChange(resetPage: () => void, deps: unknown[]) {
	useEffect(() => {
		resetPage();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);
}
