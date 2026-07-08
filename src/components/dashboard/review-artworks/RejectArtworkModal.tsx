"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { AlertTriangle, X } from "lucide-react";

import Button from "@/components/ui/Button";

interface RejectFormValues {
  reason: string;
}

interface RejectArtworkModalProps {
  artworkTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const presetReasons = [
  "Karya terindikasi hasil AI generatif — tekstur tidak konsisten dan tidak ada bukti proses manual yang memadai.",
  "Detail wajah dan tangan menunjukkan pola khas output AI; WIP proof tidak menunjukkan progres sketsa manual.",
  "Komposisi terlalu sempurna tanpa layer sketch; metadata visual tidak selaras dengan klaim artwork orisinal.",
];

export default function RejectArtworkModal({
  artworkTitle,
  isOpen,
  onClose,
  onSubmit,
}: RejectArtworkModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<RejectFormValues>({
    defaultValues: { reason: "" },
  });

  const reason = useWatch({ control, name: "reason" });

  useEffect(() => {
    if (!isOpen) return;
    reset({ reason: "" });
  }, [isOpen, reset]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reject-artwork-title"
        className="relative z-10 w-full max-w-lg rounded-2xl border border-content/10 bg-surface p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup form"
          className="absolute top-4 right-4 rounded-full p-1.5 transition-colors hover:bg-content/5"
        >
          <X size={16} className="text-content-muted" />
        </button>

        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-danger/10">
            <AlertTriangle className="h-5 w-5 text-danger" />
          </div>
          <div>
            <h2 id="reject-artwork-title" className="font-heading text-xl font-semibold text-content">
              Tolak Artwork
            </h2>
            <p className="mt-1 text-sm text-content-muted">
              Berikan alasan jelas untuk penolakan <span className="font-medium text-content">{artworkTitle}</span>.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit((values) => onSubmit(values.reason))}
          className="space-y-4"
        >
          <div>
            <span className="mb-2 block text-sm font-semibold text-content">
              Alasan cepat (AI detection)
            </span>
            <div className="space-y-2">
              {presetReasons.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setValue("reason", preset, { shouldValidate: true })}
                  className={[
                    "w-full rounded-lg border px-3 py-2 text-left text-xs leading-relaxed transition-colors",
                    reason === preset
                      ? "border-danger bg-danger/5 text-danger"
                      : "border-content/10 text-content-muted hover:border-content/20 hover:bg-content/5",
                  ].join(" ")}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="reject-reason" className="mb-1.5 block text-sm font-semibold text-content">
              Alasan penolakan
            </label>
            <textarea
              id="reject-reason"
              rows={4}
              placeholder="Jelaskan secara spesifik mengapa artwork ditolak, misalnya indikasi AI, WIP tidak valid, atau ketidaksesuaian kebijakan platform."
              className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#33658A] dark:border-gray-600 dark:bg-[#1D2D37] dark:focus:ring-[#86BBD8]"
              {...register("reason", {
                required: "Alasan penolakan wajib diisi",
                minLength: { value: 10, message: "Minimal 10 karakter agar artist memahami keputusan kurator" },
              })}
            />
            {errors.reason && (
              <p className="mt-1 text-xs text-danger">{errors.reason.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="secondary" className="flex-1 justify-center" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" variant="danger" className="flex-1 justify-center">
              Tolak Artwork
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
