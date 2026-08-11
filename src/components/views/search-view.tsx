import { Movie } from "@/core/domain/movie";
import MovieGrid from "@/components/movie/grids/movie-grid";
import { Button } from "@/components/ui/button";

interface SearchViewProps {
  searchQuery: string;
  filteredMovies: Movie[];
  isSearching: boolean;
  handlePlayMovie: (movie: Movie) => void;
  setSearchQuery: (query: string) => void;
}

export default function SearchView({
  searchQuery,
  filteredMovies,
  isSearching,
  handlePlayMovie,
  setSearchQuery,
}: SearchViewProps) {
  return (
    <main className="flex-1 px-6 md:px-16 pt-28 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-wide">
          {`ผลลัพธ์การค้นหา ${searchQuery}`}
        </h2>
        <span className="text-sm text-zinc-400">
          {filteredMovies.length} เรื่อง
        </span>
      </div>

      {isSearching ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-12 h-12 border-4 border-zinc-700 border-t-white rounded-full animate-spin" />
        </div>
      ) : filteredMovies.length === 0 ? (
        <div className="text-center py-24 space-y-4">
          <p className="text-lg text-zinc-400 font-light">
            ไม่พบผลลัพธ์ที่ตรงกัน
          </p>
          <Button
            variant="secondary"
            onClick={() => {
              setSearchQuery("");
            }}
          >
            ล้างตัวกรอง
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-8 pb-10">
          <MovieGrid
            movies={filteredMovies}
            onPlayClick={handlePlayMovie}
          />
        </div>
      )}
    </main>
  );
}
