import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type StatVariant = "inline" | "chip" | "card";
export type StatTone = "neutral" | "primary";

interface StatProps {
	icon: LucideIcon;
	label?: string;
	value?: ReactNode;
	children?: ReactNode;
	/** "inline" = teks + ikon tanpa box (bekas StatItem)
	 *  "chip"   = box kecil label di atas value (bekas Meta / CommissionMeta)
	 *  "card"   = kartu besar dashboard (bekas StatCard) */
	variant?: StatVariant;
	/** Warna background untuk variant="chip" */
	tone?: StatTone;
	/** Hanya untuk variant="chip".
	 *  "top"  = ikon sejajar label, value di bawah (bekas Meta)
	 *  "left" = ikon besar di kiri, label+value ditumpuk di kanan (bekas CommissionMeta) */
	iconPlacement?: "top" | "left";
	/** Otomatis ganti underscore jadi spasi & capitalize, mis. "in_progress" -> "In progress" */
	formatUnderscore?: boolean;
	className?: string;
}

function formatValue(value: ReactNode, formatUnderscore?: boolean) {
	if (!formatUnderscore || typeof value !== "string") return value;
	return value.replaceAll("_", " ");
}

export default function Stat({
	icon: Icon,
	label,
	value,
	children,
	variant = "chip",
	tone = "neutral",
	iconPlacement = "top",
	formatUnderscore = false,
	className = "",
}: StatProps) {
	const displayValue = formatValue(value ?? children, formatUnderscore);
	const toneBg = tone === "primary" ? "bg-primary/5" : "bg-content/5";
	const toneIconColor =
		tone === "primary" ? "text-primary" : "text-content-muted";

	if (variant === "card") {
		return (
			<div
				className={`rounded-2xl border border-content/10 bg-surface p-4 ${className}`}
			>
				<div className="flex items-center justify-between gap-3">
					<div>
						{label && (
							<p className="text-xs font-medium text-content-muted">{label}</p>
						)}
						<p className="mt-1 font-display text-2xl font-bold text-content">
							{displayValue}
						</p>
					</div>
					<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
						<Icon className="h-5 w-5" />
					</div>
				</div>
			</div>
		);
	}

	if (variant === "chip") {
		if (iconPlacement === "left") {
			return (
				<div
					className={`flex items-center gap-2 rounded-xl px-3 py-2 ${toneBg} ${className}`}
				>
					<Icon className={`w-4 h-4 shrink-0 ${toneIconColor}`} />
					<div className="min-w-0">
						<p className="text-xs text-content-muted">{label}</p>
						<p className="truncate text-sm font-medium text-content capitalize">
							{displayValue}
						</p>
					</div>
				</div>
			);
		}

		return (
			<div
				className={`rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 ${toneBg} ${className}`}
			>
				<div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-content-muted">
					<Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
					{label}
				</div>
				<p className="mt-1 text-xs sm:text-sm font-medium text-content truncate">
					{displayValue}
				</p>
			</div>
		);
	}

	// variant === "inline"
	return (
		<div
			className={`flex items-center gap-1.5 text-content-muted ${className}`}
		>
			<Icon className="w-4 h-4 text-primary" />
			<span>{displayValue}</span>
		</div>
	);
}
