"use client";

import { ShieldCheck, User, Wallet } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";

import Input from "@/components/ui/form/Input";
import { useModalStore } from "@/store/ModalStore";
import type { Profile } from "@/types";

export interface EditProfileFormValues {
	name: string;
	bio: string;
	base_price_idr: number;
	is_open_for_commission: boolean;
}

interface EditProfileModalProps {
	userName: string;
	profile: Profile | undefined;
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (values: EditProfileFormValues) => void;
}

export default function EditProfileModal({
	userName,
	profile,
	isOpen,
	onClose,
	onSubmit,
}: EditProfileModalProps) {
	const modalId = "edit-profile-form-modal";
	const { openModal, closeModal, isOpen: globalOpen, config } = useModalStore();

	const onSubmitRef = useRef(onSubmit);
	const onCloseRef = useRef(onClose);

	useEffect(() => {
		onSubmitRef.current = onSubmit;
		onCloseRef.current = onClose;
	}, [onSubmit, onClose]);

	const defaultValues: EditProfileFormValues = {
		name: userName,
		bio: profile?.bio ?? "",
		base_price_idr: profile?.base_price_idr ?? 0,
		is_open_for_commission: profile?.is_open_for_commission ?? false,
	};

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<EditProfileFormValues>({ defaultValues });

	// Sinkronkan form setiap modal dibuka ulang — supaya nggak nampilin
	// data lama kalau profile berubah di antara buka-tutup modal.
	useEffect(() => {
		if (!isOpen) return;
		reset({
			name: userName,
			bio: profile?.bio ?? "",
			base_price_idr: profile?.base_price_idr ?? 0,
			is_open_for_commission: profile?.is_open_for_commission ?? false,
		});
	}, [isOpen, profile, userName, reset]);

	const content = useMemo(
		() => (
			<div className="space-y-4">
				<div>
					<label
						htmlFor="profile-name"
						className="mb-1.5 block text-sm font-semibold text-content"
					>
						Nama
					</label>
					<Input
						id="profile-name"
						placeholder="Nama lengkap"
						{...register("name", {
							required: "Nama wajib diisi",
							minLength: { value: 3, message: "Minimal 3 karakter" },
							validate: (value) =>
								value.trim().length > 0 || "Nama wajib diisi",
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
						htmlFor="profile-bio"
						className="mb-1.5 block text-sm font-semibold text-content"
					>
						Bio
					</label>
					<textarea
						id="profile-bio"
						rows={4}
						placeholder="Ceritakan gaya, medium, dan spesialisasi kamu sebagai artist."
						className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#33658A] dark:border-gray-600 dark:bg-[#1D2D37] dark:focus:ring-[#86BBD8]"
						{...register("bio", {
							maxLength: { value: 500, message: "Bio maksimal 500 karakter" },
						})}
					/>
					{errors.bio && (
						<p className="mt-1 text-xs text-danger">{errors.bio.message}</p>
					)}
				</div>

				<div>
					<label
						htmlFor="profile-price"
						className="mb-1.5 block text-sm font-semibold text-content"
					>
						Harga Mulai Dari
					</label>
					<Input
						id="profile-price"
						type="number"
						min={0}
						{...register("base_price_idr", {
							valueAsNumber: true,
							required: "Harga wajib diisi",
							min: { value: 0, message: "Harga tidak boleh negatif" },
							validate: (value) =>
								Number.isFinite(value) || "Harga harus berupa angka",
						})}
					>
						<Wallet className="h-5 w-5 text-gray-400" />
					</Input>
					{errors.base_price_idr && (
						<p className="mt-1 text-xs text-danger">
							{errors.base_price_idr.message}
						</p>
					)}
				</div>

				<label className="flex items-start gap-3 rounded-xl border border-content/10 bg-content/5 px-4 py-3 cursor-pointer">
					<input
						type="checkbox"
						className="mt-1 h-4 w-4 accent-primary"
						{...register("is_open_for_commission")}
					/>
					<span>
						<span className="flex items-center gap-2 text-sm font-semibold text-content">
							<ShieldCheck className="h-4 w-4 text-verified" />
							Buka untuk Komisi
						</span>
						<span className="mt-1 block text-xs text-content-muted">
							Jika aktif, client bisa memesan komisi langsung dari profil dan
							artwork kamu.
						</span>
					</span>
				</label>
			</div>
		),
		[errors.bio, errors.base_price_idr, register, errors.name],
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
				title: "Edit Profil Artist",
				description:
					"Perbarui bio, harga, dan status ketersediaan komisi kamu.",
				content,
				maxWidthClassName: "max-w-lg",
				formClassName: "space-y-4",
				confirmLabel: "Simpan Perubahan",
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
		closeModal,
		config?.id,
		content,
		globalOpen,
		handleSubmit,
		isOpen,
		openModal,
	]);

	return null;
}
