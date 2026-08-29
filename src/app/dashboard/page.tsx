"use client";

import {
	AlertTriangle,
	ArrowRight,
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
import Link from "next/link";
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
		const approvedArtworks = artworks.filter(
			(artwork) => artwork.curation_status === "approved",
		);
		const pendingDisputes = disputesData.filter(
			(dispute) => dispute.status === "pending",
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
			approvedArtworks: approvedArtworks.length,
			pendingArtworks: pendingArtworks.length,
			pendingDisputes: pendingDisputes.length,
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
					{/* Financial & Business Metrics Section */}
					<div className="space-y-4">
						<div className="space-y-2">
							<h2 className="text-xs font-bold uppercase tracking-wider text-content-muted">
								Kinerja Finansial Platform
							</h2>
							<div className="grid gap-4 sm:grid-cols-2">
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
							</div>
						</div>

						<div className="space-y-2">
							<h2 className="text-xs font-bold uppercase tracking-wider text-content-muted">
								Operasional Escrow & Komisi
							</h2>
							<div className="grid gap-4 sm:grid-cols-2">
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
				<div className="space-y-6">
					{/* Curator Dashboard Header */}
					<div>
						<h1 className="text-2xl font-bold text-content">Beranda Kurator</h1>
						<p className="text-xs text-content-muted">
							Pantau antrian verifikasi keaslian karya anti-AI, penyelesaian
							sengketa komisi, dan moderasi konten.
						</p>
					</div>

					{/* 2x2 KPI Summary Grid */}
					<div className="grid gap-4 sm:grid-cols-2">
						<Stat
							variant="card"
							label="Artwork Menunggu Kurasi"
							value={`${stats.pendingArtworks} Karya`}
							icon={ImageIcon}
						/>
						<Stat
							variant="card"
							label="Sengketa Komisi Pending"
							value={`${stats.pendingDisputes} Sengketa`}
							icon={FileWarning}
						/>
						<Stat
							variant="card"
							label="Laporan Konten Pending"
							value={`${stats.pendingReports} Laporan`}
							icon={AlertTriangle}
						/>
						<Stat
							variant="card"
							label="Total Karya Lolos Kurasi"
							value={`${stats.approvedArtworks} Karya`}
							icon={CheckCircle2}
						/>
					</div>

					{/* Quick Actions / Review Navigation */}
					<div className="space-y-2">
						<h2 className="text-xs font-bold uppercase tracking-wider text-content-muted">
							Antrian Tindakan Moderasi
						</h2>
						<div className="grid gap-4 sm:grid-cols-3">
							<Link
								href="/dashboard/review-artworks"
								className="rounded-2xl border border-content/10 bg-surface p-4 hover:border-primary/50 transition-colors flex flex-col justify-between group"
							>
								<div className="space-y-1.5">
									<div className="flex items-center justify-between">
										<div className="p-2 rounded-xl bg-primary/10 text-primary">
											<ImageIcon className="h-5 w-5" />
										</div>
										<span className="badge badge-sm badge-warning font-bold">
											{stats.pendingArtworks} Pending
										</span>
									</div>
									<h3 className="font-semibold text-sm text-content pt-1">
										Review Artwork
									</h3>
									<p className="text-xs text-content-muted">
										Verifikasi keaslian karya dan WIP sebelum tayang di feed.
									</p>
								</div>
								<div className="flex items-center gap-1 text-xs font-semibold text-primary pt-3 group-hover:translate-x-1 transition-transform">
									<span>Buka Antrean</span>
									<ArrowRight className="h-3.5 w-3.5" />
								</div>
							</Link>

							<Link
								href="/dashboard/review-disputes"
								className="rounded-2xl border border-content/10 bg-surface p-4 hover:border-primary/50 transition-colors flex flex-col justify-between group"
							>
								<div className="space-y-1.5">
									<div className="flex items-center justify-between">
										<div className="p-2 rounded-xl bg-warning/10 text-warning">
											<FileWarning className="h-5 w-5" />
										</div>
										<span className="badge badge-sm badge-warning font-bold">
											{stats.pendingDisputes} Pending
										</span>
									</div>
									<h3 className="font-semibold text-sm text-content pt-1">
										Review Dispute
									</h3>
									<p className="text-xs text-content-muted">
										Mediasi sengketa transaksi komisi klien dan artis.
									</p>
								</div>
								<div className="flex items-center gap-1 text-xs font-semibold text-primary pt-3 group-hover:translate-x-1 transition-transform">
									<span>Buka Mediasi</span>
									<ArrowRight className="h-3.5 w-3.5" />
								</div>
							</Link>

							<Link
								href="/dashboard/review-reports"
								className="rounded-2xl border border-content/10 bg-surface p-4 hover:border-primary/50 transition-colors flex flex-col justify-between group"
							>
								<div className="space-y-1.5">
									<div className="flex items-center justify-between">
										<div className="p-2 rounded-xl bg-error/10 text-error">
											<AlertTriangle className="h-5 w-5" />
										</div>
										<span className="badge badge-sm badge-warning font-bold">
											{stats.pendingReports} Pending
										</span>
									</div>
									<h3 className="font-semibold text-sm text-content pt-1">
										Review Laporan
									</h3>
									<p className="text-xs text-content-muted">
										Tindak aduan pelanggaran hak cipta atau konten AI.
									</p>
								</div>
								<div className="flex items-center gap-1 text-xs font-semibold text-primary pt-3 group-hover:translate-x-1 transition-transform">
									<span>Buka Laporan</span>
									<ArrowRight className="h-3.5 w-3.5" />
								</div>
							</Link>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
