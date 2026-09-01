"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { ArtistDetailHeroCard } from "@/components/artists/detail/ArtistDetailHeroCard";
import { ArtistDetailSidebar } from "@/components/artists/detail/ArtistDetailSidebar";
import { useArtistDetail } from "@/hooks/useArtworkQueries";
import { useFollowArtist } from "@/hooks/useFollowArtist";
import { useUserStore } from "@/store/UserStore";

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
				{/* 1. Left Column: Artist Hero Identity Card */}
				<ArtistDetailHeroCard
					artist={artist}
					artistId={artistId}
					currentUserId={currentUser?.id}
					isArtistFollowed={isArtistFollowed}
					onFollowToggle={handleFollowToggle}
				/>

				{/* 2. Right Column: Sticky Commission Action Sidebar */}
				<ArtistDetailSidebar artist={artist} />
			</div>
		</div>
	);
}
