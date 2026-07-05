"use client";

import { useEffect, useState } from "react";
import { X, Info, HelpCircle, AlertTriangle } from "lucide-react";
import {
  useModalStore,
  type ModalType,
  type ModalVariant,
} from "@/store/ModalStore";
import Button from "@/components/ui/Button";

// ── Icon area at top of modal ─────────────────────────────────────────────────

function ModalIcon({
  type,
  variant,
}: {
  type: ModalType;
  variant: ModalVariant;
}) {
  if (type === "confirm" && variant === "danger") {
    return (
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-danger/10 mx-auto mb-4">
        <AlertTriangle size={24} className="text-danger" />
      </div>
    );
  }
  if (type === "confirm") {
    return (
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4">
        <HelpCircle size={24} className="text-primary" />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4">
      <Info size={24} className="text-primary" />
    </div>
  );
}

// ── Modal inner content — mounts only while isOpen is true ───────────────────

function ModalContent() {
  const { config, closeModal } = useModalStore();
  const [visible, setVisible] = useState(false);

  // Enter animation: double-rAF so CSS transition has a starting frame to diff against
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setVisible(true))
    );
    return () => cancelAnimationFrame(id);
  }, []);

  // Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        config?.onCancel?.();
        closeModal();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [config, closeModal]);

  if (!config) return null;

  const {
    title,
    description,
    content,
    type = "alert",
    variant = "default",
    onConfirm,
    onCancel,
  } = config;

  const confirmLabel =
    config.confirmLabel ?? (type === "confirm" ? "Konfirmasi" : "OK");
  const cancelLabel = config.cancelLabel ?? "Batal";

  const handleConfirm = () => {
    onConfirm?.();
    closeModal();
  };

  const handleCancel = () => {
    onCancel?.();
    closeModal();
  };

  return (
    <div
      className={[
        "fixed inset-0 z-9998 flex items-center justify-center p-4",
        "transition-opacity duration-200",
        visible ? "opacity-100" : "opacity-0",
      ].join(" ")}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={handleCancel}
        aria-hidden="true"
      />

      {/* Dialog card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={[
          "relative z-10 w-full max-w-md",
          "bg-surface rounded-2xl shadow-2xl border border-content/10 p-6",
          "transition-all duration-200",
          visible ? "scale-100 translate-y-0" : "scale-95 translate-y-3",
        ].join(" ")}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={handleCancel}
          aria-label="Tutup modal"
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-content/5 transition-colors cursor-pointer"
        >
          <X size={16} className="text-content-muted" />
        </button>

        {/* Icon */}
        <ModalIcon type={type} variant={variant} />

        {/* Title */}
        <h2
          id="modal-title"
          className="text-lg font-bold text-content text-center mb-2"
        >
          {title}
        </h2>

        {/* Body: custom content OR simple description */}
        {content ? (
          <div className="text-sm text-content-muted mb-6">{content}</div>
        ) : description ? (
          <p className="text-sm text-content-muted text-center mb-6">
            {description}
          </p>
        ) : (
          <div className="mb-4" />
        )}

        {/* Action buttons */}
        {type === "confirm" ? (
          <div className="flex gap-3 flex-row-reverse">
            <Button
              variant={variant === "danger" ? "danger" : "primary"}
              className="flex-1 justify-center"
              onClick={handleConfirm}
            >
              {confirmLabel}
            </Button>
            <Button
              variant="secondary"
              className="flex-1 justify-center"
              onClick={handleCancel}
            >
              {cancelLabel}
            </Button>
          </div>
        ) : (
          <Button className="w-full justify-center" onClick={handleConfirm}>
            {confirmLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

// ── Root export — controls mount/unmount of ModalContent ─────────────────────

export default function Modal() {
  const { isOpen } = useModalStore();

  // Body scroll lock lives here so it always fires on open/close
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Mount ModalContent only while open; unmounting resets its local `visible`
  // state automatically, giving a clean enter animation on each open.
  if (!isOpen) return null;
  return <ModalContent />;
}
