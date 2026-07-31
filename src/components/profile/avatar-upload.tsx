"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import PersonIcon from "@mui/icons-material/Person";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useUpdateProfileMutation } from "@/hooks/db/use-profile";
import { useAppStore } from "@/store/use-store";
import { PROFILE_MESSAGES } from "@/core/constants/profile-messages";
import { COMMON_MESSAGES } from "@/core/constants/common-messages";
import { UPLOAD_LIMITS } from "@/core/constants/upload";
import imageCompression from "browser-image-compression";

interface AvatarUploadProps {
  photoUrl?: string | null;
  name: string;
  isOwner: boolean;
}

export function AvatarUpload({ photoUrl, name, isOwner }: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { mutateAsync: updateProfile, isPending } = useUpdateProfileMutation();
  const { showToast } = useAppStore();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      !(UPLOAD_LIMITS.AVATAR.ALLOWED_TYPES as readonly string[]).includes(
        file.type,
      )
    ) {
      showToast(PROFILE_MESSAGES.TOAST.INVALID_IMAGE_TYPE, "error");
      return;
    }

    if (file.size > UPLOAD_LIMITS.AVATAR.SIZE_BYTES) {
      showToast(PROFILE_MESSAGES.TOAST.AVATAR_SIZE_LIMIT, "error");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      showToast(PROFILE_MESSAGES.TOAST.UPLOADING_AVATAR, "success");
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);

      const finalFile = new File([compressedFile], file.name, {
        type: compressedFile.type || file.type,
      });

      await updateProfile({ photo: finalFile });
      showToast(PROFILE_MESSAGES.TOAST.UPLOAD_AVATAR_SUCCESS, "success");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : COMMON_MESSAGES.ERRORS.SAVE;
      showToast(errorMessage, "error");
    } finally {
      setPreviewUrl(null);
      URL.revokeObjectURL(objectUrl);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleCameraClick = () => {
    if (!isOwner || isPending) return;
    fileInputRef.current?.click();
  };

  const displayUrl = previewUrl || photoUrl;

  return (
    <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full p-1 bg-background shrink-0 group">
      <div className="w-full h-full rounded-full bg-zinc-900 overflow-hidden flex items-center justify-center relative">
        {displayUrl ? (
          <Image
            src={displayUrl}
            alt={name}
            fill
            className={`object-cover transition-opacity ${
              isPending ? "opacity-50" : "opacity-100"
            }`}
            unoptimized
          />
        ) : (
          <PersonIcon className="text-zinc-600 text-7xl" />
        )}
      </div>

      {isOwner && (
        <>
          <button
            onClick={handleCameraClick}
            disabled={isPending}
            className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-zinc-800 border-2 border-background text-white flex items-center justify-center hover:bg-brand hover:text-black transition-colors z-10 shadow-lg disabled:opacity-50"
            title="เปลี่ยนรูปโปรไฟล์"
          >
            {isPending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <PhotoCameraIcon className="text-xl" />
            )}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
          />
        </>
      )}
    </div>
  );
}
