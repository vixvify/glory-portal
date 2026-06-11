"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
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
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel-gold rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
            เข้าสู่ระบบ
          </h2>
          <p className="text-xs text-zinc-400">ยินดีต้อนรับกลับสู่ ThaiFlix</p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800 text-red-400 text-xs rounded-lg text-center animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="ที่อยู่อีเมล"
            placeholder="you@example.com"
            type="email"
            icon={<EmailIcon className="text-zinc-500 text-lg" />}
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="รหัสผ่าน"
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
            icon={<LockIcon className="text-zinc-500 text-lg" />}
            suffix={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-zinc-500 hover:text-white cursor-pointer flex items-center justify-center border-0 bg-transparent"
              >
                {showPassword ? (
                  <VisibilityOffIcon className="text-lg" />
                ) : (
                  <VisibilityIcon className="text-lg" />
                )}
              </button>
            }
            error={errors.password?.message}
            {...register("password")}
          />

          <Button
            type="submit"
            isLoading={loginMutation.isPending}
            className="w-full mt-2"
          >
            เข้าสู่ระบบ
          </Button>
        </form>

        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-zinc-800/80"></div>
          <span className="flex-shrink mx-3 text-[10px] text-zinc-500 uppercase tracking-widest font-semibold font-mono">
            Or
          </span>
          <div className="flex-grow border-t border-zinc-800/80"></div>
        </div>

        <div className="text-center">
          <Link
            href="/auth/register"
            className="text-xs text-zinc-400 hover:text-brand transition-colors cursor-pointer"
          >
            ใหม่กับ ThaiFlix? สมัครสมาชิกเลย
          </Link>
        </div>
      </div>
      <Toast />
    </div>
  );
}
