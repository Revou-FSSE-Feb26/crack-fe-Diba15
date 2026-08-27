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

		const social_links: Record<string, string> = {};
		if (values.instagram_url?.trim())
			social_links.instagram = values.instagram_url.trim();
		if (values.twitter_url?.trim())
			social_links.twitter = values.twitter_url.trim();
		if (values.pixiv_url?.trim()) social_links.pixiv = values.pixiv_url.trim();
		if (values.website_url?.trim())
			social_links.website = values.website_url.trim();

		const hasSocialLinks = Object.keys(social_links).length > 0;

		const nameResult = nameChanged
			? await updateUserData(user.id, { name: trimmedName })
			: { success: true, message: "" };

		const profileResult = await updateProfile(user.id, {
			bio: values.bio.trim() || null,
			base_price_idr: values.base_price_idr,
			is_open_for_commission: values.is_open_for_commission,
			social_links: hasSocialLinks ? social_links : null,
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
				<div className="flex-1 bg-surface border border-content/10 rounded-2xl p-6">
					<div className="flex items-start gap-4">
						<div className="relative group cursor-pointer shrink-0">
							<AvatarInitials
								name={user.name}
								src={profile?.avatar_url}
								className="w-20 h-20 text-2xl"
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

							{profile?.social_links &&
								Object.values(profile.social_links).some(Boolean) && (
									<div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-content/10">
										{profile.social_links.instagram && (
											<Link
												href={
													profile.social_links.instagram.startsWith("http")
														? profile.social_links.instagram
														: `https://instagram.com/${profile.social_links.instagram.replace(/^@/, "")}`
												}
												target="_blank"
												rel="noopener noreferrer"
												className="social-link-badge"
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
												className="social-link-badge"
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
												className="social-link-badge"
											>
												<Image
													src={pixivIcon}
													alt="Pixiv"
													width={14}
													height={14}
													className="w-3.5 h-3.5 object-contain dark:invert"
												/>
												Pixiv / Portofolio
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
												className="social-link-badge"
											>
												<Globe className="w-3.5 h-3.5 text-primary" />
												Website / Linktree
											</Link>
										)}
									</div>
								)}
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

					<ArtistVerificationBanner
						isVerified={profile?.is_verified}
						approvedCount={verificationProgress.approved}
						neededForEligibility={verificationProgress.neededForEligibility}
					/>

					<ArtistAppealBox
						userId={user.id}
						strikeCount={profile?.strike_count ?? 0}
					/>
				</div>

				<aside className="lg:w-72 shrink-0">
					<div className="bg-surface border border-content/10 rounded-2xl p-5 sticky top-24 space-y-4">
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
							className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-600/20 border border-emerald-500/20 px-4 py-2 text-xs font-bold transition-colors"
						>
							<ArrowUpRight className="w-3.5 h-3.5" />
							Tarik Saldo (Min. Rp 100.000)
						</Link>

						<hr className="border-content/10" />

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
			<div className="flex border-b border-content/10 overflow-x-auto">
				<button
					type="button"
					onClick={() => setActiveTab("portfolio")}
					className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
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
					className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
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
					className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
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
					className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
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
											src={artist.profile?.avatar_url}
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
										onClick={() => handleUnfollowArtist(artist.id)}
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
