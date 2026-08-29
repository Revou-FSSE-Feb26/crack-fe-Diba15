import { Loader2 } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/form/Textarea";
import type { Appeal } from "@/types";

interface ReviewAppealModalProps {
	appeal: Appeal | null;
	isLoading?: boolean;
	onClose: () => void;
	onResolve: (
		appealId: string,
		approved: boolean,
		resolutionNotes?: string,
	) => void;
}

export function ReviewAppealModal({
	appeal,
	isLoading = false,
	onClose,
	onResolve,
}: ReviewAppealModalProps) {
	const [resolutionNotes, setResolutionNotes] = useState("");

	if (!appeal || typeof document === "undefined") return null;

	const createdAtDate =
		appeal.createdAt ?? appeal.created_at ?? new Date().toISOString();

	return createPortal(
		<div className="fixed inset-0 z-9998 flex items-center justify-center p-4">
			<button
				type="button"
				className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm cursor-pointer"
				onClick={onClose}
				aria-label="Tutup"
			/>
			<div className="relative z-10 w-full max-w-md bg-surface rounded-2xl shadow-2xl border border-content/10 p-6 space-y-4">
				<div className="space-y-1">
					<h2 className="text-lg font-bold text-content flex items-center gap-2">
						Tinjau Banding Pemulihan Akun
					</h2>
					<p className="text-xs text-content-muted">
						Artis mengajukan permohonan banding pembatalan sanksi akun.
					</p>
				</div>
				<hr className="border-content/10" />
				<div className="space-y-2">
					<p className="text-xs font-bold text-content-muted uppercase tracking-wider">
						Pesan &amp; Alasan Artis:
					</p>
					<p className="text-xs sm:text-sm bg-content/5 p-3 rounded-xl text-content italic leading-relaxed whitespace-pre-wrap">
						&ldquo;{appeal.reason}&rdquo;
					</p>
					<p className="text-[10px] text-content-muted">
						Diajukan pada: {new Date(createdAtDate).toLocaleString("id-ID")}
					</p>
				</div>

				<div className="space-y-1.5">
					<label
						htmlFor="appeal-notes"
						className="text-xs font-semibold text-content"
					>
						Catatan Resolusi Admin (Opsional):
					</label>
					<Textarea
						id="appeal-notes"
						value={resolutionNotes}
						onChange={(e) => setResolutionNotes(e.target.value)}
						placeholder="Tulis alasan keputusan atau catatan evaluasi bukti..."
						rows={2}
						disabled={isLoading}
					/>
				</div>

				<div className="flex gap-3 pt-2">
					<Button
						variant="danger"
						className="flex-1 justify-center py-2 text-xs cursor-pointer"
						disabled={isLoading}
						onClick={() =>
							onResolve(appeal.id, false, resolutionNotes.trim() || undefined)
						}
					>
						{isLoading ? (
							<Loader2 className="w-3.5 h-3.5 animate-spin" />
						) : (
							"Tolak Banding"
						)}
					</Button>
					<Button
						className="flex-1 justify-center py-2 text-xs cursor-pointer"
						disabled={isLoading}
						onClick={() =>
							onResolve(appeal.id, true, resolutionNotes.trim() || undefined)
						}
					>
						{isLoading ? (
							<Loader2 className="w-3.5 h-3.5 animate-spin" />
						) : (
							"Terima & Unblock"
						)}
					</Button>
				</div>
			</div>
		</div>,
		document.body,
	);
}
