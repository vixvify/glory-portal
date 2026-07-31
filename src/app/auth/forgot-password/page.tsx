"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import KeyIcon from "@mui/icons-material/Key";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { useAppStore } from "@/store/use-store";
import { AUTH_MESSAGES } from "@/core/constants/auth-messages";
import {
  forgotPasswordRequestSchema,
  forgotPasswordResetSchema,
  ForgotPasswordRequestFormValues,
  ForgotPasswordResetFormValues,
} from "@/core/schema/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { showToast } = useAppStore();

  const [step, setStep] = useState<"request" | "verify" | "success">("request");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const requestForm = useForm<ForgotPasswordRequestFormValues>({
    resolver: zodResolver(forgotPasswordRequestSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<ForgotPasswordResetFormValues>({
    resolver: zodResolver(forgotPasswordResetSchema),
    defaultValues: {
      code: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onRequestSubmit = async (data: ForgotPasswordRequestFormValues) => {
    // setError("");
    // setIsLoading(true);
    // try {
    //   await new Promise((resolve) => setTimeout(resolve, 1500));
    //   setEmail(data.email);
    //   showToast(AUTH_MESSAGES.TOAST.VERIFY_CODE_SENT, "success");
    //   setStep("verify");
    // } catch (err) {
    //   setError(AUTH_MESSAGES.ERRORS.SEND_EMAIL_FAILED);
    //   console.error(err);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const onResetSubmit = async (data: ForgotPasswordResetFormValues) => {
    // setError("");
    // setIsLoading(true);
    // try {
    //   if (data.code !== "123456") {
    //     throw new Error(AUTH_MESSAGES.ERRORS.INVALID_VERIFY_CODE);
    //   }
    //   await new Promise((resolve) => setTimeout(resolve, 1500));
    //   showToast(AUTH_MESSAGES.TOAST.RESET_PASSWORD_SUCCESS, "success");
    //   setStep("success");
    // } catch (err: unknown) {
    //   const errMsg =
    //     err instanceof Error
    //       ? err.message
    //       : AUTH_MESSAGES.ERRORS.RESET_PASSWORD_FAILED;
    //   setError(errMsg);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel-gold rounded-2xl shadow-2xl p-8 space-y-6 animate-fade-in">
        {step !== "success" && (
          <button
            onClick={() => {
              if (step === "verify") {
                setStep("request");
                setError("");
              } else {
                router.push("/auth/login");
              }
            }}
            className="text-zinc-500 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs focus:outline-none border-none bg-transparent"
          >
            <ArrowBackIcon className="text-sm" /> ย้อนกลับ
          </button>
        )}

        {step === "request" && (
          <>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                ลืมรหัสผ่าน?
              </h2>
              <p className="text-xs text-zinc-400">
                กรอกอีเมลของคุณเพื่อรับลิงก์และรหัสสำหรับตั้งรหัสผ่านใหม่
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-950/40 border border-red-800 text-red-400 text-xs rounded-lg text-center animate-shake">
                {error}
              </div>
            )}

            <form
              onSubmit={requestForm.handleSubmit(onRequestSubmit)}
              className="space-y-4"
            >
              <Input
                label="อีเมล"
                placeholder="you@example.com"
                type="email"
                icon={<EmailIcon className="text-zinc-500 text-lg" />}
                error={requestForm.formState.errors.email?.message}
                {...requestForm.register("email")}
              />

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full mt-2"
              >
                ส่งรหัสยืนยัน
              </Button>
            </form>
          </>
        )}

        {step === "verify" && (
          <>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                ตั้งรหัสผ่านใหม่
              </h2>
              <p className="text-xs text-zinc-400">
                ส่งรหัสยืนยันไปที่{" "}
                <span className="text-brand font-medium">{email}</span> แล้ว
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-950/40 border border-red-800 text-red-400 text-xs rounded-lg text-center animate-shake">
                {error}
              </div>
            )}

            <form
              onSubmit={resetForm.handleSubmit(onResetSubmit)}
              className="space-y-4"
            >
              <Input
                label="รหัสยืนยัน 6 หลัก"
                placeholder="xxxxxx"
                type="text"
                maxLength={6}
                icon={<KeyIcon className="text-zinc-500 text-lg" />}
                error={resetForm.formState.errors.code?.message}
                {...resetForm.register("code")}
              />

              <Input
                label="รหัสผ่านใหม่"
                placeholder="อย่างน้อย 6 ตัวอักษร"
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
                error={resetForm.formState.errors.password?.message}
                {...resetForm.register("password")}
              />

              <Input
                label="ยืนยันรหัสผ่านใหม่"
                placeholder="ยืนยันรหัสผ่านใหม่"
                type={showPassword ? "text" : "password"}
                icon={<LockIcon className="text-zinc-500 text-lg" />}
                error={resetForm.formState.errors.confirmPassword?.message}
                {...resetForm.register("confirmPassword")}
              />

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full mt-2"
              >
                เปลี่ยนรหัสผ่าน
              </Button>
            </form>
          </>
        )}

        {step === "success" && (
          <div className="text-center space-y-6 py-4">
            <div className="flex justify-center text-green-500">
              <CheckCircleIcon className="text-7xl animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white tracking-tight">
                เสร็จเรียบร้อย!
              </h2>
              <p className="text-xs text-zinc-400">
                รหัสผ่านใหม่ของคุณได้รับการบันทึกเรียบร้อยแล้ว
              </p>
            </div>

            <Button
              onClick={() => router.push("/auth/login")}
              className="w-full"
            >
              เข้าสู่ระบบเลย
            </Button>
          </div>
        )}
      </div>
      <Toast />
    </div>
  );
}
