"use client";

import FeaturedArtistCard from "@/components/home/FeaturedArtist";
import Divider from "@/components/ui/Divider";
import Pill from "@/components/ui/Pill";
import SectionLabel from "@/components/ui/SectionLabel";
import type { ProfileWithUser } from "@/types";

const DUMMY_FEATURED_ARTISTS: ProfileWithUser[] = [
	{
		id: "p-001",
		user_id: "u-001",
		bio: "Ilustrator cat air berbasis di Jakarta. Spesialis lanskap urban dan alam.",
		is_verified: true,
		approved_portfolio_count: 12,
		is_open_for_commission: true,
		base_price_idr: 250000,
		strike_count: 0,
		updated_at: "2024-01-15T08:00:00Z",
		user: {
			id: "u-001",
			name: "Ari Ramadan",
			email: "ari@example.com",
			role: "artist",
		},
	},
	{
		id: "p-002",
		user_id: "u-002",
		bio: "Character designer & illustrator. Suka Sci-Fi dan fantasy. No AI, ever.",
		is_verified: true,
		approved_portfolio_count: 8,
		is_open_for_commission: true,
		base_price_idr: 350000,
		strike_count: 0,
		updated_at: "2024-02-10T09:15:00Z",
		user: {
			id: "u-002",
			name: "Nadia Suryani",
			email: "nadia@example.com",
			role: "artist",
		},
	},
	{
		id: "p-003",
		user_id: "u-003",
		bio: "Ink artist. Menggambar dengan tangan sejak 2015.",
		is_verified: true,
		approved_portfolio_count: 20,
		is_open_for_commission: false,
		base_price_idr: 200000,
		strike_count: 0,
		updated_at: "2024-03-25T11:00:00Z",
		user: {
			id: "u-003",
			name: "Budi Laksono",
			email: "budi@example.com",
			role: "artist",
		},
	},
];

const DUMMY_POPULAR_TAGS = [
	{ id: "t-001", tag_name: "Cat Air" },
	{ id: "t-002", tag_name: "Lanskap" },
	{ id: "t-004", tag_name: "Karakter" },
	{ id: "t-005", tag_name: "Sci-Fi" },
	{ id: "t-007", tag_name: "Ink" },
	{ id: "t-008", tag_name: "Fantasy" },
	{ id: "t-009", tag_name: "Webtoon" },
	{ id: "t-010", tag_name: "Cover Art" },
];

const tagColorVariants = [
	"bg-primary/10 text-primary hover:bg-primary/20",
	"bg-warm/15 text-warm-hover hover:bg-warm/25",
	"bg-mint/20 text-verified hover:bg-mint/30",
];

export default function SidebarHome() {
	return (
		<aside
			id="sidebar-home"
			className="flex flex-col sticky top-24 h-fit max-h-[calc(100vh-96px)]"
		>
			{/* Artis Unggulan */}
			<section>
				<SectionLabel>Artis Unggulan</SectionLabel>
				{DUMMY_FEATURED_ARTISTS.map((profile) => (
					<FeaturedArtistCard key={profile.id} profile={profile} />
				))}
			</section>

			<Divider />

			{/* Tag Populer */}
			<section>
				<SectionLabel>Tag Populer</SectionLabel>
				<div className="flex flex-wrap gap-1.5">
					{DUMMY_POPULAR_TAGS.map((tag, i) => (
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
