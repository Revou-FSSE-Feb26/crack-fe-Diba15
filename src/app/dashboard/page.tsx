"use client";

import { useMemo } from "react";
import { Briefcase, CheckCircle2, FileWarning, ImageIcon, Users } from "lucide-react";

import Stat from "@/components/ui/Stat";
import { useArtworkStore } from "@/store/ArtworkStore";
import { useCommissionStore } from "@/store/CommissionStore";
import { useUserManagementStore } from "@/store/UserManagementStore";
import { useUserStore } from "@/store/UserStore";

export default function DashboardPage() {
  const { user } = useUserStore();
  const { users } = useUserManagementStore();
  const { artworks } = useArtworkStore();
  const { commissions } = useCommissionStore();

  const stats = useMemo(() => {
    const pendingArtworks = artworks.filter((artwork) => artwork.curation_status === "pending");
    const disputedCommissions = commissions.filter((commission) => commission.status === "disputed");
    const activeCommissions = commissions.filter((commission) =>
      ["pending", "accepted", "in_progress", "revision"].includes(commission.status),
    );

    return {
      totalUsers: users.length,
      totalArtists: users.filter((item) => item.role === "artist").length,
      totalClients: users.filter((item) => item.role === "client").length,
      pendingArtworks: pendingArtworks.length,
      disputedCommissions: disputedCommissions.length,
      activeCommissions: activeCommissions.length,
    };
  }, [artworks, commissions, users]);

  return (
    <>
      {user?.role === "admin" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat variant="card" label="Total User" value={stats.totalUsers} icon={Users} />
          <Stat variant="card" label="Artist" value={stats.totalArtists} icon={ImageIcon} />
          <Stat variant="card" label="Client" value={stats.totalClients} icon={Users} />
          <Stat variant="card" label="Komisi Aktif" value={stats.activeCommissions} icon={Briefcase} />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat variant="card" label="Artwork Pending" value={stats.pendingArtworks} icon={ImageIcon} />
          <Stat variant="card" label="Dispute" value={stats.disputedCommissions} icon={FileWarning} />
          <Stat variant="card" label="Total Artist" value={stats.totalArtists} icon={Users} />
          <Stat variant="card" label="Komisi Aktif" value={stats.activeCommissions} icon={Briefcase} />
        </div>
      )}

      <div className="rounded-2xl border border-content/10 bg-surface p-5">
        <div className="flex items-start gap-3">
          <div className="flex p-4 items-center justify-center rounded-xl bg-verified/10 text-verified">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-semibold text-content">
              Dashboard awal siap dikembangkan
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-content-muted">
              Beranda ini sudah memisahkan menu admin dan curator. Selanjutnya menu
              non-aktif bisa dipecah menjadi halaman manage user, artwork, dispute,
              atau laporan user sesuai kebutuhan workflow.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}