// src/hooks/useCopyLink.ts
"use client";

import { useCallback, useState } from "react";
import { useToastStore } from "@/store/ToastStore";

interface UseCopyLinkOptions {
	/** Pesan sukses custom, default: "Tautan berhasil disalin." */
	successMessage?: string;
	/** Pesan gagal custom, default: "Gagal menyalin tautan." */
	errorMessage?: string;
	/** Durasi status `copied` sebelum balik ke false (ms) */
	resetAfter?: number;
}

interface UseCopyLinkReturn {
	/** true sesaat setelah copy berhasil, berguna untuk ganti icon/label tombol */
	copied: boolean;
	/** Salin path relatif (mis. "/detail/a-001") — otomatis digabung dengan origin saat ini */
	copyPath: (path: string) => Promise<void>;
	/** Salin URL absolut apa adanya */
	copyUrl: (url: string) => Promise<void>;
}

/**
 * Hook untuk menyalin link ke clipboard dengan feedback toast otomatis.
 * Pakai `copyPath` untuk path internal (mis. dari ArtworkCard/Detail),
 * atau `copyUrl` kalau sudah punya URL absolut.
 */
export function useCopyLink(
	options: UseCopyLinkOptions = {},
): UseCopyLinkReturn {
	const {
		successMessage = "Tautan berhasil disalin.",
		errorMessage = "Gagal menyalin tautan. Coba salin manual dari address bar.",
		resetAfter = 2000,
	} = options;

	const { addToast } = useToastStore();
	const [copied, setCopied] = useState(false);

	const writeToClipboard = useCallback(async (text: string) => {
		if (navigator.clipboard && window.isSecureContext) {
			await navigator.clipboard.writeText(text);
			return;
		}

		// Fallback untuk browser/context lama yang tidak support Clipboard API
		const textarea = document.createElement("textarea");
		textarea.value = text;
		textarea.style.position = "fixed";
		textarea.style.opacity = "0";
		document.body.appendChild(textarea);
		textarea.focus();
		textarea.select();

		try {
			const successful = document.execCommand("copy");
			if (!successful) throw new Error("execCommand copy failed");
		} finally {
			document.body.removeChild(textarea);
		}
	}, []);

	const copyUrl = useCallback(
		async (url: string) => {
			try {
				await writeToClipboard(url);
				setCopied(true);
				addToast({ message: successMessage, type: "success" });
				setTimeout(() => setCopied(false), resetAfter);
			} catch {
				addToast({ message: errorMessage, type: "error" });
			}
		},
		[writeToClipboard, addToast, successMessage, errorMessage, resetAfter],
	);

	const copyPath = useCallback(
		async (path: string) => {
			const url = `${window.location.origin}${path}`;
			await copyUrl(url);
		},
		[copyUrl],
	);

	return { copied, copyPath, copyUrl };
}
