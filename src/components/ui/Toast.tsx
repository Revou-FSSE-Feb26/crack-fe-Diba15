"use client";

import { AlertTriangle, CheckCircle, Info, X, XCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useToastStore } from "@/store/ToastStore";
import type { Toast, ToastType } from "@/types";

// ── Per-type visual config ────────────────────────────────────────────────────

type TypeConfig = {
	Icon: React.ElementType;
	alertClass: string;
};

const TYPE_CONFIG: Record<ToastType, TypeConfig> = {
	success: {
		Icon: CheckCircle,
		alertClass: "alert-success",
	},
	error: {
		Icon: XCircle,
		alertClass: "alert-error",
	},
	warning: {
		Icon: AlertTriangle,
		alertClass: "alert-warning",
	},
	info: {
		Icon: Info,
		alertClass: "alert-info",
	},
};

// ── Individual Toast Item ─────────────────────────────────────────────────────

function ToastItem({ toast }: { toast: Toast }) {
	const { removeToast } = useToastStore();
	const [isVisible, setIsVisible] = useState(false);
	const [isLeaving, setIsLeaving] = useState(false);

	const { Icon, alertClass } = TYPE_CONFIG[toast.type];

	const dismiss = useCallback(() => {
		setIsLeaving(true);
		setTimeout(() => removeToast(toast.id), 300);
	}, [removeToast, toast.id]);

	// Enter animation: double-rAF ensures CSS transition fires
	useEffect(() => {
		const id = requestAnimationFrame(() =>
			requestAnimationFrame(() => setIsVisible(true)),
		);
		return () => cancelAnimationFrame(id);
	}, []);

	// Auto-dismiss
	useEffect(() => {
		const t = setTimeout(dismiss, toast.duration);
		return () => clearTimeout(t);
	}, [dismiss, toast.duration]);

	const shown = isVisible && !isLeaving;

	return (
		<div
			role="alert"
			aria-live="polite"
			className={[
				"alert shadow-lg w-72 flex items-start gap-2.5 transition-all duration-300 ease-out",
				alertClass,
				shown ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8",
			].join(" ")}
		>
			<Icon size={18} className="shrink-0 mt-0.5" />
			<span className="flex-1 text-sm font-medium leading-snug wrap-break-word">
				{toast.message}
			</span>
			<button
				type="button"
				onClick={dismiss}
				aria-label="Tutup notifikasi"
				className="btn btn-ghost btn-xs btn-square p-0"
			>
				<X size={14} />
			</button>
		</div>
	);
}

// ── Toast Container ───────────────────────────────────────────────────────────

export default function ToastContainer() {
	const { toasts } = useToastStore();

	return (
		<div className="toast toast-end toast-bottom z-9999 pointer-events-none">
			{toasts.map((toast) => (
				<div key={toast.id} className="pointer-events-auto">
					<ToastItem toast={toast} />
				</div>
			))}
		</div>
	);
}
