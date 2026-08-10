import { CreateMovie, Movie, UpdateMovie } from "@/core/domain/movie";
import { Category } from "@/core/domain/master-data";
import { CrewRole, CrewOption, CrewMember } from "@/core/domain/crew";
import {
  CrewCategory,
  CrewRoleDefinition,
  CREW_CATEGORY_CONFIG,
} from "@/core/constants/movie-form";
import { createMovieSchema, updateMovieSchema } from "@/core/schema/movie";
import { parseSchema } from "@/lib/validation";
import {
  AffiliationType,
  MovieFormInputs,
  MovieCrewInputItemWithRole,
} from "@/core/domain/movie";
import { MasterDataItem } from "@/core/domain/master-data";

type MovieFormPayloadOptions = {
  data: MovieFormInputs;
  editingMovie: Movie | null;
  affiliationType: AffiliationType;
  btsVideos: string[];
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

export function isOtherContentWarning(id: string, contentWarnings: MasterDataItem[]): boolean {
  if (id === "OTHER_CUSTOM") return true;
  const cw = contentWarnings.find(c => c.id === id);
  return cw?.name === "OTHER" || cw?.name === "อื่น ๆ (ระบุ)";
}

export function getMovieFormDefaultValues(
  editingMovie: Movie | null,
  categories: Category[],
  crewRoles: CrewRole[],
  masterData: {
    ageRatings: MasterDataItem[];
    universities: MasterDataItem[];
    schools: MasterDataItem[];
    languages: MasterDataItem[];
    subtitles: MasterDataItem[];
    colorTypes: MasterDataItem[];
    contentWarnings: MasterDataItem[];
  }
): MovieFormInputs {
  if (editingMovie) {
    const mapName2Id = (name: string | null | undefined, list: MasterDataItem[]) => {
      if (!name) return "";
      const normalizedName = name.toLowerCase().trim();
      const item = list.find(l => l.name.toLowerCase().trim() === normalizedName);
      return item ? item.id : "";
    };

    const cWarningIds = editingMovie.contentWarnings
      ?.map(w => mapName2Id(w, masterData.contentWarnings))
      .filter(Boolean) || [];

    if (editingMovie.otherContentWarning) {
      const otherItem = masterData.contentWarnings.find(l => l.name === "อื่น ๆ (ระบุ)" || l.name === "OTHER");
      if (otherItem) {
        cWarningIds.push(otherItem.id);
      } else {
        cWarningIds.push("OTHER_CUSTOM");
      }
    }
    return {
      ...editingMovie,
      categoryIds: editingMovie.categories.map((c) => c.id),
      thumbnail: null,
      trailerUrls: editingMovie.trailerUrls || [],
      ageRatingId: mapName2Id(editingMovie.ageRating, masterData.ageRatings) || (masterData.ageRatings[0]?.id || ""),
      universityId: mapName2Id(editingMovie.university, masterData.universities),
      schoolId: mapName2Id(editingMovie.school, masterData.schools),
      languageId: editingMovie.language ? (mapName2Id(editingMovie.language, masterData.languages) || "") : "",
      subtitleId: editingMovie.subtitle ? (mapName2Id(editingMovie.subtitle, masterData.subtitles) || "") : "",
      contentWarningIds: cWarningIds,
      otherContentWarning: editingMovie.otherContentWarning || "",
      colorTypeId: mapName2Id(editingMovie.colorType, masterData.colorTypes) || (masterData.colorTypes[0]?.id || ""),
      studio: editingMovie.studio || "",
      btsVideo: editingMovie.btsVideos || [],
      awards: (editingMovie.awards || []).map((a) => ({
        projectName: a.projectName || "",
        awardList: a.awardList?.length > 0 ? a.awardList.map(v => ({ value: v })) : [{ value: "" }],
      })),
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
    ageRatingId: masterData.ageRatings[0]?.id || "",
    duration: 120,
    universityId: "",
    schoolId: "",
    languageId: masterData.languages.find(l => l.name.includes("ไทย"))?.id || masterData.languages[0]?.id || "",
    subtitleId: masterData.subtitles.find(s => s.name.includes("ไทย"))?.id || masterData.subtitles[0]?.id || "",
    contentWarningIds: [],
    otherContentWarning: "",
    colorTypeId: masterData.colorTypes.find(c => c.name === "ภาพสี")?.id || masterData.colorTypes[0]?.id || "",
    studio: "",
    btsVideo: [],
    awards: [{ projectName: "", awardList: [{ value: "" }] }],
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





export function getInitialStringList(values?: string[]): string[] {
  return values && values.length > 0 ? values : [""];
}

export function buildMovieFormPayload({
  data,
  editingMovie,
  affiliationType,
  btsVideos,
  trailerUrls,
}: MovieFormPayloadOptions) {
  const activeVideos = btsVideos.map((video) => video.trim()).filter(Boolean);
  const activeTrailers = trailerUrls.map((url) => url.trim()).filter(Boolean);

  const filteredCrew = (data.crew || [])
    .filter((item) => item.name && item.name.trim() !== "")
    .map((item) => ({
      role: item.role,
      crewMemberId: item.crewMemberId || null,
      name: (item.name || "").trim(),
      email: item.email?.trim() || null,
    }));

  const activeAwards = (data.awards || [])
    .filter((a) => (a.projectName || "").trim() !== "")
    .map((a) => ({
      projectName: a.projectName.trim(),
      awardList: (a.awardList || []).map(i => (i.value || "").trim()).filter(Boolean),
    }));

  return {
    ...data,
    categoryIds: Array.from(new Set((data.categoryIds || []).filter(Boolean))),
    contentWarningIds: Array.from(new Set((data.contentWarningIds || []).filter((id) => Boolean(id) && id !== "OTHER_CUSTOM"))),
    thumbnail: data.thumbnail || editingMovie?.thumbnail,
    duration: Number(data.duration),
    btsVideo: activeVideos,
    trailerUrls: activeTrailers,
    awards: activeAwards,
    universityId:
      affiliationType === "university" ? data.universityId || null : null,
    schoolId: affiliationType === "school" ? data.schoolId || null : null,
    studio: affiliationType === "studio" ? data.studio || null : null,
    languageId: data.languageId || null,
    subtitleId: data.subtitleId || null,
    crew: filteredCrew,
  };
}

export function toCreateMoviePayload(rawPayload: unknown): CreateMovie {
  const validated = parseSchema(createMovieSchema, rawPayload);

  return {
    ...validated,
    awards: validated.awards ?? undefined,
    trailerUrls: validated.trailerUrls ?? undefined,
    tags: validated.tags ?? undefined,
    contentWarningIds: validated.contentWarningIds ?? undefined,
    thumbnail: validated.thumbnail as File,
    universityId: validated.universityId ?? null,
    schoolId: validated.schoolId ?? null,
    languageId: validated.languageId ?? null,
    subtitleId: validated.subtitleId ?? null,
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
    tags: validated.tags ?? undefined,
    contentWarningIds: validated.contentWarningIds ?? undefined,
    thumbnail:
      validated.thumbnail instanceof File ||
        typeof validated.thumbnail === "string"
        ? validated.thumbnail
        : editingMovie.thumbnail,
    universityId: validated.universityId ?? null,
    schoolId: validated.schoolId ?? null,
    languageId: validated.languageId ?? null,
    subtitleId: validated.subtitleId ?? null,
  };
}

export function getFilteredCategories(crewRoles: CrewRole[]): CrewCategory[] {

  const categoriesMap = new Map<string, { label: string; roles: CrewRoleDefinition[] }>();

  CREW_CATEGORY_CONFIG.forEach(config => {
    categoriesMap.set(config.id, { label: config.label, roles: [] });
  });

  for (const role of crewRoles) {
    const catId = (role.category || "other").toLowerCase();
    if (!categoriesMap.has(catId)) {
      categoriesMap.set(catId, { label: role.categoryLabelTh || role.category || "อื่นๆ", roles: [] });
    }
    const labelEn = role.labelEn || role.name;
    categoriesMap.get(catId)!.roles.push({
      id: role.name.toLowerCase(),
      code: role.name,
      label: role.labelTh ? `${role.labelTh} (${labelEn})` : labelEn,
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
