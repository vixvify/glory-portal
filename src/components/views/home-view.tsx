import { Movie, Category, University } from "@/core/domain/movie";
import { CrewMember } from "@/core/domain/crew";
import { CATEGORY_TITLE_MAPPING } from "@/core/constants/categories";
import MovieRow from "@/components/movie/movie-row";
import MovieRankRow from "@/components/movie/movie-rank-row";
import CrewRow from "@/components/crew/crew-row";
import MovieHero from "@/components/movie/movie-hero";

interface HomeViewProps {
  recommendedMovies: Movie[];
  popularMovies: Movie[];
  categories: Category[];
  directorsList: CrewMember[];
  actorsList: CrewMember[];
  universityMovies: Movie[];
  categoryMoviesMap: Record<string, Movie[]>;
  favorites: Movie[];
  handlePlayMovie: (movie: Movie) => void;
  handleToggleFavorite: (movieId: string) => void;
  setSearchQuery: (query: string) => void;
}

export default function HomeView({
  recommendedMovies,
  popularMovies,
  categories,
  directorsList,
  actorsList,
  universityMovies,
  categoryMoviesMap,
  favorites,
  handlePlayMovie,
  handleToggleFavorite,
}: HomeViewProps) {
  return (
    <main className="flex-1 flex flex-col">
      <MovieHero
        movies={recommendedMovies}
        onPlayClick={handlePlayMovie}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
      />

      <div className="relative z-20 px-6 md:px-16 space-y-12 -mt-6 md:-mt-10">
        <MovieRankRow
          title="10 อันดับหนังยอดนิยม"
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

        <MovieRow
          title={`ผลงานภาพยนตร์จาก ${universityMovies[0].university?.name}`}
          movies={universityMovies || []}
          onPlayClick={handlePlayMovie}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />

        {directorsList.length > 0 && (
          <CrewRow title="ผู้กำกับยอดนิยม" crew={directorsList} />
        )}

        {actorsList.length > 0 && (
          <CrewRow title="นักแสดงและทีมงาน" crew={actorsList} />
        )}

        {categories.map((category) => (
          <MovieRow
            key={category.id}
            title={CATEGORY_TITLE_MAPPING[category.name]}
            movies={categoryMoviesMap[category.id] || []}
            onPlayClick={handlePlayMovie}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    </main>
  );
}
