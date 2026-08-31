"use client";

import { ArrowLeft, Loader2, Palette, Tags, X } from "lucide-react";
import Link from "next/link";
import ArtworkCuratorToggle from "@/components/post-art/ArtworkCuratorToggle";
import ArtworkMediaUploader from "@/components/post-art/ArtworkMediaUploader";
import ArtworkWipUploader from "@/components/post-art/ArtworkWipUploader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/form/Input";
import Select from "@/components/ui/form/Select";
import Textarea from "@/components/ui/form/Textarea";
import { useArtworkUploadForm } from "@/hooks/useArtworkUploadForm";

export default function PostArtPage() {
	const {
		register,
		handleSubmit,
		errors,
		artworkFiles,
		wipFile,
		isSubmitting,
		tagInput,
		setTagInput,
		selectedTags,
		tagSuggestions,
		addTag,
		removeTag,
		handleArtworkFileChange,
		handleWipFileChange,
		removeArtworkFile,
		removeWipFile,
		onSubmit,
	} = useArtworkUploadForm();

	return (
		<div className="min-h-screen bg-background pb-20 pt-8">
			<div className="container max-w-3xl mx-auto px-4">
				{/* Top Bar */}
				<div className="flex items-center justify-between mb-8">
					<Link
						href="/"
						className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
					>
						<ArrowLeft className="h-4 w-4" />
						Kembali ke Beranda
					</Link>
				</div>

				<div className="space-y-6">
					<div>
						<h1 className="font-heading text-2xl sm:text-3xl font-bold text-content">
							Unggah Karya Seni Baru
						</h1>
						<p className="text-sm text-content-muted mt-1">
							Bagikan karya ilustrasi orisinal Anda dan dapatkan apresiasi dari
							komunitas TruBrush.
						</p>
					</div>

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						{/* 1. Media Uploader */}
						<ArtworkMediaUploader
							artworkFiles={artworkFiles}
							onFileChange={handleArtworkFileChange}
							onRemoveFile={removeArtworkFile}
						/>

						{/* 2. Form Details */}
						<div className="bg-surface border border-content/10 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
							<h2 className="font-heading text-base font-bold text-content flex items-center gap-2">
								<Palette className="h-5 w-5 text-primary" />
								Informasi Karya
							</h2>

							{/* Title */}
							<div>
								<label htmlFor="title" className="form-label">
									Judul Artwork <span className="text-danger">*</span>
								</label>
								<Input
									id="title"
									placeholder="Contoh: Cyberpunk Katana Girl 2077"
									{...register("title", {
										required: "Judul artwork wajib diisi.",
									})}
								/>
								{errors.title && (
									<p className="form-error-msg">{errors.title.message}</p>
								)}
							</div>

							{/* Description */}
							<div>
								<label htmlFor="description" className="form-label">
									Deskripsi / Cerita Singkat
								</label>
								<Textarea
									id="description"
									rows={3}
									placeholder="Ceritakan latar belakang, tools yang digunakan, atau konsep di balik karya ini..."
									{...register("description")}
								/>
							</div>

							{/* Upload Type */}
							<div>
								<label htmlFor="uploadType" className="form-label">
									Kategori Karya
								</label>
								<Select id="uploadType" {...register("uploadType")}>
									<option value="original">Original Art (Karya Asli)</option>
									<option value="fanart">Fanart (Karakter Populer / IP)</option>
									<option value="commission">Hasil Komisi Klien</option>
								</Select>
							</div>

							{/* Tags */}
							<div className="space-y-2">
								<label htmlFor="tagsInput" className="form-label">
									Tag & Topik
								</label>
								<div className="flex gap-2">
									<div className="flex-1">
										<Input
											id="tagsInput"
											type="text"
											value={tagInput}
											onChange={(e) => setTagInput(e.target.value)}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													addTag(tagInput);
												}
											}}
											placeholder="Ketik tag lalu tekan Enter..."
										>
											<Tags className="h-4 w-4" />
										</Input>
									</div>
									<Button
										type="button"
										variant="secondary"
										onClick={() => addTag(tagInput)}
										disabled={!tagInput.trim()}
									>
										Tambah Tag
									</Button>
								</div>

								{/* Selected Tags */}
								{selectedTags.length > 0 && (
									<div className="flex flex-wrap gap-1.5 pt-1">
										{selectedTags.map((tag) => (
											<span
												key={tag}
												className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-content/5 text-content border border-content/10"
											>
												#{tag}
												<button
													type="button"
													onClick={() => removeTag(tag)}
													className="text-content-muted hover:text-content"
												>
													<X className="h-3 w-3" />
												</button>
											</span>
										))}
									</div>
								)}

								{/* Suggestions */}
								{tagSuggestions.length > 0 && (
									<div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-content-muted">
										<span>Saran:</span>
										{tagSuggestions.map((tag) => (
											<button
												key={tag.id}
												type="button"
												onClick={() => addTag(tag.tag_name)}
												className="px-2.5 py-1 rounded-lg bg-content/5 hover:bg-content/10 text-content-muted hover:text-content font-medium transition-colors"
											>
												+{tag.tag_name}
											</button>
										))}
									</div>
								)}
							</div>
						</div>

						{/* 3. WIP Proof Uploader */}
						<ArtworkWipUploader
							wipFile={wipFile}
							onFileChange={handleWipFileChange}
							onRemoveFile={removeWipFile}
						/>

						{/* 4. Curator Review Toggle */}
						<ArtworkCuratorToggle register={register} />

						{/* Submit Button */}
						<div className="flex items-center justify-end gap-3 pt-4">
							<Link href="/">
								<Button type="button" variant="secondary">
									Batal
								</Button>
							</Link>
							<Button
								type="submit"
								disabled={isSubmitting}
								className="min-w-37.5"
							>
								{isSubmitting ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin mr-2" />
										Mengunggah...
									</>
								) : (
									"Publikasikan Artwork"
								)}
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
