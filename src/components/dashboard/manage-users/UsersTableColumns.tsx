"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { ReactNode } from "react";

import type { DataTableColumn, User, UserRole } from "@/types";
import { formatShortDate } from "@/utils";

export const roleLabels: Record<UserRole, string> = {
	artist: "Artist",
	client: "Client",
	curator: "Curator",
	admin: "Admin",
};

export const roleBadgeClass: Record<UserRole, string> = {
	admin: "bg-danger/10 text-danger border-danger/20",
	curator: "bg-primary/10 text-primary border-primary/20",
	artist: "bg-verified/10 text-verified border-verified/20",
	client: "bg-premium/10 text-premium border-premium/20",
};

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
			header: "Nama Pengguna",
			cell: (user) => (
				<div className="flex items-center gap-2 font-medium text-content text-xs">
					<span className="truncate max-w-[150px]">{user.name}</span>
					{user.id === currentUserId && (
						<span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
							Kamu
						</span>
					)}
				</div>
			),
		},
		{
			key: "email",
			header: "Email",
			cell: (user) => (
				<span className="text-xs text-content-muted font-mono truncate max-w-[180px] block">
					{user.email}
				</span>
			),
		},
		{
			key: "role",
			header: "Peran / Role",
			cell: (user) => (
				<span
					className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border capitalize whitespace-nowrap ${
						roleBadgeClass[user.role] || "bg-content/10 text-content"
					}`}
				>
					{roleLabels[user.role] || user.role}
				</span>
			),
		},
		{
			key: "created_at",
			header: "Tanggal Bergabung",
			cell: (user) => (
				<span className="text-xs text-content-muted whitespace-nowrap">
					{formatShortDate(user.created_at)}
				</span>
			),
		},
		{
			key: "actions",
			header: <span className="text-right block">Aksi</span>,
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
		<div className="flex justify-end gap-1.5 items-center">
			<button
				type="button"
				onClick={() => onEdit(user)}
				className="btn btn-xs btn-ghost border border-content/10 text-content hover:bg-content/5 cursor-pointer"
			>
				<Pencil className="h-3.5 w-3.5 mr-1" />
				Edit
			</button>
			<button
				type="button"
				onClick={() => onDelete(user)}
				disabled={user.id === currentUserId}
				className="btn btn-xs btn-ghost border border-danger/20 text-danger hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
			>
				<Trash2 className="h-3.5 w-3.5 mr-1" />
				Hapus
			</button>
		</div>
	);
}
