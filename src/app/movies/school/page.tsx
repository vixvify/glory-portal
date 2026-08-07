"use client";

import { useMemo, useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { useMoviesQuery } from "@/hooks/db/use-movies";

import MovieRow from "@/components/movie/rows/movie-row";
import Loading from "@/app/loading";
import { useMoviePlayer } from "@/hooks/system/use-movie-player";
import { LayoutToggle, LayoutOrientation } from "@/components/ui/layout-toggle";
import { PageLayout } from "@/components/ui/page-layout";

import { Movie } from "@/core/domain/movie";
import { MOCK_SCHOOLS } from "@/core/constants/mock-schools";

function pickRandom<T>(arr: T[], count: number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, Math.min(count, a.length));
}

function RandomSchoolRow({
  school,
  orientation,
  onPlayClick,
}: {
  school: { searchKey: string; label: string };
  orientation: LayoutOrientation;
  onPlayClick: (movie: Movie) => void;
}) {
  const { data: movies = [], isLoading } = useMoviesQuery(
    { search: school.searchKey, searchby: "school", aspectRatio: orientation },
    { placeholderData: keepPreviousData }
  );

  if (isLoading || movies.length === 0) return null;

  return (
    <MovieRow
      title={school.label}
      movies={movies}
      onPlayClick={onPlayClick}
      orientation={orientation}
    />
  );
}

export default function SchoolPage() {
  const { playMovie: handlePlayMovie } = useMoviePlayer();
  const [orientation, setOrientation] = useState<LayoutOrientation>("landscape");

  const randomSchools = useMemo(() => pickRandom(MOCK_SCHOOLS, 2), []);

  const { data: allSchoolMovies = [], isLoading: isLoadingAll } = useMoviesQuery(
    { searchby: "school", aspectRatio: orientation },
    { placeholderData: keepPreviousData }
  );

  const isPageLoading = isLoadingAll;

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

          {randomSchools.map((school) => (
            <RandomSchoolRow
              key={school.searchKey}
              school={school}
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
