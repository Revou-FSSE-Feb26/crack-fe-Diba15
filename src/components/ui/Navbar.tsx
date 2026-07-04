"use client";

import { LogIn, Search, X, PanelLeftOpen } from "lucide-react";
import Link from 'next/link'
import NavbarBrand from "@/components/ui/brand/NavbarBrand";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface NavbarProps {
  onMenuToggle: () => void;
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/search/${encodeURIComponent(q)}`);
    setIsSearchOpen(false);
    setSearchQuery("");
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

        {/* Search — desktop only */}
        <div ref={searchContainerRef} className="hidden md:flex items-center gap-2">
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

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isSearchOpen ? "w-64 opacity-100" : "w-0 opacity-0"
              }`}
          >
            <form onSubmit={handleSearch} className="flex gap-1 items-center">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Cari karya, tags:"nama"...'
                className={inputClass}
              />
              <button
                type="submit"
                className="cursor-pointer rounded-full bg-gray-50 dark:bg-[#1D2D37] p-2"
              >
                <Search className="w-5 h-5 text-primary" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Center: Brand */}
      <div className="flex justify-center text-center">
        <NavbarBrand />
      </div>

      {/* Right: Login button */}
      <div className="flex justify-end items-center gap-3">
        <Link
          href="/login"
          title="Login Button"
          className="hidden md:flex rounded-full p-2 text-content transition-colors duration-200 hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-700 cursor-pointer"
        >
          <LogIn className="w-6 h-6 text-primary" />
        </Link>
      </div>
    </nav>
  );
}
