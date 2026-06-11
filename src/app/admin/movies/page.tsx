"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MovieIcon from "@mui/icons-material/Movie";
import { useAppStore } from "@/store/use-store";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { FilterSelect } from "@/components/ui/filter-select";
import { MovieTable } from "@/components/movie/tables/movie-table";
import { ConfirmModal } from "@/components/modal/confirm-modal";
import { useMoviesQuery, useDeleteMovieMutation } from "@/hooks/use-movies";
import { useCategoriesQuery } from "@/hooks/use-master-data";
import { useDebounce } from "@/hooks/use-debounce";
import { LOCALIZATION } from "@/core/constants/localization";
import { CATEGORY_TITLE_MAPPING } from "@/core/constants/categories";
import { MovieFilterParams } from "@/core/domain/movie";

type Sortby = "title" | "year" | "views";

export default function AdminMoviesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState<Sortby>("title");
  const { showToast } = useAppStore();

  const [deleteMovieId, setDeleteMovieId] = useState<string | null>(null);
  const [isDeletingLocal, setIsDeletingLocal] = useState(false);

  const activeSearchQuery = useDebounce(searchQuery, 200);

  const movieParams = useMemo(() => {
    const params: MovieFilterParams = {
      sortby: sortBy,
      sort: sortBy === "title" ? "asc" : "desc",
    };
    if (activeSearchQuery.trim()) {
      params.search = activeSearchQuery.trim();
    } else if (categoryFilter) {
      params.search = categoryFilter;
      params.searchby = "category";
    }
    return params;
  }, [activeSearchQuery, categoryFilter, sortBy]);

  const { data: movies = [], isLoading: isMoviesLoading } =
    useMoviesQuery(movieParams);
  const { data: availableCategories = [], isLoading: isCategoriesLoading } =
    useCategoriesQuery();

  const deleteMovieMutation = useDeleteMovieMutation();

  const isInitialLoading =
    isMoviesLoading &&
    movies.length === 0 &&
    !searchQuery.trim() &&
    !categoryFilter;
  const isSearchingMovies =
    searchQuery.trim() !== activeSearchQuery.trim() || isMoviesLoading;

  const handleDeleteConfirm = async () => {
    if (deleteMovieId) {
      try {
        setIsDeletingLocal(true);
        await deleteMovieMutation.mutateAsync(deleteMovieId);
        showToast(LOCALIZATION.TOAST.DELETE_MOVIE_SUCCESS, "success");
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : LOCALIZATION.ERRORS.DELETE;
        showToast(errorMessage, "error");
      } finally {
        setIsDeletingLocal(false);
        setDeleteMovieId(null);
      }
    }
  };

  if (isInitialLoading || isCategoriesLoading) {
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
              <span className="text-zinc-300">ระบบจัดการข้อมูลภาพยนตร์</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent flex items-center gap-2">
              <MovieIcon className="text-brand" />{" "}
              ภาพยนตร์ ({movies.length})
            </h1>
          </div>

          <Button
            onClick={() => router.push("/create/movie")}
            className="flex items-center justify-center gap-2"
          >
            <AddIcon className="text-lg" />
            เพิ่มภาพยนตร์ใหม่
          </Button>
        </div>

        <div className="bg-card border border-zinc-800/35 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
          <div className="p-5 border-b border-zinc-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="ค้นหาจากชื่อเรื่อง หมวดหมู่ หรือเรื่องย่อ..."
            />

            <div className="flex items-center gap-3 self-end md:self-auto">
              <FilterSelect
                label="หมวดหมู่:"
                value={categoryFilter}
                onChange={setCategoryFilter}
                options={[
                  { value: "", label: "ทุกหมวดหมู่" },
                  ...availableCategories.map((cat) => ({
                    value: cat.name,
                    label: CATEGORY_TITLE_MAPPING[cat.name] || cat.name,
                  })),
                ]}
              />

              <FilterSelect
                label="เรียงตาม:"
                value={sortBy}
                onChange={(val) => setSortBy(val as Sortby)}
                options={[
                  { value: "title", label: "ตามตัวอักษร" },
                  { value: "year", label: "ปีที่ฉาย" },
                  { value: "views", label: "ยอดความนิยม" },
                ]}
              />
            </div>
          </div>

          {isSearchingMovies ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-zinc-700 border-t-white rounded-full animate-spin" />
            </div>
          ) : (
            <MovieTable
              movies={movies}
              onEdit={(movie) => router.push(`/movies/${movie.id}/edit`)}
              onDelete={setDeleteMovieId}
            />
          )}
        </div>
      </main>

      <ConfirmModal
        isOpen={deleteMovieId !== null}
        title={LOCALIZATION.CONFIRM.DELETE_MOVIE_TITLE}
        message={LOCALIZATION.CONFIRM.DELETE_MOVIE_MSG}
        variant="danger"
        confirmText={LOCALIZATION.CONFIRM.DELETE_MOVIE_BTN}
        cancelText={LOCALIZATION.CONFIRM.CANCEL}
        onClose={() => setDeleteMovieId(null)}
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
                {LOCALIZATION.LOADING.DELETE_MOVIE}
              </h3>
              <p className="text-xs text-zinc-400 font-light">
                {LOCALIZATION.LOADING.SUB_DELETE_MOVIE}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
