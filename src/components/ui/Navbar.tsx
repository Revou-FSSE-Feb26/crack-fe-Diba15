"use client";

import { Sun, Moon, LogIn, Menu } from "lucide-react";
import { useTrubrush } from "@/context/TrubrushContext";
import Link from 'next/link'
import Brand from "@/components/ui/Brand";

interface NavbarProps {
    onMenuToggle: () => void;
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
    const { theme, toggleTheme } = useTrubrush();

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