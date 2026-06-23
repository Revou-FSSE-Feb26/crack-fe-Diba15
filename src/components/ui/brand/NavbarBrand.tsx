import Link from "next/link"

export default function Brand() {
    return (
        <Link href="/" className="flex items-center gap-1">
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold font-syne text-primary leading-none tracking-tighter rounded-full bg-primary/10 px-6 py-2">TruBrush</h1>
            </div>
        </Link>
    )
}