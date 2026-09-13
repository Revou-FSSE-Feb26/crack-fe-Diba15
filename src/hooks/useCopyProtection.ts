"use client";

import { useEffect, useRef, useState } from "react";
import { useToastStore } from "@/store/ToastStore";

export interface CopyProtectionOptions {
	/**
	 * Mode proteksi:
	 * - "strict": Proteksi ketat untuk komisi/escrow WIP dan detail (aktifkan persistent warning curtain, printscreen interceptor, dsb).
	 * - "notice": Proteksi edukatif untuk feed (hanya toast peringatan hak cipta saat klik kanan atau screenshot, tanpa tirai blur).
	 * Default: "strict".
	 */
	mode?: "strict" | "notice";

	/**
	 * Apakah proteksi F12 dan shortcut inspect element diaktifkan.
	 * Default: false (DevTools diizinkan agar ramah penguji & developer).
	 */
	preventInspect?: boolean;

	/**
	 * Apakah tirai peringatan persisten diaktifkan pada mode strict saat shortcut screenshot atau klik kanan terpicu.
	 * Default: true pada mode "strict", false pada mode "notice".
	 */
	windowBlurDefense?: boolean;

	/**
	 * Apakah klik kanan dinonaktifkan pada halaman.
	 * Default: true.
	 */
	preventRightClick?: boolean;

	/**
	 * Apakah tombol PrintScreen dan shortcut screenshot diintersepsi.
	 * Default: true.
	 */
	preventPrintScreen?: boolean;

	/**
	 * Pesan toast kustom untuk pencegahan klik kanan.
	 */
	rightClickMessage?: string;

	/**
	 * Pesan toast kustom untuk peringatan screenshot.
	 */
	screenshotMessage?: string;
}

let lastToastTimestamp = 0;

