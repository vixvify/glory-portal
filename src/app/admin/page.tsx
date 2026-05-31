"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/ui/navbar";
import {
  Movie,
  CreateMovie,
  UpdateMovie,
  CrewMember,
  MovieFilterParams,
  CrewFilterParams,
} from "@/core/domain/movie";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CategoryIcon from "@mui/icons-material/Category";
import MovieIcon from "@mui/icons-material/Movie";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useAppStore } from "@/store/use-store";
import Loading from "../loading";
import { Button } from "@/components/ui/button";
import {
  useMoviesQuery,
  useCreateMovieMutation,
  useUpdateMovieMutation,
  useDeleteMovieMutation,
} from "@/hooks/use-movies";
import {
  useCategoriesQuery,
  useAgeRatingsQuery,
  useUniversitiesQuery,
} from "@/hooks/use-master-data";
import {
  useCrewMembersQuery,
  useCreateCrewMemberMutation,
  useUpdateCrewMemberMutation,
  useDeleteCrewMemberMutation,
} from "@/hooks/use-crew-members";
import { useLogoutMutation } from "@/hooks/use-auth";
import PeopleIcon from "@mui/icons-material/People";
import { ConfirmModal } from "@/components/modal/confirm-modal";
import { ImageCropper } from "@/components/modal/image-cropper";
import { LOCALIZATION } from "@/core/constants/localization";
import { CATEGORY_TITLE_MAPPING } from "@/core/constants/categories";
import { StatsCard } from "@/components/ui/stats-card";
import { SearchInput } from "@/components/ui/search-input";
import { FilterSelect } from "@/components/ui/filter-select";
import { MovieFormSidebar } from "@/components/ui/movie-form-sidebar";
import { MovieTable } from "@/components/ui/movie-table";
import { CrewTable } from "@/components/ui/crew-table";
import { CrewFormModal } from "@/components/modal/crew-form-modal";

type ValidatedMoviePayload = {
  title: string;
  description: string;
  category: string;
  thumbnail: File | string | null;
  youtubeUrl: string;
  year: number;
  matchRate: number;
  ageRating: string;
  duration: number;
  university?: string;
  director?: string[];
  producer?: string[];
  writer?: string[];
  cast?: string[];
  btsVideo?: string;
  btsPhotos?: (File | string)[];
};

