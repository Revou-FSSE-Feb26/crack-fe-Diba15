"use client";

import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import Textarea from "@/components/ui/form/Textarea";
import { useFormModal } from "@/hooks/useFormModal";

interface DisputeFormValues {
	reason: string;
}

interface FileDisputeModalProps {
	commissionTitle: string;
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (reason: string) => void;
}

export default function FileDisputeModal({
	commissionTitle,
	isOpen,
	onClose,
	onSubmit,
}: FileDisputeModalProps) {
	const modalId = "file-dispute-form-modal";
	const { openModal, isCurrentModalOpen, onCloseRef } = useFormModal({
		modalId,
		isOpen,
		onClose,
	});

	const onSubmitRef = useRef(onSubmit);
	useEffect(() => {
		onSubmitRef.current = onSubmit;
	}, [onSubmit]);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<DisputeFormValues>({
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
					<p className="font-semibold">
						Perhatian Pengajuan Dispute (Sengketa):
					</p>
					<p className="mt-1">
						Sengketa diajukan jika hasil akhir commission tidak sesuai dengan
						deskripsi pesanan, melanggar kepercayaan, atau terindikasi dibuat
						menggunakan kecerdasan buatan (AI generatif). Alasan sengketa akan
						ditinjau oleh Kurator TruBrush dan keputusan bersifat final.
					</p>
				</div>

				<div>
					<label htmlFor="dispute-reason" className="form-label">
						Alasan Detail Dispute
					</label>
					<Textarea
						id="dispute-reason"
						rows={5}
						placeholder="Jelaskan secara terperinci mengapa Anda mengajukan dispute, bagian mana dari hasil yang tidak sesuai, dan sertakan bukti penunjang (misal: visual tidak sesuai sketch, indikasi AI, dll)."
						{...register("reason", {
							required: "Alasan dispute wajib diisi",
							minLength: {
								value: 20,
								message:
									"Minimal 20 karakter agar kurator dapat memahami duduk perkara sengketa",
							},
						})}
					/>
					{errors.reason && (
						<p className="form-error-msg">{errors.reason.message}</p>
					)}
					<p className="mt-1.5 text-[11px] text-content-muted">
						Saran: Jelaskan secara terperinci agar Kurator dapat memproses dan
						menyetujui ajuan Anda.
					</p>
				</div>
			</div>
		),
		[errors.reason, register],
	);

	useEffect(() => {
		if (isOpen && !isCurrentModalOpen) {
			openModal({
				id: modalId,
				type: "form",
				variant: "danger",
				title: "Ajukan Sengketa (Dispute)",
				description: `Silakan isi alasan dispute untuk komisi "${commissionTitle}".`,
				content,
				maxWidthClassName: "max-w-lg",
				formClassName: "space-y-4",
				confirmLabel: "Ajukan Dispute",
				cancelLabel: "Batal",
				onCancel: () => {
					onCloseRef.current();
				},
				onSubmit: (event) => {
					handleSubmit((values) => {
						onSubmitRef.current(values.reason);
					})(event);
					return false;
				},
			});
		}
	}, [
		commissionTitle,
		content,
		handleSubmit,
		isCurrentModalOpen,
		isOpen,
		onCloseRef,
		openModal,
	]);

	return null;
}
