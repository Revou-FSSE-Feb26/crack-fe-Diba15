export default function Select({
	label = "",
	children,
	className = "",
	...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
	className?: string;
	label?: string;
	children?: React.ReactNode;
}) {
	const selectClass = "select select-bordered w-full";

	return (
		<div>
			{label && (
				<label
					htmlFor={props.id}
					className="block text-sm font-semibold mb-1.5 text-content"
				>
					{label}
				</label>
			)}
			<select {...props} className={`${selectClass} ${className}`}>
				{children}
			</select>
		</div>
	);
}
