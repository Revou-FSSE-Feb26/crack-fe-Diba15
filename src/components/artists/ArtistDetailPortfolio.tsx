"use client";

import { Loader2 } from "lucide-react";
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
			<div className="bg-surface border border-content/10 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
				<Loader2 className="h-7 w-7 sm:h-8 sm:w-8 animate-spin text-primary mb-2" />
				<p className="text-xs sm:text-sm text-content-muted">
					Memuat portfolio artist...
				</p>
			</div>
		);
	}

	return (
		<ArtistPortfolio
			artworksWithTags={artistArtworks}
			title="Portfolio Artist"
		/>
	);
}
