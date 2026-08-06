"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { keepPreviousData } from "@tanstack/react-query";
import { useMoviesQuery } from "@/hooks/db/use-movies";
import {
  useFavoritesQuery,
  useToggleFavoriteMutation,
} from "@/hooks/db/use-favorites";
import { useAppStore } from "@/store/use-store";
import { FAVORITE_MESSAGES } from "@/core/constants/favorite-messages";
import MovieRow from "@/components/movie/rows/movie-row";
import Loading from "@/app/loading";
import { useMoviePlayer } from "@/hooks/system/use-movie-player";
import { LayoutToggle, LayoutOrientation } from "@/components/ui/layout-toggle";
import { PageLayout } from "@/components/ui/page-layout";

import { Movie } from "@/core/domain/movie";
import { MOCK_SCHOOLS } from "@/core/constants/mock-schools";

function pickRandom<T>(arr: T[], count: number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, Math.min(count, a.length));
}

function RandomSchoolRow({
  school,
  orientation,
  favorites,
  onPlayClick,
  onToggleFavorite,
}: {
  school: { searchKey: string; label: string };
  orientation: LayoutOrientation;
  favorites: Movie[];
  onPlayClick: (movie: Movie) => void;
  onToggleFavorite: (movieId: string) => void;
}) {
  const { data: movies = [], isLoading } = useMoviesQuery(
    { search: school.searchKey, searchby: "school", aspectRatio: orientation },
    { placeholderData: keepPreviousData }
  );

  if (isLoading || movies.length === 0) return null;

  return (
    <MovieRow
      title={school.label}
      movies={movies}
      onPlayClick={onPlayClick}
      favorites={favorites}
      onToggleFavorite={onToggleFavorite}
      orientation={orientation}
    />
  );
}

export default function SchoolPage() {
  const router = useRouter();
  const { playMovie: handlePlayMovie } = useMoviePlayer();
  const { currentUser, showToast } = useAppStore();
  const [orientation, setOrientation] = useState<LayoutOrientation>("landscape");

  const randomSchools = useMemo(() => pickRandom(MOCK_SCHOOLS, 2), []);

  const { data: allSchoolMovies = [], isLoading: isLoadingAll } = useMoviesQuery(
    { searchby: "school", aspectRatio: orientation },
    { placeholderData: keepPreviousData }
  );

  const { data: favorites = [], isLoading: isLoadingFavs } =
    useFavoritesQuery(!!currentUser);
  const toggleFavoriteMutation = useToggleFavoriteMutation();

  const handleToggleFavorite = useCallback(
    (movieId: string) => {
      if (!currentUser) {
        router.push("/auth/login");
        return;
      }
      const isCurrentlyFavorite = favorites.some((m) => m.id === movieId);

      toggleFavoriteMutation.mutate(
        { movieId, isFavorite: isCurrentlyFavorite },
        {
          onSuccess: () => {
            if (isCurrentlyFavorite) {
              showToast(FAVORITE_MESSAGES.TOAST.REMOVE_FAVORITE_SUCCESS, "info");
            } else {
              showToast(FAVORITE_MESSAGES.TOAST.ADD_FAVORITE_SUCCESS, "success");
            }
          },
          onError: () => {
            showToast(FAVORITE_MESSAGES.ERRORS.FAVORITE_UPDATE, "error");
          },
        }
      );
    },
    [currentUser, favorites, toggleFavoriteMutation, showToast, router]
  );

  const isPageLoading = isLoadingAll || (!!currentUser && isLoadingFavs);

  if (isPageLoading) {
    return <Loading />;
  }

  return (
    <PageLayout>
      <div className="space-y-8">
        <div className="flex justify-start">
          <LayoutToggle value={orientation} onChange={setOrientation} />
        </div>

        <div className="space-y-12 pb-10">
          {allSchoolMovies.length > 0 && (
            <MovieRow
              title="ผลงานจากนักเรียน"
              movies={allSchoolMovies}
              onPlayClick={handlePlayMovie}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              orientation={orientation}
            />
          )}

          {randomSchools.map((school) => (
            <RandomSchoolRow
              key={school.searchKey}
              school={school}
              orientation={orientation}
              favorites={favorites}
              onPlayClick={handlePlayMovie}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}

          {allSchoolMovies.length === 0 && (
            <div className="text-center py-24 space-y-3">
              <p className="text-lg text-zinc-500 font-light">
                ยังไม่มีภาพยนตร์จากโรงเรียนในระบบ
              </p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
