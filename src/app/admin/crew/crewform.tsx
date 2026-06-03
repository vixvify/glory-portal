"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PeopleIcon from "@mui/icons-material/People";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageCropper } from "@/components/modal/image-cropper";
import { CrewMember } from "@/core/domain/movie";
import { LOCALIZATION } from "@/core/constants/localization";
import { useAppStore } from "@/store/use-store";
import {
  useCreateCrewMemberMutation,
  useUpdateCrewMemberMutation,
} from "@/hooks/use-crew-members";

interface CrewFormProps {
  editingCrew?: CrewMember | null;
}

type CrewFormInputs = {
  name: string;
  email?: string;
  photo?: File | null;
};

export const CrewForm: React.FC<CrewFormProps> = ({ editingCrew = null }) => {
  const router = useRouter();
  const { showToast } = useAppStore();

  const [crewPhotoName, setCrewPhotoName] = useState<string | null>(null);
  const [crewPhotoPreview, setCrewPhotoPreview] = useState<string | null>(null);
  const [crewPhotoInput, setCrewPhotoInput] = useState<File | null>(null);
  const [rawCrewFile, setRawCrewFile] = useState<File | null>(null);

  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [isSavingLocal, setIsSavingLocal] = useState(false);

  const createCrewMutation = useCreateCrewMemberMutation();
  const updateCrewMutation = useUpdateCrewMemberMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CrewFormInputs>();

  useEffect(() => {
    if (editingCrew) {
      setCrewPhotoPreview(editingCrew.photoUrl || null);
      setCrewPhotoInput(null);
      setCrewPhotoName(null);
      setRawCrewFile(null);

      reset({
        name: editingCrew.name,
        email: editingCrew.email || "",
        photo: null,
      });
    } else {
      setCrewPhotoPreview(null);
      setCrewPhotoInput(null);
      setCrewPhotoName(null);
      setRawCrewFile(null);

      reset({
        name: "",
        email: "",
        photo: null,
      });
    }
  }, [editingCrew, reset]);

  const onSubmitForm = async (data: CrewFormInputs) => {
    try {
      setIsSavingLocal(true);

      if (editingCrew) {
        await updateCrewMutation.mutateAsync({
          id: editingCrew.id,
          crewMember: {
            name: data.name.trim(),
            email: data.email?.trim() || null,
            photo: crewPhotoInput || editingCrew.photoUrl || null,
          },
        });
        showToast(LOCALIZATION.TOAST.EDIT_CREW_SUCCESS, "success");
      } else {
        await createCrewMutation.mutateAsync({
          name: data.name.trim(),
          email: data.email?.trim() || undefined,
          photo: crewPhotoInput,
        });
        showToast(LOCALIZATION.TOAST.ADD_CREW_SUCCESS, "success");
      }

      router.push("/admin/crew");
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : LOCALIZATION.ERRORS.SAVE;
      showToast(errMsg, "error");
      console.error(err);
    } finally {
      setIsSavingLocal(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-brand selection:text-black pb-20">
      <main className="max-w-xl mx-auto w-full px-6 md:px-8 pt-28 space-y-8 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent flex items-center gap-2">
            <PeopleIcon className="text-brand" />{" "}
            {editingCrew ? "แก้ไขข้อมูลทีมงาน" : "สร้างข้อมูลทีมงานใหม่"}
          </h1>
          <p className="text-xs text-zinc-400 font-light">
            ระบุชื่อตัวตน
            อัปโหลดรูปภาพใบหน้าประจำตัวสำหรับใช้แสดงผลในทำเนียบทีมงานภาพยนตร์สั้น
          </p>
        </div>

        <div className="bg-card border border-zinc-800/35 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-md">
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-5">
            <Input
              label="ชื่อ-นามสกุล"
              placeholder="เช่น สมชาย ใจดี"
              error={errors.name?.message}
              {...register("name", {
                required: "กรุณาระบุชื่อทีมงานหรือนักแสดง",
              })}
            />

            <Input
              label="อีเมล (ถ้ามีบัญชีในระบบ)"
              placeholder="ระบุอีเมลเพื่อเชื่อมโยงกับบัญชีผู้ใช้..."
              error={errors.email?.message}
              type="email"
              {...register("email")}
            />

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">
                รูปภาพประจำตัว
              </label>

              <div className="relative group/file">
                <Controller
                  name="photo"
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        if (file) {
                          setRawCrewFile(file);
                          setCropImageSrc(URL.createObjectURL(file));
                          setIsCropModalOpen(true);
                          e.target.value = "";
                        }
                      }}
                    />
                  )}
                />

                <div className="w-full bg-black/40 border border-zinc-800 group-hover/file:border-brand rounded-xl px-4 py-3 text-sm text-zinc-450 flex items-center justify-between transition-colors">
                  <span
                    className={
                      crewPhotoName
                        ? "text-white font-medium truncate max-w-[70%]"
                        : "text-zinc-400"
                    }
                  >
                    {crewPhotoName || "เลือกรูปภาพประจำตัว..."}
                  </span>
                  <span className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-lg text-xs font-semibold group-hover/file:bg-brand group-hover/file:text-white transition-colors">
                    เลือกไฟล์
                  </span>
                </div>
              </div>

              {crewPhotoPreview && (
                <div className="flex items-center gap-4 mt-4 pl-1">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border border-zinc-850 bg-black/40 shadow-inner group/crewpreview flex-shrink-0">
                    <img
                      src={crewPhotoPreview}
                      alt="Crew Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setCrewPhotoInput(null);
                        setCrewPhotoName(null);
                        setCrewPhotoPreview(
                          editingCrew ? editingCrew.photoUrl || null : null,
                        );
                      }}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover/crewpreview:opacity-100 transition-opacity flex items-center justify-center text-red-500 cursor-pointer border-0 rounded-none p-0 h-auto"
                    >
                      <CloseIcon className="text-sm text-white" />
                    </button>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-zinc-300 font-semibold">
                      รูปภาพประจำตัวที่ใช้
                    </span>
                    <span className="text-[10px] text-zinc-500 leading-relaxed mt-0.5">
                      {crewPhotoName ? "รูปภาพหลังแก้ไข" : "รูปภาพปัจจุบัน"}
                    </span>
                    {crewPhotoName && rawCrewFile && (
                      <button
                        type="button"
                        onClick={() => {
                          setCropImageSrc(URL.createObjectURL(rawCrewFile));
                          setIsCropModalOpen(true);
                        }}
                        className="text-[10px] text-brand hover:underline font-semibold w-fit text-left mt-1 cursor-pointer border-0 bg-transparent p-0 h-auto hover:bg-transparent"
                      >
                        แก้ไขรูปภาพอีกครั้ง
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-zinc-800/40 flex items-center gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push("/")}
                className="flex-1 py-3 text-sm font-semibold rounded-xl"
              >
                ยกเลิก
              </Button>
              <Button
                type="submit"
                className="flex-1 py-3 text-sm font-semibold rounded-xl"
              >
                {editingCrew ? "บันทึกการแก้ไข" : "เพิ่มรายชื่อ"}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <ImageCropper
        isOpen={isCropModalOpen}
        imageSrc={cropImageSrc}
        fileName={rawCrewFile?.name}
        onClose={() => {
          setIsCropModalOpen(false);
          setRawCrewFile(null);
          setCropImageSrc(null);
        }}
        onConfirm={(croppedFile, previewUrl) => {
          setCrewPhotoInput(croppedFile);
          setCrewPhotoName(croppedFile.name);
          setCrewPhotoPreview(previewUrl);
          setIsCropModalOpen(false);
        }}
      />

      {isSavingLocal && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-zinc-800/60" />
              <div className="absolute inset-0 rounded-full border-4 border-brand border-t-transparent animate-spin" />
            </div>
            <div className="space-y-1.5 text-center">
              <h3 className="text-xl font-bold tracking-wide text-white">
                {editingCrew
                  ? LOCALIZATION.LOADING.SAVE_CREW
                  : LOCALIZATION.LOADING.SAVE_CREW}
              </h3>
              <p className="text-xs text-zinc-400 font-light">
                {editingCrew
                  ? LOCALIZATION.LOADING.SUB_SAVE_CREW
                  : LOCALIZATION.LOADING.SUB_SAVE_CREW}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
