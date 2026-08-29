"use client";

import {
	CreditCard,
	ImageIcon,
	Plus,
	RefreshCw,
	Search,
	ShieldAlert,
	ShieldCheck,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ReviewAppealModal } from "@/components/dashboard/manage-users/ReviewAppealModal";
import UserFormModal from "@/components/dashboard/manage-users/UserFormModal";
import DataTable from "@/components/ui/data-table/DataTable";
import Stat from "@/components/ui/Stat";
import { useAppeals, useResolveAppeal } from "@/hooks/useAppealQueries";
import { usePagination, useResetPageOnChange } from "@/hooks/usePagination";
import { useModalStore } from "@/store/ModalStore";
import { useToastStore } from "@/store/ToastStore";
import { useUserManagementStore } from "@/store/UserManagementStore";
import { useUserStore } from "@/store/UserStore";
import type { Appeal, User, UserRole } from "@/types";
import { createUsersTableColumns } from "@/utils/dashboard/manage-users/usersTableColumns";

type RoleFilter = "all" | UserRole;

export default function ManageUsersPage() {
	const { user: currentUser, isAdmin } = useUserStore();
	const { users, fetchUsers, createCurator, updateUser, deleteUser } =
		useUserManagementStore();
	const { openModal } = useModalStore();
	const { addToast } = useToastStore();
	const { setPage, setPerPage, paginate, resetPage } = usePagination({
		initialPerPage: 10,
	});

	const [search, setSearch] = useState("");
	const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
	const [formOpen, setFormOpen] = useState(false);
	const [editingUser, setEditingUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);

	// Fetch users dari backend saat halaman dimuat
	useEffect(() => {
		fetchUsers().finally(() => setIsLoading(false));
	}, [fetchUsers]);

	useResetPageOnChange(resetPage, [search, roleFilter]);

	const handleRefresh = async () => {
		setIsRefreshing(true);
		try {
			await fetchUsers();
		} finally {
			setIsRefreshing(false);
		}
	};

	const filteredUsers = useMemo(() => {
		const query = search.trim().toLowerCase();

		return users
			.filter((item) => roleFilter === "all" || item.role === roleFilter)
			.filter((item) => {
				if (!query) return true;
				return (
					item.name.toLowerCase().includes(query) ||
					item.email.toLowerCase().includes(query) ||
					item.id.toLowerCase().includes(query)
				);
			})
			.sort(
				(a, b) =>
					new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
			);
	}, [users, search, roleFilter]);

	const paginatedUsers = useMemo(
		() => paginate(filteredUsers),
		[filteredUsers, paginate],
	);

	const roleCounts = useMemo(
		() => ({
			all: users.length,
			artist: users.filter((item) => item.role === "artist").length,
			client: users.filter((item) => item.role === "client").length,
			curator: users.filter((item) => item.role === "curator").length,
			admin: users.filter((item) => item.role === "admin").length,
		}),
		[users],
	);

	const handleDelete = useCallback(
		(target: User) => {
			if (target.id === currentUser?.id) {
				addToast({
					message: "Kamu tidak bisa menghapus akun yang sedang login.",
					type: "error",
				});
				return;
			}

			openModal({
				title: "Hapus user?",
				description: `User "${target.name}" akan dihapus permanen dari database.`,
				type: "confirm",
				variant: "danger",
				confirmLabel: "Hapus",
				cancelLabel: "Batal",
				onConfirm: async () => {
					const result = await deleteUser(target.id);
					addToast({
						message: result.message,
						type: result.success ? "success" : "error",
					});
				},
			});
		},
		[addToast, currentUser?.id, deleteUser, openModal],
	);

	const handleEditOpen = useCallback((target: User) => {
		setEditingUser(target);
		setFormOpen(true);
	}, []);

	const { data: appeals = [] } = useAppeals();
	const resolveAppealMutation = useResolveAppeal();
	const [reviewAppeal, setReviewAppeal] = useState<Appeal | null>(null);

	const columns = useMemo(
		() =>
			createUsersTableColumns({
				currentUserId: currentUser?.id,
				onEdit: handleEditOpen,
				onDelete: handleDelete,
				renderActions: (user) => {
					const artistProfile = user.profile;
					const pendingAppeal = appeals.find(
						(a) =>
							(a.artist_id ?? a.artistId) === user.id && a.status === "pending",
					);

					return (
						<div className="flex justify-end gap-1.5 items-center">
							{user.role === "artist" &&
								artistProfile &&
								artistProfile.strike_count >= 5 && (
									<span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-danger/10 text-danger border-danger/20 shrink-0">
										Blocked ({artistProfile.strike_count}/5)
									</span>
								)}
							{pendingAppeal && (
								<button
									type="button"
									onClick={() => setReviewAppeal(pendingAppeal)}
									className="btn btn-xs btn-primary font-semibold shrink-0 cursor-pointer"
								>
									Tinjau Banding
								</button>
							)}
							<button
								type="button"
								onClick={() => handleEditOpen(user)}
								className="btn btn-xs btn-ghost border border-content/10 text-content hover:bg-content/5 shrink-0 cursor-pointer"
							>
								Edit
							</button>
							<button
								type="button"
								onClick={() => handleDelete(user)}
								disabled={user.id === currentUser?.id}
								className="btn btn-xs btn-ghost border border-danger/20 text-danger hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-40 shrink-0 cursor-pointer"
							>
								Hapus
							</button>
						</div>
					);
				},
			}),
		[currentUser?.id, handleDelete, handleEditOpen, appeals],
	);

	const openCreateForm = () => {
		setEditingUser(null);
		setFormOpen(true);
	};

	const closeForm = () => {
		setFormOpen(false);
		setEditingUser(null);
	};

	const handleCreate = async (values: {
		name: string;
		email: string;
		password: string;
		role: UserRole;
	}) => {
		const result = await createCurator({
			name: values.name,
			email: values.email,
			password: values.password,
		});

		addToast({
			message: result.message,
			type: result.success ? "success" : "error",
		});

		if (result.success) closeForm();
	};

	const handleEdit = async (values: {
		name: string;
		email: string;
		password: string;
		role: UserRole;
	}) => {
		if (!editingUser) return;

		if (editingUser.id === currentUser?.id && values.role !== "admin") {
			addToast({
				message: "Kamu tidak bisa mengubah role akun admin yang sedang aktif.",
				type: "error",
			});
			return;
		}

		const result = await updateUser(editingUser.id, {
			name: values.name,
			email: values.email,
			role: values.role,
			password: values.password.trim() || undefined,
		});

		addToast({
			message: result.message,
			type: result.success ? "success" : "error",
		});

		if (result.success) closeForm();
	};

	if (!isAdmin()) {
		return (
			<div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
				<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10 text-danger">
					<ShieldAlert className="h-8 w-8" />
				</div>
				<h1 className="text-xl font-bold text-content">Akses Dibatasi</h1>
				<p className="max-w-sm text-xs text-content-muted">
					Halaman Kelola Pengguna hanya dapat diakses oleh Administrator
					platform TruBrush.
				</p>
				<Link href="/dashboard">
					<button type="button" className="btn btn-primary btn-sm">
						Kembali ke Dashboard
					</button>
				</Link>
			</div>
		);
	}

	return (
		<>
			<div className="space-y-6">
				{/* Page Header */}
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-2xl font-bold text-content">Kelola Pengguna</h1>
						<p className="text-xs text-content-muted">
							Kelola seluruh akun pengguna, verifikasi permohonan banding akun,
							dan penambahan kurator baru.
						</p>
					</div>

					<div className="flex flex-wrap items-center gap-2 print:hidden">
						<button
							type="button"
							className="btn btn-outline btn-sm"
							onClick={handleRefresh}
							disabled={isLoading || isRefreshing}
							title="Segarkan daftar user"
						>
							<RefreshCw
								className={`h-4 w-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`}
							/>
							Segarkan
						</button>
						<button
							type="button"
							className="btn btn-primary btn-sm"
							onClick={openCreateForm}
						>
							<Plus className="h-4 w-4 mr-1" />
							Tambah Kurator
						</button>
					</div>
				</div>

				{/* KPI Summary Cards (2 Rows x 2 Columns) */}
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<Stat
						variant="card"
						icon={Users}
						label="Total Pengguna Terdaftar"
						value={
							isLoading ? (
								<span className="loading loading-dots loading-sm" />
							) : (
								`${roleCounts.all} Akun`
							)
						}
					/>
					<Stat
						variant="card"
						icon={ImageIcon}
						label="Artis Terdaftar"
						value={
							isLoading ? (
								<span className="loading loading-dots loading-sm" />
							) : (
								`${roleCounts.artist} Artis`
							)
						}
					/>
					<Stat
						variant="card"
						icon={CreditCard}
						label="Klien (Client) Terdaftar"
						value={
							isLoading ? (
								<span className="loading loading-dots loading-sm" />
							) : (
								`${roleCounts.client} Klien`
							)
						}
					/>
					<Stat
						variant="card"
						icon={ShieldCheck}
						label="Staf Kurator & Admin"
						value={
							isLoading ? (
								<span className="loading loading-dots loading-sm" />
							) : (
								`${roleCounts.curator + roleCounts.admin} Staf (${roleCounts.curator} Kurator, ${roleCounts.admin} Admin)`
							)
						}
					/>
				</div>

				{/* Filter Toolbar */}
				<div className="rounded-2xl border border-content/10 bg-surface p-4 space-y-3 print:hidden">
					{/* Search Box */}
					<div className="relative w-full max-w-md">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-muted" />
						<input
							type="text"
							placeholder="Cari pengguna berdasarkan nama, email, ID..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="input input-sm w-full pl-9 bg-background border-content/10 text-xs"
						/>
					</div>

					{/* Role Filter Presets */}
					<div className="flex flex-wrap items-center gap-2 pt-2 border-t border-content/5">
						<span className="text-xs font-semibold text-content-muted mr-1">
							Role:
						</span>
						{(
							[
								{ id: "all", label: `Semua (${roleCounts.all})` },
								{ id: "artist", label: `Artist (${roleCounts.artist})` },
								{ id: "client", label: `Client (${roleCounts.client})` },
								{ id: "curator", label: `Curator (${roleCounts.curator})` },
								{ id: "admin", label: `Admin (${roleCounts.admin})` },
							] as const
						).map((preset) => (
							<button
								key={preset.id}
								type="button"
								onClick={() => setRoleFilter(preset.id as RoleFilter)}
								className={`btn btn-xs rounded-lg ${
									roleFilter === preset.id
										? "btn-primary"
										: "btn-ghost border border-content/10"
								}`}
							>
								{preset.label}
							</button>
						))}
					</div>
				</div>

				{/* Users Table */}
				<div className="rounded-2xl border border-content/10 bg-surface overflow-hidden">
					<DataTable
						columns={columns}
						pagination={paginatedUsers}
						getRowKey={(user) => user.id}
						isLoading={isLoading}
						itemLabel="pengguna"
						onPageChange={setPage}
						onPerPageChange={setPerPage}
						emptyState={
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<Users className="h-10 w-10 text-content-muted mb-2 opacity-50" />
								<p className="text-sm font-semibold text-content">
									Tidak ada pengguna ditemukan
								</p>
								<p className="text-xs text-content-muted mt-1 max-w-xs">
									Coba sesuaikan filter role atau kata kunci pencarian untuk
									melihat user lainnya.
								</p>
							</div>
						}
					/>
				</div>
			</div>

			<UserFormModal
				mode={editingUser ? "edit" : "create"}
				user={editingUser ?? undefined}
				isOpen={formOpen}
				onClose={closeForm}
				onSubmit={editingUser ? handleEdit : handleCreate}
			/>

			<ReviewAppealModal
				appeal={reviewAppeal}
				isLoading={resolveAppealMutation.isPending}
				onClose={() => setReviewAppeal(null)}
				onResolve={async (appealId, approved, resolutionNotes) => {
					try {
						await resolveAppealMutation.mutateAsync({
							id: appealId,
							dto: { approved, resolution_notes: resolutionNotes },
						});
						addToast({
							message: approved
								? "Banding disetujui, akun berhasil dipulihkan."
								: "Banding ditolak.",
							type: "success",
						});
						setReviewAppeal(null);
					} catch (error: unknown) {
						const err = error as { response?: { data?: { message?: string } } };
						addToast({
							message:
								err.response?.data?.message || "Gagal memproses banding akun.",
							type: "error",
						});
					}
				}}
			/>
		</>
	);
}
