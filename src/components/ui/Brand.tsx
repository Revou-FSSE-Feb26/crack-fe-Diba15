import Link from "next/link"
import { Palette } from "lucide-react"

export default function Brand() {
    return (
        <Link href="/" className="flex items-center gap-1 font-extrabold">
            <Palette className="w-6 h-6 text-primary" />
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold font-outfit text-primary leading-none">TruBrush</h1>
                <span className="text-sm font-light font-outfit text-content-muted">Make art shine</span>
            </div>
        </Link>
    )
}