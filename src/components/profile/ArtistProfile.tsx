import {
	BadgeCheck,
	CalendarDays,
	ImageIcon,
	Palette,
	ShieldCheck,
	UserMinus,
	Wallet,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import AvatarInitials from "@/components/home/AvatarInitials";
import AccountMeta from "@/components/profile/AccountMeta";
import ArtistPortfolio from "@/components/profile/ArtistPortfolio";
import EditProfileModal, {
	type EditProfileFormValues,
} from "@/components/profile/EditProfileModal";
import ProfileHeading from "@/components/profile/ProfileHeading";
import SummaryRow from "@/components/profile/SummaryRow";
import type { ProfileUser } from "@/components/profile/types";
import Button from "@/components/ui/Button";
import Stat from "@/components/ui/Stat";
import { useArtworkStore } from "@/store/ArtworkStore";
import { useCommissionStore } from "@/store/CommissionStore";
import { useFollowStore } from "@/store/FollowStore";
import { useModalStore } from "@/store/ModalStore";
import { useProfileStore } from "@/store/ProfileStore";
import { useToastStore } from "@/store/ToastStore";
import { useUserManagementStore } from "@/store/UserManagementStore";
import { useUserStore } from "@/store/UserStore";
import { formatPrice } from "@/utils";
import {
	evaluateVerification,
	VERIFICATION_MIN_APPROVED,
} from "@/utils/artistVerification";
import { buildArtworkWithRelations } from "@/utils/search";

interface ArtistProfileProps {
	user: ProfileUser;
}

export default function ArtistProfile({ user }: ArtistProfileProps) {
	const router = useRouter();
	const { openModal } = useModalStore();
	const { commissions } = useCommissionStore();
	const { artworks, artworkTags, tags } = useArtworkStore();
	const { profiles, updateProfile } = useProfileStore();
	const { updateUser: updateUserRecord, users } = useUserManagementStore();
	const { updateCurrentUser } = useUserStore();
	const { addToast } = useToastStore();
	const [isEditOpen, setIsEditOpen] = useState(false);
	const { getFollowedArtistIds, unfollowArtist } = useFollowStore();
	const [activeTab, setActiveTab] = useState<"portfolio" | "following">(
		"portfolio",
	);

	const profile = profiles.find((item) => item.user_id === user.id);

	const followedArtistIds = getFollowedArtistIds(user.id);
	const followedArtists = useMemo(() => {
		return users
			.filter((u) => followedArtistIds.includes(u.id))
			.map((u) => {
				const prof = profiles.find((p) => p.user_id === u.id);
				return {
					...u,
					profile: prof,
				};
			});
	}, [users, followedArtistIds, profiles]);
	const artistArtworks = buildArtworkWithRelations(
		artworks,
		artworkTags,
		tags,
		users,
	).filter((artwork) => artwork.artists_id === user.id);
	const verificationProgress = evaluateVerification(
		artworks.filter((artwork) => artwork.artists_id === user.id),
	);
	const artistCommissions = commissions.filter(
		(commission) => commission.artists_id === user.id,
	);

	const artistUser = users.find((u) => u.id === user.id) || user;

	const joinedDate = new Date(user.created_at).toLocaleDateString("id-ID", {
		year: "numeric",
		month: "long",
	});
	const formattedPrice = profile?.base_price_idr
		? formatPrice(profile.base_price_idr)
		: null;

	const handleEditSubmit = (values: EditProfileFormValues) => {
		const trimmedName = values.name.trim();
		const nameChanged = trimmedName !== user.name;

		const nameResult = nameChanged
			? updateUserRecord(user.id, { name: trimmedName })
			: { success: true, message: "" };

		const profileResult = updateProfile(user.id, {
			bio: values.bio.trim() || null,
			base_price_idr: values.base_price_idr,
			is_open_for_commission: values.is_open_for_commission,
		});

		if (nameChanged && nameResult.success) {
			updateCurrentUser({ name: trimmedName });
		}

		const success = nameResult.success && profileResult.success;

		addToast({
			message: success
				? "Profil berhasil diperbarui"
				: !nameResult.success
					? nameResult.message
					: profileResult.message,
			type: success ? "success" : "error",
		});

		if (success) setIsEditOpen(false);
	};

	return (
		<div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
			<ProfileHeading
				eyebrow="Profil Artist"
				title="Kelola portfolio dan komisi"
				description="Pantau status verifikasi, karya terkurasi, dan kesiapan menerima komisi."
			/>

			<div className="flex flex-col lg:flex-row gap-6">
				<div className="flex-1 bg-surface border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
					<div className="flex items-start gap-4">
						<AvatarInitials
							name={user.name}
							className="w-20 h-20 text-2xl shrink-0"
						/>

						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2 flex-wrap">
								<h2 className="font-display text-2xl font-bold text-content">
									{user.name}
								</h2>
								{profile?.is_verified && (
									<span className="inline-flex items-center gap-1 text-xs font-medium text-verified bg-verified/10 px-2 py-0.5 rounded-full">
										<BadgeCheck className="w-3.5 h-3.5" />
										Terverifikasi
									</span>
								)}
								{profile?.strike_count !== undefined &&
									profile.strike_count >= 5 && (
										<span className="inline-flex items-center gap-1 text-xs font-medium text-danger bg-danger/10 px-2 py-0.5 rounded-full">
											Blocked
										</span>
									)}
							</div>

							<AccountMeta user={user} />

							<p className="mt-4 text-content-muted text-sm leading-relaxed">
								{profile?.bio ??
									"Lengkapi bio artist agar client memahami gaya dan layanan komisi kamu."}
							</p>

							<div className="mt-4 flex flex-wrap gap-4 text-sm">
								<Stat variant="inline" icon={ImageIcon}>
									<strong className="text-content">
										{profile?.approved_portfolio_count ?? artistArtworks.length}
									</strong>{" "}
									Karya
								</Stat>
								<Stat variant="inline" icon={CalendarDays}>
									Bergabung {joinedDate}
								</Stat>
								<Stat variant="inline" icon={Palette}>
									{artistArtworks.length} karya di portfolio
								</Stat>
							</div>
						</div>
					</div>

					<div className="mt-5 flex items-start gap-3 rounded-xl bg-verified/5 border border-verified/20 px-4 py-3">
						<ShieldCheck className="w-5 h-5 text-verified shrink-0 mt-0.5" />
						<div>
							<p className="text-sm font-medium text-content">
								{profile?.is_verified
									? "Human-Verified Artist"
									: "Menunggu Verifikasi Artist"}
							</p>
							<p className="text-xs text-content-muted mt-0.5">
								{profile?.is_verified
									? "Portfolio kamu sudah lolos kurasi TruBrush dan dapat dipercaya sebagai karya manusia."
									: "Selesaikan verifikasi agar portfolio dan layanan komisi lebih dipercaya client."}
							</p>
						</div>
					</div>

					{!profile?.is_verified && (
						<div className="mt-5 rounded-xl bg-primary/5 px-3 py-3">
							<div className="flex items-center justify-between text-xs text-content-muted">
								<span>Progress verifikasi</span>
								<span className="font-medium text-content">
									{verificationProgress.approved}/{VERIFICATION_MIN_APPROVED}{" "}
									karya approved
								</span>
							</div>
							<div className="mt-2 h-1.5 w-full rounded-full bg-content/10">
								<div
									className="h-1.5 rounded-full bg-primary transition-all"
									style={{
										width: `${Math.min(100, (verificationProgress.approved / VERIFICATION_MIN_APPROVED) * 100)}%`,
									}}
								/>
							</div>
							<p className="mt-1.5 text-xs text-content-muted">
								{verificationProgress.neededForEligibility} karya approved lagi
								menuju verifikasi.
							</p>
						</div>
					)}
				</div>

				<aside className="lg:w-72 shrink-0">
					<div className="bg-surface border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sticky top-24 space-y-4">
						<h2 className="font-heading font-semibold text-content">
							Ringkasan Artist
						</h2>

						<SummaryRow label="Verifikasi">
							<span
								className={
									profile?.is_verified
										? "font-medium text-verified"
										: "font-medium text-content"
								}
							>
								{profile?.is_verified ? "Aktif" : "Belum aktif"}
							</span>
						</SummaryRow>
						<SummaryRow label="Komisi">
							{profile?.is_open_for_commission ? "Dibuka" : "Ditutup"}
						</SummaryRow>
						<SummaryRow label="Order masuk">
							{artistCommissions.length}
						</SummaryRow>
						<SummaryRow label="Strike Count">
							<span
								className={
									profile?.strike_count && profile.strike_count > 0
										? "text-danger font-bold"
										: "text-content"
								}
							>
								{profile?.strike_count ?? 0} / 5
							</span>
						</SummaryRow>

						{formattedPrice && (
							<div className="flex items-center gap-2 rounded-xl bg-primary/5 px-3 py-3">
								<Wallet className="w-4 h-4 text-primary shrink-0" />
								<div>
									<p className="text-xs text-content-muted">Harga mulai</p>
									<p className="font-display text-xl font-bold text-primary">
										{formattedPrice}
									</p>
								</div>
							</div>
						)}

						<div className="flex items-center gap-2 rounded-xl bg-verified/5 border border-verified/20 px-3 py-3">
							<Wallet className="w-4 h-4 text-verified shrink-0" />
							<div>
								<p className="text-[10px] text-content-muted">
									Saldo Dompet Artist
								</p>
								<p className="font-display text-lg font-bold text-verified">
									{formatPrice(artistUser.balance ?? 0)}
								</p>
							</div>
						</div>

						<hr className="border-slate-200 dark:border-slate-700" />

						<div className="space-y-2">
							<Button
								onClick={() => setIsEditOpen(true)}
								className="w-full text-sm justify-center"
							>
								Edit Profil
							</Button>
							<button
								type="button"
								onClick={() => {
									if (profile && profile.strike_count >= 5) {
										openModal({
											title: "Akun Ditangguhkan (Blocked)",
											description:
												"Akun Anda telah ditangguhkan karena melanggar aturan TruBrush (Strike Count mencapai 5/5). Anda tidak dapat mengunggah karya baru.",
											type: "alert",
											variant: "danger",
										});
									} else {
										router.push("/post-art");
									}
								}}
								className="flex w-full justify-center rounded-lg bg-accent/20 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-accent/40 dark:text-accent cursor-pointer border-transparent"
							>
								Upload Karya
							</button>
						</div>
					</div>
				</aside>
			</div>

			{/* Tab Switcher */}
			<div className="flex border-b border-content/10">
				<button
					type="button"
					onClick={() => setActiveTab("portfolio")}
					className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
						activeTab === "portfolio"
							? "border-primary text-primary"
							: "border-transparent text-content-muted hover:text-content"
					}`}
				>
					Karya Saya
				</button>
				<button
					type="button"
					onClick={() => setActiveTab("following")}
					className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
						activeTab === "following"
							? "border-primary text-primary"
							: "border-transparent text-content-muted hover:text-content"
					}`}
				>
					Artis Diikuti ({followedArtists.length})
				</button>
			</div>

			{activeTab === "portfolio" ? (
				<ArtistPortfolio artworksWithTags={artistArtworks} />
			) : (
				<section className="space-y-4">
					{followedArtists.length === 0 ? (
						<div className="bg-surface border border-content/10 rounded-2xl p-8 text-center">
							<p className="text-sm text-content-muted">
								Anda belum mengikuti artis manapun.
							</p>
						</div>
					) : (
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{followedArtists.map((artist) => (
								<div
									key={artist.id}
									className="bg-surface border border-content/10 rounded-2xl p-4 flex items-center justify-between gap-4 hover:shadow-sm transition-all"
								>
									<Link
										href={`/artists/${artist.id}`}
										className="flex items-center gap-3 flex-1 min-w-0"
									>
										<AvatarInitials
											name={artist.name}
											className="w-12 h-12 text-sm shrink-0"
										/>
										<div className="min-w-0">
											<p className="text-sm font-bold text-content truncate hover:text-primary transition-colors">
												{artist.name}
											</p>
											<p className="text-xs text-content-muted truncate">
												{artist.profile?.bio || "Belum ada bio."}
											</p>
										</div>
									</Link>
									<button
										type="button"
										onClick={() => unfollowArtist(user.id, artist.id)}
										className="px-3 py-1.5 text-xs font-semibold border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:border-red-500/20 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shrink-0"
									>
										<UserMinus className="w-3.5 h-3.5" />
										Batal Ikuti
									</button>
								</div>
							))}
						</div>
					)}
				</section>
			)}

			<EditProfileModal
				userName={user.name}
				profile={profile}
				isOpen={isEditOpen}
				onClose={() => setIsEditOpen(false)}
				onSubmit={handleEditSubmit}
			/>
		</div>
	);
}
