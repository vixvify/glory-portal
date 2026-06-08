"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUserSchema } from "@/core/schema/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRegisterMutation } from "@/hooks/use-auth";
import { ImageCropper } from "@/components/modal/image-cropper";
import Link from "next/link";
import { Toast } from "@/components/ui/toast";

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  photo?: File;
  motto?: string;
  bio?: string;
  ig?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  positions?: string[];
  birthday?: string;
  awards?: string[];
};

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showOptional, setShowOptional] = useState(false);
  const [error, setError] = useState("");

  const [cropperOpen, setCropperOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState<string | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const registerMutation = useRegisterMutation();
  const [positionsList, setPositionsList] = useState<string[]>([""]);
  const [awardsList, setAwardsList] = useState<string[]>([""]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      motto: "",
      bio: "",
      ig: "",
      facebook: "",
      youtube: "",
      tiktok: "",
      positions: [],
      birthday: "",
      awards: [],
    },
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setRawImageSrc(reader.result as string);
        setCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropConfirm = (croppedFile: File, previewUrl: string) => {
    setCroppedPreviewUrl(previewUrl);
    setValue("photo", croppedFile);
    setCropperOpen(false);
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setError("");
    try {
      const activePositions = positionsList
        .map((p) => p.trim())
        .filter(Boolean);
      const activeAwards = awardsList.map((a) => a.trim()).filter(Boolean);

      await registerMutation.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password,
        photo: data.photo,
        motto: data.motto,
        bio: data.bio,
        ig: data.ig,
        facebook: data.facebook,
        youtube: data.youtube,
        tiktok: data.tiktok,
        positions: activePositions.length > 0 ? activePositions : undefined,
        birthday: data.birthday,
        awards: activeAwards.length > 0 ? activeAwards : undefined,
      });
      router.push("/auth/login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "ลงทะเบียนไม่สำเร็จ");
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-start justify-center p-4 pt-24 md:pt-28 pb-16">
      <div
        className={`w-full ${showOptional ? "max-w-5xl" : "max-w-xl"} glass-panel-gold rounded-[2rem] shadow-2xl p-10 space-y-8 transition-all duration-500 ease-in-out`}
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            สร้างบัญชีใหม่
          </h2>
          <p className="text-xs text-zinc-400 font-light max-w-sm mx-auto leading-relaxed">
            สมัครสมาชิกเพื่อเข้าร่วมการประเมิน ให้คะแนน
            และสร้างโปรไฟล์ของคนทำหนัง
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800 text-red-400 text-xs rounded-xl text-center animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col items-center space-y-3 pb-4">
            <div
              onClick={handleAvatarClick}
              className="relative w-28 h-28 rounded-full p-[3px] bg-gradient-to-tr from-brand to-zinc-800 cursor-pointer overflow-hidden group flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-lg shadow-black/50"
            >
              <div className="w-full h-full rounded-full bg-zinc-900 overflow-hidden flex items-center justify-center">
                {croppedPreviewUrl ? (
                  <img
                    src={croppedPreviewUrl}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <PersonIcon className="text-zinc-500 text-6xl" />
                )}
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200 rounded-full">
                <PhotoCameraIcon className="text-xl mb-1 text-brand" />
                <span className="text-[10px] font-bold tracking-wider uppercase">
                  อัปโหลดรูป
                </span>
              </div>
            </div>
            <label className="text-xs text-zinc-500 font-medium">
              รูปโปรไฟล์ประจำตัว (ไม่บังคับ)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div
            className={
              showOptional
                ? "grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
                : "space-y-6"
            }
          >
            <div className="glass-panel rounded-3xl p-6 space-y-5 shadow-xl">
              <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest font-mono border-b border-zinc-800/50 pb-2">
                ข้อมูลหลักของบัญชี
              </p>

              <div className="space-y-4">
                <Input
                  label="ชื่อเต็ม"
                  placeholder="เช่น สมชาย ใจดี"
                  icon={<PersonIcon className="text-zinc-500 text-lg" />}
                  error={errors.name?.message}
                  {...register("name")}
                />

                <Input
                  label="อีเมล"
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
                      className="text-zinc-500 hover:text-white cursor-pointer flex items-center justify-center border-0 bg-transparent animate-fade-in"
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
              </div>

              {showOptional && (
                <div className="space-y-4 pt-3 border-t border-zinc-800/50 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="คติพจน์"
                      placeholder="เช่น ความสำเร็จเกิดจากความพยายาม"
                      {...register("motto")}
                    />

                    <Input
                      label="วันเกิด"
                      type="date"
                      {...register("birthday")}
                    />
                  </div>

                  <div className="space-y-1 w-full text-left">
                    <label className="text-xs text-zinc-400 font-medium block">
                      ประวัติโดยย่อ
                    </label>
                    <textarea
                      placeholder="ระบุประวัติโดยย่อของคุณ..."
                      rows={3}
                      className="w-full glass-input rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none transition-colors placeholder-zinc-500 font-light"
                      {...register("bio")}
                    />
                  </div>
                </div>
              )}
            </div>

            {showOptional && (
              <div className="glass-panel rounded-3xl p-6 space-y-6 shadow-xl animate-fade-in">
                <div className="space-y-4">
                  <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest font-mono border-b border-zinc-800/50 pb-2">
                    ลิงก์โซเชียลมีเดีย
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Instagram ID"
                      placeholder="เช่น my_ig_name"
                      {...register("ig")}
                    />
                    <Input
                      label="Facebook URL"
                      placeholder="เช่น facebook.com/profile"
                      {...register("facebook")}
                    />
                    <Input
                      label="YouTube URL"
                      placeholder="เช่น youtube.com/c/channel"
                      {...register("youtube")}
                    />
                    <Input
                      label="TikTok URL"
                      placeholder="เช่น tiktok.com/@username"
                      {...register("tiktok")}
                    />
                  </div>
                </div>

                <div className="border-t border-zinc-800/50 pt-3 space-y-6">
                  <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest font-mono border-b border-zinc-800/50 pb-2">
                    ข้อมูลอื่นๆ
                  </p>

                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400 font-medium block">
                      ตำแหน่งประจำ
                    </label>
                    <div className="space-y-3">
                      {positionsList.map((pos, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <Input
                            placeholder="เช่น ผู้กำกับ"
                            value={pos}
                            onChange={(e) => {
                              const newPositions = [...positionsList];
                              newPositions[idx] = e.target.value;
                              setPositionsList(newPositions);
                            }}
                          />
                          {positionsList.length > 1 && (
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() =>
                                setPositionsList(
                                  positionsList.filter((_, i) => i !== idx),
                                )
                              }
                              className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 transition-all flex-shrink-0 h-auto"
                            >
                              <CloseIcon className="text-sm" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setPositionsList([...positionsList, ""])}
                        className="w-full py-2.5 text-xs flex items-center justify-center gap-2 border border-dashed border-zinc-800 hover:border-brand/40 hover:text-brand bg-zinc-950/20 hover:bg-brand/5 rounded-xl transition-all duration-200"
                      >
                        <AddIcon className="text-sm" /> เพิ่มตำแหน่งประจำ
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400 font-medium block">
                      รางวัล
                    </label>
                    <div className="space-y-3">
                      {awardsList.map((awd, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <Input
                            placeholder="เช่น ผู้กำกับยอดเยี่ยม 2024"
                            value={awd}
                            onChange={(e) => {
                              const newAwards = [...awardsList];
                              newAwards[idx] = e.target.value;
                              setAwardsList(newAwards);
                            }}
                          />
                          {awardsList.length > 1 && (
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() =>
                                setAwardsList(
                                  awardsList.filter((_, i) => i !== idx),
                                )
                              }
                              className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 transition-all flex-shrink-0 h-auto"
                            >
                              <CloseIcon className="text-sm" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setAwardsList([...awardsList, ""])}
                        className="w-full py-2.5 text-xs flex items-center justify-center gap-2 border border-dashed border-zinc-800 hover:border-brand/40 hover:text-brand bg-zinc-950/20 hover:bg-brand/5 rounded-xl transition-all duration-200"
                      >
                        <AddIcon className="text-sm" /> เพิ่มรางวัลที่ได้รับ
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowOptional(!showOptional)}
              className="w-full bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800/75 hover:border-zinc-700/85 rounded-2xl py-3.5 px-6 text-xs text-zinc-400 hover:text-white transition-all flex items-center justify-between cursor-pointer group shadow-lg"
            >
              <div className="flex items-center gap-2.5">
                <span className="font-semibold tracking-wide">
                  ระบุข้อมูลโปรไฟล์เสริม (ผลงาน, รางวัล, โซเชียลมีเดีย)
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 group-hover:text-brand font-bold uppercase tracking-wider transition-colors">
                <span>
                  {showOptional ? "ย่อหน้าต่างลง" : "เปิดตัวเลือกเพิ่มเติม"}
                </span>
                {showOptional ? (
                  <ExpandLessIcon className="text-base" />
                ) : (
                  <ExpandMoreIcon className="text-base" />
                )}
              </div>
            </button>
          </div>

          <div className="flex justify-center w-full mt-2">
            <Button
              type="submit"
              isLoading={registerMutation.isPending}
              className="w-full max-w-md py-3 bg-brand text-white hover:bg-brand-hover shadow-lg shadow-brand/10 text-sm font-bold uppercase tracking-wider rounded-xl transition-all active:scale-[0.98]"
            >
              สมัครสมาชิก
            </Button>
          </div>
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
            href="/auth/login"
            className="text-xs text-zinc-400 hover:text-brand transition-colors cursor-pointer"
          >
            มีบัญชีอยู่แล้ว? เข้าสู่ระบบ
          </Link>
        </div>
      </div>

      {cropperOpen && (
        <ImageCropper
          isOpen={cropperOpen}
          imageSrc={rawImageSrc}
          onClose={() => setCropperOpen(false)}
          onConfirm={handleCropConfirm}
          fileName="profile-picture.jpg"
        />
      )}
      <Toast />
    </div>
  );
}
