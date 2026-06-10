import { create } from "zustand";
import { User } from "@/core/domain/user";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  message: string;
  type: ToastType;
  isVisible: boolean;
}

interface AppState {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  toast: Toast | null;
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const useAppStore = create<AppState>()((set) => ({
  currentUser: null,
  toast: null,
  searchQuery: "",

  setCurrentUser: (user) => set({ currentUser: user }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  showToast: (message, type = "success") => {
    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    set({
      toast: {
        message,
        type,
        isVisible: true,
      },
    });

    toastTimer = setTimeout(() => {
      set((state) => ({
        toast: state.toast ? { ...state.toast, isVisible: false } : null,
      }));
      toastTimer = null;
    }, 4000);
  },

  hideToast: () => {
    if (toastTimer) {
      clearTimeout(toastTimer);
      toastTimer = null;
    }
    set((state) => ({
      toast: state.toast ? { ...state.toast, isVisible: false } : null,
    }));
  },
}));
