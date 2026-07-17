"use client";

import ArtistPortfolio from "@/components/profile/ArtistPortfolio";
import { useArtworks } from "@/hooks/useArtworkQueries";
import { buildArtworkWithRelations } from "@/utils/search";

interface ArtistDetailPortfolioProps {
	artistId: string;
}

export default function ArtistDetailPortfolio({
	artistId,
}: ArtistDetailPortfolioProps) {
	// Mengambil portfolio artist secara dinamis dari database backend
	const { data: artworks = [], isLoading } = useArtworks({ artistId });

	const artistArtworks = buildArtworkWithRelations(artworks, [], []).filter(
		(artwork) => artwork.is_visible_on_feed,
	);

	if (isLoading) {
		return (
			<div className="py-12 text-center text-sm text-content-muted">
				Memuat portfolio artist...
			</div>
		);
	}

	return <ArtistPortfolio artworksWithTags={artistArtworks} />;
}
