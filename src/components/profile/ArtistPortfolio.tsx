import { ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import EmptyState from "@/components/profile/EmptyState";
import type { ArtworkWithRelations } from "@/types";

interface ArtistPortfolioProps {
	artworksWithTags: ArtworkWithRelations[];
}

export default function ArtistPortfolio({
	artworksWithTags,
}: ArtistPortfolioProps) {
	return (
		<section>
			<div className="flex items-center justify-between mb-5">
				<h2 className="font-heading text-xl font-semibold text-content">
					Portfolio Saya
				</h2>
				<span className="text-sm text-content-muted">
					{artworksWithTags.length} karya
				</span>
			</div>

			{artworksWithTags.length === 0 ? (
				<EmptyState
					icon={ImageIcon}
					title="Belum ada karya"
					description="Karya yang sudah lolos kurasi akan tampil di bagian ini."
				/>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{artworksWithTags.map((artwork) => (
						<Link
							key={artwork.id}
							href={`/detail/${artwork.id}`}
							className="group bg-surface border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden hover:shadow-md hover:border-primary/30 transition-all duration-200"
						>
							<div className="relative aspect-4/3 bg-slate-100 dark:bg-slate-800 overflow-hidden">
								{artwork.images_url[0] ? (
									<Image
										src={artwork.images_url[0]}
										alt={artwork.title}
										fill
										sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
										className="object-cover group-hover:scale-105 transition-transform duration-300"
									/>
								) : (
									<div className="absolute inset-0 flex items-center justify-center">
										<ImageIcon className="w-8 h-8 text-content-muted/30" />
									</div>
								)}

								<div className="absolute top-2 left-2">
									<span className="text-[10px] font-medium bg-black/50 text-white px-2 py-0.5 rounded-full backdrop-blur-sm capitalize">
										{artwork.upload_type === "original"
											? "Orisinal"
											: artwork.upload_type === "fanart"
												? "Fan Art"
												: "Komisi"}
									</span>
								</div>

								{artwork.images_url.length > 1 && (
									<div className="absolute top-2 right-2">
										<span className="text-[10px] font-medium bg-black/50 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
											+{artwork.images_url.length - 1}
										</span>
									</div>
								)}
							</div>

							<div className="p-3 space-y-2">
								<p className="text-sm font-semibold text-content leading-snug line-clamp-1 group-hover:text-primary transition-colors">
									{artwork.title}
								</p>

								{artwork.tags.length > 0 && (
									<div className="flex flex-wrap gap-1">
										{artwork.tags.slice(0, 3).map((tag) => (
											<span
												key={tag.id}
												className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
											>
												{tag.tag_name}
											</span>
										))}
										{artwork.tags.length > 3 && (
											<span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
												+{artwork.tags.length - 3}
											</span>
										)}
									</div>
								)}
							</div>
						</Link>
					))}
				</div>
			)}
		</section>
	);
}
