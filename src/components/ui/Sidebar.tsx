'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Home, Layers, Star, MessageSquare, Settings, Users, Menu, Sun, Moon } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Brand from "@/components/ui/Brand";
import { useThemeStore } from "@/store/ThemeStore";

interface SidebarProps {
    onClose: () => void;
}

const menuItems: Array<{ label: string; href: string; icon: LucideIcon }> = [
    { label: "Dashboard", href: "#", icon: Home },
    { label: "Collections", href: "#", icon: Layers },
    { label: "Featured", href: "#", icon: Star },
    { label: "Messages", href: "#", icon: MessageSquare },
    { label: "Teams", href: "#", icon: Users },
    { label: "Settings", href: "#", icon: Settings },
];

export default function Sidebar({ onClose }: SidebarProps) {
    const { theme, toggleTheme } = useThemeStore();
    const [mounted, setMounted] = useState(false);

    // useEffect digunakan untuk mencegah hydration mismatch error di Next.js
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <aside className="flex justify-between h-full min-h-screen z-50 w-72 flex-col gap-6 border-r border-slate-200/70 bg-surface p-4 text-content transition-colors duration-300 dark:border-slate-700/60">
            {/* Bagian Atas: Logo & Navigasi */}
            <div>
                <div className="mb-6 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close sidebar"
                        className="rounded-full p-2 text-content transition-colors duration-200 hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-700"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <Brand />
                </div>

                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
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
                    <div className="mb-3 flex flex-wrap gap-2 text-xs leading-6">
                        <Link href="#" className="transition-colors hover:text-primary">
                            Announcements
                        </Link>
                        <Link href="#" className="transition-colors hover:text-primary">
                            Help
                        </Link>
                        <Link href="#" className="transition-colors hover:text-primary">
                            Privacy
                        </Link>
                        <Link href="#" className="transition-colors hover:text-primary">
                            Careers
                        </Link>
                    </div>
                    <p>© TruBrush</p>
                </footer>
            </div>
        </aside>
    );
}