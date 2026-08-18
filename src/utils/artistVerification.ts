import type { Artwork } from "@/types";

/**
 * Aturan verifikasi artist TruBrush (kondisi sekarang):
 * - Minimal 5 karya berstatus approved (constant number, bukan rasio)
 *
 * Fungsi ini murni (pure) — tidak membaca/menulis store apapun.
 * Bisa dipakai baik sebagai "authority" (pre-backend, dipanggil dari
 * ArtworkStore) maupun sebagai "display helper" (post-backend, dipanggil
 * dari komponen untuk menampilkan progress ke artist).
 */

export const VERIFICATION_MIN_APPROVED = 5;

// --- Rasio (belum dipakai) ---------------------------------------------
// Simpan sebagai referensi kalau nanti aturan verifikasi mau diperketat
// jadi berbasis rasio approved/total, bukan cuma jumlah minimal.
//
// export const VERIFICATION_MIN_UPLOADS = 5;
// export const VERIFICATION_MIN_RATIO = 0.6;
//
// const ratio = total > 0 ? approved / total : 0;
// const isEligible = total >= VERIFICATION_MIN_UPLOADS && ratio >= VERIFICATION_MIN_RATIO;
// const neededForEligibility = isEligible
//   ? 0
//   : Math.max(
//       0,
//       Math.ceil(Math.max(total, VERIFICATION_MIN_UPLOADS) * VERIFICATION_MIN_RATIO) - approved,
//     );
// -------------------------------------------------------------------------

export interface VerificationProgress {
	total: number;
	approved: number;
	isEligible: boolean;
	/** Berapa approved lagi yang dibutuhkan untuk lolos. */
	neededForEligibility: number;
}

export function evaluateVerification(
	artworks: Artwork[],
): VerificationProgress {
	const total = artworks.length;
	const approved = artworks.filter(
		(a) => a.curation_status === "approved",
	).length;
	const isEligible = approved >= VERIFICATION_MIN_APPROVED;
	const neededForEligibility = Math.max(
		0,
		VERIFICATION_MIN_APPROVED - approved,
	);

	return { total, approved, isEligible, neededForEligibility };
}
