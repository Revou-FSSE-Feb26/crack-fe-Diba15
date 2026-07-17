import { BadgeCheck } from "lucide-react";
import Link from "next/link";
import CommissionButton from "@/components/detail/CommissionButton";
import AvatarInitials from "@/components/home/AvatarInitials";
import Pill from "@/components/ui/Pill";
import type { ProfileWithUser } from "@/types";
import { formatPrice } from "@/utils";

export default function FeaturedArtist({
	profile,
}: {
	profile: ProfileWithUser;
}) {
	const {
		user,
		is_verified,
		is_open_for_commission,
		base_price_idr,
		approved_portfolio_count,
	} = profile;

	return (
		<div className="bg-surface border border-content/10 rounded-xl p-3 mb-2 last:mb-0">
			{/* Header */}
			<Link
				href={`/artists/${user.id}`}
				className="flex items-center gap-2.5 mb-2.5"
			>
				<AvatarInitials
					name={user.name}
					src={profile.avatar_url}
					className="w-9 h-9"
				/>
				<div className="min-w-0">
					<div className="flex items-center gap-1">
						<p className="text-sm font-medium text-content truncate">
							{user.name}
						</p>
						{is_verified && (
							<BadgeCheck className="w-3.5 h-3.5 text-verified shrink-0" />
						)}
					</div>
					<p className="text-[10px] text-content-muted">
						{approved_portfolio_count} karya terverifikasi
					</p>
				</div>
			</Link>

			{/* Status & harga */}
			<div className="flex items-center justify-between mb-2.5">
				<Pill
					className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
						is_open_for_commission
							? "bg-verified/10 text-verified"
							: "bg-content/10 text-content-muted"
					}`}
				>
					{is_open_for_commission ? "Open Komisi" : "Closed"}
				</Pill>
				<Pill className="text-[11px] font-medium text-warm-hover bg-warm/10 px-2 py-0.5 rounded-full">
					mulai {formatPrice(base_price_idr)}
				</Pill>
			</div>

			{/* Tombol hire */}
			{is_open_for_commission && (
				<CommissionButton
					artistId={user.id}
					artistName={user.name}
					basePrice={base_price_idr}
					className="text-xs font-medium py-1.5 rounded-lg transition-colors duration-150"
				>
					Hire Artis
				</CommissionButton>
			)}
		</div>
	);
}
