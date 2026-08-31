export const ALLOWED_IMAGE_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/jpg",
	"image/gif",
];

export const ALLOWED_VIDEO_TYPES = [
	"video/mp4",
	"video/quicktime",
	"video/webm",
];

export const MAX_ARTWORK_FILES = 10;
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB
export const MAX_VIDEO_BYTES = 30 * 1024 * 1024; // 30MB

export interface ValidationResult {
	valid: boolean;
	error?: string;
}

/**
 * Validates selected artwork image files for format, size, and total count.
 */
export function validateArtworkFiles(
	incomingFiles: File[],
	currentFilesCount = 0,
): ValidationResult {
	if (currentFilesCount + incomingFiles.length > MAX_ARTWORK_FILES) {
		return {
			valid: false,
			error: `Maksimal hanya dapat mengunggah ${MAX_ARTWORK_FILES} gambar karya.`,
		};
	}

	for (const file of incomingFiles) {
		if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
			return {
				valid: false,
				error: `Format berkas "${file.name}" tidak didukung. Harap unggah gambar berekstensi JPG, PNG, WEBP, atau GIF.`,
			};
		}
		if (file.size > MAX_IMAGE_BYTES) {
			return {
				valid: false,
				error: `Ukuran berkas "${file.name}" melebihi batas maksimal 10MB.`,
			};
		}
	}

	return { valid: true };
}

/**
 * Validates a WIP proof deliverable file (supports image or video).
 */
export function validateWipFile(file: File): ValidationResult {
	const isImg = ALLOWED_IMAGE_TYPES.includes(file.type);
	const isVid = ALLOWED_VIDEO_TYPES.includes(file.type);

	if (!isImg && !isVid) {
		return {
			valid: false,
			error:
				"Format berkas WIP tidak valid. Hanya gambar (png, jpg, webp, gif) dan video (mp4, webm, mov) yang diperbolehkan.",
		};
	}

	if (isImg && file.size > MAX_IMAGE_BYTES) {
		return {
			valid: false,
			error: "Ukuran gambar WIP melebihi batas maksimal 10MB.",
		};
	}

	if (isVid && file.size > MAX_VIDEO_BYTES) {
		return {
			valid: false,
			error: "Ukuran video WIP melebihi batas maksimal 30MB.",
		};
	}

	return { valid: true };
}
