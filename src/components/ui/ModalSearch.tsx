"use client";

import { ArrowLeft, Search, Tag, User, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useArtworkStore } from "@/store/ArtworkStore";
import { useUserManagementStore } from "@/store/UserManagementStore";

interface ModalSearchProps {
	onClose: () => void;
}

export default function ModalSearch({ onClose }: ModalSearchProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);
	const router = useRouter();

	const { tags } = useArtworkStore();
	const { users } = useUserManagementStore();

	// Debouncing search query input (500ms)
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedSearchQuery(searchQuery);
		}, 500);

		return () => {
			clearTimeout(handler);
		};
	}, [searchQuery]);

	// Auto-focus input
	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	// ESC key closes overlay
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [onClose]);

	// Body scroll lock
	useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => {
			const activeOverlays = document.querySelectorAll(".fixed.inset-0");
			if (activeOverlays.length <= 1) {
				document.body.style.overflow = "";
			}
		};
	}, []);

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

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		const q = searchQuery.trim();
		if (!q) return;
		router.push(`/search/${encodeURIComponent(q)}`);
		onClose();
	};

	const handleSuggestionClick = (suggestion: string) => {
		router.push(`/search/${encodeURIComponent(suggestion)}`);
		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex flex-col bg-background p-4 overflow-y-auto">
			{/* Header Search Input */}
			<div className="flex items-center gap-3 w-full max-w-2xl mx-auto mb-6">
				<button
					type="button"
					onClick={onClose}
					title="Kembali"
					aria-label="Kembali"
					className="p-2 rounded-full hover:bg-content/5 transition-colors cursor-pointer shrink-0"
				>
					<ArrowLeft className="w-6 h-6 text-primary" />
				</button>

				<form
					onSubmit={handleSearch}
					className="flex-1 flex items-center gap-3"
				>
					<div className="flex-1 flex items-center gap-2 bg-surface rounded-xl px-4 py-3 border border-content/10 focus-within:border-primary transition-colors">
						<Search size={18} className="text-content-muted shrink-0" />
						<input
							ref={inputRef}
							type="search"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder='Cari karya, tags:"nama", artists:"nama"'
							className="flex-1 bg-transparent outline-none text-base text-content placeholder:text-content-muted"
						/>
						{searchQuery && (
							<button
								type="button"
								onClick={() => setSearchQuery("")}
								className="p-1 rounded-full hover:bg-content/10 transition-colors cursor-pointer"
							>
								<X size={16} className="text-content-muted" />
							</button>
						)}
					</div>
					<button
						type="submit"
						className="hidden px-5 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-colors cursor-pointer text-sm shrink-0"
					>
						Cari
					</button>
				</form>
			</div>

			{/* Auto-Complete & Suggestion results */}
			<div className="w-full max-w-2xl mx-auto flex-1 flex flex-col">
				{searchQuery.trim() && debouncedSearchQuery.trim() ? (
					<div className="bg-surface border border-content/10 rounded-2xl shadow-sm p-3 flex flex-col gap-1.5 overflow-hidden">
						{/* 1. General Query */}
						<button
							type="button"
							onClick={() => handleSuggestionClick(debouncedSearchQuery.trim())}
							className="flex items-center gap-3 px-4 py-3 text-base text-left hover:bg-content/5 rounded-xl text-content transition-colors cursor-pointer"
						>
							<Search className="w-5 h-5 text-content-muted shrink-0" />
							<span>Cari: &ldquo;{debouncedSearchQuery.trim()}&rdquo;</span>
						</button>

						{/* 2. Search by Artist Prefix */}
						<button
							type="button"
							onClick={() =>
								handleSuggestionClick(
									`artists:"${debouncedSearchQuery.trim()}"`,
								)
							}
							className="flex items-center gap-3 px-4 py-3 text-base text-left hover:bg-content/5 rounded-xl text-content transition-colors cursor-pointer"
						>
							<User className="w-5 h-5 text-content-muted shrink-0" />
							<span className="flex items-center gap-2">
								Cari artis:
								<span className="px-2 py-0.5 text-xs font-semibold rounded bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400">
									{debouncedSearchQuery.trim()}
								</span>
							</span>
						</button>

						{/* 3. Search by Tag Prefix */}
						<button
							type="button"
							onClick={() =>
								handleSuggestionClick(`tags:"${debouncedSearchQuery.trim()}"`)
							}
							className="flex items-center gap-3 px-4 py-3 text-base text-left hover:bg-content/5 rounded-xl text-content transition-colors cursor-pointer"
						>
							<Tag className="w-5 h-5 text-content-muted shrink-0" />
							<span className="flex items-center gap-2">
								Cari tag:
								<span className="px-2 py-0.5 text-xs font-semibold rounded bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400">
									{debouncedSearchQuery.trim()}
								</span>
							</span>
						</button>

						{/* 4. Matching Artists in Database */}
						{matchingArtists.length > 0 && (
							<>
								<div className="border-t border-content/10 my-2" />
								<div className="px-4 py-1.5 text-xs font-bold text-content-muted uppercase tracking-wider">
									Artis Terkait
								</div>
								{matchingArtists.map((artist) => (
									<button
										key={artist.id}
										type="button"
										onClick={() =>
											handleSuggestionClick(`artists:"${artist.name}"`)
										}
										className="flex items-center gap-3 px-4 py-2.5 text-base text-left hover:bg-content/5 rounded-xl text-content transition-colors cursor-pointer"
									>
										<User className="w-5 h-5 text-content-muted shrink-0" />
										<span>{artist.name}</span>
									</button>
								))}
							</>
						)}

						{/* 5. Matching Tags in Database */}
						{matchingTags.length > 0 && (
							<>
								<div className="border-t border-content/10 my-2" />
								<div className="px-4 py-1.5 text-xs font-bold text-content-muted uppercase tracking-wider">
									Tag Terkait
								</div>
								{matchingTags.map((tag) => (
									<button
										key={tag.id}
										type="button"
										onClick={() =>
											handleSuggestionClick(`tags:"${tag.tag_name}"`)
										}
										className="flex items-center gap-3 px-4 py-2.5 text-base text-left hover:bg-content/5 rounded-xl text-content transition-colors cursor-pointer"
									>
										<Tag className="w-5 h-5 text-content-muted shrink-0" />
										<span>{tag.tag_name}</span>
									</button>
								))}
							</>
						)}
					</div>
				) : (
					<div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-75">
						<Search size={48} className="text-content-muted mb-4" />
						<h3 className="font-semibold text-content text-lg">
							Cari di TruBrush
						</h3>
						<p className="text-sm text-content-muted mt-1 max-w-sm">
							Gunakan prefix seperti{" "}
							<code className="bg-content/5 px-1 py-0.5 rounded">
								tags:&quot;tag-nama&quot;
							</code>{" "}
							atau{" "}
							<code className="bg-content/5 px-1 py-0.5 rounded">
								artists:&quot;nama&quot;
							</code>{" "}
							untuk pencarian spesifik.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
