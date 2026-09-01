"use client";

import { useEffect, useMemo, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import Textarea from "@/components/ui/form/Textarea";
import { useFormModal } from "@/hooks/useFormModal";

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
					<label htmlFor="reject-reason" className="form-label">
						Alasan penolakan
					</label>
					<Textarea
						id="reject-reason"
						rows={4}
						placeholder="Jelaskan secara spesifik mengapa artwork ditolak, misalnya indikasi AI, WIP tidak valid, atau ketidaksesuaian kebijakan platform."
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
						<p className="form-error-msg">{errors.reason.message}</p>
					)}
				</div>
			</>
		),
		[errors.reason, reason, register, setValue],
	);

	useEffect(() => {
		if (isOpen && !isCurrentModalOpen) {
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
				onCancel: () => {
					onCloseRef.current();
				},
				onSubmit: (event) => {
					handleSubmit((values) => onSubmitRef.current(values.reason))(event);
					return false;
				},
			});
		}
	}, [
		artworkTitle,
		content,
		handleSubmit,
		isCurrentModalOpen,
		isOpen,
		onCloseRef,
		openModal,
	]);

	return null;
}
