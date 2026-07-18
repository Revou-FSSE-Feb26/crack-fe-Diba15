import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/apiError";
import { axiosServer } from "@/lib/axiosServer";

interface RouteParams {
	params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
	try {
		const { id } = await params;
		const res = await axiosServer.get(`/artwork/artists/${id}`);
		return NextResponse.json(res.data);
	} catch (error) {
		return handleApiError(error, "GET /api/artwork/artists/[id]");
	}
}
