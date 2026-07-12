"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import initialUsers from "@/data/users";
import type { User, UserManagementState } from "@/types";

const now = () => new Date().toISOString();
const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const useUserManagementStore = create<UserManagementState>()(
	persist(
		(set, get) => ({
			users: initialUsers,

			createUser: (payload) => {
				const email = normalizeEmail(payload.email);
				const exists = get().users.some(
					(user) => normalizeEmail(user.email) === email,
				);

				if (exists) {
					return { success: false, message: "Email sudah terdaftar." };
				}

				const timestamp = now();
				const user: User = {
					id: `u-${Date.now()}`,
					name: payload.name.trim(),
					email,
					password: payload.password,
					role: payload.role,
					balance: payload.balance ?? (payload.role === "client" ? 2000000 : 0),
					created_at: timestamp,
					updated_at: timestamp,
				};

				set((state) => ({ users: [user, ...state.users] }));
				return { success: true, message: "User berhasil ditambahkan." };
			},

			createCurator: (payload) =>
				get().createUser({ ...payload, role: "curator" }),

			updateUser: (id, payload) => {
				const users = get().users;
				const target = users.find((user) => user.id === id);

				if (!target) {
					return { success: false, message: "User tidak ditemukan." };
				}

				const nextEmail = payload.email
					? normalizeEmail(payload.email)
					: normalizeEmail(target.email);
				const emailTaken = users.some(
					(user) => user.id !== id && normalizeEmail(user.email) === nextEmail,
				);

				if (emailTaken) {
					return {
						success: false,
						message: "Email sudah digunakan user lain.",
					};
				}

				const updated: User = {
					...target,
					name: payload.name?.trim() ?? target.name,
					email: nextEmail,
					password: payload.password?.trim()
						? payload.password
						: target.password,
					role: payload.role ?? target.role,
					balance:
						typeof payload.balance === "number"
							? payload.balance
							: target.balance,
					updated_at: now(),
				};

				set((state) => ({
					users: state.users.map((user) => (user.id === id ? updated : user)),
				}));

				return { success: true, message: "Perubahan user berhasil disimpan." };
			},

			deleteUser: (id) => {
				const target = get().users.find((user) => user.id === id);

				if (!target) {
					return { success: false, message: "User tidak ditemukan." };
				}

				set((state) => ({
					users: state.users.filter((user) => user.id !== id),
				}));

				return { success: true, message: `${target.name} berhasil dihapus.` };
			},
		}),
		{
			name: "trubrush-users",
		},
	),
);
