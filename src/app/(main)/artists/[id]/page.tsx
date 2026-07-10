import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArtistDetailHeader from "@/components/artists/ArtistDetailHeader";
import ArtistDetailPortfolio from "@/components/artists/ArtistDetailPortfolio";
import profiles from "@/data/profiles";
import users from "@/data/users";

export function generateStaticParams() {
	return users.map((user) => ({ id: user.id }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;
	const user = users.find((item) => item.id === id);
	if (!user) return { title: "Artist Not Found" };

	const profile = profiles.find((item) => item.user_id === id);
	return {
		title: user.name,
		description:
			profile?.bio ??
			`Profil artis ${user.name} di TruBrush - platform seni manusia autentik.`,
	};
}

export default async function ArtistDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const user = users.find((item) => item.id === id);
	if (!user) notFound();

	const profile = profiles.find((item) => item.user_id === id);
	if (!profile) notFound();

	return (
		<div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
			<ArtistDetailHeader artistId={id} />

			<ArtistDetailPortfolio artistId={id} />
		</div>
	);
}
