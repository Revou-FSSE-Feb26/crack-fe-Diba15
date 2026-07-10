"use client";

import { AlertTriangle, CheckCircle, Info, X, XCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useToastStore } from "@/store/ToastStore";
import type { Toast, ToastType } from "@/types";

// ── Per-type visual config ────────────────────────────────────────────────────

type TypeConfig = {
	Icon: React.ElementType;
	borderClass: string;
	iconClass: string;
};

const TYPE_CONFIG: Record<ToastType, TypeConfig> = {
	success: {
		Icon: CheckCircle,
		borderClass: "border-l-verified",
		iconClass: "text-verified",
	},
	error: {
		Icon: XCircle,
		borderClass: "border-l-danger",
		iconClass: "text-danger",
	},
	warning: {
		Icon: AlertTriangle,
		borderClass: "border-l-premium",
		iconClass: "text-premium",
	},
	info: {
		Icon: Info,
		borderClass: "border-l-primary",
		iconClass: "text-primary",
	},
};

// ── Individual Toast Item ─────────────────────────────────────────────────────

function ToastItem({ toast }: { toast: Toast }) {
	const { removeToast } = useToastStore();
	const [isVisible, setIsVisible] = useState(false);
	const [isLeaving, setIsLeaving] = useState(false);

	const { Icon, borderClass, iconClass } = TYPE_CONFIG[toast.type];

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
				"flex items-start gap-3 w-72",
				"bg-surface border border-content/10 border-l-4",
				borderClass,
				"rounded-lg shadow-lg px-4 py-3",
				"transition-all duration-300 ease-out",
				shown ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8",
			].join(" ")}
		>
			<Icon size={17} className={`${iconClass} shrink-0 mt-0.5`} />
			<p className="flex-1 text-sm text-content leading-snug wrap-break-word">
				{toast.message}
			</p>
			<button
				type="button"
				onClick={dismiss}
				aria-label="Tutup notifikasi"
				className="shrink-0 p-0.5 rounded hover:bg-content/10 transition-colors cursor-pointer"
			>
				<X size={14} className="text-content-muted" />
			</button>
		</div>
	);
}

// ── Toast Container ───────────────────────────────────────────────────────────

export default function ToastContainer() {
	const { toasts } = useToastStore();

	return (
		<div className="fixed bottom-6 right-6 z-9999 flex flex-col gap-2 pointer-events-none">
			{toasts.map((toast) => (
				<div key={toast.id} className="pointer-events-auto">
					<ToastItem toast={toast} />
				</div>
			))}
		</div>
	);
}
