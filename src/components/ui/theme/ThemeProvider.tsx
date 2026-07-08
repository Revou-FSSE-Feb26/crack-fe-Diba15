"use client";

import { useEffect, useState } from "react";
import { useThemeStore } from "@/store/ThemeStore";

export default function ThemeProvider() {
    const { theme, setTheme } = useThemeStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // Cek preferensi sistem saat pertama kali load jika belum ada di localStorage
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const storedTheme = localStorage.getItem("trubrush-theme");

        // Zustand persist otomatis meload dari localStorage. 
        // Tapi jika ini kunjungan pertama, kita set berdasarkan preferensi sistem.
        if (!storedTheme && systemPrefersDark) {
            setTheme("dark");
        }

        const timer = setTimeout(() => {
            setIsMounted(true);
        }, 0);

        return () => clearTimeout(timer);
    }, [setTheme]);

    useEffect(() => {
        if (!isMounted) return;

        // Manipulasi DOM Tailwind berdasarkan state Zustand
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
            document.documentElement.classList.remove("light");
        } else {
            document.documentElement.classList.remove("dark");
            document.documentElement.classList.add("light");
        }
    }, [theme, isMounted]);

    // Komponen ini tidak me-render elemen UI apapun di layar
    return null;
}
