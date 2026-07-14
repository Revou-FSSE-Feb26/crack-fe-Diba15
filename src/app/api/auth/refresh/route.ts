import axios from "axios";
import { NextResponse } from "next/server";
import { axiosServer } from "@/lib/axiosServer";

export async function POST() {
	try {
		// Kirim request refresh ke backend NestJS
		// Interceptor axiosServer otomatis menyisipkan refresh_token dari cookie Next.js
		// dan meng-update cookie Next.js jika ada Set-Cookie baru dari backend
		const res = await axiosServer.post("/auth/refresh");

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
