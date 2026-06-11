import { Fragment } from "react";
import { Movie, Category } from "@/core/domain/movie";
import { CrewMember } from "@/core/domain/crew";
import { CATEGORY_TITLE_MAPPING } from "@/core/constants/categories";
import MovieRow from "@/components/movie/rows/movie-row";
import MovieRowPortrait from "@/components/movie/rows/movie-row-portrait";
import MovieRankRow from "@/components/movie/rows/movie-rank-row";
import CrewRow from "@/components/crew/crew-row";
import MovieHero from "@/components/movie/heros/movie-hero";

interface HomeViewProps {
  recommendedMovies: Movie[];
  popularMovies: Movie[];
  categories: Category[];
  staffList: CrewMember[];
  actorList: CrewMember[];
  universityMovies: Movie[];
  categoryMoviesByViews: Record<string, Movie[]>;
  categoryMoviesByRating: Record<string, Movie[]>;
  favorites: Movie[];
  portraitMovies: Movie[];
  handlePlayMovie: (movie: Movie) => void;
  handleToggleFavorite: (movieId: string) => void;
}

export default function HomeView({
  recommendedMovies,
  popularMovies,
  categories,
  staffList,
  actorList,
  universityMovies,
  categoryMoviesByViews,
  categoryMoviesByRating,
  favorites,
  portraitMovies,
  handlePlayMovie,
  handleToggleFavorite,
}: HomeViewProps) {
  const universityName = universityMovies[0]?.university?.name;

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

        <MovieRankRow
          title="หนังยอดนิยม"
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

        {staffList.length > 0 && <CrewRow title="ทีมงาน" crew={staffList} />}

        {actorList.length > 0 && <CrewRow title="นักแสดง" crew={actorList} />}

        <MovieRowPortrait
          title="ภาพยนตร์แนวตั้ง"
          movies={portraitMovies}
          onPlayClick={handlePlayMovie}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />

        {categories.map((category) => (
          <Fragment key={category.id}>
            <MovieRow
              key={`${category.id}-views`}
              title={`${CATEGORY_TITLE_MAPPING[category.name]}ยอดนิยม`}
              movies={categoryMoviesByViews[category.id] || []}
              onPlayClick={handlePlayMovie}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
            <MovieRow
              key={`${category.id}-rating`}
              title={`${CATEGORY_TITLE_MAPPING[category.name]}ถูกใจผู้ชม`}
              movies={categoryMoviesByRating[category.id] || []}
              onPlayClick={handlePlayMovie}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          </Fragment>
        ))}
      </div>
    </main>
  );
}
