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
import { Movie, MovieFilterParams } from "@/core/domain/movie";
import { User } from "@/core/domain/user";
import { useAppStore } from "@/store/use-store";
import Loading from "./loading";
import { Toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { CATEGORY_TITLE_MAPPING } from "@/core/constants/categories";
import { useMoviesQuery } from "@/hooks/use-movies";
import {
  useFavoritesQuery,
  useToggleFavoriteMutation,
} from "@/hooks/use-favorites";
import {
  useMovieUserRatingQuery,
  useAddRatingMutation,
  useUpdateRatingMutation,
  useDeleteRatingMutation,
} from "@/hooks/use-ratings";
import {
  useCategoriesQuery,
  useUniversitiesQuery,
} from "@/hooks/use-master-data";
import { useCrewMembersQuery } from "@/hooks/use-crew-members";
import { useLogoutMutation } from "@/hooks/use-auth";
import CrewRow from "@/components/movie/crew-row";
import { CrewMember } from "@/core/domain/movie";

interface UniversityMovieRowProps {
  universityName: string;
  title: string;
  onMovieClick: (movie: Movie) => void;
  onPlayClick: (movie: Movie) => void;
  favorites: Movie[];
  onToggleFavorite: (movieId: string) => void;
}

const UniversityMovieRow: React.FC<UniversityMovieRowProps> = ({
  universityName,
  title,
  onMovieClick,
  onPlayClick,
  favorites,
  onToggleFavorite,
}) => {
  const { data: movies = [] } = useMoviesQuery({
    search: universityName,
    searchby: "university",
  });

  if (movies.length === 0) return null;

  return (
    <MovieRow
      title={title}
      movies={movies}
      onMovieClick={onMovieClick}
      onPlayClick={onPlayClick}
      favorites={favorites}
      onToggleFavorite={onToggleFavorite}
    />
  );
};

interface CategoryMovieRowProps {
  categoryName: string;
  title: string;
  onMovieClick: (movie: Movie) => void;
  onPlayClick: (movie: Movie) => void;
  favorites: Movie[];
  onToggleFavorite: (movieId: string) => void;
}

const CategoryMovieRow: React.FC<CategoryMovieRowProps> = ({
  categoryName,
  title,
  onMovieClick,
  onPlayClick,
  favorites,
  onToggleFavorite,
}) => {
  const { data: movies = [] } = useMoviesQuery({
    search: categoryName,
    searchby: "category",
  });

  if (movies.length === 0) return null;

  return (
    <MovieRow
      title={title}
      movies={movies}
      onMovieClick={onMovieClick}
      onPlayClick={onPlayClick}
      favorites={favorites}
      onToggleFavorite={onToggleFavorite}
    />
  );
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showMyListOnly, setShowMyListOnly] = useState(false);

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
      return { search: activeSearchQuery.trim() };
    }
    if (selectedCategory) {
      return { search: selectedCategory, searchby: "category" };
    }
    return undefined;
  }, [activeSearchQuery, selectedCategory]);

  const { data: allMovies = [], isLoading: isMoviesLoading } =
    useMoviesQuery(movieParams);

  const isSearching =
    searchQuery.trim() !== activeSearchQuery.trim() || isMoviesLoading;

  const { data: recommendedMovies = [] } = useMoviesQuery({
    sort: "desc",
    sortby: "matchRate",
    page: 1,
    pagenumber: 5,
  });

  const { data: popularMovies = [] } = useMoviesQuery({
    sort: "desc",
    sortby: "views",
    page: 1,
    pagenumber: 10,
  });

  const { data: categories = [] } = useCategoriesQuery();
  const { data: universities = [] } = useUniversitiesQuery();
  const { data: directorsList = [] } = useCrewMembersQuery({
    search: "director",
    searchby: "role",
  });
  const { data: actorsList = [] } = useCrewMembersQuery({
    search: "cast",
    searchby: "role",
  });
  const { data: serverFavorites } = useFavoritesQuery(!!currentUser);

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

  const favorites = localFavorites ?? serverFavorites ?? [];

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
              <UniversityMovieRow
                key={uni.id}
                universityName={uni.name}
                title={`ผลงานภาพยนตร์จาก ${uni.name}`}
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
              <CategoryMovieRow
                key={category.id}
                categoryName={category.name}
                title={CATEGORY_TITLE_MAPPING[category.name]}
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
            <MovieGrid
              movies={filteredMovies}
              onMovieClick={setSelectedMovie}
              onPlayClick={handlePlayTrailer}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
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
