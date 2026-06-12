"use client";

import { useAppStore } from "@/store/use-store";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import CloseIcon from "@mui/icons-material/Close";

export function Toast() {
  const { toast, hideToast } = useAppStore();

  if (!toast?.isVisible) return null;

  const icons = {
    success: <CheckCircleIcon className="text-emerald-400 text-xl" />,
    error: <CancelIcon className="text-red-400 text-xl" />,
    info: <InfoIcon className="text-blue-400 text-xl" />,
    warning: <WarningIcon className="text-amber-400 text-xl" />,
  };

  const borderColors = {
    success: "border-emerald-500/20",
    error: "border-red-500/20",
    info: "border-blue-500/20",
    warning: "border-amber-500/20",
  };

  return (
    <div
      className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 max-w-sm px-4 py-3 rounded-xl border bg-zinc-950/80 backdrop-blur-md shadow-2xl transition-all duration-300 ${
        borderColors[toast.type]
      } ${
        toast.isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 -translate-y-4 scale-95 pointer-events-none"
      }`}
    >
      <div className="relative z-10 flex-shrink-0">{icons[toast.type]}</div>

      <div className="relative z-10 flex-grow pr-2">
        <p className="text-sm font-semibold text-white/95 tracking-wide">
          {toast.message}
        </p>
      </div>

      <button
        onClick={hideToast}
        className="relative z-10 flex-shrink-0 p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/50 active:scale-95 transition-all cursor-pointer"
      >
        <CloseIcon className="text-base" />
      </button>
    </div>
  );
}
