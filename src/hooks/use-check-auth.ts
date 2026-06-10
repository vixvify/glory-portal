import { useEffect } from "react";
import { authService } from "@/infra/container";
import { useAppStore } from "@/store/use-store";

export function useCheckAuth() {
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((user) => setCurrentUser(user))
      .catch(() => setCurrentUser(null));
  }, [setCurrentUser]);
}
