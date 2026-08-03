"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMoviePlayer } from "@/hooks/system/use-movie-player";
import { Movie, BtsVideoItem } from "@/core/domain/movie";
import { useAppStore } from "@/store/use-store";
import { FAVORITE_MESSAGES } from "@/core/constants/favorite-messages";
import { Toast } from "@/components/ui/toast";
import { useMoviesQuery } from "@/hooks/db/use-movies";
import {
  useFavoritesQuery,
  useToggleFavoriteMutation,
} from "@/hooks/db/use-favorites";
import { Category } from "@/core/domain/master-data";
import { CrewMember } from "@/core/domain/crew";
import { useDebounce } from "@/hooks/system/use-debounce";
import HomeView from "@/components/views/home-view";
import SearchView from "@/components/views/search-view";

interface Props {
  btsVideos: BtsVideoItem[];
  recommendedMovies: Movie[];
  popularMovies: Movie[];
  awardsMovies: Movie[];
  categories: Category[];
  staffList: CrewMember[];
  actorList: CrewMember[];
  moviesByRating: Movie[];
  universityMovies: Movie[];
  dramaMovies: Movie[];
  thrillerHorrorMovies: Movie[];
  comedyMovies: Movie[];
  romanceMovies: Movie[];
  portraitMovies: Movie[];
}

export type { BtsVideoItem };

export default function HomePage(props: Props) {
  const {
    btsVideos,
    recommendedMovies,
    popularMovies,
    awardsMovies,
    categories,
    staffList,
    actorList,
    moviesByRating,
    universityMovies,
    dramaMovies,
    thrillerHorrorMovies,
    comedyMovies,
    romanceMovies,
    portraitMovies,
  } = props;

  const router = useRouter();
  const { currentUser, showToast, searchQuery } = useAppStore();
  const { playMovie: handlePlayMovie } = useMoviePlayer();
  const { data: favorites = [] } = useFavoritesQuery(!!currentUser);
  const activeSearchQuery = useDebounce(searchQuery, 200);
  const toggleFavoriteMutation = useToggleFavoriteMutation();

  const movieParams = useMemo(() => {
    if (activeSearchQuery.trim()) {
      return { search: activeSearchQuery.trim() };
    }
    return undefined;
  }, [activeSearchQuery]);

  const { data: fetchedMovies = [], isLoading: isMoviesLoading } =
    useMoviesQuery(movieParams, { enabled: !!activeSearchQuery.trim() });

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
        },
      );
    },
    [currentUser, favorites, toggleFavoriteMutation, showToast, router],
  );

  const isSearching =
    searchQuery.trim() !== activeSearchQuery.trim() || isMoviesLoading;

  return (
    <div className="min-h-screen bg-background text-white flex flex-col font-sans select-none pb-16 transition-colors duration-450">
      {!searchQuery ? (
        <HomeView
          recommendedMovies={recommendedMovies}
          popularMovies={popularMovies}
          awardsMovies={awardsMovies}
          categories={categories}
          staffList={staffList}
          actorList={actorList}
          moviesByRating={moviesByRating}
          universityMovies={universityMovies}
          dramaMovies={dramaMovies}
          thrillerHorrorMovies={thrillerHorrorMovies}
          comedyMovies={comedyMovies}
          romanceMovies={romanceMovies}
          favorites={favorites}
          handlePlayMovie={handlePlayMovie}
          handleToggleFavorite={handleToggleFavorite}
          portraitMovies={portraitMovies}
          btsVideos={btsVideos}
        />
      ) : (
        <SearchView
          searchQuery={searchQuery}
          filteredMovies={fetchedMovies}
          isSearching={isSearching}
          handlePlayMovie={handlePlayMovie}
          handleToggleFavorite={handleToggleFavorite}
          favorites={favorites}
          setSearchQuery={useAppStore.getState().setSearchQuery}
        />
      )}

      <Toast />
    </div>
  );
}
