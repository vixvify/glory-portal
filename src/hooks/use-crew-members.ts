import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { crewMemberService } from "@/infra/container";
import {
  CrewMember,
  CreateCrewMember,
  UpdateCrewMember,
  CrewFilterParams,
} from "@/core/domain/movie";

export function useCrewMembersQuery(params?: CrewFilterParams) {
  return useQuery<CrewMember[], Error>({
    queryKey: params ? ["crewMembers", params] : ["crewMembers"],
    queryFn: () => crewMemberService.getCrewMembers(params),
  });
}

export function useCreateCrewMemberMutation() {
  const queryClient = useQueryClient();
  return useMutation<CrewMember, Error, CreateCrewMember>({
    mutationFn: (crewMember) => crewMemberService.createCrewMember(crewMember),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crewMembers"] });
    },
  });
}

export function useUpdateCrewMemberMutation() {
  const queryClient = useQueryClient();
  return useMutation<
    CrewMember,
    Error,
    { id: string; crewMember: UpdateCrewMember }
  >({
    mutationFn: ({ id, crewMember }) =>
      crewMemberService.updateCrewMember(id, crewMember),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crewMembers"] });
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
  });
}

export function useDeleteCrewMemberMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => crewMemberService.deleteCrewMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crewMembers"] });
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
  });
}
