"use client";

import { FileText, Info, Search, Tag, User } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { ArtworkCard } from "@/components/home/ArtworkCard";
import ArtworkSkeleton from "@/components/home/ArtworkSkeleton";
import { useArtworks } from "@/hooks/useArtworkQueries";
import { useUserManagementStore } from "@/store/UserManagementStore";
import { buildArtworkWithRelations, parseSearchQuery } from "@/utils/search";

const TYPE_CONFIG = {
	title: {
		label: "Judul",
		Icon: FileText,
		pill: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
	},
	tags: {
		label: "Tag",
		Icon: Tag,
		pill: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
	},
	artists: {
		label: "Artis",
		Icon: User,
		pill: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
	},
};

export default function SearchPage() {
	const params = useParams();
	const rawQuery = decodeURIComponent(params.param as string);
	const parsed = parseSearchQuery(rawQuery);
	const { users } = useUserManagementStore();

	// Tentukan parameter filter backend berdasarkan query type
	const filters = useMemo(() => {
		if (parsed.type === "tags") {
			return { tag: parsed.value };
		}
		return { search: parsed.value };
	}, [parsed.type, parsed.value]);

	const { data: artworks = [], isLoading } = useArtworks(filters);

	const results = useMemo(() => {
		return buildArtworkWithRelations(artworks, [], [], users).filter(
			(artwork) => artwork.is_visible_on_feed,
		);
	}, [artworks, users]);

	const { label, Icon, pill } = TYPE_CONFIG[parsed.type];

	return (
		<main className="min-h-screen bg-background text-content pb-20">
			{/* Header */}
			<header className="border-b border-content/10 bg-surface/50 backdrop-blur-md sticky top-0 z-40">
				<div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Search className="w-5 h-5 text-content-muted" />
						<div>
							<h1 className="text-sm font-semibold text-content-muted">
								Hasil pencarian untuk
							</h1>
							<div className="flex items-center gap-2 mt-1">
								<span className="text-lg font-bold text-content truncate max-w-[200px] sm:max-w-xs">
									{parsed.value}
								</span>
								<span
									className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${pill}`}
								>
									<Icon size={12} />
									{label}
								</span>
							</div>
						</div>
					</div>
					<div className="text-xs text-content-muted font-medium bg-content/5 px-3 py-1.5 rounded-lg">
						{isLoading ? "Mencari..." : `${results.length} karya ditemukan`}
					</div>
				</div>
			</header>

			{/* Content */}
			<div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
				{isLoading ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<ArtworkSkeleton />
						<ArtworkSkeleton />
						<ArtworkSkeleton />
					</div>
				) : results.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20 px-4 bg-surface border border-content/10 rounded-2xl text-center max-w-md mx-auto mt-8">
						<Info className="w-12 h-12 text-content-muted mb-4" />
						<h2 className="font-heading text-lg font-bold text-content">
							Tidak ada hasil
						</h2>
						<p className="mt-2 text-sm text-content-muted leading-relaxed">
							Kami tidak dapat menemukan karya yang cocok dengan pencarian Anda.
							Coba periksa ejaan atau gunakan kata kunci lain.
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{results.map((artwork) => (
							<ArtworkCard key={artwork.id} artwork={artwork} />
						))}
					</div>
				)}
			</div>
		</main>
	);
}
