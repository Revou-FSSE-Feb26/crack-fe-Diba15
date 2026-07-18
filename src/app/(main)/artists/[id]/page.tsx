import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArtistDetailHeader from "@/components/artists/ArtistDetailHeader";
import ArtistDetailPortfolio from "@/components/artists/ArtistDetailPortfolio";

interface PageProps {
	params: Promise<{ id: string }>;
}

/** Fetch detail artis dari backend (public endpoint, tanpa auth) */
async function fetchArtistDetail(id: string) {
	try {
		// Menggunakan absolute URL ke BFF API route kita
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
		const res = await fetch(`${baseUrl}/api/artwork/artists/${id}`, {
			// Tidak di-cache karena data artis bisa berubah
			cache: "no-store",
		});
		if (!res.ok) return null;
		return res.json();
	} catch {
		return null;
	}
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { id } = await params;
	const artist = await fetchArtistDetail(id);

	if (!artist) {
		return { title: "Artist Not Found | TruBrush" };
	}

	return {
		title: `${artist.user.name} | TruBrush`,
		description:
			artist.bio ??
			`Profil artis ${artist.user.name} di TruBrush - platform seni manusia autentik.`,
		openGraph: {
			title: `${artist.user.name} — Artist di TruBrush`,
			description:
				artist.bio ??
				`Lihat portfolio dan pesan komisi dari ${artist.user.name}.`,
			images: artist.avatar_url ? [{ url: artist.avatar_url }] : [],
		},
	};
}

export default async function ArtistDetailPage({ params }: PageProps) {
	const { id } = await params;

	// Validasi artis ada di database. Kalau tidak ada, tampilkan 404.
	const artist = await fetchArtistDetail(id);
	if (!artist) notFound();

	return (
		<div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
			<ArtistDetailHeader artistId={id} />

			<ArtistDetailPortfolio artistId={id} />
		</div>
	);
}
