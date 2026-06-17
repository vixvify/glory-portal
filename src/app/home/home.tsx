"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMoviePlayer } from "@/hooks/system/use-movie-player";
import { Movie } from "@/core/domain/movie";
import { useAppStore } from "@/store/use-store";
import { Toast } from "@/components/ui/toast";
import { useMoviesQuery } from "@/hooks/db/use-movies";
import { useToggleFavoriteMutation } from "@/hooks/db/use-favorites";
import { Category } from "@/core/domain/movie";
import { CrewMember } from "@/core/domain/crew";
import { useDebounce } from "@/hooks/system/use-debounce";
import HomeView from "@/components/views/home-view";
import SearchView from "@/components/views/search-view";

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

interface Props {
  recommendedMovies: Movie[];
  popularMovies: Movie[];
  awardsMovies: Movie[];
  categories: Category[];
  staffList: CrewMember[];
  actorList: CrewMember[];
  moviesByRating: Movie[];
  universityMovies: Movie[];
  categoryMoviesMap: Record<string, Movie[]>;
  favorites: Movie[];
  portraitMovies: Movie[];
}

export interface BtsVideoItem {
  id: string;
  movie: Movie;
  videoUrl: string;
  title: string;
  thumbnailUrl: string;
}

export default function HomePage(props: Props) {
  const {
    recommendedMovies,
    popularMovies,
    awardsMovies,
    categories,
    staffList,
    actorList,
    moviesByRating,
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

  const allMovies = useMemo(() => {
    const map = new Map<string, Movie>();
    const addMovies = (movies: Movie[] = []) => {
      movies.forEach(m => map.set(m.id, m));
    };
    addMovies(recommendedMovies);
    addMovies(popularMovies);
    addMovies(awardsMovies);
    addMovies(moviesByRating);
    addMovies(portraitMovies);
    Object.values(categoryMoviesMap || {}).forEach(addMovies);
    return Array.from(map.values());
  }, [recommendedMovies, popularMovies, awardsMovies, moviesByRating, portraitMovies, categoryMoviesMap]);

  const btsVideos = useMemo(() => {
    const items: BtsVideoItem[] = [];
    const moviesWithBts = allMovies.filter(
      (m) => m.btsVideos && m.btsVideos.length > 0,
    );

    const shuffledMovies = shuffleArray(moviesWithBts);

    shuffledMovies.forEach((movie) => {
      const btsClips = movie.btsVideos || [];
      btsClips.forEach((videoUrl, index) => {
        let videoId = "";
        try {
          const urlObj = new URL(videoUrl);
          if (urlObj.hostname.includes("youtube.com")) {
            videoId = urlObj.searchParams.get("v") || "";
          } else if (urlObj.hostname.includes("youtu.be")) {
            videoId = urlObj.pathname.slice(1);
          }
        } catch {}
        
        const thumbnailUrl = videoId 
          ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
          : "";

        const titleSuffix = btsClips.length > 1 ? ` (พาร์ท ${index + 1})` : "";
        const title = `เบื้องหลัง: ${movie.title}${titleSuffix}`;

        items.push({
          id: `${movie.id}-${index}`,
          movie,
          videoUrl,
          title,
          thumbnailUrl,
        });
      });
    });

    return items;
  }, [allMovies]);

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
          categoryMoviesMap={categoryMoviesMap}
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
