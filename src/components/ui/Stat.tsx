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
				className={`stats shadow bg-surface border border-content/10 w-full overflow-hidden ${className}`}
			>
				<div className="stat p-4 min-w-0">
					<div className="stat-figure text-primary">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
							<Icon className="h-5 w-5" />
						</div>
					</div>
					{label && (
						<div className="stat-title text-xs font-medium text-content-muted whitespace-normal break-words leading-snug">
							{label}
						</div>
					)}
					<div className="stat-value font-display text-2xl font-bold text-content truncate mt-1">
						{displayValue}
					</div>
				</div>
			</div>
		);
	}

	if (variant === "chip") {
		if (iconPlacement === "left") {
			return (
				<div
					className={`flex items-center gap-2 rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 ${toneBg} ${className} min-w-0 flex-1`}
				>
					<Icon
						className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${toneIconColor}`}
					/>
					<div className="min-w-0 flex-1">
						<p className="text-[11px] sm:text-xs text-content-muted">{label}</p>
						<p className="truncate text-xs sm:text-sm font-medium text-content capitalize">
							{displayValue}
						</p>
					</div>
				</div>
			);
		}

		return (
			<div
				className={`rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 ${toneBg} ${className} min-w-0 flex-1`}
			>
				<div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-content-muted">
					<Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
					<span className="truncate">{label}</span>
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
			className={`flex items-center gap-1.5 text-content-muted min-w-0 max-w-full text-xs sm:text-sm ${className}`}
		>
			<Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
			<span className="truncate">{displayValue}</span>
		</div>
	);
}
