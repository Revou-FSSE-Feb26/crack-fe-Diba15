"use client";

import { ChevronDown, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import Clock from "@/components/dashboard/Clock";
import AvatarInitials from "@/components/home/AvatarInitials";
import NavbarBrand from "@/components/ui/brand/NavbarBrand";
import { useMounted } from "@/hooks/useMounted";
import { useUserStore } from "@/store/UserStore";

export default function Navbar() {
	const router = useRouter();
	const { isAdmin, isCurator, logout, user } = useUserStore();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const mounted = useMounted();
	const dropdownRef = useRef<HTMLDivElement>(null);

	const roles = {
		artist: { name: "Artist", color: "text-warm" },
		client: { name: "Client", color: "text-mint" },
		admin: { name: "Admin", color: "text-premium" },
		curator: { name: "Curator", color: "text-warm" },
	};
	const userRole = roles[user?.role as keyof typeof roles] || {
		name: "",
		color: "",
	};

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
			{/* Left: Clock */}
			<div className="hidden md:flex justify-start text-center">
				<Clock />
			</div>

			{/* Center: Brand */}
			<div className="flex justify-center text-center">
				<NavbarBrand />
			</div>

			{/* Right: Dropdown / Login */}
			<div className="hidden md:flex justify-end items-center gap-3">
				<div className="flex justify-end items-center gap-3">
					{mounted && (isAdmin() || isCurator()) ? (
						<div className="flex">
							<div className="relative" ref={dropdownRef}>
								<button
									type="button"
									onClick={() => setIsDropdownOpen((prev) => !prev)}
									className="flex items-center gap-2 rounded-full px-3 py-2 text-content transition-colors duration-200 hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-700 cursor-pointer"
								>
									<AvatarInitials className="w-9 h-9" name={user?.name || ""} />
									<div className="flex flex-col items-start gap-0 text-left">
										<span className="text-sm font-medium text-primary">
											{user?.name}
										</span>
										<span className={`text-xs font-medium ${userRole.color}`}>
											{userRole.name}
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
										<button
											type="button"
											onClick={handleLogout}
											className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors duration-200 cursor-pointer"
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
							className="rounded-full p-2 text-content transition-colors duration-200 hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-700 cursor-pointer"
						>
							<LogOut className="w-6 h-6 text-primary" />
						</Link>
					)}
				</div>
			</div>
		</nav>
	);
}
