"use client";

import { Home, LayoutDashboard, Menu, PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useMounted } from "@/hooks/useMounted";
import { useUserStore } from "@/store/UserStore";

interface BottomNavProps {
	onSearchOpen: () => void;
	onMenuToggle: () => void;
}

export default function BottomNav({
	onSearchOpen,
	onMenuToggle,
}: BottomNavProps) {
	const pathname = usePathname();
	const mounted = useMounted();
	const { isAuthenticated, isArtist, isAdmin, isCurator } = useUserStore();

	const isHomeActive = pathname === "/";
	const isPostActive = pathname === "/post-art";
	const isDashboardActive = pathname.startsWith("/dashboard");

	if (!mounted) return null;

	return (
		<nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around bg-surface border-t border-content/10 py-2 px-4 shadow-lg select-none pb-safe">
			{/* Home */}
			<Link
				href="/"
				className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
					isHomeActive
						? "text-primary font-semibold"
						: "text-content-muted hover:text-content"
				}`}
			>
				<Home className="h-5 w-5" />
				<span>Beranda</span>
			</Link>

			{/* Search */}
			<button
				type="button"
				onClick={onSearchOpen}
				className="flex flex-col items-center gap-1 text-[10px] font-medium text-content-muted hover:text-content cursor-pointer"
			>
				<Search className="h-5 w-5" />
				<span>Cari</span>
			</button>

			{/* Center Quick Action (Post Art or Dashboard if authenticated) */}
			{isAuthenticated && isArtist() && (
				<Link
					href="/post-art"
					className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
						isPostActive
							? "text-primary font-semibold"
							: "text-content-muted hover:text-content"
					}`}
				>
					<PlusCircle className="h-5 w-5" />
					<span>Post Art</span>
				</Link>
			)}

			{isAuthenticated && (isAdmin() || isCurator()) && (
				<Link
					href="/dashboard"
					className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
						isDashboardActive
							? "text-primary font-semibold"
							: "text-content-muted hover:text-content"
					}`}
				>
					<LayoutDashboard className="h-5 w-5" />
					<span>Dashboard</span>
				</Link>
			)}

			{/* Menu (Open Mobile Drawer Sidebar) */}
			<button
				type="button"
				onClick={onMenuToggle}
				className="flex flex-col items-center gap-1 text-[10px] font-medium text-content-muted hover:text-content cursor-pointer"
			>
				<Menu className="h-5 w-5" />
				<span>Menu</span>
			</button>
		</nav>
	);
}
