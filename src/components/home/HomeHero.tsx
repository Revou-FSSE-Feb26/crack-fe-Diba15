"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useMounted } from "@/hooks/useMounted";
import { useUserStore } from "@/store/UserStore";

export default function HomeHero() {
	const { isAuthenticated } = useUserStore();
	const mounted = useMounted();

	if (!mounted || isAuthenticated) return null;

	return (
		<div className="relative overflow-hidden rounded-2xl mb-6 border border-primary/10">
			{/* Gradient background */}
			<div className="absolute inset-0 bg-linear-to-br from-primary/10 via-warm/10 to-mint/10" />
			<div className="absolute -top-16 -right-16 w-56 h-56 bg-warm/20 rounded-full blur-3xl" />
			<div className="absolute -bottom-16 -left-16 w-56 h-56 bg-primary/20 rounded-full blur-3xl" />

			<div className="relative px-6 py-8 sm:px-10 sm:py-10">
				<h1 className="font-display text-2xl sm:text-3xl font-bold text-content max-w-xl leading-tight">
					Temukan Seni Autentik dari Artis Terverifikasi
				</h1>
				<p className="mt-2 text-sm text-content-muted max-w-lg">
					Jelajahi karya asli, pesan komisi dengan aman lewat Escrow, dan dukung
					seniman manusia — bebas dari konten AI.
				</p>
				<div className="mt-5 flex flex-wrap gap-3">
					<Link
						href="/signup"
						className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-background shadow-sm transition-colors hover:bg-primary-hover"
					>
						Gabung Sekarang
					</Link>
					<Link
						href="/about"
						className="inline-flex items-center gap-2 rounded-lg bg-surface/80 backdrop-blur-sm px-5 py-2.5 text-sm font-semibold text-content border border-content/10 transition-colors hover:bg-surface"
					>
						<ShieldCheck className="w-4 h-4 text-verified" />
						Pelajari Escrow
					</Link>
				</div>
			</div>
		</div>
	);
}
