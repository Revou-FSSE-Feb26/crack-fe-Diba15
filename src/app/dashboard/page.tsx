"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  FileWarning,
  Home,
  ImageIcon,
  LayoutDashboard,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import Button from "@/components/ui/Button";
import users from "@/data/users";
import { useArtworkStore } from "@/store/ArtworkStore";
import { useCommissionStore } from "@/store/CommissionStore";
import { useUserStore } from "@/store/UserStore";

const adminMenu = [
  { label: "Beranda", description: "Ringkasan platform", icon: Home, active: true },
  { label: "Manage User", description: "Kelola role dan status user", icon: Users, active: false },
];

const curatorMenu = [
  { label: "Beranda", description: "Ringkasan kurasi", icon: Home, active: true },
  { label: "Manage Artwork", description: "Review artwork pending", icon: ImageIcon, active: false },
  { label: "Manage Dispute", description: "Pantau sengketa komisi", icon: FileWarning, active: false },
  { label: "Manage User", description: "Review user yang dilaporkan", icon: Users, active: false },
];

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-content/10 bg-surface p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-content-muted">{label}</p>
          <p className="mt-1 font-display text-2xl font-bold text-content">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useUserStore();
  const { artworks } = useArtworkStore();
  const { commissions } = useCommissionStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isStaff = user?.role === "admin" || user?.role === "curator";
  const menu = user?.role === "admin" ? adminMenu : curatorMenu;

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
  }, [artworks, commissions]);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-sm text-content-muted">Memuat dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-2xl border border-content/10 bg-surface p-6 text-center">
          <LayoutDashboard className="mx-auto mb-3 h-10 w-10 text-primary" />
          <h1 className="font-heading text-2xl font-semibold text-content">Login Staff Diperlukan</h1>
          <p className="mt-2 text-sm text-content-muted">
            Dashboard hanya tersedia untuk akun admin dan curator.
          </p>
          <Button className="mt-5 justify-center" onClick={() => router.push("/login")}>
            Login
          </Button>
        </div>
      </div>
    );
  }

  if (!isStaff) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-2xl border border-content/10 bg-surface p-6 text-center">
          <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-danger" />
          <h1 className="font-heading text-2xl font-semibold text-content">Akses Ditolak</h1>
          <p className="mt-2 text-sm text-content-muted">
            Akun {user.role} tidak memiliki akses ke dashboard operasional.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-primary-hover"
          >
            Kembali ke Feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {user.role === "admin" ? "Admin Dashboard" : "Curator Dashboard"}
          </p>
          <h1 className="font-heading text-2xl font-bold text-content">Beranda</h1>
          <p className="mt-1 text-sm text-content-muted">
            Ringkasan awal untuk operasional TruBrush. Menu lain disiapkan sebagai placeholder.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-content/5 px-3 py-1.5 text-xs font-medium text-content-muted">
          <ShieldCheck className="h-4 w-4 text-verified" />
          {user.name} - {user.role}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border border-content/10 bg-surface p-3">
          <nav className="space-y-2">
            {menu.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  disabled={!item.active}
                  className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                    item.active
                      ? "bg-primary/10 text-primary"
                      : "text-content-muted opacity-70 cursor-not-allowed"
                  }`}
                >
                  <Icon className="mt-0.5 h-5 w-5 shrink-0" />
                  <span>
                    <span className="block text-sm font-semibold">{item.label}</span>
                    <span className="block text-xs">{item.description}</span>
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="space-y-4">
          {user.role === "admin" ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Total User" value={stats.totalUsers} icon={Users} />
              <StatCard label="Artist" value={stats.totalArtists} icon={ImageIcon} />
              <StatCard label="Client" value={stats.totalClients} icon={Users} />
              <StatCard label="Komisi Aktif" value={stats.activeCommissions} icon={Briefcase} />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Artwork Pending" value={stats.pendingArtworks} icon={ImageIcon} />
              <StatCard label="Dispute" value={stats.disputedCommissions} icon={FileWarning} />
              <StatCard label="Total Artist" value={stats.totalArtists} icon={Users} />
              <StatCard label="Komisi Aktif" value={stats.activeCommissions} icon={Briefcase} />
            </div>
          )}

          <div className="rounded-2xl border border-content/10 bg-surface p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-verified/10 text-verified">
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
        </section>
      </div>
    </div>
  );
}
