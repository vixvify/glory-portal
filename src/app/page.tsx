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
  const getCuratedMovies = async (categoryName: string) => {
    const movies = await movieService.getMovies({
      search: categoryName,
      searchby: "category",
      page: 1,
      pagesize: 10,
      aspectRatio: "landscape",
    });

    return movies.slice(0, 10);
  };

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
    dramaMovies,
    thrillerMovies,
    horrorMovies,
    comedyMovies,
    romanceMovies,
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
    crewMemberService.getCrewMembers({ page: 1, pagesize: 20 }),
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
    getCuratedMovies("drama"),
    getCuratedMovies("thriller"),
    getCuratedMovies("horror"),
    getCuratedMovies("comedy"),
    getCuratedMovies("romance"),
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

  const movieByUniversity = await movieByUniversityPromise;


  const thrillerHorrorMovies = Array.from(
    new Map([...thrillerMovies, ...horrorMovies].map((m) => [m.id, m])).values()
  ).slice(0, 10);

  const btsVideos = mapMoviesToBtsVideos(moviesWithBts).slice(0, 10);

  return (
    <HomePage
      btsVideos={btsVideos}
      recommendedMovies={recommendedMovies}
      popularMovies={popularMovies}
      awardsMovies={moviesWithAward.slice(0, 10)}
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
