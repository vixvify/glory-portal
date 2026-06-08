"use client";

import { useQueries } from "@tanstack/react-query";
import { movieService } from "@/infra/container";
import { useMoviesQuery } from "@/hooks/use-movies";
import { useFavoritesQuery } from "@/hooks/use-favorites";
import { useCategoriesQuery } from "@/hooks/use-master-data";
import { useCrewMembersQuery } from "@/hooks/use-crew-members";
import { useAdminStatsQuery } from "@/hooks/use-admin";
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
    });

  const { data: popularMovies = [], isLoading: isPopLoading } = useMoviesQuery({
    sort: "desc",
    sortby: "views",
    page: 1,
    pagesize: 10,
  });

  const { data: categories = [], isLoading: isCatLoading } =
    useCategoriesQuery();

  const { data: directorsList = [], isLoading: isDirsLoading } =
    useCrewMembersQuery({
      search: "director",
      searchby: "role",
    });

  const { data: actorsList = [], isLoading: isActorsLoading } =
    useCrewMembersQuery({
      search: "cast",
      searchby: "role",
    });

  const { data: portaitMovie = [], isLoading: isPortaitLoading } =
    useMoviesQuery({
      search: "แนวตั้ง",
      searchby: "aspectRatio",
      page: 1,
      pagesize: 10,
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
    });

  const categoryMovieQueries = useQueries({
    queries: categories.map((category) => ({
      queryKey: [
        "movies",
        {
          search: category.name,
          searchby: "category",
          page: 1,
          pagesize: 10,
        },
      ],
      queryFn: () =>
        movieService.getMovies({
          search: category.name,
          searchby: "category",
          page: 1,
          pagesize: 10,
        }),
    })),
  });

  const isAnyLoading =
    isRecLoading ||
    isPopLoading ||
    isCatLoading ||
    isMovieUniLoading ||
    isDirsLoading ||
    isActorsLoading ||
    isStatsLoading ||
    isPortaitLoading ||
    (!!currentUser && isFavsLoading) ||
    categoryMovieQueries.some((q) => q.isLoading);

  if (isAnyLoading) {
    return <Loading />;
  }

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
      directorsList={directorsList}
      actorsList={actorsList}
      portaitMovie={portaitMovie}
      universityMovies={movieByUniversity}
      categoryMoviesMap={categoryMoviesMap}
      favorites={serverFavorites}
    />
  );
}
