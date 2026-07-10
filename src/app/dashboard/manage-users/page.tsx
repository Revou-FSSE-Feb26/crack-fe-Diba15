"use client";

import { AlertTriangle, Plus, Search, ShieldAlert, Users } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

import UserFormModal from "@/components/dashboard/manage-users/UserFormModal";
import Button from "@/components/ui/Button";
import DataTable from "@/components/ui/data-table/DataTable";
import { usePagination, useResetPageOnChange } from "@/hooks/usePagination";
import { useModalStore } from "@/store/ModalStore";
import { useToastStore } from "@/store/ToastStore";
import { useUserManagementStore } from "@/store/UserManagementStore";
import { useUserStore } from "@/store/UserStore";
import type { User, UserRole } from "@/types";
import {
	createUsersTableColumns,
	roleLabels,
} from "@/utils/dashboard/manage-users/usersTableColumns";

type RoleFilter = "all" | UserRole;

export default function ManageUsersPage() {
	const { user: currentUser, isAdmin } = useUserStore();
	const { users, createCurator, updateUser, deleteUser } =
		useUserManagementStore();
	const { openModal } = useModalStore();
	const { addToast } = useToastStore();
	const { setPage, setPerPage, paginate, resetPage } = usePagination({
		initialPerPage: 5,
	});

	const [search, setSearch] = useState("");
	const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
	const [formOpen, setFormOpen] = useState(false);
	const [editingUser, setEditingUser] = useState<User | null>(null);

	useResetPageOnChange(resetPage, [search, roleFilter]);

	const filteredUsers = useMemo(() => {
		const query = search.trim().toLowerCase();

		return users
			.filter((item) => roleFilter === "all" || item.role === roleFilter)
			.filter((item) => {
				if (!query) return true;
				return (
					item.name.toLowerCase().includes(query) ||
					item.email.toLowerCase().includes(query)
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
				description: `User "${target.name}" akan dihapus permanen dari daftar mock data.`,
				type: "confirm",
				variant: "danger",
				confirmLabel: "Hapus",
				cancelLabel: "Batal",
				onConfirm: () => {
					const result = deleteUser(target.id);
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

	const columns = useMemo(
		() =>
			createUsersTableColumns({
				currentUserId: currentUser?.id,
				onEdit: handleEditOpen,
				onDelete: handleDelete,
			}),
		[currentUser?.id, handleDelete, handleEditOpen],
	);

	const openCreateForm = () => {
		setEditingUser(null);
		setFormOpen(true);
	};

	const closeForm = () => {
		setFormOpen(false);
		setEditingUser(null);
	};

	const handleCreate = (values: {
		name: string;
		email: string;
		password: string;
		role: UserRole;
	}) => {
		const result = createCurator({
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

	const handleEdit = (values: {
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

		const result = updateUser(editingUser.id, {
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
			<div className="rounded-2xl border border-content/10 bg-surface p-6 text-center">
				<ShieldAlert className="mx-auto mb-3 h-10 w-10 text-danger" />
				<h1 className="font-heading text-2xl font-semibold text-content">
					Akses Admin Diperlukan
				</h1>
				<p className="mt-2 text-sm text-content-muted">
					Halaman manage user hanya tersedia untuk akun admin.
				</p>
				<Link
					href="/dashboard"
					className="mt-5 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-primary-hover"
				>
					Kembali ke Dashboard
				</Link>
			</div>
		);
	}

	return (
		<>
			<div className="w-full space-y-4">
				<div className="flex flex-col gap-4 rounded-2xl border border-content/10 bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-2">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
							<Users className="h-5 w-5" />
						</div>
						<div>
							<h1 className="font-heading text-2xl font-semibold text-content">
								Manage Users
							</h1>
							<p className="text-sm text-content-muted">
								Kelola seluruh user platform. Penambahan user baru hanya untuk
								role curator.
							</p>
						</div>
					</div>

					<Button
						className="flex items-center justify-center gap-1"
						onClick={openCreateForm}
					>
						<Plus className="h-4 w-4" />
						Tambah Curator
					</Button>
				</div>

				<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
					{(Object.keys(roleLabels) as UserRole[]).map((role) => (
						<button
							key={role}
							type="button"
							onClick={() => setRoleFilter(role)}
							className={[
								"rounded-xl border px-4 py-3 text-left transition-colors",
								roleFilter === role
									? "border-primary bg-primary/5"
									: "border-content/10 bg-surface hover:border-content/20",
							].join(" ")}
						>
							<p className="text-xs text-content-muted">{roleLabels[role]}</p>
							<p className="mt-1 font-display text-xl font-bold text-content">
								{roleCounts[role]}
							</p>
						</button>
					))}
					<button
						type="button"
						onClick={() => setRoleFilter("all")}
						className={[
							"rounded-xl border px-4 py-3 text-left transition-colors",
							roleFilter === "all"
								? "border-primary bg-primary/5"
								: "border-content/10 bg-surface hover:border-content/20",
						].join(" ")}
					>
						<p className="text-xs text-content-muted">Semua Role</p>
						<p className="mt-1 font-display text-xl font-bold text-content">
							{roleCounts.all}
						</p>
					</button>
				</div>

				<DataTable
					columns={columns}
					pagination={paginatedUsers}
					getRowKey={(user) => user.id}
					itemLabel="user"
					onPageChange={setPage}
					onPerPageChange={setPerPage}
					emptyState={
						<div className="flex flex-col items-center gap-2">
							<AlertTriangle className="h-5 w-5" />
							<span>Tidak ada user yang cocok dengan filter saat ini.</span>
						</div>
					}
					toolbar={
						<div className="relative w-full sm:max-w-sm">
							<Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-content-muted" />
							<input
								type="search"
								value={search}
								onChange={(event) => setSearch(event.target.value)}
								placeholder="Cari nama atau email..."
								className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pr-4 pl-10 text-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#33658A] dark:border-gray-600 dark:bg-[#1D2D37] dark:focus:ring-[#86BBD8]"
							/>
						</div>
					}
				/>
			</div>

			<UserFormModal
				mode={editingUser ? "edit" : "create"}
				user={editingUser ?? undefined}
				isOpen={formOpen}
				onClose={closeForm}
				onSubmit={editingUser ? handleEdit : handleCreate}
			/>
		</>
	);
}
