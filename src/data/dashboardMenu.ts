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
    enabled: false,
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
    label: "Manage Artwork",
    description: "Review artwork pending",
    icon: ImageIcon,
    href: "/dashboard/artworks",
    enabled: false,
  },
  {
    label: "Manage Dispute",
    description: "Pantau sengketa komisi",
    icon: FileWarning,
    href: "/dashboard/disputes",
    enabled: false,
  },
  {
    label: "Manage User",
    description: "Review user yang dilaporkan",
    icon: Users,
    href: "/dashboard/users",
    enabled: false,
  },
];

export function getDashboardMenu(role?: string): DashboardMenuItem[] {
  return role === "admin" ? adminMenu : curatorMenu;
}