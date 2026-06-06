"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode
} from "react";

export type Theme = "light" | "dark";

interface TrubrushContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const TrubrushContext = createContext<TrubrushContextType | undefined>(undefined);

export function TrubrushProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>("light");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setIsMounted(true);
        }, 0);


        const storedTheme = localStorage.getItem("trubrush-theme") as Theme;
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        const initialTheme = storedTheme || (systemPrefersDark ? "dark" : "light");

        requestAnimationFrame(() => {
            setTheme(initialTheme)
            if (initialTheme === 'dark') document.documentElement.classList.add('dark');
            else document.documentElement.classList.add('light');
        });
    }, [])

    // Fungsi untuk mengganti tema
    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("trubrush-theme", newTheme);

        // Langsung manipulasi DOM agar Tailwind v4 mendeteksinya
        if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    if (!isMounted) {
        return <div className="min-h-screen bg-transparent" />;
    }

    return (
        <TrubrushContext.Provider
            value={{
                theme,
                toggleTheme,
            }}
        >
            {children}
        </TrubrushContext.Provider>
    );
}

export function useTrubrush() {
    const context = useContext(TrubrushContext);
    if (context === undefined) {
        throw new Error("useTruBrush must be used within a TruBrushProvider");
    }
    return context;
}