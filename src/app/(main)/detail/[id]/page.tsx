"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Share2, BadgeCheck, ArrowLeft, ImageIcon } from "lucide-react";

import users from "@/data/users";
import AvatarInitials from "@/components/home/AvatarInitials";
import CommissionButton from "@/components/detail/CommissionButton";
import FavoriteButton from "@/components/detail/FavoriteButton";
import { useArtworkStore } from "@/store/ArtworkStore";
import { useProfileStore } from "@/store/ProfileStore";
import { buildArtworkWithRelations } from "@/utils/search";

export default function Detail() {
  const params = useParams();
  const id = params.id as string;
  const { artworks, artworkTags, tags } = useArtworkStore();
  const { profiles } = useProfileStore();
  const artwork = buildArtworkWithRelations(artworks, artworkTags, tags, profiles)
    .find((item) => item.id === id);

  if (!artwork) {
    return (
      <main className="min-h-screen bg-background text-content pb-20">
        <nav className="sticky top-0 z-45 bg-background/80 backdrop-blur-md border-b border-content/10 p-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 p-2 hover:bg-content/5 rounded-full transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Kembali</span>
          </Link>
        </nav>

        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="bg-surface border border-content/10 rounded-2xl p-8">
            <ImageIcon className="w-10 h-10 text-content-muted mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-content">Artwork tidak ditemukan</h1>
            <p className="mt-2 text-sm text-content-muted">
              Karya ini belum tersedia atau sudah tidak ada di daftar artwork.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const artist = users.find((user) => user.id === artwork.artists_id);
  const artistProfile = profiles.find((profile) => profile.user_id === artist?.id);

  return (
    <main className="min-h-screen bg-background text-content pb-20">
      <nav className="sticky top-0 z-45 bg-background/80 backdrop-blur-md border-b border-content/10 p-4">
        <div className=" flex items-center gap-4">
          <Link
            href="/"
            className="p-2 hover:bg-content/5 rounded-full transition-colors duration-200"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-semibold truncate">{artwork.title}</h1>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            {artwork.images_url.length > 0 ? (
              artwork.images_url.map((imgUrl, index) => (
                <div
                  key={`${imgUrl}-${index}`}
                  className="relative w-full bg-content/5 rounded-xl overflow-hidden shadow-sm"
                >
                  <Image
                    src={imgUrl}
                    alt={`${artwork.title} - Image ${index + 1}`}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-auto"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </div>
              ))
            ) : (
              <div className="w-full aspect-video bg-content/5 rounded-xl flex items-center justify-center">
                <p className="text-content-muted">Tidak ada gambar tersedia.</p>
              </div>
            )}
          </div>

          <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
            <div className="bg-surface p-5 rounded-xl border border-content/5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <AvatarInitials name={artwork.artist.name} className="w-12 h-12 text-lg" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="font-bold text-lg">{artwork.artist.name}</h2>
                    {artwork.artist_profile.is_verified && (
                      <BadgeCheck className="w-5 h-5 text-verified" />
                    )}
                  </div>
                  <p className="text-sm text-content-muted">Artist</p>
                </div>
              </div>

              {artwork.artist_profile.is_open_for_commission && (
                <CommissionButton
                  artworkId={artwork.id}
                  artworkTitle={artwork.title}
                  artistId={artwork.artist.id}
                  artistName={artwork.artist.name}
                  basePrice={artistProfile?.base_price_idr ?? null}
                />
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">{artwork.title}</h1>
                <p className="text-content-muted leading-relaxed whitespace-pre-line">
                  {artwork.description}
                </p>
              </div>

              {artwork.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {artwork.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/search/${encodeURIComponent(`tags:"${tag.tag_name}"`)}`}
                      className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full hover:bg-primary/20 transition-colors"
                    >
                      #{tag.tag_name}
                    </Link>
                  ))}
                </div>
              )}

              <hr className="border-content/10 my-4" />

              <div className="flex items-center gap-4">
                <FavoriteButton artworkId={artwork.id} artworkTitle={artwork.title} />
                <button title="Share" className="p-2.5 rounded-lg bg-content/5 hover:bg-content/10 text-content transition-colors">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
