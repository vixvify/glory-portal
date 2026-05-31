"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Navbar from "@/components/ui/navbar";
import MovieHero from "@/components/movie/movie-hero";
import MovieGrid from "@/components/movie/movie-grid";
import MovieRow from "@/components/movie/movie-row";
import MovieRankRow from "@/components/movie/movie-rank-row";
import MovieDetailsModal from "@/components/movie/movie-details-modal";
import TrailerModal from "@/components/modal/trailer-modal";
import AuthModal from "@/components/modal/auth-modal";
import { Movie } from "@/core/domain/movie";
import { User } from "@/core/domain/user";
import { useAppStore } from "@/store/use-store";
import Loading from "../loading";
import { Toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { CATEGORY_TITLE_MAPPING } from "@/core/constants/categories";
import { useMoviesQuery } from "@/hooks/use-movies";
import { useToggleFavoriteMutation } from "@/hooks/use-favorites";
import {
  useMovieUserRatingQuery,
  useAddRatingMutation,
  useUpdateRatingMutation,
  useDeleteRatingMutation,
} from "@/hooks/use-ratings";
import { useLogoutMutation } from "@/hooks/use-auth";
import CrewRow from "@/components/movie/crew-row";
import { Category } from "@/core/domain/movie";
import { University } from "@/core/domain/movie";
import { CrewMember } from "@/core/domain/movie";
import Pagination from "@/components/ui/pagination";

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
  serverFavorites: Movie[];
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
    serverFavorites,
  } = props;
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showMyListOnly, setShowMyListOnly] = useState(false);

  const [gridPage, setGridPage] = useState(1);
  const GRID_PAGE_SIZE = 12;

  useEffect(() => {
    setGridPage(1);
  }, [searchQuery, selectedCategory, showMyListOnly]);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [trailerMovie, setTrailerMovie] = useState<Movie | null>(null);

  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const { currentUser, setCurrentUser, showToast } = useAppStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveSearchQuery(searchQuery);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const movieParams = useMemo(() => {
    if (activeSearchQuery.trim()) {
      return { search: activeSearchQuery.trim(), page: 1, pagenumber: 1000 };
    }
    if (selectedCategory) {
      return {
        search: selectedCategory,
        searchby: "category",
        page: 1,
        pagenumber: 1000,
      };
    }
    return undefined;
  }, [activeSearchQuery, selectedCategory]);

  const { data: fetchedMovies = [], isLoading: isMoviesLoading } =
    useMoviesQuery(movieParams);

  const allMovies = movieParams ? fetchedMovies : initialAllMovies;

  const isSearching =
    searchQuery.trim() !== activeSearchQuery.trim() || isMoviesLoading;

  const [localFavorites, setLocalFavorites] = useState<Movie[] | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setLocalFavorites(null);
      setShowMyListOnly(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (serverFavorites) {
      setLocalFavorites(null);
    }
  }, [serverFavorites]);

  const favorites = localFavorites ?? serverFavorites;

  const { data: userRatings = [] } = useMovieUserRatingQuery(
    selectedMovie?.id || "",
    currentUser?.id || "",
    !!selectedMovie && !!currentUser,
  );
  const currentUserRating = userRatings.length > 0 ? userRatings[0] : null;

  const toggleFavoriteMutation = useToggleFavoriteMutation();
  const addRatingMutation = useAddRatingMutation();
  const updateRatingMutation = useUpdateRatingMutation();
  const deleteRatingMutation = useDeleteRatingMutation();
  const logoutMutation = useLogoutMutation();

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
      const previousFavorites = [...favorites];

      const targetMovie = allMovies.find((m) => m.id === movieId);
      const updatedFavorites = isCurrentlyFavorite
        ? favorites.filter((m) => m.id !== movieId)
        : targetMovie
          ? [...favorites, targetMovie]
          : favorites;

      setLocalFavorites(updatedFavorites);

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
            setLocalFavorites(previousFavorites);
            showToast("เกิดข้อผิดพลาดในการปรับปรุงรายการโปรด", "error");
          },
        },
      );
    },
    [currentUser, favorites, allMovies, toggleFavoriteMutation, showToast],
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

  const activeMovieForModal = useMemo(() => {
    if (!selectedMovie) return null;
    return allMovies.find((m) => m.id === selectedMovie.id) || selectedMovie;
  }, [selectedMovie, allMovies]);

  const filteredMovies = useMemo(() => {
    if (showMyListOnly) {
      return favorites;
    }
    return allMovies;
  }, [allMovies, showMyListOnly, favorites]);

  const paginatedFilteredMovies = useMemo(() => {
    const startIndex = (gridPage - 1) * GRID_PAGE_SIZE;
    return filteredMovies.slice(startIndex, startIndex + GRID_PAGE_SIZE);
  }, [filteredMovies, gridPage]);

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
        <main className="flex-1 flex flex-col">
          <MovieHero
            movies={recommendedMovies}
            onPlayClick={handlePlayTrailer}
            onInfoClick={setSelectedMovie}
          />

          <div className="relative z-20 px-6 md:px-16 space-y-12 -mt-6 md:-mt-10">
            <MovieRankRow
              title="10 อันดับหนังยอดนิยม"
              movies={popularMovies}
              onMovieClick={setSelectedMovie}
              onPlayClick={handlePlayTrailer}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />

            {favorites.length > 0 && (
              <MovieRow
                title="รายการโปรดของคุณ"
                movies={favorites}
                onMovieClick={setSelectedMovie}
                onPlayClick={handlePlayTrailer}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {universities.map((uni) => (
              <MovieRow
                key={uni.id}
                title={`ผลงานภาพยนตร์จาก ${uni.name}`}
                movies={universityMoviesMap[uni.id] || []}
                onMovieClick={setSelectedMovie}
                onPlayClick={handlePlayTrailer}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}

            {directorsList.length > 0 && (
              <CrewRow
                title="ผู้กำกับยอดนิยม"
                crew={directorsList}
                onCrewClick={(member) => {
                  setSearchQuery(member.name);
                }}
              />
            )}

            {actorsList.length > 0 && (
              <CrewRow
                title="นักแสดงและทีมงาน"
                crew={actorsList}
                onCrewClick={(member) => {
                  setSearchQuery(member.name);
                }}
              />
            )}

            {categories.map((category) => (
              <MovieRow
                key={category.id}
                title={CATEGORY_TITLE_MAPPING[category.name]}
                movies={categoryMoviesMap[category.id] || []}
                onMovieClick={setSelectedMovie}
                onPlayClick={handlePlayTrailer}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </main>
      ) : (
        <main className="flex-1 px-6 md:px-16 pt-28 space-y-8 animate-fade-in">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-wide">
              {searchQuery
                ? `ผลลัพธ์การค้นหา "${searchQuery}"`
                : showMyListOnly
                  ? "รายการของฉัน"
                  : `${CATEGORY_TITLE_MAPPING[selectedCategory || ""]}`}
            </h2>
            <span className="text-sm text-zinc-400">
              {filteredMovies.length} เรื่อง
            </span>
          </div>

          {isSearching ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-12 h-12 border-4 border-zinc-700 border-t-white rounded-full animate-spin" />
            </div>
          ) : filteredMovies.length === 0 ? (
            <div className="text-center py-24 space-y-4">
              <p className="text-lg text-zinc-400 font-light">
                ไม่พบผลลัพธ์ที่ตรงกัน
              </p>
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                  setShowMyListOnly(false);
                }}
              >
                ล้างตัวกรอง
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-8 pb-10">
              <MovieGrid
                movies={paginatedFilteredMovies}
                onMovieClick={setSelectedMovie}
                onPlayClick={handlePlayTrailer}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
              <div className="flex justify-center border-t border-zinc-800/40 pt-4">
                <Pagination
                  currentPage={gridPage}
                  totalItems={filteredMovies.length}
                  pageSize={GRID_PAGE_SIZE}
                  onPageChange={setGridPage}
                />
              </div>
            </div>
          )}
        </main>
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
          userRating={currentUserRating}
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
