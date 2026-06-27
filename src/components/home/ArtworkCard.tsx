'use client';

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArtworkWithRelations } from "@/types";
import { Heart, MoreHorizontal, Flag, Link as LinkIcon, BadgeCheck } from "lucide-react";
import AvatarInitials from "./AvatarInitials";
import Button from "@/components/ui/Button";
import Pill from "@/components/ui/Pill";

export function ArtworkCard({ artwork }: { artwork: ArtworkWithRelations }) {
  const { artist, artist_profile, tags } = artwork;

  // Asumsi: artwork memiliki properti array `images`.
  // Jika tidak ada, kita fallback ke `final_image_url` tunggal.
  const images = artwork.images_url || ["https://picsum.photos/seed/antariksa/800/600"];
  const imageCount = images.length;

  // State untuk mengatur visibilitas dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Effect untuk menutup dropdown saat user mengklik area di luar menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <article className="bg-surface rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-content/5">
        <Link href={`/artists/${artist.id}`} className="flex items-center gap-2.5 flex-1 min-w-0">
          <AvatarInitials name={artist.name} className="w-9 h-9" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-content truncate">
                {artist.name}
              </p>
              {artist_profile.is_verified && (
                <BadgeCheck className="w-4 h-4 text-verified shrink-0" />
              )}
            </div>
          </div>
        </Link>

        {/* Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <button
            title="More"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`p-2 rounded-full transition-colors duration-150 -mr-1 cursor-pointer ${isDropdownOpen ? 'bg-content/5' : 'hover:bg-content/5'}`}
          >
            <MoreHorizontal size={18} className="text-content-muted" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-40 bg-background border border-content/10 rounded-lg shadow-lg z-10 overflow-hidden py-1">
              <button
                className="w-full text-left px-4 py-2.5 text-sm text-content hover:bg-content/5 flex items-center gap-2.5 transition-colors"
                onClick={() => {
                  setIsDropdownOpen(false);
                }}
              >
                <LinkIcon size={16} className="text-content-muted" />
                Salin Tautan
              </button>
              <button
                className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2.5 transition-colors"
                onClick={() => {
                  setIsDropdownOpen(false);
                }}
              >
                <Flag size={16} />
                Laporkan
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Gambar (Sistem Grid Dinamis) */}
      <Link href={`/detail/${artwork.id}`} className="relative w-full bg-content/5 overflow-hidden aspect-4/3 grid grid-cols-2 grid-rows-2 gap-0.5 cursor-pointer">

        {/* Gambar 1 (Kiri - Bisa full atau setengah layar) */}
        {imageCount > 0 && (
          <div className={`relative w-full h-full overflow-hidden ${imageCount === 1 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-2'}`}>
            <Image
              src={images[0]}
              alt={`${artwork.title} - Image 1`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
              className="object-cover transition-transform duration-300"
            />
          </div>
        )}

        {/* Gambar 2 (Kanan Atas / Kanan Full) */}
        {imageCount > 1 && (
          <div className={`relative w-full h-full overflow-hidden ${imageCount === 2 ? 'col-span-1 row-span-2' : 'col-span-1 row-span-1'}`}>
            <Image
              src={images[1]}
              alt={`${artwork.title} - Image 2`}
              fill
              sizes="max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
              className="object-cover transition-transform duration-300"
            />
          </div>
        )}

        {/* Gambar 3 (Kanan Bawah) */}
        {imageCount > 2 && (
          <div className="relative w-full h-full overflow-hidden col-span-1 row-span-1">
            <Image
              src={images[2]}
              alt={`${artwork.title} - Image 3`}
              fill
              sizes="max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
              className="object-cover transition-transform duration-300"
            />

            {/* Overlay Jika Gambar Lebih Dari 3 */}
            {imageCount > 3 && (
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[3px] flex flex-col items-center justify-center gap-1 hover:bg-black/50 transition-colors duration-200 z-10"
              >
                <span className="text-white text-xl font-bold tracking-wider">
                  +{imageCount - 3}
                </span>
                <span className="text-white text-xs font-medium px-2">
                  Tampilkan Semua
                </span>
              </div>
            )}
          </div>
        )}
      </Link>

      {/* Action Bar */}
      <div className="flex flex-col px-4 py-3 border-b border-content/5">
        <div className="flex justify-between items-center gap-2 w-full">
          <Link href={`/detail/${artwork.id}`} className="text-sm font-semibold text-content">
            {artwork.title}
          </Link>
          <button title="Like" className="p-2 hover:bg-content/5 rounded-full transition-colors duration-150 -ml-2 group cursor-pointer">
            <Heart size={20} className="text-content-muted group-hover:text-red-500 group-hover:fill-red-500 transition-colors duration-150" />
          </button>
        </div>
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tags.slice(0, 3).map((tag) => (
              <Pill key={tag.id}>{tag.tag_name}</Pill>
            ))}
            {tags.length > 3 && (
              <Pill>+{tags.length - 3}</Pill>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-3 space-y-2">
        {/* Commission Button */}
        {artist_profile.is_verified ? (
          <div>
            {artist_profile.is_open_for_commission ? (
              <Button className="w-full text-sm">
                Pesan Komisi
              </Button>
            ) : (
              <Button variant="secondary" className="w-full text-sm pointer-events-none" disabled>
                Komisi Tutup
              </Button>
            )}
          </div>
        ) : (
          <div>
            <Button variant="danger" className="w-full text-sm pointer-events-none" disabled>
              Belum Diverifikasi
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}
