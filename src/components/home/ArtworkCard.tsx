'use client';

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ArtworkWithRelations } from "@/types";
import { Heart, MessageCircle, Share2, MoreHorizontal, Flag, Link as LinkIcon, BadgeCheck } from "lucide-react";
import { AvatarInitials } from "./AvatarInitials";

export function ArtworkCard({ artwork }: { artwork: ArtworkWithRelations }) {
    const { artist, artist_profile, tags } = artwork;

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
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <AvatarInitials name={artist.name} className="w-9 h-9" />
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                            <p className="text-sm font-semibold text-content truncate">
                                {artist.name}
                            </p>
                            {artist_profile.is_verified && (
                                <BadgeCheck className="w-4 h-4 text-verified" />
                            )}
                        </div>
                        <p className="text-xs text-content-muted">
                            {artwork.tags.length > 0 && artwork.tags.map((tag) => tag.tag_name).join(", ")}
                        </p>
                    </div>
                </div>

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
                                    // Logika salin tautan disini
                                    setIsDropdownOpen(false);
                                }}
                            >
                                <LinkIcon size={16} className="text-content-muted" />
                                Salin Tautan
                            </button>
                            <button
                                className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2.5 transition-colors"
                                onClick={() => {
                                    // Logika laporan disini
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

            {/* Gambar */}
            <div className="relative w-full bg-background overflow-hidden aspect-[4/3]">
                <Image
                    src={artwork.final_image_url}
                    alt={artwork.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-content/5">
                <div className="flex items-center gap-3">
                    <button title="Like" className="p-2 hover:bg-content/5 rounded-full transition-colors duration-150 -ml-2 group">
                        <Heart size={20} className="text-content-muted group-hover:text-red-500 group-hover:fill-red-500 transition-colors duration-150" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 py-3 space-y-2">
                <h3 className="text-sm font-semibold text-content">
                    {artwork.title}
                </h3>
                <p className="text-sm text-content-muted line-clamp-2 leading-relaxed">
                    {artwork.description}
                </p>

                {/* Tags */}
                {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag.id}
                                className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                            >
                                #{tag.tag_name}
                            </span>
                        ))}
                    </div>
                )}

                {/* Commission Button */}
                {artist_profile.is_open_for_commission && (
                    <button className="w-full mt-2 px-3 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors duration-150">
                        Pesan Komisi
                    </button>
                )}
            </div>
        </article>
    );
}