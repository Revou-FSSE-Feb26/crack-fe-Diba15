'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Home, Sun, Moon, PanelLeftClose, LogIn, Heart, User, Briefcase, ChevronUp, PlusCircle, LayoutDashboard } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Brand from "@/components/ui/brand/Brand";
import { useThemeStore } from "@/store/ThemeStore";
import { useUserStore } from "@/store/UserStore";

interface SidebarProps {
  onClose: () => void;
}

const menuItems: Array<{ label: string; href: string; icon: LucideIcon }> = [
  { label: "Beranda", href: "/", icon: Home },
  // { label: "Collections", href: "#", icon: Layers },
  // { label: "Featured", href: "#", icon: Star },
  // { label: "Messages", href: "#", icon: MessageSquare },
  // { label: "Teams", href: "#", icon: Users },
  // { label: "Settings", href: "#", icon: Settings },
];

const userMenuItems: Array<{ label: string; href: string; icon: LucideIcon }> = [
  { label: "Favorites", href: "/favorite", icon: Heart },
  { label: "Commissions", href: "/commissions", icon: Briefcase },
  { label: "Profil", href: "/profile", icon: User },
];

export default function Sidebar({ onClose }: SidebarProps) {
  const { theme, toggleTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, user, logout, isArtist, isAdmin, isCurator } = useUserStore();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Jika isAuth maka satukan menu user dengan menu default
  const postArtMenu = mounted && isArtist()
    ? [{ label: "Post Art", href: "/post-art", icon: PlusCircle }]
    : [];
  const dashboardMenu = mounted && (isAdmin() || isCurator())
    ? [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }]
    : [];
  const menu = isAuthenticated
    ? [...menuItems, ...postArtMenu, ...dashboardMenu, ...userMenuItems]
    : menuItems;

  // useEffect digunakan untuk mencegah hydration mismatch error di Next.js
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0)
  }, []);

  return (
    <aside className="flex justify-between h-full min-h-screen z-50 w-72 flex-col gap-6 border-r border-slate-200/70 bg-surface p-4 text-content transition-colors duration-300 dark:border-slate-700/60">
      {/* Bagian Atas: Logo & Navigasi */}
      <div>
        <div className="mb-6 flex items-center justify-between gap-2">
          <Brand />
          <button
            type="button"
            onClick={onClose}
            title="Close sidebar"
            aria-label="Close sidebar"
            className="rounded-full p-2 text-content transition-colors duration-200 hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-700 cursor-pointer"
          >
            <PanelLeftClose className="h-6 w-6 text-primary" />
          </button>
        </div>

        <nav className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium text-content transition-all duration-200 hover:bg-primary/10 hover:text-primary"
              >
                <Icon className="h-5 w-5 transition-colors duration-200 group-hover:text-primary" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bagian Bawah: Toggle Tema & Footer */}
      <div className="flex flex-col">
        {/* Login button — hanya tampil di mobile */}
        {!isAuthenticated ? (
          <Link
            href="/login"
            className="group md:hidden mb-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium text-content transition-all duration-200 hover:bg-primary/10 hover:text-primary"
          >
            <LogIn className="h-5 w-5 transition-colors duration-200 group-hover:text-primary" />
            Login
          </Link>
        ) : (
          <div className="group md:hidden mb-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium text-content transition-all duration-200 hover:bg-primary/10 hover:text-primary">
            <div className="relative w-full">
              <button
                type="button"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className="w-full flex justify-between items-center gap-3"
              >
                <span>{user?.name}</span>
                <ChevronUp className={`h-5 w-5 transition-all duration-200 group-hover:text-primary ${profileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileMenuOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-full rounded-2xl border border-slate-200/70 bg-surface shadow-lg dark:border-slate-700/60">
                  <button
                    type="button"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium text-content transition-all duration-200 hover:bg-primary/10 dark:hover:bg-primary/10"
                  >
                    <span>{user?.role}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium text-red-500 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <LogIn className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {mounted && (
          <button
            onClick={toggleTheme}
            className="group mb-4 flex w-full items-center justify-between rounded-2xl px-4 py-3 text-base font-medium text-content transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Moon className="h-5 w-5 text-content transition-colors group-hover:text-primary" />
              ) : (
                <Sun className="h-5 w-5 text-content transition-colors group-hover:text-primary" />
              )}
              <span className="transition-colors group-hover:text-primary">
                {theme === "dark" ? "Dark Mode" : "Light Mode"}
              </span>
            </div>
            {/* Indikator Switch Mini */}
            <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-slate-300 transition-colors dark:bg-slate-600">
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 ${theme === 'dark' ? 'translate-x-4.5' : 'translate-x-1'
                  }`}
              />
            </div>
          </button>
        )}

        <footer className="border-t border-slate-200/70 pt-4 text-sm text-content-muted dark:border-slate-700/60">
          <div className="mb-3 flex flex-wrap gap-2 text-xs max-w-50">
            <Link href="/help" className="transition-colors hover:text-primary">
              Help
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-primary">
              Privacy
            </Link>
            <Link href="/about" className="transition-colors hover:text-primary">
              About TruBrush
            </Link>
            <Link href="/careers" className="transition-colors hover:text-primary">
              Careers
            </Link>
          </div>
          <p className="font-syne">© TruBrush</p>
        </footer>
      </div>
    </aside>
  );
}
