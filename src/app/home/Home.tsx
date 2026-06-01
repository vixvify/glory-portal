"use client";

import { useState, useMemo, useCallback } from "react";
import TrailerModal from "@/components/modal/trailer-modal";
import AuthModal from "@/components/modal/auth-modal";
import { Movie } from "@/core/domain/movie";
import { User } from "@/core/domain/user";
import { useAppStore } from "@/store/use-store";
import Loading from "../loading";
import { Toast } from "@/components/ui/toast";
import { useMoviesQuery } from "@/hooks/use-movies";
import { useToggleFavoriteMutation } from "@/hooks/use-favorites";
import { useLogoutMutation } from "@/hooks/use-auth";
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
  initialAllMovies: Movie[];
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
    initialAllMovies,
    favorites,
  } = props;
  const {
    currentUser,
    setCurrentUser,
    showToast,
    searchQuery,
    setSearchQuery,
    isAuthOpen,
    setIsAuthOpen,
  } = useAppStore();

  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [trailerMovie, setTrailerMovie] = useState<Movie | null>(null);

  const activeSearchQuery = useDebounce(searchQuery, 200);

  const movieParams = useMemo(() => {
    if (activeSearchQuery.trim()) {
      return { search: activeSearchQuery.trim() };
    }
    return undefined;
  }, [activeSearchQuery]);

  const { data: fetchedMovies = [], isLoading: isMoviesLoading } =
    useMoviesQuery(movieParams);

  const toggleFavoriteMutation = useToggleFavoriteMutation();

  const moviesData = movieParams ? fetchedMovies : initialAllMovies;

  const handleLoginSuccess = useCallback(
    (user: User) => {
      setCurrentUser(user);
    },
    [setCurrentUser],
  );

  const handleToggleFavorite = useCallback(
    (movieId: string) => {
      if (!currentUser) {
        setIsAuthOpen(true);
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
    [currentUser, favorites, moviesData, toggleFavoriteMutation, showToast],
  );

  const handlePlayTrailer = useCallback((movie: Movie) => {
    setTrailerMovie(movie);
    setIsPlayingTrailer(true);
  }, []);

  const isSearching =
    searchQuery.trim() !== activeSearchQuery.trim() || isMoviesLoading;

  if (isMoviesLoading) {
    return <Loading />;
  }

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
          initialAllMovies={initialAllMovies}
          favorites={favorites}
          handlePlayTrailer={handlePlayTrailer}
          handleToggleFavorite={handleToggleFavorite}
          setSearchQuery={setSearchQuery}
        />
      ) : (
        <SearchView
          searchQuery={searchQuery}
          filteredMovies={moviesData}
          isSearching={isSearching}
          handlePlayTrailer={handlePlayTrailer}
          handleToggleFavorite={handleToggleFavorite}
          favorites={favorites}
          setSearchQuery={setSearchQuery}
        />
      )}

      {trailerMovie && (
        <TrailerModal
          isOpen={isPlayingTrailer}
          onClose={() => setIsPlayingTrailer(false)}
          youtubeUrl={trailerMovie.youtubeUrl}
          movieTitle={trailerMovie.title}
        />
      )}

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      <Toast />
    </div>
  );
}
