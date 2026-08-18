import { Suspense } from "react";
import { TopUpContent } from "@/components/wallet/TopUpContent";

export default function TopUpPage() {
	return (
		<Suspense
			fallback={
				<div className="p-8 text-center text-sm text-content-muted">
					Memuat halaman top up...
				</div>
			}
		>
			<TopUpContent />
		</Suspense>
	);
}
