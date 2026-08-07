"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useUpdateProfileMutation } from "@/hooks/db/use-profile";
import { useAppStore } from "@/store/use-store";
import { PROFILE_MESSAGES } from "@/core/constants/profile-messages";
import { COMMON_MESSAGES } from "@/core/constants/common-messages";
import { UPLOAD_LIMITS } from "@/core/constants/upload";
import imageCompression from "browser-image-compression";
import { ConfirmModal } from "@/components/modal/confirm-modal";

interface CoverUploadProps {
  coverUrl?: string | null;
  fallbackPhotoUrl?: string | null;
  isOwner: boolean;
}

export function CoverUpload({
  coverUrl,
  fallbackPhotoUrl,
  isOwner,
}: CoverUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { mutateAsync: updateProfile, isPending } = useUpdateProfileMutation();
  const { showToast } = useAppStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      !(UPLOAD_LIMITS.COVER.ALLOWED_TYPES as readonly string[]).includes(
        file.type,
      )
    ) {
      showToast(PROFILE_MESSAGES.TOAST.INVALID_IMAGE_TYPE, "error");
      return;
    }

    if (file.size > UPLOAD_LIMITS.COVER.SIZE_BYTES) {
      showToast(PROFILE_MESSAGES.TOAST.COVER_SIZE_LIMIT, "error");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setPendingFile(file);
    setIsConfirmOpen(true);
  };

  const handleConfirmCover = async () => {
    if (!pendingFile) return;
    setIsConfirmOpen(false);

    try {
      showToast(PROFILE_MESSAGES.TOAST.UPLOADING_COVER, "success");
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(pendingFile, options);

      const finalFile = new File([compressedFile], pendingFile.name, {
        type: compressedFile.type || pendingFile.type,
      });

      await updateProfile({ coverPhoto: finalFile });
      showToast(PROFILE_MESSAGES.TOAST.UPLOAD_COVER_SUCCESS, "success");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : COMMON_MESSAGES.ERRORS.SAVE;
      showToast(errorMessage, "error");
    } finally {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
      setPendingFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleCameraClick = () => {
    if (!isOwner || isPending) return;
    fileInputRef.current?.click();
  };

  const displayUrl = (isPending && previewUrl) ? previewUrl : coverUrl;

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
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setPendingFile(null);
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
          }
          setPreviewUrl(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }}
        onConfirm={handleConfirmCover}
        title={PROFILE_MESSAGES.CONFIRM.UPDATE_COVER_TITLE}
        message={PROFILE_MESSAGES.CONFIRM.UPDATE_COVER_MSG}
        confirmText={PROFILE_MESSAGES.CONFIRM.UPDATE_COVER_BTN}
        cancelText={COMMON_MESSAGES.CONFIRM.CANCEL}
        iconType="cover-preview"
        previewUrl={previewUrl || undefined}
      />
    </div>
  );
}
