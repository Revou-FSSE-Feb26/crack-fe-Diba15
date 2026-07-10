"use client";

import { AlertTriangle, HelpCircle, Info, X } from "lucide-react";
import { type SubmitEvent, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { useModalStore } from "@/store/ModalStore";
import type { ModalType, ModalVariant } from "@/types";

// ── Icon area at top of modal ─────────────────────────────────────────────────

function ModalIcon({
	type,
	variant,
}: {
	type: ModalType;
	variant: ModalVariant;
}) {
	if (type === "form") {
		return (
			<div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4">
				<HelpCircle size={24} className="text-primary" />
			</div>
		);
	}
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
			requestAnimationFrame(() => setVisible(true)),
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
		maxWidthClassName = "max-w-md",
		formClassName,
		onConfirm,
		onSubmit,
		onCancel,
	} = config;

	const confirmLabel =
		config.confirmLabel ??
		(type === "confirm" ? "Konfirmasi" : type === "form" ? "Simpan" : "OK");
	const cancelLabel = config.cancelLabel ?? "Batal";

	const handleConfirm = () => {
		onConfirm?.();
		closeModal();
	};

	const handleCancel = () => {
		onCancel?.();
		closeModal();
	};

	const handleFormSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		const shouldClose = onSubmit?.(event);
		if (shouldClose !== false) {
			closeModal();
		}
	};

	const bodyContent = content ? (
		<div
			className={[
				"mb-6",
				type === "form" ? "" : "text-sm text-content-muted",
			].join(" ")}
		>
			{content}
		</div>
	) : description ? (
		<p className="text-sm text-content-muted text-center mb-6">{description}</p>
	) : (
		<div className="mb-4" />
	);

	const actionButtons =
		type === "confirm" || type === "form" ? (
			<div className="flex gap-3 flex-row-reverse">
				<Button
					type={type === "form" ? "submit" : "button"}
					variant={variant === "danger" ? "danger" : "primary"}
					className="flex-1 justify-center"
					onClick={type === "form" ? undefined : handleConfirm}
				>
					{confirmLabel}
				</Button>
				<Button
					type="button"
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
		);

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
					`relative z-10 w-full ${maxWidthClassName}`,
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

				{type === "form" ? (
					<form onSubmit={handleFormSubmit} className={formClassName}>
						{bodyContent}
						{actionButtons}
					</form>
				) : (
					<>
						{bodyContent}
						{actionButtons}
					</>
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
