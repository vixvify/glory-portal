import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/infra/container";
import { AdminStats } from "@/core/domain/admin";

export function useAdminStatsQuery() {
  return useQuery<AdminStats, Error>({
    queryKey: ["admin-stats"],
    queryFn: () => adminService.getStats(),
  });
}
