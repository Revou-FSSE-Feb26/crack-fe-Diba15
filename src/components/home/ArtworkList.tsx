"use client";

import Image from "next/image";
import { ArtworkWithRelations } from "@/types";
import { Heart, Ellipsis } from "lucide-react";

// ── Dummy Data ────────────────────────────────────────────────────────────────
// Hapus bagian ini dan ganti dengan fetch dari API / Prisma saat backend siap.

const DUMMY_ARTWORKS: ArtworkWithRelations[] = [
    {
        id: "a-001",
        artists_id: "u-001",
        title: "Senja di Tepi Sungai Ciliwung",
        description: "Lukisan cat air yang menangkap suasana sore hari di tepian Sungai Ciliwung, Jakarta.",
        final_image_url: "https://picsum.photos/seed/ciliwung/800/600",
        wip_proof_url: "https://picsum.photos/seed/ciliwung-wip/800/600",
        upload_type: "original",
        curation_status: "approved",
        is_visible_on_feed: true,
        created_at: "2024-05-01T10:00:00Z",
        artist: { id: "u-001", name: "Ari Ramadan" },
        artist_profile: { is_verified: true, is_open_for_commission: true },
        tags: [
            { id: "t-001", tag_name: "Cat Air" },
            { id: "t-002", tag_name: "Lanskap" },
            { id: "t-003", tag_name: "Urban" },
        ],
    },
    {
        id: "a-002",
        artists_id: "u-001",
        title: "Pasar Baru, Hujan Sore",
        description: "Suasana hujan di kawasan Pasar Baru, dengan warna-warna basah khas cat air.",
        final_image_url: "https://picsum.photos/seed/pasarbaru/800/600",
        wip_proof_url: "https://picsum.photos/seed/pasarbaru-wip/800/600",
        upload_type: "original",
        curation_status: "approved",
        is_visible_on_feed: true,
        created_at: "2024-05-15T14:00:00Z",
        artist: { id: "u-001", name: "Ari Ramadan" },
        artist_profile: { is_verified: true, is_open_for_commission: true },
        tags: [
            { id: "t-001", tag_name: "Cat Air" },
            { id: "t-003", tag_name: "Urban" },
        ],
    },
    {
        id: "a-003",
        artists_id: "u-002",
        title: "Putri Jelajah Antariksa",
        description: "Character design original — seorang putri dari peradaban antarbintang dengan armor futuristik.",
        final_image_url: "https://picsum.photos/seed/antariksa/800/600",
        wip_proof_url: "https://picsum.photos/seed/antariksa-wip/800/600",
        upload_type: "original",
        curation_status: "approved",
        is_visible_on_feed: true,
        created_at: "2024-06-02T09:30:00Z",
        artist: { id: "u-002", name: "Nadia Suryani" },
        artist_profile: { is_verified: true, is_open_for_commission: true },
        tags: [
            { id: "t-004", tag_name: "Karakter" },
            { id: "t-005", tag_name: "Sci-Fi" },
            { id: "t-006", tag_name: "Digital" },
        ],
    },
    {
        id: "a-004",
        artists_id: "u-002",
        title: "Neon Samurai",
        description: "OC samurai cyberpunk dengan estetika neon kota futuristik.",
        final_image_url: "https://picsum.photos/seed/neonsamurai/800/600",
        wip_proof_url: "https://picsum.photos/seed/neonsamurai-wip/800/600",
        upload_type: "original",
        curation_status: "approved",
        is_visible_on_feed: true,
        created_at: "2024-06-20T16:00:00Z",
        artist: { id: "u-002", name: "Nadia Suryani" },
        artist_profile: { is_verified: true, is_open_for_commission: true },
        tags: [
            { id: "t-004", tag_name: "Karakter" },
            { id: "t-005", tag_name: "Sci-Fi" },
            { id: "t-006", tag_name: "Digital" },
        ],
    },
    {
        id: "a-005",
        artists_id: "u-003",
        title: "Forest Spirit — Ink Series #3",
        description: "Bagian ketiga dari seri ink drawing roh hutan. Digambar dengan tinta India di atas kertas Canson.",
        final_image_url: "https://picsum.photos/seed/forestspirit/800/600",
        wip_proof_url: "https://picsum.photos/seed/forestspirit-wip/800/600",
        upload_type: "original",
        curation_status: "approved",
        is_visible_on_feed: true,
        created_at: "2024-07-05T11:00:00Z",
        artist: { id: "u-003", name: "Budi Laksono" },
        artist_profile: { is_verified: true, is_open_for_commission: false },
        tags: [
            { id: "t-007", tag_name: "Ink" },
            { id: "t-008", tag_name: "Fantasy" },
        ],
    },
    {
        id: "a-006",
        artists_id: "u-004",
        title: "Pasar Malam — Webtoon Cover",
        description: "Cover episode perdana webtoon lokal bertema festival rakyat malam hari.",
        final_image_url: "https://picsum.photos/seed/pasarmalam/800/600",
        wip_proof_url: "https://picsum.photos/seed/pasarmalam-wip/800/600",
        upload_type: "original",
        curation_status: "approved",
        is_visible_on_feed: true,
        created_at: "2024-07-18T13:00:00Z",
        artist: { id: "u-004", name: "Rina Pertiwi" },
        artist_profile: { is_verified: false, is_open_for_commission: true },
        tags: [
            { id: "t-009", tag_name: "Webtoon" },
            { id: "t-010", tag_name: "Cover Art" },
        ],
    },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function AvatarInitials({
    name,
    className = "",
}: {
    name: string;
    className?: string;
}) {
    const initials = name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();

    return (
        <span
            className={`inline-flex items-center justify-center rounded-full bg-primary text-white text-[10px] font-medium shrink-0 ${className}`}
        >
            {initials}
        </span>
    );
}

function ArtworkCard({ artwork }: { artwork: ArtworkWithRelations }) {
    const { artist, artist_profile} = artwork;

    return (
        <article className="group bg-surface border border-content/10 rounded-xl overflow-hidden hover:border-accent transition-colors duration-150">
            <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-1.5 min-w-0">
                    <AvatarInitials name={artist.name} className="w-8 h-8" />
                    <span className="text-sm text-content-muted truncate">
                        {artist.name}
                    </span>
                    {artist_profile.is_verified && (
                        <svg
                            className="w-3 h-3 text-verified shrink-0"
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
                <div className="rounded-full p-1 hover:bg-content/5 cursor-pointer">
                    <Ellipsis />
                </div>
            </div>

            {/* Gambar */}
            <div className="relative aspect-[4/3] overflow-hidden bg-background p-4">
                <Image
                    src={artwork.final_image_url}
                    alt={artwork.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
            </div>

            {/* Meta */}
            <div className="flex justify-between p-3">
                <div>
                    <h3 className="text-sm font-medium text-content leading-snug mb-2 line-clamp-1">
                        {artwork.title}
                    </h3>

                    {/* Footer: artist + tombol komisi */}
                    <div className="flex items-center justify-between">
                        {artist_profile.is_open_for_commission && (
                            <button className="text-[10px] font-medium px-2.5 py-1 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-150 shrink-0">
                                Komisi
                            </button>
                        )}
                    </div>
                </div>

                {/* Favorite Button */}
                <Heart className="hover:text-red-500 hover:fill-red-500 transition-colors duration-150 cursor-pointer h-7 w-7" />
            </div>
        </article>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ArtworkList() {
    // TODO: ganti dengan useState + fetch dari API saat backend siap
    const artworks = DUMMY_ARTWORKS.filter((a) => a.is_visible_on_feed);

    return (
        <section className="flex flex-col gap-4 bg-surface rounded-2xl border border-content/10">
            {artworks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-content-muted text-sm">
                    <p>Belum ada karya yang ditampilkan.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-2 px-4 md:px-20 py-4">
                    {artworks.map((artwork) => (
                        <div key={artwork.id}>
                            <ArtworkCard artwork={artwork} />
                            <hr className="border-content/10 my-4" />
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}