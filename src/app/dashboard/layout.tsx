"use client";

import Navbar from "@/components/dashboard/Navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {

    return (
        <div className="min-h-full relative">
            <header className="sticky top-0 backdrop-blur-md z-40">
                <Navbar />
            </header>

            <main className="flex flex-col flex-1">
                {children}
            </main>
        </div>
    )
}