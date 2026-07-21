"use client";

import type { LucideIcon } from "lucide-react";
import {
	Briefcase,
	ChevronUp,
	Heart,
	Home,
	LayoutDashboard,
	LogIn,
	LogOut,
	Moon,
	PanelLeftClose,
	PlusCircle,
	Sun,
	User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AvatarInitials from "@/components/home/AvatarInitials";
import Brand from "@/components/ui/brand/Brand";
import { useMounted } from "@/hooks/useMounted";
import { useProfileStore } from "@/store/ProfileStore";
import { useThemeStore } from "@/store/ThemeStore";
import { useUserStore } from "@/store/UserStore";

interface SidebarProps {
	onClose: () => void;
}

const menuItems: Array<{ label: string; href: string; icon: LucideIcon }> = [
	{ label: "Beranda", href: "/", icon: Home },
];

const userMenuItems: Array<{ label: string; href: string; icon: LucideIcon }> =
	[
		{ label: "Favorites", href: "/favorite", icon: Heart },
		{ label: "Commissions", href: "/commissions", icon: Briefcase },
	];

export default function Sidebar({ onClose }: SidebarProps) {
	const { theme, toggleTheme } = useThemeStore();
	const mounted = useMounted();
	const router = useRouter();
	const { isAuthenticated, user, logout, isArtist, isAdmin, isCurator } =
		useUserStore();
	const { profiles } = useProfileStore();
	const currentProfile = profiles.find((p) => p.user_id === user?.id);
	const avatarUrl = currentProfile?.avatar_url;
	const [profileMenuOpen, setProfileMenuOpen] = useState(false);

	const roles = {
		artist: "Artist",
		client: "Client",
		admin: "Admin",
		curator: "Curator",
	};
	const userRole = roles[user?.role as keyof typeof roles];

	// Jika isAuth maka satukan menu user dengan menu default
	const postArtMenu =
		mounted && isArtist()
			? [{ label: "Post Art", href: "/post-art", icon: PlusCircle }]
			: [];
	const dashboardMenu =
		mounted && (isAdmin() || isCurator())
			? [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }]
			: [];
	const menu = isAuthenticated
		? [...menuItems, ...postArtMenu, ...dashboardMenu, ...userMenuItems]
		: menuItems;

	const handleLogout = () => {
		logout();
		router.push("/login");
	};

	return (
		<aside className="flex justify-between h-full min-h-screen z-50 w-72 flex-col gap-6 border-r border-slate-200/70 bg-surface p-4 text-content transition-colors duration-300 dark:border-slate-700/60">
			{/* Bagian Atas: Logo & Navigasi */}
			<div>
				<div className="mb-6 flex items-center justify-between gap-2">
					<Brand onClick={onClose} />
					<button
						type="button"
						onClick={onClose}
						title="Close sidebar"
						aria-label="Close sidebar"
						className="rounded-full p-2 text-content transition-colors duration-200 hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-700 cursor-pointer"
					>
						<PanelLeftClose className="h-6 w-6 text-primary" />
					</button>
				</div>

				<nav className="space-y-2">
					{menu.map((item) => {
						const Icon = item.icon;
						return (
							<Link
								key={item.label}
								href={item.href}
								onClick={onClose}
								className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium text-content transition-all duration-200 hover:bg-primary/10 hover:text-primary"
							>
								<Icon className="h-5 w-5 transition-colors duration-200 group-hover:text-primary" />
								{item.label}
							</Link>
						);
					})}
				</nav>
			</div>

			{/* Bagian Bawah: Toggle Tema & Footer */}
			<div className="flex flex-col">
				{/* Login button — hanya tampil di mobile */}
				{!isAuthenticated ? (
					<Link
						href="/login"
						onClick={onClose}
						className="group md:hidden mb-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium text-content transition-all duration-200 hover:bg-primary/10 hover:text-primary"
					>
						<LogIn className="h-5 w-5 transition-colors duration-200 group-hover:text-primary" />
						Login
					</Link>
				) : (
					<div className="group md:hidden mb-2 flex items-center gap-3">
						<div className="relative w-full">
							<button
								type="button"
								onClick={() => setProfileMenuOpen((prev) => !prev)}
								className="w-full flex items-center justify-between gap-3 rounded-full border border-slate-200/70 dark:border-slate-700/60 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
							>
								<div className="flex items-center gap-2">
									<AvatarInitials
										className="w-8 h-8 shrink-0"
										name={user?.name || ""}
										src={avatarUrl}
									/>
									<div className="flex flex-col items-start gap-0 text-left">
										<span className="text-sm font-medium text-primary">
											{user?.name}
										</span>
										<span className={`text-[10px] font-medium text-warm`}>
											{userRole}
										</span>
									</div>
								</div>
								<ChevronUp
									className={`h-5 w-5 transition-all duration-200 group-hover:text-primary ${profileMenuOpen ? "rotate-180" : ""}`}
								/>
							</button>

							{profileMenuOpen && (
								<div className="absolute bottom-full left-0 mb-2 w-full rounded-xl bg-white dark:bg-[#1D2D37] shadow-lg border border-slate-100 dark:border-slate-700 z-50 overflow-hidden flex flex-col">
									<Link
										href="/profile"
										onClick={() => {
											setProfileMenuOpen(false);
											onClose();
										}}
										className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-content hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 cursor-pointer"
									>
										<User className="h-5 w-5 text-content-muted" />
										<span className="font-semibold">Profil Saya</span>
									</Link>
									<div className="border-t border-slate-100 dark:border-slate-800" />
									<button
										type="button"
										onClick={() => {
											handleLogout();
											onClose();
										}}
										className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 cursor-pointer"
									>
										<LogOut className="h-5 w-5" />
										<span className="font-semibold">Logout</span>
									</button>
								</div>
							)}
						</div>
					</div>
				)}

				{mounted && (
					<button
						type="button"
						onClick={toggleTheme}
						className="group mb-4 flex w-full items-center justify-between rounded-2xl px-4 py-3 text-base font-medium text-content transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800"
					>
						<div className="flex items-center gap-3">
							{theme === "dark" ? (
								<Moon className="h-5 w-5 text-content transition-colors group-hover:text-primary" />
							) : (
								<Sun className="h-5 w-5 text-content transition-colors group-hover:text-primary" />
							)}
							<span className="transition-colors group-hover:text-primary">
								{theme === "dark" ? "Dark Mode" : "Light Mode"}
							</span>
						</div>
						{/* Indikator Switch Mini */}
						<div className="relative inline-flex h-5 w-9 items-center rounded-full bg-slate-300 transition-colors dark:bg-slate-600">
							<span
								className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 ${
									theme === "dark" ? "translate-x-4.5" : "translate-x-1"
								}`}
							/>
						</div>
					</button>
				)}

				<footer className="border-t border-slate-200/70 pt-4 text-sm text-content-muted dark:border-slate-700/60">
					<div className="mb-3 flex flex-wrap gap-2 text-xs max-w-50">
						<Link
							href="/help"
							onClick={onClose}
							className="transition-colors hover:text-primary"
						>
							Help
						</Link>
						<Link
							href="/privacy"
							onClick={onClose}
							className="transition-colors hover:text-primary"
						>
							Privacy
						</Link>
						<Link
							href="/about"
							onClick={onClose}
							className="transition-colors hover:text-primary"
						>
							About TruBrush
						</Link>
						<Link
							href="/careers"
							onClick={onClose}
							className="transition-colors hover:text-primary"
						>
							Careers
						</Link>
					</div>
					<p className="font-syne">© TruBrush</p>
				</footer>
			</div>
		</aside>
	);
}
