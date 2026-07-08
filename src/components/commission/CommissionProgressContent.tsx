"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Briefcase,
  CheckCircle2,
  Clock3,
  CreditCard,
  Eye,
} from "lucide-react";

import AvatarInitials from "@/components/home/AvatarInitials";
import { useCommissionStore } from "@/store/CommissionStore";
import { useUserStore } from "@/store/UserStore";
import users from "@/data/users";
import { formatDate, formatPrice } from "@/utils";
import type { Commission } from "@/types";
import Meta from "@/components/commission/Meta";
import { useMounted } from "@/hooks/useMounted";


export const statusStyle: Record<Commission["status"], { label: string; className: string }> = {
  pending: { label: "Menunggu artist", className: "bg-premium/10 text-premium" },
  accepted: { label: "Diterima", className: "bg-primary/10 text-primary" },
  in_progress: { label: "Dikerjakan", className: "bg-primary/10 text-primary" },
  revision: { label: "Review client", className: "bg-premium/10 text-premium" },
  completed: { label: "Selesai", className: "bg-verified/10 text-verified" },
  cancelled: { label: "Dibatalkan", className: "bg-danger/10 text-danger" },
  disputed: { label: "Dispute", className: "bg-danger/10 text-danger" },
};

export default function CommissionProgressContent() {
  const { user, isAuthenticated } = useUserStore();
  const { commissions } = useCommissionStore();
  const mounted = useMounted();

  const visibleCommissions = useMemo(() => {
    if (!user) return [];

    return commissions
      .filter((commission) =>
        user.role === "artist"
          ? commission.artists_id === user.id
          : commission.client_id === user.id,
      )
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }, [commissions, user]);

  if (!mounted) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <p className="text-sm text-content-muted">Memuat progress commission...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-surface border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center">
          <Briefcase className="w-10 h-10 text-primary mx-auto mb-3" />
          <h1 className="font-heading text-2xl font-semibold text-content">
            Login untuk melihat commission
          </h1>
          <p className="mt-2 text-sm text-content-muted">
            Progress commission hanya tersedia untuk client yang memesan dan artist yang menerima order.
          </p>
        </div>
      </div>
    );
  }

  const isArtistView = user.role === "artist";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">
            {isArtistView ? "Artist POV" : "Client POV"}
          </p>
          <h1 className="font-heading text-3xl font-bold text-content">
            Progress Commission
          </h1>
          <p className="mt-1 text-sm text-content-muted">
            {isArtistView
              ? "Lihat daftar commission dari client dan buka detail untuk mengelola progress."
              : "Lihat daftar commission kamu dan buka detail untuk pembayaran, revisi, approval, atau dispute."}
          </p>
        </div>
        <span className="text-sm text-content-muted">
          {visibleCommissions.length} order
        </span>
      </div>

      {visibleCommissions.length === 0 ? (
        <div className="bg-surface border border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center">
          <Briefcase className="w-10 h-10 text-content-muted mx-auto mb-3" />
          <p className="font-semibold text-content">Belum ada commission</p>
          <p className="mt-1 text-sm text-content-muted">
            Order yang relevan dengan akun ini akan tampil di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleCommissions.map((commission) => {
            const artist = users.find((item) => item.id === commission.artists_id);
            const client = users.find((item) => item.id === commission.client_id);
            const status = statusStyle[commission.status];
            const counterpartName = isArtistView ? client?.name ?? "Client" : artist?.name ?? "Artist";

            return (
              <article
                key={commission.id}
                className="bg-surface border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-3 min-w-0">
                    <AvatarInitials
                      name={counterpartName}
                      className="w-12 h-12 text-sm shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold text-content">
                          {commission.commission_title}
                        </h2>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-content-muted">
                        {isArtistView ? `Client: ${counterpartName}` : `Artist: ${counterpartName}`}
                      </p>
                      {commission.description && (
                        <p className="mt-2 text-sm leading-relaxed text-content-muted">
                          {commission.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:w-107.5">
                    <Meta icon={CreditCard} label="Bayar" value={commission.payment_status} />
                    <Meta icon={Clock3} label="Update" value={formatDate(commission.updated_at)} />
                    <Meta icon={CheckCircle2} label="Harga" value={formatPrice(commission.price)} />
                    <Meta icon={Briefcase} label="Dibuat" value={formatDate(commission.created_at)} />
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Link
                    href={`/commissions/${commission.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-background shadow-sm transition-colors hover:bg-primary-hover"
                  >
                    <Eye className="w-4 h-4" />
                    Detail
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
