import { formatPrice } from "@/utils";

interface AmountPresetSelectorProps {
	amounts?: number[];
	selectedAmount: number;
	onSelect: (amount: number) => void;
	disabled?: boolean;
}

const DEFAULT_AMOUNTS = [50000, 100000, 250000, 500000, 1000000, 2000000];

export default function AmountPresetSelector({
	amounts = DEFAULT_AMOUNTS,
	selectedAmount,
	onSelect,
	disabled = false,
}: AmountPresetSelectorProps) {
	return (
		<div className="grid grid-cols-3 gap-2">
			{amounts.map((preset) => (
				<button
					key={preset}
					type="button"
					disabled={disabled}
					onClick={() => onSelect(preset)}
					className={`rounded-xl border py-2.5 px-3 text-xs font-semibold transition-all ${
						selectedAmount === preset
							? "border-primary bg-primary/10 text-primary shadow-sm ring-1 ring-primary"
							: "border-border bg-surface text-content-muted hover:border-primary/40 hover:text-content hover:bg-muted/30"
					}`}
				>
					{formatPrice(preset)}
				</button>
			))}
		</div>
	);
}
