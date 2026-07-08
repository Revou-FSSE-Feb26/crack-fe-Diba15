"use client";

import ArtistPortfolio from "@/components/profile/ArtistPortfolio";
import { useArtworkStore } from "@/store/ArtworkStore";
import { buildArtworkWithRelations } from "@/utils/search";

interface ArtistDetailPortfolioProps {
  artistId: string;
}

export default function ArtistDetailPortfolio({ artistId }: ArtistDetailPortfolioProps) {
  const { artworks, artworkTags, tags } = useArtworkStore();
  const artistArtworks = buildArtworkWithRelations(artworks, artworkTags, tags).filter(
    (artwork) => artwork.artists_id === artistId && artwork.is_visible_on_feed,
  );

  return <ArtistPortfolio artworksWithTags={artistArtworks} />;
}
