"use client";

import { Tag as TagIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Tag } from "@/types";

interface TagFormModalProps {
	isOpen: boolean;
	tagToEdit: Tag | null;
	isLoading: boolean;
	onClose: () => void;
	onSubmit: (tagName: string) => void;
}

export default function TagFormModal({
	isOpen,
	tagToEdit,
	isLoading,
	onClose,
	onSubmit,
}: TagFormModalProps) {
	const [name, setName] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		if (isOpen) {
			setName(tagToEdit ? tagToEdit.tag_name : "");
			setError("");
		}
	}, [isOpen, tagToEdit]);

	if (!isOpen) return null;

	const normalized = name.trim().toLowerCase();

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		if (!normalized) {
			setError("Nama tag tidak boleh kosong.");
			return;
		}
		if (normalized.length < 2) {
			setError("Nama tag minimal 2 karakter.");
			return;
		}
		if (normalized.length > 30) {
			setError("Nama tag maksimal 30 karakter.");
			return;
		}
		onSubmit(normalized);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
			<div
				className="w-full max-w-md rounded-2xl border border-content/10 bg-surface p-6 shadow-2xl space-y-4"
				role="dialog"
				aria-modal="true"
			>
				{/* Modal Header */}
				<div className="flex items-center justify-between border-b border-content/10 pb-3">
					<div className="flex items-center gap-2">
						<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
							<TagIcon className="h-5 w-5" />
						</div>
						<div>
							<h3 className="text-base font-bold text-content">
								{tagToEdit ? "Ubah Nama Master Tag" : "Tambah Master Tag Baru"}
							</h3>
							<p className="text-xs text-content-muted">
								{tagToEdit
									? `Mengubah nama tag "${tagToEdit.tag_name}"`
									: "Tambahkan tag baru ke perbendaharaan katalog platform"}
							</p>
						</div>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="btn btn-ghost btn-xs btn-circle text-content-muted hover:text-content"
						title="Tutup"
					>
						<X className="h-4 w-4" />
					</button>
				</div>

				{/* Modal Body */}
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-1.5">
						<label
							htmlFor="tag-name-input"
							className="text-xs font-semibold text-content"
						>
							Nama Tag <span className="text-danger">*</span>
						</label>
						<input
							id="tag-name-input"
							type="text"
							value={name}
							onChange={(event) => {
								setName(event.target.value);
								setError("");
							}}
							placeholder="contoh: watercolor, fantasy, sci-fi"
							className="input input-sm w-full bg-background border-content/10 text-xs"
							disabled={isLoading}
						/>
						{normalized && (
							<p className="text-[11px] text-content-muted">
								Tersimpan sebagai:{" "}
								<span className="font-mono font-semibold text-primary">
									#{normalized}
								</span>
							</p>
						)}
						{error && <p className="text-xs text-danger">{error}</p>}
					</div>

					{/* Modal Footer */}
					<div className="flex items-center justify-end gap-2 pt-3 border-t border-content/10">
						<button
							type="button"
							onClick={onClose}
							disabled={isLoading}
							className="btn btn-ghost btn-sm text-xs"
						>
							Batal
						</button>
						<button
							type="submit"
							disabled={isLoading}
							className="btn btn-primary btn-sm text-xs"
						>
							{isLoading ? (
								<span className="loading loading-spinner loading-xs" />
							) : tagToEdit ? (
								"Simpan Perubahan"
							) : (
								"Tambah Tag"
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
