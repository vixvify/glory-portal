"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@/components/ui/button";
import { CATEGORY_TITLE_MAPPING } from "@/core/constants/categories";
import { useAppStore } from "@/store/use-store";
import { useCategoriesQuery } from "@/hooks/use-master-data";
import { useLogoutMutation } from "@/hooks/use-auth";

export default function Navbar() {
  const router = useRouter();
  const { searchQuery, setSearchQuery, currentUser } = useAppStore();

  const { data: categories = [] } = useCategoriesQuery();
  const logoutMutation = useLogoutMutation();

  const onSignOut = () => {
    logoutMutation.mutate();
  };

  const onSignInClick = () => {
    router.push("/auth/login");
  };

  const handleNavClick = (category: string | null) => {
    if (category === null) {
      router.push("/");
    } else {
      router.push(`/movies/category/${category}`);
    }
    setShowMoviesMenu(false);
    setSearchQuery("");
  };

  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMoviesMenu, setShowMoviesMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".relative")) {
        setShowProfileMenu(false);
        setShowMoviesMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (pathname.startsWith("/watch")) {
    return null;
  }

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-16 py-4 transition-all duration-500 ease-out ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-zinc-800/40 shadow-xl shadow-black/20"
          : "bg-transparent"
      }`}
      style={{ fontFamily: "var(--font-kanit), Arial, Helvetica, sans-serif" }}
    >
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className="text-3xl font-extrabold tracking-tighter text-brand cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
          style={{ textShadow: `0 0 10px rgba(var(--theme-primary-rgb),0.3)` }}
        >
          GLORY
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm text-zinc-300">
          <Link
            href="/"
            className="cursor-pointer transition-colors duration-300 hover:text-white"
          >
            หน้าแรก
          </Link>

          <div className="relative">
            <button
              onClick={() => setShowMoviesMenu(!showMoviesMenu)}
              className="flex items-center gap-1 cursor-pointer transition-colors duration-305 hover:text-white focus:outline-none text-white font-semibold"
            >
              ภาพยนตร์
              <div
                className={`w-0 h-0 border-l-4 border-r-4 border-t-4 border-t-zinc-400 border-l-transparent border-r-transparent transition-transform duration-300 ${showMoviesMenu ? "rotate-180 border-t-white" : ""}`}
              />
            </button>

            {showMoviesMenu && (
              <div className="absolute left-0 mt-3 w-56 bg-card/95 backdrop-blur-md rounded-xl border border-zinc-850 p-2 shadow-2xl animate-fade-in z-50">
                <div className="px-3 py-1.5 border-b border-zinc-800/80 mb-1">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
                    หมวดหมู่
                  </p>
                </div>
                <div className="max-h-60 overflow-y-auto pr-1 no-scrollbar space-y-0.5">
                  <button
                    onClick={() => handleNavClick(null)}
                    className="w-full text-left px-3 py-2 text-xs rounded-lg cursor-pointer transition-colors text-zinc-300 hover:bg-zinc-800/40 hover:text-white"
                  >
                    หนังทั้งหมด
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        handleNavClick(cat.name);
                      }}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg cursor-pointer transition-colors text-zinc-300 hover:bg-zinc-800/40 hover:text-white"
                    >
                      {CATEGORY_TITLE_MAPPING[cat.name] || cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="/movies/favorites" className="cursor-pointer transition-colors duration-300 text-zinc-300 hover:text-white">
            รายการของฉัน
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div
          className={`flex items-center gap-2 px-2 py-1 rounded border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isSearchExpanded
              ? "w-40 md:w-64 bg-black/60 border-zinc-600 scale-100 opacity-100"
              : "w-8 bg-transparent border-transparent"
          }`}
        >
          <button
            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
            className="text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <SearchIcon className="text-xl" />
          </button>
          {isSearchExpanded && (
            <>
              <input
                type="text"
                placeholder="วันนี้อยากดูอะไร..."
                value={searchQuery}
                onChange={(e) => {
                  if (pathname !== "/") {
                    router.push("/");
                  }
                  setSearchQuery(e.target.value);
                }}
                className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-zinc-500"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  <CloseIcon className="text-sm" />
                </button>
              )}
            </>
          )}
        </div>

        {currentUser ? (
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-1.5 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white font-bold text-sm shadow-md shadow-brand/20">
                {(currentUser.name || currentUser.email || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-t-zinc-400 border-l-transparent border-r-transparent group-hover:border-t-white transition-colors" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-48 bg-card rounded-xl border border-zinc-800 p-2 shadow-xl animate-fade-in z-50">
                <div className="px-3 py-2 border-b border-zinc-800/80 mb-1">
                  <p className="text-xs text-white font-semibold truncate">
                    {currentUser.name || currentUser.email}
                  </p>
                  <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                    {currentUser.email}
                  </p>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full block text-left px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-lg cursor-pointer transition-colors mb-1"
                >
                  โปรไฟล์ของฉัน
                </Link>
                <Link
                  href="/create/movie"
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full block text-left px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-lg cursor-pointer transition-colors mb-1"
                >
                  เพิ่มภาพยนตร์
                </Link>
                <Link
                  href="/create/crew"
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full block text-left px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-lg cursor-pointer transition-colors mb-1"
                >
                  เพิ่มทีมงาน
                </Link>
                <button
                  onClick={() => {
                    onSignOut();
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-zinc-800/60 rounded-lg cursor-pointer transition-colors"
                >
                  ออกจากระบบ
                </button>
              </div>
            )}
          </div>
        ) : (
          <Button onClick={onSignInClick} size="sm">
            เข้าสู่ระบบ
          </Button>
        )}
      </div>
    </nav>
  );
}
