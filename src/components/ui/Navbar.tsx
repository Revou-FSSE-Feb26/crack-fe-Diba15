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
import { useUserStore } from "@/store/UserStore";

interface NavbarProps {
	onMenuToggle: () => void;
	onSearchOpen: () => void;
}

export default function Navbar({ onMenuToggle, onSearchOpen }: NavbarProps) {
	const router = useRouter();
	const { isArtist, isClient, isAdmin, isCurator, logout, user } =
		useUserStore();
	const avatarUrl = user?.profile?.avatar_url;
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

	const handleLogout = async () => {
		await logout();
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
					className="hidden md:inline-flex rounded-full p-2 text-content transition-colors duration-200 hover:bg-content/5 hover:text-primary cursor-pointer shrink-0"
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
						className="rounded-full p-2 text-content transition-colors duration-200 hover:bg-content/5 hover:text-primary cursor-pointer shrink-0"
					>
						<Search className="w-5 h-5 text-primary" />
					</button>
				</div>

				<div className="flex justify-end items-center gap-3">
					{mounted && (isArtist() || isClient() || isAdmin() || isCurator()) ? (
						<div className="hidden md:flex">
							<div className="dropdown dropdown-end" ref={dropdownRef}>
								<button
									type="button"
									onClick={() => setIsDropdownOpen((prev) => !prev)}
									className="btn btn-ghost hover:bg-content/5 rounded-full flex items-center gap-2 px-3 py-2 text-content cursor-pointer normal-case h-auto min-h-0"
								>
									<AvatarInitials
										className="w-9 h-9"
										name={user?.name || ""}
										src={avatarUrl}
									/>
									<div className="flex flex-col items-start text-left">
										<span className="text-sm font-medium text-primary leading-tight">
											{user?.name}
										</span>
										<span className="text-xs font-medium text-warm leading-tight">
											{userRole}
										</span>
									</div>
									<ChevronDown
										className={`h-4 w-4 transition-transform duration-200 text-primary ${isDropdownOpen ? "rotate-180" : ""}`}
									/>
								</button>

								{isDropdownOpen && (
									<ul className="dropdown-content menu p-2 shadow-lg bg-surface rounded-box w-48 border border-content/10 z-50 mt-2">
										<li>
											<Link
												href="/profile"
												onClick={() => setIsDropdownOpen(false)}
												className="flex items-center gap-2 px-3 py-2 text-sm text-content"
											>
												<User className="w-4 h-4 text-content-muted" />
												<span className="font-medium">Profil Saya</span>
											</Link>
										</li>
										<div className="divider my-1" />
										<li>
											<button
												type="button"
												onClick={handleLogout}
												className="flex items-center gap-2 px-3 py-2 text-sm text-error"
											>
												<LogOut className="w-4 h-4" />
												<span className="font-medium">Logout</span>
											</button>
										</li>
									</ul>
								)}
							</div>
						</div>
					) : (
						<Link
							href="/login"
							title="Login Button"
							className="hidden md:flex rounded-full p-2 text-content transition-colors duration-200 hover:bg-content/5 hover:text-primary cursor-pointer"
						>
							<LogIn className="w-6 h-6 text-primary" />
						</Link>
					)}
				</div>
			</div>
		</nav>
	);
}
