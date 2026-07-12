"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useModalStore } from "@/store/ModalStore";

interface ReportFormValues {
	reason: string;
}

interface ReportArtModalProps {
	artworkId: string;
	artworkTitle: string;
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (reason: string) => void;
}

export default function ReportArtModal({
	artworkId,
	artworkTitle,
	isOpen,
	onClose,
	onSubmit,
}: ReportArtModalProps) {
	const modalId = `report-art-form-modal-${artworkId}`;
	const { openModal, closeModal, isOpen: globalOpen, config } = useModalStore();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ReportFormValues>({
		defaultValues: { reason: "" },
	});

	useEffect(() => {
		if (!isOpen) return;
		reset({ reason: "" });
	}, [isOpen, reset]);

	const content = useMemo(
		() => (
			<div className="space-y-4">
				<div className="p-3 bg-danger/10 text-danger border border-danger/20 rounded-xl text-xs leading-relaxed">
					<p className="font-semibold text-center">
						Laporkan Karya yang Melanggar Aturan
					</p>
					<p className="mt-1 text-center">
						Tindakan ini akan mengirimkan laporan kepada Kurator TruBrush untuk
						ditinjau. Harap berikan alasan yang jelas dan terperinci mengapa
						karya ini melanggar aturan (misal: terindikasi buatan AI,
						plagiarism, NSFW, dll).
					</p>
				</div>

				<div>
					<label
						htmlFor="report-reason"
						className="mb-1.5 block text-sm font-semibold text-content"
					>
						Alasan Detail Laporan
					</label>
					<textarea
						id="report-reason"
						rows={4}
						placeholder="Jelaskan secara terperinci mengapa Anda melaporkan karya ini..."
						className="w-full resize-none rounded-lg border border-slate-200 bg-background px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-700"
						{...register("reason", {
							required: "Alasan laporan wajib diisi",
							minLength: {
								value: 15,
								message:
									"Minimal 15 karakter agar kurator dapat memproses laporan Anda",
							},
						})}
					/>
					{errors.reason && (
						<p className="mt-1 text-xs text-danger">{errors.reason.message}</p>
					)}
				</div>
			</div>
		),
		[errors.reason, register],
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
				variant: "danger",
				title: "Laporkan Karya",
				description: `Silakan isi alasan laporan untuk karya "${artworkTitle}".`,
				content,
				maxWidthClassName: "max-w-lg",
				formClassName: "space-y-4",
				confirmLabel: "Laporkan",
				cancelLabel: "Batal",
				onCancel: onClose,
				onSubmit: (event) => {
					handleSubmit((values) => {
						onSubmit(values.reason);
					})(event);
					return false; // Mencegah penutupan modal sebelum state diperbarui.
				},
			});
		}
	}, [
		artworkTitle,
		closeModal,
		config?.id,
		content,
		globalOpen,
		handleSubmit,
		isOpen,
		onClose,
		onSubmit,
		openModal,
		modalId,
	]);

	return null;
}
