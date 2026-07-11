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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import CommissionButton from "@/components/detail/CommissionButton";
import Button from "@/components/ui/Button";
import Pill from "@/components/ui/Pill";
import { useCopyLink } from "@/hooks/useCopyLink";
import { useFavoriteStore } from "@/store/FavoriteStore";
import { useModalStore } from "@/store/ModalStore";
import { useProfileStore } from "@/store/ProfileStore";
import { useToastStore } from "@/store/ToastStore";
import { useUserStore } from "@/store/UserStore";
import type { ArtworkWithRelations } from "@/types";
import AvatarInitials from "./AvatarInitials";

export function ArtworkCard({ artwork }: { artwork: ArtworkWithRelations }) {
	const { artist, artist_profile, tags } = artwork;
	const { copyPath } = useCopyLink();
	const { addToast } = useToastStore();
	const { openModal } = useModalStore();
	const { user, isAuthenticated } = useUserStore();
	const { isFavorite, toggleFavorite } = useFavoriteStore();
	const { profiles } = useProfileStore();
	const isArtworkFavorite = user ? isFavorite(user.id, artwork.id) : false;
	const basePrice =
		profiles.find((profile) => profile.user_id === artist.id)?.base_price_idr ??
		null;

	const images = artwork.images_url || [
		"https://picsum.photos/seed/antariksa/800/600",
	];
	const imageCount = images.length;

	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

	const handleTouchEnd = (e: React.TouchEvent) => {
		if (!touchStartX || !touchEndX) return;
		const distance = touchStartX - touchEndX;
		const isLeftSwipe = distance > minSwipeDistance;
		const isRightSwipe = distance < -minSwipeDistance;

		if (isLeftSwipe || isRightSwipe) {
			// Prevent navigation on swipe gesture
			e.preventDefault();
			e.stopPropagation();

			if (isLeftSwipe && currentImageIndex < imageCount - 1) {
				setCurrentImageIndex((prev) => prev + 1);
			} else if (isRightSwipe && currentImageIndex > 0) {
				setCurrentImageIndex((prev) => prev - 1);
			}
		}
	};

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleFavorite = () => {
		if (!isAuthenticated || !user) {
			addToast({
				message: "Login terlebih dahulu untuk menambahkan favorite.",
				type: "warning",
			});
			return;
		}

		const addedToFavorite = toggleFavorite(user.id, artwork.id);

		addToast({
			message: addedToFavorite
				? `Berhasil ditambahkan ke favorite: ${artwork.title}.`
				: `Dihapus dari favorite: ${artwork.title}.`,
			type: addedToFavorite ? "success" : "info",
		});
	};

	const handleReport = (artName: string) => {
		openModal({
			type: "confirm",
			variant: "danger",
			title: "Laporkan Karya",
			description: `Apakah Anda yakin ingin melaporkan karya: ${artName}?`,
			onConfirm: () => {
				addToast({
					message: `Karya: ${artName} berhasil dilaporkan.`,
					type: "warning",
				});
			},
		});
	};

	const handleCopyLink = (id: string) => {
		copyPath(`/detail/${id}`);
		setIsDropdownOpen(false);
	};

	return (
		<article className="bg-surface rounded-lg overflow-hidden shadow-sm border border-transparent hover:border-warm/30 hover:shadow-md transition-all duration-200">
			{/* Header */}
			<div className="flex items-center justify-between px-4 py-3 border-b border-content/5">
				<Link
					href={`/artists/${artist.id}`}
					className="flex items-center gap-2.5 flex-1 min-w-0"
				>
					<AvatarInitials name={artist.name} className="w-9 h-9" />
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

				{/* Dropdown Container */}
				<div className="relative" ref={dropdownRef}>
					<button
						type="button"
						title="More"
						onClick={() => setIsDropdownOpen(!isDropdownOpen)}
						className={`p-2 rounded-full transition-colors duration-150 -mr-1 cursor-pointer ${isDropdownOpen ? "bg-content/5" : "hover:bg-content/5"}`}
					>
						<MoreHorizontal size={18} className="text-content-muted" />
					</button>

					{isDropdownOpen && (
						<div className="absolute right-0 mt-1 w-40 bg-background border border-content/10 rounded-lg shadow-lg z-10 overflow-hidden py-1">
							<button
								type="button"
								className="w-full text-left px-4 py-2.5 text-sm text-content hover:bg-content/5 flex items-center gap-2.5 transition-colors"
								onClick={() => {
									handleCopyLink(artwork.id);
								}}
							>
								<LinkIcon size={16} className="text-content-muted" />
								Salin Tautan
							</button>
							<button
								type="button"
								className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2.5 transition-colors"
								onClick={() => {
									handleReport(artwork.title);
									setIsDropdownOpen(false);
								}}
							>
								<Flag size={16} />
								Laporkan
							</button>
						</div>
					)}
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
							sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
							className="object-cover transition-opacity duration-300"
							loading="eager"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center text-content-muted">
							Tidak ada gambar
						</div>
					)}
				</Link>

				{artwork.curation_status === "approved" && (
					<div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-verified/90 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-full pointer-events-none">
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
							{images.map((_, index) => (
								<button
									key={index}
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
						onClick={handleFavorite}
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
		</article>
	);
}
