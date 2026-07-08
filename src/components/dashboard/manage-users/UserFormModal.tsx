"use client";

import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Lock, Mail, User } from "lucide-react";

import Input from "@/components/ui/form/Input";
import { useModalStore } from "@/store/ModalStore";
import type { User as AppUser, UserRole } from "@/types";

type FormMode = "create" | "edit";

interface UserFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
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

export default function UserFormModal({
  mode,
  user,
  isOpen,
  onClose,
  onSubmit,
}: UserFormModalProps) {
  const modalId = "manage-user-form-modal";
  const { openModal, closeModal, isOpen: globalOpen, config } = useModalStore();
  const {
    register,
    handleSubmit,
    reset,
    control,
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

  const password = useWatch({ control, name: "password" });

  useEffect(() => {
    if (!isOpen) return;

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
          <label htmlFor="user-name" className="mb-1.5 block text-sm font-semibold text-content">
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
          <label htmlFor="user-email" className="mb-1.5 block text-sm font-semibold text-content">
            Email
          </label>
          <Input
            id="user-email"
            type="email"
            placeholder="nama@email.com"
            {...register("email", {
              required: "Email wajib diisi",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Format email tidak valid",
              },
            })}
          >
            <Mail className="h-5 w-5 text-gray-400" />
          </Input>
          {errors.email && (
            <p className="mt-1 text-xs text-danger">{errors.email.message}</p>
          )}
        </div>

        {isCreate ? (
          <div>
            <span className="mb-1.5 block text-sm font-semibold text-content">Role</span>
            <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
              <p className="text-sm font-medium text-primary">Curator</p>
              <p className="mt-0.5 text-xs text-content-muted">
                Role tetap curator untuk penambahan user oleh admin.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor="user-role" className="mb-1.5 block text-sm font-semibold text-content">
              Role
            </label>
            <select
              id="user-role"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#33658A] dark:border-gray-600 dark:bg-[#1D2D37] dark:focus:ring-[#86BBD8]"
              {...register("role", { required: "Role wajib dipilih" })}
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="mt-1 text-xs text-danger">{errors.role.message}</p>
            )}
          </div>
        )}

        <div>
          <label htmlFor="user-password" className="mb-1.5 block text-sm font-semibold text-content">
            {isCreate ? "Password" : "Password Baru (opsional)"}
          </label>
          <Input
            id="user-password"
            type="password"
            placeholder={isCreate ? "Minimal 8 karakter" : "Kosongkan jika tidak diubah"}
            {...register("password", isCreate
              ? {
                required: "Password wajib diisi",
                minLength: { value: 8, message: "Minimal 8 karakter" },
              }
              : {
                minLength: { value: 8, message: "Minimal 8 karakter" },
              })}
          >
            <Lock className="h-5 w-5 text-gray-400" />
          </Input>
          {errors.password && (
            <p className="mt-1 text-xs text-danger">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="user-confirm-password"
            className="mb-1.5 block text-sm font-semibold text-content"
          >
            {isCreate ? "Konfirmasi Password" : "Konfirmasi Password Baru"}
          </label>
          <Input
            id="user-confirm-password"
            type="password"
            placeholder="Ulangi password"
            {...register("confirmPassword", isCreate
              ? {
                required: "Konfirmasi password wajib diisi",
                validate: (value) => value === password || "Password tidak sama",
              }
              : {
                validate: (value) =>
                  !password || value === password || "Password tidak sama",
              })}
          >
            <Lock className="h-5 w-5 text-gray-400" />
          </Input>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-danger">{errors.confirmPassword.message}</p>
          )}
        </div>
      </>
    ),
    [errors, isCreate, password, register],
  );

  useEffect(() => {
    if (!isOpen) {
      if (globalOpen && config?.id === modalId) {
        closeModal();
      }
      return;
    }
    if (!globalOpen || config?.id !== modalId) {
      openModal({
        id: modalId,
        type: "form",
        title,
        description,
        content,
        maxWidthClassName: "max-w-lg",
        formClassName: "mt-5 space-y-4",
        confirmLabel,
        cancelLabel: "Batal",
        onCancel: onClose,
        onSubmit: (event) => {
          handleSubmit((values) => onSubmit(values))(event);
          // Biarkan parent yang mengontrol kapan modal ditutup.
          return false;
        },
      });
    }
  }, [
    closeModal,
    config?.id,
    confirmLabel,
    content,
    description,
    globalOpen,
    handleSubmit,
    isOpen,
    onClose,
    onSubmit,
    openModal,
    title,
  ]);

  useEffect(() => {
    if (!isOpen || !globalOpen || config?.id !== modalId) {
      return;
    }
  }, [
    config?.id,
    confirmLabel,
    content,
    description,
    globalOpen,
    handleSubmit,
    isOpen,
    onClose,
    onSubmit,
    title,
  ]);

  return null;
}
