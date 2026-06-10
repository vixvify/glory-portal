"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMoviePlayer } from "@/hooks/use-movie-player";
import { Movie } from "@/core/domain/movie";
import { useAppStore } from "@/store/use-store";
import { Toast } from "@/components/ui/toast";
import { useMoviesQuery } from "@/hooks/use-movies";
import { useToggleFavoriteMutation } from "@/hooks/use-favorites";
import { Category } from "@/core/domain/movie";
import { CrewMember } from "@/core/domain/crew";
import { useDebounce } from "@/hooks/use-debounce";
import HomeView from "@/components/views/home-view";
import SearchView from "@/components/views/search-view";

interface Props {
  recommendedMovies: Movie[];
  popularMovies: Movie[];
  categories: Category[];
  directorsList: CrewMember[];
  actorsList: CrewMember[];
  universityMovies: Movie[];
  categoryMoviesMap: Record<string, Movie[]>;
  favorites: Movie[];
  portraitMovies: Movie[];
}

export default function HomePage(props: Props) {
  const {
    recommendedMovies,
    popularMovies,
    categories,
    directorsList,
    actorsList,
    universityMovies,
    categoryMoviesMap,
    favorites,
    portraitMovies,
  } = props;
  const router = useRouter();
  const { currentUser, showToast, searchQuery } = useAppStore();

  const { playMovie: handlePlayMovie } = useMoviePlayer();

  const activeSearchQuery = useDebounce(searchQuery, 200);

  const movieParams = useMemo(() => {
    if (activeSearchQuery.trim()) {
      return { search: activeSearchQuery.trim() };
    }
    return undefined;
  }, [activeSearchQuery]);

  const { data: fetchedMovies = [], isLoading: isMoviesLoading } =
    useMoviesQuery(movieParams, { enabled: !!activeSearchQuery.trim() });

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
              showToast("นำออกจากรายการโปรดแล้ว", "info");
            } else {
              showToast("เพิ่มลงในรายการโปรดแล้ว", "success");
            }
          },
          onError: () => {
            showToast("เกิดข้อผิดพลาดในการปรับปรุงรายการโปรด", "error");
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
          categories={categories}
          directorsList={directorsList}
          actorsList={actorsList}
          universityMovies={universityMovies}
          categoryMoviesMap={categoryMoviesMap}
          favorites={favorites}
          handlePlayMovie={handlePlayMovie}
          handleToggleFavorite={handleToggleFavorite}
          portraitMovies={portraitMovies}
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
