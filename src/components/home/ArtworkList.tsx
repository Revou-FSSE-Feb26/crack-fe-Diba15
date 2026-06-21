"use client";

import { ArtworkCard } from "@/components/home/ArtworkCard";
import artworks from "@/data/artworks";
import users from "@/data/users";
import profiles from "@/data/profiles";
import tags from "@/data/tags";
import artworkTags from "@/data/artworkTags";
import { ArtworkWithRelations, Tag } from "@/types";

// ── Main Component ────────────────────────────────────────────────────────────

export default function ArtworkList() {
    const artwork: ArtworkWithRelations[] = artworks.map((artwork) => {
        const artist = users.find((user) => user.id === artwork.artists_id);
        const artist_profile = profiles.find((profile) => profile.user_id === artist?.id);
        const artworkTagIds = artworkTags.filter((artworkTag) => artworkTag.artwork_id === artwork.id);
        const artworkTagList = tags.filter((tag) => artworkTagIds.some((artworkTag) => artworkTag.tag_id === tag.id));

        const artworkWithRelations: ArtworkWithRelations = {
            ...artwork,
            artist: { id: artist?.id as string, name: artist?.name as string },
            artist_profile: {
                is_verified: artist_profile?.is_verified as boolean,
                is_open_for_commission: artist_profile?.is_open_for_commission as boolean,
            },
            tags: artworkTagList as Tag[],
        };

        return artworkWithRelations;
    });

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