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
      aspectRatio: "แนวนอน",
    });

  const { data: popularMovies = [], isLoading: isPopLoading } = useMoviesQuery({
    sort: "desc",
    sortby: "views",
    page: 1,
    pagesize: 10,
    aspectRatio: "แนวนอน",
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
      aspectRatio: "แนวตั้ง",
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
      aspectRatio: "แนวนอน",
    });

  const categoryMovieQueriesByViews = useQueries({
    queries: categories.map((category) => ({
      queryKey: [
        "movies",
        {
          search: category.name,
          searchby: "category",
          page: 1,
          pagesize: 10,
          aspectRatio: "แนวนอน",
          sort: "desc",
          sortby: "views",
        },
      ],
      queryFn: () =>
        movieService.getMovies({
          search: category.name,
          searchby: "category",
          page: 1,
          pagesize: 10,
          aspectRatio: "แนวนอน",
          sort: "desc",
          sortby: "views",
        }),
    })),
  });

  const categoryMovieQueriesByRating = useQueries({
    queries: categories.map((category) => ({
      queryKey: [
        "movies",
        {
          search: category.name,
          searchby: "category",
          page: 1,
          pagesize: 10,
          aspectRatio: "แนวนอน",
          sort: "desc",
          sortby: "averageRating",
        },
      ],
      queryFn: () =>
        movieService.getMovies({
          search: category.name,
          searchby: "category",
          page: 1,
          pagesize: 10,
          aspectRatio: "แนวนอน",
          sort: "desc",
          sortby: "averageRating",
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
    (!!currentUser && isFavsLoading) ||
    categoryMovieQueriesByViews.some((q) => q.isLoading);

  if (isCoreLoading) {
    return <Loading />;
  }

  const categoryMoviesByViewsMap = Object.fromEntries(
    categories.map((category, index) => [
      category.id,
      categoryMovieQueriesByViews[index]?.data || [],
    ]),
  );

  const categoryMoviesByRatingMap = Object.fromEntries(
    categories.map((category, index) => [
      category.id,
      categoryMovieQueriesByRating[index]?.data || [],
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
      categoryMoviesByViews={categoryMoviesByViewsMap}
      categoryMoviesByRating={categoryMoviesByRatingMap}
      favorites={serverFavorites}
    />
  );
}
