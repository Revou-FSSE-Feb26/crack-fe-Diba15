import { Briefcase, CheckCircle2, Clock3, CreditCard } from "lucide-react";

import AvatarInitials from "@/components/home/AvatarInitials";
import CommissionMeta from "@/components/profile/CommissionMeta";
import EmptyState from "@/components/profile/EmptyState";
import { formatDate } from "@/utils";
import users from "@/data/users";
import type { Commission } from "@/types";
import { formatPrice } from "@/utils";

export const commissionStatus: Record<
  Commission["status"],
  { label: string; className: string }
> = {
  pending: {
    label: "Menunggu",
    className: "bg-premium/10 text-premium",
  },
  accepted: {
    label: "Diterima",
    className: "bg-primary/10 text-primary",
  },
  in_progress: {
    label: "Dikerjakan",
    className: "bg-primary/10 text-primary",
  },
  revision: {
    label: "Revisi",
    className: "bg-premium/10 text-premium",
  },
  completed: {
    label: "Selesai",
    className: "bg-verified/10 text-verified",
  },
  cancelled: {
    label: "Dibatalkan",
    className: "bg-danger/10 text-danger",
  },
  disputed: {
    label: "Sengketa",
    className: "bg-danger/10 text-danger",
  },
};

interface ClientCommissionHistoryProps {
  commissions: Commission[];
}

export default function ClientCommissionHistory({
  commissions: clientCommissions,
}: ClientCommissionHistoryProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-heading text-xl font-semibold text-content">
          Riwayat Komisi
        </h2>
        <span className="text-sm text-content-muted">
          {clientCommissions.length} order
        </span>
      </div>

      {clientCommissions.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="Belum ada komisi"
          description="Pesanan komisi yang kamu buat akan tampil di bagian ini."
        />
      ) : (
        <div className="space-y-3">
          {clientCommissions.map((commission) => {
            const artist = users.find((item) => item.id === commission.artists_id);
            const status = commissionStatus[commission.status];

            return (
              <article
                key={commission.id}
                className="bg-surface border border-slate-200 dark:border-slate-700 rounded-2xl p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <AvatarInitials
                      name={artist?.name ?? "Artist"}
                      className="w-11 h-11 text-sm"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-content">
                          {commission.commission_title}
                        </h3>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-content-muted">
                        Artist: {artist?.name ?? "Tidak diketahui"}
                      </p>
                      {commission.description && (
                        <p className="mt-2 text-sm text-content-muted leading-relaxed">
                          {commission.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <p className="font-display text-lg font-bold text-primary">
                      {formatPrice(commission.price)}
                    </p>
                    <p className="mt-1 text-xs text-content-muted">
                      {formatDate(commission.created_at)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <CommissionMeta
                    icon={CreditCard}
                    label="Pembayaran"
                    value={commission.payment_status}
                  />
                  <CommissionMeta
                    icon={Clock3}
                    label="Update"
                    value={formatDate(commission.updated_at)}
                  />
                  <CommissionMeta
                    icon={CheckCircle2}
                    label="Status"
                    value={status.label}
                  />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
