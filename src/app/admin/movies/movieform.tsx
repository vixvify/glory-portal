"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MovieIcon from "@mui/icons-material/Movie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { CreatableSearchSelect } from "@/components/ui/search-select";
import {
  Movie,
  Category,
  AgeRating,
  University,
  CrewMember,
  Language,
  TargetGroup,
} from "@/core/domain/movie";
import { parseSchema } from "@/lib/validation";
import { createMovieSchema } from "@/core/schema/movie";
import { LOCALIZATION } from "@/core/constants/localization";
import { CATEGORY_TITLE_MAPPING } from "@/core/constants/categories";
import { useAppStore } from "@/store/use-store";
import {
  useCreateMovieMutation,
  useUpdateMovieMutation,
} from "@/hooks/use-movies";
import { CreateMovie, UpdateMovie } from "@/core/domain/movie";

interface MovieFormProps {
  editingMovie?: Movie | null;
  categories: Category[];
  ageRatings: AgeRating[];
  universities: University[];
  languages: Language[];
  targetGroups: TargetGroup[];
  availableCrew: CrewMember[];
}

type MovieFormInputs = {
  title: string;
  description: string;
  category: string;
  thumbnail?: File | null;
  youtubeUrl: string;
  year: number;
  matchRate: number;
  ageRating: string;
  duration: number;
  university?: string;
  language?: string;
  targetGroup?: string;
  hasProfanity: boolean;
  hasDrugs: boolean;
  colorType: string;
  studio?: string;
  director?: string;
  producer?: string;
  writer?: string;
  cast?: string;
  dop?: string;
  editor?: string;
  btsVideo?: string;
};

