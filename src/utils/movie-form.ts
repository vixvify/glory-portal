import { CreateMovie, Movie, UpdateMovie } from "@/core/domain/movie";
import { Category } from "@/core/domain/master-data";
import { CrewRole, CrewOption, CrewMember } from "@/core/domain/crew";
import {
  AGE_RATING_OPTIONS,
  LANGUAGE_OPTIONS,
  CrewCategory,
  CrewRoleDefinition,
} from "@/core/constants/movie-form";
import { createMovieSchema, updateMovieSchema } from "@/core/schema/movie";
import { parseSchema } from "@/lib/validation";
import {
  AffiliationType,
  MovieFormInputs,
  MovieCrewInputItemWithRole,
} from "@/core/domain/movie";

type MovieFormPayloadOptions = {
  data: MovieFormInputs;
  editingMovie: Movie | null;
  affiliationType: AffiliationType;
  btsVideos: string[];
  awards: string[];
};

export function formatInputDate(date?: string | Date): string {
  if (!date) {
    return "";
  }

  return typeof date === "string"
    ? date.split("T")[0]
    : date.toISOString().split("T")[0];
}

export function getInitialCrewFormValues(
  editingMovie: Movie | null,
  crewRoles: CrewRole[],
): MovieCrewInputItemWithRole[] {
  return crewRoles.flatMap((role) => {
    if (editingMovie && editingMovie.crew) {
      const items = editingMovie.crew
        .filter(
          (c) =>
            c.role.toLowerCase() === role.name.toLowerCase() ||
            c.role.toLowerCase() === role.id.toLowerCase(),
        )
        .map((c) => ({
          role: role.name,
          crewMemberId: c.crewMember?.id || null,
          name: c.crewMember?.name || "",
          email: c.crewMember?.email || "",
        }));
      if (items.length > 0) {
        return items;
      }
    }
    return [
      {
        role: role.name,
        crewMemberId: null,
        name: "",
        email: "",
      },
    ];
  });
}

export function getMovieFormDefaultValues(
  editingMovie: Movie | null,
  categories: Category[],
  crewRoles: CrewRole[],
): MovieFormInputs {
  if (editingMovie) {
    return {
      ...editingMovie,
      categoryIds: editingMovie.categories.map((c) => c.id),
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
      crew: getInitialCrewFormValues(editingMovie, crewRoles),
    };
  }

  return {
    title: "",
    description: "",
    categoryIds: categories[0] ? [categories[0].id] : [],
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
    crew: getInitialCrewFormValues(null, crewRoles),
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
}: MovieFormPayloadOptions) {
  const activeVideos = btsVideos.map((video) => video.trim()).filter(Boolean);
  const activeAwards = awards.map((award) => award.trim()).filter(Boolean);

  const filteredCrew = (data.crew || [])
    .filter((item) => item.name && item.name.trim() !== "")
    .map((item) => ({
      role: item.role,
      crewMemberId: item.crewMemberId || null,
      name: (item.name || "").trim(),
      email: item.email?.trim() || null,
    }));

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
    crew: filteredCrew,
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

export function getFilteredCategories(crewRoles: CrewRole[]): CrewCategory[] {
  const categoriesMap = new Map<
    string,
    { label: string; roles: CrewRoleDefinition[] }
  >();

  const categoryOrder = [
    "production_management",
    "directing",
    "screenplay",
    "camera",
    "lighting",
    "grip",
    "sound",
    "art",
    "costume",
    "makeup",
    "cast",
    "vfx",
    "post_production",
  ];

  for (const role of crewRoles) {
    const catId = role.category || "other";
    const catLabel = role.categoryLabelTh || role.category || "อื่นๆ";

    if (!categoriesMap.has(catId)) {
      categoriesMap.set(catId, {
        label: catLabel,
        roles: [],
      });
    }

    categoriesMap.get(catId)!.roles.push({
      id: role.name.toLowerCase(),
      code: role.name,
      label: role.labelTh || role.name,
    });
  }

  const result: CrewCategory[] = [];
  for (const catId of categoryOrder) {
    const cat = categoriesMap.get(catId);
    if (cat && cat.roles.length > 0) {
      result.push({
        id: catId,
        label: cat.label,
        roles: cat.roles,
      });
    }
  }

  for (const [catId, cat] of categoriesMap.entries()) {
    if (!categoryOrder.includes(catId) && cat.roles.length > 0) {
      result.push({
        id: catId,
        label: cat.label,
        roles: cat.roles,
      });
    }
  }

  return result;
}

export function getCrewOptions(availableCrew: CrewMember[]): CrewOption[] {
  return availableCrew.map((c) => ({
    id: c.id,
    name: c.name,
    photoUrl: c.user?.photoUrl,
    email: c.email || "",
  }));
}
