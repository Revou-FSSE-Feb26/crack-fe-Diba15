import axios from "axios";
import { NextResponse } from "next/server";

/**
 * Helper terpusat untuk menangani error di semua Route Handler yang memanggil axiosServer.
 * - Jika error berasal dari Axios (misal backend NestJS merespon 4xx/5xx),
 *   status dan body error diteruskan apa adanya ke client.
 * - Jika error bukan dari Axios (misal request.json()/formData() gagal),
 *   fallback ke 500 Internal Server Error.
 *
 * @param error - error yang ditangkap di blok catch
 * @param context - label untuk console.error, misal "GET /api/artwork"
 */
export function handleApiError(error: unknown, context: string) {
	if (axios.isAxiosError(error)) {
		console.error(`[${context}]`, error.response?.data || error.message);
		const status = error.response?.status || 500;
		const data = error.response?.data || { message: "Internal Server Error" };
		return NextResponse.json(data, { status });
	}

	const message =
		error instanceof Error ? error.message : "Internal Server Error";
	console.error(`[${context}]`, message);
	return NextResponse.json({ message }, { status: 500 });
}
