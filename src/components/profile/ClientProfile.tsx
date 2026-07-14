import {
	Briefcase,
	CalendarDays,
	Clock3,
	CreditCard,
	ShieldCheck,
	UserMinus,
	Wallet,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import AvatarInitials from "@/components/home/AvatarInitials";
import AccountMeta from "@/components/profile/AccountMeta";
import ClientCommissionHistory from "@/components/profile/ClientCommissionHistory";
import EditProfileModal, {
	type EditProfileFormValues,
} from "@/components/profile/EditProfileModal";
import ProfileHeading from "@/components/profile/ProfileHeading";
import SummaryRow from "@/components/profile/SummaryRow";
import TopUpModal from "@/components/profile/TopUpModal";
import type { ProfileUser } from "@/components/profile/types";
import WalletTransactionsList from "@/components/profile/WalletTransactionsList";
import Button from "@/components/ui/Button";
import Stat from "@/components/ui/Stat";
import { useCommissionStore } from "@/store/CommissionStore";
import { useFollowStore } from "@/store/FollowStore";
import { useProfileStore } from "@/store/ProfileStore";
import { useToastStore } from "@/store/ToastStore";
import { useTransactionStore } from "@/store/TransactionStore";
import { useUserManagementStore } from "@/store/UserManagementStore";
import { useUserStore } from "@/store/UserStore";
import { formatPrice } from "@/utils";

interface ClientProfileProps {
	user: ProfileUser;
}

export default function ClientProfile({
	user: initialUser,
}: ClientProfileProps) {
	const { commissions } = useCommissionStore();
	const { updateUser, users } = useUserManagementStore();
	const { user: currentUser, updateCurrentUser } = useUserStore();
	const { addToast } = useToastStore();
	const { profiles, updateProfile } = useProfileStore();
	const { getFollowedArtistIds, unfollowArtist } = useFollowStore();

	const [activeTab, setActiveTab] = useState<
		"commissions" | "following" | "transactions"
	>("commissions");

	const user = useMemo(() => {
		if (currentUser && currentUser.id === initialUser.id) {
			return currentUser;
		}
		return initialUser;
	}, [currentUser, initialUser]);

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

	const [isTopUpOpen, setIsTopUpOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);

	const handleTopUpSuccess = async (amount: number) => {
		const nextBalance = (user.balance ?? 0) + amount;
		const res = await updateUser(user.id, { balance: nextBalance });

		if (!res.success) {
			addToast({
				message: res.message,
				type: "error",
			});
			return;
		}

		if (currentUser?.id === user.id) {
			updateCurrentUser({ balance: nextBalance });
		}

		// Log transaction
		useTransactionStore.getState().addTransaction({
			user_id: user.id,
			type: "topup",
			amount: amount,
			title: "Top Up E-Wallet via Credit Card",
		});

		addToast({
			message: `Berhasil Top Up ${formatPrice(amount)} ke E-Wallet.`,
			type: "success",
		});
		setIsTopUpOpen(false);
	};

	const handleEditSubmit = async (values: EditProfileFormValues) => {
		const trimmedName = values.name.trim();
		const nameChanged = trimmedName !== user.name;

		const nameResult = nameChanged
			? await updateUser(user.id, { name: trimmedName })
			: { success: true, message: "" };

		const profileResult = await updateProfile(user.id, {
			bio: values.bio.trim() || null,
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
	const clientCommissions = useMemo(
		() =>
			commissions
				.filter((commission) => commission.client_id === user.id)
				.sort(
					(a, b) =>
						new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
				),
		[commissions, user.id],
	);

	const activeCommissions = clientCommissions.filter((commission) =>
		["pending", "accepted", "in_progress", "revision"].includes(
			commission.status,
		),
	);
	const completedCommissions = clientCommissions.filter(
		(commission) => commission.status === "completed",
	);
	const totalSpent = clientCommissions
		.filter((commission) => commission.payment_status !== "refunded")
		.reduce((total, commission) => total + commission.price, 0);

	const joinedDate = new Date(user.created_at).toLocaleDateString("id-ID", {
		year: "numeric",
		month: "long",
	});

	return (
		<div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
			<ProfileHeading
				eyebrow="Profil Client"
				title="Pantau riwayat komisi"
				description="Lihat pesanan aktif, histori pembayaran, dan komisi yang sudah selesai."
			/>

			<div className="flex flex-col lg:flex-row gap-6">
				<div className="flex-1 bg-surface border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
					<div className="flex items-start gap-4">
						<AvatarInitials
							name={user.name}
							className="w-20 h-20 text-2xl shrink-0"
						/>
						<div className="flex-1 min-w-0">
							<h2 className="font-display text-2xl font-bold text-content">
								{user.name}
							</h2>
							<AccountMeta user={user} />

							<p className="mt-4 text-content-muted text-sm leading-relaxed">
								{profiles[0]?.bio ||
									"Akun client digunakan untuk mencari artist human-verified, memesan komisi, dan memantau progres pekerjaan."}
							</p>

							<div className="mt-4 flex flex-wrap gap-4 text-sm">
								<Stat variant="inline" icon={Briefcase}>
									<strong className="text-content">
										{clientCommissions.length}
									</strong>{" "}
									Komisi
								</Stat>
								<Stat variant="inline" icon={Clock3}>
									{activeCommissions.length} sedang berjalan
								</Stat>
								<Stat variant="inline" icon={CalendarDays}>
									Bergabung {joinedDate}
								</Stat>
							</div>
						</div>
					</div>

					<div className="mt-5 flex items-start gap-3 rounded-xl bg-primary/5 border border-primary/20 px-4 py-3">
						<ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
						<div>
							<p className="text-sm font-medium text-content">
								Proteksi Komisi TruBrush
							</p>
							<p className="text-xs text-content-muted mt-0.5">
								Riwayat komisi membantu kamu melacak order, status pembayaran,
								dan hasil akhir dari artist.
							</p>
						</div>
					</div>
				</div>

				<aside className="lg:w-72 shrink-0">
					<div className="bg-surface border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sticky top-24 space-y-4">
						<h2 className="font-heading font-semibold text-content">
							Ringkasan Client
						</h2>

						<SummaryRow label="Order aktif">
							{activeCommissions.length}
						</SummaryRow>
						<SummaryRow label="Selesai">
							{completedCommissions.length}
						</SummaryRow>
						<SummaryRow label="Total komisi">
							{clientCommissions.length}
						</SummaryRow>

						<div className="flex items-center gap-2 rounded-xl bg-primary/5 px-3 py-3">
							<CreditCard className="w-4 h-4 text-primary shrink-0" />
							<div>
								<p className="text-xs text-content-muted">Total nilai order</p>
								<p className="font-display text-xl font-bold text-primary">
									{formatPrice(totalSpent)}
								</p>
							</div>
						</div>

						<div className="flex items-center justify-between rounded-xl bg-verified/5 border border-verified/20 px-3 py-3">
							<div className="flex items-center gap-2 min-w-0">
								<Wallet className="w-4 h-4 text-verified shrink-0" />
								<div className="min-w-0">
									<p className="text-[10px] text-content-muted">
										Saldo E-Wallet
									</p>
									<p className="font-display text-base font-bold text-verified truncate">
										{formatPrice(user.balance ?? 0)}
									</p>
								</div>
							</div>
							<Button
								variant="secondary"
								className="text-xs py-1 px-2.5 h-auto shrink-0 bg-verified/10 text-verified border-verified hover:bg-verified/20"
								onClick={() => setIsTopUpOpen(true)}
							>
								Top Up
							</Button>
						</div>

						<hr className="border-slate-200 dark:border-slate-700" />
						<Button
							className="w-full text-sm justify-center"
							onClick={() => setIsEditOpen(true)}
						>
							Edit Profil
						</Button>
					</div>
				</aside>
			</div>

			{/* Tab Switcher */}
			<div className="flex border-b border-content/10">
				<button
					type="button"
					onClick={() => setActiveTab("commissions")}
					className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
						activeTab === "commissions"
							? "border-primary text-primary"
							: "border-transparent text-content-muted hover:text-content"
					}`}
				>
					Riwayat Komisi
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
				<button
					type="button"
					onClick={() => setActiveTab("transactions")}
					className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
						activeTab === "transactions"
							? "border-primary text-primary"
							: "border-transparent text-content-muted hover:text-content"
					}`}
				>
					Transaksi E-Wallet
				</button>
			</div>

			{activeTab === "commissions" ? (
				<ClientCommissionHistory commissions={clientCommissions} />
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
			) : (
				<WalletTransactionsList userId={user.id} />
			)}
			<TopUpModal
				isOpen={isTopUpOpen}
				onClose={() => setIsTopUpOpen(false)}
				onSubmitSuccess={handleTopUpSuccess}
			/>
			<EditProfileModal
				userName={user.name}
				profile={profiles.find((p) => p.user_id === user.id)}
				isOpen={isEditOpen}
				onClose={() => setIsEditOpen(false)}
				onSubmit={handleEditSubmit}
				isArtist={false}
			/>
		</div>
	);
}