export const MovieForm: React.FC<MovieFormProps> = ({
  editingMovie = null,
  categories,
  ageRatings,
  universities,
  languages,
  targetGroups,
  availableCrew,
}) => {
  const router = useRouter();
  const { showToast } = useAppStore();

  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [btsVideos, setBtsVideos] = useState<string[]>([""]);
  const [movieCoverPreview, setMovieCoverPreview] = useState<string | null>(
    null,
  );
  const [isSavingLocal, setIsSavingLocal] = useState(false);

  const [directors, setDirectors] = useState<
    Array<{ id: string; name: string }>
  >([{ id: "", name: "" }]);
  const [producers, setProducers] = useState<
    Array<{ id: string; name: string }>
  >([{ id: "", name: "" }]);
  const [writers, setWriters] = useState<Array<{ id: string; name: string }>>([
    { id: "", name: "" },
  ]);
  const [castMembers, setCastMembers] = useState<
    Array<{ id: string; name: string }>
  >([{ id: "", name: "" }]);
  const [dops, setDops] = useState<Array<{ id: string; name: string }>>([
    { id: "", name: "" },
  ]);
  const [editors, setEditors] = useState<Array<{ id: string; name: string }>>([
    { id: "", name: "" },
  ]);

  const createMovieMutation = useCreateMovieMutation();
  const updateMovieMutation = useUpdateMovieMutation();

  const crewOptions = availableCrew.map((c) => ({
    id: c.id,
    name: c.name,
    photoUrl: c.photoUrl,
  }));

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<MovieFormInputs>();

  useEffect(() => {
    if (editingMovie) {
      setSelectedFileName(null);
      setMovieCoverPreview(
        typeof editingMovie.thumbnail === "string"
          ? editingMovie.thumbnail
          : null,
      );
      setBtsVideos(
        editingMovie.bts?.btsVideo && editingMovie.bts.btsVideo.length > 0
          ? editingMovie.bts.btsVideo
          : [""],
      );

      const movieDirectors =
        editingMovie.crew
          ?.filter((c) => c.role.toLowerCase() === "director")
          .map((c) => ({
            id: c.crewMember?.id || "",
            name: c.crewMember?.name || "",
          }))
          .filter((x): x is { id: string; name: string } => !!x.name) || [];

      const movieProducers =
        editingMovie.crew
          ?.filter((c) => c.role.toLowerCase() === "producer")
          .map((c) => ({
            id: c.crewMember?.id || "",
            name: c.crewMember?.name || "",
          }))
          .filter((x): x is { id: string; name: string } => !!x.name) || [];

      const movieWriters =
        editingMovie.crew
          ?.filter((c) => c.role.toLowerCase() === "writer")
          .map((c) => ({
            id: c.crewMember?.id || "",
            name: c.crewMember?.name || "",
          }))
          .filter((x): x is { id: string; name: string } => !!x.name) || [];

      const movieCast =
        editingMovie.crew
          ?.filter((c) => c.role.toLowerCase() === "cast")
          .map((c) => ({
            id: c.crewMember?.id || "",
            name: c.crewMember?.name || "",
          }))
          .filter((x): x is { id: string; name: string } => !!x.name) || [];

      const movieDops =
        editingMovie.crew
          ?.filter((c) => c.role.toLowerCase() === "dop")
          .map((c) => ({
            id: c.crewMember?.id || "",
            name: c.crewMember?.name || "",
          }))
          .filter((x): x is { id: string; name: string } => !!x.name) || [];

      const movieEditors =
        editingMovie.crew
          ?.filter((c) => c.role.toLowerCase() === "editor")
          .map((c) => ({
            id: c.crewMember?.id || "",
            name: c.crewMember?.name || "",
          }))
          .filter((x): x is { id: string; name: string } => !!x.name) || [];

      setDirectors(
        movieDirectors.length > 0 ? movieDirectors : [{ id: "", name: "" }],
      );
      setProducers(
        movieProducers.length > 0 ? movieProducers : [{ id: "", name: "" }],
      );
      setWriters(
        movieWriters.length > 0 ? movieWriters : [{ id: "", name: "" }],
      );
      setCastMembers(movieCast.length > 0 ? movieCast : [{ id: "", name: "" }]);
      setDops(movieDops.length > 0 ? movieDops : [{ id: "", name: "" }]);
      setEditors(
        movieEditors.length > 0 ? movieEditors : [{ id: "", name: "" }],
      );

      reset({
        title: editingMovie.title,
        description: editingMovie.description,
        category: editingMovie.category,
        thumbnail: null,
        youtubeUrl: editingMovie.youtubeUrl,
        year: editingMovie.year,
        matchRate: editingMovie.matchRate,
        ageRating: editingMovie.ageRating,
        duration: editingMovie.duration,
        university: editingMovie.university || "",
        language: editingMovie.language || "",
        targetGroup: editingMovie.targetGroup || "",
        hasProfanity: editingMovie.hasProfanity ?? false,
        hasDrugs: editingMovie.hasDrugs ?? false,
        colorType: editingMovie.colorType || "COLOR",
        studio: editingMovie.studio || "",
        director: "",
        producer: "",
        writer: "",
        cast: "",
        dop: "",
        editor: "",
        btsVideo: editingMovie.bts?.btsVideo
          ? editingMovie.bts.btsVideo.join(", ")
          : "",
      });
    } else {
      setSelectedFileName(null);
      setMovieCoverPreview(null);
      setBtsVideos([""]);
      setDirectors([{ id: "", name: "" }]);
      setProducers([{ id: "", name: "" }]);
      setWriters([{ id: "", name: "" }]);
      setCastMembers([{ id: "", name: "" }]);
      setDops([{ id: "", name: "" }]);
      setEditors([{ id: "", name: "" }]);
      reset({
        title: "",
        description: "",
        category: "Action",
        thumbnail: null,
        youtubeUrl: "",
        year: new Date().getFullYear(),
        matchRate: 98,
        ageRating: "PG",
        duration: 120,
        university: "",
        language: "",
        targetGroup: "",
        hasProfanity: false,
        hasDrugs: false,
        colorType: "COLOR",
        studio: "",
        director: "",
        producer: "",
        writer: "",
        cast: "",
        dop: "",
        editor: "",
        btsVideo: "",
      });
    }
  }, [editingMovie, reset]);

  const onSubmitForm = async (data: MovieFormInputs) => {
    try {
      setIsSavingLocal(true);
      const activeVideos = btsVideos.map((v) => v.trim()).filter(Boolean);
      const thumbnailFile = data.thumbnail;

      const validated = parseSchema(createMovieSchema, {
        ...data,
        thumbnail: thumbnailFile || editingMovie?.thumbnail,
        year: Number(data.year),
        matchRate: Number(data.matchRate),
        duration: Number(data.duration),
        language: data.language || null,
        targetGroup: data.targetGroup || null,
        hasProfanity: data.hasProfanity,
        hasDrugs: data.hasDrugs,
        colorType: data.colorType || "COLOR",
        studio: data.studio || null,
        btsVideo: activeVideos.join(","),
        director: directors
          .filter((d) => d.name.trim() !== "")
          .map((d) => d.id || d.name.trim()),
        producer: producers
          .filter((p) => p.name.trim() !== "")
          .map((p) => p.id || p.name.trim()),
        writer: writers
          .filter((w) => w.name.trim() !== "")
          .map((w) => w.id || w.name.trim()),
        cast: castMembers
          .filter((c) => c.name.trim() !== "")
          .map((c) => c.id || c.name.trim()),
        dop: dops
          .filter((d) => d.name.trim() !== "")
          .map((d) => d.id || d.name.trim()),
        editor: editors
          .filter((e) => e.name.trim() !== "")
          .map((e) => e.id || e.name.trim()),
      });

      if (editingMovie) {
        const updatedPayload: UpdateMovie = {
          title: validated.title,
          description: validated.description,
          category: validated.category,
          thumbnail:
            validated.thumbnail instanceof File ||
            typeof validated.thumbnail === "string"
              ? validated.thumbnail
              : editingMovie.thumbnail,
          youtubeUrl: validated.youtubeUrl,
          year: validated.year,
          matchRate: validated.matchRate,
          ageRating: validated.ageRating,
          duration: validated.duration,
          university: validated.university || null,
          language: validated.language || null,
          targetGroup: validated.targetGroup || null,
          hasProfanity: validated.hasProfanity,
          hasDrugs: validated.hasDrugs,
          colorType: validated.colorType,
          studio: validated.studio || null,
          director: validated.director || null,
          producer: validated.producer || null,
          writer: validated.writer || null,
          cast: validated.cast || null,
          dop: validated.dop || null,
          editor: validated.editor || null,
          btsVideo: validated.btsVideo || null,
        };

        await updateMovieMutation.mutateAsync({
          id: editingMovie.id,
          movie: updatedPayload,
        });
        showToast(LOCALIZATION.TOAST.EDIT_MOVIE_SUCCESS, "success");
      } else {
        const createPayload: CreateMovie = {
          title: validated.title,
          description: validated.description,
          category: validated.category,
          thumbnail: validated.thumbnail as File,
          youtubeUrl: validated.youtubeUrl,
          year: validated.year,
          matchRate: validated.matchRate,
          ageRating: validated.ageRating,
          duration: validated.duration,
          university: validated.university || undefined,
          language: validated.language || undefined,
          targetGroup: validated.targetGroup || undefined,
          hasProfanity: validated.hasProfanity,
          hasDrugs: validated.hasDrugs,
          colorType: validated.colorType,
          studio: validated.studio || undefined,
          director: validated.director || undefined,
          producer: validated.producer || undefined,
          writer: validated.writer || undefined,
          cast: validated.cast || undefined,
          dop: validated.dop || undefined,
          editor: validated.editor || undefined,
          btsVideo: validated.btsVideo || undefined,
        };

        await createMovieMutation.mutateAsync(createPayload);
        showToast(LOCALIZATION.TOAST.ADD_MOVIE_SUCCESS, "success");
      }

      router.push("/admin/movies");
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : LOCALIZATION.ERRORS.SAVE_MOVIE;
      showToast(errMsg, "error");
      console.error(err);
    } finally {
      setIsSavingLocal(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-brand selection:text-black pb-20">
      <main className="max-w-4xl mx-auto w-full px-6 md:px-16 pt-28 space-y-8 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent flex items-center gap-2">
            <MovieIcon className="text-brand" />{" "}
            {editingMovie ? "แก้ไขข้อมูลภาพยนตร์" : "สร้างภาพยนตร์ใหม่"}
          </h1>
          <p className="text-xs text-zinc-400 font-light">
            กรอกข้อมูลรายละเอียดของภาพยนตร์สั้น ลิงก์ตัวอย่าง อัปโหลดใบปิด
            และจัดการรายชื่อทีมงานทั้งหมด
          </p>
        </div>

        <div className="bg-card border border-zinc-800/35 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-md">
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
            <Input
              label={LOCALIZATION.MOVIE_FORM.TITLE_LABEL}
              placeholder={LOCALIZATION.MOVIE_FORM.TITLE_PLACEHOLDER}
              error={errors.title?.message}
              {...register("title", {
                required: LOCALIZATION.MOVIE_FORM.TITLE_REQUIRED,
              })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Select
                label={LOCALIZATION.MOVIE_FORM.CATEGORY_LABEL}
                error={errors.category?.message}
                {...register("category", {
                  required: LOCALIZATION.MOVIE_FORM.CATEGORY_REQUIRED,
                })}
                options={categories.map((cat) => ({
                  value: cat.name,
                  label: CATEGORY_TITLE_MAPPING[cat.name] || cat.name,
                }))}
              />

              <Select
                label={LOCALIZATION.MOVIE_FORM.AGE_LABEL}
                error={errors.ageRating?.message}
                {...register("ageRating", {
                  required: LOCALIZATION.MOVIE_FORM.AGE_REQUIRED,
                })}
                options={ageRatings.map((rating) => ({
                  value: rating.name,
                  label: rating.name,
                }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Select
                label={LOCALIZATION.MOVIE_FORM.LANGUAGE_LABEL}
                error={errors.language?.message}
                {...register("language")}
                options={[
                  {
                    value: "",
                    label: LOCALIZATION.MOVIE_FORM.LANGUAGE_SELECT_PLACEHOLDER,
                  },
                  ...languages.map((lang) => ({
                    value: lang.name,
                    label: lang.name,
                  })),
                ]}
              />

              <Select
                label={LOCALIZATION.MOVIE_FORM.TARGET_GROUP_LABEL}
                error={errors.targetGroup?.message}
                {...register("targetGroup")}
                options={[
                  {
                    value: "",
                    label:
                      LOCALIZATION.MOVIE_FORM.TARGET_GROUP_SELECT_PLACEHOLDER,
                  },
                  ...targetGroups.map((tg) => ({
                    value: tg.name,
                    label: tg.name,
                  })),
                ]}
              />

              <Select
                label={LOCALIZATION.MOVIE_FORM.COLOR_LABEL}
                error={errors.colorType?.message}
                {...register("colorType", {
                  required: "กรุณาเลือกโทนสีภาพยนตร์",
                })}
                options={[
                  {
                    value: "COLOR",
                    label: LOCALIZATION.MOVIE_FORM.COLOR_COLOR,
                  },
                  {
                    value: "BLACK_AND_WHITE",
                    label: LOCALIZATION.MOVIE_FORM.COLOR_BW,
                  },
                  {
                    value: "COLOR_AND_BW",
                    label: LOCALIZATION.MOVIE_FORM.COLOR_MIXED,
                  },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Input
                label={LOCALIZATION.MOVIE_FORM.YEAR_LABEL}
                type="number"
                placeholder={LOCALIZATION.MOVIE_FORM.YEAR_PLACEHOLDER}
                error={errors.year?.message}
                {...register("year", {
                  required: LOCALIZATION.MOVIE_FORM.YEAR_REQUIRED,
                  min: {
                    value: 1900,
                    message: LOCALIZATION.MOVIE_FORM.YEAR_MIN,
                  },
                  max: {
                    value: 2100,
                    message: LOCALIZATION.MOVIE_FORM.YEAR_MAX,
                  },
                })}
              />

              <Input
                label={LOCALIZATION.MOVIE_FORM.MATCH_LABEL}
                type="number"
                placeholder={LOCALIZATION.MOVIE_FORM.MATCH_PLACEHOLDER}
                error={errors.matchRate?.message}
                {...register("matchRate", {
                  required: LOCALIZATION.MOVIE_FORM.MATCH_REQUIRED,
                  min: { value: 0, message: LOCALIZATION.MOVIE_FORM.MATCH_MIN },
                  max: {
                    value: 100,
                    message: LOCALIZATION.MOVIE_FORM.MATCH_MAX,
                  },
                })}
              />

              <Input
                label={LOCALIZATION.MOVIE_FORM.DURATION_LABEL}
                placeholder={LOCALIZATION.MOVIE_FORM.DURATION_PLACEHOLDER}
                error={errors.duration?.message}
                {...register("duration", {
                  required: LOCALIZATION.MOVIE_FORM.DURATION_REQUIRED,
                })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">
                {LOCALIZATION.MOVIE_FORM.COVER_LABEL}
              </label>
              <div className="relative group/file">
                <Controller
                  name="thumbnail"
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        field.onChange(file);
                        setSelectedFileName(file?.name ?? null);
                        if (file) {
                          setMovieCoverPreview(URL.createObjectURL(file));
                        } else {
                          setMovieCoverPreview(
                            editingMovie &&
                              typeof editingMovie.thumbnail === "string"
                              ? editingMovie.thumbnail
                              : null,
                          );
                        }
                      }}
                    />
                  )}
                />
                <div
                  className={`w-full bg-black/40 border ${errors.thumbnail ? "border-red-500" : "border-zinc-800 group-hover/file:border-brand"} rounded-xl px-4 py-3 text-sm text-zinc-405 flex items-center justify-between transition-colors`}
                >
                  <span
                    className={
                      selectedFileName
                        ? "text-white font-medium truncate max-w-[70%]"
                        : "text-zinc-400"
                    }
                  >
                    {selectedFileName ||
                      LOCALIZATION.MOVIE_FORM.COVER_PLACEHOLDER}
                  </span>
                  <span className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-lg text-xs font-semibold group-hover/file:bg-brand group-hover/file:text-white transition-colors">
                    {LOCALIZATION.MOVIE_FORM.COVER_BROWSE}
                  </span>
                </div>
              </div>

              {movieCoverPreview && (
                <div className="mt-3 relative rounded-xl overflow-hidden border border-zinc-800 bg-black/40 aspect-[16/9] w-full max-w-[280px] group/preview">
                  <img
                    src={movieCoverPreview}
                    alt="Cover Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setValue("thumbnail", null);
                      setSelectedFileName(null);
                      setMovieCoverPreview(
                        editingMovie &&
                          typeof editingMovie.thumbnail === "string"
                          ? editingMovie.thumbnail
                          : null,
                      );
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500 hover:text-white text-zinc-405 rounded-full transition-colors cursor-pointer border-0 shadow-md opacity-0 group-hover/preview:opacity-100"
                  >
                    <CloseIcon className="text-[10px]" />
                  </button>
                </div>
              )}

              {errors.thumbnail && (
                <span className="text-[10px] text-red-500 block pl-1 font-semibold">
                  {errors.thumbnail.message}
                </span>
              )}
              {editingMovie && typeof editingMovie.thumbnail === "string" && (
                <p className="text-[10px] text-zinc-500 pl-1 leading-relaxed">
                  รูปปัจจุบัน:{" "}
                  <span className="text-brand font-medium truncate max-w-[200px] inline-block align-bottom">
                    {editingMovie.thumbnail.split("/").pop()}
                  </span>{" "}
                  (เว้นว่างไว้หากต้องการใช้รูปเดิม)
                </p>
              )}
            </div>

            <Input
              label={LOCALIZATION.MOVIE_FORM.YOUTUBE_LABEL}
              placeholder={LOCALIZATION.MOVIE_FORM.YOUTUBE_PLACEHOLDER}
              error={errors.youtubeUrl?.message}
              {...register("youtubeUrl", {
                required: LOCALIZATION.MOVIE_FORM.YOUTUBE_REQUIRED,
              })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label={LOCALIZATION.MOVIE_FORM.STUDIO_LABEL}
                placeholder={LOCALIZATION.MOVIE_FORM.STUDIO_PLACEHOLDER}
                error={errors.studio?.message}
                {...register("studio")}
              />

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300">
                  {LOCALIZATION.MOVIE_FORM.WARNINGS_LABEL}
                </label>
                <div className="flex items-center gap-6 bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 h-[46px]">
                  <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      {...register("hasProfanity")}
                      className="w-4 h-4 rounded border-zinc-850 text-brand focus:ring-brand bg-zinc-950"
                    />
                    {LOCALIZATION.MOVIE_FORM.WARNING_PROFANITY}
                  </label>
                  <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      {...register("hasDrugs")}
                      className="w-4 h-4 rounded border-zinc-850 text-brand focus:ring-brand bg-zinc-950"
                    />
                    {LOCALIZATION.MOVIE_FORM.WARNING_DRUGS}
                  </label>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-800/60 pt-6 mt-4 space-y-6">
              <h4 className="text-sm font-bold text-brand uppercase tracking-wider">
                {LOCALIZATION.MOVIE_FORM.CREW_SECTION_TITLE}
              </h4>

              <Select
                label={LOCALIZATION.MOVIE_FORM.UNI_LABEL}
                error={errors.university?.message}
                {...register("university")}
              >
                <option value="" className="bg-zinc-900 text-zinc-405">
                  {LOCALIZATION.MOVIE_FORM.UNI_SELECT_PLACEHOLDER}
                </option>
                {universities.map((uni) => (
                  <option
                    key={uni.id}
                    value={uni.name}
                    className="bg-zinc-900 text-white"
                  >
                    {uni.name}
                  </option>
                ))}
              </Select>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300">
                  {LOCALIZATION.MOVIE_FORM.DIRECTOR_LABEL}
                </label>
                <div className="space-y-3">
                  {directors.map((director, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <CreatableSearchSelect
                        value={director}
                        options={crewOptions}
                        placeholder={
                          LOCALIZATION.MOVIE_FORM.DIRECTOR_PLACEHOLDER
                        }
                        onChange={(val) => {
                          const newDirectors = [...directors];
                          newDirectors[idx] = val;
                          setDirectors(newDirectors);
                        }}
                      />
                      {directors.length > 1 && (
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() =>
                            setDirectors(directors.filter((_, i) => i !== idx))
                          }
                          className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 transition-all flex-shrink-0 h-auto"
                        >
                          <CloseIcon className="text-sm" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      setDirectors([...directors, { id: "", name: "" }])
                    }
                    className="py-2 px-4 text-xs flex items-center gap-1 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:text-white text-zinc-300 font-semibold rounded-xl"
                  >
                    <AddIcon className="text-sm" />{" "}
                    {LOCALIZATION.MOVIE_FORM.DIRECTOR_ADD}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300">
                  {LOCALIZATION.MOVIE_FORM.PRODUCER_LABEL}
                </label>
                <div className="space-y-3">
                  {producers.map((producer, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <CreatableSearchSelect
                        value={producer}
                        options={crewOptions}
                        placeholder={
                          LOCALIZATION.MOVIE_FORM.PRODUCER_PLACEHOLDER
                        }
                        onChange={(val) => {
                          const newProducers = [...producers];
                          newProducers[idx] = val;
                          setProducers(newProducers);
                        }}
                      />
                      {producers.length > 1 && (
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() =>
                            setProducers(producers.filter((_, i) => i !== idx))
                          }
                          className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 transition-all flex-shrink-0 h-auto"
                        >
                          <CloseIcon className="text-sm" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      setProducers([...producers, { id: "", name: "" }])
                    }
                    className="py-2 px-4 text-xs flex items-center gap-1 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:text-white text-zinc-300 font-semibold rounded-xl"
                  >
                    <AddIcon className="text-sm" />{" "}
                    {LOCALIZATION.MOVIE_FORM.PRODUCER_ADD}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300">
                  {LOCALIZATION.MOVIE_FORM.WRITER_LABEL}
                </label>
                <div className="space-y-3">
                  {writers.map((writer, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <CreatableSearchSelect
                        value={writer}
                        options={crewOptions}
                        placeholder={LOCALIZATION.MOVIE_FORM.WRITER_PLACEHOLDER}
                        onChange={(val) => {
                          const newWriters = [...writers];
                          newWriters[idx] = val;
                          setWriters(newWriters);
                        }}
                      />
                      {writers.length > 1 && (
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() =>
                            setWriters(writers.filter((_, i) => i !== idx))
                          }
                          className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 transition-all flex-shrink-0 h-auto"
                        >
                          <CloseIcon className="text-sm" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      setWriters([...writers, { id: "", name: "" }])
                    }
                    className="py-2 px-4 text-xs flex items-center gap-1 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:text-white text-zinc-300 font-semibold rounded-xl"
                  >
                    <AddIcon className="text-sm" />{" "}
                    {LOCALIZATION.MOVIE_FORM.WRITER_ADD}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300">
                  {LOCALIZATION.MOVIE_FORM.CAST_LABEL}
                </label>
                <div className="space-y-3">
                  {castMembers.map((actor, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <CreatableSearchSelect
                        value={actor}
                        options={crewOptions}
                        placeholder={LOCALIZATION.MOVIE_FORM.CAST_PLACEHOLDER}
                        onChange={(val) => {
                          const newCast = [...castMembers];
                          newCast[idx] = val;
                          setCastMembers(newCast);
                        }}
                      />
                      {castMembers.length > 1 && (
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() =>
                            setCastMembers(
                              castMembers.filter((_, i) => i !== idx),
                            )
                          }
                          className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 transition-all flex-shrink-0 h-auto"
                        >
                          <CloseIcon className="text-sm" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      setCastMembers([...castMembers, { id: "", name: "" }])
                    }
                    className="py-2 px-4 text-xs flex items-center gap-1 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:text-white text-zinc-300 font-semibold rounded-xl"
                  >
                    <AddIcon className="text-sm" />{" "}
                    {LOCALIZATION.MOVIE_FORM.CAST_ADD}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300">
                  {LOCALIZATION.MOVIE_FORM.DOP_LABEL}
                </label>
                <div className="space-y-3">
                  {dops.map((dop, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <CreatableSearchSelect
                        value={dop}
                        options={crewOptions}
                        placeholder={LOCALIZATION.MOVIE_FORM.DOP_PLACEHOLDER}
                        onChange={(val) => {
                          const newDops = [...dops];
                          newDops[idx] = val;
                          setDops(newDops);
                        }}
                      />
                      {dops.length > 1 && (
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() =>
                            setDops(dops.filter((_, i) => i !== idx))
                          }
                          className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 transition-all flex-shrink-0 h-auto"
                        >
                          <CloseIcon className="text-sm" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setDops([...dops, { id: "", name: "" }])}
                    className="py-2 px-4 text-xs flex items-center gap-1 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:text-white text-zinc-300 font-semibold rounded-xl"
                  >
                    <AddIcon className="text-sm" />{" "}
                    {LOCALIZATION.MOVIE_FORM.DOP_ADD}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300">
                  {LOCALIZATION.MOVIE_FORM.EDITOR_LABEL}
                </label>
                <div className="space-y-3">
                  {editors.map((editor, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <CreatableSearchSelect
                        value={editor}
                        options={crewOptions}
                        placeholder={LOCALIZATION.MOVIE_FORM.EDITOR_PLACEHOLDER}
                        onChange={(val) => {
                          const newEditors = [...editors];
                          newEditors[idx] = val;
                          setEditors(newEditors);
                        }}
                      />
                      {editors.length > 1 && (
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() =>
                            setEditors(editors.filter((_, i) => i !== idx))
                          }
                          className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 transition-all flex-shrink-0 h-auto"
                        >
                          <CloseIcon className="text-sm" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      setEditors([...editors, { id: "", name: "" }])
                    }
                    className="py-2 px-4 text-xs flex items-center gap-1 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:text-white text-zinc-300 font-semibold rounded-xl"
                  >
                    <AddIcon className="text-sm" />{" "}
                    {LOCALIZATION.MOVIE_FORM.EDITOR_ADD}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300">
                  {LOCALIZATION.MOVIE_FORM.BTS_VIDEO_LABEL}
                </label>
                <div className="space-y-3">
                  {btsVideos.map((videoUrl, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <Input
                        type="text"
                        placeholder={
                          LOCALIZATION.MOVIE_FORM.BTS_VIDEO_PLACEHOLDER
                        }
                        value={videoUrl}
                        onChange={(e) => {
                          const newVideos = [...btsVideos];
                          newVideos[idx] = e.target.value;
                          setBtsVideos(newVideos);
                        }}
                        className="flex-1 bg-black/40 border-zinc-800 focus:border-brand rounded-xl px-4 py-2.5"
                      />
                      {btsVideos.length > 1 && (
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() =>
                            setBtsVideos(btsVideos.filter((_, i) => i !== idx))
                          }
                          className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 transition-all h-auto"
                        >
                          <CloseIcon className="text-sm" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setBtsVideos([...btsVideos, ""])}
                    className="py-2 px-4 text-xs w-fit flex items-center gap-1.5 rounded-xl bg-zinc-900 border border-zinc-800"
                  >
                    <AddIcon className="text-sm" />{" "}
                    {LOCALIZATION.MOVIE_FORM.BTS_VIDEO_ADD}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-zinc-800/60">
              <label className="text-xs font-semibold text-zinc-300">
                {LOCALIZATION.MOVIE_FORM.DESC_LABEL}
              </label>
              <textarea
                rows={5}
                placeholder={LOCALIZATION.MOVIE_FORM.DESC_PLACEHOLDER}
                {...register("description", {
                  required: LOCALIZATION.MOVIE_FORM.DESC_REQUIRED,
                })}
                className={`w-full bg-black/40 border ${errors.description ? "border-red-500" : "border-zinc-800 focus:border-brand"} rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors resize-none`}
              />
              {errors.description && (
                <span className="text-[10px] text-red-500 block pl-1 font-semibold">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div className="pt-6 border-t border-zinc-800/40 flex items-center gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push("/admin/movies")}
                className="flex-1 py-3 text-sm font-semibold rounded-xl"
              >
                {LOCALIZATION.MOVIE_FORM.CANCEL}
              </Button>
              <Button
                type="submit"
                className="flex-1 py-3 text-sm font-semibold rounded-xl"
              >
                {editingMovie
                  ? LOCALIZATION.MOVIE_FORM.SAVE
                  : LOCALIZATION.MOVIE_FORM.ADD}
              </Button>
            </div>
          </form>
        </div>
      </main>

      {isSavingLocal && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-zinc-800/60" />
              <div className="absolute inset-0 rounded-full border-4 border-brand border-t-transparent animate-spin" />
            </div>
            <div className="space-y-1.5 text-center">
              <h3 className="text-xl font-bold tracking-wide text-white">
                {editingMovie
                  ? LOCALIZATION.LOADING.SAVE_MOVIE
                  : LOCALIZATION.LOADING.SAVE_MOVIE}
              </h3>
              <p className="text-xs text-zinc-400 font-light">
                {editingMovie
                  ? LOCALIZATION.LOADING.SUB_SAVE_MOVIE
                  : LOCALIZATION.LOADING.SUB_SAVE_MOVIE}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
