export default function Textarea({
	label = "",
	placeholder = "",
	rows = 3,
	className = "",
	...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
	className?: string;
	label?: string;
	placeholder?: string;
}) {
	const textareaClass = "textarea textarea-bordered w-full";

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
			<textarea
				{...props}
				rows={rows}
				placeholder={placeholder}
				className={`${textareaClass} ${className}`}
			/>
		</div>
	);
}
