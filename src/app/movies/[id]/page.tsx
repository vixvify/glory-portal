"use client";

import React, { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  useAddRatingMutation,
  useUpdateRatingMutation,
  useDeleteRatingMutation,
  useMovieUserRatingQuery,
} from "@/hooks/db/use-ratings";
import { useMovieQueryById } from "@/hooks/db/use-movies";
import { useAppStore } from "@/store/use-store";
import Loading from "@/app/loading";
import PlayerModal from "@/components/modal/player-modal";
import { useMoviePlayer } from "@/hooks/system/use-movie-player";
import MovieDetailHero from "@/components/movie/detail/movie-detail-hero";
import MovieRatingPanel from "@/components/movie/detail/movie-rating-panel";
import MovieInfoPanel from "@/components/movie/detail/movie-info-panel";
import MovieCrewRow from "@/components/movie/rows/movie-crew-row";
import MovieBtsSection from "@/components/movie/detail/movie-bts-section";
import { MOVIE_MESSAGES } from "@/core/constants/movie-messages";
import { AUTH_MESSAGES } from "@/core/constants/auth-messages";
import { COMMON_MESSAGES } from "@/core/constants/common-messages";
import { useFavoriteHandler } from "@/hooks/system/use-favorite-handler";

export default function MovieDetails() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { currentUser, showToast } = useAppStore();

  const { data: movie, isLoading } = useMovieQueryById(params.id);
  const { data: userRating } = useMovieUserRatingQuery(
    movie?.id ?? "",
    !!currentUser,
  );
  
  const { favorites, handleToggleFavorite } = useFavoriteHandler();

  const addRatingMutation = useAddRatingMutation();
  const updateRatingMutation = useUpdateRatingMutation();
  const deleteRatingMutation = useDeleteRatingMutation();

  const isRatingPending =
    addRatingMutation.isPending ||
    updateRatingMutation.isPending ||
    deleteRatingMutation.isPending;

  const { playMovie } = useMoviePlayer();
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);

  const handleAddRating = useCallback(
    (movieId: string, stars: number, comment: string) => {
      addRatingMutation.mutate(
        { movieId, stars, comment: comment.trim() || null },
        {
          onSuccess: () => showToast(MOVIE_MESSAGES.TOAST.ADD_RATING_SUCCESS, "success"),
          onError: () => showToast(COMMON_MESSAGES.ERRORS.DEFAULT, "error"),
        },
      );
    },
    [addRatingMutation, showToast],
  );

  const handleUpdateRating = useCallback(
    (movieId: string, stars: number, comment: string) => {
      updateRatingMutation.mutate(
        { movieId, stars, comment: comment.trim() || null },
        {
          onSuccess: () => showToast(MOVIE_MESSAGES.TOAST.EDIT_RATING_SUCCESS, "success"),
          onError: () => showToast(COMMON_MESSAGES.ERRORS.DEFAULT, "error"),
        },
      );
    },
    [updateRatingMutation, showToast],
  );

  const handleDeleteRating = useCallback(
    (movieId: string) => {
      deleteRatingMutation.mutate(
        { movieId },
        {
          onSuccess: () => showToast(MOVIE_MESSAGES.TOAST.DELETE_RATING_SUCCESS, "success"),
          onError: () => showToast(COMMON_MESSAGES.ERRORS.DEFAULT, "error"),
        },
      );
    },
    [deleteRatingMutation, showToast],
  );

  if (isLoading) return <Loading />;
  if (!movie) return null;

  return (
    <div className="min-h-screen bg-transparent text-white font-sans selection:bg-brand selection:text-black">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-10 animate-fade-in">
        <MovieDetailHero
          movie={movie}
          onPlayClick={() => playMovie(movie)}
          onTrailerClick={() => setIsPlayingTrailer(true)}
          isFavorite={favorites.some((fav) => fav.id === movie.id)}
          onToggleFavorite={() => handleToggleFavorite(movie.id)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2 md:px-4">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2 text-sm text-zinc-400">
              <span className="text-zinc-200">
                {movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" }) : ""}
              </span>

              <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
              <span className="px-1.5 py-0.5 text-xs font-bold border border-zinc-800 text-zinc-300 rounded bg-zinc-900/50">
                {movie.ageRating}
              </span>

              <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
              <span className="text-zinc-200">{movie.duration} นาที</span>

              {movie.categories && movie.categories.map((cat) => (
                <React.Fragment key={cat.id}>
                  <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-brand/10 border border-brand/20 text-brand rounded-full whitespace-nowrap">
                    {cat.labelTh || cat.name}
                  </span>
                </React.Fragment>
              ))}
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-zinc-400 tracking-wide uppercase">
                เรื่องย่อ
              </h3>
              <p className="text-zinc-200 text-sm leading-relaxed font-light">
                {movie.description}
              </p>
            </div>

            {(() => {
              const activeWarnings = [...(movie.contentWarnings || [])];
              if (movie.otherContentWarning) activeWarnings.push(movie.otherContentWarning);
              
              if (activeWarnings.length === 0) return null;
              
              return (
                <div className="flex items-start gap-2 text-xs text-red-400/90 pt-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse flex-shrink-0 mt-1.5" />
                  <span className="font-semibold flex-shrink-0 mt-0.5">
                    คำเตือนเนื้อหา:
                  </span>
                  <span className="text-zinc-400 font-normal leading-relaxed">
                    {activeWarnings.join(", ")}
                  </span>
                </div>
              );
            })()}

            <MovieCrewRow crew={movie.crew ?? []} />

            <MovieBtsSection btsVideos={movie.btsVideos ?? []} />
          </div>

          <div className="space-y-6">
            <MovieRatingPanel
              movieId={movie.id}
              averageRating={movie.averageRating}
              ratings={movie.ratings ?? []}
              userRating={userRating}
              isLoggedIn={!!currentUser}
              isPending={isRatingPending}
              onAdd={handleAddRating}
              onUpdate={handleUpdateRating}
              onDelete={handleDeleteRating}
              onAuthRequired={() => {
                showToast(AUTH_MESSAGES.TOAST.LOGIN_REQUIRED_VOTE, "warning");
                router.push("/auth/login");
              }}
            />

            <MovieInfoPanel movie={movie} />
          </div>
        </div>
      </div>

      {isPlayingTrailer && movie.trailerUrls?.[0] && (
        <PlayerModal
          isOpen={isPlayingTrailer}
          onClose={() => setIsPlayingTrailer(false)}
          youtubeUrl={movie.trailerUrls?.[0]}
          movieTitle={`${movie.title} (ตัวอย่างภาพยนตร์)`}
        />
      )}
    </div>
  );
}
