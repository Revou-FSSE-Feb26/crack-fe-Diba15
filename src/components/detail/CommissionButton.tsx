"use client";

import { useRouter } from "next/navigation";
import { Briefcase } from "lucide-react";

import { useCommissionStore } from "@/store/CommissionStore";
import { useModalStore } from "@/store/ModalStore";
import { useUserStore } from "@/store/UserStore";

interface CommissionButtonProps {
  artworkId: string;
  artworkTitle: string;
  artistId: string;
  artistName: string;
  basePrice: number | null;
}

export default function CommissionButton({
  artworkTitle,
  artistId,
  artistName,
  basePrice,
}: CommissionButtonProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useUserStore();
  const { createCommission } = useCommissionStore();
  const { openModal } = useModalStore();

  const handleClick = () => {
    if (!isAuthenticated || !user) {
      openModal({
        title: "Login diperlukan",
        description: "Silakan login terlebih dahulu untuk melakukan commission.",
        type: "confirm",
        confirmLabel: "Login",
        cancelLabel: "Batal",
        onConfirm: () => router.push("/login"),
      });
      return;
    }

    if (user.id === artistId) {
      openModal({
        title: "Tidak bisa commission karya sendiri",
        description: "Gunakan akun client untuk melakukan commission ke artist.",
      });
      return;
    }

    const commission = createCommission({
      artists_id: artistId,
      client_id: user.id,
      commission_title: `Commission dari ${artworkTitle}`,
      description: `Request dummy berdasarkan artwork "${artworkTitle}" milik ${artistName}.`,
      price: basePrice ?? 250000,
    });

    openModal({
      title: "Commission dibuat",
      description:
        "Order dummy sudah masuk. Lanjutkan ke halaman progress untuk pembayaran uang muka dan pelacakan status.",
      type: "confirm",
      confirmLabel: "Lihat Progress",
      cancelLabel: "Tetap di sini",
      onConfirm: () => router.push(`/commissions/${commission.id}`),
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
    >
      <Briefcase className="w-4 h-4" />
      Pesan Komisi
    </button>
  );
}
