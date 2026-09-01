"use client";

import { useMemo, useState } from "react";
import ArtistPortfolio from "@/components/profile/ArtistPortfolio";
import { ArtistFollowingTab } from "@/components/profile/artist/ArtistFollowingTab";
import { ArtistProfileHeroCard } from "@/components/profile/artist/ArtistProfileHeroCard";
import { ArtistProfileSidebar } from "@/components/profile/artist/ArtistProfileSidebar";
import ClientCommissionHistory from "@/components/profile/ClientCommissionHistory";
import EditProfileModal, {
	type EditProfileFormValues,
} from "@/components/profile/EditProfileModal";
import ProfileHeading from "@/components/profile/ProfileHeading";
import WalletTransactionsList from "@/components/profile/WalletTransactionsList";
import { useArtworks } from "@/hooks/useArtworkQueries";
import { useUserProfile } from "@/hooks/useUserProfile";
import type { ProfileUser } from "@/types";
import { formatPrice } from "@/utils";
import { evaluateVerification } from "@/utils/artistVerification";

interface ArtistProfileProps {
	user: ProfileUser;
}

export default function ArtistProfile({ user }: ArtistProfileProps) {
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

	const handleAvatarInputChange = async (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files?.[0];
		if (file) {
			await handleAvatarUpload(file);
		}
	};

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

			{/* Top Hero Card & Sidebar */}
			<div className="flex flex-col lg:flex-row gap-5 sm:gap-6 w-full">
				<ArtistProfileHeroCard
					user={user}
					profile={profile}
					isUploadingAvatar={isUploadingAvatar}
					onAvatarInputChange={handleAvatarInputChange}
					artistArtworksCount={artistArtworks.length}
					verificationProgress={verificationProgress}
					joinedDate={joinedDate}
				/>

				<ArtistProfileSidebar
					user={user}
					profile={profile}
					commissionsCount={artistCommissions.length}
					formattedPrice={formattedPrice}
					onEditClick={() => setIsEditOpen(true)}
				/>
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

			{/* Tab Contents */}
			{activeTab === "portfolio" ? (
				<ArtistPortfolio artworksWithTags={artistArtworks} />
			) : activeTab === "commissions" ? (
				<ClientCommissionHistory
					commissions={artistCommissions}
					isArtist={true}
				/>
			) : activeTab === "following" ? (
				<ArtistFollowingTab
					followedArtists={followedArtists}
					onUnfollowArtist={handleUnfollowArtist}
				/>
			) : (
				<WalletTransactionsList userId={user.id} />
			)}

			{/* Edit Profile Modal */}
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
