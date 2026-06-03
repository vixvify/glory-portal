import { create } from "zustand";
import { User } from "@/core/domain/user";
import { authService } from "@/infra/container";

interface AppState {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;

  toast: {
    message: string;
    type: "success" | "error" | "info" | "warning";
    isVisible: boolean;
  } | null;

  showToast: (
    message: string,
    type?: "success" | "error" | "info" | "warning",
  ) => void;

  hideToast: () => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useAppStore = create<AppState>()((set, get) => ({
  currentUser: null,
  toast: null,
  searchQuery: "",

  setCurrentUser: (user) => set({ currentUser: user }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  checkAuth: async () => {
    try {
      const user = await authService.getCurrentUser();
      set({ currentUser: user });
    } catch (error) {
      console.error("Auth check failed, removing stale user session:", error);
      set({ currentUser: null });
    }
  },

  showToast: (message, type = "success") => {
    set({
      toast: {
        message,
        type,
        isVisible: true,
      },
    });

    setTimeout(() => {
      get().hideToast();
    }, 4000);
  },

  hideToast: () => {
    const currentToast = get().toast;

    if (currentToast) {
      set({
        toast: {
          ...currentToast,
          isVisible: false,
        },
      });
    }
  },
}));
