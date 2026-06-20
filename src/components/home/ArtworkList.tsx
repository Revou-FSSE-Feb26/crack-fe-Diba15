"use client";

import { ArtworkWithRelations } from "@/types";
import { ArtworkCard } from "./ArtworkCard";

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

// ── Main Component ────────────────────────────────────────────────────────────

export default function ArtworkList() {
    // TODO: ganti dengan useState + fetch dari API saat backend siap
    const artworks = DUMMY_ARTWORKS.filter((a) => a.is_visible_on_feed);

    if (artworks.length === 0) {
        return (
            <section className="flex flex-col items-center justify-center py-20 px-4">
                <p className="text-content-muted text-sm">Belum ada karya yang ditampilkan.</p>
            </section>
        );
    }

    return (
        <section className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
            {artworks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
        </section>
    );
}