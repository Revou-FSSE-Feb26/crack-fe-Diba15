"use client";

import { LogIn, ChevronDown } from "lucide-react";
import Link from 'next/link'
import NavbarBrand from "@/components/ui/brand/NavbarBrand";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/UserStore";
import Clock from "@/components/dashboard/Clock";

export default function Navbar() {
  const router = useRouter();
  const { isAdmin, isCurator, logout, user } = useUserStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Set mounted to true when component mounts on client
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0)
  }, []);

  // Close Dropdown when click outside
  useEffect(() => {
    const handleClickDropdownOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickDropdownOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickDropdownOutside)
  })

  const handleLogout = () => {
    logout();
    router.push("/login");
    setIsDropdownOpen(false);
  };

  return (
    <nav className="grid grid-cols-3 items-center py-4 px-8">

      {/* Left: Brand */}
      <div className="flex justify-start text-center">
        <Clock />
      </div>

      {/* Center: Brand */}
      <div className="flex justify-center text-center">
        <NavbarBrand link="/dashboard" />
      </div>

      <div className="flex justify-end items-center gap-3">

        {/* Right: Login button */}
        <div className="flex justify-end items-center gap-3">
          {mounted && (isAdmin() || isCurator()) ? (
            <div className="hidden md:flex">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full px-3 py-2 text-content transition-colors duration-200 hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-700 cursor-pointer"
                >
                  <span className="text-sm font-medium text-primary">{user?.name}</span>
                  <span className="text-sm font-medium text-primary">
                    <ChevronDown className={`h-5 w-5 transition-all duration-200 group-hover:text-primary ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </span>
                </button>

                {isDropdownOpen && (
                  <div ref={dropdownRef} className="absolute right-0 mt-2 w-40 rounded-xl bg-white dark:bg-[#1D2D37] shadow-lg border border-slate-100 dark:border-slate-700 z-50">

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors duration-200 cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              title="Login Button"
              className="hidden md:flex rounded-full p-2 text-content transition-colors duration-200 hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-700 cursor-pointer"
            >
              <LogIn className="w-6 h-6 text-primary" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
