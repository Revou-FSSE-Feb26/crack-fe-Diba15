"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Clock3,
  CreditCard,
  MessageSquare,
  Upload,
  XCircle,
} from "lucide-react";

import AvatarInitials from "@/components/home/AvatarInitials";
import Button from "@/components/ui/Button";
import Stat from "@/components/ui/Stat";
import ProofPreview from "@/components/commission/ProofPreview";
import { useCommissionStore } from "@/store/CommissionStore";
import { commissionStatusConfig } from "@/utils/commissionStatus";
import { useModalStore } from "@/store/ModalStore";
import { useUserStore } from "@/store/UserStore";
import users from "@/data/users";
import { formatDate, formatPrice } from "@/utils";
import type { Commission } from "@/types";
import { useMounted } from "@/hooks/useMounted";


interface CommissionDetailContentProps {
  commissionId: string;
}

export default function CommissionDetailContent({ commissionId }: CommissionDetailContentProps) {
  const { user, isAuthenticated } = useUserStore();
  const { openModal } = useModalStore();
  const {
    commissions,
    progress,
    revisions,
    setCommissionStatus,
    setPaymentStatus,
    uploadDummyResult,
    approveResult,
    addRevision,
  } = useCommissionStore();
  const mounted = useMounted();
  const [comment, setComment] = useState("");

  const commission = useMemo(
    () => commissions.find((item) => item.id === commissionId),
    [commissionId, commissions],
  );

  if (!mounted) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <p className="text-sm text-content-muted">Memuat detail commission...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-surface border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center">
          <Briefcase className="w-10 h-10 text-primary mx-auto mb-3" />
          <h1 className="font-heading text-2xl font-semibold text-content">
            Login untuk melihat detail commission
          </h1>
          <p className="mt-2 text-sm text-content-muted">
            Detail commission hanya tersedia untuk client yang memesan dan artist yang menerima order.
          </p>
        </div>
      </div>
    );
  }

  if (!commission) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-surface border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center">
          <Briefcase className="w-10 h-10 text-content-muted mx-auto mb-3" />
          <h1 className="font-heading text-2xl font-semibold text-content">
            Commission tidak ditemukan
          </h1>
          <p className="mt-2 text-sm text-content-muted">
            Order ini belum tersedia atau sudah tidak ada di daftar commission.
          </p>
          <Link
            href="/commissions"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-background shadow-sm transition-colors hover:bg-primary-hover"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke list
          </Link>
        </div>
      </div>
    );
  }

  const isArtistView = user.role === "artist";
  const hasAccess = isArtistView
    ? commission.artists_id === user.id
    : commission.client_id === user.id;

  if (!hasAccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-surface border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center">
          <AlertTriangle className="w-10 h-10 text-danger mx-auto mb-3" />
          <h1 className="font-heading text-2xl font-semibold text-content">
            Kamu tidak punya akses
          </h1>
          <p className="mt-2 text-sm text-content-muted">
            Commission ini hanya bisa dilihat oleh client terkait dan artist yang menerima order.
          </p>
        </div>
      </div>
    );
  }

  const artist = users.find((item) => item.id === commission.artists_id);
  const client = users.find((item) => item.id === commission.client_id);
  const progressItem = progress.find((item) => item.commission_id === commission.id);
  const thread = revisions.filter((item) => item.commission_id === commission.id);
  const status = commissionStatusConfig[commission.status];
  const canCancel = !["completed", "cancelled", "disputed"].includes(commission.status);
  const canApprove = Boolean(progressItem?.final_artwork_url) && commission.status !== "completed";
  const canPay =
    !isArtistView &&
    commission.payment_status === "unpaid" &&
    ["accepted", "in_progress", "revision"].includes(commission.status);
  const canUploadResult =
    isArtistView &&
    commission.payment_status === "paid" &&
    ["accepted", "in_progress", "revision"].includes(commission.status);
  const counterpartName = isArtistView ? client?.name ?? "Client" : artist?.name ?? "Artist";

  const confirmStatus = (selectedCommission: Commission, statusValue: Commission["status"], title: string) => {
    openModal({
      title,
      description: `Status "${selectedCommission.commission_title}" akan diubah menjadi ${commissionStatusConfig[statusValue].label}.`,
      type: "confirm",
      variant: statusValue === "cancelled" || statusValue === "disputed" ? "danger" : "default",
      confirmLabel: "Konfirmasi",
      onConfirm: () => setCommissionStatus(selectedCommission.id, statusValue),
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Link
        href="/commissions"
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke list commission
      </Link>

      <article className="bg-surface border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3 min-w-0">
            <AvatarInitials
              name={counterpartName}
              className="w-12 h-12 text-sm shrink-0"
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-heading text-2xl font-bold text-content">
                  {commission.commission_title}
                </h1>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}>
                  {status.label}
                </span>
              </div>
              <p className="mt-1 text-sm text-content-muted">
                {isArtistView ? `Client: ${counterpartName}` : `Artist: ${counterpartName}`}
              </p>
              {commission.description && (
                <p className="mt-3 text-sm leading-relaxed text-content-muted">
                  {commission.description}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:w-107.5">
            <Stat icon={CreditCard} label="Bayar" value={commission.payment_status} />
            <Stat icon={Clock3} label="Update" value={formatDate(commission.updated_at)} />
            <Stat icon={CheckCircle2} label="Harga" value={formatPrice(commission.price)} />
            <Stat icon={Briefcase} label="Dibuat" value={formatDate(commission.created_at)} />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="space-y-3">
            {/*Artwork Preview Section*/}
            <div className="grid gap-3 sm:grid-cols-2">
              <ProofPreview
                title="WIP Proof"
                src={progressItem?.sketch_url}
                empty="Artist belum upload WIP proof."
              />
              <ProofPreview
                title="Preview Final"
                src={progressItem?.final_artwork_url}
                empty="Final artwork belum tersedia."
              />
            </div>

            {/*Button Section*/}
            <div className="space-y-2">
              {!isArtistView && commission.status === "pending" && (
                <p className="rounded-lg bg-content/5 px-3 py-2 text-xs text-content-muted">
                  Menunggu artist menerima pengajuan. Diskusikan harga dan detail lewat komentar sebelum pembayaran.
                </p>
              )}
  
              {canPay && (
                <Button
                  className="flex gap-1 items-center w-full justify-center text-sm"
                  onClick={() => setPaymentStatus(commission.id, "paid")}
                >
                  <CreditCard className="w-4 h-4" />
                  Bayar Uang Muka
                </Button>
              )}
  
              {isArtistView && commission.status === "pending" && (
                <>
                  <Button
                    className="flex items-center gap-1 w-full justify-center text-sm"
                    onClick={() => confirmStatus(commission, "accepted", "Terima commission?")}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Terima
                  </Button>
                  <Button
                    variant="danger"
                    className="flex items-center gap-1 w-full justify-center text-sm"
                    onClick={() => confirmStatus(commission, "cancelled", "Tolak commission?")}
                  >
                    <XCircle className="w-4 h-4" />
                    Tolak
                  </Button>
                </>
              )}
  
            {isArtistView && commission.status === "accepted" && commission.payment_status === "paid" && (
              <Button
                className="flex items-center gap-1 w-full justify-center text-sm"
                onClick={() => setCommissionStatus(commission.id, "in_progress")}
              >
                  Mulai Kerjakan
              </Button>
            )}

            {isArtistView && commission.status === "accepted" && commission.payment_status === "unpaid" && (
              <p className="rounded-lg bg-content/5 px-3 py-2 text-xs text-content-muted">
                Menunggu client membayar uang muka sebelum artist bisa mulai kerja atau upload hasil.
              </p>
            )}

            {canUploadResult && (
              <Button
                variant="secondary"
                className="flex items-center gap-1 w-full justify-center text-sm"
                  onClick={() => uploadDummyResult(commission.id)}
                >
                  <Upload className="w-4 h-4" />
                  Upload Hasil Dummy
                </Button>
              )}
  
              {!isArtistView && canApprove && (
                <>
                  <Button
                    className="flex gap-1 items-center w-full justify-center text-sm"
                    onClick={() => approveResult(commission.id)}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve Hasil
                  </Button>
                  <Button
                    variant="danger"
                    className="flex gap-1 items-center w-full justify-center text-sm"
                    onClick={() => confirmStatus(commission, "disputed", "Ajukan dispute?")}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Ajukan Dispute
                  </Button>
                </>
              )}
  
              {!isArtistView && canCancel && (
                <Button
                  variant="secondary"
                  className="flex gap-1 items-center w-full justify-center text-sm"
                  onClick={() => confirmStatus(commission, "cancelled", "Batalkan commission?")}
                >
                  Batalkan Commission
                </Button>
              )}
            </div>

            {/*Comments Section*/}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-primary" />
                <p className="font-medium text-sm text-content">Komentar dan revisi</p>
              </div>
              <div className="space-y-2">
                {thread.length === 0 ? (
                  <p className="text-sm text-content-muted">Belum ada komentar.</p>
                ) : (
                  thread.map((item) => {
                    const author = users.find((entry) => entry.id === item.user_id);
                    return (
                      <div key={item.id} className="rounded-lg bg-content/5 px-3 py-2">
                        <p className="text-xs text-content-muted">
                          {author?.name ?? "User"} · {formatDate(item.created_at)}
                        </p>
                        <p className="mt-1 text-sm text-content">{item.comment}</p>
                      </div>
                    );
                  })
                )}
              </div>
              <form
                className="mt-3 flex flex-col gap-2 sm:flex-row"
                onSubmit={(event) => {
                  event.preventDefault();
                  addRevision(commission.id, user.id, comment);
                  setComment("");
                }}
              >
                <input
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="Tulis komentar, negosiasi harga, atau balasan..."
                  className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-background px-3 py-2 text-sm outline-none focus:border-primary dark:border-slate-700"
                />
                <Button type="submit" className="justify-center text-sm">
                  Kirim
                </Button>
              </form>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
