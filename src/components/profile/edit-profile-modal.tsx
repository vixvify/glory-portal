import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { User, UpdateProfile } from "@/core/domain/user";
import { useAppStore } from "@/store/use-store";
import { PROFILE_MESSAGES } from "@/core/constants/profile-messages";
import { Button } from "@/components/ui/button";
import CloseIcon from "@mui/icons-material/Close";
import { useUpdateProfileMutation } from "@/hooks/db/use-profile";
import { useCrewRolesQuery } from "@/hooks/db/use-master-data";
import { TagInput } from "@/components/ui/tag-input";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}

export function EditProfileModal({
  isOpen,
  onClose,
  currentUser,
}: EditProfileModalProps) {
  const { showToast } = useAppStore();
  const updateProfileMutation = useUpdateProfileMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: crewRolesData = [] } = useCrewRolesQuery();
  const crewRoleSuggestions = crewRolesData.map(
    (role) => role.labelTh || role.name,
  );

  const defaultPositions = currentUser.positions || [];

  const defaultBirthday = currentUser.birthday
    ? new Date(currentUser.birthday).toISOString().split("T")[0]
    : "";

  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      name: currentUser.name || "",
      bio: currentUser.bio || "",
      positions: defaultPositions,
      birthday: defaultBirthday,
      ig: currentUser.ig || "",
      facebook: currentUser.facebook || "",
      youtube: currentUser.youtube || "",
      tiktok: currentUser.tiktok || "",
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: UpdateProfile) => {
    try {
      setIsSubmitting(true);

      const payload: UpdateProfile = {
        name: data.name,
        bio: data.bio,
        positions: data.positions || [],
        birthday: data.birthday ? data.birthday : undefined,
        ig: data.ig,
        facebook: data.facebook,
        youtube: data.youtube,
        tiktok: data.tiktok,
      };

      await updateProfileMutation.mutateAsync(payload);
      showToast(PROFILE_MESSAGES.TOAST.UPDATE_PROFILE_SUCCESS, "success");
      onClose();
    } catch {
      showToast(PROFILE_MESSAGES.ERRORS.UPDATE_PROFILE, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-card border border-theme-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-theme-border bg-card-secondary/50">
          <h2 className="text-xl font-bold text-white">แก้ไขข้อมูลโปรไฟล์</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-zinc-700">
          <form
            id="edit-profile-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div>
              <h3 className="text-sm font-semibold text-brand mb-4 uppercase tracking-wider">
                ข้อมูลพื้นฐาน
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">
                    ชื่อ-นามสกุล / นามแฝง
                  </label>
                  <input
                    {...register("name")}
                    type="text"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors"
                    placeholder="ระบุชื่อของคุณ"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">
                    วันเกิด
                  </label>
                  <input
                    {...register("birthday")}
                    type="date"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">
                    ตำแหน่งประจำ
                  </label>
                  <Controller
                    control={control}
                    name="positions"
                    render={({ field: { value, onChange } }) => (
                      <TagInput
                        value={value}
                        onChange={onChange}
                        suggestions={crewRoleSuggestions}
                        placeholder="พิมพ์เพื่อค้นหา หรือเพิ่มตำแหน่งใหม่..."
                      />
                    )}
                  />
                  <p className="text-xs text-zinc-500 mt-1">
                    กด Enter เพื่อเพิ่มตำแหน่งใหม่ หากไม่พบในระบบ
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/50">
              <h3 className="text-sm font-semibold text-brand mb-4 uppercase tracking-wider">
                เกี่ยวกับฉัน
              </h3>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  ประวัติส่วนตัว (Bio)
                </label>
                <textarea
                  {...register("bio")}
                  rows={4}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors resize-none"
                  placeholder="เขียนแนะนำตัวของคุณ หรือผลงานที่ภาคภูมิใจ..."
                />
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/50">
              <h3 className="text-sm font-semibold text-brand mb-4 uppercase tracking-wider">
                ช่องทางการติดต่อ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">
                    Instagram (Username)
                  </label>
                  <input
                    {...register("ig")}
                    type="text"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors"
                    placeholder="เช่น john_doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">
                    Facebook (URL หรือ ชื่อ)
                  </label>
                  <input
                    {...register("facebook")}
                    type="text"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors"
                    placeholder="เช่น https://facebook.com/johndoe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">
                    YouTube (URL หรือ Channel)
                  </label>
                  <input
                    {...register("youtube")}
                    type="text"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors"
                    placeholder="เช่น https://youtube.com/@johndoe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">
                    TikTok (Username หรือ URL)
                  </label>
                  <input
                    {...register("tiktok")}
                    type="text"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors"
                    placeholder="เช่น @johndoe"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl border-zinc-700 bg-transparent text-white hover:bg-zinc-800"
          >
            ยกเลิก
          </Button>
          <Button
            type="submit"
            form="edit-profile-form"
            variant="brand"
            disabled={isSubmitting}
            className="rounded-xl px-8 font-bold"
          >
            {isSubmitting ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
          </Button>
        </div>
      </div>
    </div>
  );
}
