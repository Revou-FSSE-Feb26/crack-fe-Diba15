export default function SectionLabel({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<p className="text-[11px] font-medium uppercase tracking-widest text-content-muted mb-3">
			{children}
		</p>
	);
}
