"use client";

import {
	ChevronDown,
	LayoutDashboard,
	LogIn,
	LogOut,
	PanelLeftOpen,
	PlusCircle,
	Search,
	User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import AvatarInitials from "@/components/home/AvatarInitials";

import NavbarBrand from "@/components/ui/brand/NavbarBrand";
import { useMounted } from "@/hooks/useMounted";
import { useProfileStore } from "@/store/ProfileStore";
import { useUserStore } from "@/store/UserStore";

interface NavbarProps {
	onMenuToggle: () => void;
	onSearchOpen: () => void;
}

export default function Navbar({ onMenuToggle, onSearchOpen }: NavbarProps) {
	const router = useRouter();
	const { isArtist, isClient, isAdmin, isCurator, logout, user } =
		useUserStore();
	const { profiles } = useProfileStore();
	const userProfile = profiles.find((p) => p.user_id === user?.id);
	const avatarUrl = userProfile?.avatar_url;
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const mounted = useMounted();
	const dropdownRef = useRef<HTMLDivElement>(null);

	const roles = {
		artist: "Artist",
		client: "Client",
		admin: "Admin",
		curator: "Curator",
	};

	const userRole = roles[user?.role as keyof typeof roles];

	// Close Dropdown when click outside
	useEffect(() => {
		const handleClickDropdownOutside = (e: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		};
		if (isDropdownOpen) {
			document.addEventListener("mousedown", handleClickDropdownOutside);
		}
		return () =>
			document.removeEventListener("mousedown", handleClickDropdownOutside);
	}, [isDropdownOpen]);

	const handleLogout = () => {
		logout();
		router.push("/login");
		setIsDropdownOpen(false);
	};

	return (
		<nav className="grid grid-cols-3 items-center py-4 px-8">
			{/* Left: Sidebar toggle + Post Art / Dashboard */}
			<div className="flex gap-2 items-center">
				<button
					type="button"
					onClick={onMenuToggle}
					title="Open sidebar"
					aria-label="Toggle sidebar"
					className="hidden md:inline-flex rounded-full p-2 text-content transition-colors duration-200 hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-700 cursor-pointer shrink-0"
				>
					<PanelLeftOpen className="w-6 h-6 text-primary" />
				</button>

				{mounted && isArtist() && (
					<Link
						href="/post-art"
						className="hidden md:inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-background shadow-sm transition-colors hover:bg-primary-hover"
					>
						<PlusCircle className="h-4 w-4" />
						Post Art
					</Link>
				)}

				{mounted && (isAdmin() || isCurator()) && (
					<Link
						href="/dashboard"
						className="hidden md:inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-background shadow-sm transition-colors hover:bg-primary-hover"
					>
						<LayoutDashboard className="h-4 w-4" />
						Dashboard
					</Link>
				)}
			</div>

			{/* Center: Brand */}
			<div className="flex justify-center text-center">
				<NavbarBrand />
			</div>

			{/* Right: Search + Login dropdown */}
			<div className="flex justify-end items-center gap-3">
				<div className="hidden md:flex items-center">
					<button
						type="button"
						onClick={onSearchOpen}
						title="Open search"
						aria-label="Open search"
						className="rounded-full p-2 text-content transition-colors duration-200 hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-700 cursor-pointer shrink-0"
					>
						<Search className="w-5 h-5 text-primary" />
					</button>
				</div>

				<div className="flex justify-end items-center gap-3">
					{mounted && (isArtist() || isClient() || isAdmin() || isCurator()) ? (
						<div className="hidden md:flex">
							<div className="relative" ref={dropdownRef}>
								<button
									type="button"
									onClick={() => setIsDropdownOpen((prev) => !prev)}
									className="flex items-center gap-2 rounded-full px-3 py-2 text-content transition-colors duration-200 hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-700 cursor-pointer"
								>
									<AvatarInitials
										className="w-9 h-9"
										name={user?.name || ""}
										src={avatarUrl}
									/>
									<div className="flex flex-col items-start gap-0">
										<span className="text-sm font-medium text-primary">
											{user?.name}
										</span>
										<span className={`text-xs font-medium text-warm`}>
											{userRole}
										</span>
									</div>
									<span className="text-sm font-medium text-primary">
										<ChevronDown
											className={`h-5 w-5 transition-all duration-200 group-hover:text-primary ${isDropdownOpen ? "rotate-180" : ""}`}
										/>
									</span>
								</button>

								{isDropdownOpen && (
									<div className="absolute right-0 mt-2 w-40 rounded-xl bg-background shadow-lg border border-slate-100 dark:border-slate-700 z-50 overflow-hidden flex flex-col">
										<Link
											href="/profile"
											onClick={() => setIsDropdownOpen(false)}
											className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-content hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 cursor-pointer"
										>
											<User className="w-5 h-5 text-content-muted" />
											<span className="text-sm font-medium">Profil Saya</span>
										</Link>
										<div className="border-t border-slate-100 dark:border-slate-800" />
										<button
											type="button"
											onClick={handleLogout}
											className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-b-xl transition-colors duration-200 cursor-pointer"
										>
											<LogOut className="w-5 h-5" />
											<span className="text-sm font-medium">Logout</span>
										</button>
									</div>
								)}
							</div>
						</div>
					) : (
						<Link
							href="/login"
							title="Login Button"
							className="hidden md:flex rounded-full p-2 text-content transition-colors duration-200 hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-700 cursor-pointer"
						>
							<LogIn className="w-6 h-6 text-primary" />
						</Link>
					)}
				</div>
			</div>
		</nav>
	);
}
