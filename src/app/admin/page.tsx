"use client";

import { useMemo } from "react";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CategoryIcon from "@mui/icons-material/Category";
import MovieIcon from "@mui/icons-material/Movie";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PeopleIcon from "@mui/icons-material/People";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import Loading from "@/app/loading";
import { StatsCard } from "@/components/ui/stats-card";
import { useAdminStatsQuery } from "@/hooks/use-admin";

export default function AdminPage() {
  const { data: stats, isLoading: isStatsLoading } = useAdminStatsQuery();

  const isInitialLoading = isStatsLoading;

  if (isInitialLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-brand selection:text-black pb-20">
      <main className="max-w-7xl mx-auto w-full px-6 md:px-16 pt-28 space-y-10 animate-fade-in">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Link
              href="/"
              className="hover:text-brand transition-colors flex items-center gap-1"
            >
              <ArrowBackIcon className="text-sm" /> กลับหน้าหลัก
            </Link>
            <span>/</span>
            <span className="text-zinc-300"> Admin Dashboard</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            ระบบจัดการหลังบ้าน
          </h1>
          <p className="text-sm text-zinc-400 font-light">
            แดชบอร์ดจัดการข้อมูลภาพยนตร์สั้นและทีมงานของ Thai-Shortflix
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <StatsCard
            title="จำนวนเรื่องทั้งหมด"
            value={stats?.totalMovies ?? 0}
            icon={<MovieIcon className="text-2xl" />}
          />
          <StatsCard
            title="หมวดหมู่ภาพยนตร์"
            value={stats?.totalCategories ?? 0}
            icon={<CategoryIcon className="text-2xl" />}
            iconClassName="bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          />
          <StatsCard
            title="ยอดเข้าชมรวม"
            value={(stats?.totalViews ?? 0).toLocaleString()}
            icon={<VisibilityIcon className="text-2xl" />}
            iconClassName="bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
          />
          <StatsCard
            title="ทีมงานและนักแสดง"
            value={stats?.totalCrew ?? 0}
            icon={<PeopleIcon className="text-2xl" />}
            iconClassName="bg-violet-500/10 border-violet-500/20 text-violet-400"
          />
        </div>

        <div className="space-y-4 pt-6 border-t border-zinc-900">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <SettingsIcon className="text-brand text-lg" /> ระบบจัดการข้อมูล
            (Management Hub)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-900/30 border border-zinc-800/60 p-6 md:p-8 rounded-3xl backdrop-blur-sm flex flex-col justify-between hover:border-brand/45 hover:bg-zinc-900/40 transition-all duration-300 group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                  <MovieIcon className="text-2xl" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold group-hover:text-brand transition-colors">
                    จัดการข้อมูลภาพยนตร์ (Movie Management)
                  </h3>
                  <p className="text-sm text-zinc-450 leading-relaxed font-light">
                    ดูรายชื่อ ค้นหาภาพยนตร์สั้น กรองข้อมูลตามหมวดหมู่
                    หรือจัดเรียงหนังทั้งหมด และลบข้อมูลภาพยนตร์
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <Link href="/admin/movies" className="flex-1">
                  <button className="w-full py-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:border-zinc-700 text-sm font-semibold rounded-xl transition-all cursor-pointer">
                    ดูภาพยนตร์ทั้งหมด
                  </button>
                </Link>
                <Link href="/create/movie" className="flex-shrink-0">
                  <button
                    className="p-3 bg-brand/10 hover:bg-brand/20 border border-brand/20 text-brand rounded-xl transition-all cursor-pointer"
                    title="เพิ่มภาพยนตร์ใหม่"
                  >
                    <AddIcon className="text-xl" />
                  </button>
                </Link>
              </div>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800/60 p-6 md:p-8 rounded-3xl backdrop-blur-sm flex flex-col justify-between hover:border-brand/45 hover:bg-zinc-900/40 transition-all duration-300 group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                  <PeopleIcon className="text-2xl" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold group-hover:text-violet-400 transition-colors">
                    จัดการข้อมูลทีมงาน (Crew Management)
                  </h3>
                  <p className="text-sm text-zinc-450 leading-relaxed font-light">
                    ดูทำเนียบรายชื่อ ค้นหาข้อมูลผู้กำกับ ทีมงานสร้าง และนักแสดง
                    ตลอดจนลบประวัติหรือผลงานผลผลิต
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <Link href="/admin/crew" className="flex-1">
                  <button className="w-full py-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:border-zinc-700 text-sm font-semibold rounded-xl transition-all cursor-pointer">
                    ดูรายชื่อทีมงานทั้งหมด
                  </button>
                </Link>
                <Link href="/create/crew" className="flex-shrink-0">
                  <button
                    className="p-3 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 text-violet-400 rounded-xl transition-all cursor-pointer"
                    title="เพิ่มทีมงานใหม่"
                  >
                    <AddIcon className="text-xl" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
