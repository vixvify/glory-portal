"use client";

import { useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { getYouTubeEmbedUrl } from "@/utils/youtube";

interface PlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  youtubeUrl: string;
  movieTitle: string;
}

export default function PlayerModal({
  isOpen,
  onClose,
  youtubeUrl,
  movieTitle,
}: PlayerModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const embedUrl = getYouTubeEmbedUrl(youtubeUrl);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-10 bg-black/85 backdrop-blur-md animate-fade-in transition-all duration-300">
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      <div className="relative w-full max-w-5xl bg-[#181818] rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 animate-scale-up z-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-[#181818]">
          <h3 className="text-lg font-bold text-white tracking-wide">
            {movieTitle}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all duration-200 cursor-pointer"
          >
            <CloseIcon className="text-2xl" />
          </button>
        </div>

        <div className="relative w-full pb-[56.25%] bg-black">
          <iframe
            src={embedUrl}
            title={movieTitle}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
