import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/apiError";
import { axiosServer } from "@/lib/axiosServer";

interface RouteParams {
	params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
	try {
		const { id } = await params;
		const body = await request.json();
		const res = await axiosServer.patch(`/artwork/${id}/curate`, body);
		return NextResponse.json(res.data);
	} catch (error) {
		return handleApiError(error, "PATCH /api/artwork/[id]/curate");
	}
}
