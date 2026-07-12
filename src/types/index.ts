// =============================================================================
// TruBrush — TypeScript Type Definitions
// Terpusat untuk Entitas Database, API Transport, Global State, dan UI.
// =============================================================================

import type { ReactNode } from "react";

// =============================================================================
// BAGIAN 1: ENTITAS & MODEL DATABASE (CORE & RELATIONAL)
// =============================================================================

// ── Enums & Literal Types ───────────────────────────────────────────────────

export type UserRole = "artist" | "client" | "admin" | "curator";

export type CommissionStatus =
	| "pending" // Menunggu konfirmasi artist
	| "accepted" // Artist menerima
	| "in_progress" // Sedang dikerjakan
	| "revision" // Dalam proses revisi
	| "completed" // Selesai & disetujui client
	| "cancelled" // Dibatalkan salah satu pihak
	| "disputed"; // Dalam sengketa

export type PaymentStatus = "unpaid" | "paid" | "refunded" | "released";

export type CurationStatus =
	| "unapproved" // Jika user tidak check periksa oleh kurator
	| "pending" // Menunggu review kurator
	| "approved" // Lolos kurasi, tampil di feed
	| "rejected" // Ditolak (misal: terdeteksi AI)
	| "flagged"; // Dilaporkan, ditahan sementara

export type UploadType =
	| "original" // Karya orisinal
	| "fanart" // Fan art dari IP yang ada
	| "commission"; // Hasil dari komisi

export type ReportTargetType = "artwork" | "profile";

export type ReportStatus = "pending" | "resolved" | "dismissed";

export type Theme = "light" | "dark";

// ── Core Entities (Prisma-like Models) ───────────────────────────────────────

