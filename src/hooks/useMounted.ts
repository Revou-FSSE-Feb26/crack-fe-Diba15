"use client";

import { useEffect, useState } from "react";

/**
 * Mengembalikan `true` setelah komponen mount di client.
 *
 * Dipakai untuk menghindari hydration mismatch ketika render bergantung
 * pada data yang hanya tersedia di browser (localStorage, Zustand persist,
 * window, dsb) — server selalu merender versi "belum mounted".
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return mounted;
}