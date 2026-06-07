"use client"

import Button from "@/components/ui/Button"
import Input from "@/components/ui/form/Input"
import { Mail, Lock, User, MoveLeft } from 'lucide-react';
import Link from "next/link";
import { useForm } from "react-hook-form"

interface LoginForm {
    email: string;
    password: string;
    role: "artist" | "client";
}

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        defaultValues: {
            email: "",
            password: "",
            role: "artist"
        }
    });

    const onSubmit = (data: LoginForm) => {
        console.log(data);
    }

    return (
        <div className="flex gap-2">
            {/* Left Panel */}
            <section>
                <div className="hidden lg:flex flex-col justify-center items-center h-screen bg-primary text-white p-12">
                    <h2 className="text-4xl font-bold font-outfit mb-4">Welcome Back to TruBrush</h2>
                    <p className="text-lg text-center max-w-md opacity-90">
                        Connect with authentic artists and discover human-made masterpieces in our 100% AI-free community.
                    </p>

                    {/* B — Divider decorator */}
                    <div className="flex items-center gap-3 my-6 px-4 w-full max-w-xs">
                        <div className="flex-1 h-px bg-white/25"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
                        <div className="flex-1 h-px bg-white/25"></div>
                    </div>
                </div>
            </section>

            {/* Right Panel — Login Form */}
            <section className="flex flex-1 justify-center relative">

                {/* Palette accent dots decorator */}
                <div className="absolute top-5 right-5 flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#e8a87c] opacity-70"></div>
                    <div className="w-3 h-3 rounded-full bg-[#88ccdd] opacity-70"></div>
                    <div className="w-3 h-3 rounded-full bg-[#a8d8b0] opacity-70"></div>
                </div>

                <div className="flex flex-col justify-center items-center gap-4 h-screen text-primary p-12">
                    {/* Back to home */}
                    <Link href="/" className="flex items-center self-start gap-2">
                        <MoveLeft />
                        <span>Back to Home</span>
                    </Link>
                    <h2 className="text-4xl font-bold font-outfit mb-4">Login to TruBrush</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-xs">
                        {/* Role */}
                        <div>
                            <div className="grid grid-cols-2 gap-3">
                                <label className="cursor-pointer">
                                    <input {...register("role", { required: "Pilih role terlebih dahulu" })} value="artist" type="radio" name="role" className="peer sr-only" defaultChecked />
                                    <div className="text-center py-2 px-3 border border-content-muted/30 rounded-lg peer-checked:bg-primary peer-checked:text-surface peer-checked:border-primary transition-all text-content-muted">
                                        <User size={18} className="mx-auto mb-1" />
                                        <span className="text-sm font-medium">Illustrator</span>
                                    </div>
                                </label>
                                <label className="cursor-pointer">
                                    <input {...register("role", { required: "Pilih role terlebih dahulu" })} value="client" type="radio" name="role" className="peer sr-only" />
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
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold mb-1.5 text-content">Email</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="mail@email.com"
                                {...register("email", {
                                    required: "Email wajib diisi",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Format email tidak valid"
                                    }
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
                            <label htmlFor="password" className="block text-sm font-semibold mb-1.5 text-content">Password</label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="********"
                                {...register("password", {
                                    required: "Password wajib diisi",
                                })}
                            >
                                <Lock className="h-5 w-5 text-gray-400" />
                            </Input>
                            {errors.password && (
                                <p className="text-danger text-xs mt-1">{errors.password.message}</p>
                            )}
                        </div>
                        <div>
                            <Link href="/forgot-password" className="text-sm text-content hover:text-content-muted transition-colors">Forgot password?</Link>
                        </div>
                        <Button type="submit" variant="primary">Login</Button>
                    </form>
                    <Link href="/signup" className="text-sm text-content hover:text-content-muted transition-colors">Don&apos;t have an account? Register</Link>
                    <Link href="/staff-login" className="text-sm text-content hover:text-content-muted transition-colors">Staff login</Link>
                </div>
            </section>
        </div>
    )
}