import type { Profile } from "@/types";

const profiles: Profile[] = [
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
	},
	{
		id: "p-003",
		user_id: "u-003",
		bio: "Ink artist. Menggambar dengan tangan sejak 2015. Penggemar berat folklore.",
		is_verified: true,
		approved_portfolio_count: 20,
		is_open_for_commission: false,
		base_price_idr: 200000,
		strike_count: 0,
		updated_at: "2024-03-25T11:00:00Z",
	},
	{
		id: "p-004",
		user_id: "u-004",
		bio: "Komikus & cover artist. Webtoon lokal enthusiast.",
		is_verified: false,
		approved_portfolio_count: 3,
		is_open_for_commission: true,
		base_price_idr: 175000,
		strike_count: 0,
		updated_at: "2024-04-10T14:30:00Z",
	},
];

export default profiles;
