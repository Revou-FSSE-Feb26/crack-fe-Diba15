"use client";

import { useEffect, useState } from "react";

import BottomNav from "@/components/ui/BottomNav";
import ModalSearch from "@/components/ui/ModalSearch";
import Navbar from "@/components/ui/Navbar";
import Sidebar from "@/components/ui/Sidebar";

export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isSearchOpen, setIsSearchOpen] = useState(false);

	// Close sidebar automatically when the pathname/route changes
	useEffect(() => {
		setIsSidebarOpen(false);
	}, []);

	const handleToggleSidebar = () => {
		setIsSidebarOpen((prev) => !prev);
	};

	// Lock body scroll when sidebar is open
	useEffect(() => {
		if (isSidebarOpen) {
			document.body.style.overflow = "hidden";
		} else {
			const activeOverlays = document.querySelectorAll(".fixed.inset-0");
			if (activeOverlays.length <= 1) {
				document.body.style.overflow = "";
			}
		}
		return () => {
			const activeOverlays = document.querySelectorAll(".fixed.inset-0");
			if (activeOverlays.length <= 1) {
				document.body.style.overflow = "";
			}
		};
	}, [isSidebarOpen]);

	return (
		<div className="min-h-full relative">
			<header className="sticky top-0 bg-surface backdrop-blur-md z-40">
				<Navbar
					onMenuToggle={handleToggleSidebar}
					onSearchOpen={() => setIsSearchOpen(true)}
				/>
			</header>

			<div
				className={`fixed inset-0 z-50 flex transition-opacity duration-300 ${isSidebarOpen ? "visible opacity-100" : "invisible opacity-0"}`}
			>
				<div
					className={`absolute inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity duration-300 ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
					onClick={() => setIsSidebarOpen(false)}
					aria-hidden="true"
				/>
				<div
					className={`relative h-full transform transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
				>
					<Sidebar onClose={() => setIsSidebarOpen(false)} />
				</div>
			</div>

			<main className="flex flex-col flex-1 pb-16 md:pb-0">{children}</main>

			<footer></footer>

			<BottomNav
				onSearchOpen={() => setIsSearchOpen(true)}
				onMenuToggle={handleToggleSidebar}
			/>

			{isSearchOpen && <ModalSearch onClose={() => setIsSearchOpen(false)} />}
		</div>
	);
}
