export default function Input({
	label = "",
	placeholder = "",
	type = "text",
	children,
	className = "",
	...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
	className?: string;
	label?: string;
	placeholder?: string;
} & { children?: React.ReactNode }) {
	const paddingClass = children ? "pl-10 pr-4" : "px-4";
	const inputClass = `input input-bordered w-full ${paddingClass}`;

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
			<div className="relative">
				{children && (
					<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10 text-content-muted">
						{children}
					</div>
				)}
				<input
					{...props}
					type={type}
					placeholder={placeholder}
					className={`${inputClass} ${className}`}
				/>
			</div>
		</div>
	);
}
