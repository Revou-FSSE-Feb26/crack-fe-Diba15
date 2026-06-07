import Link from "next/link";
import { Home, Layers, Star, MessageSquare, Settings, Users, X, Menu } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Brand from "@/components/ui/Brand";

interface SidebarProps {
    onClose: () => void;
}

const menuItems: Array<{ label: string; href: string; icon: LucideIcon }> = [
    { label: "Dashboard", href: "#", icon: Home },
    { label: "Collections", href: "#", icon: Layers },
    { label: "Featured", href: "#", icon: Star },
    { label: "Messages", href: "#", icon: MessageSquare },
    { label: "Teams", href: "#", icon: Users },
    { label: "Settings", href: "#", icon: Settings },
];

export default function Sidebar({ onClose }: SidebarProps) {
    return (
        <aside className="flex justify-between h-full min-h-screen w-72 flex-col gap-6 border-r border-slate-200/70 bg-surface p-4 text-content transition-colors duration-300 dark:border-slate-700/60">
            <div>
                <div className="mb-6 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close sidebar"
                        className="rounded-full p-2 text-content transition-colors duration-200 hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-700"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <Brand />
                </div>

                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium text-content transition-all duration-200 hover:bg-primary/10 hover:text-primary"
                            >
                                <Icon className="h-5 w-5 transition-colors duration-200 group-hover:text-primary" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <footer className="mt-6 border-t border-slate-200/70 pt-4 text-sm text-content-muted dark:border-slate-700/60">
                <div className="mb-3 flex flex-wrap gap-2 text-xs leading-6">
                    <Link href="#" className="transition-colors hover:text-primary">
                        Announcements
                    </Link>
                    <Link href="#" className="transition-colors hover:text-primary">
                        Help
                    </Link>
                    <Link href="#" className="transition-colors hover:text-primary">
                        Privacy
                    </Link>
                    <Link href="#" className="transition-colors hover:text-primary">
                        Careers
                    </Link>
                </div>
                <p>© TruBrush</p>
            </footer>
        </aside>
    );
}
