"use client";

import React, { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { useForm, Controller, useWatch, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import MovieIcon from "@mui/icons-material/Movie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { SearchSelect } from "@/components/ui/search-select";
import { LOCALIZATION } from "@/core/constants/localization";
import { useAppStore } from "@/store/use-store";
import {
  COLOR_OPTIONS,
  ASPECT_RATIO_OPTIONS,
  CONTENT_WARNING_OPTIONS,
  AGE_RATING_OPTIONS,
  LANGUAGE_OPTIONS,
} from "@/core/constants/movie-form";
import {
  useCreateMovieMutation,
  useUpdateMovieMutation,
} from "@/hooks/db/use-movies";
import YoutubePreview from "@/components/preview/youtube";
import { CrewSection } from "@/components/crew/crew-section";
import { MovieFormInputs, MovieFormProps } from "@/core/domain/movie";
import {
  buildMovieFormPayload,
  getInitialAffiliationType,
  getMovieFormDefaultValues,
  getSelectedContentWarnings,
  toCreateMoviePayload,
  toUpdateMoviePayload,
  getFilteredCategories,
  getCrewOptions,
} from "@/utils/movie-form";
import { useDynamicStringList } from "@/hooks/system/use-dynamic-string-list";
import { useMovieCoverPreview } from "@/hooks/system/use-movie-cover-preview";

export const MovieForm: React.FC<MovieFormProps> = ({
  editingMovie = null,
  categories,
  universities,
  crewRoles,
  availableCrew,
}) => {
  const router = useRouter();
  const { showToast } = useAppStore();
  const createMovieMutation = useCreateMovieMutation();
  const updateMovieMutation = useUpdateMovieMutation();
  const [isSavingLocal, setIsSavingLocal] = useState(false);

  const filteredCategories = useMemo(
    () => getFilteredCategories(crewRoles),
    [crewRoles],
  );
  const crewOptions = useMemo(
    () => getCrewOptions(availableCrew),
    [availableCrew],
  );

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<MovieFormInputs>({
    defaultValues: useMemo(
      () => getMovieFormDefaultValues(editingMovie, categories, crewRoles),
      [editingMovie, categories, crewRoles]
    ),
  });

  const watchedYoutubeUrl = useWatch({ control, name: "youtubeUrl" });
  const watchedTrailerUrl = useWatch({ control, name: "trailerUrl" });
  const watchedProfanity = useWatch({ control, name: "hasProfanity" }) ?? false;
  const watchedDrugs = useWatch({ control, name: "hasDrugs" }) ?? false;

  const selectedWarnings = useMemo(
    () => getSelectedContentWarnings(watchedProfanity, watchedDrugs),
    [watchedProfanity, watchedDrugs],
  );

  const {
    selectedFileName,
    previewUrl: movieCoverPreview,
    resetPreview: resetMovieCoverPreview,
    setFilePreview: setMovieCoverPreview,
  } = useMovieCoverPreview(editingMovie);

  const btsVideos = useDynamicStringList(editingMovie?.btsVideos);
  const awards = useDynamicStringList(editingMovie?.awards);
  const [affiliationType, setAffiliationType] = useState(() =>
    getInitialAffiliationType(editingMovie),
  );

  const [activeCrewCategory, setActiveCrewCategory] = useState<string>(
    filteredCategories[0]?.id || "",
  );
  const activeCategoryRoles = useMemo(() => {
    const currentCategory = filteredCategories.find(
      (c) => c.id === activeCrewCategory,
    );
    return currentCategory?.roles || [];
  }, [filteredCategories, activeCrewCategory]);

  const flatCrewRoles = useMemo(() => {
    return crewRoles.map((role) => ({
      id: role.name.toLowerCase(),
      code: role.name,
      label: role.labelTh || role.name,
    }));
  }, [crewRoles]);

  const [activeCrewTab, setActiveCrewTab] = useState<string>(() => {
    const firstCat = filteredCategories[0];
    return firstCat?.roles[0]?.id || "director";
  });

  const activeRoleDef = useMemo(
    () => flatCrewRoles.find((role) => role.id === activeCrewTab),
    [flatCrewRoles, activeCrewTab],
  );

  const activeCrewConfig = useMemo(() => {
    if (!activeRoleDef) return null;
    return {
      id: activeRoleDef.id,
      label: activeRoleDef.label,
      placeholder: `พิมพ์ชื่อ หรือเลือก${activeRoleDef.label}...`,
      addLabel: `เพิ่มรายชื่อ${activeRoleDef.label}`,
    };
  }, [activeRoleDef]);

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "crew",
  });

  const activeFields = useMemo(() => {
    if (!activeRoleDef) return [];
    return fields
      .map((field, idx) => ({ ...field, index: idx }))
      .filter(
        (field) =>
          field.role.toUpperCase() === activeRoleDef.code.toUpperCase(),
      );
  }, [fields, activeRoleDef]);

  const handleAddCrew = useCallback(() => {
    if (!activeRoleDef) return;
    append({
      role: activeRoleDef.code,
      crewMemberId: null,
      name: "",
      email: "",
    });
  }, [activeRoleDef, append]);

  const handleRemoveCrew = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove],
  );

  const handleUpdateCrew = useCallback(
    (
      index: number,
      val: { id: string | null; name: string; email: string },
    ) => {
      if (!activeRoleDef) return;
      update(index, {
        role: activeRoleDef.code,
        crewMemberId: val.id,
        name: val.name,
        email: val.email,
      });
    },
    [activeRoleDef, update],
  );

  const onSubmitForm = async (data: MovieFormInputs) => {
    try {
      setIsSavingLocal(true);
      const rawPayload = buildMovieFormPayload({
        data,
        editingMovie,
        affiliationType,
        btsVideos: btsVideos.items,
        awards: awards.items,
      });

      if (editingMovie) {
        await updateMovieMutation.mutateAsync(
          toUpdateMoviePayload(rawPayload, editingMovie),
        );
        showToast(LOCALIZATION.TOAST.EDIT_MOVIE_SUCCESS, "success");
      } else {
        await createMovieMutation.mutateAsync(toCreateMoviePayload(rawPayload));
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
              <Controller
                name="categoryIds"
                control={control}
                rules={{
                  required: "กรุณาเลือกหมวดหมู่ภาพยนตร์อย่างน้อยหนึ่งประเภท",
                  validate: (value) => (value && value.length > 0) || "กรุณาเลือกหมวดหมู่ภาพยนตร์อย่างน้อยหนึ่งประเภท"
                }}
                render={({ field }) => (
                  <MultiSelect
                    label="หมวดหมู่"
                    error={errors.categoryIds?.message}
                    options={categories.map((cat) => ({
                      value: cat.id,
                      label: cat.labelTh || cat.name,
                    }))}
                    selectedValues={field.value || []}
                    onChange={field.onChange}
                    placeholder="เลือกหมวดหมู่..."
                  />
                )}
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
                  valueAsNumber: true,
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
                          setMovieCoverPreview(file);
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
                        resetMovieCoverPreview();
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
                  {btsVideos.items.map((videoUrl, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex gap-2 items-center">
                        <Input
                          type="text"
                          placeholder="กรอกลิงก์วิดีโอเบื้องหลัง"
                          value={videoUrl}
                          onChange={(e) =>
                            btsVideos.updateItem(idx, e.target.value)
                          }
                          className="flex-1"
                        />
                        {btsVideos.items.length > 1 && (
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => btsVideos.removeItem(idx)}
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
                    onClick={btsVideos.addItem}
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
                  {awards.items.map((awardName, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <Input
                        type="text"
                        placeholder="กรอกชื่อรางวัลที่ได้รับ (ถ้ามี)"
                        value={awardName}
                        onChange={(e) => awards.updateItem(idx, e.target.value)}
                        className="flex-1"
                      />
                      {awards.items.length > 1 && (
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => awards.removeItem(idx)}
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
                    onClick={awards.addItem}
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
              <div className="space-y-1">
                <label className="text-xs text-zinc-400 font-medium">
                  หมวดหมู่ทีมงาน
                </label>
                <div className="relative">
                  <select
                    value={activeCrewCategory}
                    onChange={(e) => {
                      const newCatId = e.target.value;
                      setActiveCrewCategory(newCatId);
                      const cat = filteredCategories.find(
                        (c) => c.id === newCatId,
                      );
                      if (cat && cat.roles.length > 0) {
                        setActiveCrewTab(cat.roles[0].id);
                      }
                    }}
                    className="w-full bg-zinc-900 border border-zinc-850 focus:border-brand rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-colors cursor-pointer appearance-none"
                  >
                    {filteredCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">
                    ▼
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 border-b border-zinc-800/40 pb-4 pt-2">
                {activeCategoryRoles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setActiveCrewTab(role.id)}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      activeCrewTab === role.id
                        ? "bg-brand/10 border-brand text-brand font-bold"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-850"
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>

              <div className="bg-zinc-900/10 border border-zinc-800/40 rounded-lg p-5 md:p-6 min-h-[200px]">
                {activeCrewConfig && (
                  <CrewSection
                    key={activeCrewConfig.id}
                    label={activeCrewConfig.label}
                    fields={activeFields}
                    onAdd={handleAddCrew}
                    onRemove={handleRemoveCrew}
                    onUpdate={handleUpdateCrew}
                    placeholder={activeCrewConfig.placeholder}
                    addButtonLabel={activeCrewConfig.addLabel}
                    crewOptions={crewOptions}
                  />
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
