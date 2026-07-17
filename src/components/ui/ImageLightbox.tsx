"use client";

import {
	ChevronLeft,
	ChevronRight,
	RotateCcw,
	X,
	ZoomIn,
	ZoomOut,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { useLightboxStore } from "@/store/LightboxStore";
import { randomKey } from "@/utils/index";

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const ZOOM_STEP = 0.5;

function LightboxContent() {
	const { images, initialIndex, title, closeLightbox } = useLightboxStore();
	const [index, setIndex] = useState(initialIndex);
	const [scale, setScale] = useState(1);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [visible, setVisible] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

	const dragStart = useRef({ x: 0, y: 0 });
	const posStart = useRef({ x: 0, y: 0 });

	const hasMultiple = images.length > 1;

	// Enter animation
	useEffect(() => {
		const id = requestAnimationFrame(() =>
			requestAnimationFrame(() => setVisible(true)),
		);
		return () => cancelAnimationFrame(id);
	}, []);

	const resetZoom = useCallback(() => {
		setScale(1);
		setPosition({ x: 0, y: 0 });
	}, []);

	// Reset zoom whenever the active image changes
	useEffect(() => {
		setTimeout(() => {
			resetZoom();
		}, 0);
	}, [resetZoom]);

	const goPrev = useCallback(() => {
		setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
	}, [images.length]);

	const goNext = useCallback(() => {
		setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
	}, [images.length]);

	const zoomIn = useCallback(
		() => setScale((prev) => Math.min(MAX_SCALE, prev + ZOOM_STEP)),
		[],
	);
	const zoomOut = useCallback(
		() =>
			setScale((prev) => {
				const next = Math.max(MIN_SCALE, prev - ZOOM_STEP);
				if (next === MIN_SCALE) setPosition({ x: 0, y: 0 });
				return next;
			}),
		[],
	);

	// Keyboard controls
	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") closeLightbox();
			if (e.key === "ArrowLeft" && hasMultiple) goPrev();
			if (e.key === "ArrowRight" && hasMultiple) goNext();
			if (e.key === "+" || e.key === "=") zoomIn();
			if (e.key === "-") zoomOut();
		};
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [hasMultiple, zoomIn, goNext, zoomOut, goPrev, closeLightbox]);

	// Wheel to zoom
	const handleWheel = (e: React.WheelEvent) => {
		e.preventDefault();
		if (e.deltaY < 0) zoomIn();
		else zoomOut();
	};

	// Drag to pan when zoomed in
	const handleMouseDown = (e: React.MouseEvent) => {
		if (scale <= 1) return;
		setIsDragging(true);
		dragStart.current = { x: e.clientX, y: e.clientY };
		posStart.current = position;
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!isDragging) return;
		const dx = e.clientX - dragStart.current.x;
		const dy = e.clientY - dragStart.current.y;
		setPosition({ x: posStart.current.x + dx, y: posStart.current.y + dy });
	};

	const handleTouchStart = (e: React.TouchEvent) => {
		if (scale <= 1) return;
		setIsDragging(true);
		const touch = e.touches[0];
		dragStart.current = { x: touch.clientX, y: touch.clientY };
		posStart.current = position;
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		if (!isDragging) return;
		const touch = e.touches[0];
		const dx = touch.clientX - dragStart.current.x;
		const dy = touch.clientY - dragStart.current.y;
		setPosition({ x: posStart.current.x + dx, y: posStart.current.y + dy });
	};

	const stopDragging = () => {
		setIsDragging(false);
	};

	const handleDoubleClick = () => {
		if (scale > 1) {
			resetZoom();
		} else {
			setScale(2);
		}
	};

	const currentImage = images[index];

	return (
		<div
			className={[
				"fixed inset-0 z-9999 flex flex-col",
				"transition-opacity duration-200",
				visible ? "opacity-100" : "opacity-0",
			].join(" ")}
		>
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
				onClick={closeLightbox}
				aria-hidden="true"
			/>

			{/* Top bar */}
			<div className="relative z-10 flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
				<div className="min-w-0">
					{title && (
						<p className="truncate text-sm font-medium text-white">{title}</p>
					)}
					{hasMultiple && (
						<p className="text-xs text-white/60">
							{index + 1} / {images.length}
						</p>
					)}
				</div>

				<div className="flex items-center gap-1.5">
					<button
						type="button"
						onClick={zoomOut}
						disabled={scale <= MIN_SCALE}
						aria-label="Perkecil"
						className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
					>
						<ZoomOut className="h-4.5 w-4.5" />
					</button>
					<button
						type="button"
						onClick={zoomIn}
						disabled={scale >= MAX_SCALE}
						aria-label="Perbesar"
						className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
					>
						<ZoomIn className="h-4.5 w-4.5" />
					</button>
					<button
						type="button"
						onClick={resetZoom}
						disabled={
							scale === MIN_SCALE && position.x === 0 && position.y === 0
						}
						aria-label="Reset zoom"
						className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
					>
						<RotateCcw className="h-4 w-4" />
					</button>
					<button
						type="button"
						onClick={closeLightbox}
						aria-label="Tutup"
						className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
					>
						<X className="h-5 w-5" />
					</button>
				</div>
			</div>

			{/* Image stage */}
      <div
        role="application"
        aria-label="Image viewer"
				className="relative z-10 flex flex-1 items-center justify-center overflow-hidden px-4 pb-4 sm:px-10"
				onWheel={handleWheel}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={stopDragging}
				onMouseLeave={stopDragging}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={stopDragging}
				onDoubleClick={handleDoubleClick}
			>
				{hasMultiple && (
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							goPrev();
						}}
						aria-label="Gambar sebelumnya"
						className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 sm:left-4"
					>
						<ChevronLeft className="h-5 w-5" />
					</button>
				)}

				<div
					className="relative h-full w-full select-none"
					style={{
						cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "default",
					}}
				>
					{currentImage && (
						<Image
							src={currentImage}
							alt={title ?? `Gambar ${index + 1}`}
							fill
							sizes="100vw"
							draggable={false}
							className="object-contain transition-transform duration-150 ease-out"
							style={{
								transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
							}}
						/>
					)}
				</div>

				{hasMultiple && (
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							goNext();
						}}
						aria-label="Gambar berikutnya"
						className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 sm:right-4"
					>
						<ChevronRight className="h-5 w-5" />
					</button>
				)}
			</div>

			{/* Thumbnail strip */}
			{hasMultiple && (
				<div className="relative z-10 flex items-center justify-center gap-2 px-4 pb-4 overflow-x-auto">
					{images.map((img, i) => {
						return (
							<button
								key={`${img}-${randomKey()}`}
								type="button"
								onClick={() => setIndex(i)}
								className={[
									"relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
									i === index
										? "border-white"
										: "border-transparent opacity-60 hover:opacity-100",
								].join(" ")}
							>
								<Image
									src={img}
									alt={`Thumbnail ${i + 1}`}
									fill
									sizes="64px"
									className="object-cover"
								/>
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
}

export default function ImageLightbox() {
	const { isOpen } = useLightboxStore();

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			const activeOverlays = document.querySelectorAll(".fixed.inset-0");
			if (activeOverlays.length <= 1) {
				document.body.style.overflow = "";
			}
		}
		return () => {
			const activeOverlays = document.querySelectorAll(".fixed.inset-0");
			if (activeOverlays.length <= 1) {
				document.body.style.overflow = "";
			}
		};
	}, [isOpen]);

	// Mount fresh each time it opens so local zoom/index state resets
	if (!isOpen) return null;
	return <LightboxContent />;
}
