import axios from "axios";
import { NextResponse } from "next/server";
import { axiosServer } from "@/lib/axiosServer";

export async function GET() {
	try {
		// Interceptor axiosServer otomatis meneruskan Authorization header jika ada
		const res = await axiosServer.get("/user");
		return NextResponse.json(res.data);
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const status = error.response?.status || 500;
			const data = error.response?.data || { message: "Internal Server Error" };
			return NextResponse.json(data, { status });
		}
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		// Interceptor axiosServer otomatis meneruskan Authorization header jika ada
		const res = await axiosServer.post("/user", body);
		return NextResponse.json(res.data);
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const status = error.response?.status || 500;
			const data = error.response?.data || { message: "Internal Server Error" };
			return NextResponse.json(data, { status });
		}
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
