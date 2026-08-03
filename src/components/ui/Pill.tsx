"use client";

import Link from "next/link";

interface PillProps {
	children: React.ReactNode;
	className?: string;
	link?: string;
}

export default function Pill({ children, className = "", link }: PillProps) {
	const base = `badge badge-outline badge-primary ${className}`;

	if (link) {
		return (
			<Link href={link} className={`${base} cursor-pointer`}>
				{children}
			</Link>
		);
	}

	return <span className={base}>{children}</span>;
}
