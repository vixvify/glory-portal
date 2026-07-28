"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import PersonIcon from "@mui/icons-material/Person";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useUpdateProfileMutation } from "@/hooks/db/use-profile";
import { useAppStore } from "@/store/use-store";
import { LOCALIZATION } from "@/core/constants/localization";
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

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      showToast("รองรับเฉพาะไฟล์รูปภาพ (JPG, PNG, WEBP, GIF) เท่านั้น", "error");
      return;
    }

    // Validate size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast("ขนาดรูปภาพต้องไม่เกิน 5MB", "error");
      return;
    }

    // Show preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      showToast("กำลังบีบอัดและอัปโหลดรูปภาพ...", "success");
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);

      // Force cast to File to prevent "[object Blob]" validation error on the backend
      const finalFile = new File([compressedFile], file.name, {
        type: compressedFile.type || file.type,
      });

      await updateProfile({ photo: finalFile });
      showToast("อัปเดตรูปโปรไฟล์เรียบร้อยแล้ว", "success");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : LOCALIZATION.ERRORS.SAVE;
      showToast(errorMessage, "error");
    } finally {
      // Clear preview to fall back to the real photoUrl from global store
      setPreviewUrl(null);
      // Clean up the object URL to avoid memory leaks
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
    <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full p-1 bg-[#0d0d0d] shrink-0 group">
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
            className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-zinc-800 border-2 border-[#0d0d0d] text-white flex items-center justify-center hover:bg-brand hover:text-black transition-colors z-10 shadow-lg disabled:opacity-50"
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
