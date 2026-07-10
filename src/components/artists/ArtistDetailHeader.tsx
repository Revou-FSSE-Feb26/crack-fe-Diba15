"use client";

import {
	ArrowLeft,
	BadgeCheck,
	CalendarDays,
	Heart,
	ImageIcon,
	MessageCircle,
	Palette,
	ShieldCheck,
	Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import CommissionButton from "@/components/detail/CommissionButton";
import AvatarInitials from "@/components/home/AvatarInitials";
import Button from "@/components/ui/Button";
import users from "@/data/users";
import { useProfileStore } from "@/store/ProfileStore";
import { formatPrice } from "@/utils";

interface ArtistDetailHeaderProps {
	artistId: string;
}

export default function ArtistDetailHeader({
	artistId,
}: ArtistDetailHeaderProps) {
	const router = useRouter();
	const user = users.find((item) => item.id === artistId);
	const { profiles } = useProfileStore();
	const profile = profiles.find((item) => item.user_id === artistId);

	// Existence sudah divalidasi di server component (page.tsx) via notFound(),
	// ini cuma safety-net kalau data hilang setelah mount.
	if (!user || !profile) return null;

	const formattedPrice = profile.base_price_idr
		? formatPrice(profile.base_price_idr)
		: null;

	const joinedDate = new Date(user.created_at).toLocaleDateString("id-ID", {
		year: "numeric",
		month: "long",
	});

	return (
		<div className="flex flex-col gap-6">
			<button
				type="button"
				onClick={() => router.back()}
				className="inline-flex items-center gap-2 text-sm text-content-muted hover:text-primary transition-colors cursor-pointer"
			>
				<ArrowLeft className="w-4 h-4" />
				Kembali
			</button>

			<div className="flex-1 bg-surface border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
				<div className="flex items-start gap-4">
					<AvatarInitials
						name={user.name}
						className="w-20 h-20 text-2xl shrink-0"
					/>

					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 flex-wrap">
							<h1 className="font-display text-2xl font-bold text-content">
								{user.name}
							</h1>
							{profile.is_verified && (
								<span className="inline-flex items-center gap-1 text-xs font-medium text-verified bg-verified/10 px-2 py-0.5 rounded-full">
									<BadgeCheck className="w-3.5 h-3.5" />
									Terverifikasi
								</span>
							)}
						</div>

						<p className="text-sm text-content-muted mt-0.5">
							@{user.email.split("@")[0]}
						</p>

						{profile.bio && (
							<p className="mt-3 text-content-muted text-sm leading-relaxed">
								{profile.bio}
							</p>
						)}

						<div className="mt-4 flex flex-wrap gap-4 text-sm">
							<div className="flex items-center gap-1.5 text-content-muted">
								<ImageIcon className="w-4 h-4 text-primary" />
								<span>
									<strong className="text-content">
										{profile.approved_portfolio_count}
									</strong>{" "}
									Karya
								</span>
							</div>
							<div className="flex items-center gap-1.5 text-content-muted">
								<CalendarDays className="w-4 h-4 text-primary" />
								<span>Bergabung {joinedDate}</span>
							</div>
							<div className="flex items-center gap-1.5 text-content-muted">
								<Palette className="w-4 h-4 text-primary" />
								<span>
									{profile.approved_portfolio_count} karya di portfolio
								</span>
							</div>
						</div>
					</div>
				</div>

				{profile.is_verified && (
					<div className="mt-5 flex items-start gap-3 rounded-xl bg-verified/5 border border-verified/20 px-4 py-3">
						<ShieldCheck className="w-5 h-5 text-verified shrink-0 mt-0.5" />
						<div>
							<p className="text-sm font-medium text-content">
								Human-Verified Artist
							</p>
							<p className="text-xs text-content-muted mt-0.5">
								Seluruh karya telah melalui kurasi tim TruBrush dan terbukti
								dibuat oleh manusia - tanpa bantuan AI.
							</p>
						</div>
					</div>
				)}
			</div>

			<div className="w-full">
				<div className="bg-surface border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sticky top-24 space-y-4">
					<h2 className="font-heading font-semibold text-content">
						Pesan Komisi
					</h2>

					<div className="flex items-center justify-evenly gap-4 flex-wrap">
						{formattedPrice && (
							<div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg p-3">
								<Wallet className="w-4 h-4 text-primary shrink-0" />
								<div>
									<p className="text-xs text-content-muted">Mulai dari</p>
									<p className="font-display text-xl font-bold text-primary">
										{formattedPrice}
									</p>
								</div>
							</div>
						)}

						<div className="space-y-2 text-sm text-content-muted">
							<div className="flex items-center gap-2">
								<ShieldCheck className="w-4 h-4 text-verified shrink-0" />
								Dana aman dengan sistem Escrow
							</div>
							<div className="flex items-center gap-2">
								<MessageCircle className="w-4 h-4 text-primary shrink-0" />
								Diskusi langsung dengan artist
							</div>
							<div className="flex items-center gap-2">
								<Heart className="w-4 h-4 text-danger shrink-0" />
								Garansi revisi inklusif
							</div>
						</div>
					</div>

					<hr className="border-slate-200 dark:border-slate-700" />

					{profile.is_verified ? (
						profile.is_open_for_commission ? (
							<CommissionButton
								artistId={user.id}
								artistName={user.name}
								basePrice={profile.base_price_idr}
								className="text-sm justify-center"
							>
								Pesan Komisi Sekarang
							</CommissionButton>
						) : (
							<Button
								variant="secondary"
								className="w-full text-sm justify-center pointer-events-none"
								disabled
							>
								Komisi Sedang Tutup
							</Button>
						)
					) : (
						<Button
							variant="danger"
							className="w-full text-sm justify-center pointer-events-none"
							disabled
						>
							Belum Diverifikasi
						</Button>
					)}

					{!profile.is_verified && (
						<p className="text-xs text-content-muted text-center">
							Artist ini sedang dalam proses verifikasi TruBrush.
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
