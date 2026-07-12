"use client";

import { useMemo } from "react";
import FeaturedArtistCard from "@/components/home/FeaturedArtist";
import Divider from "@/components/ui/Divider";
import Pill from "@/components/ui/Pill";
import SectionLabel from "@/components/ui/SectionLabel";
import { useArtworkStore } from "@/store/ArtworkStore";
import { useFollowStore } from "@/store/FollowStore";
import { useProfileStore } from "@/store/ProfileStore";
import { useUserManagementStore } from "@/store/UserManagementStore";

const tagColorVariants = [
	"bg-primary/10 text-primary hover:bg-primary/20",
	"bg-warm/15 text-warm-hover hover:bg-warm/25",
	"bg-mint/20 text-verified hover:bg-mint/30",
];

export default function SidebarHome() {
	const { follows } = useFollowStore();
	const { users } = useUserManagementStore();
	const { profiles } = useProfileStore();
	const { artworkTags, tags } = useArtworkStore();

	const artists = useMemo(
		() => users.filter((u) => u.role === "artist"),
		[users],
	);

	const followerCounts = useMemo(() => {
		return follows.reduce(
			(acc, f) => {
				acc[f.artist_id] = (acc[f.artist_id] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);
	}, [follows]);

	const artistProfiles = useMemo(() => {
		return artists
			.map((u) => {
				const prof = profiles.find((p) => p.user_id === u.id);
				if (!prof) return null;
				return {
					...prof,
					user: u,
					followersCount: followerCounts[u.id] || 0,
				};
			})
			.filter((p): p is NonNullable<typeof p> => p !== null);
	}, [artists, profiles, followerCounts]);

	const popularArtists = useMemo(() => {
		return [...artistProfiles]
			.sort((a, b) => {
				if (b.followersCount !== a.followersCount) {
					return b.followersCount - a.followersCount;
				}
				return b.approved_portfolio_count - a.approved_portfolio_count;
			})
			.slice(0, 3);
	}, [artistProfiles]);

	const tagUsageCounts = useMemo(() => {
		return artworkTags.reduce(
			(acc, at) => {
				acc[at.tag_id] = (acc[at.tag_id] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);
	}, [artworkTags]);

	const popularTags = useMemo(() => {
		return [...tags]
			.map((tag) => ({
				...tag,
				count: tagUsageCounts[tag.id] || 0,
			}))
			.sort((a, b) => b.count - a.count)
			.slice(0, 8);
	}, [tags, tagUsageCounts]);

	return (
		<aside
			id="sidebar-home"
			className="flex flex-col sticky top-24 h-fit max-h-[calc(100vh-96px)]"
		>
			{/* Artis Terpopuler */}
			{popularArtists.length > 0 && (
				<section>
					<SectionLabel>Artis Terpopuler</SectionLabel>
					{popularArtists.map((profile) => (
						<FeaturedArtistCard key={profile.id} profile={profile} />
					))}
				</section>
			)}

			{popularArtists.length > 0 && <Divider />}

			{/* Tag Populer */}
			<section>
				<SectionLabel>Tag Populer</SectionLabel>
				<div className="flex flex-wrap gap-1.5">
					{popularTags.map((tag, i) => (
						<Pill
							key={tag.id}
							link={`/search/${encodeURIComponent(`tags:"${tag.tag_name}"`)}`}
							className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors duration-150 ${tagColorVariants[i % tagColorVariants.length]}`}
						>
							#{tag.tag_name}
						</Pill>
					))}
				</div>
			</section>
		</aside>
	);
}
