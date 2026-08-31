import { ShieldAlert } from "lucide-react";
import Link from "next/link";

interface AccessDeniedProps {
	title?: string;
	description: string;
	backUrl?: string;
	backLabel?: string;
}

/**
 * Standardized Access Denied UI card for unauthorized dashboard route protection.
 */
export default function AccessDenied({
	title = "Akses Dibatasi",
	description,
	backUrl = "/dashboard",
	backLabel = "Kembali ke Dashboard",
}: AccessDeniedProps) {
	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
			<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10 text-danger">
				<ShieldAlert className="h-8 w-8" />
			</div>
			<h1 className="text-xl font-bold text-content">{title}</h1>
			<p className="max-w-sm text-xs text-content-muted">{description}</p>
			<Link href={backUrl}>
				<button type="button" className="btn btn-primary btn-sm">
					{backLabel}
				</button>
			</Link>
		</div>
	);
}
