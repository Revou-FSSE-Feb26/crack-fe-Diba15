"use client";

import { useEffect, useState } from "react";

export default function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setNow(new Date());
    }, 0);
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Hindari mismatch saat SSR: jangan render jam sebelum mounted di client
  if (!now) return null;

  const time = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const date = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="hidden md:flex flex-col leading-tight select-none">
      <span className="text-sm font-semibold text-primary tabular-nums">
        {time}
      </span>
      <span className="text-xs text-content-muted">{date}</span>
    </div>
  );
}