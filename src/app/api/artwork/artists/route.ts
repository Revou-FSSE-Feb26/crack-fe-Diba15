import { NextResponse } from "next/server";
import { axiosServer } from "@/lib/axiosServer";

export async function GET() {
	try {
		const res = await axiosServer.get("/artwork/artists");
		return NextResponse.json(res.data);
	} catch (error: unknown) {
		// biome-ignore lint/suspicious/noExplicitAny: proxy error casting
		const err = error as any;
		const status = err.response?.status || 500;
		const data = err.response?.data || { message: "Internal Server Error" };
		return NextResponse.json(data, { status });
	}
}
