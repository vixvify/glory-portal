"use client";

import { useQueries } from "@tanstack/react-query";
import { movieService } from "@/infra/container";
import { useMoviesQuery } from "@/hooks/db/use-movies";
import { useFavoritesQuery } from "@/hooks/db/use-favorites";
import { useCategoriesQuery } from "@/hooks/db/use-master-data";
import { useCrewMembersQuery } from "@/hooks/db/use-crew-members";
import { useAdminStatsQuery } from "@/hooks/db/use-admin";
import { useAppStore } from "@/store/use-store";
import HomePage from "./home/home";
import Loading from "./loading";

export default function Page() {
  const { currentUser } = useAppStore();

  const { data: recommendedMovies = [], isLoading: isRecLoading } =
    useMoviesQuery({
      sort: "desc",
      sortby: "matchRate",
      page: 1,
      pagesize: 5,
      aspectRatio: "landscape",
    });

  const { data: popularMovies = [], isLoading: isPopLoading } = useMoviesQuery({
    sort: "desc",
    sortby: "views",
    page: 1,
    pagesize: 10,
    aspectRatio: "landscape",
  });

  const { data: categories = [], isLoading: isCatLoading } =
    useCategoriesQuery();

  const { data: staffList = [], isLoading: isStaffsLoading } =
    useCrewMembersQuery();

  const { data: actorList = [], isLoading: isActorsLoading } =
    useCrewMembersQuery({ search: "cast", searchby: "role" });

  const { data: portraitMovies = [], isLoading: isPortraitLoading } =
    useMoviesQuery({
      page: 1,
      pagesize: 10,
      aspectRatio: "portrait",
    });

  const { data: serverFavorites = [], isLoading: isFavsLoading } =
    useFavoritesQuery(!!currentUser);

  const { data: adminStats, isLoading: isStatsLoading } = useAdminStatsQuery();

  const { data: movieByUniversity = [], isLoading: isMovieUniLoading } =
    useMoviesQuery({
      search: adminStats?.mostActiveUniversity,
      searchby: "university",
      page: 1,
      pagesize: 10,
      aspectRatio: "landscape",
    });

  const { data: moviesByRating = [], isLoading: isMovieRatingLoading } =
    useMoviesQuery({
      sort: "desc",
      sortby: "averageRating",
      page: 1,
      pagesize: 10,
      aspectRatio: "landscape",
    });

  const categoryMovie = useQueries({
    queries: categories.map((category) => ({
      queryKey: [
        "movies",
        {
          search: category.name,
          searchby: "category",
          page: 1,
          pagesize: 10,
          aspectRatio: "landscape",
        },
      ],
      queryFn: () =>
        movieService.getMovies({
          search: category.name,
          searchby: "category",
          page: 1,
          pagesize: 10,
          aspectRatio: "landscape",
        }),
    })),
  });

  const isCoreLoading =
    isRecLoading ||
    isPopLoading ||
    isCatLoading ||
    isStaffsLoading ||
    isActorsLoading ||
    isStatsLoading ||
    isPortraitLoading ||
    isMovieUniLoading ||
    isMovieRatingLoading ||
    (!!currentUser && isFavsLoading) ||
    categoryMovie.some((q) => q.isLoading);

  if (isCoreLoading) {
    return <Loading />;
  }

  const categoryMoviesMap = Object.fromEntries(
    categories.map((category, index) => [
      category.id,
      categoryMovie[index]?.data || [],
    ]),
  );

  return (
    <HomePage
      recommendedMovies={recommendedMovies}
      popularMovies={popularMovies}
      categories={categories}
      staffList={staffList}
      actorList={actorList}
      portraitMovies={portraitMovies}
      universityMovies={movieByUniversity}
      moviesByRating={moviesByRating}
      categoryMoviesMap={categoryMoviesMap}
      favorites={serverFavorites}
    />
  );
}
