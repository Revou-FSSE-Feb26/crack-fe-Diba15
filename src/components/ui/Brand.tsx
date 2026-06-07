import Link from "next/link"
// import { Palette } from "lucide-react"

export default function Brand() {
    return (
        <Link href="/" className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-outfit text-primary">TruBrush</h1>
        </Link>
    )
}