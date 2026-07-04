import artworks from "@/data/artworks";
import users from "@/data/users";
import profiles from "@/data/profiles";
import tags from "@/data/tags";
import artworkTags from "@/data/artworkTags";
import { ArtworkWithRelations, Tag, ParsedQuery } from "@/types";


/**
 * Parses a raw search string with optional prefix into a structured query.
 *
 * Supported prefixes:
 *   tags:"value"     → filter by tag name
 *   artists:"value"  → filter by artist name
 *   (no prefix)      → filter by artwork title
 */
export function parseSearchQuery(raw: string): ParsedQuery {
  const trimmed = raw.trim();

  const tagsMatch =
    trimmed.match(/^tags:"(.+)"$/i) ?? trimmed.match(/^tags:(.+)$/i);
  if (tagsMatch) {
    return { type: "tags", value: tagsMatch[1].trim(), raw: trimmed };
  }

  const artistsMatch =
    trimmed.match(/^artists:"(.+)"$/i) ?? trimmed.match(/^artists:(.+)$/i);
  if (artistsMatch) {
    return { type: "artists", value: artistsMatch[1].trim(), raw: trimmed };
  }

  return { type: "title", value: trimmed, raw: trimmed };
}

/** Assembles the full ArtworkWithRelations list from static data sources. */
export function buildArtworkWithRelations(): ArtworkWithRelations[] {
  return artworks.map((artwork) => {
    const artist = users.find((u) => u.id === artwork.artists_id);
    const artist_profile = profiles.find((p) => p.user_id === artist?.id);
    const tagIds = artworkTags
      .filter((at) => at.artwork_id === artwork.id)
      .map((at) => at.tag_id);
    const artworkTagList = tags.filter((t) => tagIds.includes(t.id));

    return {
      ...artwork,
      artist: { id: artist?.id ?? "", name: artist?.name ?? "Unknown" },
      artist_profile: {
        is_verified: artist_profile?.is_verified ?? false,
        is_open_for_commission:
          artist_profile?.is_open_for_commission ?? false,
      },
      tags: artworkTagList as Tag[],
    };
  });
}

/** Filters artworks based on a parsed search query. */
export function searchArtworks(query: ParsedQuery): ArtworkWithRelations[] {
  const all = buildArtworkWithRelations();
  if (!query.value) return all;
  const q = query.value.toLowerCase();

  switch (query.type) {
    case "tags":
      return all.filter((a) =>
        a.tags.some((t) => t.tag_name.toLowerCase().includes(q))
      );
    case "artists":
      return all.filter((a) => a.artist.name.toLowerCase().includes(q));
    case "title":
    default:
      return all.filter((a) => a.title.toLowerCase().includes(q));
  }
}
