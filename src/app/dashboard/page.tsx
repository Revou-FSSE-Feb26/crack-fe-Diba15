"use client";

import {
	AlertTriangle,
	Briefcase,
	CheckCircle2,
	Coins,
	FileWarning,
	ImageIcon,
	ShieldCheck,
	Sparkles,
	TrendingUp,
	Users,
} from "lucide-react";
import { useEffect, useMemo } from "react";

import Stat from "@/components/ui/Stat";
import { useArtworks } from "@/hooks/useArtworkQueries";
import { useUserCommissions } from "@/hooks/useCommissionQueries";
import { useDisputes } from "@/hooks/useDisputeQueries";
import { useReports } from "@/hooks/useReportQueries";
import { useUserManagementStore } from "@/store/UserManagementStore";
import { useUserStore } from "@/store/UserStore";
import { formatPrice } from "@/utils";

export default function DashboardPage() {
	const { user } = useUserStore();
	const { users, fetchUsers } = useUserManagementStore();
	const { data: artworks = [] } = useArtworks();
	const { data: commissionsData = [] } = useUserCommissions();
	const { data: disputesData = [] } = useDisputes();
	const { data: reportsData = [] } = useReports();

	useEffect(() => {
		if (user?.role === "admin") {
			fetchUsers();
		}
	}, [fetchUsers, user?.role]);

	const activeCommissionsList = commissionsData;

	const stats = useMemo(() => {
		const pendingArtworks = artworks.filter(
			(artwork) => artwork.curation_status === "pending",
		);
		const disputedCommissions = disputesData.filter(
			(dispute) => dispute.status === "approved",
		);
		const pendingReports = reportsData.filter(
			(report) => report.status === "pending",
		);
		const activeCommissions = activeCommissionsList.filter((commission) =>
			["pending", "accepted", "in_progress", "revision"].includes(
				commission.status,
			),
		);

		// Perhitungan Finansial Platform TruBrush (5% Fee)
		const platformRevenue = activeCommissionsList
			.filter((c) => c.status === "completed")
			.reduce(
				(sum, c) => sum + (c.platform_fee ?? Math.round(c.price * 0.05)),
				0,
			);

		const grossMerchandiseValue = activeCommissionsList
			.filter((c) => ["paid", "released"].includes(c.payment_status))
			.reduce((sum, c) => sum + c.price, 0);

		const activeEscrowBalance = activeCommissionsList
			.filter((c) => c.payment_status === "paid" && c.status !== "completed")
			.reduce((sum, c) => sum + c.price, 0);

		return {
			totalUsers: users.length,
			totalArtists: users.filter((item) => item.role === "artist").length,
			totalClients: users.filter((item) => item.role === "client").length,
			totalArtworks: artworks.length,
			pendingArtworks: pendingArtworks.length,
			disputedCommissions: disputedCommissions.length,
			pendingReports: pendingReports.length,
			activeCommissions: activeCommissions.length,
			platformRevenue,
			grossMerchandiseValue,
			activeEscrowBalance,
		};
	}, [artworks, activeCommissionsList, users, disputesData, reportsData]);

	return (
		<div className="space-y-6">
			{user?.role === "admin" ? (
				<div className="space-y-6">
					{/* Financial & Business Metrics Row */}
					<div className="space-y-2">
						<h2 className="text-xs font-bold uppercase tracking-wider text-content-muted">
							Kinerja Finansial & Transaksi Platform
						</h2>
						<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
							<Stat
								variant="card"
								label="Pendapatan Platform (Fee 5%)"
								value={formatPrice(stats.platformRevenue)}
								icon={TrendingUp}
							/>
							<Stat
								variant="card"
								label="Total Transaksi (GMV)"
								value={formatPrice(stats.grossMerchandiseValue)}
								icon={Coins}
							/>
							<Stat
								variant="card"
								label="Dana di Escrow (Aktif)"
								value={formatPrice(stats.activeEscrowBalance)}
								icon={ShieldCheck}
							/>
							<Stat
								variant="card"
								label="Pesanan Komisi Aktif"
								value={stats.activeCommissions}
								icon={Briefcase}
							/>
						</div>
					</div>

					{/* Users & Platform Growth Row */}
					<div className="space-y-2">
						<h2 className="text-xs font-bold uppercase tracking-wider text-content-muted">
							Pertumbuhan Komunitas & Konten
						</h2>
						<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
							<Stat
								variant="card"
								label="Total Pengguna"
								value={stats.totalUsers}
								icon={Users}
							/>
							<Stat
								variant="card"
								label="Total Artist"
								value={stats.totalArtists}
								icon={ImageIcon}
							/>
							<Stat
								variant="card"
								label="Total Client"
								value={stats.totalClients}
								icon={Users}
							/>
							<Stat
								variant="card"
								label="Total Karya Terpublikasi"
								value={stats.totalArtworks}
								icon={Sparkles}
							/>
						</div>
					</div>
				</div>
			) : (
				<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
					<Stat
						variant="card"
						label="Artwork Pending"
						value={stats.pendingArtworks}
						icon={ImageIcon}
					/>
					<Stat
						variant="card"
						label="Dispute"
						value={stats.disputedCommissions}
						icon={FileWarning}
					/>
					<Stat
						variant="card"
						label="Laporan Pending"
						value={stats.pendingReports}
						icon={AlertTriangle}
					/>
					<Stat
						variant="card"
						label="Komisi Aktif"
						value={stats.activeCommissions}
						icon={Briefcase}
					/>
				</div>
			)}

			<div className="rounded-2xl border border-content/10 bg-surface p-5">
				<div className="flex items-start gap-3">
					<div className="flex p-4 items-center justify-center rounded-xl bg-verified/10 text-verified">
						<CheckCircle2 className="h-5 w-5" />
					</div>
					<div>
						<h2 className="font-heading text-lg font-semibold text-content">
							Dashboard Eksekutif TruBrush
						</h2>
						<p className="mt-1 text-sm leading-relaxed text-content-muted">
							Metrik pendapatan 5% dihitung secara otomatis dari seluruh pesanan
							komisi yang berhasil diselesaikan dan dicairkan. Dana escrow
							merepresentasikan dana aman yang sedang ditahan selama proses
							pengerjaan karya seni.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
