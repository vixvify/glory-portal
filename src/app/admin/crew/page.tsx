"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PeopleIcon from "@mui/icons-material/People";
import { useAppStore } from "@/store/use-store";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { CrewTable } from "@/components/ui/crew-table";
import { ConfirmModal } from "@/components/modal/confirm-modal";
import { useMoviesQuery } from "@/hooks/use-movies";
import {
  useCrewMembersQuery,
  useDeleteCrewMemberMutation,
} from "@/hooks/use-crew-members";
import { useDebounce } from "@/hooks/use-debounce";
import { LOCALIZATION } from "@/core/constants/localization";

export default function AdminCrewPage() {
  const router = useRouter();
  const [crewSearchQuery, setCrewSearchQuery] = useState("");
  const { showToast } = useAppStore();

  const [deleteCrewId, setDeleteCrewId] = useState<string | null>(null);
  const [isDeletingLocal, setIsDeletingLocal] = useState(false);

  const activeCrewSearchQuery = useDebounce(crewSearchQuery, 200);

  const crewParams = useMemo(() => {
    if (activeCrewSearchQuery.trim()) {
      return { search: activeCrewSearchQuery.trim() };
    }
    return undefined;
  }, [activeCrewSearchQuery]);

  const { data: availableCrew = [], isLoading: isCrewLoading } =
    useCrewMembersQuery(crewParams);
  console.log(availableCrew);
  const { data: movies = [], isLoading: isMoviesLoading } = useMoviesQuery();

  const deleteCrewMutation = useDeleteCrewMemberMutation();

  const isInitialLoading =
    isCrewLoading && availableCrew.length === 0 && !crewSearchQuery.trim();
  const isSearchingCrew =
    crewSearchQuery.trim() !== activeCrewSearchQuery.trim() || isCrewLoading;

  const handleDeleteConfirm = async () => {
    if (deleteCrewId) {
      try {
        setIsDeletingLocal(true);
        await deleteCrewMutation.mutateAsync(deleteCrewId);
        showToast(LOCALIZATION.TOAST.DELETE_CREW_SUCCESS, "success");
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : LOCALIZATION.ERRORS.DELETE;
        showToast(errorMessage, "error");
      } finally {
        setIsDeletingLocal(false);
        setDeleteCrewId(null);
      }
    }
  };

  if (isInitialLoading || isMoviesLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-brand selection:text-black pb-20">
      <main className="max-w-7xl mx-auto w-full px-6 md:px-16 pt-28 space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Link
                href="/admin"
                className="hover:text-brand transition-colors flex items-center gap-1"
              >
                <ArrowBackIcon className="text-sm" /> ระบบจัดการหลังบ้าน
              </Link>
              <span>/</span>
              <span className="text-zinc-300">ระบบจัดการข้อมูลทีมงาน</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent flex items-center gap-2">
              <PeopleIcon className="text-brand" />{" "}
              ทีมงาน & นักแสดง ({availableCrew.length})
            </h1>
          </div>

          <Button
            onClick={() => router.push("/create/crew")}
            className="flex items-center justify-center gap-2"
          >
            <AddIcon className="text-lg" />
            เพิ่มรายชื่อทีมงาน
          </Button>
        </div>

        <div className="bg-card border border-zinc-800/35 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
          <div className="p-5 border-b border-zinc-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <SearchInput
              value={crewSearchQuery}
              onChange={setCrewSearchQuery}
              placeholder="ค้นหาชื่อทีมงาน / นักแสดง..."
            />
          </div>
          {isSearchingCrew ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-zinc-700 border-t-white rounded-full animate-spin" />
            </div>
          ) : (
            <CrewTable
              crew={availableCrew}
              movies={movies}
              onEdit={(member) => router.push(`/crew/${member.id}/edit`)}
              onDelete={setDeleteCrewId}
            />
          )}
        </div>
      </main>

      <ConfirmModal
        isOpen={deleteCrewId !== null}
        title={LOCALIZATION.CONFIRM.DELETE_CREW_TITLE}
        message={LOCALIZATION.CONFIRM.DELETE_CREW_MSG}
        variant="danger"
        confirmText={LOCALIZATION.CONFIRM.DELETE_CREW_BTN}
        cancelText={LOCALIZATION.CONFIRM.CANCEL}
        onClose={() => setDeleteCrewId(null)}
        onConfirm={handleDeleteConfirm}
      />

      {isDeletingLocal && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-zinc-800/60" />
              <div className="absolute inset-0 rounded-full border-4 border-brand border-t-transparent animate-spin" />
            </div>
            <div className="space-y-1.5 text-center">
              <h3 className="text-xl font-bold tracking-wide text-white">
                {LOCALIZATION.LOADING.DELETE_CREW}
              </h3>
              <p className="text-xs text-zinc-400 font-light">
                {LOCALIZATION.LOADING.SUB_DELETE_CREW}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