type Sortby = "title" | "year" | "views";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"movies" | "crew">("movies");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState<Sortby>("title");
  const { currentUser, showToast } = useAppStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [editingMovieId, setEditingMovieId] = useState<string | null>(null);
  const [deleteMovieId, setDeleteMovieId] = useState<string | null>(null);
  const [isSavingLocal, setIsSavingLocal] = useState(false);
  const [isDeletingLocal, setIsDeletingLocal] = useState(false);

  const [crewSearchQuery, setCrewSearchQuery] = useState("");
  const [activeCrewSearchQuery, setActiveCrewSearchQuery] = useState("");
  const [isCrewFormOpen, setIsCrewFormOpen] = useState(false);
  const [editingCrew, setEditingCrew] = useState<CrewMember | null>(null);
  const [deleteCrewId, setDeleteCrewId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveSearchQuery(searchQuery);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveCrewSearchQuery(crewSearchQuery);
    }, 200);
    return () => clearTimeout(timer);
  }, [crewSearchQuery]);

  const [crewNameInput, setCrewNameInput] = useState("");
  const [crewPhotoInput, setCrewPhotoInput] = useState<File | null>(null);
  const [crewPhotoName, setCrewPhotoName] = useState<string | null>(null);

  const [crewPhotoPreview, setCrewPhotoPreview] = useState<string | null>(null);
  const [rawCrewFile, setRawCrewFile] = useState<File | null>(null);

  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

  const [isConfirmMovieOpen, setIsConfirmMovieOpen] = useState(false);
  const [movieFormPendingData, setMovieFormPendingData] =
    useState<ValidatedMoviePayload | null>(null);
  const [isConfirmCrewOpen, setIsConfirmCrewOpen] = useState(false);

  useEffect(() => {
    if (!isFormOpen) {
      setMovieFormPendingData(null);
    }
  }, [isFormOpen]);

  useEffect(() => {
    if (!isCrewFormOpen) {
      setCrewPhotoPreview(null);
      setRawCrewFile(null);
    }
  }, [isCrewFormOpen]);

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

  const crewParams = useMemo(() => {
    if (activeCrewSearchQuery.trim()) {
      return { search: activeCrewSearchQuery.trim() };
    }
    return undefined;
  }, [activeCrewSearchQuery]);

  const { data: movies = [], isLoading: isMoviesLoading } =
    useMoviesQuery(movieParams);

  const { data: availableCategories = [] } = useCategoriesQuery();
  const { data: availableAgeRatings = [] } = useAgeRatingsQuery();
  const { data: availableUniversities = [] } = useUniversitiesQuery();
  const { data: availableCrew = [], isLoading: isCrewLoading } =
    useCrewMembersQuery(crewParams);

  const isSearchingMovies =
    searchQuery.trim() !== activeSearchQuery.trim() || isMoviesLoading;
  const isSearchingCrew =
    crewSearchQuery.trim() !== activeCrewSearchQuery.trim() || isCrewLoading;

  const crewOptions = availableCrew.map((c) => ({
    id: c.id,
    name: c.name,
    photoUrl: c.photoUrl,
  }));

  const createMovieMutation = useCreateMovieMutation();
  const updateMovieMutation = useUpdateMovieMutation();
  const deleteMovieMutation = useDeleteMovieMutation();
  const createCrewMutation = useCreateCrewMemberMutation();
  const updateCrewMutation = useUpdateCrewMemberMutation();
  const deleteCrewMutation = useDeleteCrewMemberMutation();
  const logoutMutation = useLogoutMutation();

  const isSaving =
    createMovieMutation.isPending ||
    updateMovieMutation.isPending ||
    createCrewMutation.isPending ||
    updateCrewMutation.isPending ||
    isSavingLocal;
  const isDeleting =
    deleteMovieMutation.isPending ||
    deleteCrewMutation.isPending ||
    isDeletingLocal;
  const isMutating = isSaving || isDeleting;

  const isCrewAction =
    createCrewMutation.isPending ||
    updateCrewMutation.isPending ||
    deleteCrewMutation.isPending ||
    (activeTab === "crew" && (isSavingLocal || isDeletingLocal));

  const handleOpenAdd = () => {
    setEditingMovie(null);
    setEditingMovieId(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setEditingMovieId(movie.id);
    setIsFormOpen(true);
  };

  const handleMovieSubmit = (data: ValidatedMoviePayload) => {
    setMovieFormPendingData(data);
    setIsConfirmMovieOpen(true);
  };

  const executeSaveMovie = async (validated: ValidatedMoviePayload) => {
    try {
      setIsSavingLocal(true);

      if (editingMovie) {
        const updatedMovie: UpdateMovie = {
          title: validated.title,
          description: validated.description,
          category: validated.category,
          thumbnail:
            validated.thumbnail instanceof File ||
            typeof validated.thumbnail === "string"
              ? validated.thumbnail
              : editingMovie.thumbnail,
          youtubeUrl: validated.youtubeUrl,
          year: validated.year,
          matchRate: validated.matchRate,
          ageRating: validated.ageRating,
          duration: validated.duration,
          university: validated.university || null,
          director: validated.director || null,
          producer: validated.producer || null,
          writer: validated.writer || null,
          cast: validated.cast || null,
          btsVideo: validated.btsVideo || null,
          btsPhotos: (validated.btsPhotos as UpdateMovie["btsPhotos"]) || null,
        };
        await updateMovieMutation.mutateAsync({
          id: editingMovieId!,
          movie: updatedMovie,
        });
        showToast(LOCALIZATION.TOAST.EDIT_MOVIE_SUCCESS, "success");
      } else {
        const newMoviePayload: CreateMovie = {
          title: validated.title,
          description: validated.description,
          category: validated.category,
          thumbnail: validated.thumbnail as File,
          youtubeUrl: validated.youtubeUrl,
          year: validated.year,
          matchRate: validated.matchRate,
          ageRating: validated.ageRating,
          duration: validated.duration,
          university: validated.university || undefined,
          director: validated.director || undefined,
          producer: validated.producer || undefined,
          writer: validated.writer || undefined,
          cast: validated.cast || undefined,
          btsVideo: validated.btsVideo || undefined,
          btsPhotos:
            (validated.btsPhotos as CreateMovie["btsPhotos"]) || undefined,
        };
        await createMovieMutation.mutateAsync(newMoviePayload);
        showToast(LOCALIZATION.TOAST.ADD_MOVIE_SUCCESS, "success");
      }
      setIsFormOpen(false);
      setEditingMovie(null);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : LOCALIZATION.ERRORS.SAVE_MOVIE;
      showToast(errorMessage, "error");
      console.error(err);
    } finally {
      setIsSavingLocal(false);
    }
  };

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

  const handleOpenAddCrew = () => {
    setEditingCrew(null);
    setCrewNameInput("");
    setCrewPhotoInput(null);
    setCrewPhotoName(null);
    setCrewPhotoPreview(null);
    setRawCrewFile(null);
    setIsCrewFormOpen(true);
  };

  const handleOpenEditCrew = (crew: CrewMember) => {
    setEditingCrew(crew);
    setCrewNameInput(crew.name);
    setCrewPhotoInput(null);
    setCrewPhotoName(null);
    setCrewPhotoPreview(crew.photoUrl || null);
    setRawCrewFile(null);
    setIsCrewFormOpen(true);
  };

  const handleCrewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crewNameInput.trim()) {
      showToast(LOCALIZATION.TOAST.REQUIRED_NAME, "error");
      return;
    }
    setIsConfirmCrewOpen(true);
  };

  const executeSaveCrew = async () => {
    try {
      setIsSavingLocal(true);

      if (editingCrew) {
        await updateCrewMutation.mutateAsync({
          id: editingCrew.id,
          crewMember: {
            name: crewNameInput.trim(),
            photo: crewPhotoInput || editingCrew.photoUrl || null,
          },
        });
        showToast(LOCALIZATION.TOAST.EDIT_CREW_SUCCESS, "success");
      } else {
        await createCrewMutation.mutateAsync({
          name: crewNameInput.trim(),
          photo: crewPhotoInput,
        });
        showToast(LOCALIZATION.TOAST.ADD_CREW_SUCCESS, "success");
      }
      setIsCrewFormOpen(false);
      setEditingCrew(null);
      setCrewNameInput("");
      setCrewPhotoInput(null);
      setCrewPhotoName(null);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : LOCALIZATION.ERRORS.SAVE;
      showToast(errorMessage, "error");
      console.error(err);
    } finally {
      setIsSavingLocal(false);
    }
  };

  const handleCrewDeleteConfirm = async () => {
    if (deleteCrewId) {
      try {
        setIsDeletingLocal(true);
        await deleteCrewMutation.mutateAsync(deleteCrewId);
        showToast(LOCALIZATION.TOAST.DELETE_CREW_SUCCESS, "success");
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : LOCALIZATION.ERRORS.DELETE;
        showToast(errorMessage, "error");
        console.error(err);
      } finally {
        setIsDeletingLocal(false);
        setDeleteCrewId(null);
      }
    }
  };

  const totalViews = movies.reduce((sum, m) => sum + (m.views || 0), 0);

  const isInitialLoading =
    isMoviesLoading &&
    movies.length === 0 &&
    !searchQuery.trim() &&
    !categoryFilter;

  if (isInitialLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-background text-white flex flex-col font-sans select-none pb-20">
      <Navbar
        searchQuery=""
        onSearchChange={() => {}}
        selectedCategory={null}
        onCategoryChange={() => {}}
        showMyListOnly={false}
        onMyListOnlyChange={() => {}}
        currentUser={currentUser}
        onSignOut={() => {
          logoutMutation.mutate();
        }}
        onSignInClick={() => {}}
        categories={availableCategories}
      />

      <main className="flex-1 px-6 md:px-16 pt-28 max-w-7xl mx-auto w-full space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-zinc-405">
              <Link
                href="/"
                className="hover:text-brand transition-colors flex items-center gap-1"
              >
                <ArrowBackIcon className="text-sm" />{" "}
                {LOCALIZATION.ADMIN.BACK_HOME}
              </Link>
              <span>/</span>
              <span className="text-zinc-300">
                {LOCALIZATION.ADMIN.DASHBOARD_TITLE}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
              {LOCALIZATION.ADMIN.DASHBOARD_TITLE}
            </h1>
          </div>

          <Button
            onClick={activeTab === "movies" ? handleOpenAdd : handleOpenAddCrew}
            className="flex items-center justify-center gap-2"
          >
            <AddIcon className="text-lg" />
            {activeTab === "movies"
              ? LOCALIZATION.ADMIN.ADD_MOVIE
              : LOCALIZATION.ADMIN.ADD_CREW}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in">
          <StatsCard
            title={LOCALIZATION.ADMIN.TOTAL_TITLES}
            value={movies.length}
            icon={<MovieIcon className="text-2xl" />}
          />
          <StatsCard
            title={LOCALIZATION.ADMIN.TOTAL_CATEGORIES}
            value={availableCategories.length}
            icon={<CategoryIcon className="text-2xl" />}
            iconClassName="bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          />
          <StatsCard
            title={LOCALIZATION.ADMIN.TOTAL_VIEWS}
            value={totalViews.toLocaleString()}
            icon={<VisibilityIcon className="text-2xl" />}
            iconClassName="bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
          />
          <StatsCard
            title={LOCALIZATION.ADMIN.TOTAL_CREW}
            value={availableCrew.length}
            icon={<PeopleIcon className="text-2xl" />}
            iconClassName="bg-violet-500/10 border-violet-500/20 text-violet-400"
          />
        </div>

        <div className="flex border-b border-zinc-800/60 gap-8">
          <button
            onClick={() => setActiveTab("movies")}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeTab === "movies"
                ? "text-brand"
                : "text-zinc-400 hover:text-zinc-200 cursor-pointer"
            }`}
          >
            {LOCALIZATION.ADMIN.TAB_MOVIES(movies.length)}
            {activeTab === "movies" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-full animate-fade-in" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("crew")}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeTab === "crew"
                ? "text-brand"
                : "text-zinc-400 hover:text-zinc-200 cursor-pointer"
            }`}
          >
            {LOCALIZATION.ADMIN.TAB_CREW(availableCrew.length)}
            {activeTab === "crew" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-full animate-fade-in" />
            )}
          </button>
        </div>

        {activeTab === "movies" ? (
          <div className="bg-card border border-zinc-800/35 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md animate-fade-in">
            <div className="p-5 border-b border-zinc-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder={LOCALIZATION.ADMIN.SEARCH_MOVIE_PLACEHOLDER}
              />

              <div className="flex items-center gap-3 self-end md:self-auto">
                <FilterSelect
                  label={LOCALIZATION.ADMIN.FILTER_LABEL}
                  value={categoryFilter}
                  onChange={setCategoryFilter}
                  options={[
                    { value: "", label: LOCALIZATION.ADMIN.FILTER_ALL },
                    ...availableCategories.map((cat) => ({
                      value: cat.name,
                      label: CATEGORY_TITLE_MAPPING[cat.name] || cat.name,
                    })),
                  ]}
                />

                <FilterSelect
                  label={LOCALIZATION.ADMIN.SORT_LABEL}
                  value={sortBy}
                  onChange={(val) => setSortBy(val as Sortby)}
                  options={[
                    { value: "title", label: LOCALIZATION.ADMIN.SORT_ALPHA },
                    { value: "year", label: LOCALIZATION.ADMIN.SORT_YEAR },
                    { value: "views", label: LOCALIZATION.ADMIN.SORT_VIEWS },
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
                onEdit={handleOpenEdit}
                onDelete={setDeleteMovieId}
              />
            )}
          </div>
        ) : (
          <div className="bg-card border border-zinc-800/35 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md animate-fade-in">
            <div className="p-5 border-b border-zinc-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <SearchInput
                value={crewSearchQuery}
                onChange={setCrewSearchQuery}
                placeholder={LOCALIZATION.ADMIN.SEARCH_CREW_PLACEHOLDER}
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
                onEdit={handleOpenEditCrew}
                onDelete={setDeleteCrewId}
              />
            )}
          </div>
        )}
      </main>

      <MovieFormSidebar
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleMovieSubmit}
        editingMovie={editingMovie}
        categories={availableCategories}
        ageRatings={availableAgeRatings}
        universities={availableUniversities}
        crewOptions={crewOptions}
      />

      <CrewFormModal
        isOpen={isCrewFormOpen}
        onClose={() => setIsCrewFormOpen(false)}
        onSubmit={handleCrewSubmit}
        editingCrew={editingCrew}
        crewNameInput={crewNameInput}
        setCrewNameInput={setCrewNameInput}
        crewPhotoName={crewPhotoName}
        setCrewPhotoName={setCrewPhotoName}
        crewPhotoPreview={crewPhotoPreview}
        setCrewPhotoPreview={setCrewPhotoPreview}
        setCrewPhotoInput={setCrewPhotoInput}
        rawCrewFile={rawCrewFile}
        setRawCrewFile={setRawCrewFile}
        setCropImageSrc={setCropImageSrc}
        setIsCropModalOpen={setIsCropModalOpen}
      />

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

      <ConfirmModal
        isOpen={deleteCrewId !== null}
        title={LOCALIZATION.CONFIRM.DELETE_CREW_TITLE}
        message={LOCALIZATION.CONFIRM.DELETE_CREW_MSG}
        variant="danger"
        confirmText={LOCALIZATION.CONFIRM.DELETE_CREW_BTN}
        cancelText={LOCALIZATION.CONFIRM.CANCEL}
        onClose={() => setDeleteCrewId(null)}
        onConfirm={handleCrewDeleteConfirm}
      />

      <ConfirmModal
        isOpen={isConfirmMovieOpen && movieFormPendingData !== null}
        title={
          editingMovie
            ? LOCALIZATION.CONFIRM.EDIT_MOVIE_TITLE
            : LOCALIZATION.CONFIRM.ADD_MOVIE_TITLE
        }
        message={
          movieFormPendingData
            ? editingMovie
              ? LOCALIZATION.CONFIRM.EDIT_MOVIE_MSG(movieFormPendingData.title)
              : LOCALIZATION.CONFIRM.ADD_MOVIE_MSG(movieFormPendingData.title)
            : ""
        }
        iconType="movie"
        confirmText={LOCALIZATION.CONFIRM.CONFIRM}
        cancelText={LOCALIZATION.CONFIRM.CANCEL}
        onClose={() => {
          setIsConfirmMovieOpen(false);
          setMovieFormPendingData(null);
        }}
        onConfirm={async () => {
          setIsConfirmMovieOpen(false);
          if (movieFormPendingData) {
            await executeSaveMovie(movieFormPendingData);
            setMovieFormPendingData(null);
          }
        }}
      />

      <ConfirmModal
        isOpen={isConfirmCrewOpen}
        title={
          editingCrew
            ? LOCALIZATION.CONFIRM.EDIT_CREW_TITLE
            : LOCALIZATION.CONFIRM.ADD_CREW_TITLE
        }
        message={
          editingCrew
            ? LOCALIZATION.CONFIRM.EDIT_CREW_MSG(crewNameInput.trim())
            : LOCALIZATION.CONFIRM.ADD_CREW_MSG(crewNameInput.trim())
        }
        iconType="crew"
        confirmText={LOCALIZATION.CONFIRM.CONFIRM}
        cancelText={LOCALIZATION.CONFIRM.CANCEL}
        onClose={() => setIsConfirmCrewOpen(false)}
        onConfirm={async () => {
          setIsConfirmCrewOpen(false);
          await executeSaveCrew();
        }}
      />

      <ImageCropper
        isOpen={isCropModalOpen}
        imageSrc={cropImageSrc}
        fileName={rawCrewFile?.name}
        onClose={() => {
          setIsCropModalOpen(false);
          setRawCrewFile(null);
          setCropImageSrc(null);
        }}
        onConfirm={(croppedFile, previewUrl) => {
          setCrewPhotoInput(croppedFile);
          setCrewPhotoName(croppedFile.name);
          setCrewPhotoPreview(previewUrl);
          setIsCropModalOpen(false);
        }}
      />

      {isMutating && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-zinc-800/60" />
              <div className="absolute inset-0 rounded-full border-4 border-brand border-t-transparent animate-spin" />
            </div>
            <div className="space-y-1.5 text-center">
              <h3 className="text-xl font-bold tracking-wide text-white">
                {isDeleting
                  ? isCrewAction
                    ? LOCALIZATION.LOADING.DELETE_CREW
                    : LOCALIZATION.LOADING.DELETE_MOVIE
                  : isCrewAction
                    ? LOCALIZATION.LOADING.SAVE_CREW
                    : LOCALIZATION.LOADING.SAVE_MOVIE}
              </h3>
              <p className="text-xs text-zinc-400 font-light">
                {isDeleting
                  ? isCrewAction
                    ? LOCALIZATION.LOADING.SUB_DELETE_CREW
                    : LOCALIZATION.LOADING.SUB_DELETE_MOVIE
                  : isCrewAction
                    ? LOCALIZATION.LOADING.SUB_SAVE_CREW
                    : LOCALIZATION.LOADING.SUB_SAVE_MOVIE}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
