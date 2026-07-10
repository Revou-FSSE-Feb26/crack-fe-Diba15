"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { ArrowLeft, ImageIcon, LinkIcon, Palette, ShieldCheck, Tags, X } from "lucide-react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/form/Input";
import { useArtworkStore } from "@/store/ArtworkStore";
import { useModalStore } from "@/store/ModalStore";
import { useUserStore } from "@/store/UserStore";
import type { UploadType } from "@/types";

interface PostArtworkForm {
  title: string;
  description: string;
  images: string;
  wipProofUrl: string;
  uploadType: UploadType;
  tags: string;
  reviewByCurator: boolean;
}

const splitLines = (value: string) =>
  value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

const splitTags = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export default function PostArtPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useUserStore();
  const { createArtwork, tags: existingTags } = useArtworkStore();
  const { openModal } = useModalStore();
  const [tagInput, setTagInput] = useState("");

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
      images: "",
      wipProofUrl: "",
      uploadType: "original",
      tags: "",
      reviewByCurator: true,
    },
  });

  const selectedTags = splitTags(useWatch({ control, name: "tags" }) ?? "");
  const normalizedSelectedTags = selectedTags.map((tag) => tag.toLowerCase());
  const tagQuery = tagInput.trim().toLowerCase();
  const tagSuggestions = existingTags
    .filter((tag) => !normalizedSelectedTags.includes(tag.tag_name.toLowerCase()))
    .filter((tag) => !tagQuery || tag.tag_name.toLowerCase().includes(tagQuery))
    .slice(0, 6);

  const updateTags = (nextTags: string[]) => {
    const uniqueTags = Array.from(
      new Set(nextTags.map((tag) => tag.trim()).filter(Boolean)),
    );
    setValue("tags", uniqueTags.join(", "), { shouldDirty: true, shouldValidate: true });
  };

  const addTag = (tagName: string) => {
    const trimmed = tagName.trim();
    if (!trimmed) return;

    updateTags([...selectedTags, trimmed]);
    setTagInput("");
  };

  const removeTag = (tagName: string) => {
    updateTags(selectedTags.filter((tag) => tag.toLowerCase() !== tagName.toLowerCase()));
  };

  const onSubmit = (data: PostArtworkForm) => {
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
        description: "Gunakan akun artist untuk mengunggah artwork ke TruBrush.",
      });
      return;
    }

    const images = splitLines(data.images);
    const shouldReview = data.reviewByCurator;
    const artwork = createArtwork({
      artists_id: user.id,
      title: data.title.trim(),
      description: data.description.trim() || null,
      images_url: images,
      wip_proof_url: data.wipProofUrl.trim() || undefined,
      upload_type: data.uploadType,
      curation_status: shouldReview ? "pending" : "unapproved",
      is_visible_on_feed: !shouldReview,
      tag_names: splitTags(data.tags),
    });

    openModal({
      title: shouldReview ? "Artwork dikirim ke kurator" : "Artwork berhasil dipost",
      description: shouldReview
        ? "Karya tersimpan dengan status pending dan belum tampil di feed sampai lolos kurasi."
        : "Karya sudah tampil di feed karena kamu memilih tidak diperiksa kurator.",
      type: "confirm",
      confirmLabel: shouldReview ? "Lihat Profil" : "Lihat Artwork",
      cancelLabel: "Tetap di sini",
      onConfirm: () => router.push(shouldReview ? "/profile" : `/detail/${artwork.id}`),
    });
  };

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
            <h1 className="font-heading text-2xl font-bold text-content">Post Art</h1>
            <p className="mt-1 text-sm text-content-muted">
              Unggah karya, bukti WIP, dan tentukan apakah karya perlu diperiksa kurator.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-surface border border-content/10 rounded-2xl p-5 sm:p-6 space-y-5"
          >
            <div>
              <label htmlFor="title" className="block text-sm font-semibold mb-1.5 text-content">
                Judul Artwork <span className="text-sm text-danger">*</span>
              </label>
              <Input
                id="title"
                className="bg-background"
                placeholder="Contoh: Neon Samurai"
                {...register("title", {
                  required: "Judul artwork wajib diisi",
                  validate: (value) => value.trim().length > 0 || "Judul artwork wajib diisi",
                })}
              >
                <Palette className="h-5 w-5 text-gray-400" />
              </Input>
              {errors.title && (
                <p className="text-danger text-xs mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold mb-1.5 text-content">
                Deskripsi
              </label>
              <textarea
                id="description"
                placeholder="Ceritakan konsep, medium, style, atau proses karya."
                className="min-h-28 w-full resize-none rounded-lg border border-content/10 bg-background px-3 py-2.5 text-sm text-content outline-none focus:border-primary"
                {...register("description")}
              />
            </div>

            <div>
              <label htmlFor="images" className="block text-sm font-semibold mb-1.5 text-content">
                URL Gambar <span className="text-sm text-danger">*</span>
              </label>
              <textarea
                id="images"
                placeholder={"Masukkan satu URL gambar per baris\nhttps://picsum.photos/seed/karya-baru/900/650"}
                className="min-h-24 w-full resize-none rounded-lg border border-content/10 bg-background px-3 py-2.5 text-sm text-content outline-none focus:border-primary"
                {...register("images", {
                  required: "Minimal satu URL gambar wajib diisi",
                  validate: (value) => splitLines(value).length > 0 || "Minimal satu URL gambar wajib diisi",
                })}
              />
              {errors.images && (
                <p className="text-danger text-xs mt-1">{errors.images.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="wipProofUrl" className="block text-sm font-semibold mb-1.5 text-content">
                URL WIP Proof
              </label>
              <Input
                id="wipProofUrl"
                placeholder="https://picsum.photos/seed/wip-proof/900/650"
                {...register("wipProofUrl")}
              >
                <LinkIcon className="h-5 w-5 text-gray-400" />
              </Input>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="uploadType" className="block text-sm font-semibold mb-1.5 text-content">
                  Tipe Upload <span className="text-sm text-danger">*</span>
                </label>
                <select
                  id="uploadType"
                  className="w-full rounded-lg border border-content/10 bg-background px-3 py-2.5 text-sm text-content outline-none focus:border-primary"
                  {...register("uploadType")}
                >
                  <option value="original">Original</option>
                  <option value="fanart">Fan Art</option>
                  <option value="commission">Commission</option>
                </select>
              </div>

              <div>
                <label htmlFor="tag-picker" className="block text-sm font-semibold mb-1.5 text-content">
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
                      onChange={(event) => setTagInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === ",") {
                          event.preventDefault();
                          addTag(tagInput);
                        }

                        if (event.key === "Backspace" && !tagInput && selectedTags.length > 0) {
                          removeTag(selectedTags[selectedTags.length - 1]);
                        }
                      }}
                      placeholder="Cari atau buat tag baru"
                      className="min-w-0 flex-1 bg-transparent text-sm text-content outline-none placeholder:text-content-muted"
                    />
                    {tagInput.trim() && (
                      <button
                        type="button"
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
                        onClick={() => addTag(tag.tag_name)}
                        className="rounded-full bg-content/5 px-2.5 py-1 text-xs font-medium text-content-muted transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        {tag.tag_name}
                      </button>
                    ))}
                    {tagInput.trim() &&
                      !existingTags.some(
                        (tag) => tag.tag_name.toLowerCase() === tagInput.trim().toLowerCase(),
                      ) &&
                      !normalizedSelectedTags.includes(tagInput.trim().toLowerCase()) && (
                        <button
                          type="button"
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

            <label className="flex items-start gap-3 rounded-xl border border-content/10 bg-content/5 px-4 py-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-primary"
                {...register("reviewByCurator")}
              />
              <span>
                <span className="flex items-center gap-2 text-sm font-semibold text-content">
                  <ShieldCheck className="h-4 w-4 text-verified" />
                  Periksa oleh curator
                </span>
                <span className="mt-1 block text-xs text-content-muted">
                  Jika aktif, artwork masuk status pending dan belum tampil di feed sampai lolos kurasi.
                </span>
              </span>
            </label>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                className="justify-center"
                onClick={() => router.push("/")}
              >
                Batal
              </Button>
              <Button type="submit" className="flex items-center gap-1 justify-center">
                <ImageIcon className="h-4 w-4" />
                Post Artwork
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
