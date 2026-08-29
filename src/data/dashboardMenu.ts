import type { LucideIcon } from "lucide-react";
import {
	Award,
	CircleDollarSign,
	FileWarning,
	Home,
	ImageIcon,
	ShieldCheck,
	Tags,
	Users,
} from "lucide-react";

export type DashboardMenuItem = {
	label: string;
	description: string;
	icon: LucideIcon;
	href: string;
	/** false = menu placeholder, halaman belum dibuat */
	enabled: boolean;
};

export const adminMenu: DashboardMenuItem[] = [
	{
		label: "Beranda",
		description: "Ringkasan platform",
		icon: Home,
		href: "/dashboard",
		enabled: true,
	},
	{
		label: "Laporan Finansial",
		description: "Rekap transaksi dan fee platform",
		icon: CircleDollarSign,
		href: "/dashboard/financial-reports",
		enabled: true,
	},
	{
		label: "Manage User",
		description: "Kelola role dan status user",
		icon: Users,
		href: "/dashboard/manage-users",
		enabled: true,
	},
	{
		label: "Manajemen Tag & Katalog",
		description: "Master tag & katalog galeri karya global",
		icon: Tags,
		href: "/dashboard/manage-tags",
		enabled: true,
	},
	{
		label: "Kinerja Kurator",
		description: "SLA respons & metrik tim moderasi",
		icon: Award,
		href: "/dashboard/curator-performance",
		enabled: true,
	},
	{
		label: "Log Audit Moderasi",
		description: "Rekam jejak kurasi, sengketa & banding",
		icon: ShieldCheck,
		href: "/dashboard/audit-logs",
		enabled: true,
	},
];

export const curatorMenu: DashboardMenuItem[] = [
	{
		label: "Beranda",
		description: "Ringkasan kurasi",
		icon: Home,
		href: "/dashboard",
		enabled: true,
	},
	{
		label: "Review Artwork",
		description: "Review artwork pending",
		icon: ImageIcon,
		href: "/dashboard/review-artworks",
		enabled: true,
	},
	{
		label: "Review Dispute",
		description: "Pantau sengketa komisi",
		icon: FileWarning,
		href: "/dashboard/review-disputes",
		enabled: true,
	},
	{
		label: "Review Laporan",
		description: "Review laporan yang dilaporkan",
		icon: Users,
		href: "/dashboard/review-reports",
		enabled: true,
	},
	{
		label: "Kinerja Kurator",
		description: "SLA respons & metrik evaluasi kerja",
		icon: Award,
		href: "/dashboard/curator-performance",
		enabled: true,
	},
];

export function getDashboardMenu(role?: string): DashboardMenuItem[] {
	if (role === "admin") return adminMenu;
	if (role === "curator") return curatorMenu;
	return [];
}
