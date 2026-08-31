"use client";

import { Briefcase, CreditCard, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/form/Input";
import Textarea from "@/components/ui/form/Textarea";
import { useCreateCommission } from "@/hooks/useCommissionQueries";
import { useMounted } from "@/hooks/useMounted";
import { useModalStore } from "@/store/ModalStore";
import { formatPrice } from "@/utils";

interface OrderCommissionModalProps {
	isOpen: boolean;
	onClose: () => void;
	artistId: string;
	artistName: string;
	artworkTitle?: string;
	basePrice: number | null;
}

interface CommissionForm {
	title: string;
	description: string;
	price: number;
}

export function OrderCommissionModal({
	isOpen,
	onClose,
	artistId,
	artistName,
	artworkTitle,
	basePrice,
}: OrderCommissionModalProps) {
	const router = useRouter();
	const mounted = useMounted();
	const createCommissionMutation = useCreateCommission();
	const { openModal } = useModalStore();

	const minimumPrice = basePrice ?? 250000;
	const defaultValues: CommissionForm = useMemo(
		() => ({
			title: artworkTitle
				? `Commission dari ${artworkTitle}`
				: `Commission untuk ${artistName}`,
			description: artworkTitle
				? `Request berdasarkan artwork "${artworkTitle}" milik ${artistName}.`
				: `Request commission untuk ${artistName}.`,
			price: minimumPrice,
		}),
		[artworkTitle, artistName, minimumPrice],
	);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CommissionForm>({
		defaultValues,
	});

	useEffect(() => {
		if (isOpen) {
			reset(defaultValues);
		}
	}, [isOpen, reset, defaultValues]);

	if (!isOpen || !mounted || typeof document === "undefined") return null;

	const onSubmit = (data: CommissionForm) => {
		createCommissionMutation.mutate(
			{
				artist_id: artistId,
				commission_title: data.title.trim(),
				description: data.description.trim(),
				price: data.price,
				deadline_days: 7,
			},
			{
				onSuccess: (resData) => {
					onClose();
					const newId = resData.id || resData.commission?.id;
					openModal({
						title: "Commission dibuat",
						description:
							"Order sudah masuk. Lanjutkan ke halaman progress untuk pembayaran uang muka dan pelacakan status.",
						type: "confirm",
						confirmLabel: "Lihat Progress",
						cancelLabel: "Tetap di sini",
						onConfirm: () =>
							router.push(newId ? `/commissions/${newId}` : "/commissions"),
					});
				},
			},
		);
	};

	return createPortal(
		<div className="fixed inset-0 z-9998 flex items-center justify-center p-4">
			<button
				type="button"
				className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm cursor-pointer"
				aria-label="Tutup form commission"
				onClick={onClose}
			/>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="relative z-10 w-full max-w-lg bg-surface rounded-2xl shadow-2xl border border-content/10 p-6 space-y-5"
			>
				<button
					type="button"
					onClick={onClose}
					aria-label="Tutup form commission"
					className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-content/5 transition-colors cursor-pointer"
				>
					<X size={16} className="text-content-muted" />
				</button>

				<div className="space-y-1 pr-8">
					<h2 className="text-lg font-bold text-content">Pesan Komisi</h2>
					<p className="text-sm text-content-muted">
						Review detail pesanan untuk {artistName} sebelum membuat commission.
					</p>
				</div>

				<div>
					<label
						htmlFor="commission-title"
						className="block text-sm font-semibold mb-1.5 text-content"
					>
						Judul
					</label>
					<Input
						id="commission-title"
						placeholder="Contoh: Ilustrasi karakter original"
						{...register("title", {
							required: "Judul wajib diisi",
							validate: (value) =>
								value.trim().length > 0 || "Judul wajib diisi",
						})}
					>
						<Briefcase className="h-5 w-5 text-gray-400" />
					</Input>
					{errors.title && (
						<p className="text-danger text-xs mt-1">{errors.title.message}</p>
					)}
				</div>

				<div>
					<label
						htmlFor="commission-description"
						className="block text-sm font-semibold mb-1.5 text-content"
					>
						Deskripsi
					</label>
					<Textarea
						id="commission-description"
						placeholder="Jelaskan brief, referensi, style, dan kebutuhan komisi."
						rows={4}
						{...register("description", {
							required: "Deskripsi wajib diisi",
							validate: (value) =>
								value.trim().length > 0 || "Deskripsi wajib diisi",
						})}
					/>
					{errors.description && (
						<p className="text-danger text-xs mt-1">
							{errors.description.message}
						</p>
					)}
				</div>

				<div>
					<label
						htmlFor="commission-price"
						className="block text-sm font-semibold mb-1.5 text-content"
					>
						Tawaran Harga (IDR)
					</label>
					<Input
						id="commission-price"
						type="number"
						placeholder="Nominal harga komisi"
						{...register("price", {
							valueAsNumber: true,
							required: "Harga wajib diisi",
							min: {
								value: minimumPrice,
								message: `Harga minimal ${formatPrice(minimumPrice)}`,
							},
						})}
					>
						<CreditCard className="h-5 w-5 text-gray-400" />
					</Input>
					<p className="text-xs text-content-muted mt-1">
						Base price artist:{" "}
						<span className="font-semibold text-primary">
							{formatPrice(minimumPrice)}
						</span>
					</p>
					{errors.price && (
						<p className="text-danger text-xs mt-1">{errors.price.message}</p>
					)}
				</div>

				<div className="flex gap-3 pt-2">
					<Button
						type="button"
						variant="secondary"
						onClick={onClose}
						className="flex-1 justify-center py-2.5"
						disabled={createCommissionMutation.isPending}
					>
						Batal
					</Button>
					<Button
						type="submit"
						variant="primary"
						disabled={createCommissionMutation.isPending}
						className="flex-1 justify-center py-2.5"
					>
						{createCommissionMutation.isPending
							? "Memproses..."
							: "Ajukan Order"}
					</Button>
				</div>
			</form>
		</div>,
		document.body,
	);
}
