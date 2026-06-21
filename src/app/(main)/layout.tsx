"use client";

import { useState } from "react";
import Navbar from "@/components/ui/Navbar";
import Sidebar from "@/components/ui/Sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleToggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    return (
        <div className="min-h-full relative">
            <header className="sticky top-0 bg-background backdrop-blur-md z-50">
                <Navbar onMenuToggle={handleToggleSidebar} />
            </header>

            <div className={`fixed inset-0 z-50 flex transition-opacity duration-300 ${isSidebarOpen ? "visible opacity-100" : "invisible opacity-0"}`}>
                <div
                    className={`absolute inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity duration-300 ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                    onClick={() => setIsSidebarOpen(false)}
                    aria-hidden="true"
                />
                <div className={`relative h-full transform transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <Sidebar onClose={() => setIsSidebarOpen(false)} />
                </div>
            </div>

            <main className="flex flex-col flex-1">
                {children}
            </main>

            <footer></footer>
        </div>
    )
}