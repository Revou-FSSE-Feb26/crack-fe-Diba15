"use client";

import { Palette, Sun, Moon, LogIn } from "lucide-react";
import { useTrubrush } from "@/context/TrubrushContext";
import Link from 'next/link'

export default function Navbar() {
    const { theme, toggleTheme } = useTrubrush();

    return (
        <nav className={"flex justify-between items-center py-4 px-8"}>
            {/* Brand Name */}
            <div className="flex items-center gap-3">
                <Palette className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-bold font-outfit">TruBrush</h1>
            </div>

            <div className="flex items-center gap-3">
                {/* Theme Toggle */}
                <button className="transition-all duration-300 text-premium hover:text-primary cursor-pointer">
                    {theme === "dark" ? (
                        <Sun className="w-6 h-6" onClick={toggleTheme} />
                    ) : (
                        <Moon className="w-6 h-6" onClick={toggleTheme} />
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