"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import YoutubePreview from "@/components/preview/youtube";
import { useForm, Controller, useWatch, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import MovieIcon from "@mui/icons-material/Movie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreatableSearchSelect } from "@/components/ui/search-select";
import { Select } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { TagInput } from "@/components/ui/tag-input";
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
import { CrewSection } from "@/components/crew/crew-section";
import { MovieFormInputs, MovieFormProps } from "@/core/domain/movie";
import {
  buildMovieFormPayload,
  getMovieFormDefaultValues,
  getSelectedContentWarnings,
  toCreateMoviePayload,
  toUpdateMoviePayload,
  getFilteredCategories,
  getCrewOptions,
  getInitialAffiliationType,
} from "@/utils/movie-form";
import { AffiliationType } from "@/core/domain/movie";
import { useDynamicStringList } from "@/hooks/system/use-dynamic-string-list";
import { useAwardsList } from "@/hooks/system/use-awards-list";
import { useMovieCoverPreview } from "@/hooks/system/use-movie-cover-preview";

const AFFILIATION_TABS = [
  { type: "university" as AffiliationType, label: "มหาวิทยาลัย" },
  { type: "school" as AffiliationType, label: "โรงเรียน" },
  { type: "studio" as AffiliationType, label: "สตูดิโอ/อิสระ" },
] as const;

const LANGUAGE_SELECT_OPTIONS = LANGUAGE_OPTIONS.map((l) => ({ value: l, label: l }));
const AGE_RATING_SELECT_OPTIONS = AGE_RATING_OPTIONS.map((r) => ({ value: r, label: r }));

export const MovieForm: React.FC<MovieFormProps> = ({
  editingMovie = null,
  categories,
  universities,
  schools,
  studios,
  crewRoles,
  availableCrew,
}) => {
  const router = useRouter();
  const { showToast } = useAppStore();
      const createMovieMutation = useCreateMovieMutation();
  const updateMovieMutation = useUpdateMovieMutation();
  const isSaving = createMovieMutation.isPending || updateMovieMutation.isPending;

  const filteredCategories = useMemo(() => getFilteredCategories(crewRoles), [crewRoles]);
  const crewOptions = useMemo(() => getCrewOptions(availableCrew), [availableCrew]);

  const affiliationConfigs = useMemo(() => ({
    university: { name: "university" as const, options: universities.map(u => ({ id: u, name: u })), placeholder: "พิมพ์ชื่อ หรือเลือกมหาวิทยาลัย...", prefix: "เพิ่มมหาวิทยาลัย" },
    school: { name: "school" as const, options: schools.map(s => ({ id: s, name: s })), placeholder: "พิมพ์ชื่อ หรือเลือกโรงเรียน...", prefix: "เพิ่มโรงเรียน" },
    studio: { name: "studio" as const, options: studios.map(s => ({ id: s, name: s })), placeholder: "พิมพ์ชื่อสตูดิโอ หรือทีมอิสระ...", prefix: "เพิ่มสตูดิโอ" },
  }), [universities, schools, studios]);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<MovieFormInputs>({
    defaultValues: getMovieFormDefaultValues(editingMovie, categories, crewRoles),
  });

  const watchedYoutubeUrl = useWatch({ control, name: "youtubeUrl" });
  const watchedWarnings = useWatch({
    control,
    name: [
      "hasViolence", "hasGore", "hasProfanity", "hasSexualContent", 
      "hasNudity", "hasSmoking", "hasAlcohol", "hasDrugs", 
      "hasMentalHealth", "hasFlashingLights", "hasOtherWarning"
    ]
  });

  const selectedWarnings = getSelectedContentWarnings({
    hasViolence: watchedWarnings[0],
    hasGore: watchedWarnings[1],
    hasProfanity: watchedWarnings[2],
    hasSexualContent: watchedWarnings[3],
    hasNudity: watchedWarnings[4],
    hasSmoking: watchedWarnings[5],
    hasAlcohol: watchedWarnings[6],
    hasDrugs: watchedWarnings[7],
    hasMentalHealth: watchedWarnings[8],
    hasFlashingLights: watchedWarnings[9],
    hasOtherWarning: watchedWarnings[10],
  });

  const { previewUrl: movieCoverPreview,
    resetPreview: resetMovieCoverPreview,
    setFilePreview: setMovieCoverPreview,
  } = useMovieCoverPreview(editingMovie);

  const trailerUrls = useDynamicStringList(editingMovie?.trailerUrls || []);
  const btsVideos = useDynamicStringList(editingMovie?.btsVideos);
  const awards = useAwardsList(editingMovie?.awards);

  const [affiliationType, setAffiliationType] = useState<AffiliationType>(
    () => getInitialAffiliationType(editingMovie),
  );

  const [activeCrewCategory, setActiveCrewCategory] = useState<string>(
    filteredCategories[0]?.id || "",
  );
  const activeCategoryRoles = useMemo(() => 
    filteredCategories.find(c => c.id === activeCrewCategory)?.roles || [],
  [filteredCategories, activeCrewCategory]);



  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "crew",
  });



  const handleUpdateCrew = (index: number, val: { id: string | null; name: string; email: string }) => {
    update(index, {
      role: fields[index].role,
      crewMemberId: val.id,
      name: val.name,
      email: val.email,
    });
  };

  const onSubmitForm = async (data: MovieFormInputs) => {
    try {
      const rawPayload = buildMovieFormPayload({
        data,
        editingMovie,
        affiliationType,
        btsVideos: btsVideos.items,
        awards: awards.getPayload(),
        trailerUrls: trailerUrls.items,
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
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-brand selection:text-black pb-20">
      <main className="max-w-6xl mx-auto w-full px-6 md:px-16 pt-28 space-y-8 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent flex items-center gap-2">
            <MovieIcon className="text-brand" />{" "}
            {editingMovie ? "แก้ไขข้อมูล" : "อัปโหลด"}
          </h1>
          <p className="text-xs text-zinc-400 font-light">
            กรอกข้อมูลรายละเอียดของภาพยนตร์สั้น ลิงก์ตัวอย่าง อัปโหลดใบปิด
            และจัดการรายชื่อทีมงานทั้งหมด
          </p>
        </div>

                <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-8 items-start">
            
            
            <div className="space-y-8 w-full min-w-0">
              
              
              <div className="space-y-6">
                <div className="pb-2">
                  <h2 className="text-[18px] font-bold text-brand mb-4">อัปโหลด</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-100 block mb-2">เพิ่มลิงก์ภาพยนตร์</label>
                    <Input
                      placeholder="https://www.youtube.com/watch?v=..."
                      error={errors.youtubeUrl?.message}
                      {...register("youtubeUrl", {
                        required: "กรุณากรอกลิงก์ภาพยนตร์",
                      })}
                      className="!bg-[#0D0D0D] border !border-[#3A3A3A] text-white placeholder:text-zinc-500"
                    />
                    <div className="w-full mt-2"><YoutubePreview url={watchedYoutubeUrl} /></div>
                    
                    <label className="cursor-pointer block mt-2">
                      <Controller
                        name="thumbnail"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0] ?? null;
                              field.onChange(file);
                              setMovieCoverPreview(file);
                            }}
                          />
                        )}
                      />
                      <div className="w-full py-2.5 px-4 bg-[#333333] hover:bg-zinc-700 text-sm font-medium rounded-md text-white text-center transition-colors">
                        + เพิ่มปกภาพยนตร์
                      </div>
                    </label>
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
                          <CloseIcon className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 pt-4">
                    <label className="text-sm font-medium text-zinc-100 block mb-2">เพิ่มลิงก์ตัวอย่างภาพยนตร์</label>
                    {trailerUrls.items.map((url, index) => (
                      <div key={index} className="flex flex-col gap-2 mb-2">
                        <div className="relative group">
                          <Input
                            value={url}
                            onChange={(e) => trailerUrls.updateItem(index, e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="!bg-[#0D0D0D] border !border-[#3A3A3A] text-white placeholder:text-zinc-500 pr-10"
                          />
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => trailerUrls.removeItem(index)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-md opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all"
                            >
                              <DeleteOutlineIcon className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                        <div className="w-full mt-2"><YoutubePreview url={url} /></div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => trailerUrls.addItem()}
                      className="w-full py-2.5 px-4 bg-[#333333] hover:bg-zinc-700 text-sm font-medium rounded-md text-white text-center transition-colors mt-2"
                    >
                      + เพิ่มตัวอย่างภาพยนตร์
                    </button>
                  </div>
                </div>
              </div>

              
              <div className="space-y-6">
                <div className="pb-2">
                  <h2 className="text-[18px] font-bold text-brand mb-4">อัปโหลดเบื้องหลัง</h2>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-100 block mb-2">เพิ่มลิงก์เบื้องหลังภาพยนตร์</label>
                  {btsVideos.items.map((url, index) => (
                    <div key={index} className="flex flex-col gap-2 mb-2">
                      <div className="relative group">
                        <Input
                          value={url}
                          onChange={(e) => btsVideos.updateItem(index, e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="!bg-[#0D0D0D] border !border-[#3A3A3A] text-white placeholder:text-zinc-500 pr-10"
                        />
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => btsVideos.removeItem(index)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-md opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all"
                          >
                            <DeleteOutlineIcon className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                      <div className="w-full mt-2"><YoutubePreview url={url} /></div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => btsVideos.addItem()}
                    className="w-full py-2.5 px-4 bg-[#333333] hover:bg-zinc-700 text-sm font-medium rounded-md text-white text-center transition-colors mt-2"
                  >
                    + เพิ่มเบื้องหลังภาพยนตร์
                  </button>
                </div>
              </div>

              
              <div className="space-y-6">
                <div className="pb-2">
                  <h2 className="text-[18px] font-bold text-brand">รางวัล</h2>
                </div>
                <div className="space-y-4 w-full text-left pt-4">
                  {awards.projects.map((project, pIndex) => (
                    <div key={pIndex} className="bg-white/5 backdrop-blur-md border border-[#757575] shadow-lg rounded-xl p-5 relative">
                      {pIndex > 0 && (
                        <button
                          type="button"
                          onClick={() => awards.removeProject(pIndex)}
                          className="absolute top-4 right-4 text-zinc-500 hover:text-red-500"
                        >
                          <CloseIcon className="w-4 h-4" />
                        </button>
                      )}
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-zinc-100 block mb-2">ชื่อโครงการ</label>
                          <Input
                            type="text"
                            value={project.project}
                            onChange={(e) => awards.updateProjectName(pIndex, e.target.value)}
                            className="!bg-white/5 backdrop-blur-md border !border-white/20 text-white placeholder:text-zinc-400 shadow-inner"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-zinc-100 block mb-2">ชื่อรายการ</label>
                          <div className="space-y-2">
                            {project.items.map((item, iIndex) => (
                              <div key={iIndex} className="relative group">
                                <Input
                                  type="text"
                                  value={item}
                                  onChange={(e) => awards.updateItemName(pIndex, iIndex, e.target.value)}
                                  className="!bg-white/5 backdrop-blur-md border !border-white/20 text-white placeholder:text-zinc-400 pr-10 shadow-inner"
                                />
                                {iIndex > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => awards.removeItem(pIndex, iIndex)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-md opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all"
                                  >
                                    <DeleteOutlineIcon className="w-5 h-5" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => awards.addItem(pIndex)}
                          className="py-2 px-4 bg-[#333333] hover:bg-zinc-700 text-sm font-medium rounded-md text-white text-center transition-colors w-fit"
                        >
                          + เพิ่มรายการ
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={awards.addProject}
                    className="w-full py-2.5 px-4 bg-[#333333] hover:bg-zinc-700 text-sm font-medium rounded-md text-white text-center transition-colors"
                  >
                    + เพิ่มโครงการ
                  </button>
                </div>
              </div>
            </div>

            
            <div className="space-y-8 w-full min-w-0">
              
              
              <div className="space-y-6">
                <div className="pb-2">
                  <h2 className="text-[18px] font-bold text-brand mb-4">ข้อมูลทั่วไป</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-100 block mb-2">ชื่อเรื่อง</label>
                    <Input
                      placeholder=""
                      error={errors.title?.message}
                      {...register("title", { required: "กรุณากรอกชื่อเรื่อง" })}
                      className="!bg-[#0D0D0D] border !border-[#3A3A3A] text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-100 block mb-2">คำโปรย (ไม่เกิน 100 คำ)</label>
                    <textarea
                      rows={4}
                      placeholder=""
                      {...register("description", { required: "กรุณากรอกคำโปรย" })}
                      className="w-full bg-[#0D0D0D] border border-[#3A3A3A] rounded-md px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Controller
                      name="categoryIds"
                      control={control}
                      render={({ field }) => (
                        <>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-100 block mb-2">หมวดหมู่</label>
                            <Select
                              options={categories.map(c => ({ value: c.id, label: c.labelTh || c.name }))}
                              value={field.value?.[0] || ""}
                              onChange={(e) => {
                                const newVals = [...(field.value || [])];
                                newVals[0] = e.target.value;
                                field.onChange(newVals);
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-100 block mb-2">หมวดหมู่รอง</label>
                            <Select
                              options={categories.map(c => ({ value: c.id, label: c.labelTh || c.name }))}
                              value={field.value?.[1] || ""}
                              onChange={(e) => {
                                const newVals = [...(field.value || [])];
                                newVals[1] = e.target.value;
                                field.onChange(newVals);
                              }}
                            />
                          </div>
                        </>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-100 block mb-2">วัน/เดือน/ปี ที่สร้างเสร็จ</label>
                      <Input
                        type="date"
                        {...register("releaseDate")}
                        className="!bg-[#0D0D0D] border !border-[#3A3A3A] text-white w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-100 block mb-2">ความยาว (นาที)</label>
                      <Input
                        type="number"
                        placeholder="120"
                        {...register("duration")}
                        className="!bg-[#0D0D0D] border !border-[#3A3A3A] text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-zinc-100 pb-2 block">สถาบัน/สังกัด</label>
                    
                    <div className="flex gap-2">
                      {AFFILIATION_TABS.map(({ type, label }) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            setAffiliationType(type);
                            setValue("university", "");
                            setValue("school", "");
                            setValue("studio", "");
                          }}
                          className={`px-4 py-1.5 text-sm rounded-full border transition-all ${
                            affiliationType === type
                              ? "bg-brand border-brand text-black font-semibold"
                              : "bg-transparent border-zinc-600 text-zinc-400 hover:border-zinc-400 hover:text-zinc-200"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    
                    <Controller
                      key={affiliationConfigs[affiliationType].name}
                      name={affiliationConfigs[affiliationType].name}
                      control={control}
                      render={({ field }) => (
                        <CreatableSearchSelect
                          value={{ id: field.value || "", name: field.value || "" }}
                          onChange={(val) => field.onChange(val.name)}
                          options={affiliationConfigs[affiliationType].options}
                          placeholder={affiliationConfigs[affiliationType].placeholder}
                          hideIcon={true}
                          addLabelPrefix={affiliationConfigs[affiliationType].prefix}
                        />
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-100 block mb-2">แท็ก</label>
                    <Controller
                      name="tags"
                      control={control}
                      defaultValue={[]}
                      render={({ field }) => (
                        <TagInput
                          value={field.value ?? []}
                          onChange={field.onChange}
                          placeholder="ลักษณะเด่นของภาพยนตร์ เพื่อให้ผู้ชมค้นหาได้ง่ายขึ้น..."
                        />
                      )}
                    />
                  </div>
                </div>
              </div>

              
              <div className="space-y-6">
                <div className="pb-2">
                  <h2 className="text-[18px] font-bold text-brand mb-4">ข้อมูลการนำเสนอ</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-100 block mb-2">ภาษา</label>
                      <Select
                        options={LANGUAGE_SELECT_OPTIONS}
                        {...register("language")}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-100 block mb-2">คำบรรยาย</label>
                      <Select
                        options={LANGUAGE_SELECT_OPTIONS}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-100 block mb-2">สี</label>
                      <Select
                        options={COLOR_OPTIONS}
                        {...register("colorType")}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-100 block mb-2">อัตราส่วนภาพ</label>
                      <Select
                        options={ASPECT_RATIO_OPTIONS}
                        {...register("aspectRatio")}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-100 block mb-2">เรตภาพยนตร์</label>
                      <Select
                        options={AGE_RATING_SELECT_OPTIONS}
                        {...register("ageRating")}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-100 block mb-2">คำเตือนเนื้อหา</label>
                    <MultiSelect
                      options={CONTENT_WARNING_OPTIONS}
                      selectedValues={selectedWarnings}
                      onChange={(values) => {
                        setValue("hasViolence", values.includes("violence"), { shouldDirty: true });
                        setValue("hasGore", values.includes("gore"), { shouldDirty: true });
                        setValue("hasProfanity", values.includes("profanity"), { shouldDirty: true });
                        setValue("hasSexualContent", values.includes("sexualContent"), { shouldDirty: true });
                        setValue("hasNudity", values.includes("nudity"), { shouldDirty: true });
                        setValue("hasSmoking", values.includes("smoking"), { shouldDirty: true });
                        setValue("hasAlcohol", values.includes("alcohol"), { shouldDirty: true });
                        setValue("hasDrugs", values.includes("drugs"), { shouldDirty: true });
                        setValue("hasMentalHealth", values.includes("mentalHealth"), { shouldDirty: true });
                        setValue("hasFlashingLights", values.includes("flashingLights"), { shouldDirty: true });
                        setValue("hasOtherWarning", values.includes("other"), { shouldDirty: true });
                      }}
                      placeholder="ไม่มีคำเตือนเนื้อหา / เลือกคำเตือน..."
                    />
                    
                    {watchedWarnings[10] && (
                      <div className="pt-2 animate-fade-in">
                        <Input
                          placeholder="ระบุคำเตือนเนื้อหาอื่นๆ..."
                          {...register("otherContentWarning")}
                          className="!bg-[#0D0D0D] border !border-[#3A3A3A] text-white"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

            
            <div className="w-full max-w-[760px] mx-auto mt-12">


              
              <div className="space-y-6">
                <div className="pb-2">
                  <h2 className="text-[18px] font-bold text-brand mb-4">ข้อมูลทีมงาน</h2>
                </div>

                <label className="text-sm font-medium text-zinc-100 block mb-2">เลือกฝ่ายการทำงาน</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  {filteredCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCrewCategory(cat.id)}
                      className={`px-4 min-h-[44px] flex flex-col items-center justify-center text-center text-sm font-medium rounded-xl border transition-all cursor-pointer shadow-sm ${
                        activeCrewCategory === cat.id
                          ? "bg-[#B8860B] border-[#B8860B] text-white shadow-md"
                          : "bg-[#18181B] border-[#3F3F46] text-white hover:bg-[#27272A] hover:border-[#52525B]"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-6 mt-4">
                  {activeCategoryRoles.map(role => {
                    const fieldsForRole = fields.map((f, i) => ({ ...f, index: i })).filter((f) => f.role === role.id);
                    return (
                      <CrewSection
                        key={role.id}
                        label={role.label}
                        fields={fieldsForRole}
                        onAdd={() => append({ role: role.id, crewMemberId: null, name: "", email: "" })}
                        onRemove={remove}
                        onUpdate={handleUpdateCrew}
                        placeholder={`พิมพ์ชื่อ หรือเลือก${role.label}...`}
                        addButtonLabel={`เพิ่มตำแหน่ง`}
                        crewOptions={crewOptions}
                      />
                    );
                  })}
                </div>
              </div>

          
            </div>

          <div className="pt-12 flex flex-col items-center justify-center gap-3 mt-8">
            <Button
              type="submit"
              isLoading={isSaving}
              disabled={isSaving}
              className="py-2.5 px-12 text-sm font-bold rounded-full w-48 bg-brand text-black hover:bg-brand/90"
            >
              เสร็จสิ้น
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/")}
              disabled={isSaving}
              className="py-2.5 px-12 text-sm font-bold rounded-full w-48 bg-[#333333] text-white hover:bg-zinc-700 border-none"
            >
              ยกเลิก
            </Button>
            {editingMovie && (
              <button type="button" className="text-red-500 hover:text-red-400 mt-2">
                <CloseIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>
      </main>

      {isSaving && (
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
