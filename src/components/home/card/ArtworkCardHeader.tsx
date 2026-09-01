"use client";

import {
	BadgeCheck,
	Flag,
	Link as LinkIcon,
	MoreHorizontal,
	UserCheck,
	UserPlus,
	UserX,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import AvatarInitials from "@/components/home/AvatarInitials";
import { useCopyLink } from "@/hooks/useCopyLink";
import { useFollowArtist } from "@/hooks/useFollowArtist";
import { useUserStore } from "@/store/UserStore";
import type { ArtworkWithRelations } from "@/types";

interface ArtworkCardHeaderProps {
	artwork: ArtworkWithRelations;
	onReportClick: () => void;
}

export function ArtworkCardHeader({
	artwork,
	onReportClick,
}: ArtworkCardHeaderProps) {
	const { artist, artist_profile } = artwork;
	const { user } = useUserStore();
	const { copyPath } = useCopyLink();
	const { isArtistFollowed, handleFollowToggle } = useFollowArtist(artist.id);

	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleCopyLink = () => {
		copyPath(`/detail/${artwork.id}`);
		setIsDropdownOpen(false);
	};

	const handleReport = () => {
		setIsDropdownOpen(false);
		onReportClick();
	};

	return (
		<div className="flex items-center justify-between px-4 py-3 border-b border-content/5">
			<Link
				href={`/artists/${artist.id}`}
				className="flex items-center gap-2.5 flex-1 min-w-0"
			>
				<AvatarInitials
					name={artist.name}
					className="w-9 h-9"
					src={artist_profile.avatar_url}
				/>
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-1.5">
						<p className="text-sm font-semibold text-content truncate">
							{artist.name}
						</p>
						{artist_profile.is_verified && (
							<BadgeCheck className="w-4 h-4 text-verified shrink-0" />
						)}
					</div>
				</div>
			</Link>

			<div className="flex items-center gap-2 shrink-0">
				{/* Follow Button */}
				{(!user || user.id !== artist.id) && (
					<button
						type="button"
						onClick={handleFollowToggle}
						className={`group px-3 py-1 text-xs font-bold rounded-full border transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
							isArtistFollowed
								? "bg-content/5 border-content/10 text-content hover:bg-red-50 hover:border-red-200 hover:text-red-500 dark:hover:bg-red-950/20 dark:hover:border-red-900/30"
								: "bg-primary border-primary text-background hover:bg-primary-hover shadow-sm"
						}`}
					>
						{isArtistFollowed ? (
							<>
								<UserCheck className="w-3.5 h-3.5 group-hover:hidden" />
								<UserX className="w-3.5 h-3.5 hidden group-hover:inline text-red-500" />
								<span className="group-hover:hidden">Mengikuti</span>
								<span className="hidden group-hover:inline text-red-500">
									Batal Ikuti
								</span>
							</>
						) : (
							<>
								<UserPlus className="w-3.5 h-3.5" />
								<span>Ikuti</span>
							</>
						)}
					</button>
				)}

				{/* Dropdown Container */}
				<div className="dropdown dropdown-end" ref={dropdownRef}>
					<button
						type="button"
						title="More"
						onClick={() => setIsDropdownOpen(!isDropdownOpen)}
						className={`btn btn-ghost btn-circle btn-xs -mr-1 ${isDropdownOpen ? "bg-content/5" : ""}`}
					>
						<MoreHorizontal size={18} className="text-content-muted" />
					</button>

					{isDropdownOpen && (
						<ul className="dropdown-content menu p-1 shadow-lg bg-surface rounded-box w-40 border border-content/10 z-20 mt-1">
							<li>
								<button
									type="button"
									className="flex items-center gap-2 text-xs text-content"
									onClick={handleCopyLink}
								>
									<LinkIcon size={15} className="text-content-muted" />
									Salin Tautan
								</button>
							</li>
							<li>
								<button
									type="button"
									className="flex items-center gap-2 text-xs text-error"
									onClick={handleReport}
								>
									<Flag size={15} />
									Laporkan
								</button>
							</li>
						</ul>
					)}
				</div>
			</div>
		</div>
	);
}
