"use client";

import {
	Briefcase,
	CalendarDays,
	CheckCircle2,
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
import WalletTransactionsList from "@/components/profile/WalletTransactionsList";
import Button from "@/components/ui/Button";
import { useUserProfile } from "@/hooks/useUserProfile";
import type { ProfileUser } from "@/types";
import { formatPrice } from "@/utils";

interface ClientProfileProps {
	user: ProfileUser;
}

export default function ClientProfile({ user }: ClientProfileProps) {
	const [activeTab, setActiveTab] = useState<
		"commissions" | "following" | "transactions"
	>("commissions");

	const {
		followedArtists,
		userCommissions,
		handleUnfollowArtist,
		updateUserData,
		updateCurrentUser,
		addToast,
	} = useUserProfile(user.id);

	const [isEditOpen, setIsEditOpen] = useState(false);

	const handleEditSubmit = async (values: EditProfileFormValues) => {
		const trimmedName = values.name.trim();
		const nameChanged = trimmedName !== user.name;

		if (!nameChanged) {
			setIsEditOpen(false);
			return;
		}

		const nameResult = await updateUserData(user.id, { name: trimmedName });

		if (nameResult.success) {
			updateCurrentUser({ name: trimmedName });
			addToast({
				message: "Nama profil berhasil diperbarui",
				type: "success",
			});
			setIsEditOpen(false);
		} else {
			addToast({
				message: nameResult.message || "Gagal memperbarui nama",
				type: "error",
			});
		}
	};

	const clientCommissions = useMemo(
		() =>
			userCommissions
				.filter((commission) => commission.client_id === user.id)
				.sort(
					(a, b) =>
						new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
				),
		[userCommissions, user.id],
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
		<div className="max-w-5xl mx-auto px-3 sm:px-6 py-5 sm:py-8 space-y-6 sm:space-y-8 w-full">
			<ProfileHeading
				eyebrow="Profil Client"
				title="Pantau riwayat komisi"
				description="Lihat pesanan aktif, histori pembayaran, dan komisi yang sudah selesai."
			/>

			{/* Unified Single Executive Client Card */}
			<div className="bg-surface border border-content/10 rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-5 w-full overflow-hidden">
				{/* Top Row: User Avatar, Identity, and Edit Button */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
						<AvatarInitials
							name={user.name}
							className="w-14 h-14 sm:w-16 sm:h-16 text-lg sm:text-xl shrink-0"
						/>
						<div className="min-w-0 flex-1">
							<h2 className="font-display text-xl sm:text-2xl font-bold text-content truncate">
								{user.name}
							</h2>
							<div className="flex flex-wrap items-center gap-x-2.5 sm:gap-x-3 gap-y-1 text-xs text-content-muted mt-0.5">
								<AccountMeta user={user} />
								<span className="hidden xs:inline">•</span>
								<span className="inline-flex items-center gap-1">
									<CalendarDays className="w-3.5 h-3.5 text-primary shrink-0" />
									Bergabung {joinedDate}
								</span>
							</div>
						</div>
					</div>

					<Button
						onClick={() => setIsEditOpen(true)}
						className="text-xs sm:text-sm self-start sm:self-center shrink-0 px-4 py-2"
					>
						Edit Profil
					</Button>
				</div>

				{/* Middle Section: Row 1 (Commission Stats - 3 Cards) & Row 2 (Financial Stats - 2 Cards) */}
				<div className="space-y-3 pt-4 border-t border-content/10">
					{/* Row 1: 3 Commission Activity Stats */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
						{/* 1. Total Komisi */}
						<div className="rounded-xl bg-content/5 p-3 sm:p-3.5 flex items-center gap-3 min-w-0">
							<div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
								<Briefcase className="w-4 h-4 text-primary" />
							</div>
							<div className="min-w-0 flex-1">
								<p className="text-xs text-content-muted">Total Komisi</p>
								<p className="font-display text-base sm:text-lg font-bold text-content truncate">
									{clientCommissions.length}{" "}
									<span className="text-xs font-normal text-content-muted">
										order
									</span>
								</p>
							</div>
						</div>

						{/* 2. Order Aktif */}
						<div className="rounded-xl bg-primary/5 p-3 sm:p-3.5 flex items-center gap-3 min-w-0">
							<div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
								<Clock3 className="w-4 h-4 text-primary" />
							</div>
							<div className="min-w-0 flex-1">
								<p className="text-xs text-content-muted">Order Aktif</p>
								<p className="font-display text-base sm:text-lg font-bold text-primary truncate">
									{activeCommissions.length}{" "}
									<span className="text-xs font-normal text-content-muted">
										berjalan
									</span>
								</p>
							</div>
						</div>

						{/* 3. Selesai */}
						<div className="rounded-xl bg-verified/5 p-3 sm:p-3.5 flex items-center gap-3 min-w-0">
							<div className="w-8 h-8 rounded-lg bg-verified/10 flex items-center justify-center shrink-0">
								<CheckCircle2 className="w-4 h-4 text-verified" />
							</div>
							<div className="min-w-0 flex-1">
								<p className="text-xs text-content-muted">Selesai</p>
								<p className="font-display text-base sm:text-lg font-bold text-verified truncate">
									{completedCommissions.length}{" "}
									<span className="text-xs font-normal text-content-muted">
										order
									</span>
								</p>
							</div>
						</div>
					</div>

					{/* Row 2: 2 Financial Stats */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
						{/* 4. Total Nilai Order */}
						<div className="rounded-xl bg-primary/5 p-3 sm:p-3.5 flex items-center gap-3 min-w-0">
							<div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
								<CreditCard className="w-4 h-4 text-primary" />
							</div>
							<div className="min-w-0 flex-1">
								<p className="text-xs text-content-muted">Total Belanja</p>
								<p
									className="font-display text-base sm:text-lg font-bold text-primary truncate"
									title={formatPrice(totalSpent)}
								>
									{formatPrice(totalSpent)}
								</p>
							</div>
						</div>

						{/* 5. Saldo E-Wallet */}
						<div className="rounded-xl bg-verified/5 border border-verified/20 p-3 sm:p-3.5 flex items-center justify-between gap-3 min-w-0">
							<div className="flex items-center gap-2.5 min-w-0 flex-1">
								<div className="w-8 h-8 rounded-lg bg-verified/10 flex items-center justify-center shrink-0">
									<Wallet className="w-4 h-4 text-verified" />
								</div>
								<div className="min-w-0 flex-1">
									<p className="text-xs text-content-muted">Saldo E-Wallet</p>
									<p
										className="font-display text-base sm:text-lg font-bold text-verified truncate"
										title={formatPrice(user.balance ?? 0)}
									>
										{formatPrice(user.balance ?? 0)}
									</p>
								</div>
							</div>
							<Link
								href="/topup"
								className="text-xs py-1.5 px-3 rounded-lg font-semibold bg-verified/10 text-verified border border-verified/30 hover:bg-verified/20 transition-colors shrink-0"
							>
								Top Up
							</Link>
						</div>
					</div>
				</div>

				{/* Bottom Row: Escrow Protection Notice */}
				<div className="flex items-start gap-2.5 sm:gap-3 rounded-xl bg-primary/5 border border-primary/20 p-3 sm:px-4 sm:py-3 text-left w-full">
					<ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0 mt-0.5" />
					<div className="min-w-0 flex-1">
						<p className="text-xs sm:text-sm font-medium text-content">
							Proteksi Komisi TruBrush
						</p>
						<p className="text-[11px] sm:text-xs text-content-muted mt-0.5 leading-relaxed">
							Riwayat komisi membantu kamu melacak order aktif, pembayaran aman
							dengan sistem escrow, dan unduh berkas hasil akhir dari artist.
						</p>
					</div>
				</div>
			</div>

			{/* Tab Switcher */}
			<div className="flex border-b border-content/10 overflow-x-auto no-scrollbar w-full">
				<button
					type="button"
					onClick={() => setActiveTab("commissions")}
					className={`px-3.5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
						activeTab === "commissions"
							? "border-primary text-primary"
							: "border-transparent text-content-muted hover:text-content"
					}`}
				>
					Riwayat Komisi ({clientCommissions.length})
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

			{activeTab === "commissions" ? (
				<ClientCommissionHistory
					commissions={clientCommissions}
					isArtist={false}
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
				profile={undefined}
				isOpen={isEditOpen}
				onClose={() => setIsEditOpen(false)}
				onSubmit={handleEditSubmit}
				isArtist={false}
			/>
		</div>
	);
}
