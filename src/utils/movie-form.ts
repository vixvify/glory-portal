import { Category, CreateMovie, Movie, UpdateMovie } from "@/core/domain/movie";
import { CrewStateItem } from "@/core/domain/crew";
import {
  CrewTabId,
  AGE_RATING_OPTIONS,
  LANGUAGE_OPTIONS,
} from "@/core/constants/movie-form";
import { createMovieSchema, updateMovieSchema } from "@/core/schema/movie";
import { parseSchema } from "@/lib/validation";
import { transformCrewStateToPayload } from "@/utils/crew";
import { AffiliationType, MovieFormInputs } from "@/core/domain/movie";

type CrewState = Record<CrewTabId, CrewStateItem[]>;

type MovieFormPayloadOptions = {
  data: MovieFormInputs;
  editingMovie: Movie | null;
  affiliationType: AffiliationType;
  btsVideos: string[];
  awards: string[];
  crewState: CrewState;
};

export function formatInputDate(date?: string | Date): string {
  if (!date) {
    return "";
  }

  return typeof date === "string"
    ? date.split("T")[0]
    : date.toISOString().split("T")[0];
}

export function getMovieFormDefaultValues(
  editingMovie: Movie | null,
  categories: Category[],
): MovieFormInputs {
  if (editingMovie) {
    return {
      ...editingMovie,
      categoryId: editingMovie.category.id,
      thumbnail: null,
      trailerUrl: editingMovie.trailerUrl || "",
      aspectRatio: editingMovie.aspectRatio || "landscape",
      ageRating: editingMovie.ageRating || "",
      university: editingMovie.university || "",
      school: editingMovie.school || "",
      language: editingMovie.language || "",
      hasProfanity: editingMovie.hasProfanity ?? false,
      hasDrugs: editingMovie.hasDrugs ?? false,
      colorType: editingMovie.colorType || "color",
      studio: editingMovie.studio || "",
      btsVideo: editingMovie.btsVideos || [],
      awards: editingMovie.awards || [],
      releaseDate: formatInputDate(editingMovie.releaseDate),
    };
  }

  return {
    title: "",
    description: "",
    categoryId: categories[0]?.id || "",
    thumbnail: null,
    youtubeUrl: "",
    trailerUrl: "",
    releaseDate: new Date().toISOString().split("T")[0],
    aspectRatio: "landscape",
    ageRating: AGE_RATING_OPTIONS[0] || "",
    duration: 120,
    university: "",
    school: "",
    language: LANGUAGE_OPTIONS[0],
    hasProfanity: false,
    hasDrugs: false,
    colorType: "color",
    studio: "",
    btsVideo: [],
    awards: [""],
  };
}

export function getInitialAffiliationType(
  editingMovie: Movie | null,
): AffiliationType {
  if (editingMovie?.school) {
    return "school";
  }

  if (editingMovie?.studio) {
    return "studio";
  }

  return "university";
}

export function getSelectedContentWarnings(
  hasProfanity: boolean,
  hasDrugs: boolean,
): string[] {
  return [
    ...(hasProfanity ? ["profanity"] : []),
    ...(hasDrugs ? ["drugs"] : []),
  ];
}

export function getInitialStringList(values?: string[]): string[] {
  return values && values.length > 0 ? values : [""];
}

export function buildMovieFormPayload({
  data,
  editingMovie,
  affiliationType,
  btsVideos,
  awards,
  crewState,
}: MovieFormPayloadOptions) {
  const activeVideos = btsVideos.map((video) => video.trim()).filter(Boolean);
  const activeAwards = awards.map((award) => award.trim()).filter(Boolean);
  const dynamicCrewPayload = transformCrewStateToPayload(crewState);

  return {
    ...data,
    thumbnail: data.thumbnail || editingMovie?.thumbnail,
    duration: Number(data.duration),
    btsVideo: activeVideos,
    awards: activeAwards,
    university:
      affiliationType === "university" ? data.university || null : null,
    school: affiliationType === "school" ? data.school || null : null,
    studio: affiliationType === "studio" ? data.studio || null : null,
    crew: dynamicCrewPayload,
  };
}

export function toCreateMoviePayload(rawPayload: unknown): CreateMovie {
  const validated = parseSchema(createMovieSchema, rawPayload);

  return {
    ...validated,
    awards: validated.awards ?? undefined,
    thumbnail: validated.thumbnail as File,
  };
}

export function toUpdateMoviePayload(
  rawPayload: unknown,
  editingMovie: Movie,
): UpdateMovie {
  const validated = parseSchema(updateMovieSchema, rawPayload);

  return {
    ...validated,
    id: editingMovie.id,
    awards: validated.awards ?? undefined,
    thumbnail:
      validated.thumbnail instanceof File ||
      typeof validated.thumbnail === "string"
        ? validated.thumbnail
        : editingMovie.thumbnail,
  };
}
