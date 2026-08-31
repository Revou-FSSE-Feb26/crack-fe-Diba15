"use client";

import {
	ArrowLeft,
	BadgeCheck,
	CalendarDays,
	Globe,
	Heart,
	ImageIcon,
	MessageCircle,
	Palette,
	ShieldCheck,
	UserCheck,
	UserPlus,
	Users,
	UserX,
	Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import instagramIcon from "@/assets/instagram.svg";
import pixivIcon from "@/assets/pixiv.svg";
import xIcon from "@/assets/x.svg";
import CommissionButton from "@/components/detail/CommissionButton";
import AvatarInitials from "@/components/home/AvatarInitials";
import SummaryRow from "@/components/profile/SummaryRow";
import Button from "@/components/ui/Button";
import Stat from "@/components/ui/Stat";
import { useArtistDetail } from "@/hooks/useArtworkQueries";
import { useFollowArtist } from "@/hooks/useFollowArtist";
import { useUserStore } from "@/store/UserStore";
import { formatDate, formatPrice } from "@/utils";

interface ArtistDetailHeaderProps {
	artistId: string;
}

export default function ArtistDetailHeader({
	artistId,
}: ArtistDetailHeaderProps) {
	const router = useRouter();
	const { data: artist, isLoading } = useArtistDetail(artistId);

	const currentUser = useUserStore((state) => state.user);
	const { isArtistFollowed, handleFollowToggle } = useFollowArtist(artistId);

	if (isLoading) {
		return (
			<div className="space-y-6 w-full">
				<div className="h-5 w-24 rounded bg-content/10 animate-pulse" />
				<div className="flex flex-col lg:flex-row gap-5 sm:gap-6 w-full">
					<div className="flex-1 bg-surface border border-content/10 rounded-2xl p-4 sm:p-6 space-y-4">
						<div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
							<div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-content/10 animate-pulse shrink-0" />
							<div className="flex-1 space-y-2.5 w-full">
								<div className="h-6 w-48 rounded bg-content/10 animate-pulse mx-auto sm:mx-0" />
								<div className="h-4 w-32 rounded bg-content/10 animate-pulse mx-auto sm:mx-0" />
								<div className="h-12 w-full rounded bg-content/10 animate-pulse" />
							</div>
						</div>
					</div>
					<div className="w-full lg:w-72 shrink-0 bg-surface border border-content/10 rounded-2xl p-5 h-72 animate-pulse" />
				</div>
			</div>
		);
	}

	if (!artist) return null;

	const formattedPrice =
		artist.base_price_idr !== null && artist.base_price_idr !== undefined
			? formatPrice(artist.base_price_idr)
			: null;

	const joinedDate = artist.created_at ? formatDate(artist.created_at) : null;

	return (
		<div className="space-y-5 sm:space-y-6 w-full">
			<button
				type="button"
				onClick={() => router.back()}
				className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-content-muted hover:text-primary transition-colors cursor-pointer"
			>
				<ArrowLeft className="w-4 h-4" />
				<span>Kembali</span>
			</button>

			<div className="flex flex-col lg:flex-row gap-5 sm:gap-6 w-full">
				{/* Left Column: Main Artist Card */}
				<div className="flex-1 min-w-0 w-full bg-surface border border-content/10 rounded-2xl p-4 sm:p-6 overflow-hidden">
					<div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5">
						<AvatarInitials
							name={artist.user.name}
							src={artist.avatar_url ?? undefined}
							className="w-16 h-16 sm:w-20 sm:h-20 text-xl sm:text-2xl shrink-0"
						/>

						<div className="flex-1 min-w-0 w-full">
							<div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
								<h1 className="font-display text-xl sm:text-2xl font-bold text-content truncate">
									{artist.user.name}
								</h1>

								{artist.is_verified && (
									<span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium text-verified bg-verified/10 px-2 py-0.5 rounded-full">
										<BadgeCheck className="w-3.5 h-3.5" />
										Terverifikasi
									</span>
								)}

								{(!currentUser || currentUser.id !== artistId) && (
									<button
										type="button"
										onClick={handleFollowToggle}
										className={`group px-3 py-1 text-xs font-semibold rounded-full border transition-all cursor-pointer inline-flex items-center gap-1.5 shrink-0 ${
											isArtistFollowed
												? "bg-content/5 border-content/10 text-content hover:bg-red-50 hover:border-red-200 hover:text-red-500 dark:hover:bg-red-950/20 dark:hover:border-red-900/30"
												: "bg-primary border-primary text-white hover:bg-primary-hover shadow-sm"
										}`}
									>
										{isArtistFollowed ? (
											<>
												<UserCheck className="w-3.5 h-3.5 group-hover:hidden" />
												<UserX className="w-3.5 h-3.5 hidden group-hover:inline text-red-500" />
												<span className="group-hover:hidden">Mengikuti</span>
												<span className="hidden group-hover:inline text-red-500">
													Batal Ikuti
												</span>
											</>
										) : (
											<>
												<UserPlus className="w-3.5 h-3.5" />
												Ikuti
											</>
										)}
									</button>
								)}
							</div>

							<p className="text-xs sm:text-sm text-content-muted mt-0.5">
								@{artist.user.email.split("@")[0]}
							</p>

							{artist.bio && (
								<p className="mt-3 sm:mt-4 text-content-muted text-xs sm:text-sm leading-relaxed w-full">
									{artist.bio}
								</p>
							)}

							<div className="mt-3.5 sm:mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 text-xs sm:text-sm w-full">
								<Stat variant="inline" icon={ImageIcon}>
									<strong className="text-content">
										{artist.approved_portfolio_count}
									</strong>{" "}
									Karya
								</Stat>
								{joinedDate && (
									<Stat variant="inline" icon={CalendarDays}>
										Bergabung {joinedDate}
									</Stat>
								)}
								<Stat variant="inline" icon={Users}>
									<strong className="text-content">
										{artist.followersCount}
									</strong>{" "}
									Pengikut
								</Stat>
								<Stat variant="inline" icon={Palette}>
									{artist.approved_portfolio_count} di portfolio
								</Stat>
							</div>

							{artist.social_links &&
								Object.values(artist.social_links).some(Boolean) && (
									<div className="mt-3.5 sm:mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-3 border-t border-content/10 w-full">
										{artist.social_links.instagram && (
											<Link
												href={
													artist.social_links.instagram.startsWith("http")
														? artist.social_links.instagram
														: `https://instagram.com/${artist.social_links.instagram.replace(/^@/, "")}`
												}
												target="_blank"
												rel="noopener noreferrer"
												className="social-link-badge text-xs"
											>
												<Image
													src={instagramIcon}
													alt="Instagram"
													width={14}
													height={14}
													className="w-3.5 h-3.5 object-contain dark:invert"
												/>
												Instagram
											</Link>
										)}
										{artist.social_links.twitter && (
											<Link
												href={
													artist.social_links.twitter.startsWith("http")
														? artist.social_links.twitter
														: `https://x.com/${artist.social_links.twitter.replace(/^@/, "")}`
												}
												target="_blank"
												rel="noopener noreferrer"
												className="social-link-badge text-xs"
											>
												<Image
													src={xIcon}
													alt="Twitter / X"
													width={14}
													height={14}
													className="w-3.5 h-3.5 object-contain dark:invert"
												/>
												Twitter / X
											</Link>
										)}
										{artist.social_links.pixiv && (
											<Link
												href={
													artist.social_links.pixiv.startsWith("http")
														? artist.social_links.pixiv
														: `https://${artist.social_links.pixiv}`
												}
												target="_blank"
												rel="noopener noreferrer"
												className="social-link-badge text-xs"
											>
												<Image
													src={pixivIcon}
													alt="Pixiv"
													width={14}
													height={14}
													className="w-3.5 h-3.5 object-contain dark:invert"
												/>
												Pixiv
											</Link>
										)}
										{artist.social_links.website && (
											<Link
												href={
													artist.social_links.website.startsWith("http")
														? artist.social_links.website
														: `https://${artist.social_links.website}`
												}
												target="_blank"
												rel="noopener noreferrer"
												className="social-link-badge text-xs"
											>
												<Globe className="w-3.5 h-3.5 text-primary" />
												Website
											</Link>
										)}
									</div>
								)}
						</div>
					</div>

					{artist.is_verified && (
						<div className="mt-4 sm:mt-5 flex items-start gap-2.5 sm:gap-3 rounded-xl bg-verified/5 border border-verified/20 p-3 sm:px-4 sm:py-3 text-left w-full">
							<ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-verified shrink-0 mt-0.5" />
							<div className="min-w-0 flex-1">
								<p className="text-xs sm:text-sm font-medium text-content">
									Human-Verified Artist
								</p>
								<p className="text-[11px] sm:text-xs text-content-muted mt-0.5 leading-relaxed">
									Seluruh karya telah melalui kurasi tim TruBrush dan terbukti
									dibuat oleh manusia - tanpa bantuan AI.
								</p>
							</div>
						</div>
					)}
				</div>

				{/* Right Column: Sticky Commission Action Sidebar */}
				<aside className="w-full lg:w-72 shrink-0 min-w-0">
					<div className="bg-surface border border-content/10 rounded-2xl p-4 sm:p-5 sticky top-24 space-y-3.5 sm:space-y-4 w-full">
						<h2 className="font-heading font-semibold text-content text-sm sm:text-base">
							Pesan Komisi
						</h2>

						<SummaryRow label="Status Komisi">
							<span
								className={
									artist.is_open_for_commission
										? "font-medium text-verified"
										: "font-medium text-content-muted"
								}
							>
								{artist.is_open_for_commission ? "Dibuka" : "Ditutup"}
							</span>
						</SummaryRow>

						<SummaryRow label="Total Pengikut">
							<span className="font-medium text-content">
								{artist.followersCount}
							</span>
						</SummaryRow>

						<hr className="border-content/10" />

						{formattedPrice && (
							<div className="flex items-center gap-2.5 rounded-xl bg-primary/5 p-3 w-full min-w-0">
								<Wallet className="w-4 h-4 text-primary shrink-0" />
								<div className="min-w-0 flex-1">
									<p className="text-[11px] sm:text-xs text-content-muted">
										Harga mulai dari
									</p>
									<p className="font-display text-lg sm:text-xl font-bold text-primary truncate">
										{formattedPrice}
									</p>
								</div>
							</div>
						)}

						<div className="space-y-2 text-xs text-content-muted pt-1">
							<div className="flex items-center gap-2">
								<ShieldCheck className="w-3.5 h-3.5 text-verified shrink-0" />
								<span>Dana aman dengan sistem Escrow</span>
							</div>
							<div className="flex items-center gap-2">
								<MessageCircle className="w-3.5 h-3.5 text-primary shrink-0" />
								<span>Diskusi langsung dengan artist</span>
							</div>
							<div className="flex items-center gap-2">
								<Heart className="w-3.5 h-3.5 text-danger shrink-0" />
								<span>Garansi revisi inklusif</span>
							</div>
						</div>

						<hr className="border-content/10" />

						{artist.is_verified ? (
							artist.is_open_for_commission ? (
								<CommissionButton
									artistId={artist.user.id}
									artistName={artist.user.name}
									basePrice={artist.base_price_idr}
									isVerified={artist.is_verified}
									className="w-full text-xs sm:text-sm justify-center"
								>
									Pesan Komisi Sekarang
								</CommissionButton>
							) : (
								<Button
									variant="secondary"
									className="w-full text-xs sm:text-sm justify-center pointer-events-none opacity-60"
									disabled
								>
									Komisi Sedang Tutup
								</Button>
							)
						) : (
							<Button
								variant="danger"
								className="w-full text-xs sm:text-sm justify-center pointer-events-none opacity-60"
								disabled
							>
								Belum Diverifikasi
							</Button>
						)}

						{!artist.is_verified && (
							<p className="text-[11px] text-content-muted text-center leading-relaxed">
								Artist ini sedang dalam proses kurasi verifikasi TruBrush.
							</p>
						)}
					</div>
				</aside>
			</div>
		</div>
	);
}
