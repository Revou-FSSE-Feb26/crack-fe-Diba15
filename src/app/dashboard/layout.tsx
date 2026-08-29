"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Navbar from "@/components/dashboard/Navbar";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import { useMounted } from "@/hooks/useMounted";

export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const mounted = useMounted();

	if (!mounted) {
		return (
			<div className="mx-auto max-w-6xl px-4 py-8">
				<p className="text-sm text-content-muted">Memuat dashboard...</p>
			</div>
		);
	}

	return (
		<div className="min-h-full relative">
			<header className="sticky top-0 backdrop-blur-md z-40">
				<Navbar />
			</header>

			<main className="flex flex-col flex-1">
				<div className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-8 space-y-6">
					<DashboardHeader />

					<div className="grid gap-4 lg:grid-cols-[260px_1fr]">
						<div className="w-full overflow-hidden">
							<DashboardSidebar />
						</div>
						<section className="space-y-4 min-w-0 w-full overflow-hidden">
							{children}
						</section>
					</div>
				</div>
			</main>
		</div>
	);
}
