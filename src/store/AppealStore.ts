/**
 * @deprecated
 * Fitur Appeal (Banding Akun) telah dimigrasikan ke arsitektur server-state
 * menggunakan TanStack Query hook `useAppealQueries.ts` dan NestJS REST API `/api/appeals`.
 * Tipe `Appeal` kini didefinisikan secara terpusat di `@/types`.
 */

export type {
	Appeal,
	AppealStatus,
	CreateAppealDto,
	ResolveAppealDto,
} from "@/types";
