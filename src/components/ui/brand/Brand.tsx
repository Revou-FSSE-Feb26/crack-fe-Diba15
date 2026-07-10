import Link from "next/link";

export default function Brand() {
	return (
		<Link href="/" className="flex items-center gap-1">
			<div className="flex flex-col">
				<h1 className="text-2xl font-bold font-syne text-primary leading-none tracking-tighter">
					TruBrush
				</h1>
				<span className="text-sm font-light font-syne text-content-muted">
					Make art shine
				</span>
			</div>
		</Link>
	);
}