export function triggerProtectedToast(
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
 * Hook keamanan terintegrasi TruBrush untuk melindungi karya seni dari screenshot
 * (PrintScreen, shortcut screenshot) dan klik kanan dengan Tirai Peringatan Persisten.
 * Tirai tetap aktif sampai pengguna secara sadar mengklik peringatan ("Klik untuk melanjutkan").
 */
export function useCopyProtection(options: CopyProtectionOptions = {}) {
	const mode = options.mode ?? "strict";
	const isStrict = mode === "strict";

	const {
		preventInspect = false,
		windowBlurDefense = isStrict,
		preventRightClick = true,
		preventPrintScreen = true,
		rightClickMessage = "Aksi Dibatasi: Klik kanan pada karya dinonaktifkan untuk melindungi hak cipta artis TruBrush.",
		screenshotMessage = "Dilarang mengambil tangkapan layar, menyimpan, atau mendistribusikan karya tanpa izin artis TruBrush.",
	} = options;

	const [isCurtainActive, setIsCurtainActive] = useState(false);
	const dismissCooldownRef = useRef(0);
	const { addToast } = useToastStore();

	const dismissCurtain = () => {
		dismissCooldownRef.current = Date.now();
		setIsCurtainActive(false);
	};

	const triggerCurtain = () => {
		setIsCurtainActive(true);
	};

	useEffect(() => {
		// 1. ─── Focus Loss Defense (Aktifkan Tirai Persisten saat Kehilangan Fokus) ───
		const handleBlur = (e: Event) => {
			// Cegah pengaktifan ulang jika baru saja di-dismiss (cooldown 1 detik)
			if (Date.now() - dismissCooldownRef.current < 1000) {
				return;
			}
			// Abaikan event blur dari elemen DOM internal (hanya window blur yang direspons)
			if (e.target && e.target !== window) {
				return;
			}
			if (windowBlurDefense) {
				setIsCurtainActive(true);
			}
		};

		const handlePageHide = () => {
			if (Date.now() - dismissCooldownRef.current < 1000) {
				return;
			}
			if (windowBlurDefense) {
				setIsCurtainActive(true);
			}
		};

		const handleVisibilityChange = () => {
			if (Date.now() - dismissCooldownRef.current < 1000) {
				return;
			}
			if (windowBlurDefense && document.hidden) {
				setIsCurtainActive(true);
			}
		};

		let poller: ReturnType<typeof setInterval> | null = null;

		if (windowBlurDefense) {
			window.addEventListener("blur", handleBlur, false);
			window.addEventListener("pagehide", handlePageHide, false);
			document.addEventListener(
				"visibilitychange",
				handleVisibilityChange,
				false,
			);

			// Deteksi transisi dari fokus ke non-fokus (misal saat Snipping Tool muncul)
			let wasFocused =
				typeof document !== "undefined" && document.hasFocus
					? document.hasFocus()
					: true;
			poller = setInterval(() => {
				if (typeof document === "undefined") return;
				if (Date.now() - dismissCooldownRef.current < 1000) {
					wasFocused = document.hasFocus() && !document.hidden;
					return;
				}
				const hasFocus = document.hasFocus ? document.hasFocus() : true;
				const isHidden = document.hidden;
				if (wasFocused && (!hasFocus || isHidden)) {
					setIsCurtainActive(true);
				}
				wasFocused = hasFocus && !isHidden;
			}, 200);
		}

		// 2. ─── Keyboard Interceptor (Screenshot Shortcuts & Inspect) ───────
		const handleKeyDown = (e: KeyboardEvent) => {
			// F12 Blocker (hanya jika preventInspect diaktifkan secara eksplisit)
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

			// 📸 Deteksi Shortcut Screenshot:
			// PrintScreen atau shortcut kombo (Cmd/Ctrl + Shift, Win+Shift+S)
			const isComboScreenshot =
				(e.metaKey || e.ctrlKey) &&
				(e.shiftKey || e.key === "S" || e.key === "s");
			const isPrintScreen = e.key === "PrintScreen" || e.keyCode === 44;

			if (preventPrintScreen && (isPrintScreen || isComboScreenshot)) {
				if (windowBlurDefense) {
					setIsCurtainActive(true);
					if (navigator.clipboard?.writeText) {
						navigator.clipboard.writeText("").catch(() => {});
					}
				}
				triggerProtectedToast(screenshotMessage, addToast);
			}
		};

		// 3. ─── PrintScreen Keyup (Bersihkan clipboard, tirai tetap aktif sampai user dismiss) ──
		const handleKeyUp = (e: KeyboardEvent) => {
			if (
				preventPrintScreen &&
				(e.code === "PrintScreen" || e.keyCode === 44)
			) {
				if (windowBlurDefense) {
					if (navigator.clipboard?.writeText) {
						navigator.clipboard.writeText("").catch(() => {});
					}
				}
			}
		};

		// 4. ─── Right Click (Context Menu) Interceptor ──────────────────────
		const handleContextMenu = (e: MouseEvent) => {
			if (preventRightClick) {
				e.preventDefault();
				if (windowBlurDefense) {
					setIsCurtainActive(true);
				}
				triggerProtectedToast(rightClickMessage, addToast);
				return false;
			}
		};

		window.addEventListener("keydown", handleKeyDown, true);
		window.addEventListener("keyup", handleKeyUp, true);
		if (preventRightClick) {
			window.addEventListener("contextmenu", handleContextMenu);
		}

		return () => {
			if (poller) {
				clearInterval(poller);
			}
			if (windowBlurDefense) {
				window.removeEventListener("blur", handleBlur, false);
				window.removeEventListener("pagehide", handlePageHide, false);
				document.removeEventListener(
					"visibilitychange",
					handleVisibilityChange,
					false,
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
		rightClickMessage,
		screenshotMessage,
		addToast,
	]);

	return {
		isCurtainActive,
		// Alias isWindowBlurred untuk kompatibilitas mundur
		isWindowBlurred: isCurtainActive,
		dismissCurtain,
		triggerCurtain,
		setIsCurtainActive,
	};
}
