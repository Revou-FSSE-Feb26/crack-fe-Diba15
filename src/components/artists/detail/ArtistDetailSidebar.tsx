"use client";

import { Heart, MessageCircle, ShieldCheck, Wallet } from "lucide-react";
import CommissionButton from "@/components/detail/CommissionButton";
import SummaryRow from "@/components/profile/SummaryRow";
import Button from "@/components/ui/Button";
import type { ArtistDetailResponse } from "@/types";
import { formatPrice } from "@/utils";

interface ArtistDetailSidebarProps {
	artist: ArtistDetailResponse;
}

export function ArtistDetailSidebar({ artist }: ArtistDetailSidebarProps) {
	const formattedPrice =
		artist.base_price_idr !== null && artist.base_price_idr !== undefined
			? formatPrice(artist.base_price_idr)
			: null;

	return (
		<aside className="w-full lg:w-72 shrink-0 min-w-0">
			<div className="bg-surface border border-content/10 rounded-2xl p-4 sm:p-5 sticky top-24 space-y-3.5 sm:space-y-4 w-full">
				<h2 className="font-heading font-semibold text-content text-sm sm:text-base">
					Pesan Komisi
				</h2>

				<SummaryRow label="Status Komisi">
					<span
						className={
							artist.is_open_for_commission
								? "font-medium text-verified"
								: "font-medium text-content-muted"
						}
					>
						{artist.is_open_for_commission ? "Dibuka" : "Ditutup"}
					</span>
				</SummaryRow>

				<SummaryRow label="Total Pengikut">
					<span className="font-medium text-content">
						{artist.followersCount}
					</span>
				</SummaryRow>

				<hr className="border-content/10" />

				{formattedPrice && (
					<div className="flex items-center gap-2.5 rounded-xl bg-primary/5 p-3 w-full min-w-0">
						<Wallet className="w-4 h-4 text-primary shrink-0" />
						<div className="min-w-0 flex-1">
							<p className="text-[11px] sm:text-xs text-content-muted">
								Harga mulai dari
							</p>
							<p className="font-display text-lg sm:text-xl font-bold text-primary truncate">
								{formattedPrice}
							</p>
						</div>
					</div>
				)}

				<div className="space-y-2 text-xs text-content-muted pt-1">
					<div className="flex items-center gap-2">
						<ShieldCheck className="w-3.5 h-3.5 text-verified shrink-0" />
						<span>Dana aman dengan sistem Escrow</span>
					</div>
					<div className="flex items-center gap-2">
						<MessageCircle className="w-3.5 h-3.5 text-primary shrink-0" />
						<span>Diskusi langsung dengan artist</span>
					</div>
					<div className="flex items-center gap-2">
						<Heart className="w-3.5 h-3.5 text-danger shrink-0" />
						<span>Garansi revisi inklusif</span>
					</div>
				</div>

				<hr className="border-content/10" />

				{artist.is_verified ? (
					artist.is_open_for_commission ? (
						<CommissionButton
							artistId={artist.user.id}
							artistName={artist.user.name}
							basePrice={artist.base_price_idr}
							isVerified={artist.is_verified}
							className="w-full text-xs sm:text-sm justify-center"
						>
							Pesan Komisi Sekarang
						</CommissionButton>
					) : (
						<Button
							variant="secondary"
							className="w-full text-xs sm:text-sm justify-center pointer-events-none opacity-60"
							disabled
						>
							Komisi Sedang Tutup
						</Button>
					)
				) : (
					<Button
						variant="danger"
						className="w-full text-xs sm:text-sm justify-center pointer-events-none opacity-60"
						disabled
					>
						Belum Diverifikasi
					</Button>
				)}

				{!artist.is_verified && (
					<p className="text-[11px] text-content-muted text-center leading-relaxed">
						Artist ini sedang dalam proses kurasi verifikasi TruBrush.
					</p>
				)}
			</div>
		</aside>
	);
}
