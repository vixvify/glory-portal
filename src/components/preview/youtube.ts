"use client";

import { getYouTubeId } from "@/utils/youtube";

interface YoutubePreviewProps {
  url?: string;
  maxWidthClass?: string;
}

export default function YoutubePreview({
  url,
  maxWidthClass = "max-w-md",
}: YoutubePreviewProps) {
  if (!url) return null;
  const ytid = getYouTubeId(url);

  if (!ytid) {
    return url.trim() ? (
      <p className="text-[10px] text-zinc-500 pl-1">ลิงก์ YouTube ไม่ถูกต้อง</p>
    ) : null;
  }

  return (
    <div
      className={`mt-2 relative rounded-2xl overflow-hidden border border-zinc-800 bg-black/50 aspect-[16/9] w-full ${maxWidthClass} shadow-lg shadow-black/50 transition-all hover:border-brand/30`}
    >
      <iframe
        src={`https://www.youtube.com/embed/${ytid}`}
        title="YouTube Preview"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}