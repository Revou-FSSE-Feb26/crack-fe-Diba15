import { NextResponse } from "next/server";
import { axiosServer } from "@/lib/axiosServer";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const queryString = searchParams.toString();
		const path = queryString ? `/artwork?${queryString}` : "/artwork";

		const res = await axiosServer.get(path);
		return NextResponse.json(res.data);
	} catch (error: unknown) {
		// biome-ignore lint/suspicious/noExplicitAny: proxy error casting
		const err = error as any;
		const status = err.response?.status || 500;
		const data = err.response?.data || { message: "Internal Server Error" };
		return NextResponse.json(data, { status });
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const res = await axiosServer.post("/artwork", body);
		return NextResponse.json(res.data);
	} catch (error: unknown) {
		// biome-ignore lint/suspicious/noExplicitAny: proxy error casting
		const err = error as any;
		const status = err.response?.status || 500;
		const data = err.response?.data || { message: "Internal Server Error" };
		return NextResponse.json(data, { status });
	}
}
