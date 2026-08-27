"use client";

import {
	BadgeCheck,
	ChevronLeft,
	ChevronRight,
	Flag,
	Heart,
	Link as LinkIcon,
	MoreHorizontal,
	ShieldCheck,
	UserCheck,
	UserPlus,
	UserX,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import CommissionButton from "@/components/detail/CommissionButton";
import AvatarInitials from "@/components/home/AvatarInitials";
import ReportArtModal from "@/components/home/ReportArtModal";
import Button from "@/components/ui/Button";
import Pill from "@/components/ui/Pill";
import { useCopyLink } from "@/hooks/useCopyLink";
import { useFavoriteArtwork } from "@/hooks/useFavoriteArtwork";
import { useFollowArtist } from "@/hooks/useFollowArtist";
import { useCreateReport } from "@/hooks/useReportQueries";
import { useModalStore } from "@/store/ModalStore";
import { useUserStore } from "@/store/UserStore";
import type { ArtworkWithRelations, User } from "@/types";

export function ArtworkCard({ artwork }: { artwork: ArtworkWithRelations }) {
	const { artist, artist_profile, tags } = artwork;
	const router = useRouter();
	const { copyPath } = useCopyLink();
	const { openModal } = useModalStore();
	const { user, isAuthenticated } = useUserStore();
	const { isArtworkFavorite, handleFavoriteToggle } = useFavoriteArtwork(
		artwork.id,
		artwork.title,
	);

	const { isArtistFollowed, handleFollowToggle } = useFollowArtist(artist.id);
	const createReportMutation = useCreateReport();
	const basePrice =
		artist_profile?.base_price_idr ??
		(artist as Partial<User>)?.profile?.base_price_idr ??
		null;

	const images = artwork.images_url || [
		"https://picsum.photos/seed/antariksa/800/600",
	];
	const imageCount = images.length;

	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isReportOpen, setIsReportOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [touchStartX, setTouchStartX] = useState<number | null>(null);
	const [touchEndX, setTouchEndX] = useState<number | null>(null);

	const minSwipeDistance = 50;

	const handlePrev = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (currentImageIndex > 0) {
			setCurrentImageIndex((prev) => prev - 1);
		}
	};

	const handleNext = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (currentImageIndex < imageCount - 1) {
			setCurrentImageIndex((prev) => prev + 1);
		}
	};

	const handleDotClick = (e: React.MouseEvent, index: number) => {
		e.preventDefault();
		e.stopPropagation();
		setCurrentImageIndex(index);
	};

	const handleTouchStart = (e: React.TouchEvent) => {
		setTouchEndX(null);
		setTouchStartX(e.targetTouches[0].clientX);
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		setTouchEndX(e.targetTouches[0].clientX);
	};

	const handleTouchEnd = (_e: React.TouchEvent) => {
		if (!touchStartX || !touchEndX) return;
		const distance = touchStartX - touchEndX;
		const isLeftSwipe = distance > minSwipeDistance;
		const isRightSwipe = distance < -minSwipeDistance;

		if (isLeftSwipe && currentImageIndex < imageCount - 1) {
			setCurrentImageIndex((prev) => prev + 1);
		}
		if (isRightSwipe && currentImageIndex > 0) {
			setCurrentImageIndex((prev) => prev - 1);
		}
	};

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

	const handleReport = () => {
		if (!isAuthenticated || !user) {
			openModal({
				title: "Login diperlukan",
				description:
					"Silakan login terlebih dahulu untuk melaporkan karya ini.",
				type: "confirm",
				confirmLabel: "Login",
				cancelLabel: "Batal",
				onConfirm: () => router.push("/login"),
			});
			return;
		}

		if (user.role !== "artist" && user.role !== "client") {
			openModal({
				title: "Akses Terbatas",
				description: "Hanya client dan artist yang bisa melapor",
			});
			return;
		}
		setIsReportOpen(true);
	};

	const handleReportClose = useCallback(() => {
		setIsReportOpen(false);
	}, []);

	const handleReportSubmit = useCallback(
		(reason: string) => {
			if (!user) return;
			createReportMutation.mutate({
				target_type: "artwork",
				target_id: artwork.id,
				reason,
			});
			setIsReportOpen(false);
		},
		[user, artwork.id, createReportMutation],
	);

	const handleCopyLink = (id: string) => {
		copyPath(`/detail/${id}`);
		setIsDropdownOpen(false);
	};

	return (
		<article className="bg-surface rounded-lg overflow-hidden border border-transparent transition-all duration-200">
			{/* Header */}
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
										onClick={() => {
											handleCopyLink(artwork.id);
										}}
									>
										<LinkIcon size={15} className="text-content-muted" />
										Salin Tautan
									</button>
								</li>
								<li>
									<button
										type="button"
										className="flex items-center gap-2 text-xs text-error"
										onClick={() => {
											handleReport();
											setIsDropdownOpen(false);
										}}
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

			{/* Image Carousel */}
			<div
				className="relative w-full bg-content/5 overflow-hidden aspect-4/3 group/carousel"
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
			>
				<Link
					href={`/detail/${artwork.id}`}
					className="block w-full h-full cursor-pointer relative"
				>
					{imageCount > 0 ? (
						<Image
							src={images[currentImageIndex]}
							alt={`${artwork.title} - Image ${currentImageIndex + 1}`}
							fill
							quality={90}
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 700px, 800px"
							className="object-cover transition-opacity duration-300"
							priority={currentImageIndex === 0}
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center text-content-muted">
							Tidak ada gambar
						</div>
					)}
				</Link>

				{artwork.curation_status === "approved" && (
					<div className="absolute top-2 left-2 z-10 badge badge-success badge-sm gap-1 text-white backdrop-blur-sm pointer-events-none">
						<ShieldCheck className="w-3 h-3" />
						Terkurasi
					</div>
				)}

				{imageCount > 1 && (
					<div className="absolute top-2 right-2 z-10 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2.5 py-1 rounded-full pointer-events-none select-none">
						{currentImageIndex + 1} / {imageCount}
					</div>
				)}

				{imageCount > 1 && (
					<>
						{currentImageIndex > 0 && (
							<button
								type="button"
								onClick={handlePrev}
								className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all duration-200 cursor-pointer opacity-0 group-hover/carousel:opacity-100 focus:opacity-100"
								aria-label="Previous image"
							>
								<ChevronLeft size={16} />
							</button>
						)}

						{currentImageIndex < imageCount - 1 && (
							<button
								type="button"
								onClick={handleNext}
								className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all duration-200 cursor-pointer opacity-0 group-hover/carousel:opacity-100 focus:opacity-100"
								aria-label="Next image"
							>
								<ChevronRight size={16} />
							</button>
						)}

						<div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 items-center">
							{images.map((imgUrl, index) => (
								<button
									key={`${artwork.id}-dot-${imgUrl}`}
									type="button"
									onClick={(e) => handleDotClick(e, index)}
									className={`w-1.5 h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
										currentImageIndex === index
											? "bg-white scale-125 shadow-sm"
											: "bg-white/40 hover:bg-white/70"
									}`}
									aria-label={`Go to image ${index + 1}`}
								/>
							))}
						</div>
					</>
				)}
			</div>

			{/* Action Bar */}
			<div className="flex flex-col px-4 py-3 border-b border-content/5">
				<div className="flex justify-between items-center gap-2 w-full">
					<Link
						href={`/detail/${artwork.id}`}
						className="text-sm font-semibold text-content"
					>
						{artwork.title}
					</Link>
					<button
						type="button"
						onClick={handleFavoriteToggle}
						title={
							isArtworkFavorite ? "Hapus dari favorite" : "Tambah ke favorite"
						}
						aria-pressed={isArtworkFavorite}
						className="p-2 hover:bg-content/5 rounded-full transition-colors duration-150 -ml-2 group cursor-pointer"
					>
						<Heart
							size={20}
							className={`transition-colors duration-150 ${
								isArtworkFavorite
									? "text-red-500 fill-red-500"
									: "text-content-muted group-hover:text-red-500 group-hover:fill-red-500"
							}`}
						/>
					</button>
				</div>
				{/* Tags */}
				{tags && tags.length > 0 && (
					<div className="flex flex-wrap gap-1.5 pt-1">
						{tags.slice(0, 3).map((tag, i) => (
							<Pill
								key={tag.id}
								link={`/search/${encodeURIComponent(`tags:"${tag.tag_name}"`)}`}
								className={
									i % 2 === 0
										? "text-[11px] px-2 py-1 rounded-full bg-primary/10 text-primary"
										: "text-[11px] px-2 py-1 rounded-full bg-warm/15 text-warm-hover"
								}
							>
								{tag.tag_name}
							</Pill>
						))}
						{tags.length > 3 && <Pill>+{tags.length - 3}</Pill>}
					</div>
				)}
			</div>

			{/* Content */}
			<div className="px-4 py-3 space-y-2">
				{artist_profile.is_verified ? (
					<div>
						{artist_profile.is_open_for_commission ? (
							<CommissionButton
								artworkId={artwork.id}
								artworkTitle={artwork.title}
								artistId={artist.id}
								artistName={artist.name}
								basePrice={basePrice}
								className="text-sm"
							>
								Pesan Komisi
							</CommissionButton>
						) : (
							<Button
								variant="secondary"
								className="w-full text-sm pointer-events-none"
								disabled
							>
								Komisi Tutup
							</Button>
						)}
					</div>
				) : (
					<div>
						<Button
							variant="danger"
							className="w-full text-sm pointer-events-none"
							disabled
						>
							Belum Diverifikasi
						</Button>
					</div>
				)}
			</div>

			{user && (
				<ReportArtModal
					artworkId={artwork.id}
					artworkTitle={artwork.title}
					isOpen={isReportOpen}
					onClose={handleReportClose}
					onSubmit={handleReportSubmit}
				/>
			)}
		</article>
	);
}
