"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useUpdateProfileMutation } from "@/hooks/db/use-profile";
import { useAppStore } from "@/store/use-store";
import { LOCALIZATION } from "@/core/constants/localization";
import imageCompression from "browser-image-compression";

interface CoverUploadProps {
  coverUrl?: string | null;
  fallbackPhotoUrl?: string | null;
  isOwner: boolean;
}

export function CoverUpload({ coverUrl, fallbackPhotoUrl, isOwner }: CoverUploadProps) {
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

    // Validate size (e.g., max 10MB for cover before compression)
    if (file.size > 10 * 1024 * 1024) {
      showToast("ขนาดรูปภาพหน้าปกต้องไม่เกิน 10MB", "error");
      return;
    }

    // Show preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      showToast("กำลังบีบอัดและอัปโหลดภาพปก...", "success");
      const options = {
        maxSizeMB: 0.5, // 500KB for cover
        maxWidthOrHeight: 1920, // 1080p
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);

      // Force cast to File to prevent "[object Blob]" validation error on the backend
      const finalFile = new File([compressedFile], file.name, {
        type: compressedFile.type || file.type,
      });

      await updateProfile({ coverPhoto: finalFile });
      showToast("อัปเดตภาพปกเรียบร้อยแล้ว", "success");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : LOCALIZATION.ERRORS.SAVE;
      showToast(errorMessage, "error");
    } finally {
      // Clear preview to fall back to the real coverUrl from global store
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

  const displayUrl = previewUrl || coverUrl;

  return (
    <div className="relative w-full h-full group">
      {displayUrl ? (
        <Image
          src={displayUrl}
          alt="Cover"
          fill
          className={`object-cover transition-opacity duration-300 ${
            isPending ? "opacity-50" : "opacity-70 group-hover:opacity-80"
          }`}
          unoptimized
        />
      ) : fallbackPhotoUrl ? (
        <Image
          src={fallbackPhotoUrl}
          alt="Cover Placeholder"
          fill
          className="object-cover opacity-40 blur-2xl grayscale transition-opacity duration-300 group-hover:opacity-50 group-hover:blur-xl"
          unoptimized
        />
      ) : (
        <div className="w-full h-full bg-zinc-900" />
      )}

      {isOwner && (
        <>
          <button
            onClick={handleCameraClick}
            disabled={isPending}
            className="absolute bottom-4 right-4 md:bottom-6 md:right-8 w-12 h-12 rounded-full bg-black/60 hover:bg-brand hover:text-black border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-colors z-20 shadow-lg disabled:opacity-50"
            title="เปลี่ยนภาพปก"
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
