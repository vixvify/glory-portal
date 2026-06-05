"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PeopleIcon from "@mui/icons-material/People";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
};

export const CrewForm: React.FC<CrewFormProps> = ({ editingCrew = null }) => {
  const router = useRouter();
  const { showToast } = useAppStore();
  const [isSavingLocal, setIsSavingLocal] = useState(false);

  const createCrewMutation = useCreateCrewMemberMutation();
  const updateCrewMutation = useUpdateCrewMemberMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CrewFormInputs>();

  useEffect(() => {
    if (editingCrew) {
      reset({
        name: editingCrew.name,
        email: editingCrew.email || "",
      });
    } else {
      reset({
        name: "",
        email: "",
      });
    }
  }, [editingCrew, reset]);

  const onSubmitForm = async (data: CrewFormInputs) => {
    try {
      setIsSavingLocal(true);

      if (editingCrew) {
        await updateCrewMutation.mutateAsync({
          id: editingCrew.id,
          name: data.name.trim(),
          email: data.email?.trim() || null,
        });
        showToast(LOCALIZATION.TOAST.EDIT_CREW_SUCCESS, "success");
      } else {
        await createCrewMutation.mutateAsync({
          name: data.name.trim(),
          email: data.email?.trim() || undefined,
        });
        showToast(LOCALIZATION.TOAST.ADD_CREW_SUCCESS, "success");
      }

      router.push("/");
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
            ระบุชื่อตัวตน และอีเมลผู้ใช้ระบบ (ถ้ามี) เพื่อเชื่อมโยงกับบัญชีผู้ใช้
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

            {editingCrew?.user?.photoUrl && (
              <div className="flex items-center gap-4 mt-4 pl-1">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border border-zinc-855 bg-black/40 shadow-inner flex-shrink-0 animate-fade-in">
                  <img
                    src={editingCrew.user.photoUrl}
                    alt="Crew Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-300 font-semibold">
                    รูปภาพประจำตัว
                  </span>
                  <span className="text-[10px] text-zinc-555 leading-relaxed mt-0.5">
                    ดึงข้อมูลจากบัญชีผู้ใช้
                  </span>
                </div>
              </div>
            )}

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
