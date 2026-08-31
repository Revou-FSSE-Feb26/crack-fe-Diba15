interface ProfileHeadingProps {
	eyebrow: string;
	title: string;
	description: string;
}

export default function ProfileHeading({
	eyebrow,
	title,
	description,
}: ProfileHeadingProps) {
	return (
		<div className="flex flex-col gap-1.5 sm:gap-2 w-full">
			<p className="text-xs sm:text-sm font-medium text-primary">{eyebrow}</p>
			<h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-content">
				{title}
			</h1>
			<p className="text-xs sm:text-sm text-content-muted w-full leading-relaxed">
				{description}
			</p>
		</div>
	);
}
