import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/apiError";
import { axiosServer } from "@/lib/axiosServer";

interface RouteParams {
	params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
	try {
		const { id } = await params;
		// Interceptor axiosServer otomatis meneruskan Authorization header jika ada
		const res = await axiosServer.get(`/user/${id}`);
		return NextResponse.json(res.data);
	} catch (error) {
		return handleApiError(error, "GET /api/user/[id]");
	}
}

export async function PATCH(request: Request, { params }: RouteParams) {
	try {
		const { id } = await params;
		const body = await request.json();
		// Interceptor axiosServer otomatis meneruskan Authorization header jika ada
		const res = await axiosServer.patch(`/user/${id}`, body);
		return NextResponse.json(res.data);
	} catch (error) {
		return handleApiError(error, "PATCH /api/user/[id]");
	}
}

export async function DELETE(_request: Request, { params }: RouteParams) {
	try {
		const { id } = await params;
		// Interceptor axiosServer otomatis meneruskan Authorization header jika ada
		const res = await axiosServer.delete(`/user/${id}`);
		return NextResponse.json(res.data);
	} catch (error) {
		return handleApiError(error, "DELETE /api/user/[id]");
	}
}
