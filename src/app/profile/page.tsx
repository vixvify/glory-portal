"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/use-store";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import WorkIcon from "@mui/icons-material/Work";
import CakeIcon from "@mui/icons-material/Cake";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import LockIcon from "@mui/icons-material/Lock";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser } = useAppStore();

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

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black text-white flex items-center justify-center p-4 py-28 font-sans">
        <div className="text-center py-20 max-w-md w-full bg-zinc-950/40 border border-zinc-800 p-8 rounded-[2rem] backdrop-blur-md shadow-2xl space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand mx-auto">
            <LockIcon className="text-3xl" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-wide">
              กรุณาเข้าสู่ระบบ
            </h2>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              กรุณาเข้าสู่ระบบด้วยบัญชีคนทำหนังของคุณ
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

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black text-white font-sans pb-20 selection:bg-brand selection:text-black">
      <main className="max-w-5xl mx-auto w-full px-6 md:px-16 pt-28 space-y-8 animate-fade-in">
        <div className="space-y-2">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-brand cursor-pointer transition-colors bg-transparent border-none focus:outline-none"
          >
            <ArrowBackIcon className="text-sm" /> ย้อนกลับ
          </button>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            โปรไฟล์ของฉัน
          </h1>
        </div>

        <div className="bg-zinc-950/40 backdrop-blur-xl rounded-[2rem] border border-zinc-800 shadow-2xl overflow-hidden">
          <div className="w-full h-36 bg-gradient-to-r from-brand/20 via-zinc-900 to-zinc-950/80 border-b border-zinc-900/60 relative" />

          <div className="px-8 pb-8 pt-0 relative flex flex-col md:flex-row md:items-end gap-6 -mt-16 border-b border-zinc-900/50">
            <div className="relative w-32 h-32 rounded-full p-[3px] bg-gradient-to-tr from-brand to-zinc-800 shadow-2xl overflow-hidden shrink-0 aspect-square">
              <div className="w-full h-full rounded-full bg-zinc-900 overflow-hidden flex items-center justify-center">
                {currentUser.photoUrl ? (
                  <img
                    src={currentUser.photoUrl}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <PersonIcon className="text-zinc-600 text-7xl" />
                )}
              </div>
            </div>

            <div className="space-y-2.5 pb-2">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  {currentUser.name}
                </h2>
                <span className="px-3 py-1 bg-brand/10 border border-brand/20 text-brand text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                  {currentUser.role === "admin" ? "ผู้ดูแลระบบ" : "สมาชิกเว็บ"}
                </span>
              </div>

              {currentUser.motto && (
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 italic font-light">
                  <FormatQuoteIcon className="text-sm text-brand rotate-180" />
                  <span>{currentUser.motto}</span>
                  <FormatQuoteIcon className="text-sm text-brand" />
                </div>
              )}
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <div className="bg-zinc-900/20 border border-zinc-900/40 rounded-3xl p-6 space-y-4">
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest font-mono border-b border-zinc-900/50 pb-2">
                  เกี่ยวกับตัวฉัน (Bio)
                </p>
                <p className="text-xs text-zinc-300 font-light leading-relaxed whitespace-pre-line">
                  {currentUser.bio || "ไม่มีข้อมูลประวัติผู้ใช้งาน"}
                </p>
              </div>

              <div className="bg-zinc-900/20 border border-zinc-900/40 rounded-3xl p-6 space-y-4">
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest font-mono border-b border-zinc-900/50 pb-2">
                  ข้อมูลการติดต่อ & วันเกิด
                </p>
                <div className="space-y-3.5 pt-1">
                  <div className="flex items-center gap-3 text-xs">
                    <EmailIcon className="text-zinc-500 text-sm" />
                    <div>
                      <p className="text-zinc-500 text-[10px]">ที่อยู่อีเมล</p>
                      <p className="text-zinc-300 font-medium">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>

                  {currentUser.birthday && (
                    <div className="flex items-center gap-3 text-xs">
                      <CakeIcon className="text-zinc-500 text-sm" />
                      <div>
                        <p className="text-zinc-500 text-[10px]">วันเกิด</p>
                        <p className="text-zinc-300 font-medium">
                          {formatBirthday(currentUser.birthday)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-zinc-900/20 border border-zinc-900/40 rounded-3xl p-6 space-y-4">
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest font-mono border-b border-zinc-900/50 pb-2">
                  โซเชียลมีเดีย
                </p>

                {hasSocials ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {currentUser.ig && (
                      <a
                        href={`https://instagram.com/${currentUser.ig}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 bg-zinc-950/40 border border-zinc-900 hover:border-brand/30 hover:bg-zinc-900/30 rounded-xl text-xs text-zinc-300 hover:text-white transition-all cursor-pointer shadow-sm"
                      >
                        <InstagramIcon className="text-sm text-pink-500" />
                        <span className="truncate">{currentUser.ig}</span>
                      </a>
                    )}

                    {currentUser.facebook && (
                      <a
                        href={
                          currentUser.facebook.startsWith("http")
                            ? currentUser.facebook
                            : `https://${currentUser.facebook}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 bg-zinc-950/40 border border-zinc-900 hover:border-brand/30 hover:bg-zinc-900/30 rounded-xl text-xs text-zinc-300 hover:text-white transition-all cursor-pointer shadow-sm"
                      >
                        <FacebookIcon className="text-sm text-blue-500" />
                        <span className="truncate">Facebook</span>
                      </a>
                    )}

                    {currentUser.youtube && (
                      <a
                        href={
                          currentUser.youtube.startsWith("http")
                            ? currentUser.youtube
                            : `https://${currentUser.youtube}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 bg-zinc-950/40 border border-zinc-900 hover:border-brand/30 hover:bg-zinc-900/30 rounded-xl text-xs text-zinc-300 hover:text-white transition-all cursor-pointer shadow-sm"
                      >
                        <YouTubeIcon className="text-sm text-red-500" />
                        <span className="truncate">YouTube</span>
                      </a>
                    )}

                    {currentUser.tiktok && (
                      <a
                        href={
                          currentUser.tiktok.startsWith("http")
                            ? currentUser.tiktok
                            : `https://${currentUser.tiktok}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 bg-zinc-950/40 border border-zinc-900 hover:border-brand/30 hover:bg-zinc-900/30 rounded-xl text-xs text-zinc-300 hover:text-white transition-all cursor-pointer shadow-sm"
                      >
                        {getTikTokIcon()}
                        <span className="truncate">TikTok</span>
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 font-light italic">
                    ไม่ได้ระบุลิงก์โซเชียลมีเดีย
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-zinc-900/25 border border-zinc-800/40 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-zinc-900/50 pb-2">
                  <WorkIcon className="text-xs text-brand" />
                  <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
                    ตำแหน่งประจำ (Positions)
                  </p>
                </div>

                {currentUser.positions && currentUser.positions.length > 0 ? (
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    {currentUser.positions.map((pos, idx) => (
                      <span
                        key={idx}
                        className="px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl text-xs font-semibold hover:border-brand/40 hover:text-white transition-colors cursor-default shadow-sm"
                      >
                        {pos}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 font-light italic">
                    ไม่ได้ระบุตำแหน่งประจำตัว
                  </p>
                )}
              </div>

              <div className="bg-zinc-900/25 border border-zinc-800/40 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-zinc-900/50 pb-2">
                  <EmojiEventsIcon className="text-xs text-brand" />
                  <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
                    รางวัลเกียรติยศ (Awards)
                  </p>
                </div>

                {currentUser.awards && currentUser.awards.length > 0 ? (
                  <div className="space-y-3 pt-1">
                    {currentUser.awards.map((awd, idx) => (
                      <div
                        key={idx}
                        className="flex gap-3 items-center p-3 bg-zinc-950/40 border border-zinc-900 hover:border-zinc-800 rounded-xl shadow-sm transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shrink-0 group-hover:scale-105 transition-transform">
                          <EmojiEventsIcon className="text-sm" />
                        </div>
                        <span className="text-xs font-medium text-zinc-200">
                          {awd}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 font-light italic">
                    ไม่มีประวัติรางวัลเกียรติยศ
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
