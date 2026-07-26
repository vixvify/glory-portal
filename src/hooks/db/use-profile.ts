import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/infra/container";
import { UpdateProfile, User } from "@/core/domain/user";
import { useAppStore } from "@/store/use-store";

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  const { setCurrentUser } = useAppStore();

  return useMutation<User, Error, UpdateProfile>({
    mutationFn: async (data: UpdateProfile) => {
      return await authService.updateProfile(data);
    },
    onSuccess: (updatedUser) => {
      // Update global store
      setCurrentUser(updatedUser);
      // Invalidate relevant queries if necessary
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}
