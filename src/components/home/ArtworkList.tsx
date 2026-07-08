"use client";

import { ArtworkCard } from "@/components/home/ArtworkCard";
import { useArtworkStore } from "@/store/ArtworkStore";
import { buildArtworkWithRelations } from "@/utils/search";

// ── Main Component ────────────────────────────────────────────────────────────

export default function ArtworkList() {
    const { artworks, artworkTags, tags } = useArtworkStore();
    const artwork = buildArtworkWithRelations(artworks, artworkTags, tags)
        .filter((item) => item.is_visible_on_feed);

    if (artwork.length === 0) {
        return (
            <section className="flex flex-col items-center justify-center py-20 px-4">
                <p className="text-content-muted text-sm">Belum ada karya yang ditampilkan.</p>
            </section>
        );
    }

    return (
        <section className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
            {artwork.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
        </section>
    );
}
