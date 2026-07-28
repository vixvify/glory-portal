"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUserSchema } from "@/core/schema/auth";
import { useLoginMutation } from "@/hooks/db/use-auth";
import Link from "next/link";
import { Toast } from "@/components/ui/toast";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError("");
    try {
      await loginMutation.mutateAsync(data);
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "เข้าสู่ระบบไม่สำเร็จ");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-[460px] bg-[#1c1c1e] border border-white/5 border-t-white/20 border-l-white/20 rounded-2xl p-8 space-y-5 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            ยินดีต้อนรับ
          </h2>
          <p className="text-sm text-zinc-400">ร่วมบอกเล่าเรื่องราวของคุณได้ที่นี่</p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800 text-red-400 text-xs rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-lg text-white font-bold block">อีเมล</label>
            <input
              type="email"
              placeholder=""
              className="w-full bg-[#3f3f42] border border-zinc-500 rounded-xl px-4 py-3 text-base text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-brand [color-scheme:dark]"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-[11px] text-red-400 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-lg text-white font-bold block">รหัสผ่าน</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder=""
                className="w-full bg-[#3f3f42] border border-zinc-500 rounded-xl px-4 py-3 pr-11 text-base text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-brand [color-scheme:dark]"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white cursor-pointer bg-transparent border-0 flex items-center"
              >
                {showPassword ? (
                  <VisibilityOffIcon className="text-lg" />
                ) : (
                  <VisibilityIcon className="text-lg" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] text-red-400 mt-1">{errors.password.message}</p>
            )}
            <div className="flex justify-end pt-1">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-zinc-400 hover:text-brand transition-colors"
              >
                ลืมรหัสผ่าน
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-gradient-to-b from-[#c89f3a] to-[#997316] hover:opacity-90 text-white font-bold rounded-2xl py-3 text-lg transition-opacity disabled:opacity-50 disabled:pointer-events-none mt-6"
          >
            {loginMutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                กำลังโหลด...
              </span>
            ) : (
              "เข้าสู่ระบบ"
            )}
          </button>
        </form>

        <Link href="/auth/register" className="block w-full mt-4">
          <button
            type="button"
            className="w-full border border-zinc-500 hover:border-zinc-400 text-white font-bold rounded-2xl py-3 text-lg transition-colors bg-transparent"
          >
            สร้างบัญชี
          </button>
        </Link>
      </div>
      <Toast />
    </div>
  );
}
