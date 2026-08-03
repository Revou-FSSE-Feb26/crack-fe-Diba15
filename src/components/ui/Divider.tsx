export default function Divider({
	children,
	className = "",
}: {
	children?: React.ReactNode;
	className?: string;
}) {
	return <div className={`divider my-4 ${className}`}>{children}</div>;
}
