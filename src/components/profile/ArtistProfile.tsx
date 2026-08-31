"use client";

import {
	ArrowUpRight,
	BadgeCheck,
	CalendarDays,
	Camera,
	Globe,
	ImageIcon,
	Loader2,
	Palette,
	ShieldCheck,
	UserMinus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import instagramIcon from "@/assets/instagram.svg";
import pixivIcon from "@/assets/pixiv.svg";
import xIcon from "@/assets/x.svg";
import AvatarInitials from "@/components/home/AvatarInitials";
import AccountMeta from "@/components/profile/AccountMeta";
import { ArtistAppealBox } from "@/components/profile/ArtistAppealBox";
import ArtistPortfolio from "@/components/profile/ArtistPortfolio";
import { ArtistVerificationBanner } from "@/components/profile/ArtistVerificationBanner";
import ClientCommissionHistory from "@/components/profile/ClientCommissionHistory";
import EditProfileModal, {
	type EditProfileFormValues,
} from "@/components/profile/EditProfileModal";
import ProfileHeading from "@/components/profile/ProfileHeading";
import SummaryRow from "@/components/profile/SummaryRow";
import WalletTransactionsList from "@/components/profile/WalletTransactionsList";
import Button from "@/components/ui/Button";
import Stat from "@/components/ui/Stat";
import { useArtworks } from "@/hooks/useArtworkQueries";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useModalStore } from "@/store/ModalStore";
import type { ProfileUser } from "@/types";
import { formatPrice } from "@/utils";
import { evaluateVerification } from "@/utils/artistVerification";

interface ArtistProfileProps {
	user: ProfileUser;
}

