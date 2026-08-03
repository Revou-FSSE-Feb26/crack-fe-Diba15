import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/apiError";
import { axiosServer } from "@/lib/axiosServer";

export async function PATCH(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const body = await request.json();
		const res = await axiosServer.patch(`/reports/${id}/resolve`, body);
		return NextResponse.json(res.data);
	} catch (error) {
		return handleApiError(error, "PATCH /api/reports/[id]/resolve");
	}
}
