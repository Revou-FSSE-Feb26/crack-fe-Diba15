"use client";

import {
	ChevronDown,
	LayoutDashboard,
	LogIn,
	PanelLeftOpen,
	PlusCircle,
	Search,
	Tag,
	User,
	X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import NavbarBrand from "@/components/ui/brand/NavbarBrand";
import { useMounted } from "@/hooks/useMounted";
import { useArtworkStore } from "@/store/ArtworkStore";
import { useUserManagementStore } from "@/store/UserManagementStore";
import { useUserStore } from "@/store/UserStore";

interface NavbarProps {
	onMenuToggle: () => void;
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);
	const searchContainerRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const { isArtist, isClient, isAdmin, isCurator, logout, user } =
		useUserStore();
	const { tags } = useArtworkStore();
	const { users } = useUserManagementStore();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const mounted = useMounted();
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Debouncing search query input (500ms = 0.5 detik)
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedSearchQuery(searchQuery);
		}, 500);

		return () => {
			clearTimeout(handler);
		};
	}, [searchQuery]);

	const artists = users.filter((u) => u.role === "artist");

	const matchingTags = debouncedSearchQuery.trim()
		? tags
				.filter((t) =>
					t.tag_name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
				)
				.slice(0, 3)
		: [];

	const matchingArtists = debouncedSearchQuery.trim()
		? artists
				.filter((a) =>
					a.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
				)
				.slice(0, 3)
		: [];

	const inputClass =
		"w-full max-w-sm md:max-w-lg px-4 py-2 text-primary bg-background rounded-lg outline-none";

	// Auto-focus input when search opens
	useEffect(() => {
		if (isSearchOpen) {
			inputRef.current?.focus();
		}
	}, [isSearchOpen]);

	// Close search when clicking outside
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				searchContainerRef.current &&
				!searchContainerRef.current.contains(e.target as Node)
			) {
				setIsSearchOpen(false);
			}
		};
		if (isSearchOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isSearchOpen]);

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

	const handleSearch = (e: React.SubmitEvent) => {
		e.preventDefault();
		const q = searchQuery.trim();
		if (!q) return;
		router.push(`/search/${encodeURIComponent(q)}`);
		setIsSearchOpen(false);
		setSearchQuery("");
	};

	const handleSuggestionClick = (suggestion: string) => {
		router.push(`/search/${encodeURIComponent(suggestion)}`);
		setIsSearchOpen(false);
		setSearchQuery("");
	};

	const handleLogout = () => {
		logout();
		router.push("/login");
		setIsDropdownOpen(false);
	};

	return (
		<nav className="grid grid-cols-3 items-center py-4 px-8">
			{/* Left: Sidebar toggle + Search */}
			<div className="flex gap-2 items-center">
				<button
					type="button"
					onClick={onMenuToggle}
					title="Open sidebar"
					aria-label="Toggle sidebar"
					className="rounded-full p-2 text-content transition-colors duration-200 hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-700 cursor-pointer shrink-0"
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

			<div className="flex justify-end items-center gap-3">
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={() => setIsSearchOpen((prev) => !prev)}
						title={isSearchOpen ? "Close search" : "Open search"}
						aria-label={isSearchOpen ? "Close search" : "Open search"}
						className="rounded-full p-2 text-content transition-colors duration-200 hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-700 cursor-pointer shrink-0"
					>
						{isSearchOpen ? (
							<X className="w-5 h-5 text-primary" />
						) : (
							<Search className="w-5 h-5 text-primary" />
						)}
					</button>
				</div>

				{/* Right: Login button */}
				<div className="flex justify-end items-center gap-3">
					{mounted && (isArtist() || isClient() || isAdmin() || isCurator()) ? (
						<div className="hidden md:flex">
							<div className="relative" ref={dropdownRef}>
								<button
									type="button"
									onClick={() => setIsDropdownOpen((prev) => !prev)}
									className="flex items-center gap-2 rounded-full px-3 py-2 text-content transition-colors duration-200 hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-700 cursor-pointer"
								>
									<span className="text-sm font-medium text-primary">
										{user?.name}
									</span>
									<span className="text-sm font-medium text-primary">
										<ChevronDown
											className={`h-5 w-5 transition-all duration-200 group-hover:text-primary ${isDropdownOpen ? "rotate-180" : ""}`}
										/>
									</span>
								</button>

								{isDropdownOpen && (
									<div className="absolute right-0 mt-2 w-40 rounded-xl bg-white dark:bg-[#1D2D37] shadow-lg border border-slate-100 dark:border-slate-700 z-50">
										<button
											type="button"
											onClick={handleLogout}
											className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors duration-200 cursor-pointer"
										>
											Logout
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

			{/*Center Input*/}
			<div
				ref={searchContainerRef}
				className={`col-span-3 transition-all duration-300 ease-in-out ${
					isSearchOpen
						? "max-h-128 opacity-100 mt-4 overflow-visible"
						: "max-h-0 opacity-0 pointer-events-none overflow-hidden"
				}`}
			>
				<form
					onSubmit={handleSearch}
					className="flex justify-center items-center gap-3 w-full max-w-sm md:max-w-lg mx-auto"
				>
					<div className="relative flex-1">
						<input
							ref={inputRef}
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder='Cari karya, tags:"nama", artists:"nama"'
							className={inputClass}
						/>
						{searchQuery.trim() && debouncedSearchQuery.trim() && (
							<div className="absolute left-0 right-0 top-full mt-2 bg-surface border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden flex flex-col p-2 gap-1 max-h-72 overflow-y-auto">
								{/* 1. General Search */}
								<button
									type="button"
									onClick={() =>
										handleSuggestionClick(debouncedSearchQuery.trim())
									}
									className="flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg text-content transition-colors duration-200 cursor-pointer"
								>
									<Search className="w-4 h-4 text-content-muted shrink-0" />
									<span>{debouncedSearchQuery.trim()}</span>
								</button>

								{/* 2. Search by Artist */}
								<button
									type="button"
									onClick={() =>
										handleSuggestionClick(
											`artists:"${debouncedSearchQuery.trim()}"`,
										)
									}
									className="flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg text-content transition-colors duration-200 cursor-pointer"
								>
									<User className="w-4 h-4 text-content-muted shrink-0" />
									<span className="flex items-center gap-2">
										Cari artis:
										<span className="px-2 py-0.5 text-xs font-semibold rounded bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">
											{debouncedSearchQuery.trim()}
										</span>
									</span>
								</button>

								{/* 3. Search by Tag */}
								<button
									type="button"
									onClick={() =>
										handleSuggestionClick(
											`tags:"${debouncedSearchQuery.trim()}"`,
										)
									}
									className="flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg text-content transition-colors duration-200 cursor-pointer"
								>
									<Tag className="w-4 h-4 text-content-muted shrink-0" />
									<span className="flex items-center gap-2">
										Cari tag:
										<span className="px-2 py-0.5 text-xs font-semibold rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
											{debouncedSearchQuery.trim()}
										</span>
									</span>
								</button>

								{/* 4. Matching Artists in Database */}
								{matchingArtists.length > 0 && (
									<>
										<div className="border-t border-slate-100 dark:border-slate-800 my-1" />
										<div className="px-3 py-1 text-[10px] font-bold text-content-muted uppercase tracking-wider">
											Artis Terkait
										</div>
										{matchingArtists.map((artist) => (
											<button
												key={artist.id}
												type="button"
												onClick={() =>
													handleSuggestionClick(`artists:"${artist.name}"`)
												}
												className="flex items-center gap-2.5 px-3 py-1.5 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg text-content transition-colors duration-200 cursor-pointer"
											>
												<User className="w-4 h-4 text-content-muted shrink-0" />
												<span>{artist.name}</span>
											</button>
										))}
									</>
								)}

								{/* 5. Matching Tags in Database */}
								{matchingTags.length > 0 && (
									<>
										<div className="border-t border-slate-100 dark:border-slate-800 my-1" />
										<div className="px-3 py-1 text-[10px] font-bold text-content-muted uppercase tracking-wider">
											Tag Terkait
										</div>
										{matchingTags.map((tag) => (
											<button
												key={tag.id}
												type="button"
												onClick={() =>
													handleSuggestionClick(`tags:"${tag.tag_name}"`)
												}
												className="flex items-center gap-2.5 px-3 py-1.5 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg text-content transition-colors duration-200 cursor-pointer"
											>
												<Tag className="w-4 h-4 text-content-muted shrink-0" />
												<span>{tag.tag_name}</span>
											</button>
										))}
									</>
								)}
							</div>
						)}
					</div>
					<button
						type="submit"
						className="p-2 text-primary bg-background rounded-full cursor-pointer shrink-0"
					>
						<Search className="w-5 h-5 text-primary" />
					</button>
				</form>
			</div>
		</nav>
	);
}
