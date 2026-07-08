import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import users from "@/data/users";
import profiles from "@/data/profiles";
import ArtistDetailHeader from "@/components/artists/ArtistDetailHeader";
import ArtistDetailPortfolio from "@/components/artists/ArtistDetailPortfolio";

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
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-content-muted hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Feed
      </Link>

      <ArtistDetailHeader artistId={id} />

      <ArtistDetailPortfolio artistId={id} />
    </div>
  );
}