import { Award } from "lucide-react";
import type { CuratorMetricItem } from "@/types";

interface TopModeratorSpotlightProps {
	topPerformer: CuratorMetricItem | null;
	formatDuration: (minutes: number) => string;
}

export default function TopModeratorSpotlight({
	topPerformer,
	formatDuration,
}: TopModeratorSpotlightProps) {
	if (!topPerformer || topPerformer.total_actions === 0) {
		return null;
	}

	return (
		<div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
			<div className="flex items-center gap-3">
				<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 flex-shrink-0">
					<Award className="h-6 w-6" />
				</div>
				<div>
					<div className="flex items-center gap-1.5">
						<span className="badge badge-xs badge-primary font-bold">
							⭐ Top Moderator
						</span>
						<h3 className="font-bold text-sm text-content">
							{topPerformer.name}
						</h3>
					</div>
					<p className="text-xs text-content-muted mt-0.5">
						Telah menyelesaikan{" "}
						<span className="font-semibold text-content">
							{topPerformer.total_actions} tindakan moderasi
						</span>{" "}
						dengan rata-rata SLA{" "}
						<span className="font-semibold text-primary">
							{formatDuration(topPerformer.avg_response_time_minutes)}
						</span>
						.
					</p>
				</div>
			</div>

			<div className="flex items-center gap-2">
				<div className="text-right hidden sm:block">
					<p className="text-[11px] text-content-muted">Rasio Kelolosan</p>
					<p className="text-sm font-bold text-verified">
						{topPerformer.approval_rate}%
					</p>
				</div>
			</div>
		</div>
	);
}
