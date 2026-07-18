"use client";

import { AlertCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
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
	const [showWarn, setShowWarn] = useState(false);

	useEffect(() => {
		if (mounted) {
			setTimeout(() => {
				setShowWarn(true);
			}, 0);
		}
	}, [mounted]);

	const handleWarn = () => {
		setShowWarn(false);
	};

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

					{/* Peringatan Desktop */}
					{showWarn && (
						<div className="rounded-2xl border border-content/10 bg-surface p-5">
							<div className="flex items-start gap-3">
								<div className="flex p-4 items-center justify-center rounded-xl bg-danger/10 text-danger">
									<AlertCircle className="h-5 w-5" />
								</div>
								<div>
									<h2 className="font-heading text-lg font-semibold text-content">
										Peringatan Pengguna
									</h2>
									<p className="mt-1 text-sm leading-relaxed text-content-muted">
										Harap gunakan desktop ketika mengakses halaman dashboard,
										sehingga tampilan dan fungsionalitas dapat optimal.
									</p>
								</div>
								<button
									type="button"
									onClick={handleWarn}
									className="ml-auto text-sm text-content-muted cursor-pointer"
								>
									<span className="flex items-center gap-1">
										<X className="h-4 w-4" />
									</span>
								</button>
							</div>
						</div>
					)}

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
