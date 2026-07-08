"use client";

import { type ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, CreditCard, X } from "lucide-react";
import { useForm } from "react-hook-form";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/form/Input";
import { useCommissionStore } from "@/store/CommissionStore";
import { useModalStore } from "@/store/ModalStore";
import { useUserStore } from "@/store/UserStore";
import { formatPrice } from "@/utils";

interface CommissionButtonProps {
  artworkId?: string;
  artworkTitle?: string;
  artistId: string;
  artistName: string;
  basePrice: number | null;
  children?: ReactNode;
  className?: string;
}

interface CommissionForm {
  title: string;
  description: string;
  price: number;
}

export default function CommissionButton({
  artworkTitle,
  artistId,
  artistName,
  basePrice,
  children = "Pesan Komisi",
  className = "",
}: CommissionButtonProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useUserStore();
  const { createCommission } = useCommissionStore();
  const { openModal } = useModalStore();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const minimumPrice = basePrice ?? 250000;
  const defaultValues: CommissionForm = {
    title: artworkTitle ? `Commission dari ${artworkTitle}` : `Commission untuk ${artistName}`,
    description: artworkTitle
      ? `Request berdasarkan artwork "${artworkTitle}" milik ${artistName}.`
      : `Request commission untuk ${artistName}.`,
    price: minimumPrice,
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommissionForm>({
    defaultValues,
  });

  const closeForm = () => {
    setIsFormOpen(false);
    reset(defaultValues);
  };

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

    if (user.role !== "client") {
      openModal({
        title: "Hanya client yang bisa pesan komisi",
        description: "Silakan gunakan akun client untuk membuat order commission.",
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

    reset(defaultValues);
    setIsFormOpen(true);
  };

  const onSubmit = (data: CommissionForm) => {
    if (!user || user.role !== "client") return;

    const commission = createCommission({
      artists_id: artistId,
      client_id: user.id,
      commission_title: data.title.trim(),
      description: data.description.trim(),
      price: data.price,
    });

    closeForm();
    openModal({
      title: "Commission dibuat",
      description:
        "Order sudah masuk. Lanjutkan ke halaman progress untuk pembayaran uang muka dan pelacakan status.",
      type: "confirm",
      confirmLabel: "Lihat Progress",
      cancelLabel: "Tetap di sini",
      onConfirm: () => router.push(`/commissions/${commission.id}`),
    });
  };

  return (
    <>
      <Button
        type="button"
        onClick={handleClick}
        className={`w-full inline-flex items-center justify-center gap-2 ${className}`}
      >
        <Briefcase className="w-4 h-4" />
        {children}
      </Button>
      {isFormOpen && (
        <div className="fixed inset-0 z-9998 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            aria-label="Tutup form commission"
            onClick={closeForm}
          />

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative z-10 w-full max-w-lg bg-surface rounded-2xl shadow-2xl border border-content/10 p-6 space-y-5"
          >
            <button
              type="button"
              onClick={closeForm}
              aria-label="Tutup form commission"
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-content/5 transition-colors cursor-pointer"
            >
              <X size={16} className="text-content-muted" />
            </button>

            <div className="space-y-1 pr-8">
              <h2 className="text-lg font-bold text-content">Pesan Komisi</h2>
              <p className="text-sm text-content-muted">
                Review detail pesanan untuk {artistName} sebelum membuat commission.
              </p>
            </div>

            <div>
              <label htmlFor="commission-title" className="block text-sm font-semibold mb-1.5 text-content">
                Judul
              </label>
              <Input
                id="commission-title"
                placeholder="Contoh: Ilustrasi karakter original"
                {...register("title", {
                  required: "Judul wajib diisi",
                  validate: (value) => value.trim().length > 0 || "Judul wajib diisi",
                })}
              >
                <Briefcase className="h-5 w-5 text-gray-400" />
              </Input>
              {errors.title && (
                <p className="text-danger text-xs mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="commission-description" className="block text-sm font-semibold mb-1.5 text-content">
                Deskripsi
              </label>
              <textarea
                id="commission-description"
                placeholder="Jelaskan brief, referensi, style, dan kebutuhan komisi."
                className="min-h-28 w-full resize-none rounded-lg border border-content/10 bg-background px-3 py-2.5 text-sm text-content outline-none focus:border-primary"
                {...register("description", {
                  required: "Deskripsi wajib diisi",
                  validate: (value) => value.trim().length > 0 || "Deskripsi wajib diisi",
                })}
              />
              {errors.description && (
                <p className="text-danger text-xs mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="commission-price" className="block text-sm font-semibold mb-1.5 text-content">
                Harga pengajuan
              </label>
              <Input
                id="commission-price"
                type="number"
                min={minimumPrice}
                step={10000}
                {...register("price", {
                  valueAsNumber: true,
                  required: "Harga pengajuan wajib diisi",
                  min: {
                    value: minimumPrice,
                    message: `Harga minimal ${formatPrice(minimumPrice)}`,
                  },
                  validate: (value) =>
                    Number.isFinite(value) || "Harga pengajuan wajib berupa angka",
                })}
              >
                <CreditCard className="h-5 w-5 text-gray-400" />
              </Input>
              <p className="text-xs text-content-muted mt-1">
                Minimal base price artist: {formatPrice(minimumPrice)}
              </p>
              {errors.price && (
                <p className="text-danger text-xs mt-1">{errors.price.message}</p>
              )}
            </div>

            <div className="flex gap-3 flex-row-reverse">
              <Button type="submit" className="flex-1 justify-center">
                Konfirmasi Pesanan
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="flex-1 justify-center"
                onClick={closeForm}
              >
                Batal
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
