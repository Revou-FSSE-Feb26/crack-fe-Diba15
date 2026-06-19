"use client";

import { Sun, Moon, LogIn, Menu, Search } from "lucide-react";
import { useTrubrush } from "@/context/TrubrushContext";
import Link from 'next/link'
import Brand from "@/components/ui/Brand";

interface NavbarProps {
    onMenuToggle: () => void;
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
    const { theme, toggleTheme } = useTrubrush();

    const inputClass = "w-full min-w-md max-w-xl pl-10 pr-4 py-2 text-primary bg-gray-50 dark:bg-[#1D2D37] border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#33658A] dark:focus:ring-[#86BBD8] focus:border-transparent outline-none transition-all"

    return (
        <nav className={"flex justify-between items-center py-4 px-8"}>
            <div className="flex gap-4">
                {/* Sidebar Button */}
                <button
                    type="button"
                    onClick={onMenuToggle}
                    aria-label="Toggle sidebar"
                    className="transition-all duration-300 text-primary hover:text-primary cursor-pointer"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Brand Name */}
                <Brand />
            </div>

            {/* TODO: Search Bar */}
            <div className="hidden md:flex items-center gap-4">
                <form className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="w-4 h-4 text-gray-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search..."
                        className={inputClass}
                    />
                </form>
            </div>

            <div className="flex items-center gap-3">
                {/* Theme Toggle */}
                <button
                    type="button"
                    onClick={toggleTheme}
                    className="transition-all duration-300 text-premium hover:text-primary cursor-pointer"
                >
                    {theme === "dark" ? (
                        <Sun className="w-6 h-6" />
                    ) : (
                        <Moon className="w-6 h-6" />
                    )}
                </button>

                {/* Login Button */}
                <Link href="/login" title="Login Button" className="transition-all duration-300 text-premium hover:text-primary cursor-pointer">
                    <LogIn className="w-6 h-6" />
                </Link>
            </div>
        </nav>
    )
}