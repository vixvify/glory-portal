"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { keepPreviousData } from "@tanstack/react-query";
import { useMoviesQuery } from "@/hooks/db/use-movies";

import MovieGrid from "@/components/movie/grids/movie-grid";
import Loading from "@/app/loading";
import { useMoviePlayer } from "@/hooks/system/use-movie-player";
import { LayoutToggle, LayoutOrientation } from "@/components/ui/layout-toggle";
import { PageLayout } from "@/components/ui/page-layout";

export default function SchoolDetailPage() {
  const params = useParams<{ school: string }>();
  const schoolName = params.school ? decodeURIComponent(params.school) : "";
  const displaySchoolName = schoolName;

  const { playMovie: handlePlayMovie } = useMoviePlayer();
  const [orientation, setOrientation] = useState<LayoutOrientation>("landscape");

  const { data: moviesBySchool = [], isLoading: isLoadingSchool } = useMoviesQuery(
    { search: schoolName, searchby: "school", aspectRatio: orientation },
    { placeholderData: keepPreviousData }
  );

  const isPageLoading = isLoadingSchool;

  if (isPageLoading) {
    return <Loading />;
  }

  return (
    <PageLayout>
      <div className="space-y-8">
        <div className="flex justify-start">
          <LayoutToggle value={orientation} onChange={setOrientation} />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-white">
          {displaySchoolName}
        </h1>

        {moviesBySchool.length === 0 ? (
          <div className="text-center py-24 space-y-3">
            <p className="text-lg text-zinc-500 font-light">
              ไม่พบภาพยนตร์จากโรงเรียนนี้ในระบบ
            </p>
          </div>
        ) : (
          <div className="pb-10">
            <MovieGrid
              movies={moviesBySchool}
              onPlayClick={handlePlayMovie}
              orientation={orientation}
            />
          </div>
        )}
      </div>
    </PageLayout>
  );
}
