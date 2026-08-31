import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/apiError";
import { axiosServer } from "@/lib/axiosServer";

export async function POST(request: Request) {
	try {
		const formData = await request.formData();

		// Meneruskan formData langsung ke backend NestJS
		const res = await axiosServer.post("/upload", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		return NextResponse.json(res.data);
	} catch (error) {
		return handleApiError(error, "POST /api/upload");
	}
}
