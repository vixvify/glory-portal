"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import MovieIcon from "@mui/icons-material/Movie";
import EmailIcon from "@mui/icons-material/Email";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { CreatableSearchSelect } from "@/components/ui/search-select";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Movie,
  Category,
  AgeRating,
  University,
  Language,
  TargetGroup,
} from "@/core/domain/movie";
import { CrewMember } from "@/core/domain/crew";
import { parseSchema } from "@/lib/validation";
import { createMovieSchema } from "@/core/schema/movie";
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
} from "@/core/constants/movie-form";
import {
  useCreateMovieMutation,
  useUpdateMovieMutation,
} from "@/hooks/use-movies";
import { CreateMovie, UpdateMovie } from "@/core/domain/movie";
import { CrewStateItem } from "@/core/domain/crew";
import { getYouTubeId } from "@/utils/youtube";
import { mapCrewToState, mapStateToCrewInput } from "@/utils/crew";

interface CrewSectionProps {
  label: string;
  list: CrewStateItem[];
  setList: React.Dispatch<React.SetStateAction<CrewStateItem[]>>;
  placeholder: string;
  addButtonLabel: string;
  crewOptions: Array<{
    id: string;
    name: string;
    photoUrl?: string | null;
    email: string;
  }>;
}

const CrewSection: React.FC<CrewSectionProps> = ({
  label,
  list,
  setList,
  placeholder,
  addButtonLabel,
  crewOptions,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-zinc-300">{label}</label>
      <div className="space-y-4">
        {list.map((item, idx) => (
          <div
            key={idx}
            className="flex gap-3 items-center p-3 bg-zinc-900/10 border border-zinc-900 rounded-2xl"
          >
            <div className="flex-1 space-y-2">
              <CreatableSearchSelect
                value={{ id: item.id, name: item.name, email: item.email }}
                options={crewOptions}
                placeholder={placeholder}
                onChange={(val) => {
                  const newList = [...list];
                  newList[idx] = {
                    id: val.id,
                    name: val.name,
                    email: val.email || "",
                  };
                  setList(newList);
                }}
                className="w-full"
              />
              <Input
                type="email"
                placeholder="เช่น example@email.com"
                value={item.email}
                readOnly={!!item.id}
                onChange={(e) => {
                  const newList = [...list];
                  newList[idx] = {
                    ...newList[idx],
                    email: e.target.value,
                  };
                  setList(newList);
                }}
                className="bg-black/25 border-zinc-900/80 focus:border-brand/45 rounded-lg py-1.5 text-xs text-zinc-300 read-only:opacity-60 read-only:cursor-not-allowed h-8"
                icon={<EmailIcon className="text-sm" />}
              />
            </div>
            {list.length > 1 && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setList(list.filter((_, i) => i !== idx))}
                className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 transition-all flex-shrink-0 h-auto self-center"
              >
                <CloseIcon className="text-sm" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          onClick={() => setList([...list, { id: "", name: "", email: "" }])}
          className="py-2 px-4 text-xs flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:text-white text-zinc-300 font-semibold rounded-xl"
        >
          <AddIcon className="text-sm" /> {addButtonLabel}
        </Button>
      </div>
    </div>
  );
};

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
  categoryId: string;
  thumbnail?: File | null;
  youtubeUrl: string;
  trailerUrl?: string;
  year: number;
  aspectRatio: string;
  ageRatingId: string;
  duration: number;
  universityId?: string;
  languageId?: string;
  targetGroupId?: string;
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
  const [activeCrewTab, setActiveCrewTab] = useState<CrewTabId>("director");

  const [directors, setDirectors] = useState<CrewStateItem[]>([
    { id: "", name: "", email: "" },
  ]);
  const [producers, setProducers] = useState<CrewStateItem[]>([
    { id: "", name: "", email: "" },
  ]);
  const [writers, setWriters] = useState<CrewStateItem[]>([
    { id: "", name: "", email: "" },
  ]);
  const [castMembers, setCastMembers] = useState<CrewStateItem[]>([
    { id: "", name: "", email: "" },
  ]);
  const [dops, setDops] = useState<CrewStateItem[]>([
    { id: "", name: "", email: "" },
  ]);
  const [editors, setEditors] = useState<CrewStateItem[]>([
    { id: "", name: "", email: "" },
  ]);

  const createMovieMutation = useCreateMovieMutation();
  const updateMovieMutation = useUpdateMovieMutation();

  const crewOptions = availableCrew.map((c) => ({
    id: c.id,
    name: c.name,
    photoUrl: c.user?.photoUrl,
    email: c.email || "",
  }));

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<MovieFormInputs>();

  const watchedYoutubeUrl = useWatch({ control, name: "youtubeUrl" });
  const watchedTrailerUrl = useWatch({ control, name: "trailerUrl" });
  const watchedProfanity = useWatch({ control, name: "hasProfanity" }) ?? false;
  const watchedDrugs = useWatch({ control, name: "hasDrugs" }) ?? false;

  const selectedWarnings = [
    ...(watchedProfanity ? ["profanity"] : []),
    ...(watchedDrugs ? ["drugs"] : []),
  ];

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (editingMovie) {
      setSelectedFileName(null);
      setMovieCoverPreview(
        typeof editingMovie.thumbnail === "string"
          ? editingMovie.thumbnail
          : null,
      );
      setBtsVideos(
        editingMovie.btsVideos && editingMovie.btsVideos.length > 0
          ? editingMovie.btsVideos
          : [""],
      );

      setDirectors(mapCrewToState(editingMovie.crew, "director"));
      setProducers(mapCrewToState(editingMovie.crew, "producer"));
      setWriters(mapCrewToState(editingMovie.crew, "writer"));
      setCastMembers(mapCrewToState(editingMovie.crew, "cast"));
      setDops(mapCrewToState(editingMovie.crew, "dop"));
      setEditors(mapCrewToState(editingMovie.crew, "editor"));

      reset({
        title: editingMovie.title,
        description: editingMovie.description,
        categoryId: editingMovie.category.id,
        thumbnail: null,
        youtubeUrl: editingMovie.youtubeUrl,
        trailerUrl: editingMovie.trailerUrl || "",
        year: editingMovie.year,
        aspectRatio: editingMovie.aspectRatio || "แนวนอน",
        ageRatingId: editingMovie.ageRating.id,
        duration: editingMovie.duration,
        universityId: editingMovie.university?.id || "",
        languageId: editingMovie.language?.id || "",
        targetGroupId: editingMovie.targetGroup?.id || "",
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
      });
    } else {
      setSelectedFileName(null);
      setMovieCoverPreview(null);
      setBtsVideos([""]);
      setDirectors([{ id: "", name: "", email: "" }]);
      setProducers([{ id: "", name: "", email: "" }]);
      setWriters([{ id: "", name: "", email: "" }]);
      setCastMembers([{ id: "", name: "", email: "" }]);
      setDops([{ id: "", name: "", email: "" }]);
      setEditors([{ id: "", name: "", email: "" }]);
      reset({
        title: "",
        description: "",
        categoryId: categories[0]?.id || "",
        thumbnail: null,
        youtubeUrl: "",
        trailerUrl: "",
        year: new Date().getFullYear(),
        aspectRatio: "แนวนอน",
        ageRatingId: ageRatings[0]?.id || "",
        duration: 120,
        universityId: "",
        languageId: "",
        targetGroupId: "",
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
      });
    }
  }, [editingMovie, reset, categories, ageRatings]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const onSubmitForm = async (data: MovieFormInputs) => {
    try {
      setIsSavingLocal(true);
      const activeVideos = btsVideos.map((v) => v.trim()).filter(Boolean);
      const thumbnailFile = data.thumbnail;

      const validated = parseSchema(createMovieSchema, {
        ...data,
        thumbnail: thumbnailFile || editingMovie?.thumbnail,
        year: Number(data.year),
        duration: Number(data.duration),
        universityId: data.universityId || null,
        languageId: data.languageId || null,
        targetGroupId: data.targetGroupId || null,
        hasProfanity: data.hasProfanity,
        hasDrugs: data.hasDrugs,
        colorType: data.colorType || "color",
        studio: data.studio || null,
        btsVideo: activeVideos,
        director: mapStateToCrewInput(directors),
        producer: mapStateToCrewInput(producers),
        writer: mapStateToCrewInput(writers),
        cast: mapStateToCrewInput(castMembers),
        dop: mapStateToCrewInput(dops),
        editor: mapStateToCrewInput(editors),
      });

      if (editingMovie) {
        const updatedPayload: UpdateMovie = {
          id: editingMovie.id,
          title: validated.title,
          description: validated.description,
          categoryId: validated.categoryId,
          thumbnail:
            validated.thumbnail instanceof File ||
            typeof validated.thumbnail === "string"
              ? validated.thumbnail
              : editingMovie.thumbnail,
          youtubeUrl: validated.youtubeUrl,
          trailerUrl: validated.trailerUrl || null,
          year: validated.year,
          aspectRatio: validated.aspectRatio,
          ageRatingId: validated.ageRatingId,
          duration: validated.duration,
          universityId: validated.universityId || null,
          languageId: validated.languageId || null,
          targetGroupId: validated.targetGroupId || null,
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

        await updateMovieMutation.mutateAsync(updatedPayload);
        showToast(LOCALIZATION.TOAST.EDIT_MOVIE_SUCCESS, "success");
      } else {
        const createPayload: CreateMovie = {
          title: validated.title,
          description: validated.description,
          categoryId: validated.categoryId,
          thumbnail: validated.thumbnail as File,
          youtubeUrl: validated.youtubeUrl,
          trailerUrl: validated.trailerUrl || undefined,
          year: validated.year,
          aspectRatio: validated.aspectRatio,
          ageRatingId: validated.ageRatingId,
          duration: validated.duration,
          universityId: validated.universityId || undefined,
          languageId: validated.languageId || undefined,
          targetGroupId: validated.targetGroupId || undefined,
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
            {editingMovie ? "แก้ไขข้อมูลภาพยนตร์" : "สร้างภาพยนตร์ใหม่"}
          </h1>
          <p className="text-xs text-zinc-400 font-light">
            กรอกข้อมูลรายละเอียดของภาพยนตร์สั้น ลิงก์ตัวอย่าง อัปโหลดใบปิด
            และจัดการรายชื่อทีมงานทั้งหมด
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-8">
          <div className="bg-card border border-zinc-800/35 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-md space-y-6">
            <div className="flex items-center gap-2 border-b border-zinc-800/40 pb-4">
              <span className="w-1.5 h-6 bg-brand rounded-full" />
              <h2 className="text-lg font-bold text-white">
                ข้อมูลทั่วไปของภาพยนตร์
              </h2>
            </div>

            <div className="space-y-2">
              <Input
                label="ลิงก์ภาพยนตร์"
                placeholder="https://www.youtube.com/watch?v=..."
                error={errors.youtubeUrl?.message}
                {...register("youtubeUrl", {
                  required: "กรุณากรอกลิงก์ภาพยนตร์",
                })}
              />
              {watchedYoutubeUrl &&
                (() => {
                  const ytid = getYouTubeId(watchedYoutubeUrl);
                  return ytid ? (
                    <div className="mt-2 relative rounded-2xl overflow-hidden border border-zinc-800 bg-black/50 aspect-[16/9] w-full max-w-md shadow-lg shadow-black/50 transition-all hover:border-brand/30">
                      <iframe
                        src={`https://www.youtube.com/embed/${ytid}`}
                        title="YouTube Movie Preview"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>
                  ) : watchedYoutubeUrl.trim() ? (
                    <p className="text-[10px] text-zinc-555 pl-1">
                      ลิงก์ YouTube ไม่ถูกต้อง
                    </p>
                  ) : null;
                })()}
            </div>

            <Input
              label="ชื่อเรื่อง"
              placeholder="เช่น Interstellar"
              error={errors.title?.message}
              {...register("title", {
                required: "กรุณากรอกชื่อเรื่อง",
              })}
            />

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">
                เรื่องย่อ
              </label>
              <textarea
                rows={5}
                placeholder="กรอกรายละเอียดเรื่องย่อภาพยนตร์เพื่อดึงดูดผู้ชม..."
                {...register("description", {
                  required: "กรุณากรอกเรื่องย่อภาพยนตร์",
                })}
                className={`w-full bg-black/40 border ${errors.description ? "border-red-500" : "border-zinc-800 focus:border-brand"} rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors resize-none`}
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
                {...register("categoryId", {
                  required: "กรุณาเลือกหมวดหมู่",
                })}
                options={categories.map((cat) => ({
                  value: cat.id,
                  label: CATEGORY_TITLE_MAPPING[cat.name] || cat.name,
                }))}
              />

              <Select
                label="เรตอายุที่แนะนำ"
                error={errors.ageRatingId?.message}
                {...register("ageRatingId", {
                  required: "กรุณาเลือกเรตอายุ",
                })}
                options={ageRatings.map((rating) => ({
                  value: rating.id,
                  label: rating.name,
                }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Select
                label="ภาษาของภาพยนตร์"
                error={errors.languageId?.message}
                {...register("languageId")}
                options={[
                  DROPDOWN_PLACEHOLDERS.LANGUAGE,
                  ...languages.map((lang) => ({
                    value: lang.id,
                    label: lang.name,
                  })),
                ]}
              />

              <Select
                label="กลุ่มเป้าหมายผู้ชม"
                error={errors.targetGroupId?.message}
                {...register("targetGroupId")}
                options={[
                  DROPDOWN_PLACEHOLDERS.TARGET_GROUP,
                  ...targetGroups.map((tg) => ({
                    value: tg.id,
                    label: tg.name,
                  })),
                ]}
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
                label="ปีที่ฉาย"
                type="number"
                placeholder="เช่น 2014"
                error={errors.year?.message}
                {...register("year", {
                  required: "กรุณากรอกปีที่ฉาย",
                  min: {
                    value: 1900,
                    message: "ปีที่ฉายต้องไม่เก่ากว่า 1900",
                  },
                  max: {
                    value: 2100,
                    message: "ปีที่ฉายต้องไม่เกิน 2100",
                  },
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
                placeholder="เช่น 120"
                error={errors.duration?.message}
                {...register("duration", {
                  required: "กรุณากรอกความยาวภาพยนตร์",
                })}
              />
            </div>

            <Select
              label="สถาบัน / มหาวิทยาลัย"
              error={errors.universityId?.message}
              {...register("universityId")}
              options={[
                DROPDOWN_PLACEHOLDERS.UNIVERSITY,
                ...universities.map((uni) => ({
                  value: uni.id,
                  label: uni.name,
                })),
              ]}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="สังกัด"
                placeholder="พิมพ์ชื่อสังกัดหรือสตูดิโอ..."
                error={errors.studio?.message}
                {...register("studio")}
              />

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-800/20">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300">
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
                    className={`w-full bg-black/40 border ${errors.thumbnail ? "border-red-500" : "border-zinc-800 group-hover/file:border-brand"} rounded-xl px-4 py-3 text-sm text-zinc-400 flex items-center justify-between transition-colors`}
                  >
                    <span
                      className={
                        selectedFileName
                          ? "text-white font-medium truncate max-w-[70%]"
                          : "text-zinc-400"
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
                  placeholder="https://www.youtube.com/watch?v=..."
                  error={errors.trailerUrl?.message}
                  {...register("trailerUrl")}
                />
                {watchedTrailerUrl &&
                  (() => {
                    const ytid = getYouTubeId(watchedTrailerUrl);
                    return ytid ? (
                      <div className="mt-2 relative rounded-2xl overflow-hidden border border-zinc-800 bg-black/50 aspect-[16/9] w-full shadow-lg shadow-black/50 transition-all hover:border-brand/30">
                        <iframe
                          src={`https://www.youtube.com/embed/${ytid}`}
                          title="YouTube Trailer Preview"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="absolute inset-0 w-full h-full"
                        />
                      </div>
                    ) : watchedTrailerUrl.trim() ? (
                      <p className="text-[10px] text-zinc-555 pl-1">
                        ลิงก์ YouTube ไม่ถูกต้อง
                      </p>
                    ) : null;
                  })()}
              </div>
            </div>
          </div>

          <div className="bg-card border border-zinc-800/35 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-md space-y-6">
            <div className="flex items-center gap-2 border-b border-zinc-800/40 pb-4">
              <span className="w-1.5 h-6 bg-brand rounded-full" />
              <h2 className="text-lg font-bold text-white">
                ข้อมูลทีมงานและเบื้องหลัง
              </h2>
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

              <div className="bg-zinc-900/10 border border-zinc-800/30 rounded-3xl p-5 md:p-6 min-h-[200px]">
                {activeCrewTab === "director" && (
                  <CrewSection
                    label="ผู้กำกับ"
                    list={directors}
                    setList={setDirectors}
                    placeholder="พิมพ์ชื่อ หรือเลือกผู้กำกับจากคลังรายชื่อ..."
                    addButtonLabel="เพิ่มรายชื่อผู้กำกับ"
                    crewOptions={crewOptions}
                  />
                )}
                {activeCrewTab === "producer" && (
                  <CrewSection
                    label="ผู้อำนวยการสร้าง"
                    list={producers}
                    setList={setProducers}
                    placeholder="พิมพ์ชื่อ หรือเลือกผู้อำนวยการสร้าง..."
                    addButtonLabel="เพิ่มรายชื่อผู้อำนวยการสร้าง"
                    crewOptions={crewOptions}
                  />
                )}
                {activeCrewTab === "writer" && (
                  <CrewSection
                    label="ผู้เขียนบท"
                    list={writers}
                    setList={setWriters}
                    placeholder="พิมพ์ชื่อ หรือเลือกผู้เขียนบท..."
                    addButtonLabel="เพิ่มรายชื่อผู้เขียนบท"
                    crewOptions={crewOptions}
                  />
                )}
                {activeCrewTab === "cast" && (
                  <CrewSection
                    label="นักแสดงนำ"
                    list={castMembers}
                    setList={setCastMembers}
                    placeholder="พิมพ์ชื่อ หรือเลือกนักแสดง..."
                    addButtonLabel="เพิ่มรายชื่อนักแสดง"
                    crewOptions={crewOptions}
                  />
                )}
                {activeCrewTab === "dop" && (
                  <CrewSection
                    label="ผู้กำกับภาพ"
                    list={dops}
                    setList={setDops}
                    placeholder="พิมพ์ชื่อ หรือเลือกผู้กำกับภาพ..."
                    addButtonLabel="เพิ่มรายชื่อผู้กำกับภาพ"
                    crewOptions={crewOptions}
                  />
                )}
                {activeCrewTab === "editor" && (
                  <CrewSection
                    label="ผู้ลำดับภาพ"
                    list={editors}
                    setList={setEditors}
                    placeholder="พิมพ์ชื่อ หรือเลือกผู้ลำดับภาพ..."
                    addButtonLabel="เพิ่มรายชื่อผู้ลำดับภาพ"
                    crewOptions={crewOptions}
                  />
                )}
              </div>

              <div className="space-y-2 pt-4 border-t border-zinc-800/40">
                <label className="text-xs font-semibold text-zinc-300">
                  ลิงก์วิดีโอเบื้องหลัง
                </label>
                <div className="space-y-4">
                  {btsVideos.map((videoUrl, idx) => (
                    <div
                      key={idx}
                      className="space-y-2 p-4 bg-zinc-900/30 border border-zinc-800/40 rounded-2xl"
                    >
                      <div className="flex gap-2 items-center">
                        <Input
                          type="text"
                          placeholder="https://www.youtube.com/watch?v=..."
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
                              setBtsVideos(
                                btsVideos.filter((_, i) => i !== idx),
                              )
                            }
                            className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 transition-all h-auto"
                          >
                            <CloseIcon className="text-sm" />
                          </Button>
                        )}
                      </div>
                      {videoUrl &&
                        (() => {
                          const ytid = getYouTubeId(videoUrl);
                          return ytid ? (
                            <div className="mt-2 relative rounded-2xl overflow-hidden border border-zinc-800 bg-black/50 aspect-[16/9] w-full max-w-md shadow-lg shadow-black/50 transition-all hover:border-brand/30">
                              <iframe
                                src={`https://www.youtube.com/embed/${ytid}`}
                                title={`YouTube BTS Video Preview ${idx + 1}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="absolute inset-0 w-full h-full"
                              />
                            </div>
                          ) : videoUrl.trim() ? (
                            <p className="text-[10px] text-zinc-500 pl-1 font-light">
                              ลิงก์ YouTube ไม่ถูกต้อง
                            </p>
                          ) : null;
                        })()}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setBtsVideos([...btsVideos, ""])}
                    className="py-2 px-4 text-xs w-fit flex items-center gap-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 transition-colors"
                  >
                    <AddIcon className="text-sm" />{" "}
                    เพิ่มลิงก์วิดีโอเบื้องหลังอื่น
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-800/40 flex items-center gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/")}
              className="flex-1 py-3 text-sm font-semibold rounded-xl"
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              className="flex-1 py-3 text-sm font-semibold rounded-xl"
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
