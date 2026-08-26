import { Movie } from "@/core/domain/movie";
import { Category } from "@/core/domain/master-data";
import { CrewMember } from "@/core/domain/crew";
import MovieRow from "@/components/movie/rows/movie-row";
import MovieRowPortrait from "@/components/movie/rows/movie-row-portrait";
import MovieRankRow from "@/components/movie/rows/movie-rank-row";
import CrewRow from "@/components/crew/crew-row";
import MovieHero from "@/components/movie/heros/movie-hero";
import MovieBtsRow from "@/components/movie/rows/movie-bts-row";
import PlayerModal from "@/components/modal/player-modal";
import { useState, useCallback } from "react";
import { BtsVideoItem } from "@/app/home/home";
import AdBanner from "@/components/ui/ad-banner";

interface HomeViewProps {
  recommendedMovies: Movie[];
  popularMovies: Movie[];
  awardsMovies: Movie[];
  categories: Category[];
  staffList: CrewMember[];
  actorList: CrewMember[];
  moviesByRating: Movie[];
  universityMovies: Movie[];
  dramaMovies: Movie[];
  thrillerHorrorMovies: Movie[];
  comedyMovies: Movie[];
  romanceMovies: Movie[];
  favorites: Movie[];
  portraitMovies: Movie[];
  btsVideos?: BtsVideoItem[];
  handlePlayMovie: (movie: Movie) => void;
  handleToggleFavorite: (movieId: string) => void;
}

export default function HomeView({
  recommendedMovies,
  popularMovies,
  awardsMovies,
  staffList,
  actorList,
  universityMovies,
  dramaMovies,
  thrillerHorrorMovies,
  comedyMovies,
  romanceMovies,
  moviesByRating,
  favorites,
  portraitMovies,
  btsVideos = [],
  handlePlayMovie,
  handleToggleFavorite,
}: HomeViewProps) {
  const universityName = universityMovies[0]?.university;
  const [selectedBtsVideo, setSelectedBtsVideo] = useState<string | null>(null);

  const handlePlayBtsVideo = useCallback((videoUrl: string) => {
    setSelectedBtsVideo(videoUrl);
  }, []);

  return (
    <main className="flex-1 flex flex-col">
      <MovieHero
        movies={recommendedMovies}
        onPlayClick={handlePlayMovie}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
      />

      <div className="relative z-20 px-6 md:px-16 space-y-10 md:space-y-12 -mt-6 md:-mt-10 pb-16">
        <MovieRow
          title="รับชมต่อ"
          movies={recommendedMovies}
          onPlayClick={handlePlayMovie}
          directPlay={true}
        />

        <MovieRow
          title={universityName ? `ผลงานจาก${universityName}` : "ผลงานจากมหาวิทยาลัย"}
          movies={universityMovies}
          onPlayClick={handlePlayMovie}
        />

        <MovieRow
          title="ชนะรางวัล"
          movies={awardsMovies}
          onPlayClick={handlePlayMovie}
        />

        <MovieRow
          title="ถูกใจผู้ชม"
          movies={moviesByRating}
          onPlayClick={handlePlayMovie}
        />

        <MovieRankRow
          title="ติดอันดับ"
          movies={popularMovies}
          onPlayClick={handlePlayMovie}
        />

        <AdBanner />

        <MovieRow
          title="รายการโปรดของคุณ"
          movies={favorites}
          onPlayClick={handlePlayMovie}
        />

        <MovieRow
          title="ดราม่าเรียกน้ำตา"
          movies={dramaMovies}
          onPlayClick={handlePlayMovie}
        />

        <MovieRow
          title="สั่นประสาท"
          movies={thrillerHorrorMovies}
          onPlayClick={handlePlayMovie}
        />

        <MovieRow
          title="ยิ้มได้ทั้งวัน"
          movies={comedyMovies}
          onPlayClick={handlePlayMovie}
        />

        <MovieRow
          title="รักหวานฉ่ำ"
          movies={romanceMovies}
          onPlayClick={handlePlayMovie}
        />

        <MovieBtsRow
          title="เบื้องหลังการสร้าง"
          btsVideos={btsVideos}
          onPlayClick={handlePlayBtsVideo}
        />

        <MovieRowPortrait
          title="ภาพยนตร์แนวตั้ง"
          movies={portraitMovies}
          onPlayClick={handlePlayMovie}
        />

        <CrewRow title="นักแสดง" crew={actorList} />

        <CrewRow title="ทีมงาน" crew={staffList} />
      </div>

      <PlayerModal
        isOpen={!!selectedBtsVideo}
        onClose={() => setSelectedBtsVideo(null)}
        youtubeUrl={selectedBtsVideo || ""}
        movieTitle="เบื้องหลังการสร้าง"
      />
    </main>
  );
}
