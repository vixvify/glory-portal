"use client";

import { useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { useMoviesQuery } from "@/hooks/db/use-movies";
import { useSchoolsQuery } from "@/hooks/db/use-master-data";

import MovieRow from "@/components/movie/rows/movie-row";
import Loading from "@/app/loading";
import { useMoviePlayer } from "@/hooks/system/use-movie-player";
import { LayoutToggle, LayoutOrientation } from "@/components/ui/layout-toggle";
import { PageLayout } from "@/components/ui/page-layout";
import { Movie } from "@/core/domain/movie";

function SchoolMovieRow({
  schoolName,
  orientation,
  onPlayClick,
}: {
  schoolName: string;
  orientation: LayoutOrientation;
  onPlayClick: (movie: Movie) => void;
}) {
  const { data: movies = [], isLoading } = useMoviesQuery(
    { search: schoolName, searchby: "school", aspectRatio: orientation },
    { placeholderData: keepPreviousData }
  );

  if (isLoading || movies.length === 0) return null;

  return (
    <MovieRow
      title={schoolName}
      movies={movies}
      onPlayClick={onPlayClick}
      orientation={orientation}
    />
  );
}

export default function SchoolPage() {
  const { playMovie: handlePlayMovie } = useMoviePlayer();
  const [orientation, setOrientation] = useState<LayoutOrientation>("landscape");

  const { data: schools = [], isLoading: isLoadingSchools } = useSchoolsQuery();
  const { data: allSchoolMovies = [], isLoading: isLoadingAll } = useMoviesQuery(
    { searchby: "school", aspectRatio: orientation },
    { placeholderData: keepPreviousData }
  );

  const isPageLoading = isLoadingAll || isLoadingSchools;

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
          {allSchoolMovies.length > 0 && (
            <MovieRow
              title="ผลงานจากนักเรียน"
              movies={allSchoolMovies}
              onPlayClick={handlePlayMovie}
              orientation={orientation}
            />
          )}

          {schools.map((school) => (
            <SchoolMovieRow
              key={school.id}
              schoolName={school.name}
              orientation={orientation}
              onPlayClick={handlePlayMovie}
            />
          ))}

          {allSchoolMovies.length === 0 && (
            <div className="text-center py-24 space-y-3">
              <p className="text-lg text-zinc-500 font-light">
                ยังไม่มีภาพยนตร์จากโรงเรียนในระบบ
              </p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

