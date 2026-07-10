"use client";

import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useModalStore } from "@/store/ModalStore";

interface RejectFormValues {
	reason: string;
}

interface RejectArtworkModalProps {
	artworkTitle: string;
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (reason: string) => void;
}

const presetReasons = [
	"Karya terindikasi hasil AI generatif — tekstur tidak konsisten dan tidak ada bukti proses manual yang memadai.",
	"Detail wajah dan tangan menunjukkan pola khas output AI; WIP proof tidak menunjukkan progres sketsa manual.",
	"Komposisi terlalu sempurna tanpa layer sketch; metadata visual tidak selaras dengan klaim artwork orisinal.",
];

export default function RejectArtworkModal({
	artworkTitle,
	isOpen,
	onClose,
	onSubmit,
}: RejectArtworkModalProps) {
	const modalId = "reject-artwork-form-modal";
	const { openModal, closeModal, isOpen: globalOpen, config } = useModalStore();
	const {
		register,
		handleSubmit,
		reset,
		setValue,
		control,
		formState: { errors },
	} = useForm<RejectFormValues>({
		defaultValues: { reason: "" },
	});

	const reason = useWatch({ control, name: "reason" });

	useEffect(() => {
		if (!isOpen) return;
		reset({ reason: "" });
	}, [isOpen, reset]);

	const content = useMemo(
		() => (
			<>
				<div>
					<span className="mb-2 block text-sm font-semibold text-content">
						Alasan cepat (AI detection)
					</span>
					<div className="space-y-2">
						{presetReasons.map((preset) => (
							<button
								key={preset}
								type="button"
								onClick={() =>
									setValue("reason", preset, { shouldValidate: true })
								}
								className={[
									"w-full rounded-lg border px-3 py-2 text-left text-xs leading-relaxed transition-colors",
									reason === preset
										? "border-danger bg-danger/5 text-danger"
										: "border-content/10 text-content-muted hover:border-content/20 hover:bg-content/5",
								].join(" ")}
							>
								{preset}
							</button>
						))}
					</div>
				</div>

				<div>
					<label
						htmlFor="reject-reason"
						className="mb-1.5 block text-sm font-semibold text-content"
					>
						Alasan penolakan
					</label>
					<textarea
						id="reject-reason"
						rows={4}
						placeholder="Jelaskan secara spesifik mengapa artwork ditolak, misalnya indikasi AI, WIP tidak valid, atau ketidaksesuaian kebijakan platform."
						className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#33658A] dark:border-gray-600 dark:bg-[#1D2D37] dark:focus:ring-[#86BBD8]"
						{...register("reason", {
							required: "Alasan penolakan wajib diisi",
							minLength: {
								value: 10,
								message:
									"Minimal 10 karakter agar artist memahami keputusan kurator",
							},
						})}
					/>
					{errors.reason && (
						<p className="mt-1 text-xs text-danger">{errors.reason.message}</p>
					)}
				</div>
			</>
		),
		[errors.reason, reason, register, setValue],
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
				title: "Tolak Artwork",
				description: `Berikan alasan jelas untuk penolakan "${artworkTitle}".`,
				content,
				maxWidthClassName: "max-w-lg",
				formClassName: "space-y-4",
				confirmLabel: "Tolak Artwork",
				cancelLabel: "Batal",
				onCancel: onClose,
				onSubmit: (event) => {
					handleSubmit((values) => onSubmit(values.reason))(event);
					return false;
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
	]);

	useEffect(() => {
		if (!isOpen || !globalOpen || config?.id !== modalId) {
			return;
		}
	}, [config?.id, globalOpen, isOpen]);

	return null;
}
