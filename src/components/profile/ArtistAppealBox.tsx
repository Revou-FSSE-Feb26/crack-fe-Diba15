import { Loader2, Send, ShieldAlert } from "lucide-react";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/form/Textarea";
import { useCreateAppeal, useMyAppeals } from "@/hooks/useAppealQueries";
import { useToastStore } from "@/store/ToastStore";
import type { Appeal } from "@/types";

interface ArtistAppealBoxProps {
	userId: string;
	strikeCount: number;
}

export function ArtistAppealBox({ userId, strikeCount }: ArtistAppealBoxProps) {
	const [appealReason, setAppealReason] = useState("");
	const { data: appeals = [], isLoading } = useMyAppeals();
	const createAppealMutation = useCreateAppeal();
	const { addToast } = useToastStore();

	if (strikeCount < 5) return null;

	const userAppeals = appeals.filter(
		(a: Appeal) => (a.artist_id ?? a.artistId) === userId,
	);
	const activeAppeal = userAppeals.find((a: Appeal) => a.status === "pending");
	const rejectedAppeal = userAppeals.find(
		(a: Appeal) => a.status === "rejected",
	);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = appealReason.trim();
		if (trimmed.length < 30) {
			addToast({
				message: "Alasan banding minimal harus 30 karakter.",
				type: "error",
			});
			return;
		}

		try {
			await createAppealMutation.mutateAsync({ reason: trimmed });
			addToast({
				message:
					"Permohonan banding berhasil dikirim. Menunggu tinjauan Admin.",
				type: "success",
			});
			setAppealReason("");
		} catch (error: unknown) {
			const err = error as { response?: { data?: { message?: string } } };
			addToast({
				message:
					err.response?.data?.message || "Gagal mengirim permohonan banding.",
				type: "error",
			});
		}
	};

	const appealCreatedAt = activeAppeal
		? (activeAppeal.createdAt ?? activeAppeal.created_at ?? "")
		: "";

	return (
		<div className="mt-5 rounded-2xl border border-danger/20 bg-danger/5 p-4 sm:p-5 space-y-3">
			<div className="flex items-start gap-3">
				<ShieldAlert className="w-5 h-5 text-danger shrink-0 mt-0.5" />
				<div>
					<h3 className="text-sm font-bold text-danger">
						Akun Ditangguhkan (Blocked)
					</h3>
					<p className="text-xs text-content-muted mt-0.5">
						Akun Anda telah ditangguhkan karena melanggar aturan anti-AI
						TruBrush (Strike Count: {strikeCount}/5).
					</p>
				</div>
			</div>

			{isLoading ? (
				<div className="flex items-center justify-center p-4">
					<Loader2 className="w-5 h-5 text-danger animate-spin" />
				</div>
			) : activeAppeal ? (
				<div className="rounded-xl bg-primary/5 border border-primary/10 p-3.5 text-xs text-primary leading-relaxed">
					<strong>Status Banding: Menunggu Tinjauan Admin</strong>
					<p className="mt-1 text-content-muted">
						Pesan Anda: &ldquo;{activeAppeal.reason}&rdquo;
					</p>
					{appealCreatedAt && (
						<p className="mt-2 text-[10px] text-content-muted">
							Diajukan pada: {new Date(appealCreatedAt).toLocaleString("id-ID")}
						</p>
					)}
				</div>
			) : (
				<div className="space-y-2.5">
					<p className="text-xs text-content-muted">
						Silakan ajukan banding dengan memberikan penjelasan/bukti proses
						manual karya Anda untuk ditinjau oleh Admin.
					</p>
					{rejectedAppeal && (
						<div className="rounded-xl bg-danger/10 p-3 text-xs text-danger">
							<strong>Banding Sebelumnya Ditolak:</strong> Akun Anda tetap
							ditangguhkan. Silakan kirim permohonan banding baru dengan
							penjelasan yang lebih detail.
						</div>
					)}
					<form onSubmit={handleSubmit} className="space-y-2.5">
						<Textarea
							value={appealReason}
							onChange={(e) => setAppealReason(e.target.value)}
							placeholder="Tulis alasan banding Anda di sini (minimal 30 karakter)..."
							rows={3}
							disabled={createAppealMutation.isPending}
						/>
						<Button
							type="submit"
							variant="danger"
							className="w-full text-xs justify-center gap-1.5 py-2.5 cursor-pointer"
							disabled={
								appealReason.trim().length < 30 ||
								createAppealMutation.isPending
							}
						>
							{createAppealMutation.isPending ? (
								<Loader2 className="w-3.5 h-3.5 animate-spin" />
							) : (
								<Send className="w-3.5 h-3.5" />
							)}
							{createAppealMutation.isPending
								? "Mengirim Permohonan..."
								: "Kirim Permohonan Banding"}
						</Button>
					</form>
				</div>
			)}
		</div>
	);
}
