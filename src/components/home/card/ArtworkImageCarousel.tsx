"use client";

import { ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ArtworkWithRelations } from "@/types";

interface ArtworkImageCarouselProps {
	artwork: ArtworkWithRelations;
}

export function ArtworkImageCarousel({ artwork }: ArtworkImageCarouselProps) {
	const images = artwork.images_url || [
		"https://picsum.photos/seed/antariksa/800/600",
	];
	const imageCount = images.length;

	const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

	const handleTouchEnd = () => {
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

	return (
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
	);
}
