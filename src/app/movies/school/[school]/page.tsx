"use client";

import { useCallback, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { isEmptyAll } from "@/utils/check";
import { MOCK_SCHOOLS } from "@/core/constants/mock-schools";

export default function SchoolDetailPage() {
  const params = useParams<{ school: string }>();
  const router = useRouter();
  const schoolName = params.school ? decodeURIComponent(params.school) : "";

  const mappedSchool = MOCK_SCHOOLS.find(
    (s) => s.searchKey.toLowerCase() === schoolName.toLowerCase()
  );
  const displaySchoolName = mappedSchool ? mappedSchool.label : schoolName;

  const { playMovie: handlePlayMovie } = useMoviePlayer();
  const { currentUser, showToast } = useAppStore();
  const [orientation, setOrientation] = useState<LayoutOrientation>("landscape");

  const { data: moviesBySchool = [], isLoading: isLoadingSchool } = useMoviesQuery(
    { search: schoolName, searchby: "school", aspectRatio: orientation },
    { placeholderData: keepPreviousData }
  );

  const { data: moviesByViews = [], isLoading: isLoadingViews } = useMoviesQuery(
    { search: schoolName, searchby: "school", sort: "desc", sortby: "views", aspectRatio: orientation },
    { placeholderData: keepPreviousData }
  );

  const { data: moviesByRating = [], isLoading: isLoadingRating } = useMoviesQuery(
    { search: schoolName, searchby: "school", sort: "desc", sortby: "averageRating", aspectRatio: orientation },
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

  const isPageLoading =
    isLoadingSchool ||
    isLoadingViews ||
    isLoadingRating ||
    (!!currentUser && isLoadingFavs);

  if (isPageLoading) {
    return <Loading />;
  }

  return (
    <PageLayout>
      <div className="space-y-8">
        <div className="flex justify-start">
          <LayoutToggle value={orientation} onChange={setOrientation} />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-white">
          ผลงานจาก {displaySchoolName}
        </h1>

        {isEmptyAll(moviesBySchool, moviesByViews, moviesByRating) ? (
          <div className="text-center py-24 space-y-3">
            <p className="text-lg text-zinc-500 font-light">
              ไม่พบภาพยนตร์จากโรงเรียนนี้ในระบบ
            </p>
          </div>
        ) : (
          <div className="space-y-12 pb-10">
            {moviesBySchool.length > 0 && (
              <MovieRow
                title={displaySchoolName}
                movies={moviesBySchool}
                onPlayClick={handlePlayMovie}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                orientation={orientation}
              />
            )}
            {moviesBySchool.length >= 5 && moviesByViews.length > 0 && (
              <MovieRow
                title={`${displaySchoolName}ยอดนิยม`}
                movies={moviesByViews}
                onPlayClick={handlePlayMovie}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                orientation={orientation}
              />
            )}
            {moviesBySchool.length >= 5 && moviesByRating.length > 0 && (
              <MovieRow
                title={`${displaySchoolName}ถูกใจผู้ชม`}
                movies={moviesByRating}
                onPlayClick={handlePlayMovie}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                orientation={orientation}
              />
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
