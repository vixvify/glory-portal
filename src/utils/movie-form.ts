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
  trailerUrls: string[];
};

export function formatInputDate(date?: string | Date): string {
  if (!date) return "";
  return (typeof date === "string" ? new Date(date) : date).toISOString().split("T")[0];
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
          role: role.name.toLowerCase(),
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
        role: role.name.toLowerCase(),
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
      trailerUrls: editingMovie.trailerUrls || [],
      aspectRatio: editingMovie.aspectRatio || "landscape",
      ageRating: editingMovie.ageRating || "",
      university: editingMovie.university || "",
      school: editingMovie.school || "",
      language: editingMovie.language || "",
      hasProfanity: editingMovie.hasProfanity ?? false,
      hasDrugs: editingMovie.hasDrugs ?? false,
      hasViolence: editingMovie.hasViolence ?? false,
      hasGore: editingMovie.hasGore ?? false,
      hasSexualContent: editingMovie.hasSexualContent ?? false,
      hasNudity: editingMovie.hasNudity ?? false,
      hasSmoking: editingMovie.hasSmoking ?? false,
      hasAlcohol: editingMovie.hasAlcohol ?? false,
      hasMentalHealth: editingMovie.hasMentalHealth ?? false,
      hasFlashingLights: editingMovie.hasFlashingLights ?? false,
      hasOtherWarning: editingMovie.hasOtherWarning ?? false,
      otherContentWarning: editingMovie.otherContentWarning || "",
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
    trailerUrls: [],
    releaseDate: new Date().toISOString().split("T")[0],
    aspectRatio: "landscape",
    ageRating: AGE_RATING_OPTIONS[0] || "",
    duration: 120,
    university: "",
    school: "",
    language: LANGUAGE_OPTIONS[0],
    hasProfanity: false,
    hasDrugs: false,
    hasViolence: false,
    hasGore: false,
    hasSexualContent: false,
    hasNudity: false,
    hasSmoking: false,
    hasAlcohol: false,
    hasMentalHealth: false,
    hasFlashingLights: false,
    hasOtherWarning: false,
    otherContentWarning: "",
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
  data: Partial<MovieFormInputs>
): string[] {
  return [
    ...(data.hasViolence ? ["violence"] : []),
    ...(data.hasGore ? ["gore"] : []),
    ...(data.hasProfanity ? ["profanity"] : []),
    ...(data.hasSexualContent ? ["sexualContent"] : []),
    ...(data.hasNudity ? ["nudity"] : []),
    ...(data.hasSmoking ? ["smoking"] : []),
    ...(data.hasAlcohol ? ["alcohol"] : []),
    ...(data.hasDrugs ? ["drugs"] : []),
    ...(data.hasMentalHealth ? ["mentalHealth"] : []),
    ...(data.hasFlashingLights ? ["flashingLights"] : []),
    ...(data.hasOtherWarning ? ["other"] : []),
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
  trailerUrls,
}: MovieFormPayloadOptions) {
  const activeVideos = btsVideos.map((video) => video.trim()).filter(Boolean);
  const activeTrailers = trailerUrls.map((url) => url.trim()).filter(Boolean);
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
    categoryIds: Array.from(new Set((data.categoryIds || []).filter(Boolean))),
    thumbnail: data.thumbnail || editingMovie?.thumbnail,
    duration: Number(data.duration),
    btsVideo: activeVideos,
    trailerUrls: activeTrailers,
    awards: activeAwards,
    university:
      affiliationType === "university" ? data.university || null : null,
    school: affiliationType === "school" ? data.school || null : null,
    studio: affiliationType === "studio" ? data.studio || null : null,
    crew: filteredCrew,
    otherContentWarning: data.hasOtherWarning ? data.otherContentWarning || "" : "",
  };
}

export function toCreateMoviePayload(rawPayload: unknown): CreateMovie {
  const validated = parseSchema(createMovieSchema, rawPayload);

  return {
    ...validated,
    awards: validated.awards ?? undefined,
    trailerUrls: validated.trailerUrls ?? undefined,
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
    trailerUrls: validated.trailerUrls ?? undefined,
    thumbnail:
      validated.thumbnail instanceof File ||
        typeof validated.thumbnail === "string"
        ? validated.thumbnail
        : editingMovie.thumbnail,
  };
}

export function getFilteredCategories(crewRoles: CrewRole[]): CrewCategory[] {
  const categoryConfig = [
    { id: "production_management", label: "ฝ่ายบริหาร" },
    { id: "directing", label: "ฝ่ายกำกับ" },
    { id: "screenplay", label: "ฝ่ายบท" },
    { id: "camera", label: "ฝ่ายถ่ายภาพ" },
    { id: "lighting", label: "ฝ่ายแสง" },
    { id: "grip", label: "ฝ่ายขนย้าย/ติดตั้งอุปกรณ์" },
    { id: "sound", label: "ฝ่ายเสียง" },
    { id: "art", label: "ฝ่ายศิลป์" },
    { id: "costume", label: "ฝ่ายเครื่องแต่งกาย" },
    { id: "makeup", label: "ฝ่ายแต่งหน้า/ทำผม" },
    { id: "cast", label: "ฝ่ายแสดง" },
    { id: "location", label: "ฝ่ายสถานที่ถ่ายทำ" },
    { id: "support", label: "ฝ่ายจัดการผลิต/สนับสนุน" },
    { id: "vfx", label: "ฝ่ายเอฟเฟกต์พิเศษในกองถ่าย" },
    { id: "post_production", label: "ฝ่ายหลังการผลิต" },
  ];

  const categoriesMap = new Map<string, { label: string; roles: CrewRoleDefinition[] }>();

  categoryConfig.forEach(config => {
    categoriesMap.set(config.id, { label: config.label, roles: [] });
  });

  for (const role of crewRoles) {
    const catId = role.category || "other";
    if (!categoriesMap.has(catId)) {
      categoriesMap.set(catId, { label: role.categoryLabelTh || role.category || "อื่นๆ", roles: [] });
    }
    categoriesMap.get(catId)!.roles.push({
      id: role.name.toLowerCase(),
      code: role.name,
      label: role.labelTh ? `${role.labelTh} (${role.name})` : role.name,
    });
  }

  return Array.from(categoriesMap.entries())
    .map(([id, data]) => ({ id, ...data }))
    .filter(cat => cat.roles && cat.roles.length > 0);
}

export function getCrewOptions(availableCrew: CrewMember[]): CrewOption[] {
  return availableCrew.map((c) => ({
    id: c.id,
    name: c.name,
    photoUrl: c.user?.photoUrl,
    email: c.email || "",
  }));
}