export interface User {
	id: string;
	name: string;
	email: string;
	password: string;
	role: UserRole;
	balance: number;
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
	payment_method?: "wallet" | "credit_card";
	card_last_four?: string;
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
	status: "pending" | "approved" | "rejected";
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

// ── Relational / Joined Entities ─────────────────────────────────────────────

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

/** Sengketa lengkap dengan komisi, progress, client, dan artist — untuk tabel sengketa */
export interface JoinedDispute extends DisputeLog {
	commission?: Commission;
	progress?: CommissionProgress;
	client?: User;
	artist?: User;
}

/** Laporan lengkap dengan artwork, pelapor, dan artist — untuk tabel review laporan */
export interface JoinedReport extends Report {
	artwork?: Artwork;
	reporter?: User;
	artist?: User;
}

// =============================================================================
// BAGIAN 2: API, DATA TRANSPORT & PAGINATION
// =============================================================================

export interface ApiSuccess<T> {
	success: true;
	data: T;
}

export interface ApiError {
	success: false;
	message: string;
	code?: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	per_page: number;
	total_pages: number;
}

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

// =============================================================================
// BAGIAN 3: STATE MANAGEMENT (ZUSTAND STORES)
// =============================================================================

// ── General Results ──────────────────────────────────────────────────────────

export interface ActionResult {
	success: boolean;
	message: string;
}

// ── Theme Store ──────────────────────────────────────────────────────────────

export interface ThemeState {
	theme: Theme;
	toggleTheme: () => void;
	setTheme: (theme: Theme) => void;
}

// ── Artwork Store ────────────────────────────────────────────────────────────

export interface CreateArtworkPayload {
	artists_id: string;
	title: string;
	description: string | null;
	images_url: string[];
	wip_proof_url?: string;
	upload_type: UploadType;
	curation_status: CurationStatus;
	is_visible_on_feed: boolean;
	tag_names: string[];
}

export interface ArtworkState {
	artworks: Artwork[];
	artworkTags: ArtworkTag[];
	tags: Tag[];
	createArtwork: (payload: CreateArtworkPayload) => Artwork;
	approveArtwork: (id: string, curatorId: string) => ActionResult;
	rejectArtwork: (
		id: string,
		curatorId: string,
		reason: string,
	) => ActionResult;
}

// ── Profile Store ────────────────────────────────────────────────────────────

export interface UpdateProfilePayload {
	bio?: string | null;
	is_open_for_commission?: boolean;
	base_price_idr?: number | null;
	is_verified?: boolean;
	approved_portfolio_count?: number;
	strike_count?: number;
}

export interface ProfileState {
	profiles: Profile[];
	getProfileByUserId: (userId: string) => Profile | undefined;
	updateProfile: (
		userId: string,
		payload: UpdateProfilePayload,
	) => ActionResult;
}

// ── Commission Store ─────────────────────────────────────────────────────────

export interface CreateCommissionPayload {
	artists_id: string;
	client_id: string;
	commission_title: string;
	description: string | null;
	price: number;
}

export interface CommissionState {
	commissions: Commission[];
	progress: CommissionProgress[];
	revisions: Revision[];
	disputes: DisputeLog[];
	createCommission: (payload: CreateCommissionPayload) => Commission;
	setCommissionStatus: (id: string, status: CommissionStatus) => void;
	setPaymentStatus: (
		id: string,
		payment_status: PaymentStatus,
		payment_method?: "wallet" | "credit_card",
		card_last_four?: string,
	) => ActionResult;
	uploadDummyResult: (id: string) => void;
	approveResult: (id: string) => void;
	addRevision: (
		commission_id: string,
		user_id: string,
		comment: string,
	) => void;
	fileDispute: (commission_id: string, reason: string) => ActionResult;
	resolveDispute: (
		commission_id: string,
		approved: boolean,
		mediator_id: string,
	) => ActionResult;
}

// ── Report Store ─────────────────────────────────────────────────────────────

export interface CreateReportPayload {
	reporter_id: string;
	target_type: ReportTargetType;
	target_id: string;
	reason: string;
}

export interface ReportState {
	reports: Report[];
	createReport: (payload: CreateReportPayload) => ActionResult;
	resolveReport: (reportId: string, curatorId: string) => ActionResult;
	dismissReport: (reportId: string, curatorId: string) => ActionResult;
}

// ── Favorite Store ───────────────────────────────────────────────────────────

export type FavoriteByUser = Record<string, string[]>;

export interface FavoriteState {
	favoritesByUser: FavoriteByUser;
	getFavoriteIds: (userId: string) => string[];
	isFavorite: (userId: string, artworkId: string) => boolean;
	addFavorite: (userId: string, artworkId: string) => void;
	removeFavorite: (userId: string, artworkId: string) => void;
	toggleFavorite: (userId: string, artworkId: string) => boolean;
	clearFavorites: (userId: string) => void;
}

// ── Follow Store ─────────────────────────────────────────────────────────────

export interface FollowRecord {
	id: string;
	follower_id: string;
	artist_id: string;
	created_at: string;
}

export interface FollowState {
	follows: FollowRecord[];
	followArtist: (followerId: string, artistId: string) => ActionResult;
	unfollowArtist: (followerId: string, artistId: string) => ActionResult;
	isFollowing: (followerId: string, artistId: string) => boolean;
	getFollowedArtistIds: (followerId: string) => string[];
}

// ── User Management Store ────────────────────────────────────────────────────

export interface UserPayload {
	name: string;
	email: string;
	password: string;
	role: UserRole;
	balance?: number;
}

export interface UserManagementState {
	users: User[];
	createUser: (payload: UserPayload) => ActionResult;
	createCurator: (payload: Omit<UserPayload, "role">) => ActionResult;
	updateUser: (id: string, payload: Partial<UserPayload>) => ActionResult;
	deleteUser: (id: string) => ActionResult;
}

// ── User Store (Auth) ────────────────────────────────────────────────────────

export type SafeUser = Omit<User, "password">;

export interface UserState {
	user: SafeUser | null;
	isAuthenticated: boolean;
	login: (email: string, password: string) => ActionResult;
	logout: () => void;
	updateCurrentUser: (payload: Partial<Omit<SafeUser, "id" | "role">>) => void;
	hasRole: (role: UserRole) => boolean;
	isArtist: () => boolean;
	isClient: () => boolean;
	isCurator: () => boolean;
	isAdmin: () => boolean;
}

// ── Lightbox Store ───────────────────────────────────────────────────────────

export interface LightboxState {
	isOpen: boolean;
	images: string[];
	initialIndex: number;
	title?: string;
	openLightbox: (
		images: string[],
		initialIndex?: number,
		title?: string,
	) => void;
	closeLightbox: () => void;
}

// ── Modal Store ──────────────────────────────────────────────────────────────

export type ModalType = "alert" | "confirm" | "form";
export type ModalVariant = "default" | "danger";

export interface ModalConfig {
	id?: string;
	title: string;
	description?: string;
	content?: ReactNode;
	type?: ModalType;
	variant?: ModalVariant;
	maxWidthClassName?: string;
	formClassName?: string;
	onSubmit?: (event: React.SubmitEvent<HTMLFormElement>) => undefined | boolean;
	confirmLabel?: string;
	cancelLabel?: string;
	onConfirm?: () => void;
	onCancel?: () => void;
	confirmDisabled?: boolean;
}

export interface ModalState {
	isOpen: boolean;
	config: ModalConfig | null;
	openModal: (config: ModalConfig) => void;
	closeModal: () => void;
}

// ── Toast Store ──────────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
	id: string;
	message: string;
	type: ToastType;
	duration: number;
}

export interface AddToastOptions {
	message: string;
	type?: ToastType;
	duration?: number;
}

export interface ToastState {
	toasts: Toast[];
	addToast: (options: AddToastOptions) => void;
	removeToast: (id: string) => void;
}

// =============================================================================
// BAGIAN 4: ELEMEN UI GLOBAL (COMPONENTS & PROPS)
// =============================================================================

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
