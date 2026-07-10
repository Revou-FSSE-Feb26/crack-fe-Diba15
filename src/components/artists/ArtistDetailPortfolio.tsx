"use client";

import ArtistPortfolio from "@/components/profile/ArtistPortfolio";
import { useArtworkStore } from "@/store/ArtworkStore";
import { useUserManagementStore } from "@/store/UserManagementStore";
import { buildArtworkWithRelations } from "@/utils/search";

interface ArtistDetailPortfolioProps {
	artistId: string;
}

export default function ArtistDetailPortfolio({
	artistId,
}: ArtistDetailPortfolioProps) {
	const { artworks, artworkTags, tags } = useArtworkStore();
	const { users } = useUserManagementStore();

	const artistArtworks = buildArtworkWithRelations(
		artworks,
		artworkTags,
		tags,
		users,
	).filter(
		(artwork) => artwork.artists_id === artistId && artwork.is_visible_on_feed,
	);

	return <ArtistPortfolio artworksWithTags={artistArtworks} />;
}
