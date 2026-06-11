import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/infra/container";
import { RegisterUser, LoginUser, User } from "@/core/domain/user";
import { useAppStore } from "@/store/use-store";
import { useRouter } from "next/navigation";

export function useRegisterMutation() {
  const { showToast } = useAppStore();

  return useMutation<User, Error, RegisterUser>({
    mutationFn: (data) => authService.register(data),
    onSuccess: () => {
      showToast(
        "ลงทะเบียนสำเร็จแล้ว! กรุณาเข้าสู่ระบบเพื่อเข้าใช้งาน.",
        "success",
      );
    },
  });
}

export function useLoginMutation() {
  const { setCurrentUser, showToast } = useAppStore();
  const queryClient = useQueryClient();

  return useMutation<User, Error, LoginUser>({
    mutationFn: (data) => authService.login(data),
    onSuccess: (user) => {
      setCurrentUser(user);
      showToast("เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับกลับ.", "success");
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

export function useLogoutMutation() {
  const { setCurrentUser, showToast } = useAppStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<void, Error, void>({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      setCurrentUser(null);
      showToast("ออกจากระบบสำเร็จ", "info");
      queryClient.clear();
      router.push("/auth/login");
    },
  });
}

