import type { Commission, CommissionProgress } from "@/types";

interface CommissionMilestonesProps {
	commission: Commission;
	progressItem: CommissionProgress | null;
}

export default function CommissionMilestones({
	commission,
	progressItem,
}: CommissionMilestonesProps) {
	return (
		<div className="p-4 bg-content/5 rounded-xl border border-content/10 space-y-3">
			<h3 className="text-xs font-bold uppercase tracking-wider text-content-muted">
				Alur Progres Komisi
			</h3>
			<div className="grid grid-cols-1 sm:grid-cols-5 gap-1.5 text-xs">
				<div
					className={`p-2 rounded-lg border text-center ${
						commission.status === "pending"
							? "bg-primary/10 border-primary text-primary font-semibold"
							: "bg-surface border-content/10 text-content-muted"
					}`}
				>
					1. Diajukan
				</div>
				<div
					className={`p-2 rounded-lg border text-center ${
						["accepted", "revision"].includes(commission.status) &&
						commission.payment_status === "unpaid"
							? "bg-primary/10 border-primary text-primary font-semibold"
							: "bg-surface border-content/10 text-content-muted"
					}`}
				>
					2. Diterima Artis
				</div>
				<div
					className={`p-2 rounded-lg border text-center ${
						commission.payment_status === "paid" &&
						commission.status !== "completed" &&
						commission.status !== "cancelled"
							? "bg-primary/10 border-primary text-primary font-semibold"
							: "bg-surface border-content/10 text-content-muted"
					}`}
				>
					3. Dibayar (Escrow)
				</div>
				<div
					className={`p-2 rounded-lg border text-center ${
						progressItem?.final_artwork_url &&
						commission.status !== "completed" &&
						commission.status !== "cancelled"
							? "bg-primary/10 border-primary text-primary font-semibold"
							: "bg-surface border-content/10 text-content-muted"
					}`}
				>
					4. Review Hasil
				</div>
				<div
					className={`p-2 rounded-lg border text-center ${
						commission.status === "completed"
							? "bg-success/10 border-success text-success font-semibold"
							: commission.status === "cancelled"
								? "bg-danger/10 border-danger text-danger font-semibold"
								: "bg-surface border-content/10 text-content-muted"
					}`}
				>
					{commission.status === "cancelled" ? "5. Dibatalkan" : "5. Selesai"}
				</div>
			</div>
		</div>
	);
}
