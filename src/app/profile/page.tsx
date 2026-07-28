"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/use-store";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import WorkIcon from "@mui/icons-material/Work";
import LockIcon from "@mui/icons-material/Lock";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalPlayIcon from "@mui/icons-material/LocalPlay";
import SettingsIcon from "@mui/icons-material/Settings";
import ShareIcon from "@mui/icons-material/Share";
import { Button } from "@/components/ui/button";
import { useMyMoviesQuery, useDeleteMovieMutation, useMyContributedMoviesQuery } from "@/hooks/db/use-movies";
import {
  useMyCrewMembersQuery,
  useDeleteCrewMemberMutation,
} from "@/hooks/db/use-crew-members";
import { MovieCardThumb } from "@/components/movie/cards/movie-card-thumb";
import { CrewTable } from "@/components/crew/crew-table";
import { ConfirmModal } from "@/components/modal/confirm-modal";
import { AvatarUpload } from "@/components/profile/avatar-upload";
import { CoverUpload } from "@/components/profile/cover-upload";
import { ShortsGrid } from "@/components/profile/shorts-grid";
import { EditProfileModal } from "@/components/profile/edit-profile-modal";
import { LOCALIZATION } from "@/core/constants/localization";
import { Movie } from "@/core/domain/movie";

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser, showToast } = useAppStore();

  const [deleteMovieId, setDeleteMovieId] = useState<string | null>(null);
  const [deleteCrewId, setDeleteCrewId] = useState<string | null>(null);
  const [isDeletingLocal, setIsDeletingLocal] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"recommend" | "works" | "awards" | "about">("recommend");

  const { data: myMovies = [], isLoading: isMoviesLoading } = useMyMoviesQuery({
    enabled: !!currentUser,
  });

  const { data: contributedMovies = [], isLoading: isContributedLoading } = useMyContributedMoviesQuery({
    enabled: !!currentUser,
  });

  const { data: myCrew = [], isLoading: isCrewLoading } = useMyCrewMembersQuery({
    enabled: !!currentUser,
  });

  const allMyMovies = useMemo(() => {
    const merged = [...myMovies];
    contributedMovies.forEach((cm) => {
      if (!merged.some((m) => m.id === cm.id)) {
        merged.push(cm);
      }
    });
    return merged;
  }, [myMovies, contributedMovies]);

  const deleteMovieMutation = useDeleteMovieMutation();
  const deleteCrewMemberMutation = useDeleteCrewMemberMutation();

  const handleDeleteConfirm = async () => {
    if (deleteMovieId) {
      try {
        setIsDeletingLocal(true);
        await deleteMovieMutation.mutateAsync(deleteMovieId);
        showToast(LOCALIZATION.TOAST.DELETE_MOVIE_SUCCESS, "success");
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : LOCALIZATION.ERRORS.DELETE;
        showToast(errorMessage, "error");
      } finally {
        setIsDeletingLocal(false);
        setDeleteMovieId(null);
      }
    }
  };

  const handleDeleteCrewConfirm = async () => {
    if (deleteCrewId) {
      try {
        setIsDeletingLocal(true);
        await deleteCrewMemberMutation.mutateAsync(deleteCrewId);
        showToast("ลบข้อมูลทีมงานเรียบร้อยแล้ว", "success");
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "เกิดข้อผิดพลาดในการลบข้อมูลทีมงาน";
        showToast(errorMessage, "error");
      } finally {
        setIsDeletingLocal(false);
        setDeleteCrewId(null);
      }
    }
  };

  const formatBirthday = (dateStr?: string | null) => {
    if (!dateStr) return null;
    try {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return new Date(dateStr).toLocaleDateString("th-TH", options);
    } catch {
      return dateStr;
    }
  };

  const getTikTokIcon = () => {
    return (
      <span className="font-bold text-base select-none leading-none w-5 h-5 flex items-center justify-center bg-white text-black rounded-full text-[10px] font-mono">
        d
      </span>
    );
  };

  const handleShareProfile = async () => {
    // Generate a public URL for this user's profile
    const shareUrl = `${window.location.origin}/users/${currentUser?.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `โปรไฟล์ของ ${currentUser?.name} บน Glory`,
          text: `เข้าไปดูผลงานและประวัติของ ${currentUser?.name} ได้ที่นี่`,
          url: shareUrl,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        showToast("คัดลอกลิงก์โปรไฟล์แล้ว นำไปแชร์ต่อได้เลย!", "success");
      } catch {
        showToast("ไม่สามารถคัดลอกลิงก์ได้", "error");
      }
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center p-4 py-28 font-sans">
        <div className="text-center py-20 max-w-md w-full bg-zinc-950/40 border border-zinc-800 p-8 rounded-[2rem] backdrop-blur-md shadow-2xl space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand mx-auto">
            <LockIcon className="text-3xl" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-wide">
              กรุณาเข้าสู่ระบบ
            </h2>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              กรุณาเข้าสู่ระบบ
              เพื่อเข้าถึงข้อมูลโปรไฟล์และรายการประเมินภาพยนตร์ทั้งหมด
            </p>
          </div>
          <Button
            variant="brand"
            onClick={() => router.push("/auth/login")}
            className="w-full py-3"
          >
            เข้าสู่ระบบตอนนี้
          </Button>
        </div>
      </div>
    );
  }

  const hasSocials =
    currentUser.ig ||
    currentUser.facebook ||
    currentUser.youtube ||
    currentUser.tiktok;

  const renderMoviesGrid = (movies: Movie[]) => {
    if (movies.length === 0) {
      return (
        <div className="py-20 text-center text-zinc-500 font-light">
          ไม่พบภาพยนตร์ที่ตรงตามตัวกรอง
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <div key={movie.id} className="relative group">
            <MovieCardThumb movie={movie} />
            {/* Edit / Delete Actions on Hover for owner */}
            {myMovies.some((m) => m.id === movie.id) && (
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(`/movies/${movie.id}/edit`);
                  }}
                  className="w-8 h-8 rounded-full bg-black/60 hover:bg-brand hover:text-black text-white flex items-center justify-center backdrop-blur-sm transition-colors"
                  title="แก้ไข"
                >
                  <EditIcon className="text-sm" />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setDeleteMovieId(movie.id);
                  }}
                  className="w-8 h-8 rounded-full bg-black/60 hover:bg-red-500 hover:text-white text-white flex items-center justify-center backdrop-blur-sm transition-colors"
                  title="ลบ"
                >
                  <DeleteIcon className="text-sm" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-sans selection:bg-brand selection:text-black">
      {/* Hero Banner Section */}
      <div className="relative w-full h-[40vh] md:h-[50vh] min-h-[300px] overflow-hidden bg-zinc-900">
        <div className="absolute inset-0 bg-black/50 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent z-10 pointer-events-none" />
        
        <CoverUpload 
          coverUrl={currentUser.coverUrl} 
          fallbackPhotoUrl={currentUser.photoUrl} 
          isOwner={true} 
        />
      </div>

      <main className="max-w-6xl mx-auto w-full px-4 md:px-12 -mt-24 relative z-20 pb-20 animate-fade-in">
        <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between gap-6">
          
          {/* Profile Info (Left) */}
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            {/* Avatar with Upload */}
            <AvatarUpload
              photoUrl={currentUser.photoUrl}
              name={currentUser.name}
              isOwner={true}
            />

            <div className="text-center md:text-left space-y-2 max-w-xl pb-2 md:pb-4">
              {/* Name */}
              <h1 className="text-3xl md:text-4xl font-extrabold text-brand tracking-tight drop-shadow-sm">
                {currentUser.name}
              </h1>
              
              {/* Roles */}
              <div className="text-zinc-300 text-sm md:text-base font-medium flex flex-wrap items-center justify-center md:justify-start gap-1.5">
                {currentUser.positions && currentUser.positions.length > 0 ? (
                  currentUser.positions.map((pos, idx) => (
                    <span key={idx}>
                      {pos}
                      {idx < (currentUser.positions?.length || 0) - 1 && <span className="mx-1.5 text-zinc-500">•</span>}
                    </span>
                  ))
                ) : (
                  <span>สมาชิกเว็บไซต์ Glory</span>
                )}
              </div>

              {/* Bio snippet */}
              <p className="text-sm text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                {currentUser.bio || "ไม่มีข้อมูลประวัติผู้ใช้งาน"}
                {currentUser.bio && currentUser.bio.length > 100 && (
                  <button onClick={() => setActiveTab("about")} className="text-brand ml-1 font-medium hover:underline">
                    ...เพิ่มเติม
                  </button>
                )}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 justify-center md:justify-start">
                <Button variant="brand" className="rounded-full px-8 font-bold" disabled>
                  ติดตาม
                </Button>
                <Button variant="outline" className="rounded-full px-8 bg-zinc-800/50 border-zinc-700 text-white hover:bg-zinc-700" disabled>
                  สนับสนุน
                </Button>
                <Button 
                  variant="outline" 
                  className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-zinc-800/50 border-zinc-700 text-white hover:bg-zinc-700 hover:text-brand transition-colors"
                  onClick={handleShareProfile}
                  title="แชร์โปรไฟล์"
                >
                  <ShareIcon className="text-[20px]" />
                </Button>
                <Button 
                  variant="outline" 
                  className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-zinc-800/50 border-zinc-700 text-white hover:bg-zinc-700 hover:text-brand transition-colors"
                  onClick={() => setIsEditProfileOpen(true)}
                  title="แก้ไขโปรไฟล์"
                >
                  <SettingsIcon className="text-[20px]" />
                </Button>
              </div>
            </div>
          </div>

          {/* Stats (Right) */}
          <div className="flex gap-8 mt-6 md:mt-24">
             <div className="text-center md:text-right">
               <div className="flex items-center justify-center md:justify-end gap-2 text-zinc-400 text-sm mb-1">
                 <LocalPlayIcon className="text-brand text-sm" />
               </div>
               <div className="text-xl md:text-2xl font-bold text-white">
                 {currentUser.awards?.length || 0}
               </div>
             </div>
             <div className="text-center md:text-right">
               <div className="text-zinc-400 text-sm mb-1">
                 การเข้าชมโปรไฟล์
               </div>
               <div className="text-xl md:text-2xl font-bold text-white flex items-center justify-center md:justify-end gap-2">
                 0
               </div>
             </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-16 border-b border-zinc-800">
          <div className="flex items-center gap-8 overflow-x-auto scrollbar-none px-2">
            {[
              { id: "recommend", label: "แนะนำให้รับชม" },
              { id: "works", label: "ผลงาน" },
              { id: "awards", label: "รางวัล" },
              { id: "about", label: "เกี่ยวกับ" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "recommend" | "works" | "awards" | "about")}
                className={`pb-4 px-1 text-sm md:text-base font-bold tracking-wide border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? "text-brand border-brand"
                    : "text-zinc-400 border-transparent hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="pt-8 min-h-[400px]">
          {activeTab === "recommend" && (
             isMoviesLoading || isContributedLoading ? (
               <div className="flex justify-center py-20">
                 <div className="w-8 h-8 border-4 border-zinc-700 border-t-brand rounded-full animate-spin" />
               </div>
             ) : (
               <div className="space-y-6">
                 {renderMoviesGrid(allMyMovies.slice(0, 4))}
               </div>
             )
          )}

          {activeTab === "works" && (
             <div className="space-y-12">
               <div>
                 <div className="flex items-center justify-between mb-6">
                   <h3 className="text-xl font-bold">ภาพยนตร์ของฉัน ({allMyMovies.length})</h3>
                 </div>
                 {isMoviesLoading || isContributedLoading ? (
                   <div className="flex justify-center py-10">
                     <div className="w-8 h-8 border-4 border-zinc-700 border-t-brand rounded-full animate-spin" />
                   </div>
                 ) : (
                   renderMoviesGrid(allMyMovies)
                 )}
               </div>

               {/* Shorts / TikTok style Section */}
               <div className="pt-4">
                 <div className="flex items-center justify-between mb-6">
                   <h3 className="text-xl font-bold flex items-center gap-2">
                     <span className="w-5 h-5 flex items-center justify-center bg-white text-black rounded-full text-[10px] font-bold font-mono">
                       d
                     </span>
                     คลิปสั้น
                   </h3>
                 </div>
                 <ShortsGrid movies={allMyMovies} />
               </div>

               {/* Crew Members (Moved to bottom) */}
               <div className="pt-8 border-t border-zinc-800/50">
                 <div className="flex items-center justify-between mb-6">
                   <h3 className="text-xl font-bold text-zinc-400">ทีมงานที่ฉันเพิ่ม ({myCrew.length})</h3>
                 </div>
                 {isCrewLoading ? (
                   <div className="flex justify-center py-10">
                     <div className="w-8 h-8 border-4 border-zinc-700 border-t-brand rounded-full animate-spin" />
                   </div>
                 ) : (
                   <div className="opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                     <CrewTable
                       crew={myCrew}
                       onEdit={(member) => router.push(`/crew/${member.id}/edit`)}
                       onDelete={setDeleteCrewId}
                     />
                   </div>
                 )}
               </div>
             </div>
          )}

          {activeTab === "awards" && (
            <div className="max-w-3xl space-y-6">
              {currentUser.awards && currentUser.awards.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentUser.awards.map((awd, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 items-center p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-brand/40 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center text-brand shrink-0">
                        <EmojiEventsIcon className="text-2xl" />
                      </div>
                      <span className="text-sm font-medium text-zinc-200">
                        {awd}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-zinc-500 font-light">
                  ไม่มีประวัติรางวัลเกียรติยศ
                </div>
              )}
            </div>
          )}

          {activeTab === "about" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
              {/* Left Col: Bio & Details */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <PersonIcon className="text-brand" />
                    รายละเอียด
                  </h3>
                  <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
                    <p className="text-sm text-zinc-300 font-light leading-loose whitespace-pre-line">
                      {currentUser.bio || "ไม่มีข้อมูลประวัติผู้ใช้งาน"}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <WorkIcon className="text-brand text-xl" />
                    ตำแหน่งประจำ
                  </h3>
                  {currentUser.positions && currentUser.positions.length > 0 ? (
                    <div className="flex flex-wrap gap-2.5">
                      {currentUser.positions.map((pos, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl text-sm font-medium"
                        >
                          {pos}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-500 font-light italic">
                      ไม่ได้ระบุตำแหน่งประจำตัว
                    </p>
                  )}
                </div>
              </div>

              {/* Right Col: Contact & Socials */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <EmailIcon className="text-brand" />
                    ช่องทางการติดต่อ
                  </h3>
                  <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                      <span className="text-zinc-500 text-sm">อีเมล</span>
                      <span className="text-zinc-200 text-sm font-medium">{currentUser.email}</span>
                    </div>
                    {currentUser.birthday && (
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500 text-sm flex items-center gap-2">วันเกิด</span>
                        <span className="text-zinc-200 text-sm font-medium">{formatBirthday(currentUser.birthday)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <InstagramIcon className="text-brand" />
                    โซเชียลมีเดีย
                  </h3>
                  {hasSocials ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentUser.ig && (
                        <a href={`https://instagram.com/${currentUser.ig}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-zinc-900/40 border border-zinc-800 rounded-xl hover:border-pink-500/50 transition-colors">
                          <InstagramIcon className="text-pink-500" />
                          <span className="text-sm text-zinc-300 truncate">{currentUser.ig}</span>
                        </a>
                      )}
                      {currentUser.facebook && (
                        <a href={currentUser.facebook.startsWith("http") ? currentUser.facebook : `https://${currentUser.facebook}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-zinc-900/40 border border-zinc-800 rounded-xl hover:border-blue-500/50 transition-colors">
                          <FacebookIcon className="text-blue-500" />
                          <span className="text-sm text-zinc-300 truncate">Facebook</span>
                        </a>
                      )}
                      {currentUser.youtube && (
                        <a href={currentUser.youtube.startsWith("http") ? currentUser.youtube : `https://${currentUser.youtube}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-zinc-900/40 border border-zinc-800 rounded-xl hover:border-red-500/50 transition-colors">
                          <YouTubeIcon className="text-red-500" />
                          <span className="text-sm text-zinc-300 truncate">YouTube</span>
                        </a>
                      )}
                      {currentUser.tiktok && (
                        <a href={currentUser.tiktok.startsWith("http") ? currentUser.tiktok : `https://${currentUser.tiktok}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-zinc-900/40 border border-zinc-800 rounded-xl hover:border-white/50 transition-colors">
                          {getTikTokIcon()}
                          <span className="text-sm text-zinc-300 truncate">TikTok</span>
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-500 font-light italic">
                      ไม่ได้ระบุลิงก์โซเชียลมีเดีย
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <ConfirmModal
        isOpen={deleteMovieId !== null}
        title={LOCALIZATION.CONFIRM.DELETE_MOVIE_TITLE}
        message={LOCALIZATION.CONFIRM.DELETE_MOVIE_MSG}
        variant="danger"
        confirmText={LOCALIZATION.CONFIRM.DELETE_MOVIE_BTN}
        cancelText={LOCALIZATION.CONFIRM.CANCEL}
        onClose={() => setDeleteMovieId(null)}
        onConfirm={handleDeleteConfirm}
      />

      <ConfirmModal
        isOpen={deleteCrewId !== null}
        title="ยืนยันการลบรายชื่อทีมงาน"
        message="คุณแน่ใจหรือไม่ว่าต้องการลบรายชื่อทีมงานคนนี้ออกจากระบบ? การกระทำนี้ไม่สามารถย้อนกลับได้"
        variant="danger"
        confirmText="ลบรายชื่อทีมงาน"
        cancelText={LOCALIZATION.CONFIRM.CANCEL}
        onClose={() => setDeleteCrewId(null)}
        onConfirm={handleDeleteCrewConfirm}
      />

      {isDeletingLocal && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-zinc-800 border-t-brand rounded-full animate-spin" />
            <div className="text-center">
              <h3 className="text-lg font-bold text-white">{LOCALIZATION.LOADING.DELETE_MOVIE}</h3>
            </div>
          </div>
        </div>
      )}

      {currentUser && (
        <EditProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
