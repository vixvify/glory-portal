"use client";

import { useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { useMoviesQuery } from "@/hooks/db/use-movies";
import MovieRow from "@/components/movie/rows/movie-row";
import Loading from "@/app/loading";
import { useMoviePlayer } from "@/hooks/system/use-movie-player";
import { LayoutToggle, LayoutOrientation } from "@/components/ui/layout-toggle";
import { PageLayout } from "@/components/ui/page-layout";

export default function TrendingPage() {
  const { playMovie: handlePlayMovie } = useMoviePlayer();
  const [orientation, setOrientation] = useState<LayoutOrientation>("landscape");

  const { data: newMovies = [], isLoading: isLoadingNew } = useMoviesQuery(
    {
      sort: "desc",
      sortby: "createdAt",
      page: 1,
      pagesize: 10,
      aspectRatio: orientation,
    },
    { placeholderData: keepPreviousData }
  );

  const { data: popularNewMovies = [], isLoading: isLoadingPopNew } =
    useMoviesQuery(
      {
        sort: "desc",
        sortby: "views",
        page: 1,
        pagesize: 10,
        aspectRatio: orientation,
      },
      { placeholderData: keepPreviousData }
    );

  const { data: ratedNewMovies = [], isLoading: isLoadingRatedNew } =
    useMoviesQuery(
      {
        sort: "desc",
        sortby: "averageRating",
        page: 1,
        pagesize: 10,
        aspectRatio: orientation,
      },
      { placeholderData: keepPreviousData }
    );

  const isPageLoading =
    isLoadingNew ||
    isLoadingPopNew ||
    isLoadingRatedNew;

  if (isPageLoading) {
    return <Loading />;
  }

  return (
    <PageLayout>
      <div className="space-y-8">
        <div className="flex justify-start">
          <LayoutToggle value={orientation} onChange={setOrientation} />
        </div>

        <div className="space-y-12 pb-10">
          <MovieRow
            title={orientation === "landscape" ? "มาใหม่" : "แนวตั้งมาใหม่"}
            movies={newMovies}
            onPlayClick={handlePlayMovie}
            orientation={orientation}
          />
          <MovieRow
            title={orientation === "landscape" ? "มาแรง" : "แนวตั้งมาแรง"}
            movies={popularNewMovies}
            onPlayClick={handlePlayMovie}
            orientation={orientation}
          />
          <MovieRow
            title={orientation === "landscape" ? "ถูกใจผู้ชม" : "แนวตั้งถูกใจผู้ชม"}
            movies={ratedNewMovies}
            onPlayClick={handlePlayMovie}
            orientation={orientation}
          />
        </div>
      </div>
    </PageLayout>
  );
}
