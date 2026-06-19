"use client";

import { ProfileWithUser } from "@/types";

// ── Dummy Data ────────────────────────────────────────────────────────────────

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
        user: { id: "u-001", name: "Ari Ramadan", email: "ari@example.com", role: "artist" },
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
        user: { id: "u-002", name: "Nadia Suryani", email: "nadia@example.com", role: "artist" },
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
        user: { id: "u-003", name: "Budi Laksono", email: "budi@example.com", role: "artist" },
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

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
    return name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();
}

function formatPrice(price: number | null): string {
    if (!price) return "—";
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(price);
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-[11px] font-medium uppercase tracking-widest text-content-muted mb-3">
            {children}
        </p>
    );
}

function Divider() {
    return <hr className="border-content/10 my-4" />;
}

function FeaturedArtistCard({ profile }: { profile: ProfileWithUser }) {
    const { user, is_verified, is_open_for_commission, base_price_idr, approved_portfolio_count } = profile;

    return (
        <div className="bg-surface border border-content/10 rounded-xl p-3 mb-2 last:mb-0">
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-2.5">
                <span className="w-8 h-8 rounded-full bg-primary inline-flex items-center justify-center text-white text-xs font-medium shrink-0">
                    {getInitials(user.name)}
                </span>
                <div className="min-w-0">
                    <div className="flex items-center gap-1">
                        <p className="text-sm font-medium text-content truncate">{user.name}</p>
                        {is_verified && (
                            <svg
                                className="w-3.5 h-3.5 text-verified shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                aria-label="Terverifikasi"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        )}
                    </div>
                    <p className="text-[10px] text-content-muted">
                        {approved_portfolio_count} karya terverifikasi
                    </p>
                </div>
            </div>

            {/* Status & harga */}
            <div className="flex items-center justify-between mb-2.5">
                <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${is_open_for_commission
                            ? "bg-verified/10 text-verified"
                            : "bg-content/10 text-content-muted"
                        }`}
                >
                    {is_open_for_commission ? "Open Komisi" : "Closed"}
                </span>
                <span className="text-[11px] text-content-muted">
                    mulai {formatPrice(base_price_idr)}
                </span>
            </div>

            {/* Tombol hire */}
            {is_open_for_commission && (
                <button className="w-full text-xs font-medium py-1.5 rounded-lg bg-primary text-white hover:bg-primary-hover transition-colors duration-150">
                    Hire Artis
                </button>
            )}
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function SidebarHome() {
    return (
        <aside id="sidebar-home" className="flex flex-col sticky top-[96px] h-fit max-h-[calc(100vh-96px)]">

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
                    {DUMMY_POPULAR_TAGS.map((tag) => (
                        <button
                            key={tag.id}
                            className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-accent/15 text-primary hover:bg-accent/30 transition-colors duration-150"
                        >
                            #{tag.tag_name}
                        </button>
                    ))}
                </div>
            </section>

        </aside>
    );
}