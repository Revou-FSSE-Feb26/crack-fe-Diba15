import { Send, ShieldAlert } from "lucide-react";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/form/Textarea";
import { useAppealStore } from "@/store/AppealStore";
import { useToastStore } from "@/store/ToastStore";

interface ArtistAppealBoxProps {
	userId: string;
	strikeCount: number;
}

export function ArtistAppealBox({ userId, strikeCount }: ArtistAppealBoxProps) {
	const [appealReason, setAppealReason] = useState("");
	const { appeals, createAppeal } = useAppealStore();
	const { addToast } = useToastStore();

	if (strikeCount < 5) return null;

	const userAppeals = appeals.filter((a) => a.artist_id === userId);
	const activeAppeal = userAppeals.find((a) => a.status === "pending");
	const rejectedAppeal = userAppeals.find((a) => a.status === "rejected");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const res = createAppeal(userId, appealReason);
		addToast({
			message: res.message,
			type: res.success ? "success" : "error",
		});
		if (res.success) setAppealReason("");
	};

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

			{activeAppeal ? (
				<div className="rounded-xl bg-primary/5 border border-primary/10 p-3.5 text-xs text-primary leading-relaxed">
					<strong>Status Banding: Menunggu Tinjauan Admin</strong>
					<p className="mt-1 text-content-muted">
						Pesan Anda: &ldquo;{activeAppeal.reason}&rdquo;
					</p>
					<p className="mt-2 text-[10px] text-content-muted">
						Diajukan pada:{" "}
						{new Date(activeAppeal.created_at).toLocaleString("id-ID")}
					</p>
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
						/>
						<Button
							type="submit"
							variant="danger"
							className="w-full text-xs justify-center gap-1.5 py-2.5 cursor-pointer"
							disabled={appealReason.trim().length < 30}
						>
							<Send className="w-3.5 h-3.5" />
							Kirim Permohonan Banding
						</Button>
					</form>
				</div>
			)}
		</div>
	);
}
