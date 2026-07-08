import type { PaginatedResponse } from "@/types";

export type PageSize = 5 | 10;

export const PAGE_SIZE_OPTIONS: PageSize[] = [5, 10];

export function paginateItems<T>(
  items: T[],
  page: number,
  perPage: number,
): PaginatedResponse<T> {
  const total = items.length;
  const total_pages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), total_pages);
  const start = (safePage - 1) * perPage;

  return {
    data: items.slice(start, start + perPage),
    total,
    page: safePage,
    per_page: perPage,
    total_pages,
  };
}
