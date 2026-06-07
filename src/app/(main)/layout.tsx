import Navbar from "@/components/ui/Navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-full flex flex-col">
            <header>
                <Navbar />
            </header>

            <main className="flex flex-col flex-1">
                {children}
            </main>

            <footer></footer>
        </div>
    )
}