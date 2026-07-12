"use client";

import { useMemo, useState } from "react";
import { ArtworkCard } from "@/components/home/ArtworkCard";
import { useArtworkStore } from "@/store/ArtworkStore";
import { useFollowStore } from "@/store/FollowStore";
import { useUserManagementStore } from "@/store/UserManagementStore";
import { useUserStore } from "@/store/UserStore";

import { buildArtworkWithRelations } from "@/utils/search";

// ── Main Component ────────────────────────────────────────────────────────────

export default function ArtworkList() {
	const { artworks, artworkTags, tags } = useArtworkStore();
	const { users } = useUserManagementStore();
	const { user, isAuthenticated } = useUserStore();
	const { getFollowedArtistIds } = useFollowStore();

	const [feedType, setFeedType] = useState<"all" | "followed">("all");

	const allArtworks = useMemo(() => {
		return buildArtworkWithRelations(artworks, artworkTags, tags, users).filter(
			(item) => item.is_visible_on_feed,
		);
	}, [artworks, artworkTags, tags, users]);

	const followedArtistIds = getFollowedArtistIds(user?.id ?? "");

	const filteredArtworks = useMemo(() => {
		if (feedType === "followed") {
			return allArtworks.filter((item) =>
				followedArtistIds.includes(item.artists_id),
			);
		}
		return allArtworks;
	}, [allArtworks, feedType, followedArtistIds]);

	// Show tab switcher only if user is logged in as artist or client
	const showTabs =
		isAuthenticated &&
		user &&
		(user.role === "artist" || user.role === "client");

	return (
		<section className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
			{showTabs && (
				<div className="sticky top-18 bg-background z-20 flex border-b border-content/10 mb-2 pt-3 pb-0.5">
					<button
						type="button"
						onClick={() => setFeedType("all")}
						className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
							feedType === "all"
								? "border-primary text-primary"
								: "border-transparent text-content-muted hover:text-content"
						}`}
					>
						Semua Karya
					</button>
					<button
						type="button"
						onClick={() => setFeedType("followed")}
						className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
							feedType === "followed"
								? "border-primary text-primary"
								: "border-transparent text-content-muted hover:text-content"
						}`}
					>
						Mengikuti
					</button>
				</div>
			)}

			{filteredArtworks.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-20 px-4 bg-surface border border-content/10 rounded-2xl text-center">
					<p className="text-content-muted text-sm">
						{feedType === "followed"
							? "Belum ada karya dari artis yang Anda ikuti."
							: "Belum ada karya yang ditampilkan."}
					</p>
				</div>
			) : (
				<div className="flex flex-col gap-4">
					{filteredArtworks.map((art) => (
						<ArtworkCard key={art.id} artwork={art} />
					))}
				</div>
			)}
		</section>
	);
}
