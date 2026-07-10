import type { Commission } from "@/types";

export interface CommissionStatusConfig {
	label: string;
	className: string;
}

/**
 * Satu-satunya sumber label & warna status commission.
 * Dipakai di semua tempat yang menampilkan status (progress list,
 * detail page, riwayat komisi client, dsb) supaya label & warna
 * selalu konsisten dan cukup diubah di satu tempat.
 */
export const commissionStatusConfig: Record<
	Commission["status"],
	CommissionStatusConfig
> = {
	pending: { label: "Menunggu", className: "bg-premium/10 text-premium" },
	accepted: { label: "Diterima", className: "bg-primary/10 text-primary" },
	in_progress: { label: "Dikerjakan", className: "bg-primary/10 text-primary" },
	revision: { label: "Revisi", className: "bg-premium/10 text-premium" },
	completed: { label: "Selesai", className: "bg-verified/10 text-verified" },
	cancelled: { label: "Dibatalkan", className: "bg-danger/10 text-danger" },
	disputed: { label: "Sengketa", className: "bg-danger/10 text-danger" },
};
