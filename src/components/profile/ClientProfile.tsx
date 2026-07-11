import {
	Briefcase,
	CalendarDays,
	Clock3,
	CreditCard,
	ShieldCheck,
	Wallet,
} from "lucide-react";
import { useMemo } from "react";

import AvatarInitials from "@/components/home/AvatarInitials";
import AccountMeta from "@/components/profile/AccountMeta";
import ClientCommissionHistory from "@/components/profile/ClientCommissionHistory";
import ProfileHeading from "@/components/profile/ProfileHeading";
import SummaryRow from "@/components/profile/SummaryRow";
import type { ProfileUser } from "@/components/profile/types";
import Button from "@/components/ui/Button";
import Stat from "@/components/ui/Stat";
import { useCommissionStore } from "@/store/CommissionStore";
import { useToastStore } from "@/store/ToastStore";
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
	const { updateUser } = useUserManagementStore();
	const { user: currentUser, updateCurrentUser } = useUserStore();
	const { addToast } = useToastStore();

	const user = useMemo(() => {
		if (currentUser && currentUser.id === initialUser.id) {
			return currentUser;
		}
		return initialUser;
	}, [currentUser, initialUser]);

	const handleTopUp = () => {
		const amount = 500000;
		const nextBalance = (user.balance ?? 0) + amount;
		updateUser(user.id, { balance: nextBalance });
		if (currentUser?.id === user.id) {
			updateCurrentUser({ balance: nextBalance });
		}
		addToast({
			message: `Berhasil Top Up ${formatPrice(amount)} ke E-Wallet.`,
			type: "success",
		});
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
								Akun client digunakan untuk mencari artist human-verified,
								memesan komisi, dan memantau progres pekerjaan.
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
								onClick={handleTopUp}
							>
								Top Up
							</Button>
						</div>

						<hr className="border-slate-200 dark:border-slate-700" />
					</div>
				</aside>
			</div>

			<ClientCommissionHistory commissions={clientCommissions} />
		</div>
	);
}
