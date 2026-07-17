import axios from "axios";
import { NextResponse } from "next/server";
import { axiosServer } from "@/lib/axiosServer";

export async function POST(request: Request) {
	try {
		const formData = await request.formData();
		const { searchParams } = new URL(request.url);
		const folder = searchParams.get("folder") || "artworks";

		// Meneruskan formData langsung ke backend NestJS dengan folder param
		const res = await axiosServer.post(
			`/upload/bulk?folder=${folder}`,
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			},
		);

		return NextResponse.json(res.data);
	} catch (error: unknown) {
		// Mengecek apakah error ini berasal dari Axios
		if (axios.isAxiosError(error)) {
			console.error("BFF upload error:", error.response?.data || error.message);
			const status = error.response?.status || 500;
			const data = error.response?.data || { message: "Internal Server Error" };
			return NextResponse.json(data, { status });
		}

		// Menangani jika ada error non-Axios (misal: request.formData() gagal)
		const genericError = error as Error;
		console.error("Generic upload error:", genericError.message);
		return NextResponse.json(
			{ message: genericError.message || "Internal Server Error" },
			{ status: 500 },
		);
	}
}
