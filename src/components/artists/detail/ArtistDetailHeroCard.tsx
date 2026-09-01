"use client";

import {
	BadgeCheck,
	CalendarDays,
	Globe,
	ImageIcon,
	Palette,
	ShieldCheck,
	UserCheck,
	UserPlus,
	Users,
	UserX,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import instagramIcon from "@/assets/instagram.svg";
import pixivIcon from "@/assets/pixiv.svg";
import xIcon from "@/assets/x.svg";
import AvatarInitials from "@/components/home/AvatarInitials";
import Stat from "@/components/ui/Stat";
import type { ArtistDetailResponse } from "@/types";
import { formatDate } from "@/utils";

interface ArtistDetailHeroCardProps {
	artist: ArtistDetailResponse;
	artistId: string;
	currentUserId?: string;
	isArtistFollowed: boolean;
	onFollowToggle: () => void;
}

export function ArtistDetailHeroCard({
	artist,
	artistId,
	currentUserId,
	isArtistFollowed,
	onFollowToggle,
}: ArtistDetailHeroCardProps) {
	const joinedDate = artist.created_at ? formatDate(artist.created_at) : null;

	return (
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

						{(!currentUserId || currentUserId !== artistId) && (
							<button
								type="button"
								onClick={onFollowToggle}
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
							<strong className="text-content">{artist.followersCount}</strong>{" "}
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
	);
}
