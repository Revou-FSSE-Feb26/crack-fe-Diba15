interface SummaryRowProps {
	label: string;
	children: React.ReactNode;
}

export default function SummaryRow({ label, children }: SummaryRowProps) {
	return (
		<div className="flex items-center justify-between gap-3 text-sm text-content-muted">
			<span>{label}</span>
			<span className="font-medium text-content text-right">{children}</span>
		</div>
	);
}
