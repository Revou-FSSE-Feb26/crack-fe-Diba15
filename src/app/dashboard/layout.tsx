"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, LayoutDashboard } from "lucide-react";

import Navbar from "@/components/dashboard/Navbar";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Button from "@/components/ui/Button";
import { useUserStore } from "@/store/UserStore";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated } = useUserStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  const isStaff = user?.role === "admin" || user?.role === "curator";

  return (
    <div className="min-h-full relative">
      <header className="sticky top-0 backdrop-blur-md z-40">
        <Navbar />
      </header>

      <main className="flex flex-col flex-1">
        {!mounted ? (
          <div className="mx-auto max-w-6xl px-4 py-8">
            <p className="text-sm text-content-muted">Memuat dashboard...</p>
          </div>
        ) : !isAuthenticated || !user ? (
          <div className="mx-auto max-w-3xl px-4 py-12">
            <div className="rounded-2xl border border-content/10 bg-surface p-6 text-center">
              <LayoutDashboard className="mx-auto mb-3 h-10 w-10 text-primary" />
              <h1 className="font-heading text-2xl font-semibold text-content">
                Login Staff Diperlukan
              </h1>
              <p className="mt-2 text-sm text-content-muted">
                Dashboard hanya tersedia untuk akun admin dan curator.
              </p>
              <Button className="mt-5 justify-center" onClick={() => router.push("/login")}>
                Login
              </Button>
            </div>
          </div>
        ) : !isStaff ? (
          <div className="mx-auto max-w-3xl px-4 py-12">
            <div className="rounded-2xl border border-content/10 bg-surface p-6 text-center">
              <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-danger" />
              <h1 className="font-heading text-2xl font-semibold text-content">
                Akses Ditolak
              </h1>
              <p className="mt-2 text-sm text-content-muted">
                Akun {user.role} tidak memiliki akses ke dashboard operasional.
              </p>
              <Link
                href="/"
                className="mt-5 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-primary-hover"
              >
                Kembali ke Feed
              </Link>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-dvw px-4 sm:px-6 py-8 space-y-6">
            <DashboardHeader />

            <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
              <DashboardSidebar />
              <section className="space-y-4">{children}</section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}