"use client";

import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/form/Input";
import { Mail } from "lucide-react";

interface LoginForm {
    email: string;
    password: string;
}

export default function ForgotPassword() {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit = (data: LoginForm) => {
        console.log(data);
    }

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
                <Link href="/" className="flex items-center self-start gap-2">
                    <MoveLeft />
                    <span>Back to home</span>
                </Link>
                <h2 className="text-4xl font-bold font-outfit mb-4">Staff Login</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-xs">
                    {/* Email */}
                    <div>
                        <Input
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
                    <Button type="submit" variant="primary">Login</Button>
                </form>
            </div>
        </section>
    )
}