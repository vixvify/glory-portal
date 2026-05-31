import {
  movieService,
  masterDataService,
  crewMemberService,
} from "@/infra/container";
import HomePage from "./home/Home";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [
    recommendedMovies,
    popularMovies,
    categories,
    universities,
    directorsList,
    actorsList,
    allMovies,
  ] = await Promise.all([
    movieService.getMovies({
      sort: "desc",
      sortby: "matchRate",
      page: 1,
      pagenumber: 5,
    }),
    movieService.getMovies({
      sort: "desc",
      sortby: "views",
      page: 1,
      pagenumber: 10,
    }),
    masterDataService.getCategories(),
    masterDataService.getUniversities(),
    crewMemberService.getCrewMembers({
      search: "director",
      searchby: "role",
    }),
    crewMemberService.getCrewMembers({
      search: "cast",
      searchby: "role",
    }),
    movieService.getMovies(),
  ]);

  const universityMoviesList = await Promise.all(
    universities.map(async (uni) => {
      const movies = await movieService.getMovies({
        search: uni.name,
        searchby: "university",
      });
      return { id: uni.id, movies };
    }),
  );

  const categoryMoviesList = await Promise.all(
    categories.map(async (category) => {
      const movies = await movieService.getMovies({
        search: category.name,
        searchby: "category",
      });
      return { id: category.id, movies };
    }),
  );

  const universityMoviesMap = Object.fromEntries(
    universityMoviesList.map((item) => [item.id, item.movies]),
  );

  const categoryMoviesMap = Object.fromEntries(
    categoryMoviesList.map((item) => [item.id, item.movies]),
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
    />
  );
}
