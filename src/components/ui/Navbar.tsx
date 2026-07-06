"use client";

import { LogIn, Search, X, PanelLeftOpen, ChevronDown, PlusCircle, LayoutDashboard } from "lucide-react";
import Link from 'next/link'
import NavbarBrand from "@/components/ui/brand/NavbarBrand";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/UserStore";

interface NavbarProps {
  onMenuToggle: () => void;
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { isArtist, isClient, isAdmin, isCurator, logout, user } = useUserStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Set mounted to true when component mounts on client
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0)
  }, []);

  const inputClass =
    "w-full max-w-sm md:max-w-lg px-4 py-2 text-primary bg-gray-50 dark:bg-[#1D2D37] rounded-lg outline-none";

  // Auto-focus input when search opens
  useEffect(() => {
    if (isSearchOpen) {
      inputRef.current?.focus();
    }
  }, [isSearchOpen]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen]);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/search/${encodeURIComponent(q)}`);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
    setIsDropdownOpen(false);
  };

  return (
    <nav className="grid grid-cols-3 items-center py-4 px-8">
      {/* Left: Sidebar toggle + Search */}
      <div className="flex gap-2 items-center">
        <button
          type="button"
          onClick={onMenuToggle}
          title="Open sidebar"
          aria-label="Toggle sidebar"
          className="rounded-full p-2 text-content transition-colors duration-200 hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-700 cursor-pointer shrink-0"
        >
          <PanelLeftOpen className="w-6 h-6 text-primary" />
        </button>

        {mounted && isArtist() && (
          <Link
            href="/post-art"
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-background shadow-sm transition-colors hover:bg-primary-hover"
          >
            <PlusCircle className="h-4 w-4" />
            Post Art
          </Link>
        )}

        {mounted && (isAdmin() || isCurator()) && (
          <Link
            href="/dashboard"
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-background shadow-sm transition-colors hover:bg-primary-hover"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        )}
        
      </div>

      {/* Center: Brand */}
      <div className="flex justify-center text-center">
        <NavbarBrand />
      </div>

      <div className="flex justify-end items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsSearchOpen((prev) => !prev)}
            title={isSearchOpen ? "Close search" : "Open search"}
            aria-label={isSearchOpen ? "Close search" : "Open search"}
            className="rounded-full p-2 text-content transition-colors duration-200 hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-700 cursor-pointer shrink-0"
          >
            {isSearchOpen ? (
              <X className="w-5 h-5 text-primary" />
            ) : (
              <Search className="w-5 h-5 text-primary" />
            )}
          </button>
        </div>

        {/* Right: Login button */}
        <div className="flex justify-end items-center gap-3">
          {mounted && (isArtist() || isClient() || isAdmin() || isCurator()) ? (
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

      {/*Center Input*/}
      <div
        className={`col-span-3 overflow-hidden transition-all duration-300 ease-in-out ${isSearchOpen ? "max-h-16 opacity-100 mt-4" : "max-h-0 opacity-0 pointer-events-none"
          }`}
      >
        <form onSubmit={handleSearch} className="flex justify-center items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Cari karya, tags:"nama", artists:"nama"'
            className={inputClass}
          />
          <button type="submit" className="p-2 text-primary bg-gray-50 dark:bg-[#1D2D37] rounded-full cursor-pointer">
            <Search className="w-5 h-5 text-primary" />
          </button>
        </form>
      </div>
    </nav>
  );
}
