"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { getDashboardMenu } from "@/data/dashboardMenu";
import { useUserStore } from "@/store/UserStore";

export default function DashboardSidebar() {
	const pathname = usePathname();
	const { user } = useUserStore();
	const menu = getDashboardMenu(user?.role);

	return (
		<aside className="rounded-2xl border border-content/10 bg-surface p-3">
			<nav className="space-y-2">
				{menu.map((item) => {
					const Icon = item.icon;
					const isActive = pathname === item.href;

					if (!item.enabled) {
						return (
							<button
								key={item.label}
								type="button"
								disabled
								className="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left text-content-muted opacity-70 cursor-not-allowed transition-colors"
							>
								<Icon className="mt-0.5 h-5 w-5 shrink-0" />
								<span>
									<span className="block text-sm font-semibold">
										{item.label}
									</span>
									<span className="block text-xs">{item.description}</span>
								</span>
							</button>
						);
					}

					return (
						<Link
							key={item.label}
							href={item.href}
							className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
								isActive
									? "bg-primary/10 text-primary"
									: "text-content-muted hover:bg-content/5"
							}`}
						>
							<Icon className="mt-0.5 h-5 w-5 shrink-0" />
							<span>
								<span className="block text-sm font-semibold">
									{item.label}
								</span>
								<span className="block text-xs">{item.description}</span>
							</span>
						</Link>
					);
				})}
			</nav>
		</aside>
	);
}
