"use client";

import FeaturedArtistCard from "@/components/home/FeaturedArtist";
import Divider from "@/components/ui/Divider";
import Pill from "@/components/ui/Pill";
import SectionLabel from "@/components/ui/SectionLabel";
import { usePopularArtists, usePopularTags } from "@/hooks/useArtworkQueries";

const tagColorVariants = [
	"bg-primary/10 text-primary hover:bg-primary/20",
	"bg-warm/15 text-warm-hover hover:bg-warm/25",
	"bg-mint/20 text-verified hover:bg-mint/30",
];

export default function SidebarHome() {
	// Mengambil data tag populer & artis terpopuler langsung dari backend menggunakan TanStack Query
	const { data: popularTags = [] } = usePopularTags();
	const { data: popularArtists = [], isLoading: isArtistsLoading } =
		usePopularArtists();

	return (
		<aside
			id="sidebar-home"
			className="flex flex-col sticky top-24 h-fit max-h-[calc(100vh-96px)] w-full shrink-0"
		>
			{/* Artis Terpopuler */}
			<section>
				<SectionLabel>Artis Terpopuler</SectionLabel>
				{isArtistsLoading ? (
					<div className="py-6 text-center text-xs text-content-muted">
						Memuat artis...
					</div>
				) : popularArtists.length > 0 ? (
					popularArtists.map((profile) => (
						<FeaturedArtistCard key={profile.id} profile={profile} />
					))
				) : (
					<div className="py-6 px-4 rounded-xl border border-content/10 text-center text-xs text-content-muted bg-surface/50">
						Belum ada artis terpopuler.
					</div>
				)}
			</section>

			<Divider />

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
