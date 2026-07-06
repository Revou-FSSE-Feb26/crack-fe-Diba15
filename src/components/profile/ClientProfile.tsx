import { useMemo } from "react";
import { Briefcase, CalendarDays, Clock3, CreditCard, ShieldCheck } from "lucide-react";

import AvatarInitials from "@/components/home/AvatarInitials";
import AccountMeta from "@/components/profile/AccountMeta";
import ClientCommissionHistory from "@/components/profile/ClientCommissionHistory";
import ProfileHeading from "@/components/profile/ProfileHeading";
import StatItem from "@/components/profile/StatItem";
import SummaryRow from "@/components/profile/SummaryRow";
import type { ProfileUser } from "@/components/profile/types";
import { useCommissionStore } from "@/store/CommissionStore";
import { formatPrice } from "@/utils";

interface ClientProfileProps {
  user: ProfileUser;
}

export default function ClientProfile({ user }: ClientProfileProps) {
  const { commissions } = useCommissionStore();
  const clientCommissions = useMemo(
    () =>
      commissions
        .filter((commission) => commission.client_id === user.id)
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        ),
    [commissions, user.id],
  );

  const activeCommissions = clientCommissions.filter((commission) =>
    ["pending", "accepted", "in_progress", "revision"].includes(
      commission.status,
    ),
  );
  const completedCommissions = clientCommissions.filter(
    (commission) => commission.status === "completed",
  );
  const totalSpent = clientCommissions
    .filter((commission) => commission.payment_status !== "refunded")
    .reduce((total, commission) => total + commission.price, 0);

  const joinedDate = new Date(user.created_at).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <ProfileHeading
        eyebrow="Profil Client"
        title="Pantau riwayat komisi"
        description="Lihat pesanan aktif, histori pembayaran, dan komisi yang sudah selesai."
      />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-surface border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <AvatarInitials
              name={user.name}
              className="w-20 h-20 text-2xl shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-2xl font-bold text-content">
                {user.name}
              </h2>
              <AccountMeta user={user} />

              <p className="mt-4 text-content-muted text-sm leading-relaxed">
                Akun client digunakan untuk mencari artist human-verified,
                memesan komisi, dan memantau progres pekerjaan.
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <StatItem icon={Briefcase}>
                  <strong className="text-content">
                    {clientCommissions.length}
                  </strong>{" "}
                  Komisi
                </StatItem>
                <StatItem icon={Clock3}>
                  {activeCommissions.length} sedang berjalan
                </StatItem>
                <StatItem icon={CalendarDays}>Bergabung {joinedDate}</StatItem>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-xl bg-primary/5 border border-primary/20 px-4 py-3">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-content">
                Proteksi Komisi TruBrush
              </p>
              <p className="text-xs text-content-muted mt-0.5">
                Riwayat komisi membantu kamu melacak order, status pembayaran,
                dan hasil akhir dari artist.
              </p>
            </div>
          </div>
        </div>

        <aside className="lg:w-72 shrink-0">
          <div className="bg-surface border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sticky top-24 space-y-4">
            <h2 className="font-heading font-semibold text-content">
              Ringkasan Client
            </h2>

            <SummaryRow label="Order aktif">
              {activeCommissions.length}
            </SummaryRow>
            <SummaryRow label="Selesai">
              {completedCommissions.length}
            </SummaryRow>
            <SummaryRow label="Total komisi">
              {clientCommissions.length}
            </SummaryRow>

            <div className="flex items-center gap-2 rounded-xl bg-primary/5 px-3 py-3">
              <CreditCard className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-xs text-content-muted">Total nilai order</p>
                <p className="font-display text-xl font-bold text-primary">
                  {formatPrice(totalSpent)}
                </p>
              </div>
            </div>

            <hr className="border-slate-200 dark:border-slate-700" />
          </div>
        </aside>
      </div>

      <ClientCommissionHistory commissions={clientCommissions} />
    </div>
  );
}
