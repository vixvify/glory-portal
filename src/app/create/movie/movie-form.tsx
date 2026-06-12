"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useForm, Controller, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import MovieIcon from "@mui/icons-material/Movie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { SearchSelect } from "@/components/ui/search-select";
import { Movie, Category } from "@/core/domain/movie";
import { CrewMember } from "@/core/domain/crew";
import { parseSchema } from "@/lib/validation";
import { createMovieSchema, updateMovieSchema } from "@/core/schema/movie";
import { LOCALIZATION } from "@/core/constants/localization";
import { CATEGORY_TITLE_MAPPING } from "@/core/constants/categories";
import { useAppStore } from "@/store/use-store";
import {
  COLOR_OPTIONS,
  ASPECT_RATIO_OPTIONS,
  CONTENT_WARNING_OPTIONS,
  DROPDOWN_PLACEHOLDERS,
  CREW_TAB_OPTIONS,
  CrewTabId,
  AGE_RATING_OPTIONS,
  LANGUAGE_OPTIONS,
} from "@/core/constants/movie-form";
import {
  useCreateMovieMutation,
  useUpdateMovieMutation,
} from "@/hooks/db/use-movies";
import { CreateMovie, UpdateMovie } from "@/core/domain/movie";
import { CrewStateItem } from "@/core/domain/crew";
import { mapCrewToState, mapStateToCrewInput } from "@/utils/crew";
import YoutubePreview from "@/components/preview/youtube";
import { CREW_TAB_CONFIG } from "@/core/constants/movie-form";
import { CrewSection } from "@/components/crew/crew-section";

interface MovieFormProps {
  editingMovie?: Movie | null;
  categories: Category[];
  universities: string[];
  availableCrew: CrewMember[];
}

type MovieFormInputs = {
  title: string;
  description: string;
  categoryId: string;
  thumbnail?: File | null;
  youtubeUrl: string;
  trailerUrl?: string;
  releaseDate: string;
  aspectRatio: string;
  ageRating: string;
  duration: number;
  university?: string;
  school?: string;
  language?: string;
  hasProfanity: boolean;
  hasDrugs: boolean;
  colorType: string;
  studio?: string;
  director?: string[];
  producer?: string[];
  writer?: string[];
  cast?: string[];
  dop?: string[];
  editor?: string[];
  btsVideo?: string[];
  awards?: string[];
};

const DEFAULT_CREW_ITEM: CrewStateItem = { id: "", name: "", email: "" };

const INITIAL_CREW_STATE: Record<CrewTabId, CrewStateItem[]> = {
  director: [{ ...DEFAULT_CREW_ITEM }],
  producer: [{ ...DEFAULT_CREW_ITEM }],
  writer: [{ ...DEFAULT_CREW_ITEM }],
  cast: [{ ...DEFAULT_CREW_ITEM }],
  dop: [{ ...DEFAULT_CREW_ITEM }],
  editor: [{ ...DEFAULT_CREW_ITEM }],
};

