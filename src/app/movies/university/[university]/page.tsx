"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { keepPreviousData } from "@tanstack/react-query";
import { useMoviesQuery } from "@/hooks/db/use-movies";
import { useFavoriteHandler } from "@/hooks/system/use-favorite-handler";

import MovieGrid from "@/components/movie/grids/movie-grid";
import { useMoviePlayer } from "@/hooks/system/use-movie-player";
import { LayoutToggle, LayoutOrientation } from "@/components/ui/layout-toggle";
import { PageLayout } from "@/components/ui/page-layout";
import Loading from "@/app/loading";

export default function UniversityPage() {
  const params = useParams<{ university: string }>();
  const universityName = params.university
    ? decodeURIComponent(params.university)
    : "";

  const { playMovie: handlePlayMovie } = useMoviePlayer();
  const { favorites, handleToggleFavorite } = useFavoriteHandler();

  const [orientation, setOrientation] = useState<LayoutOrientation>("landscape");

  const { data: movies = [], isLoading } = useMoviesQuery({
    search: universityName,
    searchby: "university",
    aspectRatio: orientation,
  }, { placeholderData: keepPreviousData });



  if (isLoading) {
    return <Loading />;
  }

  return (
    <PageLayout>
      <div className="space-y-8">
        <div className="flex justify-start">
          <LayoutToggle value={orientation} onChange={setOrientation} />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-white">
          ผลงานจาก {universityName}
        </h1>

        {movies.length === 0 ? (
          <div className="text-center py-24 space-y-3">
            <p className="text-lg text-zinc-500 font-light">
              ไม่พบภาพยนตร์จากสถาบันนี้ในระบบ
            </p>
          </div>
        ) : (
          <div className="pb-10">
            <MovieGrid
              movies={movies}
              onPlayClick={handlePlayMovie}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              orientation={orientation}
            />
          </div>
        )}
      </div>
    </PageLayout>
  );
}
