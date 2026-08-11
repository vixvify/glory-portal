import assert from "node:assert/strict";
import { test } from "node:test";
import { MovieService } from "@/core/service/movie.service";
import type { Movie, CreateMovie, UpdateMovie } from "@/core/domain/movie";
import type { MovieRepository } from "@/core/ports/movie.repository";
import type { ApiResponse } from "@/core/ports/response";

const CATEGORY_ID = "11111111-1111-4111-8111-111111111111";
const AGE_RATING_ID = "22222222-2222-4222-8222-222222222222";
const COLOR_TYPE_ID = "33333333-3333-4333-8333-333333333333";
const MOVIE_ID = "movie-123";

function createMovieResult(): Movie {
  return {
    id: MOVIE_ID,
    title: "หนังทดสอบ",
    description: "คำอธิบายหนังทดสอบ",
    categories: [],
    thumbnail: "https://example.com/thumbnail.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=test",
    views: 0,
    ratings: [],
    releaseDate: "2026-01-01",
    matchRate: 0,
    averageRating: 0,
    aspectRatio: "16:9",
    ageRating: "G",
    duration: 120,
    awards: [],
    contentWarnings: [],
    colorType: "COLOR",
    crew: [],
    btsVideos: [],
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
    createdBy: "user-1",
  };
}

function success<T>(data: T): ApiResponse<T> {
  return { data, status: 200, statusCode: "SUCCESS" };
}

function validMovieInput(): CreateMovie {
  return {
    title: "หนังทดสอบ",
    description: "คำอธิบายหนังทดสอบ",
    categoryIds: [CATEGORY_ID],
    thumbnail: new File(["thumbnail"], "thumbnail.jpg", { type: "image/jpeg" }),
    youtubeUrl: "https://www.youtube.com/watch?v=test",
    releaseDate: "2026-01-01",
    aspectRatio: "16:9",
    ageRatingId: AGE_RATING_ID,
    duration: 120,
    colorTypeId: COLOR_TYPE_ID,
    crew: [{ role: "DIRECTOR", name: "ผู้กำกับทดสอบ" }],
    contentWarningIds: [],
  };
}

function createRepository(
  overrides: Partial<MovieRepository> = {},
): MovieRepository {
  const notImplemented = async (): Promise<never> => {
    throw new Error("ไม่ได้คาดว่าจะถูกเรียกใน test นี้");
  };

  return {
    getMovies: notImplemented,
    getMyMovies: notImplemented,
    getMyContributedMovies: notImplemented,
    getMovieById: notImplemented,
    getMoviesByCategory: notImplemented,
    getMoviesByUniversity: notImplemented,
    getMovieWithAward: notImplemented,
    getMovieWithBts: notImplemented,
    createMovie: notImplemented,
    updateMovie: notImplemented,
    deleteMovie: notImplemented,
    ...overrides,
  };
}

test("createMovie ส่งข้อมูลที่ validate แล้วเป็น FormData ให้ repository", async () => {
  let receivedFormData: FormData | undefined;
  const repository = createRepository({
    createMovie: async (formData) => {
      receivedFormData = formData;
      return success(createMovieResult());
    },
  });

  const result = await new MovieService(repository).createMovie(validMovieInput());

  assert.equal(result.id, MOVIE_ID);
  assert.equal(receivedFormData?.get("title"), "หนังทดสอบ");
  assert.deepEqual(receivedFormData?.getAll("categoryIds"), [CATEGORY_ID]);
  const thumbnail = receivedFormData?.get("thumbnail");
  assert.ok(thumbnail instanceof File);
  assert.equal(thumbnail.name, "thumbnail.jpg");
  assert.deepEqual(
    JSON.parse(String(receivedFormData?.get("crew"))),
    { role: "DIRECTOR", name: "ผู้กำกับทดสอบ" },
  );
});

test("updateMovie ส่ง id และข้อมูลที่ validate แล้วให้ repository", async () => {
  let receivedId = "";
  let receivedFormData: FormData | undefined;
  const repository = createRepository({
    updateMovie: async (id, formData) => {
      receivedId = id;
      receivedFormData = formData;
      return success(createMovieResult());
    },
  });

  const input: UpdateMovie = {
    ...validMovieInput(),
    id: MOVIE_ID,
    thumbnail: "https://example.com/existing-thumbnail.jpg",
    title: "ชื่อหนังที่อัปเดตแล้ว",
  };

  await new MovieService(repository).updateMovie(MOVIE_ID, input);

  assert.equal(receivedId, MOVIE_ID);
  assert.equal(receivedFormData?.get("title"), "ชื่อหนังที่อัปเดตแล้ว");
  assert.equal(
    receivedFormData?.get("thumbnail"),
    "https://example.com/existing-thumbnail.jpg",
  );
});

test("createMovie ไม่เรียก repository เมื่อข้อมูลไม่ผ่าน validation", async () => {
  let called = false;
  const repository = createRepository({
    createMovie: async () => {
      called = true;
      return success(createMovieResult());
    },
  });

  await assert.rejects(
    () =>
      new MovieService(repository).createMovie({
        ...validMovieInput(),
        thumbnail: null,
        categoryIds: [],
      }),
    /At least one category is required/,
  );
  assert.equal(called, false);
});

test("updateMovie ส่งต่อ error จาก repository", async () => {
  const repository = createRepository({
    updateMovie: async () =>
      ({
        data: createMovieResult(),
        status: 400,
        statusCode: "BAD_REQUEST",
        error: "ไม่สามารถอัปเดตหนังได้",
      }) satisfies ApiResponse<Movie>,
  });

  await assert.rejects(
    () => new MovieService(repository).updateMovie(MOVIE_ID, {
      ...validMovieInput(),
      id: MOVIE_ID,
      thumbnail: "existing-thumbnail.jpg",
    }),
    /ไม่สามารถอัปเดตหนังได้/,
  );
});
