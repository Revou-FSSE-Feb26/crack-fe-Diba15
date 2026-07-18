import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/apiError";
import { axiosServer } from "@/lib/axiosServer";

export async function GET() {
	try {
		const res = await axiosServer.get("/artwork/artists");
		return NextResponse.json(res.data);
	} catch (error) {
		return handleApiError(error, "GET /api/artwork/artists");
	}
}
