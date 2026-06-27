import {useRouter} from "next/navigation";

export default function Pill({ children, className, link }: { children: React.ReactNode; className?: string; link?: string }) {
  const router = useRouter();
  return (
    <span
      className={`text-xs px-2 py-1 rounded-full bg-primary/10 text-primary ${className ?? ""}`}
      onClick={() => router.push(link ?? "")}
    >
      {children}
    </span>
  );
}
