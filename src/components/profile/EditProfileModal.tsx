"use client";

import { Globe, ShieldCheck, User, Wallet } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";

import instagramIcon from "@/assets/instagram.svg";
import pixivIcon from "@/assets/pixiv.svg";
import xIcon from "@/assets/x.svg";
import Input from "@/components/ui/form/Input";
import Textarea from "@/components/ui/form/Textarea";
import { useFormModal } from "@/hooks/useFormModal";
import type { Profile } from "@/types";
import { isValidExternalUrl } from "@/utils";

export interface EditProfileFormValues {
	name: string;
	bio: string;
	base_price_idr: number;
	is_open_for_commission: boolean;
	instagram_url?: string;
	twitter_url?: string;
	pixiv_url?: string;
	website_url?: string;
}

interface EditProfileModalProps {
	userName: string;
	profile?: Profile | null;
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (values: EditProfileFormValues) => void;
	isArtist?: boolean;
}

export default function EditProfileModal({
	userName,
	profile,
	isOpen,
	onClose,
	onSubmit,
	isArtist = true,
}: EditProfileModalProps) {
	const modalId = "edit-profile-form-modal";
	const { openModal, onCloseRef } = useFormModal({
		modalId,
		isOpen,
		onClose,
	});

	const onSubmitRef = useRef(onSubmit);
	useEffect(() => {
		onSubmitRef.current = onSubmit;
	}, [onSubmit]);

	const defaultValues: EditProfileFormValues = {
		name: userName,
		bio: profile?.bio ?? "",
		base_price_idr: profile?.base_price_idr ?? 0,
		is_open_for_commission: profile?.is_open_for_commission ?? false,
		instagram_url: profile?.social_links?.instagram ?? "",
		twitter_url: profile?.social_links?.twitter ?? "",
		pixiv_url: profile?.social_links?.pixiv ?? "",
		website_url: profile?.social_links?.website ?? "",
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
			instagram_url: profile?.social_links?.instagram ?? "",
			twitter_url: profile?.social_links?.twitter ?? "",
			pixiv_url: profile?.social_links?.pixiv ?? "",
			website_url: profile?.social_links?.website ?? "",
		});
	}, [isOpen, profile, userName, reset]);

	const content = useMemo(
		() => (
			<div className="space-y-4">
				<div>
					<label htmlFor="profile-name" className="form-label">
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

				{isArtist && (
					<div>
						<label
							htmlFor="profile-bio"
							className="mb-1.5 block text-sm font-semibold text-content"
						>
							Bio
						</label>
						<Textarea
							id="profile-bio"
							rows={4}
							placeholder="Ceritakan gaya, medium, dan spesialisasi kamu sebagai artist."
							{...register("bio", {
								maxLength: { value: 500, message: "Bio maksimal 500 karakter" },
							})}
						/>
						{errors.bio && (
							<p className="mt-1 text-xs text-danger">{errors.bio.message}</p>
						)}
					</div>
				)}

				{isArtist && (
					<>
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
								className="checkbox checkbox-primary rounded-md mt-1 cursor-pointer"
								{...register("is_open_for_commission")}
							/>
							<span>
								<span className="flex items-center gap-2 text-sm font-semibold text-content">
									<ShieldCheck className="h-4 w-4 text-verified" />
									Buka untuk Komisi
								</span>
								<span className="mt-1 block text-xs text-content-muted">
									Jika aktif, client bisa memesan komisi langsung dari profil
									dan artwork kamu.
								</span>
							</span>
						</label>

						<div className="space-y-3 pt-2 border-t border-content/10">
							<span className="block text-sm font-semibold text-content">
								Link Media Sosial & Portofolio
							</span>

							<div>
								<Input
									id="profile-instagram"
									placeholder="https://instagram.com/username atau @username"
									{...register("instagram_url", {
										validate: (val) => {
											if (!val) return true;
											const trimmed = val.trim();
											if (trimmed.startsWith("http")) {
												return (
													isValidExternalUrl(trimmed) ||
													"URL Instagram tidak valid"
												);
											}
											return (
												/^@?[a-zA-Z0-9._]+$/.test(trimmed) ||
												"Format username Instagram tidak valid"
											);
										},
									})}
								>
									<Image
										src={instagramIcon}
										alt="Instagram"
										width={18}
										height={18}
										className="w-4.5 h-4.5 object-contain opacity-60 dark:invert"
									/>
								</Input>
								{errors.instagram_url && (
									<p className="mt-1 text-xs text-danger">
										{errors.instagram_url.message}
									</p>
								)}
							</div>

							<div>
								<Input
									id="profile-twitter"
									placeholder="https://x.com/username atau @username"
									{...register("twitter_url", {
										validate: (val) => {
											if (!val) return true;
											const trimmed = val.trim();
											if (trimmed.startsWith("http")) {
												return (
													isValidExternalUrl(trimmed) ||
													"URL Twitter/X tidak valid"
												);
											}
											return (
												/^@?[a-zA-Z0-9_]+$/.test(trimmed) ||
												"Format username Twitter/X tidak valid"
											);
										},
									})}
								>
									<Image
										src={xIcon}
										alt="Twitter / X"
										width={18}
										height={18}
										className="w-4.5 h-4.5 object-contain opacity-60 dark:invert"
									/>
								</Input>
								{errors.twitter_url && (
									<p className="mt-1 text-xs text-danger">
										{errors.twitter_url.message}
									</p>
								)}
							</div>

							<div>
								<Input
									id="profile-pixiv"
									placeholder="https://pixiv.net/users/id atau User ID Pixiv"
									{...register("pixiv_url", {
										validate: (val) => {
											if (!val) return true;
											const trimmed = val.trim();
											if (trimmed.startsWith("http")) {
												return (
													isValidExternalUrl(trimmed) || "URL Pixiv tidak valid"
												);
											}
											return (
												/^[a-zA-Z0-9._-]+$/.test(trimmed) ||
												"Format Pixiv ID tidak valid"
											);
										},
									})}
								>
									<Image
										src={pixivIcon}
										alt="Pixiv"
										width={18}
										height={18}
										className="w-4.5 h-4.5 object-contain opacity-60 dark:invert"
									/>
								</Input>
								{errors.pixiv_url && (
									<p className="mt-1 text-xs text-danger">
										{errors.pixiv_url.message}
									</p>
								)}
							</div>

							<div>
								<Input
									id="profile-website"
									placeholder="https://username.carrd.co (Website/Linktree)"
									{...register("website_url", {
										validate: (val) => {
											if (!val) return true;
											return (
												isValidExternalUrl(val.trim()) ||
												"Format URL website tidak valid (contoh: https://domain.com)"
											);
										},
									})}
								>
									<Globe className="h-5 w-5 text-gray-400" />
								</Input>
								{errors.website_url && (
									<p className="mt-1 text-xs text-danger">
										{errors.website_url.message}
									</p>
								)}
							</div>
						</div>
					</>
				)}
			</div>
		),
		[
			errors.bio,
			errors.base_price_idr,
			register,
			errors.name,
			errors.instagram_url,
			errors.twitter_url,
			errors.pixiv_url,
			errors.website_url,
			isArtist,
		],
	);

	useEffect(() => {
		if (isOpen) {
			openModal({
				id: modalId,
				type: "form",
				title: isArtist ? "Edit Profil Artist" : "Edit Profil Client",
				description: isArtist
					? "Perbarui bio, harga, dan status ketersediaan komisi kamu."
					: "Perbarui nama tampilan akun Anda.",
				content,
				maxWidthClassName: "max-w-xl",
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
	}, [content, handleSubmit, isArtist, isOpen, onCloseRef, openModal]);

	return null;
}
