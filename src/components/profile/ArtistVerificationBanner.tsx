import { VERIFICATION_MIN_APPROVED } from "@/utils/artistVerification";

interface ArtistVerificationBannerProps {
	isVerified?: boolean;
	approvedCount: number;
	neededForEligibility: number;
}

export function ArtistVerificationBanner({
	isVerified,
	approvedCount,
	neededForEligibility,
}: ArtistVerificationBannerProps) {
	if (isVerified) return null;

	const percent = Math.min(
		100,
		(approvedCount / VERIFICATION_MIN_APPROVED) * 100,
	);

	return (
		<div className="mt-4 sm:mt-5 rounded-2xl bg-primary/5 border border-primary/10 p-3.5 sm:p-4 w-full">
			<div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 text-xs text-content-muted">
				<span className="font-semibold text-content text-xs">
					Progress Verifikasi Artis
				</span>
				<span className="font-bold text-primary text-xs">
					{approvedCount}/{VERIFICATION_MIN_APPROVED} karya lolos kurasi
				</span>
			</div>
			<div className="mt-2.5 h-2 w-full rounded-full bg-content/10 overflow-hidden">
				<div
					className="h-full rounded-full bg-primary transition-all duration-300"
					style={{ width: `${percent}%` }}
				/>
			</div>
			<p className="mt-2 text-[11px] sm:text-xs text-content-muted leading-relaxed">
				Butuh{" "}
				<strong className="text-content font-semibold">
					{neededForEligibility} karya
				</strong>{" "}
				lolos kurasi lagi untuk memperoleh lencana{" "}
				<strong>Artist Terverifikasi</strong>.
			</p>
		</div>
	);
}
