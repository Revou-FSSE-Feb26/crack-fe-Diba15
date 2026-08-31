import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useAllTags, useCreateArtwork } from "@/hooks/useArtworkQueries";
import { axiosClient } from "@/lib/axiosClient";
import { useModalStore } from "@/store/ModalStore";
import { useToastStore } from "@/store/ToastStore";
import { useUserStore } from "@/store/UserStore";
import type { UploadType } from "@/types";

export interface PostArtworkForm {
	title: string;
	description: string;
	uploadType: UploadType;
	tags: string;
	reviewByCurator: boolean;
}

export const splitTags = (value: string) =>
	value
		.split(",")
		.map((item) => item.trim())
		.filter(Boolean);

export function useArtworkUploadForm() {
	const router = useRouter();
	const { user, isAuthenticated } = useUserStore();
	const { openModal } = useModalStore();
	const { addToast } = useToastStore();
	const [tagInput, setTagInput] = useState("");
	const profile = user?.profile;

	const createMutation = useCreateArtwork();
	const { data: allTags = [] } = useAllTags();

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
	const tagSuggestions = allTags
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

	const handleArtworkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		if (files.length === 0) return;

		if (artworkFiles.length + files.length > 5) {
			addToast({
				message:
					"Maksimal karya seni yang dapat diunggah adalah 5 file gambar.",
				type: "error",
			});
			return;
		}

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

	const removeWipFile = () => {
		setWipFile(null);
	};

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
					? `Artwork "${artwork.title}" telah dikirim ke kurator untuk diperiksa sebelum ditampilkan ke feed publik.`
					: `Artwork "${artwork.title}" telah berhasil dipost dan langsung tayang di feed.`,
				type: "alert",
				onConfirm: () => router.push(`/detail/${artwork.id}`),
				onCancel: () => router.push(`/detail/${artwork.id}`),
			});
		} catch (error: unknown) {
			const err = error as { response?: { data?: { message?: string } } };
			const errorMsg =
				err.response?.data?.message || "Gagal mengunggah artwork.";
			addToast({ message: errorMsg, type: "error" });
		} finally {
			setIsUploading(false);
		}
	};

	return {
		register,
		handleSubmit,
		setValue,
		control,
		errors,
		artworkFiles,
		wipFile,
		isUploading,
		isSubmitting: createMutation.isPending || isUploading,
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
	};
}
