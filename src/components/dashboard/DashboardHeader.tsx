"use client";

import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { getDashboardMenu } from "@/data/dashboardMenu";
import { useUserStore } from "@/store/UserStore";

export default function DashboardHeader() {
  const pathname = usePathname();
  const { user } = useUserStore();

  if (!user) return null;

  const menu = getDashboardMenu(user.role);
  const activeItem = menu.find((item) => item.href === pathname) ?? menu[0];
  const eyebrow = user.role === "admin" ? "Admin Dashboard" : "Curator Dashboard";

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          {eyebrow}
        </p>
        <h1 className="font-heading text-2xl font-bold text-content">
          {activeItem.label}
        </h1>
        <p className="mt-1 text-sm text-content-muted">{activeItem.description}</p>
      </div>
      <div className="inline-flex items-center gap-2 rounded-full bg-content/5 px-3 py-1.5 text-xs font-medium text-content-muted">
        <ShieldCheck className="h-4 w-4 text-verified" />
        {user.name} - {user.role}
      </div>
    </div>
  );
}