export const MovieForm: React.FC<MovieFormProps> = ({
  editingMovie = null,
  categories,
  universities,
  availableCrew,
}) => {
  const router = useRouter();
  const { showToast } = useAppStore();

  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [btsVideos, setBtsVideos] = useState<string[]>(() =>
    editingMovie?.btsVideos && editingMovie.btsVideos.length > 0
      ? editingMovie.btsVideos
      : [""],
  );
  const [movieCoverPreview, setMovieCoverPreview] = useState<string | null>(
    () =>
      editingMovie && typeof editingMovie.thumbnail === "string"
        ? editingMovie.thumbnail
        : null,
  );
  const [isSavingLocal, setIsSavingLocal] = useState(false);
  const [activeCrewTab, setActiveCrewTab] = useState<CrewTabId>("director");
  const [crewState, setCrewState] = useState<
    Record<CrewTabId, CrewStateItem[]>
  >(() =>
    editingMovie
      ? {
          director: mapCrewToState(editingMovie.crew, "director"),
          producer: mapCrewToState(editingMovie.crew, "producer"),
          writer: mapCrewToState(editingMovie.crew, "writer"),
          cast: mapCrewToState(editingMovie.crew, "cast"),
          dop: mapCrewToState(editingMovie.crew, "dop"),
          editor: mapCrewToState(editingMovie.crew, "editor"),
        }
      : INITIAL_CREW_STATE,
  );

  const createMovieMutation = useCreateMovieMutation();
  const updateMovieMutation = useUpdateMovieMutation();

  const crewOptions = availableCrew.map((c) => ({
    id: c.id,
    name: c.name,
    photoUrl: c.user?.photoUrl,
    email: c.email || "",
  }));

  const setCrewList = useCallback(
    (tab: CrewTabId) => (list: CrewStateItem[]) => {
      setCrewState((prev) => ({ ...prev, [tab]: list }));
    },
    [],
  );

  const [affiliationType, setAffiliationType] = useState<
    "university" | "school" | "studio"
  >(() => {
    if (editingMovie?.school) return "school";
    if (editingMovie?.studio) return "studio";
    return "university";
  });

  const [awards, setAwards] = useState<string[]>(() =>
    editingMovie?.awards && editingMovie.awards.length > 0
      ? editingMovie.awards
      : [""],
  );

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<MovieFormInputs>({
    defaultValues: editingMovie
      ? {
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
          director: [],
          producer: [],
          writer: [],
          cast: [],
          dop: [],
          editor: [],
          btsVideo: editingMovie.btsVideos || [],
          awards: editingMovie.awards || [],
          releaseDate: editingMovie.releaseDate
            ? typeof editingMovie.releaseDate === "string"
              ? editingMovie.releaseDate.split("T")[0]
              : editingMovie.releaseDate.toISOString().split("T")[0]
            : "",
        }
      : {
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
          director: [],
          producer: [],
          writer: [],
          cast: [],
          dop: [],
          editor: [],
          btsVideo: [],
          awards: [""],
        },
  });

  const watchedYoutubeUrl = useWatch({ control, name: "youtubeUrl" });
  const watchedTrailerUrl = useWatch({ control, name: "trailerUrl" });
  const watchedProfanity = useWatch({ control, name: "hasProfanity" }) ?? false;
  const watchedDrugs = useWatch({ control, name: "hasDrugs" }) ?? false;

  const selectedWarnings = [
    ...(watchedProfanity ? ["profanity"] : []),
    ...(watchedDrugs ? ["drugs"] : []),
  ];

  useEffect(() => {
    return () => {
      if (movieCoverPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(movieCoverPreview);
      }
    };
  }, [movieCoverPreview]);

  const onSubmitForm = async (data: MovieFormInputs) => {
    try {
      setIsSavingLocal(true);
      const activeVideos = btsVideos.map((v) => v.trim()).filter(Boolean);
      const activeAwards = awards.map((a) => a.trim()).filter(Boolean);

      let university = null;
      let school = null;
      let studio = null;

      if (affiliationType === "university") {
        university = data.university || null;
      } else if (affiliationType === "school") {
        school = data.school || null;
      } else if (affiliationType === "studio") {
        studio = data.studio || null;
      }

      const rawPayload = {
        ...data,
        thumbnail: data.thumbnail || editingMovie?.thumbnail,
        duration: Number(data.duration),
        btsVideo: activeVideos,
        awards: activeAwards,
        university,
        school,
        studio,
        director: mapStateToCrewInput(crewState.director),
        producer: mapStateToCrewInput(crewState.producer),
        writer: mapStateToCrewInput(crewState.writer),
        cast: mapStateToCrewInput(crewState.cast),
        dop: mapStateToCrewInput(crewState.dop),
        editor: mapStateToCrewInput(crewState.editor),
      };

      if (editingMovie) {
        const validated = parseSchema(updateMovieSchema, rawPayload);
        const updatedPayload: UpdateMovie = {
          ...validated,
          id: editingMovie.id,
          awards: validated.awards ?? undefined,
          thumbnail:
            validated.thumbnail instanceof File ||
            typeof validated.thumbnail === "string"
              ? validated.thumbnail
              : editingMovie.thumbnail,
        };

        await updateMovieMutation.mutateAsync(updatedPayload);
        showToast(LOCALIZATION.TOAST.EDIT_MOVIE_SUCCESS, "success");
      } else {
        const validated = parseSchema(createMovieSchema, rawPayload);
        const createPayload: CreateMovie = {
          ...validated,
          awards: validated.awards ?? undefined,
          thumbnail: validated.thumbnail as File,
        };

        await createMovieMutation.mutateAsync(createPayload);
        showToast(LOCALIZATION.TOAST.ADD_MOVIE_SUCCESS, "success");
      }

      router.push("/");
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
            {editingMovie ? "แก้ไขข้อมูล" : "อัพโหลด"}
          </h1>
          <p className="text-xs text-zinc-400 font-light">
            กรอกข้อมูลรายละเอียดของภาพยนตร์สั้น ลิงก์ตัวอย่าง อัปโหลดใบปิด
            และจัดการรายชื่อทีมงานทั้งหมด
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-8">
          <div className="rounded-lg p-6 md:p-8 shadow-xl space-y-6">
            <div className="flex items-center gap-2 border-b border-zinc-800/40 pb-4">
              <span className="w-1.5 h-6 bg-brand rounded-full" />
              <h2 className="text-lg font-bold text-white">
                ข้อมูลทั่วไปของภาพยนตร์
              </h2>
            </div>

            <div className="space-y-2">
              <Input
                label="ลิงก์ภาพยนตร์"
                placeholder="กรอกลิงก์ภาพยนตร์"
                error={errors.youtubeUrl?.message}
                {...register("youtubeUrl", {
                  required: "กรุณากรอกลิงก์ภาพยนตร์",
                })}
              />
              <YoutubePreview url={watchedYoutubeUrl} />
            </div>

            <Input
              label="ชื่อเรื่อง"
              placeholder="กรอกชื่อภาพยนตร์"
              error={errors.title?.message}
              {...register("title", {
                required: "กรุณากรอกชื่อเรื่อง",
              })}
            />

            <div className="space-y-1 w-full text-left">
              <label className="text-xs text-zinc-400 font-medium block">
                เรื่องย่อขนาดสั้น (ไม่เกิน 200 คำ)
              </label>
              <textarea
                rows={5}
                placeholder="กรอกรายละเอียดเรื่องย่อภาพยนตร์"
                {...register("description", {
                  required: "กรุณากรอกเรื่องย่อภาพยนตร์",
                })}
                className={`w-full bg-zinc-900 border ${
                  errors.description
                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-zinc-800 focus:border-brand"
                } rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-colors placeholder-zinc-650 font-light resize-none`}
              />
              {errors.description && (
                <span className="text-[10px] text-red-500 block pl-1 font-semibold">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Select
                label="หมวดหมู่"
                error={errors.categoryId?.message}
                {...register("categoryId", { required: "กรุณาเลือกหมวดหมู่" })}
                options={categories.map((cat) => ({
                  value: cat.id,
                  label: CATEGORY_TITLE_MAPPING[cat.name] || cat.name,
                }))}
              />
              <Select
                label="เรตอายุที่แนะนำ"
                error={errors.ageRating?.message}
                {...register("ageRating", { required: "กรุณาเลือกเรตอายุ" })}
                options={AGE_RATING_OPTIONS.map((rating) => ({
                  value: rating,
                  label: rating,
                }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Select
                label="ภาษา"
                error={errors.language?.message}
                {...register("language")}
                options={LANGUAGE_OPTIONS.map((language) => ({
                  value: language,
                  label: language,
                }))}
              />
              <Select
                label="โทนสีภาพยนตร์"
                error={errors.colorType?.message}
                {...register("colorType", {
                  required: "กรุณาเลือกโทนสีภาพยนตร์",
                })}
                options={COLOR_OPTIONS}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Input
                label="วันที่เผยแพร่"
                type="date"
                error={errors.releaseDate?.message}
                {...register("releaseDate", {
                  required: "กรุณาเลือกวันที่เผยแพร่",
                })}
              />
              <Select
                label="อัตราส่วนภาพ"
                error={errors.aspectRatio?.message}
                {...register("aspectRatio", {
                  required: "กรุณาเลือกอัตราส่วนภาพ",
                })}
                options={ASPECT_RATIO_OPTIONS}
              />
              <Input
                label="ความยาวภาพยนตร์ (นาที)"
                placeholder="กรอกความยาวภาพยนตร์"
                error={errors.duration?.message}
                {...register("duration", {
                  required: "กรุณากรอกความยาวภาพยนตร์",
                })}
              />
            </div>

            <div className="space-y-4 pt-2 border-t border-zinc-800/40">
              <div className="space-y-2">
                <label className="text-xs text-zinc-400 font-medium block">
                  ส่งผลงานในนาม
                </label>
                <div className="flex gap-2 bg-zinc-900/50 p-1.5 rounded-lg w-fit border border-zinc-800/60">
                  {(["university", "school", "studio"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAffiliationType(type)}
                      className={`px-4 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer border-0 ${
                        affiliationType === type
                          ? "bg-brand text-zinc-950 font-bold shadow-md"
                          : "text-zinc-450 hover:text-white hover:bg-zinc-850/50"
                      }`}
                    >
                      {type === "university"
                        ? "มหาวิทยาลัย"
                        : type === "school"
                          ? "โรงเรียน"
                          : "สตูดิโอ / ค่ายอิสระ"}
                    </button>
                  ))}
                </div>
              </div>

              {affiliationType === "university" && (
                <div className="space-y-1 animate-fade-in relative z-20">
                  <Controller
                    name="university"
                    control={control}
                    render={({ field }) => (
                      <SearchSelect
                        label="มหาวิทยาลัย"
                        placeholder="พิมพ์เพื่อค้นหา หรือเลือกมหาวิทยาลัย..."
                        value={field.value || ""}
                        onChange={field.onChange}
                        error={errors.university?.message}
                        options={universities.map((uni) => ({
                          value: uni,
                          label: uni,
                        }))}
                      />
                    )}
                  />
                </div>
              )}

              {affiliationType === "school" && (
                <div className="space-y-1 animate-fade-in relative z-20">
                  <Input
                    label="โรงเรียน"
                    placeholder="กรอกชื่อโรงเรียนที่ผลิต"
                    error={errors.school?.message}
                    {...register("school", {
                      required:
                        affiliationType === "school"
                          ? "กรุณากรอกชื่อโรงเรียน"
                          : false,
                    })}
                  />
                </div>
              )}

              {affiliationType === "studio" && (
                <div className="animate-fade-in">
                  <Input
                    label="สตูดิโอ / สังกัด"
                    placeholder="กรอกชื่อสังกัดหรือสตูดิโอที่ผลิต"
                    error={errors.studio?.message}
                    {...register("studio", {
                      required:
                        affiliationType === "studio"
                          ? "กรุณากรอกชื่อสตูดิโอ"
                          : false,
                    })}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6">
              <MultiSelect
                label="คำเตือนเนื้อหา"
                options={CONTENT_WARNING_OPTIONS}
                selectedValues={selectedWarnings}
                onChange={(values) => {
                  setValue("hasProfanity", values.includes("profanity"), {
                    shouldDirty: true,
                  });
                  setValue("hasDrugs", values.includes("drugs"), {
                    shouldDirty: true,
                  });
                }}
                placeholder="ไม่มีคำเตือนเนื้อหา / เลือกคำเตือน..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 ">
              <div className="space-y-1 w-full text-left">
                <label className="text-xs text-zinc-400 font-medium block">
                  ภาพปกภาพยนตร์
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
                    className={`w-full bg-zinc-900 border ${
                      errors.thumbnail
                        ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-zinc-800 group-hover/file:border-brand"
                    } rounded-lg px-4 py-2.5 text-sm text-zinc-450 flex items-center justify-between transition-colors min-h-[42px] font-light`}
                  >
                    <span
                      className={
                        selectedFileName
                          ? "text-white font-medium truncate max-w-[70%]"
                          : "text-zinc-600"
                      }
                    >
                      {selectedFileName || "อัปโหลดภาพปกภาพยนตร์..."}
                    </span>
                    <span className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-lg text-xs font-semibold group-hover/file:bg-brand group-hover/file:text-white transition-colors">
                      เลือกไฟล์
                    </span>
                  </div>
                </div>

                {movieCoverPreview && (
                  <div className="mt-3 relative rounded-xl overflow-hidden border border-zinc-800 bg-black/40 aspect-[16/9] w-full max-w-[280px] group/preview">
                    <Image
                      src={movieCoverPreview}
                      alt="Cover Preview"
                      fill
                      className="object-cover"
                      unoptimized
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
                      className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500 hover:text-white text-zinc-400 rounded-full transition-colors cursor-pointer border-0 shadow-md opacity-0 group-hover/preview:opacity-100"
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
                  <p className="text-[10px] text-zinc-550 pl-1 leading-relaxed">
                    รูปปัจจุบัน:{" "}
                    <span className="text-brand font-medium truncate max-w-[200px] inline-block align-bottom">
                      {editingMovie.thumbnail.split("/").pop()}
                    </span>{" "}
                    (เว้นว่างไว้หากต้องการใช้รูปเดิม)
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Input
                  label="ลิงก์ตัวอย่างภาพยนตร์"
                  placeholder="กรอกลิงก์ตัวอย่างภาพยนตร์"
                  error={errors.trailerUrl?.message}
                  {...register("trailerUrl")}
                />
                <YoutubePreview url={watchedTrailerUrl} />
              </div>

              <div className="space-y-1 w-full text-left pt-4">
                <label className="text-xs text-zinc-400 font-medium block">
                  ลิงก์วิดีโอเบื้องหลัง
                </label>
                <div className="space-y-4">
                  {btsVideos.map((videoUrl, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex gap-2 items-center">
                        <Input
                          type="text"
                          placeholder="กรอกลิงก์วิดีโอเบื้องหลัง"
                          value={videoUrl}
                          onChange={(e) => {
                            const newVideos = [...btsVideos];
                            newVideos[idx] = e.target.value;
                            setBtsVideos(newVideos);
                          }}
                          className="flex-1"
                        />
                        {btsVideos.length > 1 && (
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() =>
                              setBtsVideos(
                                btsVideos.filter((_, i) => i !== idx),
                              )
                            }
                            className="px-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg border border-red-500/20 transition-all h-[42px] flex items-center justify-center flex-shrink-0"
                          >
                            <CloseIcon className="text-sm" />
                          </Button>
                        )}
                      </div>
                      <YoutubePreview url={videoUrl} />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setBtsVideos([...btsVideos, ""])}
                    className="py-2 px-4 text-xs w-fit flex items-center gap-1.5 rounded-md bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 transition-colors"
                  >
                    <AddIcon className="text-sm" />{" "}
                    เพิ่มลิงก์วิดีโอเบื้องหลังอื่น
                  </Button>
                </div>
              </div>

              <div className="space-y-1 w-full text-left pt-4">
                <label className="text-xs text-zinc-400 font-medium block">
                  รางวัลที่ได้รับ
                </label>
                <div className="space-y-4">
                  {awards.map((awardName, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <Input
                        type="text"
                        placeholder="กรอกชื่อรางวัลที่ได้รับ (ถ้ามี)"
                        value={awardName}
                        onChange={(e) => {
                          const newAwards = [...awards];
                          newAwards[idx] = e.target.value;
                          setAwards(newAwards);
                        }}
                        className="flex-1"
                      />
                      {awards.length > 1 && (
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() =>
                            setAwards(awards.filter((_, i) => i !== idx))
                          }
                          className="px-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg border border-red-500/20 transition-all h-[42px] flex items-center justify-center flex-shrink-0"
                        >
                          <CloseIcon className="text-sm" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setAwards([...awards, ""])}
                    className="py-2 px-4 text-xs w-fit flex items-center gap-1.5 rounded-md bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 transition-colors"
                  >
                    <AddIcon className="text-sm" /> เพิ่มรางวัลอื่น
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg p-6 md:p-8 shadow-xl  space-y-6">
            <div className="flex items-center gap-2 border-b border-zinc-800/40 pb-4">
              <span className="w-1.5 h-6 bg-brand rounded-full" />
              <h2 className="text-lg font-bold text-white">ทีมงาน</h2>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 border-b border-zinc-800/40 pb-4">
                {CREW_TAB_OPTIONS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveCrewTab(tab.id)}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      activeCrewTab === tab.id
                        ? "bg-brand/10 border-brand text-brand font-bold"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-850"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="bg-zinc-900/10 border border-zinc-800/40 rounded-lg p-5 md:p-6 min-h-[200px]">
                {CREW_TAB_CONFIG.map(
                  (tab) =>
                    activeCrewTab === tab.id && (
                      <CrewSection
                        key={tab.id}
                        label={tab.label}
                        list={crewState[tab.id]}
                        setList={setCrewList(tab.id)}
                        placeholder={tab.placeholder}
                        addButtonLabel={tab.addLabel}
                        crewOptions={crewOptions}
                      />
                    ),
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-800/40 flex items-center gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/")}
              disabled={isSavingLocal}
              className="flex-1 py-3 text-sm font-semibold rounded-md"
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              isLoading={isSavingLocal}
              disabled={isSavingLocal}
              className="flex-1 py-3 text-sm font-semibold rounded-md"
            >
              {editingMovie ? "บันทึกข้อมูลภาพยนตร์" : "เพิ่มภาพยนตร์ใหม่"}
            </Button>
          </div>
        </form>
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
                {LOCALIZATION.LOADING.SAVE_MOVIE}
              </h3>
              <p className="text-xs text-zinc-400 font-light">
                {LOCALIZATION.LOADING.SUB_SAVE_MOVIE}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
