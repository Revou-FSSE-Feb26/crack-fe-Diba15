import {
  FileWarning,
  Home,
  ImageIcon,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

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
    label: "Manage User",
    description: "Kelola role dan status user",
    icon: Users,
    href: "/dashboard/manage-users",
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
    label: "Review User",
    description: "Review user yang dilaporkan",
    icon: Users,
    href: "/dashboard/review-users",
    enabled: true,
  },
];

export function getDashboardMenu(role?: string): DashboardMenuItem[] {
  return role === "admin" ? adminMenu : curatorMenu;
}