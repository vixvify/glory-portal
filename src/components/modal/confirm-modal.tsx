import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import MovieIcon from "@mui/icons-material/Movie";
import PersonIcon from "@mui/icons-material/Person";
import { Button } from "../ui/button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "brand" | "danger";
  iconType?: "movie" | "crew" | "delete" | "delete-crew";
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "ยืนยัน",
  cancelText = "ยกเลิก",
  variant = "brand",
  iconType,
}) => {
  if (!isOpen) return null;

  const renderIcon = () => {
    if (iconType === "movie") {
      return (
        <div className="w-16 h-16 bg-brand/10 border border-brand/20 text-brand rounded-full flex items-center justify-center mx-auto text-2xl">
          <MovieIcon />
        </div>
      );
    }
    if (iconType === "crew") {
      return (
        <div className="w-16 h-16 bg-brand/10 border border-brand/20 text-brand rounded-full flex items-center justify-center mx-auto text-2xl">
          <PersonIcon />
        </div>
      );
    }
    return (
      <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto text-2xl">
        <DeleteIcon />
      </div>
    );
  };

  const confirmBtnStyles =
    variant === "danger"
      ? "bg-red-500 hover:bg-red-600 text-white border-0 shadow-sm"
      : "bg-brand hover:bg-brand-hover text-white border-0 shadow-sm";

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center animate-fade-in bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-zinc-800/60 p-6 md:p-8 rounded-2xl max-w-sm w-full text-center space-y-6 shadow-2xl relative animate-scale-up">
        {renderIcon()}

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-light">
            {message}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1 py-2.5 text-xs font-semibold rounded-xl"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-xl ${confirmBtnStyles}`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
