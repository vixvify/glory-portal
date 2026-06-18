import { Movie } from "@/core/domain/movie";
import { Category } from "@/core/domain/master-data";
import { CrewMember } from "@/core/domain/crew";
import MovieRow from "@/components/movie/rows/movie-row";
import MovieRowPortrait from "@/components/movie/rows/movie-row-portrait";
import MovieRankRow from "@/components/movie/rows/movie-rank-row";
import CrewRow from "@/components/crew/crew-row";
import MovieHero from "@/components/movie/heros/movie-hero";

interface HomeViewProps {
  recommendedMovies: Movie[];
  popularMovies: Movie[];
  awardsMovies: Movie[];
  categories: Category[];
  staffList: CrewMember[];
  actorList: CrewMember[];
  moviesByRating: Movie[];
  universityMovies: Movie[];
  categoryMoviesMap: Record<string, Movie[]>;
  favorites: Movie[];
  portraitMovies: Movie[];
  handlePlayMovie: (movie: Movie) => void;
  handleToggleFavorite: (movieId: string) => void;
}

export default function HomeView({
  recommendedMovies,
  popularMovies,
  awardsMovies,
  categories,
  staffList,
  actorList,
  universityMovies,
  categoryMoviesMap,
  moviesByRating,
  favorites,
  portraitMovies,
  handlePlayMovie,
  handleToggleFavorite,
}: HomeViewProps) {
  const universityName = universityMovies[0]?.university;

  return (
    <main className="flex-1 flex flex-col">
      <MovieHero
        movies={recommendedMovies}
        onPlayClick={handlePlayMovie}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
      />

      <div className="relative z-20 px-6 md:px-16 space-y-12 -mt-6 md:-mt-10">
        {universityMovies.length > 0 && universityName && (
          <MovieRow
            title={`ผลงานจาก ${universityName}`}
            movies={universityMovies}
            onPlayClick={handlePlayMovie}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        <MovieRow
          title="ชนะรางวัล"
          movies={awardsMovies}
          onPlayClick={handlePlayMovie}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />

        <MovieRow
          title="ถูกใจผู้ชม"
          movies={moviesByRating}
          onPlayClick={handlePlayMovie}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />

        <MovieRankRow
          title="ติดอันดับ"
          movies={popularMovies}
          onPlayClick={handlePlayMovie}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />

        {favorites.length > 0 && (
          <MovieRow
            title="รายการโปรดของคุณ"
            movies={favorites}
            onPlayClick={handlePlayMovie}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {categories.map((category) => (
          <MovieRow
            key={`${category.id}-views`}
            title={category.labelTh || category.name}
            movies={categoryMoviesMap[category.id] || []}
            onPlayClick={handlePlayMovie}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}

        <MovieRowPortrait
          title="ภาพยนตร์แนวตั้ง"
          movies={portraitMovies}
          onPlayClick={handlePlayMovie}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />

        {staffList.length > 0 && <CrewRow title="ทีมงาน" crew={staffList} />}

        {actorList.length > 0 && <CrewRow title="นักแสดง" crew={actorList} />}
      </div>
    </main>
  );
}
