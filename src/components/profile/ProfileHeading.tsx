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
		<div className="flex flex-col gap-2">
			<p className="text-sm font-medium text-primary">{eyebrow}</p>
			<h1 className="font-display text-3xl font-bold text-content">{title}</h1>
			<p className="text-sm text-content-muted max-w-2xl">{description}</p>
		</div>
	);
}
