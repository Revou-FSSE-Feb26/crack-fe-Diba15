"use client";

import {
	BadgeCheck,
	CalendarDays,
	Camera,
	Globe,
	ImageIcon,
	Loader2,
	Palette,
	ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import instagramIcon from "@/assets/instagram.svg";
import pixivIcon from "@/assets/pixiv.svg";
import xIcon from "@/assets/x.svg";
import AvatarInitials from "@/components/home/AvatarInitials";
import AccountMeta from "@/components/profile/AccountMeta";
import { ArtistAppealBox } from "@/components/profile/ArtistAppealBox";
import { ArtistVerificationBanner } from "@/components/profile/ArtistVerificationBanner";
import Stat from "@/components/ui/Stat";
import type { Profile, ProfileUser, VerificationProgress } from "@/types";

interface ArtistProfileHeroCardProps {
	user: ProfileUser;
	profile?: Profile | null;
	isUploadingAvatar: boolean;
	onAvatarInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	artistArtworksCount: number;
	verificationProgress: VerificationProgress;
	joinedDate: string;
}

export function ArtistProfileHeroCard({
	user,
	profile,
	isUploadingAvatar,
	onAvatarInputChange,
	artistArtworksCount,
	verificationProgress,
	joinedDate,
}: ArtistProfileHeroCardProps) {
	return (
		<div className="flex-1 min-w-0 w-full bg-surface border border-content/10 rounded-2xl p-4 sm:p-6 overflow-hidden">
			<div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5">
				<div className="relative group cursor-pointer shrink-0">
					<AvatarInitials
						name={user.name}
						src={profile?.avatar_url}
						className="w-16 h-16 sm:w-20 sm:h-20 text-xl sm:text-2xl"
					/>
					<label className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
						{isUploadingAvatar ? (
							<Loader2 className="w-5 h-5 text-white animate-spin" />
						) : (
							<Camera className="w-5 h-5 text-white" />
						)}
						<input
							type="file"
							accept="image/*"
							className="hidden"
							disabled={isUploadingAvatar}
							onChange={onAvatarInputChange}
						/>
					</label>
				</div>

				<div className="flex-1 min-w-0 w-full">
					<div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
						<h2 className="font-display text-xl sm:text-2xl font-bold text-content truncate">
							{user.name}
						</h2>
						{profile?.is_verified && (
							<span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium text-verified bg-verified/10 px-2 py-0.5 rounded-full">
								<BadgeCheck className="w-3.5 h-3.5" />
								Terverifikasi
							</span>
						)}
						{profile?.strike_count !== undefined &&
							profile.strike_count >= 5 && (
								<span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium text-danger bg-danger/10 px-2 py-0.5 rounded-full">
									Blocked
								</span>
							)}
					</div>

					<AccountMeta user={user} />

					<p className="mt-3 sm:mt-4 text-content-muted text-xs sm:text-sm leading-relaxed w-full">
						{profile?.bio ??
							"Lengkapi bio artist agar client memahami gaya dan layanan komisi kamu."}
					</p>

					<div className="mt-3.5 sm:mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 text-xs sm:text-sm w-full">
						<Stat variant="inline" icon={ImageIcon}>
							<strong className="text-content">
								{profile?.approved_portfolio_count ?? artistArtworksCount}
							</strong>{" "}
							Karya
						</Stat>
						<Stat variant="inline" icon={CalendarDays}>
							Bergabung {joinedDate}
						</Stat>
						<Stat variant="inline" icon={Palette}>
							{artistArtworksCount} di portfolio
						</Stat>
					</div>

					{profile?.social_links &&
						Object.values(profile.social_links).some(Boolean) && (
							<div className="mt-3.5 sm:mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-3 border-t border-content/10 w-full">
								{profile.social_links.instagram && (
									<Link
										href={
											profile.social_links.instagram.startsWith("http")
												? profile.social_links.instagram
												: `https://instagram.com/${profile.social_links.instagram.replace(/^@/, "")}`
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
								{profile.social_links.twitter && (
									<Link
										href={
											profile.social_links.twitter.startsWith("http")
												? profile.social_links.twitter
												: `https://x.com/${profile.social_links.twitter.replace(/^@/, "")}`
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
								{profile.social_links.pixiv && (
									<Link
										href={
											profile.social_links.pixiv.startsWith("http")
												? profile.social_links.pixiv
												: `https://${profile.social_links.pixiv}`
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
								{profile.social_links.website && (
									<Link
										href={
											profile.social_links.website.startsWith("http")
												? profile.social_links.website
												: `https://${profile.social_links.website}`
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

			<div className="mt-4 sm:mt-5 flex items-start gap-2.5 sm:gap-3 rounded-xl bg-verified/5 border border-verified/20 p-3 sm:px-4 sm:py-3 text-left w-full">
				<ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-verified shrink-0 mt-0.5" />
				<div className="min-w-0 flex-1">
					<p className="text-xs sm:text-sm font-medium text-content">
						{profile?.is_verified
							? "Human-Verified Artist"
							: "Menunggu Verifikasi Artist"}
					</p>
					<p className="text-[11px] sm:text-xs text-content-muted mt-0.5 leading-relaxed">
						{profile?.is_verified
							? "Portfolio kamu sudah lolos kurasi TruBrush dan dapat dipercaya sebagai karya manusia."
							: "Selesaikan verifikasi agar portfolio dan layanan komisi lebih dipercaya client."}
					</p>
				</div>
			</div>

			<div className="mt-4 w-full">
				<ArtistVerificationBanner
					isVerified={profile?.is_verified}
					approvedCount={verificationProgress.approved}
					neededForEligibility={verificationProgress.neededForEligibility}
				/>
			</div>

			<div className="mt-4 w-full">
				<ArtistAppealBox
					userId={user.id}
					strikeCount={profile?.strike_count ?? 0}
				/>
			</div>
		</div>
	);
}
