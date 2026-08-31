export default function Button({
	children,
	className = "",
	variant = "primary",
	disabled,
	...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: "primary" | "secondary" | "danger";
}) {
	const variantClass =
		variant === "danger"
			? "btn-error"
			: variant === "secondary"
				? "btn-secondary"
				: "btn-primary";

	return (
		<button
			{...props}
			disabled={disabled}
			className={`btn ${variantClass} ${className}`}
		>
			{children}
		</button>
	);
}
