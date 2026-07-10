import { Suspense } from "react";

import CommissionProgressContent from "@/components/commission/CommissionProgressContent";

export default function CommissionsPage() {
	return (
		<Suspense
			fallback={
				<div className="max-w-6xl mx-auto px-4 py-8">
					<p className="text-sm text-content-muted">
						Memuat progress commission...
					</p>
				</div>
			}
		>
			<CommissionProgressContent />
		</Suspense>
	);
}
