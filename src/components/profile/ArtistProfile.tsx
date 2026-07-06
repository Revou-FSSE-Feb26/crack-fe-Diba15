import {
  BadgeCheck,
  CalendarDays,
  ImageIcon,
  Palette,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import AvatarInitials from "@/components/home/AvatarInitials";
import AccountMeta from "@/components/profile/AccountMeta";
import ArtistPortfolio from "@/components/profile/ArtistPortfolio";
import ProfileHeading from "@/components/profile/ProfileHeading";
import StatItem from "@/components/profile/StatItem";
import SummaryRow from "@/components/profile/SummaryRow";
import type { ProfileUser } from "@/components/profile/types";
import Button from "@/components/ui/Button";
import artworks from "@/data/artworks";
import artworkTags from "@/data/artworkTags";
import profiles from "@/data/profiles";
import tags from "@/data/tags";
import { useCommissionStore } from "@/store/CommissionStore";
import { formatPrice } from "@/utils";

interface ArtistProfileProps {
  user: ProfileUser;
}

export default function ArtistProfile({ user }: ArtistProfileProps) {
  const { commissions } = useCommissionStore();
  const profile = profiles.find((item) => item.user_id === user.id);
  const artistArtworks = artworks.filter(
    (artwork) => artwork.artists_id === user.id && artwork.is_visible_on_feed,
  );
  const artistCommissions = commissions.filter(
    (commission) => commission.artists_id === user.id,
  );

  const artworksWithTags = artistArtworks.map((artwork) => {
    const tagIds = artworkTags
      .filter((artworkTag) => artworkTag.artwork_id === artwork.id)
      .map((artworkTag) => artworkTag.tag_id);

    return {
      ...artwork,
      tags: tags.filter((tag) => tagIds.includes(tag.id)),
    };
  });

  const joinedDate = new Date(user.created_at).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
  });
  const formattedPrice = profile?.base_price_idr
    ? formatPrice(profile.base_price_idr)
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <ProfileHeading
        eyebrow="Profil Artist"
        title="Kelola portfolio dan komisi"
        description="Pantau status verifikasi, karya terkurasi, dan kesiapan menerima komisi."
      />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-surface border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <AvatarInitials
              name={user.name}
              className="w-20 h-20 text-2xl shrink-0"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display text-2xl font-bold text-content">
                  {user.name}
                </h2>
                {profile?.is_verified && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-verified bg-verified/10 px-2 py-0.5 rounded-full">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    Terverifikasi
                  </span>
                )}
              </div>

              <AccountMeta user={user} />

              <p className="mt-4 text-content-muted text-sm leading-relaxed">
                {profile?.bio ??
                  "Lengkapi bio artist agar client memahami gaya dan layanan komisi kamu."}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <StatItem icon={ImageIcon}>
                  <strong className="text-content">
                    {profile?.approved_portfolio_count ?? artistArtworks.length}
                  </strong>{" "}
                  Karya
                </StatItem>
                <StatItem icon={CalendarDays}>Bergabung {joinedDate}</StatItem>
                <StatItem icon={Palette}>
                  {artistArtworks.length} karya di portfolio
                </StatItem>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-xl bg-verified/5 border border-verified/20 px-4 py-3">
            <ShieldCheck className="w-5 h-5 text-verified shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-content">
                {profile?.is_verified
                  ? "Human-Verified Artist"
                  : "Menunggu Verifikasi Artist"}
              </p>
              <p className="text-xs text-content-muted mt-0.5">
                {profile?.is_verified
                  ? "Portfolio kamu sudah lolos kurasi TruBrush dan dapat dipercaya sebagai karya manusia."
                  : "Selesaikan verifikasi agar portfolio dan layanan komisi lebih dipercaya client."}
              </p>
            </div>
          </div>
        </div>

        <aside className="lg:w-72 shrink-0">
          <div className="bg-surface border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sticky top-24 space-y-4">
            <h2 className="font-heading font-semibold text-content">
              Ringkasan Artist
            </h2>

            <SummaryRow label="Verifikasi">
              <span
                className={
                  profile?.is_verified
                    ? "font-medium text-verified"
                    : "font-medium text-content"
                }
              >
                {profile?.is_verified ? "Aktif" : "Belum aktif"}
              </span>
            </SummaryRow>
            <SummaryRow label="Komisi">
              {profile?.is_open_for_commission ? "Dibuka" : "Ditutup"}
            </SummaryRow>
            <SummaryRow label="Order masuk">{artistCommissions.length}</SummaryRow>

            {formattedPrice && (
              <div className="flex items-center gap-2 rounded-xl bg-primary/5 px-3 py-3">
                <Wallet className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-content-muted">Harga mulai</p>
                  <p className="font-display text-xl font-bold text-primary">
                    {formattedPrice}
                  </p>
                </div>
              </div>
            )}

            <hr className="border-slate-200 dark:border-slate-700" />

            <div className="space-y-2">
              <Button className="w-full text-sm justify-center">
                Edit Profil
              </Button>
              <Button
                variant="secondary"
                className="w-full text-sm justify-center"
              >
                Upload Karya
              </Button>
            </div>
          </div>
        </aside>
      </div>

      <ArtistPortfolio artworksWithTags={artworksWithTags} />
    </div>
  );
}
