import { MovieRepositoryImpl } from "@/infra/repositories/movie.repository";
import { AuthRepositoryImpl } from "@/infra/repositories/auth.repository";
import { MasterDataRepositoryImpl } from "@/infra/repositories/master-data.repository";
import { FavoriteRepositoryImpl } from "@/infra/repositories/favorite.repository";
import { RatingRepositoryImpl } from "@/infra/repositories/rating.repository";
import { CrewMemberRepositoryImpl } from "@/infra/repositories/crew-member.repository";

import { MovieService } from "@/core/service/movie.service";
import { AuthService } from "@/core/service/auth.service";
import { MasterDataService } from "@/core/service/master-data.service";
import { FavoriteService } from "@/core/service/favorite.service";
import { RatingService } from "@/core/service/rating.service";
import { CrewMemberService } from "@/core/service/crew-member.service";

const movieRepository = new MovieRepositoryImpl();
const authRepository = new AuthRepositoryImpl();
const masterDataRepository = new MasterDataRepositoryImpl();
const favoriteRepository = new FavoriteRepositoryImpl();
const ratingRepository = new RatingRepositoryImpl();
const crewMemberRepository = new CrewMemberRepositoryImpl();

export const movieService = new MovieService(movieRepository);
export const authService = new AuthService(authRepository);
export const masterDataService = new MasterDataService(masterDataRepository);
export const favoriteService = new FavoriteService(favoriteRepository);
export const ratingService = new RatingService(ratingRepository);
export const crewMemberService = new CrewMemberService(crewMemberRepository);

