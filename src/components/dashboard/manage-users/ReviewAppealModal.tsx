import { createPortal } from "react-dom";
import Button from "@/components/ui/Button";
import type { Appeal } from "@/store/AppealStore";

interface ReviewAppealModalProps {
	appeal: Appeal | null;
	onClose: () => void;
	onResolve: (appealId: string, approved: boolean) => void;
}

export function ReviewAppealModal({
	appeal,
	onClose,
	onResolve,
}: ReviewAppealModalProps) {
	if (!appeal || typeof document === "undefined") return null;

	return createPortal(
		<div className="fixed inset-0 z-9998 flex items-center justify-center p-4">
			<button
				type="button"
				className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm cursor-pointer"
				onClick={onClose}
				aria-label="Tutup"
			/>
			<div className="relative z-10 w-full max-w-md bg-surface rounded-2xl shadow-2xl border border-content/10 p-6 space-y-5">
				<div className="space-y-1">
					<h2 className="text-lg font-bold text-content flex items-center gap-2">
						Tinjau Banding Pemulihan Akun
					</h2>
					<p className="text-sm text-content-muted">
						Artis memohon untuk di-unblock dari sistem.
					</p>
				</div>
				<hr className="border-content/5" />
				<div className="space-y-2">
					<p className="text-xs font-bold text-content-muted uppercase tracking-wider">
						Pesan Penjelasan / Tobat:
					</p>
					<p className="text-sm bg-content/5 p-3 rounded-lg text-content italic leading-relaxed whitespace-pre-wrap">
						&ldquo;{appeal.reason}&rdquo;
					</p>
					<p className="text-[10px] text-content-muted">
						Diajukan pada: {new Date(appeal.created_at).toLocaleString("id-ID")}
					</p>
				</div>
				<div className="flex gap-3">
					<Button
						variant="danger"
						className="flex-1 justify-center py-2"
						onClick={() => onResolve(appeal.id, false)}
					>
						Tolak Banding
					</Button>
					<Button
						className="flex-1 justify-center py-2"
						onClick={() => onResolve(appeal.id, true)}
					>
						Terima &amp; Unblock
					</Button>
				</div>
			</div>
		</div>,
		document.body,
	);
}
