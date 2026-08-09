"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUserSchema } from "@/core/schema/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLoginMutation } from "@/hooks/db/use-auth";
import Link from "next/link";
import { Toast } from "@/components/ui/toast";
import { AUTH_MESSAGES } from "@/core/constants/auth-messages";

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
    } catch {
      setError(AUTH_MESSAGES.ERRORS.LOGIN_FAILED);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card-secondary border border-theme-border rounded-2xl p-8 flex flex-col gap-4 shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
            ยินดีต้อนรับ
          </h2>
          <p className="text-sm text-zinc-400">
            ร่วมบอกเล่าเรื่องราวของคุณได้ที่นี่
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800 text-red-400 text-xs rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="อีเมล"
            type="email"
            placeholder="กรอกอีเมลของคุณ"
            variant="auth"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="รหัสผ่าน"
            type={showPassword ? "text" : "password"}
            placeholder="กรอกรหัสผ่านของคุณ"
            variant="auth"
            error={errors.password?.message}
            {...register("password")}
            suffix={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-zinc-500 hover:text-white cursor-pointer bg-transparent border-0 flex items-center h-full px-2"
              >
                {showPassword ? (
                  <VisibilityOffIcon className="text-lg" />
                ) : (
                  <VisibilityIcon className="text-lg" />
                )}
              </button>
            }
          />
          <div className="flex justify-end -mt-2">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-zinc-400 hover:text-brand transition-colors"
            >
              ลืมรหัสผ่าน
            </Link>
          </div>

          <Button
            type="submit"
            variant="auth"
            isLoading={loginMutation.isPending}
          >
            เข้าสู่ระบบ
          </Button>
        </form>

        <Link href="/auth/register" className="block w-full">
          <Button type="button" variant="auth-outline">
            สร้างบัญชี
          </Button>
        </Link>
      </div>
      <Toast />
    </div>
  );
}
