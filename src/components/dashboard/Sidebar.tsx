"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { getDashboardMenu } from "@/data/dashboardMenu";
import { useUserStore } from "@/store/UserStore";

export default function DashboardSidebar() {
	const pathname = usePathname();
	const router = useRouter();
	const { user, logout } = useUserStore();
	const menu = getDashboardMenu(user?.role);

	const handleLogout = () => {
		logout();
		router.push("/login");
	};

	return (
		<>
			{/* Desktop View: Vertical Sidebar */}
			<aside className="hidden lg:block rounded-2xl border border-content/10 bg-surface p-3">
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

			{/* Mobile View: Horizontal Scrollable Sub-Navbar */}
			<nav className="w-full flex lg:hidden overflow-x-auto gap-2 p-1 scrollbar-none pb-2 select-none border-b border-content/10 mb-2">
				{menu.map((item) => {
					const Icon = item.icon;
					const isActive = pathname === item.href;

					if (!item.enabled) {
						return (
							<button
								key={item.label}
								type="button"
								disabled
								className="flex items-center gap-1.5 rounded-full border border-content/5 bg-content/5 px-4 py-2 text-xs text-content-muted opacity-50 cursor-not-allowed whitespace-nowrap shrink-0"
							>
								<Icon className="h-3.5 w-3.5 shrink-0" />
								<span className="font-medium">{item.label}</span>
							</button>
						);
					}

					return (
						<Link
							key={item.label}
							href={item.href}
							className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
								isActive
									? "bg-primary text-white shadow-sm"
									: "bg-surface border border-content/10 text-content-muted hover:bg-content/5"
							}`}
						>
							<Icon className="h-3.5 w-3.5 shrink-0" />
							<span>{item.label}</span>
						</Link>
					);
				})}

				{/* Mobile Logout Pill */}
				<button
					type="button"
					onClick={handleLogout}
					className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap bg-red-50 dark:bg-red-950/30 text-red-500 hover:bg-red-100 border border-red-200 dark:border-red-900/50 cursor-pointer shrink-0"
				>
					<LogOut className="h-3.5 w-3.5 shrink-0" />
					<span>Logout ({user?.name})</span>
				</button>
			</nav>
		</>
	);
}
