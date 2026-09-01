"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { ArtworkCardFooter } from "@/components/home/card/ArtworkCardFooter";
import { ArtworkCardHeader } from "@/components/home/card/ArtworkCardHeader";
import { ArtworkImageCarousel } from "@/components/home/card/ArtworkImageCarousel";
import ReportArtModal from "@/components/home/ReportArtModal";
import { useCreateReport } from "@/hooks/useReportQueries";
import { useModalStore } from "@/store/ModalStore";
import { useUserStore } from "@/store/UserStore";
import type { ArtworkWithRelations } from "@/types";

export function ArtworkCard({ artwork }: { artwork: ArtworkWithRelations }) {
	const router = useRouter();
	const { openModal } = useModalStore();
	const { user, isAuthenticated } = useUserStore();
	const createReportMutation = useCreateReport();

	const [isReportOpen, setIsReportOpen] = useState(false);

	const handleReportClick = () => {
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

	return (
		<article className="bg-surface rounded-lg overflow-hidden border border-transparent transition-all duration-200">
			{/* 1. Header: Artist Identity, Follow, & Actions */}
			<ArtworkCardHeader artwork={artwork} onReportClick={handleReportClick} />

			{/* 2. Media: Responsive Swipeable Image Carousel */}
			<ArtworkImageCarousel artwork={artwork} />

			{/* 3. Footer: Details, Tags, & Commission Action */}
			<ArtworkCardFooter artwork={artwork} />

			{/* Report Art Modal */}
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
