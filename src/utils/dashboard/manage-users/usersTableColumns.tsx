"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { ReactNode } from "react";

import type { DataTableColumn, User, UserRole } from "@/types";

export const roleLabels: Record<UserRole, string> = {
	artist: "Artist",
	client: "Client",
	curator: "Curator",
	admin: "Admin",
};

export const roleBadgeClass: Record<UserRole, string> = {
	admin: "bg-danger/10 text-danger",
	curator: "bg-primary/10 text-primary",
	artist: "bg-verified/10 text-verified",
	client: "bg-accent/20 text-primary dark:text-accent",
};

import { formatShortDate } from "@/utils";

interface CreateUsersTableColumnsOptions {
	currentUserId?: string;
	onEdit: (user: User) => void;
	onDelete: (user: User) => void;
	renderActions?: (user: User) => ReactNode;
}

export function createUsersTableColumns({
	currentUserId,
	onEdit,
	onDelete,
	renderActions,
}: CreateUsersTableColumnsOptions): DataTableColumn<User>[] {
	return [
		{
			key: "name",
			header: "Nama",
			cell: (user) => (
				<div className="flex items-center gap-2 font-medium text-content">
					<span>{user.name}</span>
					{user.id === currentUserId && (
						<span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-semibold text-primary dark:text-accent">
							Kamu
						</span>
					)}
				</div>
			),
		},
		{
			key: "email",
			header: "Email",
			cell: (user) => <span className="text-content-muted">{user.email}</span>,
		},
		{
			key: "role",
			header: "Role",
			cell: (user) => (
				<span
					className={[
						"inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
						roleBadgeClass[user.role],
					].join(" ")}
				>
					{roleLabels[user.role]}
				</span>
			),
		},
		{
			key: "created_at",
			header: "Bergabung",
			cell: (user) => (
				<span className="text-content-muted">
					{formatShortDate(user.created_at)}
				</span>
			),
		},
		{
			key: "actions",
			header: "Aksi",
			headerClassName: "text-right",
			cellClassName: "text-right",
			cell: (user) =>
				renderActions?.(user) ?? (
					<DefaultUserActions
						user={user}
						currentUserId={currentUserId}
						onEdit={onEdit}
						onDelete={onDelete}
					/>
				),
		},
	];
}

function DefaultUserActions({
	user,
	currentUserId,
	onEdit,
	onDelete,
}: {
	user: User;
	currentUserId?: string;
	onEdit: (user: User) => void;
	onDelete: (user: User) => void;
}) {
	return (
		<div className="flex justify-end gap-2">
			<button
				type="button"
				onClick={() => onEdit(user)}
				className="inline-flex items-center gap-1 rounded-lg border border-content/10 px-3 py-1.5 text-xs font-medium text-content transition-colors hover:bg-content/5"
			>
				<Pencil className="h-3.5 w-3.5" />
				Edit
			</button>
			<button
				type="button"
				onClick={() => onDelete(user)}
				disabled={user.id === currentUserId}
				className="inline-flex items-center gap-1 rounded-lg border border-danger/20 px-3 py-1.5 text-xs font-medium text-danger transition-colors hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-40"
			>
				<Trash2 className="h-3.5 w-3.5" />
				Hapus
			</button>
		</div>
	);
}
