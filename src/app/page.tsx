import {
  movieService,
  masterDataService,
  crewMemberService,
} from "@/infra/container";
import { mapMoviesToBtsVideos } from "@/utils/movie-bts";
import { splitCrewByRole } from "@/utils/crew";
import HomePage from "./home/home";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [
    recommendedMovies,
    popularMovies,
    categories,
    allCrewMembers,
    portraitMovies,
    mostActiveUniversity,
    moviesByRating,
    moviesWithAward,
    moviesWithBts,
  ] = await Promise.all([
    movieService.getMovies({
      sort: "desc",
      sortby: "matchRate",
      page: 1,
      pagesize: 5,
      aspectRatio: "landscape",
    }),
    movieService.getMovies({
      sort: "desc",
      sortby: "views",
      page: 1,
      pagesize: 10,
      aspectRatio: "landscape",
    }),
    masterDataService.getCategories(),
    crewMemberService.getCrewMembers(),
    movieService.getMovies({
      page: 1,
      pagesize: 10,
      aspectRatio: "portrait",
    }),
    masterDataService.getMostActiveUniversity(),
    movieService.getMovies({
      sort: "desc",
      sortby: "averageRating",
      page: 1,
      pagesize: 10,
      aspectRatio: "landscape",
    }),
    movieService.getMoviesWithAward(),
    movieService.getMoviesWithBts(),
  ]);

  const { actorList, staffList } = splitCrewByRole(allCrewMembers);

  const movieByUniversityPromise = mostActiveUniversity
    ? movieService.getMovies({
        search: mostActiveUniversity,
        searchby: "university",
        page: 1,
        pagesize: 10,
        aspectRatio: "landscape",
      })
    : Promise.resolve([]);

  const categoryMoviePromises = categories.map(async (category) => {
    const movies = await movieService.getMovies({
      search: category.name,
      searchby: "category",
      page: 1,
      pagesize: 10,
      aspectRatio: "landscape",
    });
    return [category.id, movies] as const;
  });

  const [movieByUniversity, ...categoryMoviesEntries] = await Promise.all([
    movieByUniversityPromise,
    ...categoryMoviePromises,
  ]);

  const categoryMoviesMap = Object.fromEntries(categoryMoviesEntries);
  const btsVideos = mapMoviesToBtsVideos(moviesWithBts);

  return (
    <HomePage
      btsVideos={btsVideos}
      recommendedMovies={recommendedMovies}
      popularMovies={popularMovies}
      awardsMovies={moviesWithAward}
      categories={categories}
      staffList={staffList}
      actorList={actorList}
      portraitMovies={portraitMovies}
      universityMovies={movieByUniversity}
      moviesByRating={moviesByRating}
      categoryMoviesMap={categoryMoviesMap}
    />
  );
}
