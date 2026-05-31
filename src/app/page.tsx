"use client";

import { useQueries } from "@tanstack/react-query";
import { movieService } from "@/infra/container";
import { useMoviesQuery } from "@/hooks/use-movies";
import { useFavoritesQuery } from "@/hooks/use-favorites";
import {
  useCategoriesQuery,
  useUniversitiesQuery,
} from "@/hooks/use-master-data";
import { useCrewMembersQuery } from "@/hooks/use-crew-members";
import { useAppStore } from "@/store/use-store";
import HomePage from "./home/Home";

export default function Page() {
  const { currentUser } = useAppStore();

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

  const { data: serverFavorites = [] } = useFavoritesQuery(!!currentUser);

  const universityMovieQueries = useQueries({
    queries: universities.map((uni) => ({
      queryKey: [
        "movies",
        { search: uni.name, searchby: "university", page: 1, pagenumber: 10 },
      ],
      queryFn: () =>
        movieService.getMovies({
          search: uni.name,
          searchby: "university",
          page: 1,
          pagenumber: 10,
        }),
    })),
  });

  const categoryMovieQueries = useQueries({
    queries: categories.map((category) => ({
      queryKey: [
        "movies",
        {
          search: category.name,
          searchby: "category",
          page: 1,
          pagenumber: 10,
        },
      ],
      queryFn: () =>
        movieService.getMovies({
          search: category.name,
          searchby: "category",
          page: 1,
          pagenumber: 10,
        }),
    })),
  });

  const { data: allMovies = [] } = useMoviesQuery();

  const universityMoviesMap = Object.fromEntries(
    universities.map((uni, index) => [
      uni.id,
      universityMovieQueries[index]?.data || [],
    ]),
  );

  const categoryMoviesMap = Object.fromEntries(
    categories.map((category, index) => [
      category.id,
      categoryMovieQueries[index]?.data || [],
    ]),
  );

  return (
    <HomePage
      recommendedMovies={recommendedMovies}
      popularMovies={popularMovies}
      categories={categories}
      universities={universities}
      directorsList={directorsList}
      actorsList={actorsList}
      universityMoviesMap={universityMoviesMap}
      categoryMoviesMap={categoryMoviesMap}
      initialAllMovies={allMovies}
      serverFavorites={serverFavorites}
    />
  );
}
