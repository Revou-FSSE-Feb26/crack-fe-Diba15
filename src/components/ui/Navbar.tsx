"use client";

import { Palette, Sun, Moon } from "lucide-react";
import { useTrubrush } from "@/context/TrubrushContext";

export default function Navbar() {
    const { theme, toggleTheme } = useTrubrush();

    return (
        <nav className={"flex justify-between items-center py-4 px-8"}>
            {/* Brand Name */}
            <div className="flex items-center gap-3">
                <Palette className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-bold font-outfit">TruBrush</h1>
            </div>

            {/* Theme Toggle */}
            <button className="transition-all duration-300 text-premium">
                {theme === "dark" ? (
                    <Sun className="w-8 h-8" onClick={toggleTheme} />
                ) : (
                    <Moon className="w-8 h-8" onClick={toggleTheme} />
                )}
            </button>
        </nav>
    )
}