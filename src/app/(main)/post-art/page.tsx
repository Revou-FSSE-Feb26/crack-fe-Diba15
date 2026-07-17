"use client";

import {
	ArrowLeft,
	Film,
	ImageIcon,
	Loader2,
	Palette,
	ShieldCheck,
	Tags,
	Upload,
	X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/form/Input";
import { useCreateArtwork, usePopularTags } from "@/hooks/useArtworkQueries";
import { axiosClient } from "@/lib/axiosClient";
import { useModalStore } from "@/store/ModalStore";
import { useProfileStore } from "@/store/ProfileStore";
import { useToastStore } from "@/store/ToastStore";
import { useUserStore } from "@/store/UserStore";
import type { UploadType } from "@/types";

interface PostArtworkForm {
	title: string;
	description: string;
	uploadType: UploadType;
	tags: string;
	reviewByCurator: boolean;
}

const splitTags = (value: string) =>
	value
		.split(",")
		.map((item) => item.trim())
		.filter(Boolean);

export default function PostArtPage() {
	const router = useRouter();
	const { user, isAuthenticated } = useUserStore();
	const { openModal } = useModalStore();
	const { addToast } = useToastStore();
	const [tagInput, setTagInput] = useState("");
	const { profiles } = useProfileStore();
	const profile = profiles.find((item) => item.user_id === user?.id);

	// Menggunakan TanStack Query v5 untuk membuat karya & mengambil sugesti tag
	const createMutation = useCreateArtwork();
	const { data: popularTags = [] } = usePopularTags();

	// File Upload States
	const [artworkFiles, setArtworkFiles] = useState<File[]>([]);
	const [wipFile, setWipFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState(false);

	useEffect(() => {
		if (profile && profile.strike_count >= 5) {
			openModal({
				title: "Akun Ditangguhkan (Blocked)",
				description:
					"Akun Anda telah ditangguhkan karena melanggar aturan TruBrush (Strike Count mencapai 5/5). Anda tidak dapat mengunggah karya baru.",
				type: "alert",
				variant: "danger",
				onConfirm: () => router.push("/profile"),
				onCancel: () => router.push("/profile"),
			});
		}
	}, [profile, openModal, router]);

	const {
		register,
		handleSubmit,
		setValue,
		control,
		formState: { errors },
	} = useForm<PostArtworkForm>({
		defaultValues: {
			title: "",
			description: "",
			uploadType: "original",
			tags: "",
			reviewByCurator: true,
		},
	});

	const selectedTags = splitTags(useWatch({ control, name: "tags" }) ?? "");
	const normalizedSelectedTags = selectedTags.map((tag) => tag.toLowerCase());
	const tagQuery = tagInput.trim().toLowerCase();
	const tagSuggestions = popularTags
		.filter(
			(tag) => !normalizedSelectedTags.includes(tag.tag_name.toLowerCase()),
		)
		.filter((tag) => !tagQuery || tag.tag_name.toLowerCase().includes(tagQuery))
		.slice(0, 6);

	const updateTags = (nextTags: string[]) => {
		const uniqueTags = Array.from(
			new Set(nextTags.map((tag) => tag.trim()).filter(Boolean)),
		);
		setValue("tags", uniqueTags.join(", "), {
			shouldDirty: true,
			shouldValidate: true,
		});
	};

	const addTag = (tagName: string) => {
		const trimmed = tagName.trim();
		if (!trimmed) return;

		updateTags([...selectedTags, trimmed]);
		setTagInput("");
	};

	const removeTag = (tagName: string) => {
		updateTags(
			selectedTags.filter((tag) => tag.toLowerCase() !== tagName.toLowerCase()),
		);
	};

	// ─── File Handlers ─────────────────────────────────────────────────────────
	const handleArtworkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		if (files.length === 0) return;

		// Validasi jumlah file
		if (artworkFiles.length + files.length > 5) {
			addToast({
				message:
					"Maksimal karya seni yang dapat diunggah adalah 5 file gambar.",
				type: "error",
			});
			return;
		}

		// Validasi tipe & ukuran berkas
		const allowedMimes = [
			"image/jpeg",
			"image/png",
			"image/webp",
			"image/jpg",
			"image/gif",
		];
		const maxBytes = 10 * 1024 * 1024; // 10MB

		for (const file of files) {
			if (!allowedMimes.includes(file.type)) {
				addToast({
					message: `Format berkas "${file.name}" tidak valid. Hanya png, jpg, jpeg, webp, dan gif yang diperbolehkan.`,
					type: "error",
				});
				return;
			}
			if (file.size > maxBytes) {
				addToast({
					message: `Ukuran berkas "${file.name}" melebihi batas maksimal 10MB.`,
					type: "error",
				});
				return;
			}
		}

		setArtworkFiles((prev) => [...prev, ...files]);
	};

	const handleWipFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const allowedImages = [
			"image/jpeg",
			"image/png",
			"image/webp",
			"image/jpg",
			"image/gif",
		];
		const allowedVideos = ["video/mp4", "video/quicktime", "video/webm"];
		const maxImageBytes = 10 * 1024 * 1024; // 10MB
		const maxVideoBytes = 30 * 1024 * 1024; // 30MB

		const isImg = allowedImages.includes(file.type);
		const isVid = allowedVideos.includes(file.type);

		if (!isImg && !isVid) {
			addToast({
				message:
					"Format berkas WIP tidak valid. Hanya gambar (png, jpg, gif) dan video (mp4, webm, mov) yang diperbolehkan.",
				type: "error",
			});
			return;
		}

		if (isImg && file.size > maxImageBytes) {
			addToast({
				message: "Ukuran gambar WIP melebihi batas maksimal 10MB.",
				type: "error",
			});
			return;
		}

		if (isVid && file.size > maxVideoBytes) {
			addToast({
				message: "Ukuran video WIP melebihi batas maksimal 30MB.",
				type: "error",
			});
			return;
		}

		setWipFile(file);
	};

	const removeArtworkFile = (index: number) => {
		setArtworkFiles((prev) => prev.filter((_, i) => i !== index));
	};

	// ─── Submit Form ──────────────────────────────────────────────────────────
	const onSubmit = async (data: PostArtworkForm) => {
		if (!isAuthenticated || !user) {
			openModal({
				title: "Login diperlukan",
				description: "Silakan login sebagai artist untuk post artwork.",
				type: "confirm",
				confirmLabel: "Login",
				cancelLabel: "Batal",
				onConfirm: () => router.push("/login"),
			});
			return;
		}

		if (user.role !== "artist") {
			openModal({
				title: "Hanya artist yang bisa post art",
				description:
					"Gunakan akun artist untuk mengunggah artwork ke TruBrush.",
			});
			return;
		}

		if (artworkFiles.length === 0) {
			addToast({
				message: "Wajib memilih minimal satu file gambar karya seni.",
				type: "error",
			});
			return;
		}

		setIsUploading(true);

		try {
			// 1. Upload Artwork Files ke /api/upload/bulk
			const artworkFormData = new FormData();
			for (const file of artworkFiles) {
				artworkFormData.append("files", file);
			}

			const artworkUploadRes = await axiosClient.post(
				"/upload/bulk?folder=artworks",
				artworkFormData,
				{
					headers: { "Content-Type": "multipart/form-data" },
				},
			);
			const imageUrls = artworkUploadRes.data.urls;

			// 2. Upload WIP Proof jika ada
			let wipUrl = "";
			if (wipFile) {
				const wipFormData = new FormData();
				wipFormData.append("files", wipFile);

				const wipUploadRes = await axiosClient.post(
					"/upload/bulk?folder=wips",
					wipFormData,
					{
						headers: { "Content-Type": "multipart/form-data" },
					},
				);
				wipUrl = wipUploadRes.data.urls[0];
			}

			// 3. Post data ke real database menggunakan mutasi TanStack
			const shouldReview = data.reviewByCurator;
			const artwork = await createMutation.mutateAsync({
				artists_id: user.id,
				title: data.title.trim(),
				description: data.description.trim() || null,
				images_url: imageUrls,
				wip_proof_url: wipUrl || undefined,
				upload_type: data.uploadType,
				curation_status: shouldReview ? "pending" : "unapproved",
				is_visible_on_feed: !shouldReview,
				tag_names: splitTags(data.tags),
			});

			openModal({
				title: shouldReview
					? "Artwork dikirim ke kurator"
					: "Artwork berhasil dipost",
				description: shouldReview
					? "Karya tersimpan dengan status pending dan belum tampil di feed sampai lolos kurasi."
					: "Karya sudah tampil di feed karena kamu memilih tidak diperiksa kurator.",
				type: "confirm",
				confirmLabel: shouldReview ? "Lihat Profil" : "Lihat Artwork",
				cancelLabel: "Tetap di sini",
				onConfirm: () =>
					router.push(shouldReview ? "/profile" : `/detail/${artwork.id}`),
			});
		} catch (error) {
			console.error("Gagal mengunggah artwork:", error);
			addToast({
				message: "Gagal memproses pengunggahan karya seni.",
				type: "error",
			});
		} finally {
			setIsUploading(false);
		}
	};

	const isSubmitting = isUploading || createMutation.isPending;

	return (
		<main className="min-h-screen bg-background text-content pb-16">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
				<Link
					href="/"
					className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover"
				>
					<ArrowLeft className="w-4 h-4" />
					Kembali ke Feed
				</Link>

				<div className="mt-6">
					<div className="mb-6">
						<h1 className="font-heading text-2xl font-bold text-content">
							Post Art
						</h1>
						<p className="mt-1 text-sm text-content-muted">
							Unggah karya, bukti WIP, dan tentukan apakah karya perlu diperiksa
							kurator.
						</p>
					</div>

					<form
						onSubmit={handleSubmit(onSubmit)}
						className="bg-surface border border-content/10 rounded-2xl p-5 sm:p-6 space-y-5"
					>
						{/* Judul */}
						<div>
							<label
								htmlFor="title"
								className="block text-sm font-semibold mb-1.5 text-content"
							>
								Judul Artwork <span className="text-sm text-danger">*</span>
							</label>
							<Input
								id="title"
								className="bg-background"
								placeholder="Contoh: Neon Samurai"
								disabled={isSubmitting}
								{...register("title", {
									required: "Judul artwork wajib diisi",
									validate: (value) =>
										value.trim().length > 0 || "Judul artwork wajib diisi",
								})}
							>
								<Palette className="h-5 w-5 text-gray-400" />
							</Input>
							{errors.title && (
								<p className="text-danger text-xs mt-1">
									{errors.title.message}
								</p>
							)}
						</div>

						{/* Deskripsi */}
						<div>
							<label
								htmlFor="description"
								className="block text-sm font-semibold mb-1.5 text-content"
							>
								Deskripsi
							</label>
							<textarea
								id="description"
								disabled={isSubmitting}
								placeholder="Ceritakan konsep, medium, style, atau proses karya."
								className="min-h-28 w-full resize-none rounded-lg border border-content/10 bg-background px-3 py-2.5 text-sm text-content outline-none focus:border-primary"
								{...register("description")}
							/>
						</div>

						{/* Uploader Gambar Artwork (Bulk) */}
						<div>
							<div className="block text-sm font-semibold mb-1.5 text-content">
								Karya Seni (Maks 5 Gambar, @Maks 10MB){" "}
								<span className="text-sm text-danger">*</span>
							</div>

							<div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-3">
								{artworkFiles.map((file, index) => (
									<div
										// biome-ignore lint/suspicious/noArrayIndexKey: simple array render
										key={index}
										className="relative group aspect-square rounded-lg overflow-hidden border border-content/10 bg-content/5"
									>
										<Image
											src={URL.createObjectURL(file)}
											alt={`Preview ${index + 1}`}
											fill
											unoptimized
											className="object-cover"
										/>
										<button
											type="button"
											disabled={isSubmitting}
											onClick={() => removeArtworkFile(index)}
											className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-black/90 text-white rounded-full transition-colors"
										>
											<X className="w-3.5 h-3.5" />
										</button>
									</div>
								))}

								{artworkFiles.length < 5 && (
									<label className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-content/20 hover:border-primary cursor-pointer transition-colors bg-content/5 hover:bg-content/10">
										<Upload className="w-5 h-5 text-content-muted" />
										<span className="text-[10px] text-content-muted mt-1">
											Upload
										</span>
										<input
											type="file"
											multiple
											accept="image/*"
											className="hidden"
											disabled={isSubmitting}
											onChange={handleArtworkFileChange}
										/>
									</label>
								)}
							</div>
						</div>

						{/* Uploader WIP Proof */}
						<div>
							<div className="block text-sm font-semibold mb-1.5 text-content">
								Bukti WIP (Gambar/Video/GIF, Maks 30MB)
							</div>

							{wipFile ? (
								<div className="relative inline-flex items-center gap-3 p-3 rounded-lg border border-content/10 bg-content/5">
									{wipFile.type.startsWith("video/") ? (
										<Film className="w-8 h-8 text-primary shrink-0" />
									) : (
										<div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0 bg-content/5">
											<Image
												src={URL.createObjectURL(wipFile)}
												alt="Wip Preview"
												fill
												unoptimized
												className="object-cover"
											/>
										</div>
									)}
									<div className="min-w-0 flex-1">
										<p className="text-xs font-medium text-content truncate max-w-50">
											{wipFile.name}
										</p>
										<p className="text-[10px] text-content-muted">
											{Math.round((wipFile.size / 1024 / 1024) * 100) / 100} MB
										</p>
									</div>
									<button
										type="button"
										disabled={isSubmitting}
										onClick={() => setWipFile(null)}
										className="p-1 bg-black/70 hover:bg-black/90 text-white rounded-full transition-colors"
									>
										<X className="w-3.5 h-3.5" />
									</button>
								</div>
							) : (
								<label className="flex flex-col items-center justify-center py-6 rounded-lg border-2 border-dashed border-content/20 hover:border-primary cursor-pointer transition-colors bg-content/5 hover:bg-content/10">
									<Upload className="w-6 h-6 text-content-muted" />
									<span className="text-xs text-content-muted mt-1">
										Pilih gambar atau video WIP
									</span>
									<input
										type="file"
										accept="image/*,video/*"
										className="hidden"
										disabled={isSubmitting}
										onChange={handleWipFileChange}
									/>
								</label>
							)}
						</div>

						{/* Tipe Upload & Tags */}
						<div className="grid gap-4 sm:grid-cols-2">
							<div>
								<label
									htmlFor="uploadType"
									className="block text-sm font-semibold mb-1.5 text-content"
								>
									Tipe Upload <span className="text-sm text-danger">*</span>
								</label>
								<select
									id="uploadType"
									disabled={isSubmitting}
									className="w-full rounded-lg border border-content/10 bg-background px-3 py-2.5 text-sm text-content outline-none focus:border-primary"
									{...register("uploadType")}
								>
									<option value="original">Original</option>
									<option value="fanart">Fan Art</option>
									<option value="commission">Commission</option>
								</select>
							</div>

							<div>
								<label
									htmlFor="tag-picker"
									className="block text-sm font-semibold mb-1.5 text-content"
								>
									Tags
								</label>
								<input type="hidden" {...register("tags")} />
								<div className="rounded-lg border border-content/10 bg-background px-3 py-2.5 focus-within:border-primary">
									{selectedTags.length > 0 && (
										<div className="mb-2 flex flex-wrap gap-1.5">
											{selectedTags.map((tag) => (
												<span
													key={tag}
													className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
												>
													{tag}
													<button
														type="button"
														disabled={isSubmitting}
														onClick={() => removeTag(tag)}
														className="rounded-full p-0.5 hover:bg-primary/10"
														aria-label={`Hapus tag ${tag}`}
													>
														<X className="h-3 w-3" />
													</button>
												</span>
											))}
										</div>
									)}

									<div className="flex items-center gap-2">
										<Tags className="h-5 w-5 shrink-0 text-gray-400" />
										<input
											id="tag-picker"
											value={tagInput}
											disabled={isSubmitting}
											onChange={(event) => setTagInput(event.target.value)}
											onKeyDown={(event) => {
												if (event.key === "Enter" || event.key === ",") {
													event.preventDefault();
													addTag(tagInput);
												}

												if (
													event.key === "Backspace" &&
													!tagInput &&
													selectedTags.length > 0
												) {
													removeTag(selectedTags[selectedTags.length - 1]);
												}
											}}
											placeholder="Cari atau buat tag baru"
											className="min-w-0 flex-1 bg-transparent text-sm text-content outline-none placeholder:text-content-muted"
										/>
										{tagInput.trim() && (
											<button
												type="button"
												disabled={isSubmitting}
												onClick={() => addTag(tagInput)}
												className="text-xs font-semibold text-primary hover:text-primary-hover"
											>
												Tambah
											</button>
										)}
									</div>
								</div>

								{(tagSuggestions.length > 0 || tagInput.trim()) && (
									<div className="mt-2 flex flex-wrap gap-1.5">
										{tagSuggestions.map((tag) => (
											<button
												key={tag.id}
												type="button"
												disabled={isSubmitting}
												onClick={() => addTag(tag.tag_name)}
												className="rounded-full bg-content/5 px-2.5 py-1 text-xs font-medium text-content-muted transition-colors hover:bg-primary/10 hover:text-primary"
											>
												{tag.tag_name}
											</button>
										))}
										{tagInput.trim() &&
											!popularTags.some(
												(tag) =>
													tag.tag_name.toLowerCase() ===
													tagInput.trim().toLowerCase(),
											) &&
											!normalizedSelectedTags.includes(
												tagInput.trim().toLowerCase(),
											) && (
												<button
													type="button"
													disabled={isSubmitting}
													onClick={() => addTag(tagInput)}
													className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
												>
													Buat &quot;{tagInput.trim()}&quot;
												</button>
											)}
									</div>
								)}
							</div>
						</div>

						{/* Kurasi */}
						<label className="flex items-start gap-3 rounded-xl border border-content/10 bg-content/5 px-4 py-3 cursor-pointer">
							<input
								type="checkbox"
								className="mt-1 h-4 w-4 accent-primary"
								disabled={isSubmitting}
								{...register("reviewByCurator")}
							/>
							<span>
								<span className="flex items-center gap-2 text-sm font-semibold text-content">
									<ShieldCheck className="h-4 w-4 text-verified" />
									Periksa oleh curator
								</span>
								<span className="mt-1 block text-xs text-content-muted">
									Jika aktif, artwork masuk status pending dan belum tampil di
									feed sampai lolos kurasi.
								</span>
							</span>
						</label>

						{/* Buttons */}
						<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
							<Button
								type="button"
								variant="secondary"
								className="justify-center"
								disabled={isSubmitting}
								onClick={() => router.push("/")}
							>
								Batal
							</Button>
							<Button
								type="submit"
								className="flex items-center gap-1.5 justify-center"
								disabled={isSubmitting}
							>
								{isSubmitting ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin" />
										Mengunggah...
									</>
								) : (
									<>
										<ImageIcon className="h-4 w-4" />
										Post Artwork
									</>
								)}
							</Button>
						</div>
					</form>
				</div>
			</div>
		</main>
	);
}