export default function ArtistProfile({ user }: ArtistProfileProps) {
	const router = useRouter();
	const { openModal } = useModalStore();
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<
		"portfolio" | "commissions" | "following" | "transactions"
	>("portfolio");

	const {
		profile,
		followedArtists,
		userCommissions: artistCommissions,
		isUploadingAvatar,
		handleAvatarUpload,
		handleUnfollowArtist,
		updateProfile,
		updateUserData,
		updateCurrentUser,
		addToast,
	} = useUserProfile(user.id);

	const handleAvatarInputChange = async (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files?.[0];
		if (file) {
			await handleAvatarUpload(file);
		}
	};

	const { data: artistArtworks = [] } = useArtworks({ artistId: user.id });

	const verificationProgress = useMemo(() => {
		return evaluateVerification(artistArtworks);
	}, [artistArtworks]);

	const joinedDate = new Date(user.created_at).toLocaleDateString("id-ID", {
		year: "numeric",
		month: "long",
	});
	const formattedPrice =
		profile?.base_price_idr !== null && profile?.base_price_idr !== undefined
			? formatPrice(profile.base_price_idr)
			: null;

	const handleEditSubmit = async (values: EditProfileFormValues) => {
		const trimmedName = values.name.trim();
		const nameChanged = trimmedName !== user.name;

		const nameResult = nameChanged
			? await updateUserData(user.id, { name: trimmedName })
			: { success: true, message: "" };

		const profileResult = await updateProfile(user.id, {
			bio: values.bio.trim() || null,
			base_price_idr: values.base_price_idr || null,
			is_open_for_commission: values.is_open_for_commission,
			social_links: {
				instagram: values.instagram_url?.trim() || undefined,
				twitter: values.twitter_url?.trim() || undefined,
				pixiv: values.pixiv_url?.trim() || undefined,
				website: values.website_url?.trim() || undefined,
			},
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
		<div className="max-w-5xl mx-auto px-3 sm:px-6 py-5 sm:py-8 space-y-6 sm:space-y-8 w-full">
			<ProfileHeading
				eyebrow="Profil Artist"
				title="Kelola portfolio & komisi"
				description="Atur informasi profil, tautan media sosial, portofolio karya, dan pesanan komisi Anda."
			/>

			<div className="flex flex-col lg:flex-row gap-5 sm:gap-6 w-full">
				{/* Main Profile Info Card */}
				<div className="flex-1 min-w-0 w-full bg-surface border border-content/10 rounded-2xl p-4 sm:p-6 overflow-hidden">
					<div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5">
						<div className="relative group cursor-pointer shrink-0">
							<AvatarInitials
								name={user.name}
								src={profile?.avatar_url}
								className="w-16 h-16 sm:w-20 sm:h-20 text-xl sm:text-2xl"
							/>
							<label className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
								{" "}
								{isUploadingAvatar ? (
									<Loader2 className="w-5 h-5 text-white animate-spin" />
								) : (
									<Camera className="w-5 h-5 text-white" />
								)}
								<input
									type="file"
									accept="image/*"
									className="hidden"
									disabled={isUploadingAvatar}
									onChange={handleAvatarInputChange}
								/>
							</label>
						</div>

						<div className="flex-1 min-w-0 w-full">
							<div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
								<h2 className="font-display text-xl sm:text-2xl font-bold text-content truncate">
									{user.name}
								</h2>
								{profile?.is_verified && (
									<span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium text-verified bg-verified/10 px-2 py-0.5 rounded-full">
										<BadgeCheck className="w-3.5 h-3.5" />
										Terverifikasi
									</span>
								)}
								{profile?.strike_count !== undefined &&
									profile.strike_count >= 5 && (
										<span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium text-danger bg-danger/10 px-2 py-0.5 rounded-full">
											Blocked
										</span>
									)}
							</div>

							<AccountMeta user={user} />

							<p className="mt-3 sm:mt-4 text-content-muted text-xs sm:text-sm leading-relaxed w-full">
								{profile?.bio ??
									"Lengkapi bio artist agar client memahami gaya dan layanan komisi kamu."}
							</p>

							<div className="mt-3.5 sm:mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 text-xs sm:text-sm w-full">
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
									{artistArtworks.length} di portfolio
								</Stat>
							</div>

							{profile?.social_links &&
								Object.values(profile.social_links).some(Boolean) && (
									<div className="mt-3.5 sm:mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-3 border-t border-content/10 w-full">
										{profile.social_links.instagram && (
											<Link
												href={
													profile.social_links.instagram.startsWith("http")
														? profile.social_links.instagram
														: `https://instagram.com/${profile.social_links.instagram.replace(/^@/, "")}`
												}
												target="_blank"
												rel="noopener noreferrer"
												className="social-link-badge text-xs"
											>
												<Image
													src={instagramIcon}
													alt="Instagram"
													width={14}
													height={14}
													className="w-3.5 h-3.5 object-contain dark:invert"
												/>
												Instagram
											</Link>
										)}
										{profile.social_links.twitter && (
											<Link
												href={
													profile.social_links.twitter.startsWith("http")
														? profile.social_links.twitter
														: `https://x.com/${profile.social_links.twitter.replace(/^@/, "")}`
												}
												target="_blank"
												rel="noopener noreferrer"
												className="social-link-badge text-xs"
											>
												<Image
													src={xIcon}
													alt="Twitter / X"
													width={14}
													height={14}
													className="w-3.5 h-3.5 object-contain dark:invert"
												/>
												Twitter / X
											</Link>
										)}
										{profile.social_links.pixiv && (
											<Link
												href={
													profile.social_links.pixiv.startsWith("http")
														? profile.social_links.pixiv
														: `https://${profile.social_links.pixiv}`
												}
												target="_blank"
												rel="noopener noreferrer"
												className="social-link-badge text-xs"
											>
												<Image
													src={pixivIcon}
													alt="Pixiv"
													width={14}
													height={14}
													className="w-3.5 h-3.5 object-contain dark:invert"
												/>
												Pixiv
											</Link>
										)}
										{profile.social_links.website && (
											<Link
												href={
													profile.social_links.website.startsWith("http")
														? profile.social_links.website
														: `https://${profile.social_links.website}`
												}
												target="_blank"
												rel="noopener noreferrer"
												className="social-link-badge text-xs"
											>
												<Globe className="w-3.5 h-3.5 text-primary" />
												Website
											</Link>
										)}
									</div>
								)}
						</div>
					</div>

					<div className="mt-4 sm:mt-5 flex items-start gap-2.5 sm:gap-3 rounded-xl bg-verified/5 border border-verified/20 p-3 sm:px-4 sm:py-3 text-left w-full">
						<ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-verified shrink-0 mt-0.5" />
						<div className="min-w-0 flex-1">
							<p className="text-xs sm:text-sm font-medium text-content">
								{profile?.is_verified
									? "Human-Verified Artist"
									: "Menunggu Verifikasi Artist"}
							</p>
							<p className="text-[11px] sm:text-xs text-content-muted mt-0.5 leading-relaxed">
								{profile?.is_verified
									? "Portfolio kamu sudah lolos kurasi TruBrush dan dapat dipercaya sebagai karya manusia."
									: "Selesaikan verifikasi agar portfolio dan layanan komisi lebih dipercaya client."}
							</p>
						</div>
					</div>

					<div className="mt-4 w-full">
						<ArtistVerificationBanner
							isVerified={profile?.is_verified}
							approvedCount={verificationProgress.approved}
							neededForEligibility={verificationProgress.neededForEligibility}
						/>
					</div>

					<div className="mt-4 w-full">
						<ArtistAppealBox
							userId={user.id}
							strikeCount={profile?.strike_count ?? 0}
						/>
					</div>
				</div>

				{/* Sidebar Summary Card */}
				<aside className="w-full lg:w-72 shrink-0 min-w-0">
					<div className="bg-surface border border-content/10 rounded-2xl p-4 sm:p-5 sticky top-24 space-y-3.5 sm:space-y-4 w-full">
						<h2 className="font-heading font-semibold text-content text-sm sm:text-base">
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
						<SummaryRow label="Strike count">
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

						<hr className="border-content/10" />

						{formattedPrice && (
							<SummaryRow label="Harga mulai">
								<span className="font-semibold text-primary">
									{formattedPrice}
								</span>
							</SummaryRow>
						)}
						<SummaryRow label="Saldo dompet">
							<span className="font-semibold text-verified">
								{formatPrice(user.balance ?? 0)}
							</span>
						</SummaryRow>

						<Link
							href="/withdraw"
							className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-600/20 border border-emerald-500/20 px-3 py-2 text-xs font-bold transition-colors"
						>
							<ArrowUpRight className="w-3.5 h-3.5" />
							Tarik Saldo (Min. Rp 100.000)
						</Link>

						<hr className="border-content/10" />

						<div className="space-y-2">
							<Button
								onClick={() => setIsEditOpen(true)}
								className="w-full text-xs sm:text-sm justify-center"
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
								className="flex w-full justify-center rounded-lg bg-accent/20 px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-primary transition-colors hover:bg-accent/40 dark:text-accent cursor-pointer border-transparent"
							>
								Upload Karya
							</button>
						</div>
					</div>
				</aside>
			</div>

			{/* Tab Switcher */}
			<div className="flex border-b border-content/10 overflow-x-auto no-scrollbar w-full">
				<button
					type="button"
					onClick={() => setActiveTab("portfolio")}
					className={`px-3.5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
						activeTab === "portfolio"
							? "border-primary text-primary"
							: "border-transparent text-content-muted hover:text-content"
					}`}
				>
					Karya Saya
				</button>
				<button
					type="button"
					onClick={() => setActiveTab("commissions")}
					className={`px-3.5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
						activeTab === "commissions"
							? "border-primary text-primary"
							: "border-transparent text-content-muted hover:text-content"
					}`}
				>
					Pesanan Komisi ({artistCommissions.length})
				</button>
				<button
					type="button"
					onClick={() => setActiveTab("following")}
					className={`px-3.5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
						activeTab === "following"
							? "border-primary text-primary"
							: "border-transparent text-content-muted hover:text-content"
					}`}
				>
					Artis Diikuti ({followedArtists.length})
				</button>
				<button
					type="button"
					onClick={() => setActiveTab("transactions")}
					className={`px-3.5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
						activeTab === "transactions"
							? "border-primary text-primary"
							: "border-transparent text-content-muted hover:text-content"
					}`}
				>
					Transaksi E-Wallet
				</button>
			</div>

			{activeTab === "portfolio" ? (
				<ArtistPortfolio artworksWithTags={artistArtworks} />
			) : activeTab === "commissions" ? (
				<ClientCommissionHistory
					commissions={artistCommissions}
					isArtist={true}
				/>
			) : activeTab === "following" ? (
				<section className="space-y-4 w-full min-w-0">
					{followedArtists.length === 0 ? (
						<div className="bg-surface border border-content/10 rounded-2xl p-6 sm:p-8 text-center w-full">
							<p className="text-xs sm:text-sm text-content-muted">
								Anda belum mengikuti artis manapun.
							</p>
						</div>
					) : (
						<div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
							{followedArtists.map((artist) => {
								const bioText = artist.profile?.bio
									? artist.profile.bio.length > 30
										? `${artist.profile.bio.slice(0, 30)}...`
										: artist.profile.bio
									: "Belum ada bio.";

								return (
									<div
										key={artist.id}
										className="bg-surface border border-content/10 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-2.5 sm:gap-3 hover:shadow-sm transition-all overflow-hidden w-full min-w-0"
									>
										<Link
											href={`/artists/${artist.id}`}
											className="flex items-center gap-2.5 flex-1 min-w-0"
										>
											<AvatarInitials
												name={artist.name}
												className="w-9 h-9 sm:w-10 sm:h-10 text-xs shrink-0"
												src={artist.profile?.avatar_url}
											/>
											<div className="min-w-0 flex-1">
												<p className="text-xs sm:text-sm font-bold text-content truncate hover:text-primary transition-colors">
													{artist.name}
												</p>
												<p className="text-[10px] sm:text-xs text-content-muted truncate max-w-full">
													{bioText}
												</p>
											</div>
										</Link>
										<button
											type="button"
											onClick={() => handleUnfollowArtist(artist.id)}
											className="px-2 py-1 text-[11px] sm:text-xs font-medium border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:border-red-500/20 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shrink-0"
											title="Batal Ikuti"
										>
											<UserMinus className="w-3.5 h-3.5" />
											<span className="hidden sm:inline">Batal</span>
										</button>
									</div>
								);
							})}
						</div>
					)}
				</section>
			) : (
				<WalletTransactionsList userId={user.id} />
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
