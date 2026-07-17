import { NextResponse } from "next/server";
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
	} catch (error: unknown) {
		// biome-ignore lint/suspicious/noExplicitAny: proxy error casting
		const err = error as any;
		const status = err.response?.status || 500;
		const data = err.response?.data || { message: "Internal Server Error" };
		return NextResponse.json(data, { status });
	}
}
