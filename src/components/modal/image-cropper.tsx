import React, { useState } from "react";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "../ui/button";
import { LOCALIZATION } from "@/core/constants/localization";

interface ImageCropperProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onConfirm: (croppedFile: File, previewUrl: string) => void;
  fileName?: string;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onConfirm,
  fileName = "cropped-image.jpg",
}) => {
  const [imgNaturalSize, setImgNaturalSize] = useState({ w: 0, h: 0 });
  const [imgBaseScale, setImgBaseScale] = useState(1.0);
  const [zoom, setZoom] = useState(1.0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  if (!isOpen || !imageSrc) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    applyConstrainedOffset(newX, newY, zoom);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.x;
    const newY = touch.clientY - dragStart.y;
    applyConstrainedOffset(newX, newY, zoom);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const applyConstrainedOffset = (
    x: number,
    y: number,
    currentZoom: number,
  ) => {
    const W_rendered = imgNaturalSize.w * imgBaseScale * currentZoom;
    const H_rendered = imgNaturalSize.h * imgBaseScale * currentZoom;
    const limitX = Math.max(0, (W_rendered - 260) / 2);
    const limitY = Math.max(0, (H_rendered - 260) / 2);

    setOffset({
      x: Math.max(-limitX, Math.min(limitX, x)),
      y: Math.max(-limitY, Math.min(limitY, y)),
    });
  };

  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
    applyConstrainedOffset(offset.x, offset.y, newZoom);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    setImgNaturalSize({ w, h });

    const cropBoxSize = 260;
    const baseScale = Math.max(cropBoxSize / w, cropBoxSize / h);
    setImgBaseScale(baseScale);
    setZoom(1.0);
    setOffset({ x: 0, y: 0 });
  };

  const handleCropConfirm = () => {
    const img = new window.Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, 300, 300);

      const scaleMultiplier = 300 / 260;
      const W_rendered =
        imgNaturalSize.w * imgBaseScale * zoom * scaleMultiplier;
      const H_rendered =
        imgNaturalSize.h * imgBaseScale * zoom * scaleMultiplier;
      const drawX = 150 - W_rendered / 2 + offset.x * scaleMultiplier;
      const drawY = 150 - H_rendered / 2 + offset.y * scaleMultiplier;

      ctx.drawImage(img, drawX, drawY, W_rendered, H_rendered);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const croppedFile = new File([blob], fileName, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            const previewUrl = URL.createObjectURL(croppedFile);
            onConfirm(croppedFile, previewUrl);
          }
        },
        "image/jpeg",
        0.9,
      );
    };
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center animate-fade-in bg-black/80 backdrop-blur-md p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 md:p-8 space-y-6 shadow-2xl relative animate-scale-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-855 text-zinc-400 hover:text-white transition-colors cursor-pointer border-0 bg-transparent"
        >
          <CloseIcon />
        </button>

        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">
            {LOCALIZATION.CROP.TITLE}
          </h3>
          <p className="text-xs text-zinc-400">
            {LOCALIZATION.CROP.SUBTITLE}
          </p>
        </div>

        <div
          className="relative w-full aspect-square bg-black border border-zinc-800 rounded-xl overflow-hidden cursor-move select-none flex items-center justify-center"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          <Image
            src={imageSrc}
            alt="To Crop"
            className="absolute max-w-none origin-center pointer-events-none"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom * imgBaseScale})`,
              width: `${imgNaturalSize.w}px`,
              height: `${imgNaturalSize.h}px`,
              transition: isDragging ? "none" : "transform 0.1s ease-out",
            }}
            onLoad={handleImageLoad}
            width={imgNaturalSize.w || 100}
            height={imgNaturalSize.h || 100}
            unoptimized
          />

          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-full h-full bg-black/60 relative">
              <div className="absolute top-1/2 left-1/2 w-[260px] h-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand ring-[999px] ring-black/70 shadow-[0_0_0_1px_rgba(255,255,255,0.2)]" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-zinc-400 font-semibold">
            <span>{LOCALIZATION.CROP.ZOOM}</span>
            <span>{Math.round(zoom * 100)}%</span>
          </div>
          <input
            type="range"
            min="1"
            max="3"
            step="0.05"
            value={zoom}
            onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1 py-2.5 text-xs font-semibold rounded-xl"
          >
            {LOCALIZATION.CROP.CANCEL}
          </Button>
          <Button
            type="button"
            onClick={handleCropConfirm}
            className="flex-1 py-2.5 text-xs font-semibold rounded-xl bg-brand hover:bg-brand-hover text-white border-0"
          >
            {LOCALIZATION.CROP.CONFIRM}
          </Button>
        </div>
      </div>
    </div>
  );
};
