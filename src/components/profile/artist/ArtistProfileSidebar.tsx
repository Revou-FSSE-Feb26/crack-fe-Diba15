"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SummaryRow from "@/components/profile/SummaryRow";
import Button from "@/components/ui/Button";
import { useModalStore } from "@/store/ModalStore";
import type { Profile, ProfileUser } from "@/types";
import { formatPrice } from "@/utils";

interface ArtistProfileSidebarProps {
	user: ProfileUser;
	profile?: Profile | null;
	commissionsCount: number;
	formattedPrice: string | null;
	onEditClick: () => void;
}

export function ArtistProfileSidebar({
	user,
	profile,
	commissionsCount,
	formattedPrice,
	onEditClick,
}: ArtistProfileSidebarProps) {
	const router = useRouter();
	const { openModal } = useModalStore();

	const handleUploadClick = () => {
		if (profile && profile.strike_count >= 5) {
			openModal({
				title: "Akun Ditangguhkan (Blocked)",
				description:
					"Akun Anda telah ditangguhkan karena melanggar aturan TruBrush (Strike Count mencapai 5/5). Anda tidak dapat mengunggah karya baru.",
				type: "alert",
				variant: "danger",
			});
		} else {
			router.push("/post-art");
		}
	};

	return (
		<aside className="w-full lg:w-72 shrink-0 min-w-0">
			<div className="bg-surface border border-content/10 rounded-2xl p-4 sm:p-5 sticky top-24 space-y-3.5 sm:space-y-4 w-full">
				<h2 className="font-heading font-semibold text-content text-sm sm:text-base">
					Ringkasan Artist
				</h2>

				<SummaryRow label="Verifikasi">
					<span
						className={
							profile?.is_verified
								? "font-medium text-verified"
								: "font-medium text-content"
						}
					>
						{profile?.is_verified ? "Aktif" : "Belum aktif"}
					</span>
				</SummaryRow>
				<SummaryRow label="Komisi">
					{profile?.is_open_for_commission ? "Dibuka" : "Ditutup"}
				</SummaryRow>
				<SummaryRow label="Order masuk">{commissionsCount}</SummaryRow>
				<SummaryRow label="Strike count">
					<span
						className={
							profile?.strike_count && profile.strike_count > 0
								? "text-danger font-bold"
								: "text-content"
						}
					>
						{profile?.strike_count ?? 0} / 5
					</span>
				</SummaryRow>

				<hr className="border-content/10" />

				{formattedPrice && (
					<SummaryRow label="Harga mulai">
						<span className="font-semibold text-primary">{formattedPrice}</span>
					</SummaryRow>
				)}
				<SummaryRow label="Saldo dompet">
					<span className="font-semibold text-verified">
						{formatPrice(user.balance ?? 0)}
					</span>
				</SummaryRow>

				<Link
					href="/withdraw"
					className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-600/20 border border-emerald-500/20 px-3 py-2 text-xs font-bold transition-colors"
				>
					<ArrowUpRight className="w-3.5 h-3.5" />
					Tarik Saldo (Min. Rp 100.000)
				</Link>

				<hr className="border-content/10" />

				<div className="space-y-2">
					<Button
						onClick={onEditClick}
						className="w-full text-xs sm:text-sm justify-center"
					>
						Edit Profil
					</Button>
					<button
						type="button"
						onClick={handleUploadClick}
						className="flex w-full justify-center rounded-lg bg-accent/20 px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-primary transition-colors hover:bg-accent/40 dark:text-accent cursor-pointer border-transparent"
					>
						Upload Karya
					</button>
				</div>
			</div>
		</aside>
	);
}
