"use client";

import { Lock, Mail, MoveLeft, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/form/Input";
import { useToastStore } from "@/store/ToastStore";
import { useUserStore } from "@/store/UserStore";

interface Signup {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
	role: "artist" | "client";
}

export default function Signup() {
	const router = useRouter();
	const { register: registerUser } = useUserStore();
	const { addToast } = useToastStore();

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<Signup>({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
			role: "artist",
		},
	});

	const password = useWatch({ control, name: "password" });

	const onSubmit = async (data: Signup) => {
		const res = await registerUser({
			name: data.name,
			email: data.email,
			password: data.password,
			role: data.role,
		});

		addToast({
			message: res.message,
			type: res.success ? "success" : "error",
		});

		if (res.success) {
			router.push("/profile");
		}
	};

	return (
		<section className="flex flex-1 justify-center relative">
			{/* Palette accent dots decorator */}
			<div className="absolute top-5 right-5 flex gap-1.5">
				<div className="w-3 h-3 rounded-full bg-[#e8a87c] opacity-70"></div>
				<div className="w-3 h-3 rounded-full bg-[#88ccdd] opacity-70"></div>
				<div className="w-3 h-3 rounded-full bg-[#a8d8b0] opacity-70"></div>
			</div>

			<div className="flex flex-col justify-center items-center gap-4 h-screen text-primary p-12 w-full max-w-md">
				{/* Back to home */}
				<Link href="/login" className="flex items-center self-start gap-2">
					<MoveLeft />
					<span>Back to login</span>
				</Link>
				<h2 className="text-4xl font-bold font-outfit mb-4">Register</h2>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col gap-4 w-full max-w-xs"
				>
					{/* Role */}
					<div>
						<div className="grid grid-cols-2 gap-3">
							<label className="cursor-pointer">
								<input
									{...register("role", {
										required: "Pilih role terlebih dahulu",
									})}
									value="artist"
									type="radio"
									name="role"
									className="peer sr-only"
									defaultChecked
								/>
								<div className="text-center py-2 px-3 border border-content-muted/30 rounded-lg peer-checked:bg-primary peer-checked:text-surface peer-checked:border-primary transition-all text-content-muted">
									<User size={18} className="mx-auto mb-1" />
									<span className="text-sm font-medium">Illustrator</span>
								</div>
							</label>
							<label className="cursor-pointer">
								<input
									{...register("role", {
										required: "Pilih role terlebih dahulu",
									})}
									value="client"
									type="radio"
									name="role"
									className="peer sr-only"
								/>
								<div className="text-center py-2 px-3 border border-content-muted/30 rounded-lg peer-checked:bg-primary peer-checked:text-surface peer-checked:border-primary transition-all text-content-muted">
									<User size={18} className="mx-auto mb-1" />
									<span className="text-sm font-medium">Client</span>
								</div>
							</label>
						</div>
						{errors.role && (
							<p className="text-danger text-xs mt-1">{errors.role.message}</p>
						)}
					</div>

					{/* Name */}
					<div>
						<label
							htmlFor="name"
							className="block text-sm font-semibold mb-1.5 text-content"
						>
							Name
						</label>
						<Input
							id="name"
							type="text"
							placeholder="John Doe"
							{...register("name", {
								required: "Nama wajib diisi",
								minLength: {
									value: 3,
									message: "Minimal 3 karakter",
								},
							})}
						>
							<User className="h-5 w-5 text-gray-400" />
						</Input>
						{errors.name && (
							<p className="text-danger text-xs mt-1">{errors.name.message}</p>
						)}
					</div>

					{/* Email */}
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-semibold mb-1.5 text-content"
						>
							Email
						</label>
						<Input
							id="email"
							type="email"
							placeholder="mail@email.com"
							{...register("email", {
								required: "Email wajib diisi",
								pattern: {
									value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
									message: "Format email tidak valid",
								},
							})}
						>
							<Mail className="h-5 w-5 text-gray-400" />
						</Input>
						{errors.email && (
							<p className="text-danger text-xs mt-1">{errors.email.message}</p>
						)}
					</div>

					{/* Password */}
					<div>
						<label
							htmlFor="password"
							className="block text-sm font-semibold mb-1.5 text-content"
						>
							Password
						</label>
						<Input
							id="password"
							type="password"
							placeholder="********"
							{...register("password", {
								required: "Password wajib diisi",
								minLength: {
									value: 8,
									message: "Minimal 8 karakter",
								},
							})}
						>
							<Lock className="h-5 w-5 text-gray-400" />
						</Input>
						{errors.password && (
							<p className="text-danger text-xs mt-1">
								{errors.password.message}
							</p>
						)}
					</div>

					{/* Password Confirmation */}
					<div>
						<label
							htmlFor="confirmPass"
							className="block text-sm font-semibold mb-1.5 text-content"
						>
							Confirmation Password
						</label>
						<Input
							id="confirmPass"
							type="password"
							placeholder="********"
							{...register("confirmPassword", {
								required: "Password wajib diisi",
								minLength: {
									value: 8,
									message: "Minimal 8 karakter",
								},
								validate: (value) =>
									value === password || "Password tidak sama",
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
					<Button type="submit" variant="primary">
						Register
					</Button>
				</form>
			</div>
		</section>
	);
}
