"use client";

import { useEffect, useState } from "react";
import { useToastStore } from "@/store/ToastStore";

interface CopyProtectionOptions {
	/**
	 * Apakah proteksi F12 dan shortcut inspect element diaktifkan.
	 * Default membaca dari NEXT_PUBLIC_DISABLE_DEVTOOLS ("true") atau production environment.
	 */
	preventInspect?: boolean;

	/**
	 * Apakah Window Blur Defense (Anti-Screenshot saat ganti jendela / Snipping Tool) diaktifkan.
	 * Default: true.
	 */
	windowBlurDefense?: boolean;

	/**
	 * Apakah klik kanan dinonaktifkan pada halaman.
	 * Default: true.
	 */
	preventRightClick?: boolean;

	/**
	 * Apakah tombol PrintScreen diintersepsi dan clipboard dibersihkan.
	 * Default: true.
	 */
	preventPrintScreen?: boolean;
}

let lastToastTimestamp = 0;

function triggerProtectedToast(
	message: string,
	addToast: (toast: { message: string; type: "error" }) => void,
) {
	const now = Date.now();
	if (now - lastToastTimestamp > 1500) {
		lastToastTimestamp = now;
		addToast({
			message,
			type: "error",
		});
	}
}

/**
 * 🛡️ useCopyProtection
 * Hook keamanan terintegrasi TruBrush untuk melindungi karya seni dari screenshot liar,
 * inspect element (F12), klik kanan, dan pencurian clipboard.
 */
export function useCopyProtection(options: CopyProtectionOptions = {}) {
	const {
		preventInspect = process.env.NEXT_PUBLIC_DISABLE_DEVTOOLS === "true" ||
			process.env.NODE_ENV === "production",
		windowBlurDefense = true,
		preventRightClick = true,
		preventPrintScreen = true,
	} = options;

	const [isWindowBlurred, setIsWindowBlurred] = useState(false);
	const { addToast } = useToastStore();

	useEffect(() => {
		// 1. ─── Window Blur Defense (Anti-Screenshot / Snipping Tool) ───────
		const handleBlur = () => {
			if (windowBlurDefense) {
				setIsWindowBlurred(true);
			}
		};

		const handleFocus = () => {
			if (windowBlurDefense) {
				setIsWindowBlurred(false);
			}
		};

		const handleVisibilityChange = () => {
			if (windowBlurDefense) {
				setIsWindowBlurred(document.hidden);
			}
		};

		if (windowBlurDefense) {
			window.addEventListener("blur", handleBlur);
			window.addEventListener("focus", handleFocus);
			document.addEventListener("visibilitychange", handleVisibilityChange);
		}

		// 2. ─── Keyboard Interceptor (F12, Inspect, Shortcuts) ───────────────
		const handleKeyDown = (e: KeyboardEvent) => {
			// F12 Blocker
			if (preventInspect && (e.key === "F12" || e.keyCode === 123)) {
				e.preventDefault();
				e.stopPropagation();
				triggerProtectedToast(
					"Pemeriksa elemen (F12) dinonaktifkan untuk melindungi hak cipta karya.",
					addToast,
				);
				return false;
			}

			// Ctrl+Shift+I / J / C (DevTools Windows/Linux) atau Cmd+Opt+I / J / C (Mac)
			const isInspectCombo =
				(e.ctrlKey || e.metaKey) &&
				(e.shiftKey || e.altKey) &&
				["I", "i", "J", "j", "C", "c"].includes(e.key);

			if (preventInspect && isInspectCombo) {
				e.preventDefault();
				e.stopPropagation();
				triggerProtectedToast(
					"Shortcut inspect element dinonaktifkan untuk keamanan aset artis.",
					addToast,
				);
				return false;
			}

			// Ctrl+U (View Source)
			if (
				preventInspect &&
				(e.ctrlKey || e.metaKey) &&
				["u", "U"].includes(e.key)
			) {
				e.preventDefault();
				e.stopPropagation();
				return false;
			}

			// Ctrl+S (Save Page) & Ctrl+P (Print Page)
			if ((e.ctrlKey || e.metaKey) && ["s", "S", "p", "P"].includes(e.key)) {
				e.preventDefault();
				e.stopPropagation();
				return false;
			}

			// PrintScreen Keydown
			if (preventPrintScreen && (e.key === "PrintScreen" || e.keyCode === 44)) {
				setIsWindowBlurred(true);
				if (navigator.clipboard?.writeText) {
					navigator.clipboard.writeText("").catch(() => {});
				}
			}
		};

		// 3. ─── PrintScreen Keyup (Clear Clipboard) ─────────────────────────
		const handleKeyUp = (e: KeyboardEvent) => {
			if (preventPrintScreen && (e.key === "PrintScreen" || e.keyCode === 44)) {
				if (navigator.clipboard?.writeText) {
					navigator.clipboard.writeText("").catch(() => {});
				}
				triggerProtectedToast(
					"Tangkapan layar dinonaktifkan pada pratinjau terproteksi ini.",
					addToast,
				);
				setTimeout(() => {
					setIsWindowBlurred(false);
				}, 1000);
			}
		};

		// 4. ─── Right Click (Context Menu) Interceptor ──────────────────────
		const handleContextMenu = (e: MouseEvent) => {
			if (preventRightClick) {
				e.preventDefault();
				return false;
			}
		};

		window.addEventListener("keydown", handleKeyDown, true);
		window.addEventListener("keyup", handleKeyUp, true);
		if (preventRightClick) {
			window.addEventListener("contextmenu", handleContextMenu);
		}

		return () => {
			if (windowBlurDefense) {
				window.removeEventListener("blur", handleBlur);
				window.removeEventListener("focus", handleFocus);
				document.removeEventListener(
					"visibilitychange",
					handleVisibilityChange,
				);
			}
			window.removeEventListener("keydown", handleKeyDown, true);
			window.removeEventListener("keyup", handleKeyUp, true);
			if (preventRightClick) {
				window.removeEventListener("contextmenu", handleContextMenu);
			}
		};
	}, [
		preventInspect,
		windowBlurDefense,
		preventRightClick,
		preventPrintScreen,
		addToast,
	]);

	return {
		isWindowBlurred,
		setIsWindowBlurred,
	};
}
