"use client";

import React, { useState, useMemo, useDeferredValue } from "react";
import Image from "next/image";
import YoutubePreview from "@/components/preview/youtube";
import { useForm, Controller, useWatch, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import MovieIcon from "@mui/icons-material/Movie";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreatableSearchSelect, SearchSelect } from "@/components/ui/search-select";
import { Select } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { TagInput } from "@/components/ui/tag-input";
import { MOVIE_MESSAGES } from "@/core/constants/movie-messages";
import { useAppStore } from "@/store/use-store";
import {
  COLOR_OPTIONS,
  ASPECT_RATIO_OPTIONS,
  CONTENT_WARNING_OPTIONS,
  AFFILIATION_TABS,
  LANGUAGE_SELECT_OPTIONS,
  AGE_RATING_SELECT_OPTIONS,
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
  toCreateMoviePayload,
  toUpdateMoviePayload,
  getFilteredCategories,
  getCrewOptions,
  getInitialAffiliationType,
} from "@/utils/movie-form";
import { AffiliationType } from "@/core/domain/movie";
import { useDynamicStringList } from "@/hooks/system/use-dynamic-string-list";
import { useMovieCoverPreview } from "@/hooks/system/use-movie-cover-preview";
import { AwardProjectSection } from "@/components/awards/award-project-section";


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
  const isSaving = createMovieMutation.isPending || updateMovieMutation.isPending;

  const filteredCategories = useMemo(() => getFilteredCategories(crewRoles), [crewRoles]);
  const crewOptions = useMemo(() => getCrewOptions(availableCrew), [availableCrew]);

  const affiliationConfigs = useMemo(() => ({
    university: { name: "university" as const, options: universities.map(u => ({ id: u, name: u })), placeholder: "พิมพ์ชื่อ หรือเลือกมหาวิทยาลัย...", prefix: "เพิ่มมหาวิทยาลัย" },
  }), [universities]);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitted },
  } = useForm<MovieFormInputs>({
    defaultValues: getMovieFormDefaultValues(editingMovie, categories, crewRoles),
  });

  const watchedYoutubeUrl = useWatch({ control, name: "youtubeUrl" });
  const watchedContentWarnings = useWatch({
    control,
    name: "contentWarnings",
  }) || [];
  const watchedOtherContentWarning = useWatch({ control, name: "otherContentWarning" });

  const { previewUrl: movieCoverPreview,
    resetPreview: resetMovieCoverPreview,
    setFilePreview: setMovieCoverPreview,
  } = useMovieCoverPreview(editingMovie);

  const trailerUrls = useDynamicStringList(editingMovie?.trailerUrls || []);
  const btsVideos = useDynamicStringList(editingMovie?.btsVideos);

  const { fields: awardFields, append: appendAward, remove: removeAward } = useFieldArray({
    control,
    name: "awards",
  });

  const [affiliationType, setAffiliationType] = useState<AffiliationType>(
    () => getInitialAffiliationType(editingMovie),
  );

  const [selectedDept, setSelectedDept] = useState<string>("");
  const [crewRoleSearch, setCrewRoleSearch] = useState("");
  const deferredCrewRoleSearch = useDeferredValue(crewRoleSearch);

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
        btsVideos: btsVideos.getValues(),
        trailerUrls: trailerUrls.getValues(),
      });

      if (editingMovie) {
        await updateMovieMutation.mutateAsync(
          toUpdateMoviePayload(rawPayload, editingMovie),
        );
        showToast(MOVIE_MESSAGES.TOAST.EDIT_MOVIE_SUCCESS, "success");
      } else {
        await createMovieMutation.mutateAsync(toCreateMoviePayload(rawPayload));
        showToast(MOVIE_MESSAGES.TOAST.ADD_MOVIE_SUCCESS, "success");
      }

      router.push("/");
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : MOVIE_MESSAGES.ERRORS.SAVE_MOVIE;
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
                <div>
                  <h2 className="text-[18px] font-bold text-brand">อัปโหลด</h2>
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
                      className="text-white placeholder:text-zinc-500"
                    />
                    <div className="w-full mt-2"><YoutubePreview url={watchedYoutubeUrl} /></div>
                    
                    <label className="cursor-pointer block mt-2">
                      <Controller
                        name="thumbnail"
                        control={control}
                        defaultValue={null}
                        rules={{ required: !editingMovie ? "กรุณาอัปโหลดรูปปกภาพยนตร์" : false }}
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
                    {errors.thumbnail && (
                      <p className="text-[11px] text-red-400 mt-1 pl-1 animate-fade-in">{errors.thumbnail.message as string}</p>
                    )}
                  </div>

                  <div className="space-y-2 pt-4">
                    <label className="text-sm font-medium text-zinc-100 block mb-2">เพิ่มลิงก์ตัวอย่างภาพยนตร์</label>
                    {trailerUrls.items.map((item, index) => (
                      <div key={item.id} className="flex flex-col gap-2 mb-2">
                        <div className="relative group">
                          <Input
                            value={item.value}
                            onChange={(e) => trailerUrls.updateItem(item.id, e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="text-white placeholder:text-zinc-500 pr-10"
                          />
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => trailerUrls.removeItem(item.id)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-md opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all"
                            >
                              <DeleteOutlineIcon className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                        <div className="w-full mt-2"><YoutubePreview url={item.value} /></div>
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
                <div>
                  <h2 className="text-[18px] font-bold text-brand">อัปโหลดเบื้องหลัง</h2>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-100 block mb-2">เพิ่มลิงก์เบื้องหลังภาพยนตร์</label>
                  {btsVideos.items.map((item, index) => (
                    <div key={item.id} className="flex flex-col gap-2 mb-2">
                      <div className="relative group">
                        <Input
                          value={item.value}
                          onChange={(e) => btsVideos.updateItem(item.id, e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="text-white placeholder:text-zinc-500 pr-10"
                        />
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => btsVideos.removeItem(item.id)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-md opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all"
                          >
                            <DeleteOutlineIcon className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                      <div className="w-full mt-2"><YoutubePreview url={item.value} /></div>
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
                <div>
                  <h2 className="text-[18px] font-bold text-brand">รางวัล</h2>
                </div>
                <div className="space-y-4 w-full text-left">
                  {awardFields.map((project, pIndex) => (
                    <AwardProjectSection
                      key={project.id}
                      control={control}
                      pIndex={pIndex}
                      removeProject={() => removeAward(pIndex)}
                      register={register}
                    />
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => appendAward({ projectName: "", awardList: [{ value: "" }] })}
                    className="w-full py-2.5 px-4 bg-[#333333] hover:bg-zinc-700 text-sm font-medium rounded-md text-white text-center transition-colors"
                  >
                    + เพิ่มโครงการ
                  </button>
                </div>
              </div>
            </div>

            
            <div className="space-y-8 w-full min-w-0">
              
              
              <div className="space-y-6">
                <div>
                  <h2 className="text-[18px] font-bold text-brand">ข้อมูลทั่วไป</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-100 block mb-2">ชื่อเรื่อง</label>
                    <Input
                      placeholder=""
                      error={errors.title?.message}
                      {...register("title", { required: "กรุณากรอกชื่อเรื่อง" })}
                      className="!bg-[#0D0D0D] text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-100 block mb-2">คำโปรย (ไม่เกิน 100 คำ)</label>
                    <textarea
                      rows={4}
                      placeholder=""
                      {...register("description", { required: "กรุณากรอกคำโปรย" })}
                      className={`w-full bg-[#0D0D0D] border rounded-md px-4 py-2.5 text-sm text-white focus:outline-none resize-none transition-colors ${
                        errors.description ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-[#3A3A3A] focus:border-brand"
                      }`}
                    />
                    {errors.description && (
                      <p className="text-[11px] text-red-400 mt-1 pl-1 animate-fade-in">{errors.description.message}</p>
                    )}
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
                              options={[
                                { value: "", label: "ไม่ระบุหมวดหมู่รอง" },
                                ...categories.map(c => ({ value: c.id, label: c.labelTh || c.name }))
                              ]}
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
                        className="text-white w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-100 block mb-2">ความยาว (นาที)</label>
                      <Input
                        type="number"
                        placeholder="120"
                        {...register("duration")}
                        className="text-white"
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
                              ? "bg-brand border-brand text-white font-semibold"
                              : "bg-transparent border-zinc-600 text-zinc-400 hover:border-zinc-400 hover:text-white"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    
                    {affiliationType === "university" ? (
                      <Controller
                        name="university"
                        control={control}
                        render={({ field }) => (
                          <CreatableSearchSelect
                            value={{ id: field.value || "", name: field.value || "" }}
                            onChange={(val) => field.onChange(val.name)}
                            options={affiliationConfigs.university.options}
                            placeholder={affiliationConfigs.university.placeholder}
                            hideIcon={true}
                            addLabelPrefix={affiliationConfigs.university.prefix}
                          />
                        )}
                      />
                    ) : (
                      <Controller
                        name={affiliationType}
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="text"
                            value={field.value || ""}
                            onChange={field.onChange}
                            placeholder={affiliationType === "school" ? "พิมพ์ชื่อโรงเรียน..." : "พิมพ์ชื่อสังกัด..."}
                            className="text-white w-full"
                          />
                        )}
                      />
                    )}
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
                <div>
                  <h2 className="text-[18px] font-bold text-brand">ข้อมูลการนำเสนอ</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-100 block mb-2">ภาษา</label>
                      <Select
                        options={LANGUAGE_SELECT_OPTIONS}
                        error={errors.language?.message as string}
                        {...register("language")}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-100 block mb-2">คำบรรยาย</label>
                      <Select
                        options={LANGUAGE_SELECT_OPTIONS}
                        {...register("subtitle")}
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
                      selectedValues={watchedContentWarnings}
                      onChange={(values) => {
                        setValue("contentWarnings", values, { shouldDirty: true });
                      }}
                      placeholder="ไม่มีคำเตือนเนื้อหา / เลือกคำเตือน..."
                    />
                    
                    {watchedContentWarnings.includes("OTHER") && (
                      <div className="pt-2 animate-fade-in">
                        <Input
                          placeholder="ระบุคำเตือนเนื้อหาอื่นๆ..."
                          error={
                            (errors.otherContentWarning?.message as string) ||
                            (isSubmitted && watchedContentWarnings.includes("OTHER") && (!watchedOtherContentWarning || watchedOtherContentWarning.trim() === "")
                              ? "กรุณาระบุคำเตือนเนื้อหาอื่นๆ"
                              : undefined)
                          }
                          {...register("otherContentWarning")}
                          className="text-white"
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
                <div>
                  <h2 className="text-[18px] font-bold text-brand">ข้อมูลทีมงาน</h2>
                  {(errors.crew?.root?.message || (errors.crew as { message?: string })?.message || (isSubmitted && !fields.some(f => f.name?.trim()) ? "กรุณาเพิ่มทีมงานอย่างน้อย 1 คน" : null)) && (
                    <p className="text-[12px] text-red-400 mt-1 animate-fade-in">
                      {(errors.crew?.root?.message || (errors.crew as { message?: string })?.message || "กรุณาเพิ่มทีมงานอย่างน้อย 1 คน") as string}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <SearchSelect
                    value={selectedDept}
                    onChange={(val) => {
                      setSelectedDept(val);
                      setCrewRoleSearch("");
                    }}
                    options={filteredCategories.map(cat => ({ 
                      value: cat.id, 
                      label: cat.label,
                      searchKeywords: cat.roles.map(r => r.label).join(" ")
                    }))}
                    placeholder="เลือกหรือค้นหาฝ่ายในการสร้างภาพยนตร์"
                    className="w-full"
                  />
                  
                  {(() => {
                    const hasAnyData = fields.some(f => f.name && f.name.trim() !== "");
                    const shouldShowSearch = selectedDept || hasAnyData;
                    
                    return shouldShowSearch && (
                      <div className="relative mt-2 animate-fade-in">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8860B] pointer-events-none" />
                        <input
                          type="text"
                          placeholder={selectedDept ? `ค้นหาตำแหน่งใน${filteredCategories.find(c => c.id === selectedDept)?.label}` : "ค้นหาตำแหน่งทีมงาน..."}
                          value={crewRoleSearch}
                          onChange={(e) => setCrewRoleSearch(e.target.value)}
                          className="w-full bg-[#0D0D0D] border border-[#3A3A3A] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                        />
                      </div>
                    );
                  })()}
                </div>

                <div className="space-y-8 mt-6">
                  {filteredCategories.map((cat) => {
                    const searchLower = deferredCrewRoleSearch.toLowerCase().trim();
                    const isSelectedCat = cat.id === selectedDept;

                    if (selectedDept && !isSelectedCat) return null;

                    const rolesToRender = cat.roles.filter((role) => {
                      const hasData = fields.some(
                        (f) => f.role === role.id && f.name && f.name.trim() !== ""
                      );
                      
                      const isVisible = hasData || isSelectedCat;
                      if (!isVisible) return false;

                      if (searchLower) {
                        return role.label.toLowerCase().includes(searchLower);
                      }

                      return true;
                    });

                    if (rolesToRender.length === 0) return null;

                    return (
                      <div key={cat.id} className="space-y-4 animate-fade-in">
                        {rolesToRender.map((role) => {
                          const fieldsForRole = fields
                            .map((f, i) => ({ ...f, index: i }))
                            .filter((f) => f.role === role.id);
                          return (
                            <CrewSection
                              key={role.id}
                              label={role.label}
                              fields={fieldsForRole}
                              onAdd={() =>
                                append({
                                  role: role.id,
                                  crewMemberId: null,
                                  name: "",
                                  email: "",
                                })
                              }
                              onRemove={remove}
                              onUpdate={handleUpdateCrew}
                              placeholder="ชื่อจริง - นามสกุล"
                              addButtonLabel={`เพิ่มรายชื่อ`}
                              crewOptions={crewOptions}
                            />
                          );
                        })}
                      </div>
                    );
                  })}
                  
                  {selectedDept && deferredCrewRoleSearch && !filteredCategories.some(cat => 
                    cat.id === selectedDept && 
                    cat.roles.some(role => role.label.toLowerCase().includes(deferredCrewRoleSearch.toLowerCase().trim()))
                  ) && (
                    <div className="py-12 flex flex-col items-center justify-center border border-dashed border-[#3A3A3A] rounded-[16px] bg-black/20 animate-fade-in">
                      <p className="text-sm font-medium text-zinc-400">ไม่พบตำแหน่ง &quot;{deferredCrewRoleSearch}&quot;</p>
                      <p className="text-xs text-zinc-500 mt-1">ลองพิมพ์คำค้นหาด้วยคีย์เวิร์ดอื่นดูอีกครั้ง</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          <div className="mt-12 flex flex-row items-center justify-center gap-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/")}
              disabled={isSaving}
              className="min-w-[140px] min-h-[48px] py-3 px-6 text-[15px] font-medium rounded-xl bg-transparent text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-300"
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              isLoading={isSaving}
              disabled={isSaving}
              className="min-w-[140px] min-h-[48px] py-3 px-6 text-[15px] font-bold rounded-xl bg-brand !text-white hover:brightness-105 hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all duration-300"
            >
              เสร็จสิ้น
            </Button>
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
                {MOVIE_MESSAGES.LOADING.SAVE_MOVIE}
              </h3>
              <p className="text-xs text-zinc-400 font-light">
                {MOVIE_MESSAGES.LOADING.SUB_SAVE_MOVIE}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
