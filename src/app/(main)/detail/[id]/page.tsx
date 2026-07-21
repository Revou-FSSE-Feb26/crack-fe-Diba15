"use client";

import {
	BadgeCheck,
	Check,
	ChevronDown,
	Flag,
	ImageIcon,
	Loader2,
	PenTool,
	Share2,
	ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import CommissionButton from "@/components/detail/CommissionButton";
import FavoriteButton from "@/components/detail/FavoriteButton";
import AvatarInitials from "@/components/home/AvatarInitials";
import ReportArtModal from "@/components/home/ReportArtModal";
import { useArtworkDetail } from "@/hooks/useArtworkQueries";
import { useCopyLink } from "@/hooks/useCopyLink";
import { useLightboxStore } from "@/store/LightboxStore";
import { useModalStore } from "@/store/ModalStore";
import { useProfileStore } from "@/store/ProfileStore";
import { useReportStore } from "@/store/ReportStore";
import { useToastStore } from "@/store/ToastStore";
import { useUserManagementStore } from "@/store/UserManagementStore";
import { useUserStore } from "@/store/UserStore";
import { randomKey } from "@/utils/index";

export default function Detail() {
	const params = useParams();
	const router = useRouter();
	const id = params.id as string;
	const { openLightbox } = useLightboxStore();
	const [showWip, setShowWip] = useState(false);
	const { users } = useUserManagementStore();
	const { profiles } = useProfileStore();
	const { copied, copyPath } = useCopyLink({
		successMessage: "Link karya berhasil disalin.",
	});
	const { user, isAuthenticated } = useUserStore();
	const { addToast } = useToastStore();
	const { openModal } = useModalStore();
	const { createReport } = useReportStore();
	const [isReportOpen, setIsReportOpen] = useState(false);

	// Menggunakan TanStack Query v5 untuk mengambil detail karya
	const { data: artwork, isLoading } = useArtworkDetail(id);

	const handleReport = () => {
		if (!isAuthenticated || !user) {
			openModal({
				title: "Login diperlukan",
				description: "Silakan login terlebih dahulu untuk melaporkan karya.",
				type: "confirm",
				confirmLabel: "Login",
				cancelLabel: "Batal",
				onConfirm: () => router.push("/login"),
			});
			return;
		}
		if (user.role !== "artist" && user.role !== "client") {
			openModal({
				title: "Hanya client dan artist yang bisa melapor",
				description:
					"Akun dengan peran curator atau admin tidak diperbolehkan melaporkan karya.",
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
			if (!user || !artwork) return;
			const res = createReport({
				reporter_id: user.id,
				target_type: "artwork",
				target_id: artwork.id,
				reason,
			});
			if (res.success) {
				addToast({ message: res.message, type: "success" });
			} else {
				addToast({ message: res.message, type: "error" });
			}
			setIsReportOpen(false);
		},
		[user, artwork, createReport, addToast],
	);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background text-content">
				<Loader2 className="w-8 h-8 text-primary animate-spin" />
			</div>
		);
	}

	if (!artwork) {
		return (
			<main className="min-h-screen bg-background text-content pb-20">
				<div className="max-w-3xl mx-auto px-4 py-16 text-center">
					<div className="bg-surface border border-content/10 rounded-2xl p-8">
						<ImageIcon className="w-10 h-10 text-content-muted mx-auto mb-3" />
						<h1 className="text-2xl font-bold text-content">
							Artwork tidak ditemukan
						</h1>
						<p className="mt-2 text-sm text-content-muted">
							Karya ini belum tersedia atau sudah tidak ada di daftar artwork.
						</p>
					</div>
				</div>
			</main>
		);
	}

	const artist =
		users.find((u) => u.id === artwork.artists_id) || artwork.artist;
	const artistProfile =
		profiles.find((p) => p.user_id === artist?.id) || artwork.artist_profile;

	const handleCopyLink = (id: string) => {
		copyPath(id);
	};

	return (
		<main className="min-h-screen bg-background text-content pb-20">
			<div className="max-w-6xl mx-auto px-4 py-6">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
					<div className="lg:col-span-2 space-y-4">
						{artwork.images_url.length > 0 ? (
							artwork.images_url.map((imgUrl: string, index: number) => {
								return (
									<div
										key={`${imgUrl}-${randomKey()}`}
										className="relative w-full rounded-xl overflow-hidden shadow-sm"
									>
										<button
											type="button"
											onClick={() =>
												openLightbox(artwork.images_url, index, artwork.title)
											}
											className="w-full h-auto bg-transparent cursor-pointer"
										>
											<Image
												src={imgUrl}
												alt={`${artwork.title} - Image ${index + 1}`}
												width={0}
												height={0}
												sizes="100vw"
												className="w-full h-auto"
												loading={index === 0 ? "eager" : "lazy"}
											/>
										</button>
									</div>
								);
							})
						) : (
							<div className="w-full aspect-video bg-content/5 rounded-xl flex items-center justify-center">
								<p className="text-content-muted">Tidak ada gambar tersedia.</p>
							</div>
						)}

						{artwork.wip_proof_url && (
							<div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-surface">
								<button
									type="button"
									onClick={() => setShowWip((prev: boolean) => !prev)}
									className="w-full flex items-center justify-between px-4 py-3 text-left"
								>
									<span className="flex items-center gap-2 text-sm font-medium text-content">
										<PenTool className="w-4 h-4 text-primary" />
										Bukti Proses (WIP Proof)
									</span>
									<ChevronDown
										className={`w-4 h-4 text-content-muted transition-transform duration-200 ${showWip ? "rotate-180" : ""}`}
									/>
								</button>
								{showWip && (
									<div className="px-4 pb-4">
										<p className="text-xs text-content-muted mb-3">
											Bukti proses manual yang diverifikasi tim kurator TruBrush
											sebelum karya ini disetujui tampil.
										</p>
										<div className="relative w-full aspect-video rounded-lg overflow-hidden bg-content/5">
											<button
												type="button"
												onClick={() =>
													openLightbox(
														[
															artwork.wip_proof_url
																? artwork.wip_proof_url
																: "",
														],
														0,
														artwork.title,
													)
												}
												className="w-full h-auto bg-transparent cursor-pointer"
											>
												<Image
													src={artwork.wip_proof_url}
													alt={`WIP proof ${artwork.title}`}
													fill
													sizes="(max-width: 1024px) 100vw, 700px"
													className="object-cover"
												/>
											</button>
										</div>
									</div>
								)}
							</div>
						)}
					</div>

					<aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
						<div className="bg-surface p-5 rounded-xl border border-content/5 shadow-sm">
							<Link
								href={`/artists/${artwork.artist.id}`}
								className="flex items-center gap-3 mb-4"
							>
								<AvatarInitials
									name={artwork.artist.name}
									src={artistProfile?.avatar_url}
									className="w-12 h-12 text-lg"
								/>
								<div>
									<div className="flex items-center gap-1.5">
										<h2 className="font-bold text-lg">{artwork.artist.name}</h2>
										{artwork.artist_profile.is_verified && (
											<BadgeCheck className="w-5 h-5 text-verified" />
										)}
									</div>
									<p className="text-sm text-content-muted">Artist</p>
								</div>
							</Link>

							{artwork.curation_status === "approved" && (
								<div className="flex items-center gap-2 mb-4 rounded-lg bg-verified/10 px-3 py-2">
									<ShieldCheck className="w-4 h-4 text-verified shrink-0" />
									<p className="text-xs text-verified font-medium">
										Karya ini telah lolos kurasi TruBrush.
									</p>
								</div>
							)}

							{artwork.artist_profile.is_open_for_commission && (
								<CommissionButton
									artworkId={artwork.id}
									artworkTitle={artwork.title}
									artistId={artwork.artist.id}
									artistName={artwork.artist.name}
									basePrice={artistProfile?.base_price_idr ?? null}
								/>
							)}
						</div>

						<div className="space-y-4">
							<div>
								<h1 className="text-2xl font-bold mb-2">{artwork.title}</h1>
								<p className="text-content-muted leading-relaxed whitespace-pre-line">
									{artwork.description}
								</p>
							</div>

							{artwork.tags.length > 0 && (
								<div className="flex flex-wrap gap-2 pt-2">
									{artwork.tags.map((tag) => (
										<Link
											key={tag.id}
											href={`/search/${encodeURIComponent(`tags:"${tag.tag_name}"`)}`}
											className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full hover:bg-primary/20 transition-colors"
										>
											#{tag.tag_name}
										</Link>
									))}
								</div>
							)}

							<hr className="border-content/10 my-4" />

							<div className="flex items-center gap-4">
								<FavoriteButton
									artworkId={artwork.id}
									artworkTitle={artwork.title}
								/>
								<button
									type="button"
									title="Share"
									className="p-2.5 rounded-lg bg-content/5 hover:bg-content/10 text-content transition-colors cursor-pointer"
									onClick={() => handleCopyLink(artwork.id)}
								>
									{copied ? (
										<Check size={20} className="text-verified" />
									) : (
										<Share2 size={20} />
									)}
								</button>
								<button
									type="button"
									title="Laporkan"
									className="p-2.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors flex items-center gap-2 text-sm font-medium border border-red-200 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:border-red-500/20 cursor-pointer"
									onClick={handleReport}
								>
									<Flag size={18} />
									Laporkan
								</button>
							</div>
						</div>
					</aside>
				</div>
			</div>
			{user && artwork && (
				<ReportArtModal
					artworkId={artwork.id}
					artworkTitle={artwork.title}
					isOpen={isReportOpen}
					onClose={handleReportClose}
					onSubmit={handleReportSubmit}
				/>
			)}
		</main>
	);
}
