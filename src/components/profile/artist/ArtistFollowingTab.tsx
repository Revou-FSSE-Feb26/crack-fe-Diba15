"use client";

import { UserMinus } from "lucide-react";
import Link from "next/link";
import AvatarInitials from "@/components/home/AvatarInitials";
import type { FollowedArtist } from "@/types";

interface ArtistFollowingTabProps {
	followedArtists: FollowedArtist[];
	onUnfollowArtist: (artistId: string) => void;
}

export function ArtistFollowingTab({
	followedArtists,
	onUnfollowArtist,
}: ArtistFollowingTabProps) {
	if (followedArtists.length === 0) {
		return (
			<section className="space-y-4 w-full min-w-0">
				<div className="bg-surface border border-content/10 rounded-2xl p-6 sm:p-8 text-center w-full">
					<p className="text-xs sm:text-sm text-content-muted">
						Anda belum mengikuti artis manapun.
					</p>
				</div>
			</section>
		);
	}

	return (
		<section className="space-y-4 w-full min-w-0">
			<div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
				{followedArtists.map((artist) => {
					const bioText = artist.profile?.bio
						? artist.profile.bio.length > 30
							? `${artist.profile.bio.slice(0, 30)}...`
							: artist.profile.bio
						: "Belum ada bio.";

					return (
						<div
							key={artist.id}
							className="bg-surface border border-content/10 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-2.5 sm:gap-3 hover:shadow-sm transition-all overflow-hidden w-full min-w-0"
						>
							<Link
								href={`/artists/${artist.id}`}
								className="flex items-center gap-2.5 flex-1 min-w-0"
							>
								<AvatarInitials
									name={artist.name}
									className="w-9 h-9 sm:w-10 sm:h-10 text-xs shrink-0"
									src={artist.profile?.avatar_url}
								/>
								<div className="min-w-0 flex-1">
									<p className="text-xs sm:text-sm font-bold text-content truncate hover:text-primary transition-colors">
										{artist.name}
									</p>
									<p className="text-[10px] sm:text-xs text-content-muted truncate max-w-full">
										{bioText}
									</p>
								</div>
							</Link>
							<button
								type="button"
								onClick={() => onUnfollowArtist(artist.id)}
								className="px-2 py-1 text-[11px] sm:text-xs font-medium border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:border-red-500/20 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shrink-0"
								title="Batal Ikuti"
							>
								<UserMinus className="w-3.5 h-3.5" />
								<span className="hidden sm:inline">Batal</span>
							</button>
						</div>
					);
				})}
			</div>
		</section>
	);
}
