"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Navbar from "@/components/ui/navbar";
import MovieDetailsModal from "@/components/movie/movie-details-modal";
import TrailerModal from "@/components/modal/trailer-modal";
import AuthModal from "@/components/modal/auth-modal";
import { Movie } from "@/core/domain/movie";
import { User } from "@/core/domain/user";
import { useAppStore } from "@/store/use-store";
import Loading from "../loading";
import { Toast } from "@/components/ui/toast";
import { useMoviesQuery } from "@/hooks/use-movies";
import { useToggleFavoriteMutation } from "@/hooks/use-favorites";
import {
  useMovieUserRatingQuery,
  useAddRatingMutation,
  useUpdateRatingMutation,
  useDeleteRatingMutation,
} from "@/hooks/use-ratings";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showMyListOnly, setShowMyListOnly] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [trailerMovie, setTrailerMovie] = useState<Movie | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const { currentUser, setCurrentUser, showToast } = useAppStore();

  const activeSearchQuery = useDebounce(searchQuery, 200);
  const movieParams = useMemo(() => {
    if (activeSearchQuery.trim()) {
      return { search: activeSearchQuery.trim() };
    }
    if (selectedCategory) {
      return {
        search: selectedCategory,
        searchby: "category",
      };
    }
    return undefined;
  }, [activeSearchQuery, selectedCategory]);

  const { data: fetchedMovies = [], isLoading: isMoviesLoading } =
    useMoviesQuery(movieParams);
  const { data: userRatings } = useMovieUserRatingQuery(
    selectedMovie?.id || "",
    currentUser?.id || "",
    !!selectedMovie && !!currentUser,
  );
  const toggleFavoriteMutation = useToggleFavoriteMutation();
  const addRatingMutation = useAddRatingMutation();
  const updateRatingMutation = useUpdateRatingMutation();
  const deleteRatingMutation = useDeleteRatingMutation();
  const logoutMutation = useLogoutMutation();

  const moviesData = movieParams ? fetchedMovies : initialAllMovies;

  const activeMovieForModal = useMemo(() => {
    if (!selectedMovie) return null;
    return moviesData.find((m) => m.id === selectedMovie.id) || selectedMovie;
  }, [selectedMovie, moviesData]);

  const filteredMovies = useMemo(() => {
    if (showMyListOnly) {
      return favorites;
    }
    return moviesData;
  }, [moviesData, showMyListOnly, favorites]);

  useEffect(() => {
    if (!currentUser) {
      setShowMyListOnly(false);
    }
  }, [currentUser]);

  const handleLoginSuccess = useCallback(
    (user: User) => {
      setCurrentUser(user);
    },
    [setCurrentUser],
  );

  const handleSignOut = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

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

  const handleAddRating = useCallback(
    (movieId: string, user: User, stars: number) => {
      addRatingMutation.mutate(
        { userId: user.id, movieId, stars },
        {
          onSuccess: () => {
            showToast("เพิ่มคะแนนแล้ว", "success");
          },
          onError: () => {
            showToast("เกิดข้อผิดพลาด", "error");
          },
        },
      );
    },
    [addRatingMutation, showToast],
  );

  const handleUpdateRating = useCallback(
    (movieId: string, user: User, stars: number) => {
      updateRatingMutation.mutate(
        { userId: user.id, movieId, stars },
        {
          onSuccess: () => {
            showToast("แก้ไขคะแนนแล้ว", "success");
          },
          onError: () => {
            showToast("เกิดข้อผิดพลาด", "error");
          },
        },
      );
    },
    [updateRatingMutation, showToast],
  );

  const handleDeleteRating = useCallback(
    (movieId: string, user: User) => {
      deleteRatingMutation.mutate(
        { userId: user.id, movieId },
        {
          onSuccess: () => {
            showToast("ลบคะแนนแล้ว", "success");
          },
          onError: () => {
            showToast("เกิดข้อผิดพลาด", "error");
          },
        },
      );
    },
    [deleteRatingMutation, showToast],
  );

  const handlePlayTrailer = useCallback((movie: Movie) => {
    setTrailerMovie(movie);
    setIsPlayingTrailer(true);
  }, []);

  const isSearching =
    searchQuery.trim() !== activeSearchQuery.trim() || isMoviesLoading;

  const isBrowsingRowView =
    !searchQuery && !selectedCategory && !showMyListOnly;

  if (isMoviesLoading && isBrowsingRowView) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-background text-white flex flex-col font-sans select-none pb-16 transition-colors duration-450">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        showMyListOnly={showMyListOnly}
        onMyListOnlyChange={setShowMyListOnly}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        onSignInClick={() => setIsAuthOpen(true)}
        categories={categories}
      />

      {isBrowsingRowView ? (
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
          setSelectedMovie={setSelectedMovie}
          handleToggleFavorite={handleToggleFavorite}
          setSearchQuery={setSearchQuery}
        />
      ) : (
        <SearchView
          searchQuery={searchQuery}
          showMyListOnly={showMyListOnly}
          selectedCategory={selectedCategory}
          filteredMovies={filteredMovies}
          isSearching={isSearching}
          handlePlayTrailer={handlePlayTrailer}
          setSelectedMovie={setSelectedMovie}
          handleToggleFavorite={handleToggleFavorite}
          favorites={favorites}
          setSearchQuery={setSearchQuery}
          setSelectedCategory={setSelectedCategory}
          setShowMyListOnly={setShowMyListOnly}
        />
      )}

      {activeMovieForModal && (
        <MovieDetailsModal
          isOpen={!!selectedMovie}
          onClose={() => setSelectedMovie(null)}
          movie={activeMovieForModal}
          isFavorite={favorites.some(
            (fav) => fav.id === activeMovieForModal.id,
          )}
          onToggleFavorite={handleToggleFavorite}
          onPlayTrailer={() => handlePlayTrailer(activeMovieForModal)}
          onAddRating={handleAddRating}
          onUpdateRating={handleUpdateRating}
          onDeleteRating={handleDeleteRating}
          userRating={userRatings || null}
          currentUser={currentUser}
          onSignInClick={() => setIsAuthOpen(true)}
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
