"use client";

import { ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { ArtworkCard } from "@/components/home/ArtworkCard";
import ArtworkSkeleton from "@/components/home/ArtworkSkeleton";
import { useMounted } from "@/hooks/useMounted";
import { useArtworkStore } from "@/store/ArtworkStore";
import { useFavoriteStore } from "@/store/FavoriteStore";
import { useUserManagementStore } from "@/store/UserManagementStore";
import { useUserStore } from "@/store/UserStore";
import { buildArtworkWithRelations } from "@/utils/search";

export default function FavoriteList() {
	const { user, isAuthenticated } = useUserStore();
	const favoritesByUser = useFavoriteStore((state) => state.favoritesByUser);
	const { artworks, artworkTags, tags } = useArtworkStore();
	const { users } = useUserManagementStore();
	const mounted = useMounted();

	const favoriteArtworks = useMemo(() => {
		if (!user) return [];

		const favoriteIds = favoritesByUser[user.id] ?? [];
		const allArtworks = buildArtworkWithRelations(
			artworks,
			artworkTags,
			tags,
			users,
		);
		const artworkById = new Map(
			allArtworks.map((artwork) => [artwork.id, artwork]),
		);

		return [...favoriteIds]
			.reverse()
			.map((id) => artworkById.get(id))
			.filter((artwork) => artwork !== undefined);
	}, [user, favoritesByUser, artworks, artworkTags, tags, users]);

	return (
		<main className="min-h-screen bg-background text-content pb-20">
			<div className="bg-background/90 backdrop-blur-md border-b border-content/10 px-4 py-3">
				<div className="max-w-2xl mx-auto flex items-center gap-3">
					<Link
						href="/"
						className="shrink-0 p-2 rounded-full hover:bg-content/5 transition-colors"
					>
						<ArrowLeft size={20} className="text-content" />
					</Link>
					<div>
						<h1 className="font-semibold text-content">Favorites</h1>
						<p className="text-xs text-content-muted">
							Karya yang kamu simpan untuk dilihat kembali
						</p>
					</div>
				</div>
			</div>

			<div className="max-w-2xl mx-auto px-4 pt-6 pb-10 space-y-5">
				{!mounted ? (
					<div className="flex flex-col gap-4">
						<ArtworkSkeleton />
						<ArtworkSkeleton />
					</div>
				) : !isAuthenticated || !user ? (
					<section className="flex flex-col items-center py-20 gap-4 text-center">
						<div className="w-16 h-16 rounded-full bg-content/5 flex items-center justify-center">
							<Heart size={28} className="text-content-muted" />
						</div>
						<div>
							<p className="font-semibold text-content">
								Login untuk melihat favorites
							</p>
							<p className="text-sm text-content-muted mt-1">
								Simpan karya favoritmu dan akses kembali kapan saja.
							</p>
						</div>
						<Link
							href="/login"
							className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
						>
							Login
						</Link>
					</section>
				) : favoriteArtworks.length > 0 ? (
					<>
						<p className="text-xs text-content-muted">
							{favoriteArtworks.length} karya difavoritkan
						</p>
						<section className="flex flex-col gap-4">
							{favoriteArtworks.map((artwork) => (
								<ArtworkCard key={artwork.id} artwork={artwork} />
							))}
						</section>
					</>
				) : (
					<section className="flex flex-col items-center py-20 gap-4 text-center">
						<div className="w-16 h-16 rounded-full bg-content/5 flex items-center justify-center">
							<Heart size={28} className="text-content-muted" />
						</div>
						<div>
							<p className="font-semibold text-content">
								Belum ada karya favorit
							</p>
							<p className="text-sm text-content-muted mt-1">
								Tekan ikon hati di beranda atau halaman detail untuk menyimpan
								karya.
							</p>
						</div>
						<Link
							href="/"
							className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
						>
							Jelajahi Karya
						</Link>
					</section>
				)}
			</div>
		</main>
	);
}
