import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/apiError";
import { axiosServer } from "@/lib/axiosServer";

export async function PATCH(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const res = await axiosServer.patch(`/commissions/${id}/cancel`);
		return NextResponse.json(res.data);
	} catch (error) {
		return handleApiError(error, "PATCH /api/commissions/[id]/cancel");
	}
}
