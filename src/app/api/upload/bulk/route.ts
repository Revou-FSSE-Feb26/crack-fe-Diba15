import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/apiError";
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
	} catch (error) {
		return handleApiError(error, "POST /api/upload/bulk");
	}
}
