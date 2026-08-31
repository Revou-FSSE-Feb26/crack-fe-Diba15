import { type NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/apiError";
import { axiosServer } from "@/lib/axiosServer";

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const body = await req.json();
		const res = await axiosServer.patch(`/artworks/tags/${id}`, body);
		return NextResponse.json(res.data);
	} catch (error) {
		return handleApiError(error, "PATCH /api/artwork/tags/[id]");
	}
}

export async function DELETE(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const res = await axiosServer.delete(`/artworks/tags/${id}`);
		return NextResponse.json(res.data);
	} catch (error) {
		return handleApiError(error, "DELETE /api/artwork/tags/[id]");
	}
}
