// ============================================================
// TruBrush — Database Types
// untuk Prisma schema, API response, maupun komponen Next.js.
// ============================================================

import { ReactNode } from "react";

// -----------------------------------------------------------
// Enums
// -----------------------------------------------------------

export type UserRole = "artist" | "client" | "admin" | "curator";

export type CommissionStatus =
  | "pending"      // Menunggu konfirmasi artist
  | "accepted"     // Artist menerima
  | "in_progress"  // Sedang dikerjakan
  | "revision"     // Dalam proses revisi
  | "completed"    // Selesai & disetujui client
  | "cancelled"    // Dibatalkan salah satu pihak
  | "disputed";    // Dalam sengketa

export type PaymentStatus =
  | "unpaid"
  | "paid"
  | "refunded"
  | "released";    // Dana dilepas ke artist setelah selesai

export type CurationStatus =
  | "unapproved"   // Jika user tidak check periksa oleh kurator
  | "pending"      // Menunggu review kurator
  | "approved"     // Lolos kurasi, tampil di feed
  | "rejected"     // Ditolak (misal: terdeteksi AI)
  | "flagged";     // Dilaporkan, ditahan sementara

export type UploadType =
  | "original"     // Karya orisinal
  | "fanart"       // Fan art dari IP yang ada
  | "commission";  // Hasil dari komisi

export type ReportTargetType = "artwork" | "profile";

export type ReportStatus = "pending" | "resolved" | "dismissed";

export type Theme = "light" | "dark";

// -----------------------------------------------------------
// Core Tables
// -----------------------------------------------------------

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  bio: string | null;
  is_verified: boolean;
  approved_portfolio_count: number;
  is_open_for_commission: boolean;
  base_price_idr: number | null;
  strike_count: number;
  updated_at: string;
}

export interface Artwork {
  id: string;
  artists_id: string;
  title: string;
  description: string | null;
  images_url: string[];
  wip_proof_url?: string;
  upload_type: UploadType;
  curation_status: CurationStatus;
  is_visible_on_feed: boolean;
  rejection_reason?: string | null;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
  created_at: string;
}

export interface Tag {
  id: string;
  tag_name: string;
}

export interface ArtworkTag {
  artwork_id: string;
  tag_id: string;
}

export interface Commission {
  id: string;
  artists_id: string;
  client_id: string;
  commission_title: string;
  description: string | null;
  price: number;
  status: CommissionStatus;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
}

export interface CommissionProgress {
  id: string;
  commission_id: string;
  sketch_url: string | null;
  sketch_approved: boolean;
  final_artwork_url: string | null;
  final_artwork_approved: boolean;
  updated_at: string;
}

export interface Revision {
  id: string;
  user_id: string;
  commission_id: string;
  comment: string;
  created_at: string;
}

export interface DisputeLog {
  id: string;
  commission_id: string;
  is_disputed: boolean;
  reason: string;
  mediator_id: string | null;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  target_type: ReportTargetType;
  target_id: string;
  reason: string;
  status: ReportStatus;
  created_at: string;
}

// -----------------------------------------------------------
// Relational / Joined Types
// Digunakan untuk data yang sudah di-JOIN dari API / Prisma include
// -----------------------------------------------------------

/** Artwork lengkap dengan data artist dan tags-nya — untuk feed & detail page */
export interface ArtworkWithRelations extends Artwork {
  artist: Pick<User, "id" | "name">;
  artist_profile: Pick<Profile, "is_verified" | "is_open_for_commission">;
  tags: Tag[];
}

/** Profile lengkap dengan data user — untuk halaman profil artist */
export interface ProfileWithUser extends Profile {
  user: Pick<User, "id" | "name" | "email" | "role">;
}

/** Komisi lengkap dengan semua relasi — untuk commission detail page */
export interface CommissionWithRelations extends Commission {
  artist: Pick<User, "id" | "name">;
  client: Pick<User, "id" | "name">;
  progress: CommissionProgress | null;
  revisions: Revision[];
  dispute: DisputeLog | null;
}

// -----------------------------------------------------------
// API Response Wrappers
// Gunakan sebagai tipe return dari API route / Server Action
// -----------------------------------------------------------

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  code?: string;
}

// Digunakan sebagai tipe return dari API route / Server Action
export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// -----------------------------------------------------------
// Pagination
// -----------------------------------------------------------

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// -----------------------------------------------------------
// Feed & Filter
// -----------------------------------------------------------

export interface FeedFilter {
  tag_id?: string;
  curation_status?: CurationStatus;
  upload_type?: UploadType;
  sort_by?: "latest" | "popular";
  page?: number;
  per_page?: number;
}

export type SearchType = "title" | "tags" | "artists";

export interface ParsedQuery {
  type: SearchType;
  value: string;
  raw: string;
}

// -----------------------------------------------------------
// Theme
// -----------------------------------------------------------

export interface ThemeState {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

// -----------------------------------------------------------
// Data Table
// -----------------------------------------------------------

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  cell: (row: T) => ReactNode;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  pagination: PaginatedResponse<T>;
  getRowKey: (row: T) => string;
  emptyState?: ReactNode;
  isLoading?: boolean;
  toolbar?: ReactNode;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: 5 | 10) => void;
  itemLabel?: string;
}