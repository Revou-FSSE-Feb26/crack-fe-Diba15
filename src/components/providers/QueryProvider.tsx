/**
 * QueryProvider menyediakan konteks untuk query client React Query.
 * File ini berfungsi untuk mengelola query client dan menyediakan konteks
 * untuk komponen-komponen yang membutuhkan query.
 * Semua komponen yang membutuhkan query akan di-wrap dalam QueryProvider.
 */

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/UserStore";

export default function QueryProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						refetchOnWindowFocus: false, // Matikan refetch saat pindah window agar tidak mengganggu refresh token
						retry: false, // Jangan retry query yang gagal secara default
					},
				},
			}),
	);

	useEffect(() => {
		useUserStore.getState().checkAuth();
	}, []);

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
