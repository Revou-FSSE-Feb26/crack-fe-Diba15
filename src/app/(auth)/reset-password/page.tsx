"use client";

import { CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/form/Input";
import { axiosClient } from "@/lib/axiosClient";
import { useToastStore } from "@/store/ToastStore";

interface ResetPasswordForm {
	newPassword: string;
	confirmPassword: string;
}

function ResetPasswordFormContent() {
	const searchParams = useSearchParams();
	const token = searchParams.get("token") || "";
	const router = useRouter();
	const { addToast } = useToastStore();

	const [isSuccess, setIsSuccess] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<ResetPasswordForm>();

	const newPasswordValue = watch("newPassword");

	const onSubmit = async (data: ResetPasswordForm) => {
		if (!token) {
			addToast({
				type: "error",
				message: "Token reset password tidak ditemukan di URL.",
			});
			return;
		}

		setIsLoading(true);
		try {
			const res = await axiosClient.post("/auth/reset-password", {
				token,
				newPassword: data.newPassword,
			});
			addToast({ type: "success", message: res.data.message });
			setIsSuccess(true);
		} catch (error) {
			let msg = "Gagal memperbarui password. Token mungkin sudah expired.";
			if (error && typeof error === "object" && "response" in error) {
				const errObj = error as { response?: { data?: { message?: string } } };
				if (errObj.response?.data?.message) {
					msg = errObj.response.data.message;
				}
			}
			addToast({ type: "error", message: msg });
		} finally {
			setIsLoading(false);
		}
	};

	if (!token) {
		return (
			<div className="text-center space-y-4">
				<p className="text-danger text-sm">
					Token reset password tidak valid atau tidak ada di URL.
				</p>
				<Link
					href="/forgot-password"
					className="inline-block text-sm text-primary hover:underline"
				>
					Minta Link Reset Baru
				</Link>
			</div>
		);
	}

	if (isSuccess) {
		return (
			<div className="text-center space-y-4">
				<CheckCircle2 className="w-12 h-12 text-verified mx-auto" />
				<h3 className="font-semibold text-content text-lg">
					Password Berhasil Diperbarui!
				</h3>
				<p className="text-xs text-content-muted">
					Silakan login menggunakan password baru Anda.
				</p>
				<Button
					variant="primary"
					className="w-full justify-center mt-2"
					onClick={() => router.push("/login")}
				>
					Ke Halaman Login
				</Button>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div>
				<label
					htmlFor="newPassword"
					className="block text-sm font-semibold mb-1.5 text-content"
				>
					Password Baru
				</label>
				<Input
					id="newPassword"
					type="password"
					placeholder="Minimal 6 karakter"
					{...register("newPassword", {
						required: "Password baru wajib diisi",
						minLength: {
							value: 6,
							message: "Password minimal 6 karakter",
						},
					})}
				>
					<Lock className="h-5 w-5 text-gray-400" />
				</Input>
				{errors.newPassword && (
					<p className="text-danger text-xs mt-1">
						{errors.newPassword.message}
					</p>
				)}
			</div>

			<div>
				<label
					htmlFor="confirmPassword"
					className="block text-sm font-semibold mb-1.5 text-content"
				>
					Konfirmasi Password Baru
				</label>
				<Input
					id="confirmPassword"
					type="password"
					placeholder="Ulangi password baru"
					{...register("confirmPassword", {
						required: "Konfirmasi password wajib diisi",
						validate: (val) =>
							val === newPasswordValue || "Konfirmasi password tidak cocok",
					})}
				>
					<Lock className="h-5 w-5 text-gray-400" />
				</Input>
				{errors.confirmPassword && (
					<p className="text-danger text-xs mt-1">
						{errors.confirmPassword.message}
					</p>
				)}
			</div>

			<Button
				type="submit"
				variant="primary"
				className="w-full justify-center"
				disabled={isLoading}
			>
				{isLoading ? "Memperbarui Password..." : "Simpan Password Baru"}
			</Button>
		</form>
	);
}

export default function ResetPasswordPage() {
	return (
		<div className="min-h-screen flex flex-col justify-center items-center p-6 text-content">
			{/* Palette accent dots decorator */}
			<div className="absolute top-5 right-5 flex gap-1.5">
				<div className="w-3 h-3 rounded-full bg-[#e8a87c] opacity-70"></div>
				<div className="w-3 h-3 rounded-full bg-[#88ccdd] opacity-70"></div>
				<div className="w-3 h-3 rounded-full bg-[#a8d8b0] opacity-70"></div>
			</div>

			<div className="w-full max-w-md bg-surface border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
				<h1 className="text-2xl font-bold font-display text-content mb-2">
					Reset Password
				</h1>
				<p className="text-sm text-content-muted mb-6">
					Buat password baru yang aman untuk akun TruBrush Anda.
				</p>

				<Suspense
					fallback={<div className="text-sm text-center">Memuat...</div>}
				>
					<ResetPasswordFormContent />
				</Suspense>
			</div>
		</div>
	);
}
