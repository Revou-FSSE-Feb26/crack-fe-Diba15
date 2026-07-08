"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Search,
  X,
  Tag,
  User,
  FileText,
  Info,
} from "lucide-react";
import Link from "next/link";
import { parseSearchQuery, searchArtworks } from "@/utils/search";
import { ArtworkCard } from "@/components/home/ArtworkCard";
import { useArtworkStore } from "@/store/ArtworkStore";
import { useUserManagementStore } from "@/store/UserManagementStore";

const TYPE_CONFIG = {
  title: {
    label: "Judul",
    Icon: FileText,
    pill: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  tags: {
    label: "Tag",
    Icon: Tag,
    pill: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  artists: {
    label: "Artis",
    Icon: User,
    pill: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  },
};

export default function SearchPage() {
  const params = useParams();
  const router = useRouter();

  const rawQuery = decodeURIComponent(params.param as string);
  const [inputValue, setInputValue] = useState(rawQuery);
  const { artworks, artworkTags, tags } = useArtworkStore();
  const { users } = useUserManagementStore();  

  const parsed = parseSearchQuery(rawQuery);
  const results = searchArtworks(parsed, artworks, artworkTags, tags, users)
    .filter((artwork) => artwork.is_visible_on_feed);

  const { label, Icon, pill } = TYPE_CONFIG[parsed.type];

  // Sync input value when URL param changes (e.g. tag pill click)
  useEffect(() => {
    setTimeout(() => {
      setInputValue(rawQuery);
    }, 0);
  }, [rawQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = inputValue.trim();
    if (!q) return;
    router.push(`/search/${encodeURIComponent(q)}`);
  };

  return (
    <main className="min-h-screen bg-background text-content pb-20">

      {/* Sticky Search Header */}
      <div className="bg-background/90 backdrop-blur-md border-b border-content/10 px-4 py-3">
        <form
          onSubmit={handleSearch}
          className="max-w-2xl mx-auto flex gap-2"
        >
          <Link
            href="/"
            className="shrink-0 p-2 rounded-full hover:bg-content/5 transition-colors"
          >
            <ArrowLeft size={20} className="text-content" />
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-2 w-full">
            <div className="flex-1 flex items-center gap-2 bg-surface rounded-lg px-3 py-2 border border-content/10 focus-within:border-primary/50 transition-colors">
              <Search size={15} className="text-content-muted shrink-0" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder='Judul, tags:"nama", artists:"nama"'
                className="flex-1 bg-transparent outline-none text-sm text-content placeholder:text-content-muted"
                autoFocus
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={() => setInputValue("")}
                  className="p-0.5 rounded-full hover:bg-content/10 transition-colors"
                >
                  <X size={14} className="text-content-muted" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="shrink-0 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
            >
              Cari
            </button>
          </div>
        </form>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-10 space-y-5">

        {/* Filter badge + result count */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-content-muted">
              Menampilkan hasil untuk:
            </span>
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${pill}`}
            >
              <Icon size={11} />
              {label}: {parsed.value}
            </span>
          </div>
          <p className="text-xs text-content-muted">
            {results.length} karya ditemukan
          </p>
        </div>

        {/* Search tips */}
        <div className="bg-surface rounded-xl p-4 border border-content/5 text-xs">
          <div className="flex items-start gap-2">
            <Info
              size={14}
              className="text-content-muted mt-0.5 shrink-0"
            />
            <div className="space-y-1 text-content-muted">
              <p className="font-semibold text-content text-[11px] uppercase tracking-wide mb-2">
                Tips Pencarian
              </p>
              <p>
                Ketik nama karya → cari berdasarkan{" "}
                <strong className="text-content">judul</strong>
              </p>
              <p>
                <code className="bg-content/10 px-1 py-0.5 rounded text-primary">
                  tags:&quot;nama-tag&quot;
                </code>{" "}
                → filter berdasarkan{" "}
                <strong className="text-content">tag</strong>
              </p>
              <p>
                <code className="bg-content/10 px-1 py-0.5 rounded text-primary">
                  artists:&quot;nama-artis&quot;
                </code>{" "}
                → filter berdasarkan{" "}
                <strong className="text-content">artis</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <section className="flex flex-col gap-4">
            {results.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </section>
        ) : (
          <section className="flex flex-col items-center py-20 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-content/5 flex items-center justify-center">
              <Search size={28} className="text-content-muted" />
            </div>
            <div>
              <p className="font-semibold text-content">
                Tidak ada karya ditemukan
              </p>
              <p className="text-sm text-content-muted mt-1">
                Coba kata kunci lain atau gunakan prefix yang berbeda.
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
