import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Heart, Share2, BadgeCheck, ArrowLeft} from "lucide-react";

// Mock Data Imports
import artworks from "@/data/artworks";
import users from "@/data/users";
import profiles from "@/data/profiles";
import tags from "@/data/tags";
import artworkTags from "@/data/artworkTags";
import { ArtworkWithRelations, Tag } from "@/types";
import { AvatarInitials } from "@/components/home/AvatarInitials";

export default async function Detail({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const id: string = resolvedParams.id;

    // 1. Cari artwork berdasarkan ID
    const rawArtwork = artworks.find((a) => a.id === id);

    // Jika tidak ditemukan, kembalikan halaman 404 bawaan Next.js
    if (!rawArtwork) {
        notFound();
    }

    // 2. Petakan relasi data secara langsung (tanpa state/effect)
    const artist = users.find((user) => user.id === rawArtwork.artists_id);
    const artist_profile = profiles.find((profile) => profile.user_id === artist?.id);

    const artworkTagIds = artworkTags
        .filter((at) => at.artwork_id === rawArtwork.id)
        .map((at) => at.tag_id);

    const artworkTagList = tags.filter((tag) => artworkTagIds.includes(tag.id));

    // 3. Bentuk objek final
    const artwork: ArtworkWithRelations = {
        ...rawArtwork,
        images_url: rawArtwork.images_url || ["https://picsum.photos/seed/pasarmalam/800/600"], // Pastikan ada array gambar
        artist: { id: artist?.id as string, name: artist?.name || "Unknown Artist" },
        artist_profile: {
            is_verified: artist_profile?.is_verified ?? false,
            is_open_for_commission: artist_profile?.is_open_for_commission ?? false,
        },
        tags: artworkTagList as Tag[],
    };

    return (
        <main className="min-h-screen bg-background text-content pb-20">
            {/* Top Navigation Bar */}
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

                    {/* KOLOM KIRI: Galeri Gambar */}
                    <div className="lg:col-span-2 space-y-4">
                        {artwork.images_url.length > 0 ? (
                            artwork.images_url.map((imgUrl, index) => (
                                <div
                                    key={index}
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

                    {/* KOLOM KANAN: Informasi Detail (Sticky) */}
                    <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">

                        {/* Artist Info */}
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
                                <button className="w-full py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors">
                                    Pesan Komisi
                                </button>
                            )}
                        </div>

                        {/* Artwork Detail */}
                        <div className="space-y-4">
                            <div>
                                <h1 className="text-2xl font-bold mb-2">{artwork.title}</h1>
                                <p className="text-content-muted leading-relaxed whitespace-pre-line">
                                    {artwork.description}
                                </p>
                            </div>

                            {/* Tags */}
                            {artwork.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {artwork.tags.map((tag) => (
                                        <Link
                                            key={tag.id}
                                            href={`/tag/${tag.tag_name}`}
                                            className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full hover:bg-primary/20 transition-colors"
                                        >
                                            #{tag.tag_name}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            <hr className="border-content/10 my-4" />

                            {/* Action Buttons */}
                            <div className="flex items-center gap-4">
                                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-content/5 hover:bg-content/10 text-content transition-colors font-medium">
                                    <Heart size={20} /> Suka
                                </button>
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