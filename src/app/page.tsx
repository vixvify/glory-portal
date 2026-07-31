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

  const getCuratedMovies = (categoryName: string) =>
    movieService.getMovies({
      search: categoryName,
      searchby: "category",
      page: 1,
      pagesize: 10,
      sort: "desc",
      sortby: "createdAt",
      aspectRatio: "landscape",
    });

  const [
    movieByUniversity,
    dramaMovies,
    thrillerMovies,
    horrorMovies,
    comedyMovies,
    romanceMovies,
  ] = await Promise.all([
    movieByUniversityPromise,
    getCuratedMovies("ดราม่า"),
    getCuratedMovies("ระทึกขวัญ"),
    getCuratedMovies("สยองขวัญ"),
    getCuratedMovies("ตลก"),
    getCuratedMovies("โรแมนติก"),
  ]);

  // Combine, deduplicate, and sort using a declarative approach
  const thrillerHorrorMovies = Array.from(
    new Map([...thrillerMovies, ...horrorMovies].map((m) => [m.id, m])).values()
  )
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    )
    .slice(0, 10);

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
      dramaMovies={dramaMovies}
      thrillerHorrorMovies={thrillerHorrorMovies}
      comedyMovies={comedyMovies}
      romanceMovies={romanceMovies}
    />
  );
}
