"use client";

import { Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArtworkCard } from "@/components/home/ArtworkCard";
import ArtworkSkeleton from "@/components/home/ArtworkSkeleton";
import { useInfiniteArtworks } from "@/hooks/useArtworkQueries";
import { useMounted } from "@/hooks/useMounted";
import { useUserFollowingIds } from "@/hooks/useSocialQueries";
import { useUserStore } from "@/store/UserStore";
import { buildArtworkWithRelations } from "@/utils/search";

// ── Main Component ────────────────────────────────────────────────────────────

export default function ArtworkList() {
	const mounted = useMounted();
	const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
		useInfiniteArtworks({ isVisibleOnFeed: "true" }, 6);

	const { user, isAuthenticated } = useUserStore();
	const { data: followedArtistIds = [] } = useUserFollowingIds();

	const [feedType, setFeedType] = useState<"all" | "followed">("all");
	const sentinelRef = useRef<HTMLDivElement | null>(null);

	// Synchronize ref callbacks for stable observer without tearing down listener
	const hasNextPageRef = useRef(hasNextPage);
	const isFetchingNextPageRef = useRef(isFetchingNextPage);
	const fetchNextPageRef = useRef(fetchNextPage);

	useEffect(() => {
		hasNextPageRef.current = hasNextPage;
		isFetchingNextPageRef.current = isFetchingNextPage;
		fetchNextPageRef.current = fetchNextPage;
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	// Flatten all paginated pages into a single artwork list
	const allArtworks = useMemo(() => {
		const rawArtworks = data?.pages.flatMap((page) => page.data) ?? [];
		return buildArtworkWithRelations(rawArtworks, [], []).filter(
			(item) => item.is_visible_on_feed,
		);
	}, [data]);

	const filteredArtworks = useMemo(() => {
		if (feedType === "followed") {
			return allArtworks.filter((item) =>
				followedArtistIds.includes(item.artists_id),
			);
		}
		return allArtworks;
	}, [allArtworks, feedType, followedArtistIds]);

	// 1. Stable Infinite Scroll IntersectionObserver trigger
	useEffect(() => {
		const element = sentinelRef.current;
		if (!element) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (
					entries[0]?.isIntersecting &&
					hasNextPageRef.current &&
					!isFetchingNextPageRef.current
				) {
					fetchNextPageRef.current();
				}
			},
			{
				rootMargin: "400px", // Trigger early before reaching the exact bottom
			},
		);

		observer.observe(element);
		return () => observer.disconnect();
	}, []);

	// 2. Auto-fill Viewport: if total content is shorter than screen height, auto fetch next batch
	useEffect(() => {
		if (!mounted || isLoading || isFetchingNextPage || !hasNextPage) return;

		const checkAndFill = () => {
			if (typeof window === "undefined") return;
			const scrollHeight = document.documentElement.scrollHeight;
			const clientHeight = document.documentElement.clientHeight;

			// If content is not tall enough to produce a scrollbar and more pages exist
			if (
				scrollHeight <= clientHeight + 150 &&
				hasNextPageRef.current &&
				!isFetchingNextPageRef.current
			) {
				fetchNextPageRef.current();
			}
		};

		const timer = setTimeout(checkAndFill, 300);
		return () => clearTimeout(timer);
	}, [mounted, isLoading, isFetchingNextPage, hasNextPage]);

	// Show tab switcher only if user is logged in as artist or client
	const showTabs =
		mounted &&
		isAuthenticated &&
		user &&
		(user.role === "artist" || user.role === "client");

	const isCurrentlyLoading = mounted ? isLoading : false;

	return (
		<section className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
			{/* Sticky Tab Header */}
			<div className="sticky top-18 bg-background z-20 flex items-center justify-between border-b border-content/10 mb-2 pt-3 pb-0.5">
				<div className="flex">
					<button
						type="button"
						onClick={() => setFeedType("all")}
						className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
							feedType === "all"
								? "border-primary text-primary"
								: "border-transparent text-content-muted hover:text-content"
						}`}
					>
						Semua Karya
					</button>
					{showTabs && (
						<button
							type="button"
							onClick={() => setFeedType("followed")}
							className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
								feedType === "followed"
									? "border-primary text-primary"
									: "border-transparent text-content-muted hover:text-content"
							}`}
						>
							Mengikuti ({followedArtistIds.length})
						</button>
					)}
				</div>
			</div>

			{!mounted || isCurrentlyLoading ? (
				<div className="flex flex-col gap-4">
					<ArtworkSkeleton />
					<ArtworkSkeleton />
					<ArtworkSkeleton />
				</div>
			) : filteredArtworks.length === 0 && !hasNextPage ? (
				<div className="flex flex-col items-center justify-center py-20 px-4 bg-surface border border-content/10 rounded-2xl text-center">
					<p className="text-content-muted text-sm">
						{feedType === "followed"
							? "Belum ada karya dari artis yang Anda ikuti."
							: "Belum ada karya yang ditampilkan."}
					</p>
				</div>
			) : (
				<div className="flex flex-col gap-4">
					{filteredArtworks.map((art) => (
						<ArtworkCard key={art.id} artwork={art} />
					))}

					{/* Loading More Spinner / Skeleton */}
					{isFetchingNextPage && (
						<div className="flex flex-col gap-4 pt-2">
							<ArtworkSkeleton />
						</div>
					)}

					{/* Fallback Manual Trigger */}
					{hasNextPage && !isFetchingNextPage && (
						<div className="flex justify-center pt-2 pb-2">
							<button
								type="button"
								onClick={() => fetchNextPage()}
								className="text-xs font-semibold text-primary hover:text-primary-hover py-2 px-5 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer"
							>
								Muat Lebih Banyak Karya ↓
							</button>
						</div>
					)}

					{/* Infinite Scroll Sentinel Marker */}
					<div ref={sentinelRef} className="h-6 w-full" />

					{/* End of Feed Banner */}
					{!hasNextPage && filteredArtworks.length > 0 && (
						<div className="flex flex-col items-center justify-center py-8 text-center gap-1.5 opacity-70">
							<div className="flex items-center gap-1.5 text-xs font-semibold text-content-muted">
								<Sparkles className="w-3.5 h-3.5 text-primary" />
								<span>Semua karya terbaru telah ditampilkan</span>
							</div>
							<p className="text-[11px] text-content-muted">
								Kembali lagi nanti untuk melihat inspirasi karya segar lainnya!
							</p>
						</div>
					)}
				</div>
			)}
		</section>
	);
}
