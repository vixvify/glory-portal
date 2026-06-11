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

  const { data: directorsList = [], isLoading: isDirsLoading } =
    useCrewMembersQuery({ search: "director", searchby: "role" });

  const { data: actorsList = [], isLoading: isActorsLoading } =
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

  const categoryMovieQueries = useQueries({
    queries: categories.map((category) => ({
      queryKey: [
        "movies",
        {
          search: category.name,
          searchby: "category",
          page: 1,
          pagesize: 10,
          aspectRatio: "แนวนอน",
        },
      ],
      queryFn: () =>
        movieService.getMovies({
          search: category.name,
          searchby: "category",
          page: 1,
          pagesize: 10,
          aspectRatio: "แนวนอน",
        }),
    })),
  });

  const isCoreLoading =
    isRecLoading ||
    isPopLoading ||
    isCatLoading ||
    isDirsLoading ||
    isActorsLoading ||
    isStatsLoading ||
    isPortraitLoading ||
    isMovieUniLoading ||
    (!!currentUser && isFavsLoading) ||
    categoryMovieQueries.some((q) => q.isLoading);

  if (isCoreLoading) {
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
      portraitMovies={portraitMovies}
      universityMovies={movieByUniversity}
      categoryMoviesMap={categoryMoviesMap}
      favorites={serverFavorites}
    />
  );
}
