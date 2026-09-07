"use client";

import { KeyRound, Lock, Mail, User } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import Input from "@/components/ui/form/Input";
import Select from "@/components/ui/form/Select";
import { useFormModal } from "@/hooks/useFormModal";
import type { User as AppUser, UserRole } from "@/types";

type FormMode = "create" | "edit";

interface UserFormValues {
	name: string;
	email: string;
	password?: string;
	confirmPassword?: string;
	role: UserRole;
}

interface UserFormModalProps {
	mode: FormMode;
	user?: AppUser;
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (values: UserFormValues) => void;
}

const roleOptions: { value: UserRole; label: string }[] = [
	{ value: "artist", label: "Artist" },
	{ value: "client", label: "Client" },
	{ value: "curator", label: "Curator" },
	{ value: "admin", label: "Admin" },
];

const MODAL_ID = "manage-user-form-modal";

export default function UserFormModal({
	mode,
	user,
	isOpen,
	onClose,
	onSubmit,
}: UserFormModalProps) {
	const { openModal, onCloseRef } = useFormModal({
		modalId: MODAL_ID,
		isOpen,
		onClose,
	});

	const [showPasswordFields, setShowPasswordFields] = useState(false);

	const onSubmitRef = useRef(onSubmit);
	useEffect(() => {
		onSubmitRef.current = onSubmit;
	}, [onSubmit]);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<UserFormValues>({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
			role: "curator",
		},
	});

	useEffect(() => {
		if (!isOpen) {
			setShowPasswordFields(false);
			return;
		}

		setShowPasswordFields(false);
		reset({
			name: user?.name ?? "",
			email: user?.email ?? "",
			password: "",
			confirmPassword: "",
			role: user?.role ?? "curator",
		});
	}, [isOpen, user, reset]);

	const isCreate = mode === "create";
	const title = isCreate ? "Tambah Curator" : "Edit User";
	const description = isCreate
		? "Admin hanya dapat menambahkan akun dengan role curator."
		: "Perbarui data user yang sudah terdaftar di platform.";
	const confirmLabel = isCreate ? "Tambah Curator" : "Simpan Perubahan";

	const content = useMemo(
		() => (
			<>
				<div>
					<label
						htmlFor="user-name"
						className="mb-1.5 block text-sm font-semibold text-content"
					>
						Nama
					</label>
					<Input
						id="user-name"
						placeholder="Nama lengkap"
						{...register("name", {
							required: "Nama wajib diisi",
							minLength: { value: 3, message: "Minimal 3 karakter" },
						})}
					>
						<User className="h-5 w-5 text-gray-400" />
					</Input>
					{errors.name && (
						<p className="mt-1 text-xs text-danger">{errors.name.message}</p>
					)}
				</div>

				<div>
					<label
						htmlFor="user-email"
						className="mb-1.5 flex items-center justify-between text-sm font-semibold text-content"
					>
						<span>Email</span>
						{!isCreate && (
							<span className="text-[11px] font-normal text-content-muted">
								(Tidak dapat diubah)
							</span>
						)}
					</label>
					<Input
						id="user-email"
						type="email"
						placeholder="nama@email.com"
						disabled={!isCreate}
						readOnly={!isCreate}
						className={
							!isCreate ? "opacity-60 cursor-not-allowed bg-content/5" : ""
						}
						{...register("email", {
							required: isCreate ? "Email wajib diisi" : false,
							pattern: {
								value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
								message: "Format email tidak valid",
							},
						})}
					>
						<Mail className="form-input-icon" />
					</Input>
					{errors.email && (
						<p className="mt-1 text-xs text-danger">{errors.email.message}</p>
					)}
				</div>

				{isCreate ? (
					<div>
						<span className="mb-1.5 block text-sm font-semibold text-content">
							Role
						</span>
						<div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
							<p className="text-sm font-medium text-primary">Curator</p>
							<p className="mt-0.5 text-xs text-content-muted">
								Role tetap curator untuk penambahan user oleh admin.
							</p>
						</div>
					</div>
				) : (
					<div>
						<Select
							id="user-role"
							label="Role"
							{...register("role", {
								required: "Role wajib dipilih",
							})}
						>
							{roleOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</Select>
						{errors.role && (
							<p className="mt-1 text-xs text-danger">{errors.role.message}</p>
						)}
					</div>
				)}

				{isCreate ? (
					<>
						<div>
							<label
								htmlFor="user-password"
								className="mb-1.5 block text-sm font-semibold text-content"
							>
								Password
							</label>
							<Input
								id="user-password"
								type="password"
								autoComplete="new-password"
								placeholder="Minimal 8 karakter"
								{...register("password", {
									required: "Password wajib diisi",
									minLength: {
										value: 8,
										message: "Minimal 8 karakter",
									},
								})}
							>
								<Lock className="h-5 w-5 text-gray-400" />
							</Input>
							{errors.password && (
								<p className="mt-1 text-xs text-danger">
									{errors.password.message}
								</p>
							)}
						</div>

						<div>
							<label
								htmlFor="user-confirm-password"
								className="mb-1.5 block text-sm font-semibold text-content"
							>
								Konfirmasi Password
							</label>
							<Input
								id="user-confirm-password"
								type="password"
								autoComplete="new-password"
								placeholder="Ulangi password"
								{...register("confirmPassword", {
									required: "Konfirmasi password wajib diisi",
									validate: (value, formValues) =>
										value === formValues.password || "Password tidak sama",
								})}
							>
								<Lock className="h-5 w-5 text-gray-400" />
							</Input>
							{errors.confirmPassword && (
								<p className="mt-1 text-xs text-danger">
									{errors.confirmPassword.message}
								</p>
							)}
						</div>
					</>
				) : (
					<div className="space-y-4 pt-1">
						<div className="flex items-center justify-between rounded-lg border border-content/10 bg-content/5 px-3.5 py-2.5">
							<div className="flex items-center gap-2">
								<KeyRound className="h-4 w-4 text-primary" />
								<span className="text-xs font-medium text-content">
									Ubah Password Pengguna
								</span>
							</div>
							<button
								type="button"
								onClick={() => {
									const next = !showPasswordFields;
									setShowPasswordFields(next);
									if (!next) {
										reset({
											name: user?.name ?? "",
											email: user?.email ?? "",
											password: "",
											confirmPassword: "",
											role: user?.role ?? "curator",
										});
									}
								}}
								className="btn btn-xs btn-outline btn-primary cursor-pointer text-[11px]"
							>
								{showPasswordFields ? "Batal" : "Ubah Password"}
							</button>
						</div>

						{showPasswordFields && (
							<div className="space-y-4 rounded-lg border border-primary/20 bg-primary/5 p-3.5 animate-fade-in">
								<div>
									<label
										htmlFor="user-password"
										className="mb-1.5 block text-xs font-semibold text-content"
									>
										Password Baru
									</label>
									<Input
										id="user-password"
										type="password"
										autoComplete="new-password"
										placeholder="Minimal 8 karakter"
										{...register("password", {
											required: "Password baru wajib diisi",
											minLength: {
												value: 8,
												message: "Minimal 8 karakter",
											},
										})}
									>
										<Lock className="h-5 w-5 text-gray-400" />
									</Input>
									{errors.password && (
										<p className="mt-1 text-xs text-danger">
											{errors.password.message}
										</p>
									)}
								</div>

								<div>
									<label
										htmlFor="user-confirm-password"
										className="mb-1.5 block text-xs font-semibold text-content"
									>
										Konfirmasi Password Baru
									</label>
									<Input
										id="user-confirm-password"
										type="password"
										autoComplete="new-password"
										placeholder="Ulangi password baru"
										{...register("confirmPassword", {
											required: "Konfirmasi password baru wajib diisi",
											validate: (value, formValues) =>
												value === formValues.password || "Password tidak sama",
										})}
									>
										<Lock className="h-5 w-5 text-gray-400" />
									</Input>
									{errors.confirmPassword && (
										<p className="mt-1 text-xs text-danger">
											{errors.confirmPassword.message}
										</p>
									)}
								</div>
							</div>
						)}
					</div>
				)}
			</>
		),
		[errors, isCreate, register, reset, showPasswordFields, user],
	);

	useEffect(() => {
		if (isOpen) {
			openModal({
				id: MODAL_ID,
				type: "form",
				title,
				description,
				content,
				maxWidthClassName: "max-w-lg",
				formClassName: "mt-5 space-y-4",
				confirmLabel,
				cancelLabel: "Batal",
				onCancel: () => {
					onCloseRef.current();
				},
				onSubmit: (event) => {
					handleSubmit((values) => onSubmitRef.current(values))(event);
					return false;
				},
			});
		}
	}, [
		confirmLabel,
		content,
		description,
		handleSubmit,
		isOpen,
		onCloseRef,
		openModal,
		title,
	]);

	return null;
}
