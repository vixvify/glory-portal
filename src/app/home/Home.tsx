"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMoviePlayer } from "@/hooks/use-movie-player";
import { Movie } from "@/core/domain/movie";
import { useAppStore } from "@/store/use-store";
import Loading from "../loading";
import { Toast } from "@/components/ui/toast";
import { useMoviesQuery } from "@/hooks/use-movies";
import { useToggleFavoriteMutation } from "@/hooks/use-favorites";
import { Category } from "@/core/domain/movie";
import { University } from "@/core/domain/movie";
import { CrewMember } from "@/core/domain/movie";
import { useDebounce } from "@/hooks/use-debounce";
import HomeView from "@/components/movie/home-view";
import SearchView from "@/components/movie/search-view";

interface Props {
  recommendedMovies: Movie[];
  popularMovies: Movie[];
  categories: Category[];
  universities: University[];
  directorsList: CrewMember[];
  actorsList: CrewMember[];
  universityMoviesMap: Record<string, Movie[]>;
  categoryMoviesMap: Record<string, Movie[]>;
  favorites: Movie[];
}

export default function HomePage(props: Props) {
  const {
    recommendedMovies,
    popularMovies,
    categories,
    universities,
    directorsList,
    actorsList,
    universityMoviesMap,
    categoryMoviesMap,
    favorites,
  } = props;
  const router = useRouter();
  const { currentUser, showToast, searchQuery, setSearchQuery } = useAppStore();

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

  const moviesData = fetchedMovies;

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
    [
      currentUser,
      favorites,
      moviesData,
      toggleFavoriteMutation,
      showToast,
      router,
    ],
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
          universities={universities}
          directorsList={directorsList}
          actorsList={actorsList}
          universityMoviesMap={universityMoviesMap}
          categoryMoviesMap={categoryMoviesMap}
          favorites={favorites}
          handlePlayMovie={handlePlayMovie}
          handleToggleFavorite={handleToggleFavorite}
          setSearchQuery={setSearchQuery}
        />
      ) : (
        <SearchView
          searchQuery={searchQuery}
          filteredMovies={moviesData}
          isSearching={isSearching}
          handlePlayMovie={handlePlayMovie}
          handleToggleFavorite={handleToggleFavorite}
          favorites={favorites}
          setSearchQuery={setSearchQuery}
        />
      )}

      <Toast />
    </div>
  );
}
