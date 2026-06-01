import { Movie, Category, University, CrewMember } from "@/core/domain/movie";
import { CATEGORY_TITLE_MAPPING } from "@/core/constants/categories";
import MovieRow from "./movie-row";
import MovieRankRow from "./movie-rank-row";
import CrewRow from "./crew-row";
import MovieHero from "./movie-hero";

interface HomeViewProps {
  recommendedMovies: Movie[];
  popularMovies: Movie[];
  categories: Category[];
  universities: University[];
  directorsList: CrewMember[];
  actorsList: CrewMember[];
  universityMoviesMap: Record<string, Movie[]>;
  categoryMoviesMap: Record<string, Movie[]>;
  initialAllMovies: Movie[];
  favorites: Movie[];
  handlePlayTrailer: (movie: Movie) => void;
  setSelectedMovie: (movie: Movie) => void;
  handleToggleFavorite: (movieId: string) => void;
  setSearchQuery: (query: string) => void;
}

export default function HomeView({
  recommendedMovies,
  popularMovies,
  categories,
  universities,
  directorsList,
  actorsList,
  universityMoviesMap,
  categoryMoviesMap,
  favorites,
  handlePlayTrailer,
  setSelectedMovie,
  handleToggleFavorite,
  setSearchQuery,
}: HomeViewProps) {
  return (
    <main className="flex-1 flex flex-col">
      <MovieHero
        movies={recommendedMovies}
        onPlayClick={handlePlayTrailer}
        onInfoClick={setSelectedMovie}
      />

      <div className="relative z-20 px-6 md:px-16 space-y-12 -mt-6 md:-mt-10">
        <MovieRankRow
          title="10 อันดับหนังยอดนิยม"
          movies={popularMovies}
          onMovieClick={setSelectedMovie}
          onPlayClick={handlePlayTrailer}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />

        {favorites.length > 0 && (
          <MovieRow
            title="รายการโปรดของคุณ"
            movies={favorites}
            onMovieClick={setSelectedMovie}
            onPlayClick={handlePlayTrailer}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {universities.map((uni) => (
          <MovieRow
            key={uni.id}
            title={`ผลงานภาพยนตร์จาก ${uni.name}`}
            movies={universityMoviesMap[uni.id] || []}
            onMovieClick={setSelectedMovie}
            onPlayClick={handlePlayTrailer}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}

        {directorsList.length > 0 && (
          <CrewRow
            title="ผู้กำกับยอดนิยม"
            crew={directorsList}
            onCrewClick={(member) => {
              setSearchQuery(member.name);
            }}
          />
        )}

        {actorsList.length > 0 && (
          <CrewRow
            title="นักแสดงและทีมงาน"
            crew={actorsList}
            onCrewClick={(member) => {
              setSearchQuery(member.name);
            }}
          />
        )}

        {categories.map((category) => (
          <MovieRow
            key={category.id}
            title={CATEGORY_TITLE_MAPPING[category.name]}
            movies={categoryMoviesMap[category.id] || []}
            onMovieClick={setSelectedMovie}
            onPlayClick={handlePlayTrailer}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    </main>
  );
}
