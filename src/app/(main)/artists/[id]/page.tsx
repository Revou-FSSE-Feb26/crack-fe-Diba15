import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  ArrowLeft,
  Palette,
  ShieldCheck,
  Wallet,
  CalendarDays,
  ImageIcon,
  MessageCircle,
  Heart,
} from "lucide-react";

import users from "@/data/users";
import profiles from "@/data/profiles";
import artworks from "@/data/artworks";
import artworkTags from "@/data/artworkTags";
import tags from "@/data/tags";
import AvatarInitials from "@/components/home/AvatarInitials";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/utils";

// ─── Static Params ───────────────────────────────────────────────
export function generateStaticParams() {
  return users.map((user) => ({ id: user.id }));
}

// ─── Metadata ────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const user = users.find((u) => u.id === id);
  if (!user) return { title: "Artist Not Found" };

  const profile = profiles.find((p) => p.user_id === id);
  return {
    title: user.name,
    description:
      profile?.bio ??
      `Profil artis ${user.name} di TruBrush — platform seni manusia autentik.`,
  };
}

// ─── Page ─────────────────────────────────────────────────────────
export default async function ArtistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Data lookup
  const user = users.find((u) => u.id === id);
  if (!user) notFound();

  const profile = profiles.find((p) => p.user_id === id);
  if (!profile) notFound();

  // Artworks milik artist ini yang sudah lolos kurasi
  const artistArtworks = artworks.filter(
    (a) => a.artists_id === id && a.is_visible_on_feed,
  );

  // Join artworks dengan tags
  const artworksWithTags = artistArtworks.map((artwork) => {
    const tagIds = artworkTags
      .filter((at) => at.artwork_id === artwork.id)
      .map((at) => at.tag_id);
    return {
      ...artwork,
      tags: tags.filter((t) => tagIds.includes(t.id)),
    };
  });

  // Format harga
  const formattedPrice = profile.base_price_idr
    ? formatPrice(profile.base_price_idr)
    : null;

  // Format tanggal bergabung
  const joinedDate = new Date(user.created_at).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">

      {/* ── Back Button ─────────────────────────────── */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-content-muted hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Feed
      </Link>

      {/* ── Hero: Profile + Commission Card ─────────── */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Profil Artist */}
        <div className="flex-1 bg-surface border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <AvatarInitials
              name={user.name}
              className="w-20 h-20 text-2xl shrink-0"
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display text-2xl font-bold text-content">
                  {user.name}
                </h1>
                {profile.is_verified && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-verified bg-verified/10 px-2 py-0.5 rounded-full">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    Terverifikasi
                  </span>
                )}
              </div>
              <p className="text-sm text-content-muted mt-0.5">@{user.email.split("@")[0]}</p>

              {profile.bio && (
                <p className="mt-3 text-content-muted text-sm leading-relaxed">
                  {profile.bio}
                </p>
              )}

              {/* Stats bar */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-content-muted">
                  <ImageIcon className="w-4 h-4 text-primary" />
                  <span>
                    <strong className="text-content">{profile.approved_portfolio_count}</strong> Karya
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-content-muted">
                  <CalendarDays className="w-4 h-4 text-primary" />
                  <span>Bergabung {joinedDate}</span>
                </div>
                <div className="flex items-center gap-1.5 text-content-muted">
                  <Palette className="w-4 h-4 text-primary" />
                  <span>
                    {artistArtworks.length} karya di portfolio
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Verification badge detail */}
          {profile.is_verified && (
            <div className="mt-5 flex items-start gap-3 rounded-xl bg-verified/5 border border-verified/20 px-4 py-3">
              <ShieldCheck className="w-5 h-5 text-verified shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-content">Human-Verified Artist</p>
                <p className="text-xs text-content-muted mt-0.5">
                  Seluruh karya telah melalui kurasi tim TruBrush dan terbukti dibuat oleh manusia — tanpa bantuan AI.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Commission Card */}
        <div className="lg:w-72 shrink-0">
          <div className="bg-surface border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sticky top-24 space-y-4">
            <h2 className="font-heading font-semibold text-content">Pesan Komisi</h2>

            {formattedPrice && (
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-content-muted">Mulai dari</p>
                  <p className="font-display text-xl font-bold text-primary">
                    {formattedPrice}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2 text-sm text-content-muted">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-verified shrink-0" />
                Dana aman dengan sistem Escrow
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-primary shrink-0" />
                Diskusi langsung dengan artist
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-danger shrink-0" />
                Garansi revisi inklusif
              </div>
            </div>

            <hr className="border-slate-200 dark:border-slate-700" />

            {profile.is_verified ? (
              profile.is_open_for_commission ? (
                <Button className="w-full text-sm justify-center">
                  Pesan Komisi Sekarang
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  className="w-full text-sm justify-center pointer-events-none"
                  disabled
                >
                  Komisi Sedang Tutup
                </Button>
              )
            ) : (
              <Button
                variant="danger"
                className="w-full text-sm justify-center pointer-events-none"
                disabled
              >
                Belum Diverifikasi
              </Button>
            )}

            {!profile.is_verified && (
              <p className="text-xs text-content-muted text-center">
                Artist ini sedang dalam proses verifikasi TruBrush.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Portfolio Section ────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading text-xl font-semibold text-content">
            Portfolio
          </h2>
          <span className="text-sm text-content-muted">
            {artworksWithTags.length} karya
          </span>
        </div>

        {artworksWithTags.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 py-16 flex flex-col items-center gap-3 text-center">
            <ImageIcon className="w-10 h-10 text-content-muted/40" />
            <p className="font-medium text-content">Belum ada karya</p>
            <p className="text-sm text-content-muted max-w-xs">
              Artist ini belum memiliki karya yang lolos kurasi. Coba kunjungi lagi nanti.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {artworksWithTags.map((artwork) => (
              <Link
                key={artwork.id}
                href={`/detail/${artwork.id}`}
                className="group bg-surface border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden hover:shadow-md hover:border-primary/30 transition-all duration-200"
              >
                {/* Thumbnail */}
                <div className="relative aspect-4/3 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  {artwork.images_url[0] ? (
                    <Image
                      src={artwork.images_url[0]}
                      alt={artwork.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-content-muted/30" />
                    </div>
                  )}

                  {/* Upload type badge */}
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] font-medium bg-black/50 text-white px-2 py-0.5 rounded-full backdrop-blur-sm capitalize">
                      {artwork.upload_type === "original"
                        ? "Orisinal"
                        : artwork.upload_type === "fanart"
                          ? "Fan Art"
                          : "Komisi"}
                    </span>
                  </div>

                  {/* Multiple images indicator */}
                  {artwork.images_url.length > 1 && (
                    <div className="absolute top-2 right-2">
                      <span className="text-[10px] font-medium bg-black/50 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                        +{artwork.images_url.length - 1}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3 space-y-2">
                  <p className="text-sm font-semibold text-content leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                    {artwork.title}
                  </p>

                  {artwork.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {artwork.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag.id}
                          className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                        >
                          {tag.tag_name}
                        </span>
                      ))}
                      {artwork.tags.length > 3 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          +{artwork.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
